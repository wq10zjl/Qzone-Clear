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
    if (localStorage.getItem("hidePart") !== null) {
        var target = localStorage.getItem("hidePart").split(",");
    }
    // uid 匹配移除
    for (var i = 0; i < target.length; i++) {
        var temp = target[i].match(/[^\d]/g);
        if (temp !== null) {
            content.push(temp.join(""))
        } // 获得hidePart中文本部分
        if (target[i].indexOf("+") > -1) {
            multi.push(target[i]);
        } // 获取多关键字部分
        var t = target[i];
        for (var j = 0; j < ele.length; j++) {
            if ($j(ele[j]).attr("href") !== undefined) {
                var url = $j(ele[j]).attr("href"); // 获得好友空间url
                var uid = url.split(/[^\d]/g); // 获得url中的数字部分（QQ号码）
                if (uid[uid.length - 1] == t) {
                    var check = $j(ele[j]).parents(".f-single").attr("id");
                    if (check !== undefined && check.indexOf(t) > -1) {
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
        $j(multi).each(function(i) {
            var arr = multi[i].split("+");
            var ck,ctCk;
            $j(arr).each(function(e) {
                var ele = $j(".f-single");
                $j(ele).each(function() {
                    var matchText = $j(this).find(".f-user-info, .f-info, .f-ct-txtimg").text();
                    if (matchText.indexOf(arr[0]) !== -1 && matchText.indexOf(arr[e]) === -1) {
                        ck = 0;
                        return false;
                    } else if (matchText.indexOf(arr[0]) !== -1 && matchText.indexOf(arr[e]) !== -1) {
                        ck = $j(this);
                    }
                }); // 不为评论内容时
                if (ck !== undefined && ck !== 0) {
                    $j(ck).remove()
                };
                var ctEle = $j(".comments-item");
                $j(ctEle).each(function() {
                    var matchText = $j(this).text();
                    if (matchText.indexOf(arr[0]) !== -1 && matchText.indexOf(arr[e]) === -1) {
                        ctCk = 0;
                        return false;
                    } else if (matchText.indexOf(arr[0]) !== -1 && matchText.indexOf(arr[e]) !== -1) {
                        ctCk = $j(this);
                    }
                }); // 为评论内容时
            })
            if (ctCk !== undefined && ctCk !== 0) {
                $j(ctCk).remove()
            };
        })
    };
}
$j(document).ready(function() {
    setInterval(clearOut, 1000)
})
