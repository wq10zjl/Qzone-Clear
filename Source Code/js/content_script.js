(function() {
    chrome.storage.onChanged.addListener(function(changes, areaName) {
        var hidePart = changes.hidePart.newValue;
        localStorage.setItem("hidePart", hidePart);
    })
})(); // 获取extension储存的uid，转存入localStorage

var $j = jQuery.noConflict();

function clearOut() {
    var content = [];
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
        var t = target[i];
        for (var j = 0; j < ele.length; j++) {
            if ($j(ele[j]).attr("href") !== undefined) {
                var url = $j(ele[j]).attr("href"); // 获得好友空间url
                var uid = url.split(/[^\d]/g); // 获得url中的数字部分（QQ号码）
                if (uid[uid.length - 1] == t) {
                    var check = $j(ele[j]).parents(".f-single").attr("id");
                    if (check.indexOf(t) > -1) {
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
        var items = $j(".f-info, .f-ct-txtimg, .f-user-info");
        $j(items).each(function() {
            var text = $j(this).text();
            if (text.indexOf(content[k]) > -1) {
                $j(this).parents(".f-single").remove(); // 不为评论内容时移除整体
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
}
setInterval(clearOut, 1000)
