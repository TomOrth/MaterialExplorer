const electron = require('electron');
// Module to control application life.
const app = electron.app;
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow;

const ipcMain = electron.ipcMain;
// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;
let optionsWindow;

function createWindow() {
	// Create the window
	mainWindow = new BrowserWindow({
		width: 800,
		height: 600
	});

	// and load the index.html of the app.
	mainWindow.loadURL(`file://${ __dirname}/index.html`);
        mainWindow.webContents.openDevTools();
	// Emitted when the window is closed.
	mainWindow.on('closed', () => {
		// Dereference the window object, usually you would store windows
		// in an array if your app supports multi windows, this is the time
		// when you should delete the corresponding element.
		mainWindow = null;
	});
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', () => {
	// On macOS it is common for applications and their menu bar
	// to stay active until the user quits explicitly with Cmd + Q
	if (process.platform !== 'darwin') {
		app.quit();
	}
});

app.on('activate', () => {
	// On macOS it's common to re-create a window in the app when the
	// dock icon is clicked and there are no other windows open.
	if (mainWindow === null) {
		createWindow();
	}

});
ipcMain.on('openOptions', (event, arg) => {
	//setting dialog
	optionsWindow = new BrowserWindow({
		width: 270,
		height: 274
	});
	// Load options page
	optionsWindow.loadURL(`file://${ __dirname}/options.html`);

	optionsWindow.on('closed', () => {
		// Dereference the window object, usually you would store windows
		// in an array if your app supports multi windows, this is the time
		// when you should delete the corresponding element.
		optionsWindow = null;
	});
});
ipcMain.on('closeOptions', (event, arg) => {
    // Close options window
    optionsWindow.close();
    // Fire up ipc
    mainWindow.webContents.send("update");
});
