chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set({ isEnabled: true });
  chrome.storage.sync.set({
    switchHideElemData: {
      main: true,
      Details: false,
      DidYouKnow: false,
      DynamicFeature_Episodes: false,
      FAQ: false,
      MoreLikeThis: false,
      News: false,
      Photos: false,
      Storyline: false,
      TechSpecs: false,
      contribution: false,
      "title-cast": false,
      "videos-section": false,
    },
  });
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  debugger
  if (request.message === "set_enable") {
    chrome.storage.sync.set(
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
  }
  if (request.message === "switchHideElemData") {
    chrome.storage.sync.set(
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
    changeInfo.status === "loading" &&
    /^https:\/\/www\.imdb\.com\/title\//.test(tab.url)
  ) {
    chrome.storage.sync.get("isEnabled", (data) => {
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

    chrome.storage.sync.get("switchHideElemData", (data) => {
      // if hide section is enabled
      if (data.switchHideElemData.main) {
        chrome.scripting
          .executeScript({
            target: { tabId },
            func: hideSomeElements,
            args: [data.switchHideElemData],
          })
          .then(() => {
            console.log('ajajaja')
          })
          .catch((error) => console.error(error));
      }
    });
  }
});



// run on val change without reload.. TODO
function hideSomeElements(hideElemData) {
  const existHTMLElement = (id) => document.querySelector(`[data-testid="${id}"]`)
  Object.keys(hideElemData).forEach((key) => {
    if (key !== "main" && existHTMLElement(key)) {
      if (hideElemData[key]) {
        document.querySelectorAll(`[data-testid="${key}"]`)[0].style.display =
          "none";
        console.log("g63");
      } else {
        document.querySelectorAll(`[data-testid="${key}"]`)[0].style.display =
          "block";
        console.log("g64");
      }
    }
  });
}

// chrome.storage.sync.set({ isEnabled: true });
// chrome.storage.sync.set({
//   switchHideElemData: {
//     main: true,
//     Details: false,
//     DidYouKnow: false,
//     DynamicFeature_Episodes: false,
//     FAQ: false,
//     MoreLikeThis: false,
//     News: false,
//     Photos: false,
//     Storyline: false,
//     TechSpecs: false,
//     contribution: false,
//     "title-cast": false,
//     "videos-section": false,
//   },
// });