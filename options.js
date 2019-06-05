const default_url = "https://raw.githubusercontent.com/OpenTechFund/bypass-mirrors/master/mirrorSites.json"

function saveOptions(e) {
  e.preventDefault();
  browser.storage.sync.set({
    sites_url: document.querySelector("#sites_url").value
  });
}

function restoreOptions() {

  function setCurrentChoice(result) {
    document.querySelector("#sites_url").value = result.sites_url || default_url;
  }

  function onError(error) {
    console.log(`Error: ${error}`);
  }

  var getting = browser.storage.sync.get("sites_url");
  getting.then(setCurrentChoice, onError);
}

document.addEventListener("DOMContentLoaded", restoreOptions);
document.querySelector("form").addEventListener("submit", saveOptions);
