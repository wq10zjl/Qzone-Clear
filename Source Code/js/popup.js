document.addEventListener('DOMContentLoaded', function() {
    function refresh() {
        $(".close").click(function() {
            $(this).parents("i").fadeOut(500, function() {
                $(this).remove();
                refresh(); // 回调函数，刷新hidePart
            });
        });
        if ($(".list i").length !== 0) {
            $(".clearout, h4").show();
        } else {
            $(".clearout, h4").hide();
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
        var a = $("input").val();
        var b = $("input").val().split(" ").join("");
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
        $("input").val("");
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

    $("input").keydown(function(e) {
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
            $("h4").hide();
            localStorage.removeItem("hidePart");
            chrome.storage.local.remove("hidePart")
        }
    });
    $("input").focus(function() {
        $("#tips").show();
        $("#tips").animate({
            top: 40,
            opacity: 1
        })
    });
    $("input").blur(function() {
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
                var info = "<div class='title'>数据备份成功！</div><table><tr><td>备份时间：</td><td>" + localStorage.getItem("time") + "</td></tr><tr><td>备份数据：</td><td>" + localStorage.getItem("backup") + "</td></tr></table><p>当 Chrome 登录有账户时，数据会进行同步</p>";
                $(".text").html(info);
                $(".backinfo").fadeIn(1000).delay(1500).fadeOut(1000);
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
                var info = "<div class='title'>数据备份成功！</div><table><tr><td>备份时间：</td><td>" + localStorage.getItem("time") + "</td></tr><tr><td>备份数据：</td><td>" + localStorage.getItem("backup") + "</td></tr></table><p>当 Chrome 登录有账户时，数据会进行同步</p>";
                $(".text").html(info);
                $(".backinfo").fadeIn(1000).delay(1500).fadeOut(1000);
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
                var info = "<div class='title'>本地恢复成功！</div>";
                $(".text").html(info);
                $(".backinfo").fadeIn(1000).delay(1000).fadeOut(1000);
            }
        } else if ((a === null && b !== "undefined") || (a !== null && b !== "undefined")) {
            var restoreCloud = confirm("当前备份数据：\n\n备份位置：云 端\n\n备份时间：" + localStorage.getItem("timeCloud") + "\n\n备份的数据：" + b + "\n\n是否恢复？此操作不可撤销！");
            if (restoreCloud === true) {
                localStorage.setItem("hidePart", b);
                $(".list i").remove();
                winOn();
                var info = "<div class='title'>云端恢复成功！</div>";
                $(".text").html(info);
                $(".backinfo").fadeIn(1000).delay(1000).fadeOut(1000);
            };
        }
    }); // 恢复数据
});
