chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.set({ isEnabled: true });
  chrome.storage.local.set({
    switchHideElemData: {
      "main": true, "Details": false, "DidYouKnow": false,
      "DynamicFeature_Episodes": false, "FAQ": false, "MoreLikeThis": false,
      "News": false, "Photos": false, "Storyline": false, "TechSpecs": false,
      "contribution": false, "title-cast": false, "videos-section": false
    }
  });
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.message === "toggle_state") {
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
    // return true;
  }
  if (request.message === "setswitchHideElemData") {

    chrome.storage.local.set(
      {
        switchHideElemData: request.payload,
      },
      () => {
        if (chrome.runtime.lastError) {
          sendResponse({ message: "error" });
          return;
        }
        sendResponse({ message: "success" });
      }
    );
  }
  return true;
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

    chrome.storage.local.get("switchHideElemData", (data) => {
      if (data.switchHideElemData.main) {
        chrome.scripting
          .executeScript({
            target: { tabId },
            func: hideSomeElements,
            args: [data.switchHideElemData],
          })
          .then(() => console.log("Script executed: switchHideElemData"))
          .catch((error) => console.error(error));
      }
    });
  }
});
// run on val change without reload.. TODO
function hideSomeElements(hideElemData) {
  Object.keys(hideElemData).forEach(key => {

    console.log(key);
    if (key !== "main") {
      if (hideElemData[key]) {
        document.querySelectorAll(`[data-testid="${key}"]`)[0].style.display = "none"
      } else {
        document.querySelectorAll(`[data-testid="${key}"]`)[0].style.display = "block"
      }
    }
  });
}