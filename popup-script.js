const switchToggle = document.getElementById("mainSwitch");
const switchHideElem = document.getElementById("switchHideElem");
const hideElemList = document.getElementById("hideElemList");

//Un commnent for clearing data real quick
// chrome.storage.local.clear(function (obj) {
//   console.log("cleared");
// });

let switchHideElemData = {};
const hideElemListArr = [
  // [data-testid, Readable text]
  ["DidYouKnow", "Did you Know"],
  ["Storyline", "Story Line"],
  ["MoreLikeThis", "More Like This"],
  ["videos-section", "videos section"],
  ["Photos", "Photos"],
  ["DynamicFeature_Episodes", "Epidodes"],
  ["title-cast", "Top Cast"],
  ["FAQ", "FAQ"],
  ["Details", "Details"],
  ["TechSpecs", "Technical Specifications"],
  ["News", "Related news"],
  ["contribution", "Contribute to this page"],
];

let renderHideElemListArr = () => {
  let html = "";
  hideElemListArr.forEach(function (el) {
    html += `
    <label class="container">Hide ${el[1]}
      <input class="hideElemListCB" data-testid="${el[0]}" type="checkbox">
      <span class="checkmark"  ></span>
    </label>
    `;
  });
  hideElemList.innerHTML = html;
};
renderHideElemListArr();

Array.from(document.getElementsByClassName("hideElemListCB")).forEach(function (
  element
) {
  element.addEventListener("change", (event) => {
    switchHideElemData[event.currentTarget.getAttribute("data-testid")] =
      event.currentTarget.checked;
    setswitchHideElemData();
  });
});

chrome.storage.local.get("isEnabled", (data) => {
  switchToggle.checked = data.isEnabled;
});

chrome.storage.local.get("switchHideElemData", (data) => {
  switchHideElemData = data.switchHideElemData;
  console.log(JSON.stringify(switchHideElemData));
  if (data.switchHideElemData)
    switchHideElem.checked = data.switchHideElemData.main;
  else switchHideElemData = {};

  Object.keys(switchHideElemData).forEach((key) => {
    console.log(key);
    if (key !== "main") {
      document.querySelectorAll(`[data-testid="${key}"]`)[0].checked =
        switchHideElemData[key];
    }
  });
});

//main Switch
switchToggle.addEventListener("change", (e) => {
  chrome.runtime.sendMessage(
    {
      message: "set_enable",
      payload: e.target.checked,
    },
    (response) => {
      if (response.message === "success") {
        console.log("Successfully set enable to " + e.target.checked);
      } else {
        console.log(
          "Failed to set enable to " + e.target.checked + " " + response.message
        );
      }
    }
  );
});

//Main "Hide some elements" Switch
switchHideElem.addEventListener("change", (e) => {
  switchHideElemData["main"] = e.target.checked;
  setswitchHideElemData();
});

function setswitchHideElemData() {
  chrome.runtime.sendMessage(
    {
      message: "setswitchHideElemData",
      payload: switchHideElemData,
    },
    (response) => {
      if (response.message === "success") {
        console.log("Successfully set setSwitchHideElem");
      } else {
        console.log("Failed to set enable to setSwitchHideElem");
      }
    }
  );
}
