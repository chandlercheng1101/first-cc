const { app, BrowserWindow, Tray, Menu, Notification, ipcMain } = require('electron');
const path = require('path');

let mainWindow;
let tray;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 320,
    height: 420,
    resizable: false,
    frame: false,
    center: true,
    alwaysOnTop: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  });

  mainWindow.loadFile('index.html');

  tray = new Tray(path.join(__dirname, 'icon.png'));
  const contextMenu = Menu.buildFromTemplate([
    { label: '显示', click: () => mainWindow.show() },
    { type: 'separator' },
    { label: '退出', click: () => app.quit() }
  ]);
  tray.setToolTip('番茄钟');
  tray.setContextMenu(contextMenu);
  tray.on('click', () => mainWindow.show());
}

app.whenReady().then(createWindow);

ipcMain.on('close-window', () => {
  mainWindow.close();
});

ipcMain.on('show-notification', (event, { title, body }) => {
  if (Notification.isSupported()) {
    new Notification({ title, body }).show();
  }
});