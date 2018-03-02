var sites_url = "https://raw.githubusercontent.com/RSF-RWB/collateralfreedom/master/sites.json"
var sites = {}
var domain_regexp = /:\/\/(www\.)?([^\/]+)\//

// Retrieve the list of mirrors
function getSitesAndMirrors() {
	$.getJSON(sites_url).done(function(data) { chrome.storage.local.set({"sites": data}) })
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
		chrome.storage.local.get("sites", function(sites){
			sites = sites.sites
			if(url.match(domain_regexp)) {
				// Skipping detection for about:* pages
				let domain = url.match(domain_regexp).slice(-1)[0]
				if(domain in sites) {
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
