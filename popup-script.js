const switchToggle = document.getElementById('mainSwitch');
const switchHideElem = document.getElementById('switchHideElem');
const hideElemList = document.getElementById('hideElemList');

//Un commnent for clearing data real quick
// chrome.storage.sync.clear(function (obj) {
//   console.log("cleared");
// });

let switchHideElemData = {};

const sections = [
  {
    title: 'Videos',
    id: 'videos-section',
  },
  {
    title: 'Photos',
    id: 'Photos',
  },
  {
    title: 'Top cast',
    id: 'title-cast',
  },
  {
    title: 'More like this',
    id: 'MoreLikeThis',
  },
  {
    title: 'Storyline',
    id: 'Storyline',
  },
  {
    title: 'Did you know',
    id: 'DidYouKnow',
  },
  {
    title: 'Episdoes',
    id: 'DynamicFeature_Episodes',
  },
  {
    title: 'User reviews',
    id: 'UserReviews',
  },
  {
    title: 'FAQ',
    id: 'FAQ',
  },
  {
    title: 'Details',
    id: 'Details',
  },
  {
    title: 'Box office',
    id: 'BoxOffice',
  },
  {
    title: 'Technical specs',
    id: 'TechSpecs',
  },
  {
    title: 'Related news',
    id: 'News',
  },
  {
    title: 'Contribute to this page',
    id: 'contribution',
  },
  {
    title: 'Editorial lists',
    id: 'right-rail-content-block',
  },
  {
    title: 'Editorial lists',
    id: 'DynamicFeature_EditorialLists',
  },
  {
    title: 'User lists',
    id: 'DynamicFeature_UserLists',
  },
  {
    title: 'User polls',
    id: 'SidebarPolls',
  },
];

let html = '';
sections.forEach(function (el) {
  html += `
    <label class="container">Hide ${el.title}
      <input class="hideElemListCB" data-testid="${el.id}" type="checkbox">
      <span class="checkmark"></span>
    </label>
    `;
});

hideElemList.innerHTML = html;

// setup listener for every checkbox
Array.from(hideElemList.querySelectorAll('.hideElemListCB')).forEach(function (element) {
  element.addEventListener('change', handleSwitchHideElemData);
});

// Setup initial state
chrome.storage.sync.get('isEnabled', (data) => {
  switchToggle.checked = data.isEnabled;
});

chrome.storage.sync.get('switchHideElemData', (data) => {
  switchHideElemData = data.switchHideElemData;
  if (data.switchHideElemData) {
    switchHideElem.checked = data.switchHideElemData.main;
  } else switchHideElemData = {};
  Object.keys(switchHideElemData).forEach((key) => {
    if (key !== 'main') {
      document.querySelector(`[data-testid="${key}"]`).checked = switchHideElemData[key];
    }
  });
});

// Extension switcher
switchToggle.addEventListener('change', (e) => {
  chrome.runtime.sendMessage(
    {
      message: 'set_enable',
      payload: e.target.checked,
    },
    (response) => {
      if (response.message !== 'success') {
        console.error('Failed to set enable to ' + e.target.checked + ' ' + response.message);
      }
    },
  );
});

// Hide section switcher
switchHideElem.addEventListener('change', handleSwitchHideElemData);

function handleSwitchHideElemData(e) {
  switchHideElemData[e.target.dataset['testid']] = e.target.checked;
  chrome.runtime.sendMessage(
    {
      message: 'switchHideElemData',
      payload: switchHideElemData,
    },
    (response) => {
      if (response.message !== 'success') {
        console.error('Failed handleSwitchHideElemData');
      }
    },
  );
}
