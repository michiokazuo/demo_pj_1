let btnConfirmSave, textName, textPassword, textEmail, textPhone, tableData, textPosition;

let employeeDTO = {}, employee = {};

$(async function () {
    textName = $("#name");
    btnConfirmSave = $("#btn-save");
    textPassword = $("#password");
    textEmail = $("#email");
    textPhone = $("#phone");
    tableData = $("#table-data");
    textPosition = $("#position");

    await loadEmployee();
    viewEmployee();
    confirmSaveEmployee();
});

async function loadEmployee() {
    listEmployee = [];
    await employeeFindById()
        .then(rs => {
            if (rs.status === 200) {
                employeeDTO = rs.data;
                employee = employeeDTO.employee;
            }
        })
        .catch(function (e) {
            console.log(e);
        });
}

function viewEmployee() {
    let rs = `<tr><td colspan='5'><strong>No Data</strong></td></tr>`;

    if (employee) {
        rs = `<tr>
                        <th>Tên</th>
                        <td>${employee.name}</td>
                   </tr><tr>
                        <th>Email</th>
                        <td>${employee.email}</td>
                   </tr><tr>
                        <th>SĐT</th>
                        <td>${employee.phone}</td>
                   </tr><tr>
                        <th>Chức Vụ</th>
                        <td>${employee.role.content}</td>
                   </tr><tr>
                        <th>Mật khẩu</th>
                        <td><input class="form-control w-50 m-auto" type="password" readonly disabled value="${employee.password}"/></td>
                   </tr>`;
    }

    tableData.html(rs);
    updateEmployee();
}

function updateEmployee() {
    $(".update-employee").click(function () {
        textName.val(employee.name);
        textEmail.val(employee.email);
        textPhone.val(employee.phone);
        textPosition.val(employee.role.content);

        $("#modal-employee").modal("show");
    });
}

function confirmSaveEmployee() {
    btnConfirmSave.click(async function () {
        let {val: valName, check: checkName} = checkData(textName, /./, "Bạn chưa nhập tên nhân viên");
        let {val: valPhone, check: checkPhoneNumber} = checkPhone(textPhone, "Bạn chưa nhập số điện thoại");
        let {val: valEmail, check: checkEmailEmployee} = checkEmail(textEmail, "Bạn chưa nhập email");
        let {val: valPassword, check: checkPasswordUpdate} = checkPassword(textPassword, "Bạn nhập mật khẩu chưa đúng định dạng(tối thiểu 8 kí tự gồm cả số và chữ)");


        if (checkPhoneNumber && checkName && checkEmailEmployee && checkPasswordUpdate) {
            employeeDTO.employee.name = valName;
            employeeDTO.employee.phone = valPhone;
            employeeDTO.employee.email = valEmail;
            employeeDTO.employee.password = valPassword;

            let mess = "Sửa không thành công", check = false;
            await employeeUpdate(employeeDTO)
                .then(rs => {
                    if (rs.status === 200) {
                        employeeDTO = rs.data;
                        employee = employeeDTO.employee;
                        $("#name-login").html(employee.name);
                        mess = "Sửa thành công.";
                        check = true;
                    }
                })
                .catch(function (e) {
                    console.log(e);
                });

            viewEmployee();
            $("#modal-employee").modal("hide");
            alertReport(check, mess);
        }

    });
}