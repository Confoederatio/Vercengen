//Import modules
global.child_process = require("child_process");
global.electron = require("electron");
global.fs = require("fs");
global.path = require("path");

//Initialise functions
{
  function initialiseGlobal () {
    //Declare global variables
    window.main = {
      hierarchies: {}
    };
  }

  function trackPerformance () {
    //Declare local instance variables
    var { ipcRenderer } = require('electron');

    var frame_count = 0;
    var last_time = performance.now();

    function trackFPS() {
      frame_count++;
      var now = performance.now();

      //Report back to the main process once per second
      if (now - last_time >= 1000) {
        ipcRenderer.send('update-fps', frame_count);
        frame_count = 0;
        last_time = now;
      }

      //Keep the loop going
      requestAnimationFrame(trackFPS);
    }

    //Start the counter
    trackFPS();
  }
}

//Startup process
{
  //Load config
  {
    global.load_order = {
      load_directories: [
        "UF"
      ],
      load_files: []
    };

    loadAllScripts();
  }

  initialiseGlobal();
  trackPerformance();

  var initialise_ve_loop = setInterval(function(){
    try {
      ve.initialise();
      clearInterval(initialise_ve_loop);

      initialiseVercengenWindowsDemo();
    } catch (e) {}
  }, 100);
}