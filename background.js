chrome.runtime.onInstalled.addListener((reason) => {
  if (reason === chrome.runtime.OnInstalledReason.INSTALL) {
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
        'title-cast': false,
        'videos-section': false,
      },
    });
  }
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.message === 'set_enable') {
    chrome.storage.sync.set(
      {
        isEnabled: request.payload,
      },
      () => {
        if (chrome.runtime.lastError) {
          sendResponse({ message: 'error' });
          return;
        }
        sendResponse({ message: 'success' });
      },
    );
  }
  if (request.message === 'switchHideElemData') {
    chrome.storage.sync.set(
      {
        switchHideElemData: request.payload,
      },
      () => {
        if (chrome.runtime.lastError) {
          sendResponse({ message: 'error' });
          return;
        }
        sendResponse({ message: 'success' });
        handleHideElemData({ data: request.payload });
      },
    );
  }
  return true;
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'loading' && /^https:\/\/www\.imdb\.com\/title\//.test(tab.url)) {
    chrome.storage.sync.get('isEnabled', (data) => {
      if (data.isEnabled) {
        chrome.scripting
          .executeScript({
            target: { tabId },
            files: ['./foreground.js'],
          })
          .then(() => console.log('Script executed'))
          .catch((error) => console.error(error));
      }
    });
    chrome.storage.sync.get('switchHideElemData', handleHideElemData);
  }
});

function handleHideElemData(data) {
  if (data.switchHideElemData.main) {
    chrome.scripting
      .executeScript({
        target: { tabId },
        func: handleElementToShow,
        args: [data.switchHideElemData],
      })
      .catch((error) => console.error(error));
  }
}

function handleElementToShow(elements) {
  const existElement = (key) => document.querySelector(`[data-testid="${key}"]`);
  Object.keys(elements).forEach((key) => {
    if (existElement(key)) {
      document.querySelector(`[data-testid="${key}"]`).style.display = !elements[key] ? 'none' : 'block';
    }
  });
}
