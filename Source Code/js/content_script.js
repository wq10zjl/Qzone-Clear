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

function clearOut() {
    var setting;
    var userSet = localStorage.setting;
    if (userSet) setting = JSON.parse(userSet);
    else {
        setting = {
            moveMood: true,
            moveLike: true,
            moveComment: true,
            moveReply: true,
            moveStamp: true,
            moveTooMuchLikes: false
        };
    }
    if (userSet.indexOf(true) === -1) return false;
    if (setting.moveTooMuchLikes) {
        $j("[data-likecnt]").each(function() {
            var a = $j(this).data("likecnt");
            if (a >= setting.moveTooMuchLikes) {
                $j(this).closest(".f-single").hide(500, function() {
                    $j(this).remove();
                });
            };
        })
    }; // 根据赞的数量移除
    if (setting.moveStamp) {
        $j(".img-box img[src*='stamp']").closest(".f-single").hide(500, function() {
            $j(this).remove();
        });
    }; // 移除签到

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
                    }; // 移除转发
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
                    };
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
                    };
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
                    };
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
