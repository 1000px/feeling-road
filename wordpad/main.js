const { app, BrowserWindow } = require('electron');
const path = require('path');
const url = require('url');

function createWindow() {
    // 创建浏览器窗口
    let win = new BrowserWindow({width: 1366, height: 600});

    // 然后加载应用的index.html
    // win.loadURL('http://localhost:8080');
    // win.loadFile('output/index.html');
    console.log(100, process.env.NODE_ENV);
    win.loadURL('http://localhost:8080');
    // if(!process.env.NODE_ENV) {
        
    // } else {
    //     win.loadURL(url.format({
    //         pathname: path.join(__dirname, './output/index.html'),
    //         protocal: 'file:',
    //         slashes: true
    //     }))
    // }
    // 打开开发者工具
    win.webContents.openDevTools();
}

app.on('ready', createWindow);

app.on('closed', () => {
    win = null;
});

app.on('window-all-closed', () => {
    if(process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if(win === null) {
        createWindow();
    }
});

