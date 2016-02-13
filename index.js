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

getCurrentTabUrl(function(url) {
    chrome.storage.local.get("sites", function(sites){
        sites = sites.sites
        domain = url.match(/:\/\/(www\.)?([^\/]+)\//).slice(-1)[0]
        if(domain in sites) {
            proxies = sites[domain]
            $("#mirror").css("display", "block")
            $("#nomirror").css("display", "none")
            $("#mirror button").on("click", function() {
                takeMeTo(proxies[Math.floor(Math.random()*proxies.length)])
            })
        }
        else {
            $("#mirror").css("display", "none")
            $("#nomirror").css("display", "block")
        }
    })
})
