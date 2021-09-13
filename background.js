chrome.runtime.onInstalled.addListener((reason) => {
  if (reason === chrome.runtime.OnInstalledReason.INSTALL) {
    chrome.storage.sync.set({ isEnabled: true });
    chrome.storage.sync.set({
      switchHideElemData: {
        main: true,
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
        handleHideElemData({ switchHideElemData: request.payload });
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
          .catch((error) => console.error(error));
      }
    });
    chrome.storage.sync.get('switchHideElemData', handleHideElemData);
  }
});

function getTabId() {
  return chrome.tabs.query({ active: true, currentWindow: true });
}

function handleHideElemData(data) {
  if (!Object.keys(data).length) return;
  if (Object.keys(data.switchHideElemData).includes('main')) {
    getTabId().then((tab) => {
      if (Array.isArray(tab) && tab.length > 0) {
        chrome.scripting
          .executeScript({
            target: { tabId: tab[0].id },
            func: handleElementToShow,
            args: [data.switchHideElemData],
          })
          .catch((error) => console.error(error));
      }
    });
  }
}

function handleElementToShow(elements) {
  if (elements.main) {
    const existElement = (key) => document.querySelector(`[data-testid="${key}"]`);
    Object.keys(elements).forEach((key) => {
      if (existElement(key)) {
        const element = document.querySelector(`[data-testid="${key}"]`);
        element.style.display = elements[key] ? 'none' : 'block';
      }
    });
  }
}
