var { app, BrowserWindow, dialog, ipcMain, session } = require("electron");
var path = require("path");
var { performance } = require("perf_hooks");

var latest_fps = 0;
var vercengen_version = "0.6b";
var title_update_interval;
var win;

//Initialise functions
{
  var createWindow = () => {
    //Declare local instance variables
    win = new BrowserWindow({
      width: 3840,
      height: 2160,
      webPreferences: {
        contextIsolation: false,
        enableRemoteModule: false,
        nodeIntegration: true,
        webSecurity: false
      },

      icon: path.join(__dirname, `gfx/logo.png`)
    });

    //Load file; open Inspect Element
    win.loadFile("index.html");
    win.webContents.openDevTools();
    win.setMenuBarVisibility(false);

    //Listen for FPS updates from the renderer process
    ipcMain.on("update-fps", (event, fps) => {
      latest_fps = fps;
    });

    //Update the title every second with the latest data
    title_update_interval = setInterval(function () {
      var memory_usage = process.memoryUsage();

      var heap_used_mb = (memory_usage.heapUsed/1024/1024).toFixed(2);
      var rss_mb = (memory_usage.rss/1024/1024).toFixed(2);
      var title_string = `Vercengen ${vercengen_version} - FPS: ${latest_fps} | RAM: RSS ${rss_mb}MB/Heap ${heap_used_mb}MB`;

      win.setTitle(title_string);
    }, 1000);

    //Get the default session
    try {
      var default_session = session.defaultSession;

      //Set up CORS settings for the default session
      default_session.webRequest.onHeadersReceived((details, callback) => {
        callback({
          responseHeaders: {
            ...details.responseHeaders,
            'Access-Control-Allow-Origin': ['*'],
            'Access-Control-Allow-Methods': ['GET', 'POST', 'OPTIONS', 'PUT', 'PATCH', 'DELETE'],
            'Access-Control-Allow-Headers': ['Content-Type', 'Authorization']
          }
        });
      });
    } catch (e) {
      console.warn(e);
    }
  };

  function handleOpenFolder (arg0_event, arg1_starting_path) {
    //Convert from parameters
    var event = arg0_event;
    var starting_path = arg1_starting_path;

    //Declare local instance variables
    var actual_options = {
      title: "Open Folder",
      defaultPath: starting_path,
      properties: ["openDirectory"]
    };

    //Show the dialog and wait for the user's choice
    var result = dialog.showOpenDialogSync(actual_options);

    //Result is an array of paths, or undefined if the user cancelled
    if (result && result.length > 0)
      //Return statement
      return result[0]; //Return the first selected path
    return undefined;
  }
}

//App handling
{
  //Launch app when ready
  app.whenReady().then(() => {

    //Create the window and instantiate it
    createWindow();

    app.on("activate", () => {
      if (BrowserWindow.getAllWindows().length == 0) createWindow();
    });
    app.on("ready", () => {
      Menu.setApplicationMenu(null);
    });
  });

  //Window lifecycle defaults
  app.on("window-all-closed", () => {
    if (process.platform != "darwin") app.quit();
  });
}

//Bindings handler
{
  ipcMain.handle("dialog:openFolder", handleOpenFolder);
}