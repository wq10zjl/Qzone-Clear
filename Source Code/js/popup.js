document.addEventListener('DOMContentLoaded', function() {
    function refresh() {
        $("span").click(function() {
            $(this).parents("i").remove();
            refresh(); // 回调函数，刷新hidePart
        });
        if ($(".list i").length !== 0) {
            $(".clearout, h4").show();
        } else {
            $(".clearout, h4").hide();
        }
        var b = [];
        $(".list i").each(function(i) {
            var text = $(this).text().split("x")[0].split(" ").join(""); // 过滤空格，获取输入值
            b.push(text);
        });
        chrome.storage.local.set({
            "hidePart": b
        }); // 获取hidePart，存入chrome.storage
    }

    function addEle() {
        var a = $("input").val();
        if (a.length>20) {
            alert("输入内容太长了！");
            return false;
        }
        if (isNaN(parseInt(a,10))) {
            $(".list #content").append("<i>" + a + "<span class='close'>x</span></i>");
        } else {
            $(".list #uid").append("<i>" + a + "<span class='close'>x</span></i>");
        }
        $("input").val("");
        refresh();
    } // 显示新元素

    chrome.storage.local.get("hidePart", function(result) {
        var b = result.hidePart;
        for (i = 0; i < b.length; i++) {
            if (isNaN(parseInt(b[i],10))) {
                $(".list #content").append("<i>" + b[i] + "<span class='close'>x</span></i>");
            } else {
                $(".list #uid").append("<i>" + b[i] + "<span class='close'>x</span></i>");
            }
        }
        refresh();
    }) // 获取hidePart，并在extension中显示

    $("input").keydown(function(e) {　
        if (e.keyCode == 13) {
            var check = $(".list i").text().split("x");
            for (var i = 0; i < check.length; i++) {
                if ($("input").val() === "" || $("input").val().split(" ").join("") === "") {
                    alert("请输入内容！");
                    return false;
                } else if ($("input").val() == check[i]) {
                    alert("已存在的对象！");
                    return false;
                }
            } // 重复性检测
            addEle();
        }
    });
    $(".submit").click(function() {
        var check = $(".list i").text().split("x");
        for (var i = 0; i < check.length; i++) {
            if ($("input").val() === "" || $("input").val().split(" ").join("") === "") {
                alert("请输入内容！");
                return false;
            } else if ($("input").val() == check[i]) {
                alert("已存在的对象！");
                return false;
            }
        }
        addEle();
    });
    $(".clearout").click(function() {
        var msg = confirm("真的要删除吗？");
        if (msg === true) {
            $(".list i").remove();
            $(this).hide();
            $("h4").hide();
            chrome.storage.local.set({
                "hidePart": ""
            }); // 清空hidePart
        }
    });
});
