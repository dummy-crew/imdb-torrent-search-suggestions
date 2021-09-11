chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.set({ isEnabled: true });
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.message === "set_enable") {
    chrome.storage.local.set(
      {
        isEnabled: request.payload,
      },
      () => {
        if (chrome.runtime.lastError) {
          sendResponse({ message: "error" });
          return;
        }
        sendResponse({ message: "success" });
      }
    );
    return true;
  }
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (
    changeInfo.status === "complete" &&
    /^https:\/\/www\.imdb\.com\/title\//.test(tab.url)
  ) {
    chrome.storage.local.get("isEnabled", (data) => {
      if (data.isEnabled) {
        chrome.scripting
          .executeScript({
            target: { tabId },
            files: ["./foreground.js"],
          })
          .then(() => console.log("Script executed"))
          .catch((error) => console.error(error));
      }
    });
  }
});
