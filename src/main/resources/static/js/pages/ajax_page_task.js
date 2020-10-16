let textName, dateComplete, dateCreate, dateEnd, textareaDescription, btnConfirmSave, btnConfirmDelete, btnAddTask
    , selectSort, textSearchName, dateSearchCreate, selectSearchStatus, btnSearch, tableData;

let listTask = [];
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
let indexTask, taskDTO, task;
let checkAction;

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

    listSort = listSort.map((data, index) => {
        data.val = index;
        return data;
    });

    await loadTask();
    showSelectOption(selectSearchStatus, listStatus, "Tất cả");
    showSelectOption(selectSort, listSort, "Sắp xếp");
    viewTask();
    addTask();
    confirmDeleteTask();
    confirmSaveTask();
    sortTask();
    searchTask();
});

async function loadTask() {
    listTask = [];
    await taskFindAll()
        .then(function (rs) {
            if (rs.status === 200) {
                listTask = rs.data;
            }
        }).catch(function (e) {
            console.log(e);
        });
}

function viewTask() {
    let rs = `<tr><td colspan='6'><strong>No Data</strong></td></tr>`;

    if (listTask && listTask.length > 0) {
        rs = listTask.map((data, index) => {
            let task = data.task;
            let taskToEmployees = data.taskToEmployees;

            if (task) {
                let tmp = ``;
                if (taskToEmployees && taskToEmployees.length > 0)
                    for (let te of taskToEmployees) {
                        tmp += `<li class="list-group-item bg-transparent">${te.employee.id + '. ' + dataFilter(te.employee.name)}</li>`;
                    }

                return `<tr data-index="${index}">
                        <th scope="row">${index + 1}</th>
                        <td>${dataFilter(task.name)}</td>
                        <td>${dataFilter(new Date(task.createDate).toLocaleDateString("en-US"))}</td>
                        <td>${checkStatus(task.createDate, task.endDate, task.completeDate)}</td>
                        <td><ul class="list-group list-group-flush bg-transparent">` + tmp +
                    `</ul>
                        </td>
                            <td>
                                <button type="button" class="btn btn-info m-1 update-task">
                                    <i class="far fa-eye"></i>
                                    Chi tiết
                                </button>
                                <button type="button" class="btn btn-danger m-1 delete-task">
                                    <i class="fas fa-trash-alt"></i>
                                    Xóa
                                </button>
                            </td>
                        </tr>`;
            }
            return ``;
        }).join("");

    }

    tableData.html(rs);
    updateTask();
    deleteTask();
}

function addTask() {
    btnAddTask.click(function () {
        checkAction = false;
        taskDTO = {};
        taskDTO.task = {}
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

        if (!(taskDTO.taskToEmployees && taskDTO.taskToEmployees.length > 0)) {
            dateComplete.prop('disabled', true);
            viewError(dateComplete, "Công việc chưa được phân công không được phép hoàn thành");
        }

        $("#modal-task").modal("show");
    });
}

function confirmSaveTask() {
    btnConfirmSave.click(async function () {
        let {val: valName, check: checkName} = checkData(textName, /./, "Chưa nhập tên công việc");
        let {val: valCreateDate, check: checkCreateDate} = checkData(dateCreate, /([12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]))/, "Chưa nhập ngày bắt đầu công việc");
        let {val: valEndDate, check: checkEndDate} = checkData(dateEnd, /([12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]))/, "Chưa nhập ngày kết thúc công việc");
        let completeDate;

        if (checkName && checkCreateDate && checkEndDate) {
            // checkAction : false -- insert
            //               true -- update
            if (taskDTO && taskDTO.taskToEmployees && taskDTO.taskToEmployees.length > 0 && dateComplete.val().trim() !== "") {
                let {val: valCompleteDate, check: checkCompleteDate} = checkData(dateComplete, /([12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]))/, "Chưa nhập ngày hoàn thành");
                if (checkCompleteDate) {
                    taskDTO.task.completeDate = new Date(valCompleteDate);
                    completeDate = valCompleteDate;
                }
            }

            if (checkLogicDate(valCreateDate, valEndDate, completeDate)) {

                taskDTO.task.description = textareaDescription.val().trim().length > 0 ? textareaDescription.val().trim() : taskDTO.task.description;
                taskDTO.task.name = valName;
                taskDTO.task.createDate = new Date(valCreateDate);
                taskDTO.task.endDate = new Date(valEndDate);

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
                alert("Logic ngày có vấn đế mời nhập lại.");
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
        alertReport(check, mess);
    });
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

    let q = (valNameSearch === "" ? "" : ("name=" + valNameSearch + "&"))
        + (valDateCreateSearch === "" ? "" : ("createDate=" + valDateCreateSearch + "&"))
        + (valStatus === "" ? "" : ("status=" + valStatus + "&"))
        + (sort ? ("field=" + sort.field + "&isASC=" + sort.isASC) : "");

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

function checkLogicDate(create, end, complete) {
    // let msDay = 24 * 60 * 60;
    let rs = false;

    let createDate = new Date(create);
    let endDate = new Date(end);

    if (!(complete && complete.length > 0)) {
        if (endDate.getTime() - createDate.getTime() >= 0)
            rs = true;
    } else {
        let completeDate = new Date(complete);
        let complete_create = completeDate.getTime() - createDate.getTime();
        // let end_complete = endDate.getTime() - completeDate.getTime();

        // trong cung 1 ngay
        if (complete_create >= 0) {
            rs = true;
        }
    }

    return rs;
}