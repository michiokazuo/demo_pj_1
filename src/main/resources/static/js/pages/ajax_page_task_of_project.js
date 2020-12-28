let textName, dateComplete, dateCreate, dateEnd, textareaDescription, btnConfirmSave, btnConfirmDelete, btnAddTask
    , selectSort, textSearchName, dateSearchCreate, selectSearchStatus, btnSearch, tableData, tableDataEmployee, btnAdd,
    btnDeleteEmployee, tableDataProgress, btnUpdateProgress, btnPauseEmployee;

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
let checkAction, idProject, checkComplete, checkInsert, checkInsertAgain = false;

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
    tableDataProgress = $("#table-data-progress");
    btnUpdateProgress = $("#btn-update");
    btnPauseEmployee = $("#btn-pause-employee");

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
    confirmPauseEmployee();
    sortTask();
    searchTask();
    updateProgress();

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
                            first = `<td>${dataFilter(taskToEmployees[i].task.name + " - "
                                + taskToEmployees[i].task.project.name) + `(${taskToEmployees[i].paused ? 'Tạm dừng công việc' : ''})`}</td>
                                <td>${checkProgress(taskToEmployees[i])}</td>`;
                        else
                            tmp += `<tr data-index="${index}" data-index-task="${i}">
                                <td>${dataFilter(taskToEmployees[i].task.name + " - "
                                + taskToEmployees[i].task.project.name) + `(${taskToEmployees[i].paused ? 'Tạm dừng công việc' : ''})`}</td>
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
        $("#detail-employee").html(`Công việc: ${listTask[indexTask - 0].task.name}. Giao cho nhân viên`);

        $("#modal-employee").modal("show");
    })
}

function taskToEmployee() {
    $(".btn-add").click(async function () {
        indexEmployee = $(this).parents("tr").attr("data-index");
        let check = false;
        checkInsert = true;

        let taskToE = {};
        taskToE.id = {};
        taskToE.deleted = false;
        taskToE.paused = false;
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
                    checkInsertAgain = false;
                    if (!listTask[indexTask - 0].taskToEmployees) listTask[indexTask - 0].taskToEmployees = [];
                    for (let te of listTask[indexTask - 0].taskToEmployees) {
                        if (te.task.id === rs.data.task.id && te.employee.id === rs.data.employee.id) {
                            checkInsertAgain = true;
                            break;
                        }
                    }
                    if (checkInsertAgain)
                        listTask[indexTask - 0].taskToEmployees =
                            listTask[indexTask - 0].taskToEmployees.filter((data, index) => {
                                return data.id.employeeId !== rs.data.id.employeeId;
                            })

                    listTask[indexTask - 0].taskToEmployees.push(rs.data);
                }
            })
            .catch(function (e) {
                console.log(e);
            });


        alert("Giao việc " + (check ? "thành công." : "thất bại hoặc nhân viên đó đã nhận công việc này!"));
        viewTask();
        if (check) {
            await loadEmployee();
            $("#modal-employee").modal("hide");
            viewDataProgress();
            await notify_impl(taskToE.employee.email, checkInsertAgain ? "Giao lại công việc" : "Giao công việc mới",
                `Bạn vừa giao công việc <b>${taskToE.task.name}</b> thuộc dự án <b>${taskToE.task.project.name}</b> 
                   vào lúc ${new Date().toLocaleString()}.<br>
                         Click vào đây để vào <a href="http://localhost:8080/"><b>Trang chủ</b></a><br>
                         Chúc bạn làm việc thật hiệu quả!!!`);
        }
    });
}

function showDataProgress() {
    $("#detail-progress").html(`Cập nhật lại tiến độ cho nhân viên tham gia công việc: ${listTask[indexTask - 0].task.name}`);

    $("#modal-update-progress").modal("show");
}

function viewDataProgress() {
    let rs = `<tr><td colspan='4'><strong>No Data</strong></td></tr>`;
    let listTE = listTask[indexTask - 0].taskToEmployees;
    if (listTE && listTE.length > 0) {
        rs = listTE.map((data, index) => {
            if (data) {
                return `<tr data-index="${index}">
                        <th scope="row">${index + 1}</th>
                        <td>${dataFilter(data.employee.id + '. ' + data.employee.name + `${data.paused ? ' (Tạm dừng công việc)' : ((index + 1 === listTE.length && checkInsert) ? (checkInsertAgain ? ' (Thêm lại)' : ' (Mới thêm)') : '')}`)}</td>
                        <td>${dataFilter(checkProgress(data))}</td>
                        <td>
                             <input class="form-control bg-light " type="number" min="0" max="100"
                                  oninput="validity.valid||(value='');" id="progress${index}" 
                                  value="${data.progress}" ${(data.paused || (index + 1 === listTE.length && checkInsert)) ? (checkInsertAgain ? '' : `disabled`) : ''}/>
                             <div class="invalid-feedback">Bạn chưa nhập tiến độ đúng định dạng.
                             </div>
                        </td>
                        </tr>`;
            }
            return ``;
        }).join("");
    }
    tableDataProgress.html(rs);
    showDataProgress();
}

function updateProgress() {
    btnUpdateProgress.click(async function () {
        let listTE = listTask[indexTask - 0].taskToEmployees;
        let check = true;
        if (listTE && listTE.length > 0)
            for (let i = 0; i < listTE.length; i++) {
                let {
                    val: valProgress,
                    check: checkProgress
                } = checkData($(`#progress${i}`), /^\d+$/, "Bạn chưa nhập tiến độ");
                if (checkProgress && valProgress - 0 >= 0 && valProgress - 0 <= 100) {
                    listTE[i].progress = valProgress - 0;
                } else {
                    viewError($(`#progress${i}`), "Bạn chưa nhập tiến độ");
                    check = false;
                }
            }
        else check = false;

        if (check) {
            let mess = "Cập nhật không thành công thành công";
            check = false;
            await taskToEmployeeUpdateAll(listTE)
                .then(function (rs) {
                    if (rs.status === 200) {
                        listTask[indexTask - 0].taskToEmployees = rs.data;
                        check = true;
                        mess = "Cập nhật thành công";
                    }
                })
                .catch(function (e) {
                    console.log(e);
                });
            alertReport(check, mess);
            alert("Cập nhật " + (check ? "thành công." : "thất bại!"));
            if (check) {
                let emails = "";
                listTask[indexTask - 0].taskToEmployees.forEach(item => {
                    emails += (" " + (item.paused && checkInsert ? '' : item.employee.email));
                })
                await loadEmployee();
                $("#modal-update-progress").modal("hide");
                viewEmployee();
                if (checkInsert) $("#modal-employee").modal("show");
                await notify_impl(emails.trim(), "Cập nhật lại công việc",
                    `Bạn vừa được quản lý cập nhật công việc <b>${listTask[indexTask - 0].task.name}</b> 
                    thuộc dự án <b>${listTask[indexTask - 0].task.project.name}</b> 
                   vào lúc ${new Date().toLocaleString()}.<br>
                         Click vào đây để vào <a href="http://localhost:8080/"><b>Trang chủ</b></a><br>
                         Chúc bạn làm việc thật hiệu quả!!!`);
                viewTask();
            }
        }
    })
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
                            first = `<td>${dataFilter(taskToEmployees[i].employee.id + "."
                                + taskToEmployees[i].employee.name)}</td>
                                <td>${checkProgress(taskToEmployees[i])}</td>
                                <td>`
                                + `${taskToEmployees[i].task.completeDate ? `<i class="text-success far fa-check-circle fa-2x"></i>` : `<button type="button" class="btn btn-danger ${taskToEmployees[i].progress !== 0 ? 'pause-employee' : 'delete-employee'}"
                                ${taskToEmployees[i].paused ? `disabled` : ''}>`
                                    + `${taskToEmployees[i].paused ? 'Đã tạm dừng'
                                        : (taskToEmployees[i].progress !== 0 ? `<i class="far fa-pause-circle"></i> Tạm dừng`
                                            : `<i class="far fa-trash-alt"></i> Xóa`)}` +
                                    `</button>`}`
                                + `</td>`;
                        else
                            tmp += `<tr data-index="${index}" data-index-employee="${i}">
                                <td>${dataFilter(taskToEmployees[i].employee.id + "."
                                + taskToEmployees[i].employee.name)}</td>
                                <td>${checkProgress(taskToEmployees[i])}</td>
                                <td>`
                                + `${taskToEmployees[i].task.completeDate ? `<i class="text-success far fa-check-circle fa-2x"></i>` : `<button type="button" class="btn btn-danger ${taskToEmployees[i].progress !== 0 ? 'pause-employee' : 'delete-employee'}"
                                ${taskToEmployees[i].paused ? `disabled` : ''}>`
                                    + `${taskToEmployees[i].paused ? 'Đã tạm dừng'
                                        : (taskToEmployees[i].progress !== 0 ? `<i class="far fa-pause-circle"></i> Tạm dừng`
                                            : `<i class="far fa-trash-alt"></i> Xóa`)}` +
                                    `</button>`}`
                                + `</td>
                            </tr>`;
                    }
                }

                return `<tr data-index="${index}" data-index-employee="0">
                                <th scope="row" rowspan="${length}">${index + 1}</th>
                                <td rowspan="${length}">${dataFilter(task.name)}</td>
                                <td rowspan="${length}">${dataFilter(new Date(task.createDate).toLocaleDateString())}</td>
                                <td rowspan="${length}">${checkStatus(task.createDate, task.endDate, task.completeDate)}</td>`
                    + first +
                    `<td rowspan="${length}" width="150px">`
                    + `${task.completeDate ? `` : `<button type="button" class="btn btn-warning m-1 task-to-employee">
                                    <i class="fas fa-tasks"></i> Giao việc
                                </button>`}`
                    + `<button type="button" class="btn btn-info m-1 update-task">
                                    <i class="far fa-eye"></i> Chi tiết
                                </button>`
                    + `${task.completeDate ? `` : `<button type="button" class="btn btn-danger m-1 delete-task">
                                    <i class="fas fa-trash-alt"></i> Xóa
                                </button>`}`
                    + `</td></tr>`
                    + tmp;
            }
            return ``;
        }).join("");
    }

    tableData.html(rs);
    if (checkComplete) {
        // btnAddTask.prop('disabled', true);
        $(".delete-employee").prop('disabled', true);
        $(".task-to-employee").prop('disabled', true);
        $(".delete-task").prop('disabled', true);
        btnConfirmSave.prop('disabled', true);
        btnConfirmDelete.prop('disabled', true);

        btnAddTask ? btnAddTask.remove() : {};
        $(".delete-employee") ? $(".delete-employee").remove() : {};
        $(".task-to-employee") ? $(".task-to-employee").remove() : {};
        $(".delete-task") ? $(".delete-task").remove() : {};
        // btnConfirmSave ? btnConfirmSave.remove() : {};
        $("#modal-delete-employee") ? $("#modal-delete-employee").remove() : {};
        $("#modal-delete") ? $("#modal-delete").remove() : {};
        // $("#modal-task") ? $("#modal-task").remove() : {};
        $("#modal-employee") ? $("#modal-employee").remove() : {};
    }
    updateTask();
    deleteTask();
    deleteEmployee();
    pauseEmployee();
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
        $("#delete-task").html(`Xác nhận thao tác với công việc: ${task.name}`);

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
        if (check && taskDTO.taskToEmployees && taskDTO.taskToEmployees.length > 0) {
            let emails = "";
            taskDTO.taskToEmployees.forEach(item => {
                emails += (" " + (item.paused ? '' : item.employee.email));
            })
            await notify_impl(emails.trim(), "Xóa công việc",
                `Công việc <b>${taskDTO.task.name}</b> 
                    thuộc dự án <b>${taskDTO.task.project.name}</b> mà bạn đang tham gia đã bị xóa
                   vào lúc ${new Date().toLocaleString()}.<br>
                         Click vào đây để vào <a href="http://localhost:8080/"><b>Trang chủ</b></a><br>
                         Chúc bạn làm việc thật hiệu quả!!!`);
        }
    });
}

function deleteEmployee() {
    $(".delete-employee").click(function () {
        indexTask = $(this).parents("tr").attr("data-index");
        indexEmployee = $(this).parents("tr").attr("data-index-employee");
        taskDTO = listTask[indexTask - 0];
        task = taskDTO.task;
        $("#delete-employee").html(`Xác nhận thao tác với nhân viên: ${taskDTO.taskToEmployees[indexEmployee - 0].employee.name} ` + `- công việc: ${task.name}`);

        $("#modal-delete-employee").modal("show");
    })
}

function confirmDeleteEmployee() {
    btnDeleteEmployee.click(async function () {
        let mess = "Xóa không thành công!!!";
        let check = false;
        let email = taskDTO.taskToEmployees[indexEmployee - 0].employee.email;

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
        if (check)
            await notify_impl(email, "Xóa tham gia công việc",
                `Bạn vừa bị xóa khỏi công việc <b>${taskDTO.task.name}</b> 
                    thuộc dự án <b>${taskDTO.task.project.name}</b> 
                   vào lúc ${new Date().toLocaleString()}.<br>
                         Click vào đây để vào <a href="http://localhost:8080/"><b>Trang chủ</b></a><br>
                         Chúc bạn làm việc thật hiệu quả!!!`);
    })
}

function pauseEmployee() {
    $(".pause-employee").click(function () {
        indexTask = $(this).parents("tr").attr("data-index");
        indexEmployee = $(this).parents("tr").attr("data-index-employee");
        taskDTO = listTask[indexTask - 0];
        task = taskDTO.task;
        checkInsert = false;
        $("#pause-employee")
            .html(`Xác nhận thao tác với nhân viên: ${taskDTO.taskToEmployees[indexEmployee - 0].employee.name} ` + `- công việc: ${task.name}`);

        $("#modal-pause-employee").modal("show");
    })
}

function confirmPauseEmployee() {
    btnPauseEmployee.click(async function () {
        let mess = "Dừng công việc không thành công!!!";
        let check = false;

        await taskToEmployeePause(taskDTO.taskToEmployees[indexEmployee - 0])
            .then(function (rs) {
                if (rs.status === 200) {
                    listTask[indexTask - 0].taskToEmployees[indexEmployee - 0] = rs.data;
                    mess = "Dừng công việc thành công.";
                    check = true;
                }
            })
            .catch(function (e) {
                console.log(e);
            });

        $("#modal-pause-employee").modal("hide");
        alertReport(check, mess);
        if (check) {
            await notify_impl(taskDTO.taskToEmployees[indexEmployee - 0].employee.email, "Tạm dừng công việc",
                `Bạn vừa bị tạm dừng công việc <b>${taskDTO.task.name}</b> 
                    thuộc dự án <b>${taskDTO.task.project.name}</b> 
                   vào lúc ${new Date().toLocaleString()}.<br>
                         Click vào đây để vào <a href="http://localhost:8080/"><b>Trang chủ</b></a><br>
                         Chúc bạn làm việc thật hiệu quả!!!`);
            viewDataProgress();
            viewTask();
        }
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
    let val = `Logic ngày có vấn đế (hoặc thời hạn công việc phải nằm trong thời gian của dự án).<br> Mời nhập lại!!!`;

    let createDate = new Date(task.task.createDate);
    let endDate = new Date(task.task.endDate);
    let complete = task.task.completeDate;

    if (endDate.getTime() - createDate.getTime() >= 0
        && new Date(projectDTO.project.createDate).getTime() - createDate.getTime() <= 0
        && new Date(projectDTO.project.endDate).getTime() - endDate.getTime() >= 0
        && !projectDTO.project.completeDate) // du an da hoan thanh ko cho chinh sua
        if (!complete) {
            check = true;
        } else {
            console.log("complete")
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