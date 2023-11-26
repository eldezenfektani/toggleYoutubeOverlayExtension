
document.addEventListener('DOMContentLoaded', function () {
  const toggleOverlaySwitch = document.getElementById('toggleOverlay');
  const toggleProgressBarSwitch = document.getElementById('toggleProgressBarSwitch');

  chrome.storage.sync.get(['overlayVisible', 'progressBarVisible'], function (result) {
    toggleOverlaySwitch.checked = result.overlayVisible;
    toggleProgressBarSwitch.checked = result.progressBarVisible;

    if (toggleOverlaySwitch.checked === true) {
      toggleProgressBarSwitch.checked = true;
      toggleProgressBarSwitch.disabled = true;
      toggleProgressBar();
    }

  });

  toggleOverlaySwitch.addEventListener('change', function () {
    toggleOverlay();
  });

  toggleProgressBarSwitch.addEventListener('change', function () {
    toggleProgressBar();
  });

  function toggleProgressBar() {
    chrome.tabs.query({ url: "*://www.youtube.com/*" }, function (tabs) {
      tabs.forEach(function (tab) {
        chrome.tabs.sendMessage(tab.id, { action: 'toggleProgressBar', value: toggleProgressBarSwitch.checked });
      });
    });
  }

  function toggleOverlay() {
    chrome.tabs.query({ url: "*://www.youtube.com/*" }, function (tabs) {
      tabs.forEach(function (tab) {
        chrome.tabs.sendMessage(tab.id, { action: 'toggleOverlay', value: toggleOverlaySwitch.checked });

        if (toggleOverlaySwitch.checked === true) {
          toggleProgressBarSwitch.checked = true;
          toggleProgressBarSwitch.disabled = true;
          toggleProgressBar();
        }
        else {
          toggleProgressBarSwitch.disabled = false;
        }

      })
    })
  }

});