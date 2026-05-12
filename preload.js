const { contextBridge, ipcRenderer } = require('electron');
contextBridge.exposeInMainWorld('electronAPI', {
  closeWindow: () => ipcRenderer.send('close-window'),
  showNotification: (title, body) => ipcRenderer.send('show-notification', { title, body })
});