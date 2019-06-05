var sites_url = "https://raw.githubusercontent.com/OpenTechFund/bypass-mirrors/master/mirrorSites.json"
var sites = {}
var domain_regexp = /:\/\/(www\.)?([^\/]+)\//

function onError(error) {
  console.log(`Error: ${error}`);
}

function onGot(item) {
  if (item.sites_url) {
    sites_url = item.sites_url;
  }
}

var getting = browser.storage.sync.get("sites_url");
getting.then(onGot, onError);

// Retrieve the list of mirrors
function getSitesAndMirrors() {
	$.getJSON(sites_url).done(function(data) { chrome.storage.local.set({"sites_list": data}) })
}

// Get the URL on the current tab
function getCurrentTabUrl(callback) {
	var queryInfo = {
		active: true,
		currentWindow: true
	};

	chrome.tabs.query(queryInfo, function(tabs) {
		var tab = tabs[0];
		var url = tab.url;
		console.assert(typeof url == 'string', 'tab.url should be a string');
		callback(url);
	});
}

// Check if the URL on the current tab is bound to a list of mirrors. If so,
// indicate it to the user by turning the icon red.
function updateTab() {
	getCurrentTabUrl(function(url) {
		chrome.storage.local.get("sites_list", function(stored_sites){
			sites = stored_sites.sites_list.sites
			if(url.match(domain_regexp)) {
				// Skipping detection for about:* pages
				let domain = url.match(domain_regexp).slice(-1)[0]
				let exists = sites.findIndex(function(item) {
					return (domain === item.main_domain && item.available_mirrors.length > 0);
				});
				if(exists !== -1) {
					chrome.browserAction.setIcon({path: 'rsc/icon-red.png'})
				}
				else {
					chrome.browserAction.setIcon({path: 'rsc/icon.png'})
				}
			}
		})
	})
}

// Run the updateTab() function on tab switch (Ctrl+Tab), creation or target
// update
chrome.tabs.onActivated.addListener(updateTab)
chrome.tabs.onUpdated.addListener(updateTab)

// Fetch the list of mirrors on startup
getSitesAndMirrors()
