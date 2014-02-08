(function() {
    chrome.storage.onChanged.addListener(function(changes, areaName) {
        if (changes.hidePart) {
            var hidePart = changes.hidePart.newValue;
            localStorage.hidePart = hidePart;
        }
        if (changes.setting) {
            var setting = changes.setting.newValue;
            localStorage.setting = setting;
        }
        clearOut(".col-main-feed");
    })
})(); // 获取extension储存的uid，转存入localStorage

var $j = jQuery.noConflict();
var setting;

function clearOut(area) {
    if (!area) {
        if (!$j("[data-page]:last")[0]) {
            var area = $j(".col-main-feed");
        } else area = $j("[data-page]:last");
    }
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
        $j(area).find("[data-likecnt]:visible").each(function() {
            var a = $j(this).data("likecnt");
            if (a >= setting.moveTooMuchLikes) {
                $j(this).closest(".f-single").hide(500)
                    .next(".showhide").remove() // 偶发重复去除
                    .end()
                    .after("<li class='showhide mood'>此条说说因<span>赞超过 " + setting.moveTooMuchLikes + "</span>而被隐藏，点击显示</li>");
            };
        })
    } // 根据赞的数量移除
    if (userSet && userSet.indexOf(true) === -1) return false;
    if (setting.moveStamp) {
        $j(area).find(".img-box:visible img[src*='qzonestyle']")
            .closest(".f-single").hide(500)
            .next(".showhide").remove()
            .end()
            .after("<li class='showhide mood'>此条说说因<span>内容是签到图</span>而被隐藏，点击显示</li>");
    } // 移除签到

    var content = [];
    var multi = [];
    var num = [];
    if (!localStorage.hidePart || localStorage.hidePart === "undefined") return false;
    if (localStorage.hidePart) {
        var target = localStorage.hidePart.split(",");
    }
    if (target === "") return false;
    for (var i = 0; i < target.length; i++) {
        if (target[i].indexOf("+") > -1) {
            multi.push(target[i]); // 获取hidePart中多关键字部分
        } else {
            var temp = target[i].match(/[^\d]/g);
            if (temp) {
                content.push(target[i]); // 获得单关键字部分
            } else {
                num.push(target[i].split(/[^\d]/g).join("")); // 获取数字部分
            }
        }
    }

    // uid 匹配移除
    if (localStorage.userRemark) var userRemark = JSON.parse(localStorage.userRemark);
    else {
        var userRemark = {
            uin: [],
            remark: []
        }
    }
    chrome.runtime.sendMessage({
        getLocalStorage: true
    }, function(response) {
        localStorage.userRemark = response.data;
        userRemark = JSON.parse(response.data); // 获取备注

        var ele = $j(area).find(".c_tx.q_namecard:visible, .f-name.q_namecard:visible,.f-like .item:visible");
        for (var i = 0; i < num.length; i++) {
            for (var j = 0; j < ele.length; j++) {
                if ($j(ele[j]).attr("href")) {
                    var url = $j(ele[j]).attr("href"); // 获得好友空间url
                    var uid = url.split(/[^\d]/g).join(""); // 获得url中的数字部分（QQ号码）
                    if (uid === num[i]) {
                        var remarkShow = "";
                        for (var k = 0; k < userRemark.uin.length; k++) {
                            if (uid == userRemark.uin[k]) {
                                remarkShow = userRemark.remark[k];
                                break;
                            }
                        };
                        var isLike = $j(ele[j]).closest(".f-like")[0];
                        var isReply = $j(ele[j]).closest("[data-type='replyroot']")[0];
                        var isComment = $j(ele[j]).parent().parent().parent("[data-type='commentroot']")[0];
                        if (setting.moveReply && isReply) {
                            $j(isReply).hide(300)
                                .next(".showhide").remove()
                                .end()
                                .after("<li class='showhide comment'>此条评论回复因来自或评论对象是<span>" + remarkShow + " [" + uid + "]" + "</span>而被隐藏，点击显示</li>"); // 移除评论回复
                        } else if (setting.moveComment && isComment) {
                            $j(isComment).hide(300)
                                .next(".showhide").remove()
                                .end()
                                .after("<li class='showhide comment'>此条评论因来自<span>" + remarkShow + " [" + uid + "]" + "</span>而被隐藏，点击显示</li>"); // 移除评论
                        } else if (setting.moveLike && isLike) {
                            $j(ele[j]).fadeOut(); // 移除赞
                        } else if (setting.moveMood) {
                            $j(ele[j]).closest(".f-single").hide(500)
                                .next(".showhide").remove()
                                .end()
                                .after("<li class='showhide mood'>此条说说因来自<span>" + remarkShow + " [" + uid + "]" + "</span>而被隐藏，点击显示</li>");
                        } // 移除说说
                    }
                }
            }
        }
    })

    // 文本匹配移除
    if (content.length !== 0 || multi.length !== 0) {
        if (setting.moveMood) var items = $j(area).find(".f-single:visible");
        if (setting.moveComment || setting.moveReply) var comments = $j(area).find(".comments-content:visible");
    }
    for (var k = 0; k < content.length; k++) {
        $j(items).each(function() {
            var text = $j(this).find(".f-user-info, .f-info, .f-ct-txtimg").text();
            if (text.indexOf(content[k]) > -1) {
                $j(this).hide(500)
                    .next(".showhide").remove()
                    .end()
                    .after("<li class='showhide mood'>此条说说因含有<span>“" + content[k] + "”</span>而被隐藏，点击显示</li>")
            }
        }) // 不为评论内容时移除整体
        $j(comments).each(function() {
            var text = $j(this).text();
            if (text.indexOf(content[k]) > -1) {
                var isReply = $j(this).closest("[data-type='replyroot']")[0];
                var isComment = $j(this).parent().parent("[data-type='commentroot']")[0];
                if (setting.moveReply && isReply) {
                    $j(isReply).hide(300)
                        .next(".showhide").remove()
                        .end()
                        .after("<li class='showhide comment'>此条评论回复因含有<span>“" + content[k] + "”</span>而被隐藏，点击显示</li>"); // 移除评论回复
                }
                if (setting.moveComment && isComment) {
                    $j(isComment).hide(300)
                        .next(".showhide").remove()
                        .end()
                        .after("<li class='showhide comment'>此条评论因含有<span>“" + content[k] + "”</span>而被隐藏，点击显示</li>"); // 移除评论
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
                        $j(this).hide(500)
                            .next(".showhide").remove()
                            .end()
                            .after("<li class='showhide mood'>此条说说因含有<span>“" + arr.length + "个‘" + arr[0] + "’”</span>而被隐藏，点击显示</li>"); // 移除说说主体
                    }
                });
                $j(comments).each(function() {
                    var content = $j(this).text().match(regex);
                    if (content && content.length >= arr.length) {
                        var isReply = $j(this).closest("[data-type='replyroot']")[0];
                        var isComment = $j(this).parent().parent("[data-type='commentroot']")[0];
                        if (setting.moveReply && isReply) {
                            $j(isReply).hide(300)
                                .next(".showhide").remove()
                                .end()
                                .after("<li class='showhide comment'>此条评论回复因含有<span>“" + arr.length + "个‘" + arr[0] + "’”</span>而被隐藏，点击显示</li>"); // 移除评论回复;
                        }
                        if (setting.moveComment && isComment) {
                            $j(isComment).hide(300)
                                .next(".showhide").remove()
                                .end()
                                .after("<li class='showhide comment'>此条评论因含有<span>“" + arr.length + "个‘" + arr[0] + "’”</span>而被隐藏，点击显示</li>"); // 移除评论
                        }
                    }
                });
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
                        $j(this).hide(500)
                            .next(".showhide").remove()
                            .end()
                            .after("<li class='showhide mood'>此条说说因同时含有<span>“" + arr + "”</span>而被隐藏，点击显示</li>"); // 移除说说主体
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
                            $j(isReply).hide(300)
                                .next(".showhide").remove()
                                .end()
                                .after("<li class='showhide comment'>此条评论回复因含有<span>“" + arr + "”</span>而被隐藏，点击显示</li>"); // 移除评论回复
                        }
                        if (setting.moveComment && isComment) {
                            $j(isComment).hide(300)
                                .next(".showhide").remove()
                                .end()
                                .after("<li class='showhide comment'>此条评论因含有<span>“" + arr + "”</span>而被隐藏，点击显示</li>"); // 移除评论
                        }
                    }
                });
            }
        })
    }
}
clearOut();

var moveArea;
$j(document).on("mouseenter",".q_namecard",function() {
    moveArea = $j(this).closest(".f-single");
}).on("click", "#hideNameCard", function() {
    var target = $j("#hideNC").closest("#_qzone_cards").find("#nc_userNickname");
    var remarkAdd = $j(target).text();
    var url = $j(target).attr("href");
    var uin = url.split(/[^\d]/g).join("");
    if (localStorage.hidePart === "undefined" || !localStorage.hidePart) localStorage.hidePart = uin;
    else {
        var checkValid = localStorage.hidePart.split(",");
        for (var i = 0; i < checkValid.length; i++) {
            if (uin == checkValid[i]) {
                $j(this).children().text("已存在的对象").fadeOut().fadeIn().css("cursor", "no-drop");
                return false;
            }
        }
        localStorage.hidePart += "," + uin;
    }
    $j("#qzNameCardDiv").fadeOut();
    $j("body").append("<div class='feed gjw'><i class='gj ui-icon icon-praise'></i></div>");
    setTimeout(function() {
        $j(".gj").addClass("get")
    }, 50);
    setTimeout(function() {
        $j(".gjw").remove()
    }, 1000); // Good Job!
    chrome.runtime.sendMessage({
        hideAdd: localStorage.hidePart,
        remarkAdd: remarkAdd
    });
    clearOut(moveArea);
}).on("click", ".showhide", function() {
    $j(this).prev().show(500).find(".showhide").click()
        .end()
        .end()
        .remove();
}).on("mouseenter", ".qzone-cards", function() {
    $j("#hideNC").remove();
    $j("#_namecard_feed .op-list").append("<div class='op-item' id='hideNC'><div class='right-inner'><a href='javascript:;' id='hideNameCard'><span>屏蔽此用户</span></a></div></div>"); // 资料卡片上添加屏蔽入口
}).on("mouseleave", ".qzone-cards", function() {
    $j("#hideNC").remove();
})
$j("body").append("<style> #hideNameCard {color:#f00}.gj {position: fixed;top: 50%;left: 50%;-webkit-transform: scale(0);z-index: 999;} .gj.get {-webkit-transform: scale(50);opacity: 0;transition: all 1s;} .qzone-cards-app {display: none;}.showhide {margin: 10px 0;padding: 15px;border-radius: 2px;background-color: #fcf8e3;border: 1px solid #faebcc;color: #8a6d3b;font-weight: bold;text-align: center;cursor: pointer;transition: all .3s;}.showhide.comment {padding: 5px;}.showhide span {color: #b94a48;margin: 0 5px;border-bottom: 1px dotted #b94a48;}.showhide.mood:hover {background: #faebcc !important;}</style>");

var page = -4;
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
        clearOut();
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
                chrome.runtime.sendMessage({
                    dataUrl: target
                }); // 获取好友信息网址
                clearInterval(a);
            }
        }, 100)
    };
}
if (urlCheck[1] === "r.qzone.qq.com") {
    var a = eval($j("pre").text().split("_Callback"));
    if (!eval(a[1]) || !eval(a[1]).data) {
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
    chrome.runtime.sendMessage({
        dataLog: JSON.stringify(data)
    });
    setTimeout(function() {
        var getData = confirm("已刷新好友信息，点击确定返回QQ空间");
        if (getData === true) window.close();
    }, 500)
} // 获取好友信息
