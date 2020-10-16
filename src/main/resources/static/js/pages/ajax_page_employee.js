let btnConfirmSave, btnConfirmDelete, btnAddEmployee, selectSort, textNameSearch, textPositionSearch, btnSearch,
    textName, textPosition, textDepartment, textEmail, textPhone, textTask, numberProgress, tableData, btnProgress,
    textNameProgress;
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
    btnProgress = $("#btn-progress");
    selectSort = $("#sort");
    textNameSearch = $("#name-search");
    textPositionSearch = $("#position-search");
    btnSearch = $("#btn-search");
    textPosition = $("#position");
    textDepartment = $("#department");
    textEmail = $("#email");
    textPhone = $("#phone");
    textTask = $("#progress-task");
    textNameProgress = $("#progress-name");
    numberProgress = $("#progress");
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
    confirmProgressTask();
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
    let rs = `<tr><td colspan='7'><strong>No Data</strong></td></tr>`;

    if (listEmployee && listEmployee.length > 0)
        rs = listEmployee.map((data, index) => {
            let employee = data.employee;
            let taskToEmployees = data.taskToEmployees;

            if (employee) {
                let tmp = ``;
                let first = `<td></td>
                                <td></td>
                                <td></td>`;
                let length = 1;
                if (taskToEmployees && taskToEmployees.length > 0) {
                    length = taskToEmployees.length;

                    // start employee 2
                    for (let i = 0; i < length; i++) {
                        if (i === 0)
                            first = `<td>${dataFilter(taskToEmployees[i].task.name)}</td>
                                <td>${checkProgress(taskToEmployees[i].progress)}</td>
                                <td>
                                    <button type="button" class="btn btn-warning update-progress">
                                        <i class="fas fa-edit"></i> Cập nhật
                                    </button>
                                </td>`;
                        else
                            tmp += `<tr data-index="${index}" data-index-task="${i}">
                                <td>${dataFilter(taskToEmployees[i].task.name)}</td>
                                <td>${checkProgress(taskToEmployees[i].progress)}</td>
                                <td>
                                    <button type="button" class="btn btn-warning update-progress">
                                        <i class="fas fa-edit"></i> Cập nhật
                                    </button>
                                </td>
                            </tr>`;
                    }
                }

                return `<tr data-index="${index}" data-index-task="0">
                                <th scope="row" rowspan="${length}">${index + 1}</th>
                                <td rowspan="${length}">${dataFilter(employee.name)}</td>
                                <td rowspan="${length}">${dataFilter(employee.position)}</td>`
                    + first +
                    `<td rowspan="${length}">
                                    <button type="button" class="btn btn-info update-employee mb-1">
                                        <i class="far fa-eye"></i>
                                        Chi tiết
                                    </button>
                                    <button type="button" class="btn btn-danger delete-employee">
                                        <i class="far fa-trash-alt"></i> Xóa
                                    </button>
                                </td>
                            </tr>` + tmp;
            }
            return ``;
        }).join("");

    tableData.html(rs);
    updateEmployee();
    deleteEmployee();
    progressTask();
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
                await employeeInsert(employeeDTO)
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

function progressTask() {
    $(".update-progress").click(function () {
        indexEmployee = $(this).parents("tr").attr("data-index");
        indexTask = $(this).parents("tr").attr("data-index-task");

        employeeDTO = listEmployee[indexEmployee - 0];
        employee = employeeDTO.employee;

        textNameProgress.val(employee.name);
        textTask.val(employeeDTO.taskToEmployees[indexTask - 0].task.name);
        numberProgress.val(employeeDTO.taskToEmployees[indexTask - 0].progress);

        $("#modal-employee-progress").modal("show");
    });
}

function confirmProgressTask() {
    btnProgress.click(async () => {
        let {val: valProgress, check: checkProgress} = checkData(numberProgress, /^\d+$/, "Bạn chưa nhập tiến độ");

        if (checkProgress) {
            let mess = "Sửa không thành công";
            let check = false;
            if (employeeDTO.taskToEmployees && employeeDTO.taskToEmployees.length > 0) {
                employeeDTO.taskToEmployees = employeeDTO.taskToEmployees.filter((data, index) => {
                    return index === (indexTask - 0);
                });

                employeeDTO.taskToEmployees[0].progress = valProgress - 0;

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
            }

            viewEmployee();
            $("#modal-employee-progress").modal("hide");
            alertReport(check, mess);
        }
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