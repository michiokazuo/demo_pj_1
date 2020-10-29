let textName, dateComplete, dateCreate, dateEnd, textareaDescription, btnConfirmSave, btnConfirmDelete, btnAddTask
    , selectSort, textSearchName, dateSearchCreate, selectSearchStatus, btnSearch, tableData, tableDataEmployee, btnAdd,
    btnDeleteEmployee;

let listTask = [];
let listEmployee = [];
let projectDTO = {};
let listStatus = [
    {text: "Hoàn thành", val: "1"},
    {text: "Đang thực hiện", val: "0"},
    {text: "Quá hạn", val: "-1"}
];
let listSort = [
    {text: "(A -> Z) Tên", val: "0", field: "name", isASC: "true"},
    {text: "(Z -> A) Tên", val: "0", field: "name", isASC: "false"},
    {text: "Tạo gần đây", val: "", field: "createDate", isASC: "false"}
]
let indexTask, taskDTO, task, indexEmployee;
let checkAction, idProject, checkComplete;

$(async function () {
    textName = $("#name");
    dateComplete = $("#complete_date");
    dateCreate = $("#create_date");
    dateEnd = $("#end_date");
    textareaDescription = $("#description");
    btnConfirmSave = $("#btn-save");
    btnConfirmDelete = $("#btn-delete");
    btnAddTask = $("#btn-add-task");
    selectSort = $("#sort");
    textSearchName = $("#name-search");
    dateSearchCreate = $("#create_date_search");
    selectSearchStatus = $("#status_search");
    btnSearch = $("#btn-search");
    tableData = $("#table-data");
    tableDataEmployee = $("#table-data-employee");
    btnAdd = $(".btn-add");
    btnDeleteEmployee = $("#btn-delete-employee");

    let url = new URL(window.location.href);
    idProject = url.searchParams.get("projectId");

    listSort = listSort.map((data, index) => {
        data.val = index;
        return data;
    });

    await loadTask();
    await loadEmployee();
    showSelectOption(selectSearchStatus, listStatus, "Tất cả");
    showSelectOption(selectSort, listSort, "Sắp xếp");
    viewTask();
    viewEmployee();
    addTask();
    confirmDeleteTask();
    confirmSaveTask();
    confirmDeleteEmployee();
    sortTask();
    searchTask();

    $("#modal-employee").on("hidden.bs.modal", function () {
        alertReport(true, 'Giao việc thành công');
    })
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

async function loadTask() {
    listTask = [];
    projectDTO = {};
    await projectFindById(idProject)
        .then(function (rs) {
            if (rs.status === 200) {
                projectDTO = rs.data;
                listTask = projectDTO.taskDTOs ? projectDTO.taskDTOs : [];

                if (projectDTO.project.completeDate) checkComplete = true;
            }
        }).catch(function (e) {
            console.log(e);
        });
}

function viewEmployee() {
    let rs = `<tr><td colspan='5'><strong>No Data</strong></td></tr>`;
    if (listEmployee && listEmployee.length > 0) {
        rs = listEmployee.map((data, index) => {
            let employee = data.employee;
            let taskToEmployees = data.taskToEmployees;

            if (employee) {
                let tmp = ``;
                let first = `<td></td><td></td>`;
                let length = 1;
                if (taskToEmployees && taskToEmployees.length > 0) {
                    length = taskToEmployees.length;

                    for (let i = 0; i < length; i++) {
                        if (i === 0)
                            first = `<td>${dataFilter(taskToEmployees[i].task.id + "." + taskToEmployees[i].task.name)}</td>
                                <td>${checkProgress(taskToEmployees[i])}</td>`;
                        else
                            tmp += `<tr data-index="${index}" data-index-task="${i}">
                                <td>${dataFilter(taskToEmployees[i].task.id + "." + taskToEmployees[i].task.name)}</td>
                                <td>${checkProgress(taskToEmployees[i])}</td>
                            </tr>`;
                    }
                }

                return `<tr data-index="${index}" data-index-task="0">
                                <th scope="row" rowspan="${length}">${index + 1}</th>
                                <td rowspan="${length}">${dataFilter(employee.name)}</td>`
                    + first +
                    `<td rowspan="${length}">
                                    <button type="button" class="btn btn-info btn-add">
                                        <i class="fas fa-plus"></i> Giao việc
                                    </button>
                                </td>
                                </tr>` + tmp;
            }
            return ``;
        }).join("");
    }

    tableDataEmployee.html(rs);
    taskToEmployee();
}

function showEmployeeToTask() {
    $(".task-to-employee").click(function () {
        indexTask = $(this).parents("tr").attr("data-index");

        $("#modal-employee").modal("show");
    })
}

function taskToEmployee() {
    $(".btn-add").click(async function () {
        indexEmployee = $(this).parents("tr").attr("data-index");
        let check = false;

        let taskToE = {};
        taskToE.id = {};
        taskToE.deleted = false;
        taskToE.progress = 0;
        taskToE.employee = {};
        taskToE.task = {};
        taskToE.employee = listEmployee[indexEmployee - 0].employee;
        taskToE.task = listTask[indexTask - 0].task;
        taskToE.id.employeeId = taskToE.employee.id;
        taskToE.id.taskId = taskToE.task.id;

        await taskToEmployeeInsert(taskToE)
            .then(function (rs) {
                if (rs.status === 200) {
                    check = true;
                    if (!listEmployee[indexEmployee - 0].taskToEmployees)
                        listEmployee[indexEmployee - 0].taskToEmployees = [];
                    if (!listTask[indexTask - 0].taskToEmployees)
                        listTask[indexTask - 0].taskToEmployees = [];

                    listEmployee[indexEmployee - 0].taskToEmployees.push(rs.data);
                    listTask[indexTask - 0].taskToEmployees.push(rs.data);
                }
            })
            .catch(function (e) {
                console.log(e);
            });

        viewTask();
        alert("Giao việc " + (check ? "thành công." : "thất bại."));
        viewEmployee();
    });
}

function viewTask() {
    $("#title-page").html(`<h1>Công việc của dự án ${projectDTO.project.name}</h1>`);

    let rs = `<tr><td colspan='7'><strong>No Data</strong></td></tr>`;
    if (listTask && listTask.length > 0) {
        rs = listTask.map((data, index) => {
            let task = data.task;
            let taskToEmployees = data.taskToEmployees;

            if (task) {
                let tmp = ``;
                let first = `<td></td><td></td><td></td>`;
                let length = 1;
                if (taskToEmployees && taskToEmployees.length > 0) {
                    length = taskToEmployees.length;

                    // start employee 2
                    for (let i = 0; i < length; i++) {
                        if (i === 0)
                            first = `<td>${dataFilter(taskToEmployees[i].employee.id + "." + taskToEmployees[i].employee.name)}</td>
                                <td>${checkProgress(taskToEmployees[i])}</td>
                                <td><button type="button" class="btn btn-danger delete-employee"
                                ${task.completeDate ? `disabled` : ''}>
                                    <i class="far fa-trash-alt"></i> Xóa
                                </button></td>`;
                        else
                            tmp += `<tr data-index="${index}" data-index-employee="${i}">
                                <td>${dataFilter(taskToEmployees[i].employee.id + "." + taskToEmployees[i].employee.name)}</td>
                                <td>${checkProgress(taskToEmployees[i])}</td>
                                <td><button type="button" class="btn btn-danger delete-employee"
                                    ${task.completeDate ? `disabled` : ''}>
                                    <i class="far fa-trash-alt"></i> Xóa
                                </button></td>
                            </tr>`;
                    }
                }

                return `<tr data-index="${index}" data-index-employee="0">
                                <th scope="row" rowspan="${length}">${index + 1}</th>
                                <td rowspan="${length}">${dataFilter(task.name)}</td>
                                <td rowspan="${length}">${dataFilter(new Date(task.createDate).toLocaleDateString("en-US"))}</td>
                                <td rowspan="${length}">${checkStatus(task.createDate, task.endDate, task.completeDate)}</td>`
                    + first +
                    `<td rowspan="${length}">
                                <button type="button" class="btn btn-warning m-1 task-to-employee"
                                ${task.completeDate ? `disabled` : ''}>
                                    <i class="fas fa-tasks"></i>
                                    Giao việc
                                </button>
                                <button type="button" class="btn btn-info m-1 update-task">
                                    <i class="far fa-eye"></i>
                                    Chi tiết
                                </button>
                                <button type="button" class="btn btn-danger m-1 delete-task"
                                ${task.completeDate ? `disabled` : ''}>
                                    <i class="fas fa-trash-alt"></i>
                                    Xóa
                                </button>
                                </td>
                                </tr>` + tmp;
            }
            return ``;
        }).join("");
    }

    tableData.html(rs);
    if (checkComplete) {
        btnAddTask.prop('disabled', true);
        $(".delete-employee").prop('disabled', true);
        $(".task-to-employee").prop('disabled', true);
        $(".delete-task").prop('disabled', true);
        btnConfirmSave.prop('disabled', true);
        btnConfirmDelete.prop('disabled', true);

        // btnAddTask ? btnAddTask.remove() : {};
        // $(".delete-employee") ? $(".delete-employee").remove() : {};
        // $(".task-to-employee") ? $(".task-to-employee").remove() : {};
        // $(".delete-task") ? $(".delete-task").remove() : {};
        // btnConfirmSave ? btnConfirmSave.remove() : {};
        $("#modal-delete-employee") ? $("#modal-delete-employee").remove() : {};
        $("#modal-delete") ? $("#modal-delete").remove() : {};
        $("#modal-task") ? $("#modal-task").remove() : {};
        $("#modal-employee") ? $("#modal-employee").remove() : {};
    }
    updateTask();
    deleteTask();
    deleteEmployee();
    showEmployeeToTask();
}

function addTask() {
    btnAddTask.click(function () {
        checkAction = false;
        taskDTO = {};
        taskDTO.task = {}
        taskDTO.task.project = projectDTO.project;
        taskDTO.taskToEmployees = null;

        dateComplete.prop('disabled', true);
        viewError(dateComplete, "Công việc mới tạo không được phép hoàn thành ngay");

        $("#modal-task").modal("show");
    });
}

function updateTask() {
    $(".update-task").click(function () {
        checkAction = true;
        dateComplete.prop('disabled', false);

        indexTask = $(this).parents("tr").attr("data-index");
        taskDTO = listTask[indexTask - 0];
        task = taskDTO.task;

        textName.val(task.name);
        dateCreate.val(new Date(task.createDate).toLocaleDateString('fr-CA'));
        dateEnd.val(new Date(task.endDate).toLocaleDateString('fr-CA'));
        dateComplete.val(task.completeDate ? new Date(task.completeDate).toLocaleDateString('fr-CA') : null);
        textareaDescription.val(task.description);

        let test = false;
        if (taskDTO.taskToEmployees && taskDTO.taskToEmployees.length > 0) {
            for (const val of taskDTO.taskToEmployees)
                if (val.progress !== 100) {
                    test = true;
                    break;
                }
        } else test = true;

        if (test) {
            dateComplete.prop('disabled', true);
            viewError(dateComplete, "Công việc chưa được phép hoàn thành do vẫn còn đang thực hiện.");
        }

        $("#modal-task").modal("show");
    });
}

function confirmSaveTask() {
    btnConfirmSave.click(async function () {
        let {val: valName, check: checkName} = checkData(textName, /./, "Chưa nhập tên công việc");
        let {val: valCreateDate, check: checkCreateDate} = checkData(dateCreate,
            /([12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]))/, "Chưa nhập ngày bắt đầu công việc");
        let {val: valEndDate, check: checkEndDate} = checkData(dateEnd,
            /([12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]))/, "Chưa nhập ngày kết thúc công việc");

        if (checkName && checkCreateDate && checkEndDate) {
            // checkAction : false -- insert
            //               true -- update
            if (taskDTO && taskDTO.taskToEmployees && taskDTO.taskToEmployees.length > 0 && dateComplete.val().trim() !== "") {
                let {val: valCompleteDate, check: checkCompleteDate} = checkData(dateComplete,
                    /([12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]))/, "Chưa nhập ngày hoàn thành");
                if (checkCompleteDate) {
                    taskDTO.task.completeDate = new Date(valCompleteDate);
                }
            }

            taskDTO.task.description = textareaDescription.val().trim().length > 0 ? textareaDescription.val().trim()
                : taskDTO.task.description;
            taskDTO.task.name = valName;
            taskDTO.task.createDate = new Date(valCreateDate);
            taskDTO.task.endDate = new Date(valEndDate);

            let {val: messRS, check: checkSaveRS} = checkSave(taskDTO);

            if (checkSaveRS) {
                let mess, check = false;
                if (checkAction) {
                    mess = "Sửa không thành công!!!";
                    await taskUpdate(taskDTO)
                        .then(function (rs) {
                            if (rs.status === 200) {
                                listTask[indexTask - 0] = rs.data;

                                mess = "Sửa thành công.";
                                check = true;
                            }
                        })
                        .catch(function (e) {
                            console.log(e);
                        });
                } else {
                    mess = "Thêm không thành công!!!";
                    await taskInsert(taskDTO)
                        .then(function (rs) {
                            if (rs.status === 200) {
                                listTask.push(rs.data);

                                mess = "Thêm thành công.";
                                check = true;
                            }
                        })
                        .catch(function (e) {
                            console.log(e);
                        });
                }

                viewTask();
                selectSort.prop('selectedIndex', 0);
                $("#modal-task").modal("hide");
                alertReport(check, mess);
            } else {
                alert(messRS);
            }
        }
    });
}

function deleteTask() {
    $(".delete-task").click(function () {
        indexTask = $(this).parents("tr").attr("data-index");
        taskDTO = listTask[indexTask - 0];
        task = taskDTO.task;

        $("#modal-delete").modal("show");
    });
}

function confirmDeleteTask() {
    btnConfirmDelete.click(async function () {
        let mess = "Xóa không thành công!!!";
        let check = false;

        await taskDelete(taskDTO)
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

        viewTask();
        $("#modal-delete").modal("hide");
        await loadEmployee();
        viewEmployee();
        alertReport(check, mess);
    });
}

function deleteEmployee() {
    $(".delete-employee").click(function () {
        indexTask = $(this).parents("tr").attr("data-index");
        indexEmployee = $(this).parents("tr").attr("data-index-employee");
        taskDTO = listTask[indexTask - 0];
        task = taskDTO.task;

        $("#modal-delete-employee").modal("show");
    })
}

function confirmDeleteEmployee() {
    btnDeleteEmployee.click(async function () {
        let mess = "Xóa không thành công!!!";
        let check = false;

        await taskToEmployeeDelete(taskDTO.taskToEmployees[indexEmployee - 0])
            .then(function (rs) {
                if (rs.status === 200) {
                    listTask[indexTask - 0].taskToEmployees = listTask[indexTask - 0].taskToEmployees.filter((data, index) => {
                        return index !== (indexEmployee - 0);
                    });

                    mess = "Xóa thành công.";
                    check = true;
                }
            })
            .catch(function (e) {
                console.log(e);
            });

        viewTask();
        $("#modal-delete-employee").modal("hide");
        await loadEmployee();
        viewEmployee();
        alertReport(check, mess);
    })
}

function sortTask() {
    selectSort.change(async function () {
        await search_sort();
    });
}

function searchTask() {
    btnSearch.click(async function () {
        await search_sort();
    })
}

async function search_sort() {
    let indexSort = selectSort.val();
    let sort = listSort[indexSort - 0];

    let valNameSearch = textSearchName.val().trim();
    let valDateCreateSearch = dateSearchCreate.val().trim().replaceAll("-", "/");
    let valStatus = selectSearchStatus.val().trim();

    let q = "idProject=" + idProject + "&"
        + (valNameSearch === "" ? "" : ("name=" + valNameSearch + "&"))
        + (valDateCreateSearch === "" ? "" : ("createDate=" + valDateCreateSearch + "&"))
        + (valStatus === "" ? "" : ("status=" + valStatus + "&"))
        + (sort ? ("field=" + sort.field + "&isASC=" + sort.isASC) : "");

    listTask = [];
    await taskSearchSort(q)
        .then(function (rs) {
            if (rs.status === 200) {
                listTask = rs.data;
            }
        })
        .catch(function (e) {
            console.log(e);
        });

    viewTask();
}

function checkSave(task) {
    // let msDay = 24 * 60 * 60;
    let check = false;
    let val = 'Logic ngày có vấn đế mời nhập lại!';

    let createDate = new Date(task.task.createDate);
    let endDate = new Date(task.task.endDate);
    let complete = task.task.completeDate;

    if (endDate.getTime() - createDate.getTime() >= 0
        && new Date(projectDTO.project.createDate).getTime() - createDate.getTime() <= 0
        && new Date(projectDTO.project.endDate).getTime() - endDate.getTime() >= 0
        && !projectDTO.project.completeDate) // du an da hoan thanh ko cho chinh sua
        if (!(complete && complete.length > 0)) {
            check = true;
        } else {
            let completeDate = new Date(complete);
            let complete_create = completeDate.getTime() - createDate.getTime();
            // let end_complete = endDate.getTime() - completeDate.getTime();

            // trong cung 1 ngay
            if (complete_create >= 0) {
                check = true;
            }

            if (check) {
                if (!taskDTO.taskToEmployees) {
                    check = false;
                    val = 'Công việc chưa được thực hiện không thể hoàn thành!';
                } else {
                    for (const te of taskDTO.taskToEmployees)
                        if (te.progress !== 100) {
                            check = false;
                            val = 'Còn công việc chưa hoàn thành hoặc ngày hoàn thành dự án không hợp lệ. Mời nhập lại!';
                            break;
                        }
                }
            }
        }
    return {val, check};
}