const listUrls = document.querySelector("#list-urls");

// Store the currently selected settings using browser.storage.local.
function saveOptions() {
  const mirror_lists = listUrls.value.replace(/\n/g, ',');
  return window.options.set({ mirror_lists });
}

// Update the options UI with the settings values retrieved from storage,
// or the default settings if the stored settings are empty.
async function loadOptions() {
  const { mirror_lists } = window.options.getAll();
  listUrls.value = mirror_lists.replace(/,/g, '\n');
}

document.addEventListener("DOMContentLoaded", loadOptions);
document.querySelector("form").addEventListener("submit", saveOptions);
