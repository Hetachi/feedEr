const { app, BrowserWindow } = require('electron')

function createWindow () {
  // Create the browser window.
  win = new BrowserWindow({
    useContentSize: true,
    autoHideMenuBar: true,
    minWidth: 800,
    minHeight: 600,
    title: "FeedEr",
    frame: false,
    transparent: true,
    resizable: false
   })

  // and load the index.html of the app.
  win.loadFile('index.html')
}

app.on('ready', createWindow)
