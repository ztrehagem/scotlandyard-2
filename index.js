const { app, BrowserWindow } = require('electron');

let mainWindow = null;

app.on('window-all-closed', () => app.quit());

app.on('ready', () => {
  mainWindow = new BrowserWindow({width: 800, height: 600});
  mainWindow.on('closed', () => mainWindow = null);
  mainWindow.loadURL('file://' + __dirname + '/browser-dest/index.html');
});
