const switchToggle = document.querySelector('input[type="checkbox"]');

function removeButtons() {
  document.querySelectorAll("a[data-provider]").forEach((button) => {
    button.remove();
  });
}

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
        if (!e.target.checked) removeButtons();
        console.log("Successfully set enable to " + e.target.checked);
      } else {
        console.log(
          "Failed to set enable to " + e.target.checked + " " + response.message
        );
      }
    }
  );
});
