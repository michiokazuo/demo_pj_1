let emailLogin, passwordLogin, btnLogin, linkSignUp, nameSignUp, emailSignUp, passwordSignUp, btnSubmitSignUp,
    phoneSignUp, modalSignUp;
let employeeDTO = {
    employee: {},
    taskToEmployees: null
};

$(function () {
    emailLogin = $("#email-login");
    passwordLogin = $("#password-login");
    btnLogin = $("#btn-submit-login");
    linkSignUp = $("#link-sign-up");
    nameSignUp = $("#name");
    emailSignUp = $("#email");
    passwordSignUp = $("#password");
    phoneSignUp = $("#phone");
    btnSubmitSignUp = $("#btn-submit-sign-up");
    modalSignUp = $("#modal-sign-up");

    login();
    signUp();
    submitSignUp();
})

function signUp() {
    linkSignUp.click(async function () {
        modalSignUp.modal("show");
    })
}

function submitSignUp() {
    btnSubmitSignUp.click(async function () {
        let {val: valueName, check: checkName} = checkData(nameSignUp, /./, "Bạn chưa nhập tên nhân viên");
        let {
            val: valueEmailSignUp,
            check: checkEmailSignUp
        } = checkEmail(emailSignUp, "Bạn chưa nhập email đúng định dạng");
        let {
            val: valuePasswordSignUp,
            check: checkPasswordSignUp
        } = checkPassword(passwordSignUp, "Bạn nhập mật khẩu chưa đúng định dạng (tối thiểu 8 kí tự gồm cả số và chữ)");
        let {
            val: valPhone,
            check: checkPhoneNumber
        } = checkPhone(phoneSignUp, "Bạn chưa nhập số điện thoại đúng định dạng");

        if (checkName && checkEmailSignUp && checkPasswordSignUp && checkPhoneNumber) {
            employeeDTO.employee.name = valueName;
            employeeDTO.employee.password = valuePasswordSignUp;
            employeeDTO.employee.phone = valPhone;
            employeeDTO.employee.email = valueEmailSignUp;

            let check = false;
            await employeeInsert(employeeDTO)
                .then(rs => {
                    if (rs.status === 200) {
                        check = true;
                        employeeDTO = rs.data;
                    }
                })
                .catch(e => {
                    console.log(e);
                })

            modalSignUp.modal("hide");
            if (check) {
                alertReport(check, "Đăng ký thành công. Vui lòng đợi giây lát...");
                check = false;
                let formData = new FormData();
                formData.append("username", employeeDTO.employee.email);
                formData.append("password", valuePasswordSignUp);

                await ajaxUploadFormData("/security-login", formData)
                    .then((rs) => {
                        if (rs.status === 200) {
                            check = true;
                            // window.location.href = "/trang-chu";
                        }
                    }).catch(e => {
                        console.log(e);
                    });
                if (check) {
                    alertReport(true, "Đăng nhập thành công");
                    await notify_impl(employeeDTO.employee.email, "Đăng ký thành công",
                        `Chào mừng bạn đến với hệ thống của chúng thôi.<br>
                         Click vào đây để vào <a href="http://localhost:8080/"><b>Trang chủ</b></a><br>
                         Chúc bạn làm việc thật hiệu quả!!!`);
                    window.location.href = "/trang-chu";
                } else
                    alertReport(false, "Có lỗi xảy ra. Vui lòng đăng nhập lại!!!");
            } else
                alertReport(check, "Đăng ký không thành công!!!");
        }
    })
}


function login() {
    btnLogin.click(async function () {
        let {
            val: valueEmailLogin,
            check: checkEmailLogin
        } = checkEmail(emailLogin, "Bạn chưa nhập email đúng định dạng");
        let {
            val: valuePasswordLogin,
            check: checkPasswordLogin
        } = checkPassword(passwordLogin, "Bạn nhập mật khẩu chưa đúng định dạng(tối thiểu 8 kí tự gồm cả số và chữ)");
        if (checkEmailLogin && checkPasswordLogin) {
            let formData = new FormData();
            formData.append("username", valueEmailLogin);
            formData.append("password", valuePasswordLogin);

            let check = false;
            await ajaxUploadFormData("/security-login", formData)
                .then((rs) => {
                    if (rs.status === 200) {
                        check = true;
                        window.location.href = "/trang-chu";
                    }
                }).catch(e => {
                    console.log(e);
                });
            if (check)
                alertReport(true, "Đăng nhập thành công");
            else
                alertReport(false, "Thông tin đăng nhập không chính xác");
        }
    })
}