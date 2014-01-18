(function() {
    chrome.storage.onChanged.addListener(function(changes, areaName) {
        var hidePart = changes.hidePart.newValue;
        localStorage.setItem("hidePart", hidePart);
        clearOut();
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
                        $j(ele[j]).parents(".f-single").hide(500, function() {
                            $j(this).remove();
                        });
                    } // 移除说说整体
                    if ($j(ele[j]).parents(".txt-box")[0] !== undefined) {
                        $j(ele[j]).parents(".f-single").hide(500, function() {
                            $j(this).remove();
                        });
                    } // 移除转发
                    var isComment = $j(ele[j]).parents("[data-type='replyroot']")[0];
                    if (isComment !== undefined) {
                        $j(isComment).fadeOut(500, function() {
                            $j(this).remove(); // 移除说说评论
                        });
                    } else {
                        $j(ele[j]).parents("[data-type='commentroot']").fadeOut(500, function() {
                            $j(this).remove(); // 移除说说评论回复
                        });
                    }
                    $j(ele[j]).fadeOut(500, function() {
                        $j(this).remove();
                    }); // 移除赞
                }
            }
        }
    }

    // 文本匹配移除
    if (content.length !== 0 || multi.length !== 0) {
        var items = $j(".f-single");
        var ctItems = $j("[data-type='commentroot']");
        var rpItems = $j("[data-type='replyroot']");
    }
        for (var k = 0; k < content.length; k++) {
            $j(items).each(function() {
                var text = $j(this).find(".f-user-info, .f-info, .f-ct-txtimg").text();
                if (text.indexOf(content[k]) > -1) {
                    $j(this).hide(500, function() {
                        $j(this).remove();
                    });
                }
            }) // 不为评论内容时移除整体
            $j(rpItems).each(function() {
                var text = $j(this).text();
                if (text.indexOf(content[k]) > -1) $j(this).remove(); // 为评论内容时移除评论内容
            })
            $j(ctItems).each(function() {
                var text = $j(this).text();
                if (text.indexOf(content[k]) > -1) {
                    $j(this).fadeOut(500, function() {
                        $j(this).remove();
                    }); // 为评论内容时移除评论内容
                }
            })
        }
    // 多关键字匹配
    if (multi.length !== 0) {
        var ck, ctCheck, rpCheck;
        var allSame = 0;
        $j(multi).each(function(i) {
            var arr = multi[i].split("+");
            $j(arr).each(function(i) {
                if (arr[0] === arr[i]) allSame = 1;
                else allSame = 0;
            })
            if (allSame === 1) {
                $j(items).each(function() {
                    var content = $j(this).find(".f-user-info, .f-info, .f-ct-txtimg").text().split("");
                    var a = 0;
                    for (var m = 0; m < content.length; m++) {
                        if (content[m] === arr[0]) a++;
                    }
                    if (a >= arr.length) {
                        $j(this).hide(500, function() {
                            $j(this).remove();
                        });
                    }
                }); // 移除说说主体
                $j(rpItems).each(function() {
                    var content = $j(this).text().split("");
                    var a = 0;
                    for (var n = 0; n < content.length; n++) {
                        if (content[n] === arr[0]) a++;
                    }
                    if (a >= arr.length) $j(this).remove();
                }); // 移除评论回复
                $j(ctItems).each(function() {
                    var content = $j(this).text().split("");
                    var a = 0;
                    for (var n = 0; n < content.length; n++) {
                        if (content[n] === arr[0]) a++;
                    }
                    if (a >= arr.length) {
                        $j(this).fadeOut(500, function() {
                            $j(this).remove();
                        });
                    }
                }); // 移除评论
            } // 多关键字都相同时
            else {
                $j(items).each(function() {
                    var matchText = $j(this).find(".f-user-info, .f-info, .f-ct-txtimg").text();
                    for (var i = 0; i < arr.length; i++) {
                        if (matchText.indexOf(arr[0]) !== -1 && matchText.indexOf(arr[i]) === -1) {
                            ck = 0;
                        } else if (matchText.indexOf(arr[0]) !== -1 && matchText.indexOf(arr[i]) !== -1) {
                            ck = $j(this);
                        }
                    };
                    if (ck !== undefined && ck !== 0) {
                        $j(ck).hide(500, function() {
                            $j(this).remove();
                        });
                    }
                }); // 不为评论内容时，移除说说主体
                $j(rpItems).each(function() {
                    var matchText = $j(this).text();
                    for (var i = 0; i < arr.length; i++) {
                        if (matchText.indexOf(arr[0]) !== -1 && matchText.indexOf(arr[i]) === -1) {
                            rpCheck = 0;
                        } else if (matchText.indexOf(arr[0]) !== -1 && matchText.indexOf(arr[i]) !== -1) {
                            rpCheck = $j(this);
                        }
                    };
                    if (rpCheck !== undefined && rpCheck !== 0) $j(rpCheck).remove();
                }); // 为评论回复时，移除回复
                $j(ctItems).each(function() {
                    var matchText = $j(this).text();
                    for (var i = 0; i < arr.length; i++) {
                        if (matchText.indexOf(arr[0]) !== -1 && matchText.indexOf(arr[i]) === -1) {
                            ctCheck = 0;
                        } else if (matchText.indexOf(arr[0]) !== -1 && matchText.indexOf(arr[i]) !== -1) {
                            ctCheck = $j(this);
                        }
                    };
                    if (ctCheck !== undefined && ctCheck !== 0) {
                        $j(ctCheck).fadeOut(500, function() {
                            $j(this).remove();
                        });
                    }
                }); // 为评论内容时，移除评论
            }
        })
    };
}
clearOut();

var page = -1;

function check() {
    var tempPage = $j("ul[data-page]:last").data("page"); // 获取瀑布流加载的页码
    if (tempPage > page) {
        clearOut();
        page = $j("ul[data-page]:last").data("page");
    }
}
setInterval(check, 1000); // 监听瀑布流新内容载入
$j(".icon-refresh, #tab_menu_list a").click(function() {
    page = -1;
    var a = 0;
    var b = setInterval(function() {
        a = $j(".f-single").length
        if (a !== 0) {
            clearInterval(b);
            clearOut();
        };
    }, 1000);
}) // 刷新
