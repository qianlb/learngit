$(function () {
    $("#levelI").html(GetSelectOption(0, ""));

    function GetOption() {
        var Lang = $("#Lang").val();
        var html = "<option value='0'>All</option>";
        if (Lang == "cn") {
            html = "<option value='0'>全部</option>";
        }
        return html;
    }

    $("#levelI").live("change", function () {
        var levelI = $("#levelI").val();
        $("#levelII").html(GetSelectOption(1, levelI));
        $("#levelIII").html(GetOption());
        $("#levelIV").html(GetOption());
        GetTableList();
    });
    $("#levelII").live("change", function () {
        var levelII = $("#levelII").val();
        $("#levelIII").html(GetSelectOption(2, levelII));
        $("#levelIV").html(GetOption());
        GetTableList();
    });
    $("#levelIII").live("change", function () {
        var levelIII = $("#levelIII").val();
        $("#levelIV").html(GetSelectOption(3, levelIII));
        GetTableList();
    });
    $("#levelIV").live("change", function () {
        GetTableList();
    });

    $("#chose label").live("click", function () {
        //alert($(this).find("input").attr("id"));
        $(this).addClass('active').siblings().removeClass("active");
        GetTableList();
    });

    function GetSelectOption(level, code) {
        //alert(Website.CI.COMPANYTYPE)
        var parameter = "level=" + level + "&code=" + code;
        var html = GetOption();
        $.ajax({
            type: "post",
            url: "/Tools/GetAtcCode",
            async: false,
            datatype: "json",
            data: parameter,
            success: function (json) {
                $.each(json, function (ind, val) {
                    html += "<option  value='" + val.Key + "' >" + val.Value + "</option>";
                });
            }
        });
        return html;
    }
    function GetLastLevelCode() {
        var _this = $("#level select");
        var arr = [];
        for (var i = 0; i < _this.length; i++) {
            var select = _this.eq(i);
            if (select.val() != "0") {
                arr.push(select.val());
            }
        }
        if (arr.length > 0) {
            code = arr[arr.length - 1];
        } else {
            code = "";
        }
        return code;
    }

    function getRequestParam() {
        var json = {};
        json["code"] = GetLastLevelCode();
        //json["type"] = $("#type").val() != "0" ? $("#type").val() : "";
        //json["pageIndex"] = $(".pageBox .customPage").val() || $(".pageBox .active > a").attr("pageid") || 1;
        //json["order"] = $("#sort").val() != "0" ? $("#sort").val() : "";
        return json;
    }

    function GetTableList() {
        var param = getRequestParam();
        if ($("#chose label").eq(0).is(".active")) {
            $.ajax({
                type: "POST",
                url: "/Tools/GetViewByCompany",
                data: param,
                success: function (json) {
                    $("#CIContent").html("").html(json);
                }
            })
        } else {
            $.ajax({
                type: "POST",
                url: "/Tools/GetViewByProduct",
                data: param,
                success: function (json) {
                    $("#CIContent").html("").html(json);
                }
            })
        }
    }

})