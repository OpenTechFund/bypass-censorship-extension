/**
 * Get the current URL.
 *
 * @param {function(string)} callback - called when the URL of the current tab
 *   is found.
 */
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

function takeMeTo(url) {
    updateProperties = {
        url: "https://" + url
    }
    chrome.tabs.update(updateProperties=updateProperties)
}

// Wait for the DOM to load before doing anything
jQuery(document).ready(function() {
	// Check if there's a mirror for the current URL. If so, display the message
	// about it and the button to redirect to a random mirror (if there's more than
	// one).
	getCurrentTabUrl(function(url) {
		chrome.storage.local.get("sites", function(sites){
			sites = sites.sites
			// Grab the domain part of the URL
			domain = url.match(/:\/\/(www\.)?([^\/]+)\//).slice(-1)[0]
			if(domain in sites) {
				proxies = sites[domain]
				// Offer the user to redirect them to a mirror
				$("#mirror").css("display", "block")
				$("#nomirror").css("display", "none")
				$("#mirror button").on("click", function() {
					takeMeTo(proxies[Math.floor(Math.random()*proxies.length)])
				})
			}
			else {
				// Tell the user there's no mirror available
				$("#mirror").css("display", "none")
				$("#nomirror").css("display", "block")
			}
		})
	})
})
