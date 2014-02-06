(function() {
    chrome.storage.onChanged.addListener(function(changes, areaName) {
        if (changes.hidePart) {
            var hidePart = changes.hidePart.newValue;
            localStorage.setItem("hidePart", hidePart);
            clearOut();
        }
        if (changes.setting) {
            var setting = changes.setting.newValue;
            localStorage.setItem("setting", setting);
            clearOut();
        };
    })
})(); // 获取extension储存的uid，转存入localStorage

var $j = jQuery.noConflict();

var setting;

function clearOut() {
    var userSet = localStorage.setting;
    if (userSet) setting = JSON.parse(userSet);
    else {
        setting = {
            moveMood: true,
            moveLike: true,
            moveComment: true,
            moveReply: true,
            moveStamp: true,
            isOld: false,
            moveTooMuchLikes: false
        };
    }
    if (setting.moveTooMuchLikes) {
        $j("[data-likecnt]").each(function() {
            var a = $j(this).data("likecnt");
            if (a >= setting.moveTooMuchLikes) {
                $j(this).closest(".f-single").hide(500, function() {
                    $j(this).remove();
                });
            };
        })
    } // 根据赞的数量移除
    if (userSet && userSet.indexOf(true) === -1) return false;
    if (setting.moveStamp) {
        $j(".img-box img[src*='qzonestyle']").closest(".f-single").hide(500, function() {
            $j(this).remove();
        });
    } // 移除签到

    var content = [];
    var multi = [];
    var ele = $j(".q_namecard,.f-like .item");
    if (!localStorage.getItem("hidePart") || localStorage.getItem("hidePart") === "undefined") return false;
    if (localStorage.getItem("hidePart")) {
        var target = localStorage.getItem("hidePart").split(",");
    }
    if (target === "") return false;
    for (var i = 0; i < target.length; i++) {
        if (target[i].indexOf("+") > -1) {
            multi.push(target[i]); // 获取hidePart中多关键字部分
        } else {
            var num = target[i].split(/[^\d]/g).join(""); // 获取数字部分
            var temp = target[i].match(/[^\d]/g);
            if (temp) {
                content.push(temp.join(""))
            } // 获得单关键字部分
        }

        // uid 匹配移除
        for (var j = 0; j < ele.length; j++) {
            if ($j(ele[j]).attr("href")) {
                var url = $j(ele[j]).attr("href"); // 获得好友空间url
                var uid = url.split(/[^\d]/g).join(""); // 获得url中的数字部分（QQ号码）
                if (uid === num) {
                    var check = $j(ele[j]).closest(".f-single").attr("id");
                    if (setting.moveMood) {
                        if (check && check.indexOf(num) > -1) {
                            $j(ele[j]).closest(".f-single").hide(500, function() {
                                $j(this).remove();
                            });
                        } // 移除说说整体
                        if ($j(ele[j]).closest(".txt-box")[0]) {
                            $j(ele[j]).closest(".f-single").hide(500, function() {
                                $j(this).remove();
                            });
                        }
                    } // 移除转发
                    var isReply = $j(ele[j]).closest("[data-type='replyroot']")[0];
                    var isComment = $j(ele[j]).parent().parent().parent("[data-type='commentroot']")[0];
                    var isLike = $j(ele[j]).closest(".f-like")[0];
                    if (setting.moveReply && isReply) {
                        $j(isReply).hide(500, function() {
                            $j(this).remove(); // 移除说说评论回复
                        });
                    }
                    if (setting.moveComment && isComment) {
                        $j(isComment).hide(500, function() {
                            $j(this).remove(); // 移除说说评论
                        });
                    }
                    if (setting.moveLike && isLike) {
                        $j(ele[j]).fadeOut(500, function() {
                            $j(this).remove();
                        }); // 移除赞
                    }
                }
            }
        }
    }

    // 文本匹配移除
    if (content.length !== 0 || multi.length !== 0) {
        if (setting.moveMood) var items = $j(".f-single");
        if (setting.moveComment || setting.moveReply) var comments = $j(".comments-content");
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
        $j(comments).each(function() {
            var text = $j(this).text();
            if (text.indexOf(content[k]) > -1) {
                var isReply = $j(this).closest("[data-type='replyroot']")[0];
                var isComment = $j(this).parent().parent("[data-type='commentroot']")[0];
                if (setting.moveReply && isReply) {
                    $j(isReply).hide(500, function() {
                        $j(this).remove(); // 移除说说评论回复
                    });
                }
                if (setting.moveComment && isComment) {
                    $j(isComment).hide(500, function() {
                        $j(this).remove(); // 移除说说评论
                    });
                }
            }
        })
    }
    // 多关键字匹配
    if (multi.length !== 0) {
        var allSame;
        $j(multi).each(function(i) {
            var arr = multi[i].split("+");
            $j(arr).each(function(i) {
                if (arr[0] === arr[i]) allSame = true;
                else {
                    allSame = false;
                    return false;
                }
            })
            if (allSame) {
                var regex = new RegExp(arr[0], "g");
                $j(items).each(function() {
                    var content = $j(this).find(".f-user-info, .f-info, .f-ct-txtimg").text().match(regex);
                    if (content && content.length >= arr.length) {
                        $j(this).hide(500, function() {
                            $j(this).remove();
                        });
                    }
                }); // 移除说说主体
                $j(comments).each(function() {
                    var content = $j(this).text().match(regex);
                    if (content && content.length >= arr.length) {
                        var isReply = $j(this).closest("[data-type='replyroot']")[0];
                        var isComment = $j(this).parent().parent("[data-type='commentroot']")[0];
                        if (setting.moveReply && isReply) {
                            $j(isReply).hide(500, function() {
                                $j(this).remove(); // 移除说说评论回复
                            });
                        }
                        if (setting.moveComment && isComment) {
                            $j(isComment).hide(500, function() {
                                $j(this).remove(); // 移除说说评论
                            });
                        }
                    }
                }); // 移除评论
            } // 多关键字都相同时
            else {
                $j(items).each(function() {
                    var matchText = $j(this).find(".f-user-info, .f-info, .f-ct-txtimg").text();
                    for (var i = 0; i < arr.length; i++) {
                        if (matchText.indexOf(arr[i]) === -1) {
                            matchText = false;
                            break;
                        }
                    }
                    if (matchText) {
                        $j(this).hide(500, function() {
                            $j(this).remove();
                        });
                    }
                }); // 不为评论内容时，移除说说主体
                $j(comments).each(function() {
                    var matchText = $j(this).text();
                    for (var i = 0; i < arr.length; i++) {
                        if (matchText.indexOf(arr[i]) === -1) {
                            matchText = false;
                            break;
                        }
                    }
                    if (matchText) {
                        var isReply = $j(this).closest("[data-type='replyroot']")[0];
                        var isComment = $j(this).parent().parent("[data-type='commentroot']")[0];
                        if (setting.moveReply && isReply) {
                            $j(isReply).hide(500, function() {
                                $j(this).remove(); // 移除说说评论回复
                            });
                        }
                        if (setting.moveComment && isComment) {
                            $j(isComment).hide(500, function() {
                                $j(this).remove(); // 移除说说评论
                            });
                        }
                    }
                });
            }
        })
    };
}
clearOut();

var page = -1;
var blocks = 0;

function check() {
    var curPage = $j("ul[data-page]:last").data("page"); // 获取瀑布流加载的页码
    if (curPage > page) {
        clearOut();
        page = curPage;
    }
}

function checkOld() {
    var curBlocks = $j(".f-single").length;
    if (curBlocks > blocks) {
        clearOut();
        blocks = curBlocks;
    }
}

if (setting.isOld) {
    var t = setInterval(function() {
        checkOld();
        if ($j("[data-page]")[0]) {
            clearInterval(t);
            alert("检测到空间版本为新版，请在插件中关闭兼容模式！")
        }
    }, 1000);
} else setInterval(check, 1000);
// 监听瀑布流新内容载入

$j(".icon-refresh, #tab_menu_list a").click(function() {
    page = -1;
    blocks = 0;
    var a = 0;
    var b = setInterval(function() {
        a = $j(".f-single").length
        if (a !== 0) {
            clearInterval(b);
            clearOut();
        };
    }, 1000);
}) // 刷新

var urlCheck = window.location.href.match(/.*\:\/\/([^\/]*).*/);
if (urlCheck[1] === "user.qzone.qq.com") {
    var hrefUid = window.location.href.split("/")[3];
    var targetSuf = $j("script[charset='GB2312']").attr("src");
    if (!targetSuf) {
        var a = setInterval(function() {
            targetSuf = $j("script[charset='GB2312']").attr("src");
            if (targetSuf) {
                suf = targetSuf.split("tk=")[1];
                var target = "http://r.qzone.qq.com/cgi-bin/tfriend/friend_show_qqfriends.cgi?uin=" + hrefUid + "&follow_flag=1&groupface_flag=0&fupdate=1&g_tk=" + suf;
                chrome.extension.sendRequest({
                    dataUrl: target
                }); // 获取好友信息网址
                clearInterval(a);
            }
        }, 100)
    };
}
if (urlCheck[1] === "r.qzone.qq.com") {
    var a = eval($j("pre").text().split("_Callback"));
    if (!eval(a[1])) {
        var noData = confirm("未能成功获得好友信息，请联系作者");
        if (noData === true) window.close();
    };
    var b = eval(a[1]).data.items;
    var data = {
        "avatar": [],
        "uin": [],
        "name": [],
        "remark": []
    }
    for (var i = 0; i < b.length; i++) {
        data.avatar.push(b[i].img);
        data.uin.push(b[i].uin);
        data.name.push(b[i].name);
        data.remark.push(b[i].remark);
    }
    chrome.extension.sendRequest({
        dataLog: JSON.stringify(data)
    });
    setTimeout(function() {
        var getData = confirm("已刷新好友信息，点击确定返回QQ空间");
        if (getData === true) window.close();
    }, 500)
} // 获取好友信息
