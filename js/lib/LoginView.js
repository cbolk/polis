var LoginView = function(params) {
    var submit = params.submit;
    var onOk = params.onOk;
    var rootElemId = params.rootElemId;

    var usernameStore = params.usernameStore;
    var tokenStore = params.tokenStore;
    var emailStore = params.emailStore;

    var deregisterCallbacks = $.Callbacks();

    $(".deregister_button").click( function() {
        deregisterCallbacks.fire();
    });

    function render() {
        data = {
            email: emailStore.get(),
            username: usernameStore.get()
        };
        var template = $("#usernameTemplate").html();
        var html;
        if (data.email) {
            html = Mustache.to_html(template, {
                identity: data.email
            });
            $("#deregister_button").show();
            $("#" + rootElemId).hide();
        } else if (data.username) {
            html = Mustache.to_html(template, {
                identity: data.username
            });
            $("#deregister_button").show();
            $("#" + rootElemId).hide();
        } else {
            html = "";
            $("#deregister_button").hide();
            $("#" + rootElemId).show();
        }
        $("#username_label").html(html);
    }

    function get(id) {
        return $("#" + id);
    }
    function getForm() {
        return get(params.formId);
    }
    function getEmail() {
        return get(params.emailFieldId).val();
    }
    function getPassword() {
        return get(params.passwordFieldId).val();
    }
    function getPasswordAgain() { // if needed
        if (params.passwordAgainFieldId) {
            return get(params.passwordAgainFieldId).val();
        } else {
            return null;
        }
    }
    function getRememberMe() {
        return !!get(params.rememberMeFieldId).attr("checked");
    }

    function validateOk() {
        if (getPasswordAgain() !== null) {
            if (getPassword() !== getPasswordAgain()) {
                alert("passwords don't match");
                return false;
            }
        }
        if (getEmail().indexOf("@") === -1) {
            alert("invalid email address");
            return false;
        }
        return true;
    }

    function onError(data) {
        if (data === "polis_err_reg_user_exists") {
            alert("user exists");
        }
        if ("polis_err_reg_user_exists" === data.responseText) {
            alert("user already exists");
        } else {
            alert(data.responseText);
        }
        console.dir(data);
    }

    function onSuccess(data) {
        getForm()[0].reset();
        render(data);
        onOk(data);
        $("#" + rootElemId).removeClass("open");
    }

    function onSubmit() {
        if (!validateOk()){
            return false;
        }
        submit({
            email: getEmail(),
            password: getPassword(),
            rememberMe: getRememberMe()
        }).then( onSuccess, onError);
        return false; // don't let browser handle it.
    }


    $("#" + params.formId).submit(onSubmit);

    return {
        render: render,
        addDeregisterListener: deregisterCallbacks.add
    };
};
