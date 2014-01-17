(function() {
    chrome.storage.onChanged.addListener(function(changes, areaName) {
        var hidePart = changes.hidePart.newValue;
        localStorage.setItem("hidePart", hidePart);
    })
})(); // 获取extension储存的uid，转存入localStorage

var $j = jQuery.noConflict();

function clearOut() {
    var content = [];
    var multi = [];
    var ele = $j(".q_namecard,.f-like .item");
    if (localStorage.getItem("hidePart") === "undefined") return false;
    if (localStorage.getItem("hidePart") !== null) {
        var target = localStorage.getItem("hidePart").split(",");
    }
    if (target === "") return false;
    for (var i = 0; i < target.length; i++) {
        if (target[i].indexOf("+") > -1) {
            multi.push(target[i]); // 获取hidePart中多关键字部分
        } else {
            var num = target[i].split(/[^\d]/g).join(""); // 获取数字部分
            var temp = target[i].match(/[^\d]/g);
            if (temp !== null) {
                content.push(temp.join(""))
            } // 获得单关键字部分
        }

        // uid 匹配移除
        for (var j = 0; j < ele.length; j++) {
            if ($j(ele[j]).attr("href") !== undefined) {
                var url = $j(ele[j]).attr("href"); // 获得好友空间url
                var uid = url.split(/[^\d]/g).join(""); // 获得url中的数字部分（QQ号码）
                if (uid === num) {
                    var check = $j(ele[j]).parents(".f-single").attr("id");
                    if (check !== undefined && check.indexOf(num) > -1) {
                        $j(ele[j]).parents(".f-single").remove();
                    } // 移除说说整体
                    if ($j(ele[j]).parents(".txt-box")[0] !== undefined) {
                        $j(ele[j]).parents(".f-single").remove();
                    } // 移除转发
                    $j(ele[j]).parents(".comments-item").remove(); // 移除说说评论
                    $j(ele[j]).remove(); // 移除赞
                }
            }
        }
    }

    // 文本匹配移除
    for (var k = 0; k < content.length; k++) {
        var items = $j(".f-single");
        $j(items).each(function() {
            var text = $j(this).find(".f-user-info, .f-info, .f-ct-txtimg").text();
            if (text.indexOf(content[k]) > -1) {
                $j(this).remove(); // 不为评论内容时移除整体
            }
        })
        var cmItems = $j(".comments-item");
        $j(cmItems).each(function() {
            var text = $j(this).text();
            if (text.indexOf(content[k]) > -1) {
                $j(this).remove(); // 为评论内容时移除评论内容
            }
        })
    };

    // 多关键字匹配
    if (multi.length !== 0) {
        var ele = $j(".f-single");
        var ctEle = $j(".comments-item");
        var ck, ctCheck;
        var allSame = 0;
        $j(multi).each(function(i) {
            var arr = multi[i].split("+");
            $j(arr).each(function(i) {
                if (arr[0] === arr[i]) allSame = 1;
                else allSame = 0;
            })
            if (allSame === 1) {
                $j(ele).each(function() {
                    var content = $j(this).find(".f-user-info, .f-info, .f-ct-txtimg").text().split("");
                    var a = 0;
                    for (var m = 0; m < content.length; m++) {
                        if (content[m] === arr[0]) a++;
                    };
                    if (a >= arr.length) $j(this).remove();
                });
                $j(ctEle).each(function() {
                    var content = $j(this).text().split("");
                    var a = 0;
                    for (var n = 0; n < content.length; n++) {
                        if (content[n] === arr[0]) a++;
                    };
                    if (a >= arr.length) $j(this).remove();
                }); // 为评论内容时
            } // 多关键字都相同时
            $j(arr).each(function(e) {
                if (allSame === 1) return false;
                $j(ele).each(function() {
                    var matchText = $j(this).find(".f-user-info, .f-info, .f-ct-txtimg").text();
                    if (matchText.indexOf(arr[0]) !== -1 && matchText.indexOf(arr[e]) === -1) {
                        ck = 0;
                        return false;
                    } else if (matchText.indexOf(arr[0]) !== -1 && matchText.indexOf(arr[e]) !== -1) {
                        ck = $j(this);
                    }
                }); // 不为评论内容时
                $j(ctEle).each(function() {
                    var matchText = $j(this).text();
                    if (matchText.indexOf(arr[0]) !== -1 && matchText.indexOf(arr[e]) === -1) {
                        ctCheck = 0;
                        return false;
                    } else if (matchText.indexOf(arr[0]) !== -1 && matchText.indexOf(arr[e]) !== -1) {
                        ctCheck = $j(this);
                    }
                }); // 为评论内容时
            });
            if (ck !== undefined && ck !== 0) {
                $j(ck).remove()
            };
            if (ctCheck !== undefined && ctCheck !== 0) {
                $j(ctCheck).remove()
            };
        })
    };
}
$j(document).ready(function() {
    setInterval(clearOut, 1000)
})
