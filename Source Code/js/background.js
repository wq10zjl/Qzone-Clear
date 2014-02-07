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
        if (request.dataLog) {
            localStorage.updated = true;
            localStorage.userInfo = request.dataLog;
        }
        if (request.hideAdd) {
            localStorage.updated = true;
            localStorage.hidePart = request.hideAdd;
        }
        if (request.remarkAdd) {
            if (localStorage.userRemark) var userRemark = JSON.parse(localStorage.userRemark);
            else {
                var userRemark = {
                    uin: [],
                    remark: []
                }
            }
            if (localStorage.edited) var edited = JSON.parse(localStorage.edited);
            else {
                var edited = {
                    uin: [],
                    remark: []
                }
            }
            var curHide = localStorage.hidePart.split(",");
            var newItem = curHide[curHide.length-1];
            userRemark.uin.push(newItem);
            userRemark.remark.push(request.remarkAdd);
            edited.uin.push(newItem);
            edited.remark.push(request.remarkAdd);
            localStorage.userRemark = JSON.stringify(userRemark);
            localStorage.edited = JSON.stringify(edited); // 自动获取并更新备注
        }
        if (request.dataUrl) localStorage.dataUrl = request.dataUrl;
    }
);
