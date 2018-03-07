var sites_url = "https://raw.githubusercontent.com/RSF-RWB/collateralfreedom/master/sites.json"
var sites = {}
var domain_regexp = /:\/\/(www\.)?([^\/]+)\//

function getSitesAndMirrors() {
    $.getJSON(sites_url).done(function(data) { chrome.storage.local.set({"sites": data}) })
}

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

function updateTab() {
    getCurrentTabUrl(function(url) {
        chrome.storage.local.get("sites", function(sites){
            sites = sites.sites
            let domain = url.match(domain_regexp).slice(-1)[0]
            if(domain in sites) {
                chrome.browserAction.setIcon({path: 'rsc/icon-red.png'})
            }
            else {
                chrome.browserAction.setIcon({path: 'rsc/icon.png'})
            }
        })
    })
}

chrome.runtime.onStartup.addListener(getSitesAndMirrors)
chrome.runtime.onInstalled.addListener(getSitesAndMirrors)
chrome.tabs.onActivated.addListener(updateTab)
chrome.tabs.onUpdated.addListener(updateTab)
