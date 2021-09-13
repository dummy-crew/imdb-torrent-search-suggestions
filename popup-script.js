const switchToggle = document.getElementById('mainSwitch');
const switchHideElem = document.getElementById('switchHideElem');
const hideElemList = document.getElementById('hideElemList');

//Un commnent for clearing data real quick
// chrome.storage.sync.clear(function (obj) {
//   console.log("cleared");
// });

let switchHideElemData = {};

const hideElemListArr = [
  ['DidYouKnow', 'Did you Know'],
  ['Storyline', 'Story Line'],
  ['MoreLikeThis', 'More Like This'],
  ['videos-section', 'videos section'],
  ['Photos', 'Photos'],
  ['DynamicFeature_Episodes', 'Epidodes'],
  ['title-cast', 'Top Cast'],
  ['FAQ', 'FAQ'],
  ['Details', 'Details'],
  ['TechSpecs', 'Technical Specifications'],
  ['News', 'Related news'],
  ['contribution', 'Contribute to this page'],
];

let html = '';
hideElemListArr.forEach(function (el) {
  html += `
    <label class="container">Hide ${el[1]}
      <input class="hideElemListCB" data-testid="${el[0]}" type="checkbox">
      <span class="checkmark"  ></span>
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
