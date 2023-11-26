chrome.runtime.onMessage.addListener(async function (message, sender, sendResponse) {
  if (message.action === 'toggleOverlayKeyPressed') {
    await chrome.tabs.query({ url: "https://www.youtube.com/*" }, function (tabs) {
      tabs.forEach(async function (tab) {
        await chrome.tabs.sendMessage(tab.id, { action: 'toggleOverlay', value: message.value });
      });
    });
  }

  if (message.action === 'toggleProgressBarKeyPressed') {
    await chrome.tabs.query({ url: "https://www.youtube.com/*" }, function (tabs) {
      tabs.forEach(async function (tab) {
        await chrome.tabs.sendMessage(tab.id, { action: 'toggleProgressBar', value: message.value });
      });
    });
  }

});