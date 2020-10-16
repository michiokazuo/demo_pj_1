let selectTask, selectEmployee, btnConfirmSave, btnConfirmDelete, btnAdd, textNameTask, textNameEmployee, tableData,
    btnSearch;

let listTaskToEmployee = [];
let listTask = [];
let listEmployee = [];
let indexTask, indexTTE, taskToEmployee;

$(async function () {
    selectTask = $("#task");
    selectEmployee = $("#employee");
    btnAdd = $("#btn-add");
    btnConfirmSave = $("#btn-save");
    btnConfirmDelete = $("#btn-delete");
    textNameTask = $("#task-search");
    textNameEmployee = $("#employee-search");
    btnSearch = $("#btn-search");
    tableData = $("#table-data");

    await loadTaskToEmployee();
    await loadTask();
    await loadEmployee();
    viewLink();
    showPartLink(selectTask, listTask, "công việc");
    showPartLink(selectEmployee, listEmployee, "nhân viên");
    addLink();
    confirmSaveLink();
    confirmDeleteLink();
    search();

    $('select').selectize({
        sortField: 'text'
    });
});

async function loadTaskToEmployee() {
    listTaskToEmployee = [];
    await taskToEmployeeFindAll()
        .then(rs => {
            if (rs.status === 200) {
                listTaskToEmployee = rs.data;
            }
        })
        .catch(function (e) {
            console.log(e);
        });
}

async function loadTask() {
    listTask = [];
    await findAllTask()
        .then(rs => {
            if (rs.status === 200) {
                listTask = rs.data;
            }
        })
        .catch(function (e) {
            console.log(e);
        });
}

async function loadEmployee() {
    listEmployee = [];
    await findAllEmployee()
        .then(rs => {
            if (rs.status === 200) {
                listEmployee = rs.data;
            }
        })
        .catch(function (e) {
            console.log(e);
        });
}

function viewLink() {
    let rs = `<tr><td colspan='4'><strong>No Data</strong></td></tr>`;

    if (listTaskToEmployee && listTaskToEmployee.length > 0) {
        rs = listTaskToEmployee.map((data, index) => {
            let task = data.task;
            let taskToEmployees = data.taskToEmployees;

            if (task) {
                let tmp = ``;
                let first = `<td></td><td></td>`;
                let length = 1;
                if (taskToEmployees && taskToEmployees.length > 0) {
                    length = taskToEmployees.length;

                    // start employee 2
                    for (let i = 0; i < length; i++) {
                        if (i === 0)
                            first = `<td>${dataFilter(taskToEmployees[i].employee.name)}</td>
                                <td>
                                    <button type="button" class="btn btn-danger delete-link">
                                        <i class="far fa-trash-alt"></i> Xóa
                                    </button>
                                </td>`;
                        else
                            tmp += `<tr data-index="${index}" data-index-employee="${i}">
                                <td>${dataFilter(taskToEmployees[i].employee.name)}</td>
                                <td>
                                    <button type="button" class="btn btn-danger delete-link">
                                        <i class="far fa-trash-alt"></i> Xóa
                                    </button>
                                </td>
                            </tr>`;
                    }
                }

                return `<tr data-index="${index}" data-index-employee="0">
                                <th scope="row" rowspan="${length}">${index + 1}</th>
                                <td rowspan="${length}">${dataFilter(task.name)}</td>`
                    + first +
                    `</tr>` + tmp;
            }
            return ``;
        }).join("");
    }

    tableData.html(rs);
    deleteLink();
}

function addLink() {
    btnAdd.click(function () {
        taskToEmployee = {};
        taskToEmployee.id = {};
        taskToEmployee.deleted = false;
        taskToEmployee.progress = 0;
        taskToEmployee.employee = {};
        taskToEmployee.task = {};

        $("#modal-task-employee").modal("show");
    });
}


function confirmSaveLink() {
    btnConfirmSave.click(async function () {
        let {val: valTask, check: checkTask} = checkData(selectTask, /^\d+$/, "Bạn chưa chọn công việc");
        let {val: valEmployee, check: checkEmployee} = checkData(selectEmployee, /^\d+$/, "Bạn chưa chọn nhân viên");

        if (checkEmployee && checkTask) {
            let task = listTask[valTask - 0];
            let employee = listEmployee[valEmployee - 0];

            let mess = "Thêm không thành công!!!";
            let check = false;

            if (task && employee) {
                taskToEmployee.id.employeeId = employee.id;
                taskToEmployee.id.taskId = task.id;
                taskToEmployee.employee = employee;
                taskToEmployee.task = task;

                await taskToEmployeeInsert(taskToEmployee)
                    .then(rs => {
                        if (rs.status === 200) {
                            mess = "Thêm không thành công.";
                            check = true;
                        }
                    })
                    .catch(function (e) {
                        console.log(e);
                    });
            }

            viewLink();
            $("#modal-task-employee").modal("hide");
            alertReport(check, mess);
        }
    });
}

function deleteLink() {
    $(".delete-link").click(function () {
        indexTask = $(this).parents("tr").attr("data-index");
        indexTTE = $(this).parents("tr").attr("data-index-employee");

        taskToEmployee = listTaskToEmployee[indexTask - 0].taskToEmployees[indexTTE - 0];
        $("#modal-delete").modal("show");
    });
}

function confirmDeleteLink() {
    btnConfirmDelete.click(async function () {
        let mess = "Xóa không thành công!!!";
        let check = false;

        if (taskToEmployee) {
            await taskToEmployeeDelete(taskToEmployee)
                .then(function (rs) {
                    if (rs.status === 200) {
                        listTask = listTask.filter((data, index) => {
                            return index !== (indexTask - 0);
                        });

                        mess = "Xóa thành công.";
                        check = true;
                    }
                })
                .catch(function (e) {
                    console.log(e);
                });
        }

        viewLink();
        $("#modal-delete").modal("hide");
        alertReport(check, mess);
    });
}

function showPartLink(element, list, defaultVal) {
    element.empty();
    element.append($('<option></option>').val("").text("- " + defaultVal + " -"));
    var index = 0;
    list.forEach(function (e) {
        element.append($('<option></option>').val(index++).text(e.name));
    })

    // element.chosen();
}

function search() {
    btnSearch.click(async function () {
        let valTask = textNameTask.val().trim();
        let valEmployee = textNameEmployee.val().trim();

        let q = (valTask === '' ? '' : ("tName=" + valTask + "&"))
            + (valEmployee === "" ? "" : ("eName=" + valEmployee));

        await taskToEmployeeSearch(q)
            .then(rs => {
                if (rs.status === 200) {
                    listTaskToEmployee = rs.data;
                }
            })
            .catch(function (e) {
                console.log(e);
            });

        viewLink();
    });
}