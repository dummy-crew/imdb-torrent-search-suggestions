const switchToggle = document.querySelector('input[type="checkbox"]');

chrome.storage.local.get("isEnabled", (data) => {
  switchToggle.checked = data.isEnabled;
});

switchToggle.addEventListener("change", (e) => {
  chrome.runtime.sendMessage(
    {
      message: "toggle_state",
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
