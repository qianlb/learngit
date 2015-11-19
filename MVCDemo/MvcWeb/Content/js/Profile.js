function profilePage(param) {
    this.param = param;
}
profilePage.prototype = {
    init: function () {
        this.changePasswordListener();
        this.tabClickListener();
        this.editInformationListener();
        this.updateInformationListener();
    },

    updateInformationListener: function () {
        var _this = this;
        $("#updateInfo").live("click", function () {
            var firstName = $("#inputFirstName").val().trim();
            var middleName = $("#inputMiddleName").val().trim();
            var lastName = $("#inputLastName").val().trim();
            var department = $("#inputDpt").val().trim();
            var title = $("#inputTitle").val().trim();
            var phone = $("#inputPhone").val().trim();
            var mobile = $("#inputMobile").val().trim();
            var sate = $("#inputState").val().trim();
            var address = $("#inputAddress").val().trim();
            var city = $("#inputCity").val().trim();
            var zip = $("#inputZip").val().trim();
            if (firstName.length > 1000) {
                alert("First name is too long!");
                return false;
            }
            if (middleName.length > 1000) {
                alert("Second name is too long!");
                return false;
            }
            if (lastName.length > 1000) {
                alert("Last Name is too long!");
                return false;
            }
            if (department.length > 1000) {
                alert("Department is too long!");
                return false;
            }
            if (title.length > 1000) {
                alert("Title is too long!");
                return false;
            }
            if (phone.length > 1000){
                alert("Phone is too long!");
                return false;
            }
            
            if (mobile.length > 1000) {
                alert("Mobile is too long!");
                return false;
            }
           
            if (sate.length > 1000) {
                alert("State/Province is too long!");
                return false;
            }
            if (address.length > 1000) {
                alert("Address is too long!");
                return false;
            }
            if (city.length > 1000) {
                alert("City/Town is too long!");
                return false;
            }
            if (zip.length > 1000) {
                alert("Zip is too long!");
                return false;
            }
            $("#userInfo").submit();
        })
    },
    CheckIsNumber: function (number) {
        if (/^[0-9]*$/.test(number)) {
            return true;
        } else {
            return false;
        }
    },
    //修改密码
    changePasswordListener: function () {
        $("#templateSubmit").live('click', function (e) {
            e.preventDefault();
            $.ajax({
                url: "/Profile/TemporaryPassword",
                type: "POST",
                data: { onload: false },
                success: function (data) {
                    $("#ChangePassModal .modal-content").html(data);
                }
            });
        });

        $("#forgot").live('click', function () {
            $.ajax({
                url: "/Profile/TemporaryPassword",
                type: "POST",
                data: { onload: true },
                success: function (data) {
                    $("#ChangePassModal .modal-content").html(data);
                }
            });
        })
    },

    editInformationListener: function () {
        //edit
        $("#editInfo").live("click", function () {
            $.ajax({
                url: "/Profile/GetUpdateUserInfo",
                type: "Post",
                success: function (partial) {
                    $("#profileBody .content").eq(0).html(partial);
                }
            })
        })
    },
    tabClickListener: function () {
        var $this = this;
        $(".card-nav a").live("click", function () {
            var _this = $(this),
                index = _this.index(),
                url = "/Profile";
            _this.addClass("active").siblings().removeClass("active");
            $("#profileBody .content").eq(index).show().siblings().hide();
            switch (index) {
                case 0:
                    url = url + "/GetUserInfo";
                    $this.getDataPartial(index, url);
                    break;
                case 1:
                    break;
                case 2:
                    url = url + "/GetUserRightsByUserId";
                    $this.getDataPartial(index, url);
                    break;
            }
        })
    },
    getDataPartial: function (index, url) {
        $.ajax({
            url: url,
            type: "Post",
            success: function (partial) {
                $("#profileBody .content").eq(index).html(partial);
            }
        })
    },

}
$(function () {
    var profileInstance = new profilePage();
    profileInstance.init();
})



