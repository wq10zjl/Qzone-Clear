$(document).ready(function() {
    if (localStorage.userInfo) {
        var userInfo = JSON.parse(localStorage.userInfo);
        var avatar = userInfo.avatar,
            uin = userInfo.uin,
            name = userInfo.name,
            remark = userInfo.remark;
    }
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

    function refresh() {
        if ($(".list i").length !== 0) {
            $(".clearout, .list h4").show();
        } else {
            $(".clearout, .list h4").hide();
        }
        var b = [];
        $(".list i").each(function(i) {
            if (!$(this).data("uin")) return false;
            var text = $(this).data("uin").toString(); // 获取项目值
            b.push(text);
        });
        if (b[0] === undefined) {
            localStorage.removeItem("hidePart");
            chrome.storage.local.remove("hidePart");
        } else {
            chrome.storage.local.set({
                "hidePart": b
            }); // 获取hidePart，存入chrome.storage
            localStorage.hidePart = b; // localStorage建立副本
        }
        var userRemarkSave = {
            uin: [],
            remark: []
        }
        $("#uin i").each(function() {
            userRemarkSave.uin.push($(this).data("uin"));
            userRemarkSave.remark.push($(this).children(".content").text())
        });
        var saveRemark = JSON.stringify(userRemarkSave);
        localStorage.userRemark = saveRemark;
        chrome.storage.local.set({
            "userRemark": saveRemark
        }); // 获取hidePart，存入chrome.storage
    }

    function addEle(value, showName) {
        localStorage.removeItem("lastInput");
        var a = value.split(" ").join("");
        var b = [];
        $(".list i").each(function() {
            b.push($(this).data("uin").toString())
        })
        for (var i = 0; i < b.length; i++) {
            if (value === "" || a === "") {
                alert("请输入内容！");
                return false;
            } else if (value === b[i] || a === b[i]) {
                alert("已存在的对象！");
                return false;
            }
        } // 有效性检测
        if (a.length > 20) {
            alert("输入内容太长了！");
            return false;
        }
        if (a.indexOf("+") === 0) {
            alert("输入非法！");
            return false;
        };
        $("#input").val("");
        $("#friInfo").fadeOut(function() {
            $(this).html("")
        });
        var checkTxt = a.match(/[^\d]/g);
        if (!checkTxt && !showName && uin) {
            for (var i = 0; i < uin.length; i++) {
                if (a == uin[i]) {
                    if (remark[i]) showName = remark[i];
                    else showName = name[i];
                    break;
                }
            }
        }
        if (showName) {
            var addon = "<i style='display:none' data-uin='" + a + "'><span class='content'>" + showName + "</span><span class='close'>×</span><b class='highlight'></b></i>";
        } else {
            var addon = "<i style='display:none' data-uin='" + a + "'><span class='content'>" + a + "</span><span class='close'>×</span><b class='highlight'></b></i>";
        }
        if (checkTxt) {
            $(addon).appendTo(".list #content").fadeIn(500);
            $(".list").animate({
                scrollTop: $("#uin").height() + $("#content").height() - 110
            }, "slow"); // 滚动到当前高度
            $(".highlight").delay(500).fadeOut(2000, function() {
                $(this).remove();
            }); // 高亮叠加
        } else {
            $(addon).appendTo(".list #uin").fadeIn(500);
            $(".list").animate({
                scrollTop: $("#uin").height() - 110
            }, "slow");
            $(".highlight").delay(500).fadeOut(2000, function() {
                $(this).remove();
            });
        }
        $("#input").val("");
        refresh();
    } // 显示新元素

    function getFri(inputValue) {
        if (!localStorage.userInfo) return false;
        if (inputValue === "" || inputValue.split(" ").join("") === "") {
            $("#friInfo").html("");
            return false;
        }
        var t = [];
        var inset = "";
        var isTxt = inputValue.match(/[^\d]/g);
        if (isTxt) {
            for (var i = 0; i < remark.length; i++) {
                if (name[i].toString().indexOf(inputValue) > -1 || remark[i].toString().indexOf(inputValue) > -1) t.push(i);
                if (t.length >= 8) break;
            }
        } else {
            for (var i = 0; i < uin.length; i++) {
                if (uin[i].toString().indexOf(inputValue) === 0) t.push(i);
                if (t.length >= 8) break;
            }
        }
        for (var j = 0; j < t.length; j++) {
            var count = t[j];
            var avatarShow = avatar[count],
                uinShow = uin[count],
                nameShow = name[count],
                remarkShow = remark[count];
            if (remarkShow) {
                inset += "<li><img src=" + avatarShow + ">" + remarkShow + " [" + nameShow + "] " + " (" + uinShow + ") " + "</li>"
            } else {
                inset += "<li><img src=" + avatarShow + ">" + nameShow + " (" + uinShow + ") " + "</li>"
            }
        }
        $("#friInfo").html(inset);
        $("#friInfo li:first").addClass("active");
    } // 获取好友信息

    function winOn() {
        chrome.storage.sync.get("backup", function(data) {
            localStorage.setItem("backupCloud", data.backup)
        })
        chrome.storage.sync.get("time", function(data) {
            localStorage.setItem("timeCloud", data.time)
        })
        if (localStorage.getItem("hidePart") === null) return false;
        if (localStorage.lastInput) $("#input").val(localStorage.lastInput);
        var items = localStorage.getItem("hidePart").split(",");
        for (i = 0; i < items.length; i++) {
            var isTxt = items[i].match(/[^\d]/g);
            if (isTxt) {
                $(".list #content").append("<i data-uin='" + items[i] + "'><span class='content'>" + items[i] + "</span><span class='close'>×</span></i>");
            } else {
                var innerText = items[i];
                if (uin && localStorage.updated === "true") {
                    for (var j = 0; j < uin.length; j++) {
                        if (items[i] == uin[j]) {
                            if (remark[j] !== "") innerText = remark[j];
                            else innerText = name[j];
                            break;
                        }
                    } // 获取好友数据后刷新本地数据
                    for (var j = 0; j < edited.uin.length; j++) {
                        if (items[i] == edited.uin[j]) {
                            innerText = edited.remark[j];
                            break
                        }
                    } // 叠加用户修改过的部分以免被覆盖
                } else if (userRemark.uin.length > 0) {
                    for (var k = 0; k < userRemark.uin.length; k++) {
                        if (items[i] == userRemark.uin[k]) {
                            innerText = userRemark.remark[k];
                            break
                        }
                    }
                }
                $(".list #uin").append("<i data-uin='" + items[i] + "'><span class='content'>" + innerText + "</span><span class='close'>×</span></i>");
            }
        }
        localStorage.updated = false;
        refresh();
    }
    winOn(); // 获取hidePart，并在extension中显示

    $(".list").on("click", ".close", function() {
        var item = $(this).parent();
        var compare = $(item).data("uin");
        for (var i = 0; i < edited.uin.length; i++) {
            if (compare == edited.uin[i]) {
                edited.uin.splice(i, 1);
                edited.remark.splice(i, 1);
                break;
            }
        } // 刷新被修改的部分
        localStorage.edited = JSON.stringify(edited);
        $("#tooltip").fadeOut(500, function() {
            $(this).remove()
        });
        $(item).fadeOut(500, function() {
            $(this).remove();
            refresh();
        });
    }).on("mouseenter", "#uin i", function() {
        var text = $(this).data("uin");
        if ($(this).children(".content").text() == text) {
            text = "双击以修改备注"
        }
        var left = $(this).offset().left;
        var top = $(this).offset().top;
        $("body").append('<div id="tooltip">' + text + "</div>"); // 创建提示框,添加到页面中
        $("#tooltip").css({
            "left": left,
            "top": top + 45
        }).fadeIn();
    }).on("mouseleave", "#uin i", function() {
        $("#tooltip").remove();
    })

    $("#input").keydown(function(e) {
        if (e.keyCode === 38) {
            if ($("#friInfo .active").prev()[0]) {
                $("#friInfo .active").removeClass("active").prev().addClass("active");
            } else {
                $("#friInfo .active").removeClass("active");
                $("#friInfo li:last").addClass("active");
            }
            return false;
        }
        if (e.keyCode === 40) {
            if ($("#friInfo .active").next()[0]) {
                $("#friInfo .active").removeClass("active").next().addClass("active");
            } else {
                $("#friInfo .active").removeClass("active");
                $("#friInfo li:first").addClass("active");
            }
            return false;
        }
        if (e.ctrlKey && e.keyCode === 13 || e.keyCode === 10) {
            addEle($(this).val());
            $(this).blur().focus()
            return false;
        } // CTRL + Enter to Submit
        if (e.keyCode === 13 || e.keyCode === 10) {
            $("#friInfo .active").click();
            $(this).blur().focus()
        } // Enter to Select & Submit
    }).keyup(function(e) {
        if (e.keyCode === 38 || e.keyCode === 40) return false;
        var value = $(this).val();
        getFri(value);
        if ($("#friInfo li")[0]) {
            $(this).attr("placeholder", "方向键选择条目，回车提交");
        } else if ($(this).val().split(" ").join("") !== "") {
            $(this).attr("placeholder", "CTRL + 回车 提交");
        } else {
            $(this).attr("placeholder", "多关键字请用 + 隔开");
        }
    }).focus(function() {
        $(this).attr("placeholder", "多关键字请用 + 隔开").keyup();
        var value = $(this).val();
        getFri(value);
        $("#friInfo").fadeIn();
    }).blur(function() {
        $(this).attr("placeholder", "输入好友QQ号码、备注名称或关键词");
        $("#friInfo").fadeOut();
        localStorage.lastInput = $(this).val();
    });

    $("#friInfo").on("mouseover", "li", function() {
        $(this).addClass("active").siblings().removeClass("active");
    }).on("click", "li", function() {
        var uin = $(this).text().split("(")[1].split(")")[0];
        var remark = $(this).text().split(" ")[0];
        addEle(uin, remark);
    }) // 通过好友信息添加

    $(".submit").click(function() {
        addEle($("#input").val());
    });
    $(".clearout").click(function() {
        var msg = confirm("真的要删除吗？\n\n此操作不可撤销！");
        if (msg === true) {
            $(".list i").remove();
            $(this).hide();
            $(".list h4").hide();
            localStorage.removeItem("hidePart");
            chrome.storage.local.remove("hidePart");
        }
    });
    $(".toggle span").click(function() {
        var text = $(this).text();
        $(this).text(text === "备份 / 还原" ? "收起面板" : "备份 / 还原");
        $(".inner").slideToggle();
        $(".toggle").toggleClass("active");
    });
    $(".backup").click(function() {
        var a = localStorage.getItem("backup");
        var data = localStorage.getItem("hidePart");
        if (a === null) {
            var msgDataNull = confirm("当前没有备份\n是否建立新备份？");
            if (msgDataNull === true) {
                if (data === null) {
                    alert("备份失败，请检查数据是否为空！");
                    return false;
                }
                localStorage.setItem("backup", data);
                localStorage.setItem("time", Date());
                chrome.storage.sync.set({
                    "backup": data,
                    "time": Date()
                })
                var info = "<table><tr><td>备份时间：</td><td>" + localStorage.getItem("time") + "</td></tr><tr><td>备份数据：</td><td>" + localStorage.getItem("backup") + "</td></tr></table>";
                $(".backinfo p").show();
                $(".text").html(info);
                $(".title").text("数据备份成功！");
                $(".backinfo").css("opacity", 0)
                    .slideDown("slow")
                    .animate({
                        "opacity": 1
                    }, {
                        queue: false,
                        duration: "slow"
                    }).delay(1500).fadeOut(1000);
            }
        } else {
            var cover = confirm("已存在备份数据：\n\n备份时间：" + localStorage.getItem("time") + "\n\n备份的数据：" + localStorage.getItem("backup") + "\n\n是否覆盖？此操作不可撤销！");
            if (cover === true) {
                if (data === null || data === "null") {
                    alert("备份失败，请检查数据是否为空！");
                    return false;
                }
                localStorage.setItem("backup", data);
                localStorage.setItem("time", Date());
                chrome.storage.sync.set({
                    "backup": data,
                    "time": Date()
                })
                var info = "<table><tr><td>备份时间：</td><td>" + localStorage.getItem("time") + "</td></tr><tr><td>备份数据：</td><td>" + localStorage.getItem("backup") + "</td></tr></table>";
                $(".backinfo p").show();
                $(".text").html(info);
                $(".title").text("数据备份成功！");
                $(".backinfo").css("opacity", 0)
                    .slideDown("slow")
                    .animate({
                        "opacity": 1
                    }, {
                        queue: false,
                        duration: "slow"
                    }).delay(1500).fadeOut(1000);
            }
        }
    }); // 备份数据
    $(".restore").click(function() {
        var a = localStorage.getItem("backup");
        var b = localStorage.getItem("backupCloud");
        var data = localStorage.getItem("hidePart");
        if (a === null && b === "undefined") {
            alert("本地和云端都没有发现备份数据，操作将取消！");
            return false;
        } else if (a !== null && b === "undefined") {
            var restoreLocal = confirm("当前备份数据：\n\n备份位置：本 地\n\n备份时间：" + localStorage.getItem("time") + "\n\n备份的数据：" + a + "\n\n是否恢复？此操作不可撤销！");
            if (restoreLocal === true) {
                localStorage.hidePart = a;
                localStorage.updated = true;
                $(".list i").remove();
                winOn();
                $(".backinfo p").hide();
                $(".text").html("");
                $(".title").text("本地恢复成功！");
                $(".backinfo").fadeIn(1000).delay(1000).fadeOut(1000);
            }
        } else if ((a === null && b !== "undefined") || (a !== null && b !== "undefined")) {
            var restoreCloud = confirm("当前备份数据：\n\n备份位置：云 端\n\n备份时间：" + localStorage.getItem("timeCloud") + "\n\n备份的数据：" + b + "\n\n是否恢复？此操作不可撤销！");
            if (restoreCloud === true) {
                localStorage.hidePart = b;
                localStorage.updated = true;
                $(".list i").remove();
                winOn();
                $(".backinfo p").hide();
                $(".text").html("");
                $(".title").text("云端恢复成功！");
                $(".backinfo").fadeIn(1000).delay(1000).fadeOut(1000);
            };
        }
    }); // 恢复数据

    // 设置选项
    var userSet;
    var setting;
    userSet = localStorage.setting;
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
    } // 初始化设置

    function init() {
        $("input[type='checkbox']").each(function() {
            var a = $(this).attr("id");
            $(this)[0].checked = setting[a];
        })
        var ifTooMuch = setting.moveTooMuchLikes;
        if (ifTooMuch) {
            $("#moveTooMuchLikes").val(ifTooMuch);
            $(".range").html("移除赞多于 <b>" + ifTooMuch + "</b> 的说说");
        } else {
            $("#moveTooMuchLikes").val(0);
            $(".range").text("不根据赞的数量移除说说")
        }
    }

    function save() {
        $("input[type='checkbox']").each(function() {
            var a = $(this).attr("id");
            setting[a] = $(this)[0].checked;
        })
        var tooMuch = $("#moveTooMuchLikes").val();
        if (tooMuch != 0) {
            setting.moveTooMuchLikes = tooMuch;
        } else {
            setting.moveTooMuchLikes = false
        }
        var saveData = JSON.stringify(setting);
        localStorage.setting = saveData;
        chrome.storage.local.set({
            "setting": saveData
        })
    }
    $("#moveTooMuchLikes").change(function() {
        var a = $(this).val();
        if (a > 0) $(".range").html("移除赞多于 <b>" + a + "</b> 的说说");
        else $(".range").text("不根据赞的数量移除说说")
    })
    $("#submit").click(function() {
        save();
        $("body").removeClass("on");
        $(".setting").slideUp(300);
        $(".stwrap").fadeOut(500, function() {
            $(".backinfo p").hide();
            $(".text").html("");
            $(".title").text("设置已保存！");
            $(".backinfo").fadeIn(500).delay(1000).fadeOut(1000);
        });
    });
    $("#cancel,#closex,.closeLayer").click(function() {
        $("body").removeClass("on");
        $(".stwrap").animate({
            "bottom": -550,
            "opacity": 0
        }, 500, function() {
            $(".setting").hide()
            $(this).css({
                "display": "none",
                "bottom": 0,
                "opacity": 1
            })
        });
    })
    $("#submit").mousedown(function() {
        $(this).addClass("focus");
        $("#cancel").removeClass("focus");
    })
    $("#cancel").mousedown(function() {
        $(this).addClass("focus");
        $("#submit").removeClass("focus");
    })

    // 可移动框
    var sHeight, left, top, posX, posY, minTop, maxTop, minLeft, maxLeft, flag, hasValue;
    $(".setting h4").mousedown(function(e) {
        flag = true;
        posX = e.pageX;
        posY = e.pageY; // 获取鼠标当前位置
        left = parseInt($(".setting").css("left"));
        top = parseInt($(".setting").css("top")); // 获取目标框当前位置
        if (!hasValue) {
            sHeight = $(".setting").height();
            maxTop = $(".setting").offset().top;
            maxLeft = $(".setting").offset().left;
            minTop = -maxTop;
            minLeft = -maxLeft;
            hasValue = true;
        }
        var moveLayer = "<div id='moveLayer'><div class='tempMove'><span class='moveTip'>拖动改变位置</span></div></div>";
        $(moveLayer).appendTo(".stwrap").fadeIn(200);
        $(".tempMove").css({
            "height": sHeight,
            "left": left,
            "top": top
        }) // 添加移动叠加层

    })
    $(".stwrap").mousemove(function(e) {
        if (flag) {
            offsetX = e.pageX - posX + left;
            offsetY = e.pageY - posY + top; // 获取鼠标移动偏移量
            $(".tempMove").css({
                "left": offsetX,
                "top": offsetY
            })
            if (offsetX < minLeft) $(".tempMove").css("left", minLeft);
            if (offsetX > maxLeft) $(".tempMove").css("left", maxLeft);
            if (offsetY < minTop) $(".tempMove").css("top", minTop);
            if (offsetY > maxTop) $(".tempMove").css("top", maxTop); // 移动叠加层模拟框
        }
    }).mouseup(function() {
        if (flag) {
            $("#moveLayer").fadeOut(500, function() {
                $(this).remove();
            });
            var curLeft = parseInt($(".tempMove").css("left"));
            var curTop = parseInt($(".tempMove").css("top")); // 获取模拟框位置
            $(".setting").animate({
                "left": curLeft,
                "top": curTop
            }) // 移动目标框
            flag = false;
        }
    })

    $("#openSet").click(function(event) {
        event.preventDefault();
        init();
        $("body").addClass("on");
        $("#submit").addClass("focus");
        $("#cancel").removeClass("focus")
        $(".stwrap").fadeIn();
        $(".setting").slideDown();
    })
    $("#getFri").click(function() {
        if (localStorage.dataUrl) {
            var a = confirm("是否允许获取好友信息？\n\nPS: 该信息只保留在本地，不会外泄！");
            if (a === true) window.open(localStorage.dataUrl)
        } else {
            alert("尚未获取到好友信息位置，请稍后重试！\n\n若多次出现该提示，请刷新页面后再试。")
        }
    })

    var original;
    $("#uin").on("click", ".content", function() {
        $("[contenteditable=true]").removeAttr("contenteditable");
        $(this).attr("contenteditable", "true")
            .focus(function() {
                $(this).parent().addClass("editable");
                $("#tooltip").fadeOut();
                original = $(this).text();
            })
    }).on("blur", ".content", function() {
        $(this).removeAttr("contenteditable").parent().removeClass("editable");
        var curRemark = $(this).text();
        if (curRemark === original) return false;
        var curUin = $(this).parent().data("uin");
        if (edited.uin.length === 0) {
            edited.uin.push(curUin);
            edited.remark.push(curRemark)
        } else {
            var hasItem = false;
            for (var i = 0; i < edited.uin.length; i++) {
                if (curUin == edited.uin[i]) {
                    edited.remark[i] = curRemark;
                    hasItem = true;
                    break;
                }
            }
            if (!hasItem) {
                edited.uin.push(curUin);
                edited.remark.push(curRemark)
            }
        }
        localStorage.edited = JSON.stringify(edited)
        refresh();
    }) // 自定义备注
    $(".setting, .backinfo").hide();
    if (localStorage.userInfo) $("#getFri").text("刷新我的好友信息");
});
