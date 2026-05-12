const WORK_TIME = 25 * 60;
const SHORT_BREAK = 5 * 60;
const LONG_BREAK = 15 * 60;
const POMODOROS_BEFORE_LONG_BREAK = 4;

const modes = {
  WORK: '工作',
  SHORT_BREAK: '短休息',
  LONG_BREAK: '长休息'
};

let state = {
  mode: modes.WORK,
  timeLeft: WORK_TIME,
  isRunning: false,
  pomodoroCount: 1,
  intervalId: null
};

const timeDisplay = document.getElementById('timeDisplay');
const progressRing = document.getElementById('progressRing');
const modeLabel = document.getElementById('modeLabel');
const startBtn = document.getElementById('startBtn');
const resetBtn = document.getElementById('resetBtn');
const pomodoroCountEl = document.getElementById('pomodoroCount');
const closeBtn = document.getElementById('closeBtn');

const circumference = 2 * Math.PI * 90;
progressRing.style.strokeDasharray = circumference;

function getTotalTime() {
  switch (state.mode) {
    case modes.WORK: return WORK_TIME;
    case modes.SHORT_BREAK: return SHORT_BREAK;
    case modes.LONG_BREAK: return LONG_BREAK;
    default: return WORK_TIME;
  }
}

function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

function updateDisplay() {
  timeDisplay.textContent = formatTime(state.timeLeft);
  const progress = (getTotalTime() - state.timeLeft) / getTotalTime();
  progressRing.style.strokeDashoffset = circumference * (1 - progress);
  modeLabel.textContent = state.mode;
  pomodoroCountEl.textContent = state.pomodoroCount;
}

function startTimer() {
  if (state.isRunning) return;
  state.isRunning = true;
  startBtn.textContent = '暂停';
  startBtn.classList.add('running');

  state.intervalId = setInterval(() => {
    state.timeLeft--;
    updateDisplay();

    if (state.timeLeft <= 0) {
      clearInterval(state.intervalId);
      handleTimerComplete();
    }
  }, 1000);
}

function pauseTimer() {
  state.isRunning = false;
  startBtn.textContent = '开始';
  startBtn.classList.remove('running');
  if (state.intervalId) {
    clearInterval(state.intervalId);
    state.intervalId = null;
  }
}

function resetTimer() {
  pauseTimer();
  state.timeLeft = getTotalTime();
  updateDisplay();
}

function handleTimerComplete() {
  const completedMode = state.mode;

  if (completedMode === modes.WORK) {
    if (state.pomodoroCount % POMODOROS_BEFORE_LONG_BREAK === 0) {
      state.mode = modes.LONG_BREAK;
      state.timeLeft = LONG_BREAK;
    } else {
      state.mode = modes.SHORT_BREAK;
      state.timeLeft = SHORT_BREAK;
    }
  } else {
    state.mode = modes.WORK;
    state.timeLeft = WORK_TIME;
    state.pomodoroCount++;
  }

  state.isRunning = false;
  startBtn.textContent = '开始';
  startBtn.classList.remove('running');
  updateDisplay();

  const title = completedMode === modes.WORK ? '工作完成！' : '休息结束！';
  const body = completedMode === modes.WORK ? '该休息一下了' : '继续工作吧';
  window.electronAPI.showNotification(title, body);
}

startBtn.addEventListener('click', () => {
  if (state.isRunning) {
    pauseTimer();
  } else {
    startTimer();
  }
});

resetBtn.addEventListener('click', resetTimer);
closeBtn.addEventListener('click', () => {
  window.electronAPI.closeWindow();
});

updateDisplay();