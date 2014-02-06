function getDomainFromUrl(url) {
    var host = "null";
    if (!url || typeof url === "undefined")
        url = window.location.href;
    var regex = /.*\:\/\/([^\/]*).*/;
    var match = url.match(regex);
    if (match && typeof match !== "undefined")
        host = match[1];
    return host;
}

function checkForValidUrl(tabId, changeInfo, tab) {
    var curUrl = getDomainFromUrl(tab.url).toLowerCase();
    if (curUrl === "user.qzone.qq.com" || curUrl === "r.qzone.qq.com") {
        chrome.pageAction.show(tabId);
    }
};

chrome.tabs.onUpdated.addListener(checkForValidUrl);

chrome.extension.onRequest.addListener(
    function(request) {
        if (request.dataLog) localStorage.userInfo = request.dataLog;
        if (request.dataUrl) localStorage.dataUrl = request.dataUrl;
        if (request.hideAdd) localStorage.hidePart = request.hideAdd;
    }
);
