let btnConfirmSave, btnConfirmDelete, btnAddEmployee, selectSort, textNameSearch, textPositionSearch, btnSearch,
    textName, textPosition, textDepartment, textEmail, textPhone, tableData;
let listEmployee = [];
let listSort = [
    {text: "(A -> Z) Tên", val: "0", field: "name", isASC: "true"},
    {text: "(Z -> A) Tên", val: "0", field: "name", isASC: "false"}
]
let indexEmployee, employeeDTO, employee, indexTask;
let checkAction;

$(async function () {
    textName = $("#name");
    btnConfirmSave = $("#btn-save");
    btnConfirmDelete = $("#btn-delete");
    btnAddEmployee = $("#btn-add-employee");
    selectSort = $("#sort");
    textNameSearch = $("#name-search");
    textPositionSearch = $("#position-search");
    btnSearch = $("#btn-search");
    textPosition = $("#position");
    textDepartment = $("#department");
    textEmail = $("#email");
    textPhone = $("#phone");
    tableData = $("#table-data");

    listSort = listSort.map((data, index) => {
        data.val = index;
        return data;
    });

    await loadEmployee();
    showSelectOption(selectSort, listSort, "Sắp xếp");
    viewEmployee();
    addEmployee();
    searchEmployee();
    sortEmployee();
    confirmDeleteEmployee();
    confirmSaveEmployee();
});

async function loadEmployee() {
    listEmployee = [];
    await employeeFindAll()
        .then(rs => {
            if (rs.status === 200) {
                listEmployee = rs.data;
            }
        })
        .catch(function (e) {
            console.log(e);
        });
}

function viewEmployee() {
    let rs = `<tr><td colspan='5'><strong>No Data</strong></td></tr>`;

    if (listEmployee && listEmployee.length > 0)
        rs = listEmployee.map((data, index) => {
            let employee = data.employee;

            if (employee) {
                return `<tr data-index="${index}">
                                <th scope="row">${index + 1}</th>
                                <td>${dataFilter(employee.name)}</td>
                                <td>${dataFilter(employee.position)}</td>
                                <td><a href="nhan-vien/tien-do-ca-nhan?employeeId=${employee.id}" target="_blank"
                                class="text-decoration-none text-light btn btn-success m-1">
                                    <i class="fas fa-tasks"></i>
                                    <span class="text-light"> Xem </span>
                                </a></td>
                                <td>
                                    <button type="button" class="btn btn-info update-employee mb-1">
                                        <i class="far fa-eye"></i>
                                        Chi tiết
                                    </button>
                                    <button type="button" class="btn btn-danger delete-employee">
                                        <i class="far fa-trash-alt"></i> Xóa
                                    </button>
                                </td>
                            </tr>`;
            }
            return ``;
        }).join("");

    tableData.html(rs);
    updateEmployee();
    deleteEmployee();
}

function addEmployee() {
    btnAddEmployee.click(function () {
        checkAction = false;

        employeeDTO = {};
        employeeDTO.employee = {};
        employeeDTO.taskToEmployees = null;

        $("#modal-employee").modal("show");
    });
}

function updateEmployee() {
    $(".update-employee").click(function () {
        checkAction = true;

        indexEmployee = $(this).parents("tr").attr("data-index");
        employeeDTO = listEmployee[indexEmployee - 0];
        employee = employeeDTO.employee;

        textName.val(employee.name);
        textPosition.val(employee.position);
        textEmail.val(employee.email);
        textPhone.val(employee.phone);
        textDepartment.val(employee.department);

        $("#modal-employee").modal("show");
    });
}

function confirmSaveEmployee() {
    btnConfirmSave.click(async function () {
        let {val: valName, check: checkName} = checkData(textName, /./, "Bạn chưa nhập tên nhân viên");
        let {val: valDepartment, check: checkDepartment} = checkData(textDepartment, /./, "Bạn chưa nhập phòng ban");
        let {val: valPosition, check: checkPosition} = checkData(textPosition, /./, "Bạn chưa nhập chức vụ nhân viên");
        let {val: valPhone, check: checkPhoneNumber} = checkPhone(textPhone, "Bạn chưa nhập số điện thoại");
        let {val: valEmail, check: checkEmailEmployee} = checkEmail(textEmail, "Bạn chưa nhập email");

        if (checkPhoneNumber && checkName && checkDepartment && checkPosition && checkEmailEmployee) {
            employeeDTO.employee.name = valName;
            employeeDTO.employee.department = valDepartment;
            employeeDTO.employee.position = valPosition;
            employeeDTO.employee.phone = valPhone;
            employeeDTO.employee.email = valEmail;

            let mess, check = false;
            if (checkAction) {
                mess = "Sửa không thành công";
                await employeeUpdate(employeeDTO)
                    .then(rs => {
                        if (rs.status === 200) {
                            listEmployee[indexEmployee - 0] = rs.data;

                            mess = "Sửa thành công.";
                            check = true;
                        }
                    })
                    .catch(function (e) {
                        console.log(e);
                    });
            } else {
                mess = "Thêm không thành công!!!";
                await employeeInsert(employeeDTO, 1)// mac dinh la user
                    .then(function (rs) {
                        if (rs.status === 200) {
                            listEmployee.push(rs.data);

                            mess = "Thêm thành công.";
                            check = true;
                        }
                    })
                    .catch(function (e) {
                        console.log(e);
                    });
            }

            viewEmployee();
            selectSort.prop('selectedIndex', 0);
            $("#modal-employee").modal("hide");
            alertReport(check, mess);
        }

    });
}

function deleteEmployee() {
    $(".delete-employee").click(function () {
        indexEmployee = $(this).parents("tr").attr("data-index");
        employeeDTO = listEmployee[indexEmployee - 0];
        employee = employeeDTO.employee;

        $("#modal-delete").modal("show");
    });
}

function confirmDeleteEmployee() {
    btnConfirmDelete.click(async function () {
        let mess = "Xóa không thành công!!!";
        let check = false;

        await employeeDelete(employeeDTO)
            .then(function (rs) {
                if (rs.status === 200) {
                    listEmployee = listEmployee.filter((data, index) => {
                        return index !== (indexEmployee - 0);
                    });

                    mess = "Xóa thành công.";
                    check = true;
                }
            })
            .catch(function (e) {
                console.log(e);
            });

        viewEmployee();
        $("#modal-delete").modal("hide");
        alertReport(check, mess);
    });
}

function searchEmployee() {
    btnSearch.click(async function () {
        await search_sort();
    });
}

function sortEmployee() {
    selectSort.change(async function () {
        await search_sort();
    });
}

async function search_sort() {
    let valNameSearch = textNameSearch.val().trim();
    let valPositionSearch = textPositionSearch.val().trim();

    let indexSort = selectSort.val();
    let sort = listSort[indexSort - 0];

    let q = (valNameSearch === "" ? "" : ("name=" + valNameSearch + "&"))
        + (valPositionSearch === "" ? "" : ("position=" + valPositionSearch + "&"))
        + (sort ? ("field=" + sort.field + "&isASC=" + sort.isASC) : "");

    listEmployee = [];
    await employeeSearchSort(q)
        .then(rs => {
            if (rs.status === 200) {
                listEmployee = rs.data;
            }
        })
        .catch(function (e) {
            console.log(e);
        });

    viewEmployee();
}