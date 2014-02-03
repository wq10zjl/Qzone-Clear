document.addEventListener('DOMContentLoaded', function() {
    function refresh() {
        if ($(".list i").length !== 0) {
            $(".clearout, .list h4").show();
        } else {
            $(".clearout, .list h4").hide();
        }
        var b = [];
        $(".list i").each(function(i) {
            var text = $(this).text().split("×")[0]; // 过滤空格，获取输入值
            b.push(text);
        });
        if (b[0] === undefined) {
            localStorage.removeItem("hidePart");
            chrome.storage.local.remove("hidePart")
        } else {
            chrome.storage.local.set({
                "hidePart": b
            }); // 获取hidePart，存入chrome.storage
            localStorage.setItem("hidePart", b); // localStorage建立副本
        }
    }

    function addEle(e) {
        var a = $("#input").val();
        var b = a.split(" ").join("");
        var c = b.split("+").join("");
        for (var i = 0; i < e.length; i++) {
            if (a === "" || b === "") {
                alert("请输入内容！");
                return false;
            } else if (a == e[i] || b === e[i]) {
                alert("已存在的对象！");
                return false;
            }
        } // 有效性检测
        if (b.length > 20) {
            alert("输入内容太长了！");
            return false;
        }
        if (b.indexOf("+") === 0 || c.length === 0) {
            alert("输入非法！");
            return false;
        };
        var addon = "<i style='display:none'>" + b + "<span class='close'>×</span><b class='highlight'></b></i>";
        var checkNum = b.match(/[^\d]/g);
        if (checkNum !== null) {
            $(addon).appendTo(".list #content").fadeIn(500);
            $(".list").animate({
                scrollTop: $("#uid").height() + $("#content").height() - 110
            }, "slow"); // 滚动到当前高度
            $(".highlight").delay(500).fadeOut(2000, function() {
                $(this).remove();
            }); // 高亮叠加
        } else {
            $(addon).appendTo(".list #uid").fadeIn(500);
            $(".list").animate({
                scrollTop: $("#uid").height() - 110
            }, "slow");
            $(".highlight").delay(500).fadeOut(2000, function() {
                $(this).remove();
            });
        }
        $("#input").val("");
        refresh();
    } // 显示新元素

    function winOn() {
        chrome.storage.sync.get("backup", function(data) {
            localStorage.setItem("backupCloud", data.backup)
        })
        chrome.storage.sync.get("time", function(data) {
            localStorage.setItem("timeCloud", data.time)
        })
        if (localStorage.getItem("hidePart") === null) return false;
        var items = localStorage.getItem("hidePart").split(",");
        for (i = 0; i < items.length; i++) {
            var checkNum = items[i].match(/[^\d]/g);
            if (checkNum !== null) {
                $(".list #content").append("<i>" + items[i] + "<span class='close'>×</span></i>");
            } else {
                $(".list #uid").append("<i>" + items[i] + "<span class='close'>×</span></i>");
            }
        }
        refresh();
    }
    winOn(); // 获取hidePart，并在extension中显示

    $(".list").on("click", ".close", function() {
        $(this).parents("i").fadeOut(500, function() {
            $(this).remove();
            refresh();
        });
    });
    $("#input").keydown(function(e) {
        if (e.keyCode == 13) {
            var b = $(".list i").text().split("×");
            addEle(b);
        }
        $("#tips").hide(500);
    });
    $(".submit").click(function() {
        var c = $(".list i").text().split("×");
        addEle(c);
    });
    $(".clearout").click(function() {
        var msg = confirm("真的要删除吗？\n\n此操作不可撤销！");
        if (msg === true) {
            $(".list i").remove();
            $(this).hide();
            $(".list h4").hide();
            localStorage.removeItem("hidePart");
            chrome.storage.local.remove("hidePart")
        }
    });
    $("#input").focus(function() {
        $("#tips").show();
        $("#tips").animate({
            top: 40,
            opacity: 1
        })
    });
    $("#input").blur(function() {
        $("#tips").fadeOut(500, function() {
            $(this).css({
                top: 60,
                opacity: 0
            })
        })
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
                localStorage.setItem("hidePart", a);
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
                localStorage.setItem("hidePart", b);
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
        if (!hasValue) {
            sHeight = $(".setting").height();
            maxTop = $(".setting").offset().top;
            maxLeft = $(".setting").offset().left;
            minTop = -maxTop;
            minLeft = -maxLeft;
            hasValue = true;
        }
        var moveLayer = "<div id='moveLayer'><div class='tempMove' style='height:" + sHeight + "px'></div></div>";
        $(moveLayer).appendTo(".stwrap"); // 添加移动叠加层
        posX = e.pageX;
        posY = e.pageY; // 获取鼠标当前位置
        left = parseInt($(".setting").css("left"));
        top = parseInt($(".setting").css("top")); // 获取目标框当前位置
    })
    $(".stwrap").mousemove(function(e) {
        if (flag) {
            $("#moveLayer").fadeIn(200);
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
    $("#donate").click(function() {
        window.open($(this).attr("href"));
    })
    $(".setting, .backinfo").hide();
});
