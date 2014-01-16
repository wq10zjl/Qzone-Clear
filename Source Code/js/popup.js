document.addEventListener('DOMContentLoaded', function() {
    function refresh() {
        $("span").click(function() {
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
        chrome.storage.local.set({
            "hidePart": b
        }); // 获取hidePart，存入chrome.storage
        localStorage.setItem("hidePart", b); // localStorage建立副本
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
            $(".highlight").delay(500).fadeOut(2000, function() {
                $(".highlight").remove();
            });
        } else {
            $(addon).appendTo(".list #uid").fadeIn(500);
            $(".highlight").delay(500).fadeOut(2000, function() {
                $(".highlight").remove();
            });
        }
        $("input").val("");
        refresh();
    } // 显示新元素

    function winOn() {
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
            chrome.storage.local.set({
                "hidePart": ""
            });
        }
    });
    $("input").focus(function() {
        $("#tips").fadeIn();
    });
    $("input").blur(function() {
        $("#tips").fadeOut();
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
                alert("备份成功！\n\n备份时间：" + localStorage.getItem("time") + "\n\n备份的数据：" + localStorage.getItem("backup"));
            }
        } else {
            var cover = confirm("已存在备份数据：\n\n备份时间："+localStorage.getItem("time")+"\n\n备份的数据：" + localStorage.getItem("backup")+"\n\n是否覆盖？此操作不可撤销！");
            if (cover === true) {
                if (data === null || data === "null") {
                    alert("备份失败，请检查数据是否为空！");
                    return false;
                }
                localStorage.setItem("backup", data);
                localStorage.setItem("time", Date());
                alert("新建备份成功！\n\n备份时间：" + localStorage.getItem("time") + "\n\n备份的数据：" + localStorage.getItem("backup"));
            }
        }
    }); // 备份数据
    $(".restore").click(function() {
        var a = localStorage.getItem("backup");
        var data = localStorage.getItem("hidePart");
        if (a === null) {
            alert("没有发现备份数据，操作将取消！");
            return false;
        }
        var restore = confirm("当前备份数据：\n\n备份时间："+localStorage.getItem("time")+"\n\n备份的数据：" + localStorage.getItem("backup")+"\n\n是否恢复？此操作不可撤销！");
        if (restore === true) {
            localStorage.setItem("hidePart",a);
            winOn();
            alert("恢复数据成功！");
        }
    }); // 恢复数据
});
