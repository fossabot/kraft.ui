//
// @@script: backgrounds.js
// @@description:
// @@version:
// @@author: Loouis Low
// @@copyright: dogsbark Inc
//

chrome.app.runtime.onLaunched.addListener(function(launchData) {
  chrome.app.window.create('index.html', {
    id: "fileWin",
    bounds: {
      width: 800,
      height: 500
    }
  }, function(win) {
    win.contentWindow.launchData = launchData;
  });
});
