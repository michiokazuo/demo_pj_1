let numberProgress, tableDataInProgress, tableDataComplete, tableDataPause, btnProgress, textTask;
let employeeDTO = {};
let listTaskToEmployee = [];
let listInProgress = [], listComplete = [], listPause = [];

let indexTask, idEmployee;

$(async function () {
    btnProgress = $("#btn-progress");
    textTask = $("#progress-task");
    numberProgress = $("#progress");
    tableDataInProgress = $("#table-data-in-progress");
    tableDataComplete = $("#table-data-complete");
    tableDataPause = $("#table-data-pause");

    let url = new URL(window.location.href);
    idEmployee = url.searchParams.get("employeeId");

    await loadEmployee();

    $("#title-page").html(`<h1>Quản lý Tiến độ công việc cá nhân <br> ${employeeDTO.employee.name}</h1>`);

    viewTaskOfEmployee();
    confirmProgressTask();
});

async function loadEmployee() {
    listEmployee = [];
    await employeeFindById(idEmployee)
        .then(rs => {
            if (rs.status === 200) {
                employeeDTO = rs.data;
                listTaskToEmployee = employeeDTO.taskToEmployees;
                classifyTask(listTaskToEmployee);
            }
        })
        .catch(function (e) {
            console.log(e);
        });
}

function viewTaskOfEmployee() {
    let rs = `<tr><td colspan='6'><strong>No Data</strong></td></tr>`;

    if (listInProgress && listInProgress.length > 0)
        rs = listInProgress.map((data, index) => {
            if (data) {
                return `<tr data-index="${index}">
                                <th scope="row">${index + 1}</th>
                                <td>${dataFilter(data.task.id + "." + data.task.name + " ( " + data.task.project.id
                    + "." + data.task.project.name + " )")}</td>
                                <td>${dataFilter(checkProgress(data))}</td>
                                <td>${dataFilter(new Date(data.modifyDate).toLocaleDateString())}</td>
                                <td>${dataFilter(lastModify(employeeDTO.employee, data.modifyBy))}</td>
                                <td> 
                                    <button type="button" class="btn btn-warning update-progress" >
                                        <i class="fas fa-edit"></i> Cập nhật
                                    </button>
                                </td>
                            </tr>`;
            }
            return ``;
        }).join("");

    tableDataInProgress.html(rs);
    progressTask();

    rs = `<tr><td colspan='5'><strong>No Data</strong></td></tr>`;
    if (listComplete && listComplete.length > 0)
        rs = listComplete.map((data, index) => {
            if (data) {
                return `<tr data-index="${index}">
                                <th scope="row">${index + 1}</th>
                                <td>${dataFilter(data.task.id + "." + data.task.name)}</td> 
                                <td>${dataFilter(data.task.project.id + "." + data.task.project.name)}</td>
                                <td>${dataFilter(new Date(data.modifyDate).toLocaleDateString())}</td>
                                <td>${dataFilter(lastModify(employeeDTO.employee, data.modifyBy))}</td>
                            </tr>`;
            }
            return ``;
        }).join("");

    tableDataComplete.html(rs);

    rs = `<tr><td colspan='5'><strong>No Data</strong></td></tr>`;
    if (listPause && listPause.length > 0)
        rs = listPause.map((data, index) => {
            if (data) {
                return `<tr data-index="${index}">
                                <th scope="row">${index + 1}</th>
                                <td>${dataFilter(data.task.id + "." + data.task.name)}</td> 
                                <td>${dataFilter(data.task.project.id + "." + data.task.project.name)}</td>
                                <td>${dataFilter(new Date(data.modifyDate).toLocaleDateString())}</td>
                                <td>${dataFilter(lastModify(employeeDTO.employee, data.modifyBy))}</td>
                            </tr>`;
            }
            return ``;
        }).join("");

    tableDataPause.html(rs);
}

function progressTask() {
    $(".update-progress").click(function () {
        indexTask = $(this).parents("tr").attr("data-index");

        textTask.val(listInProgress[indexTask - 0].task.name);
        numberProgress.val(listInProgress[indexTask - 0].progress);

        $("#modal-employee-progress").modal("show");
    });
}

function confirmProgressTask() {
    btnProgress.click(async () => {
        let {val: valProgress, check: checkProgress} = checkData(numberProgress, /^\d+$/, "Bạn chưa nhập tiến độ");

        if (checkProgress && valProgress - 0 >= 0 && valProgress - 0 <= 100) {
            let mess = "Sửa không thành công";
            let check = false;

            listInProgress[indexTask - 0].progress = valProgress - 0;

            await taskToEmployeeUpdate(listInProgress[indexTask - 0])
                .then(rs => {
                    if (rs.status === 200) {
                        listInProgress[indexTask - 0] = rs.data;

                        mess = "Sửa thành công.";
                        check = true;
                    }
                })
                .catch(function (e) {
                    console.log(e);
                });

            viewTaskOfEmployee();
            $("#modal-employee-progress").modal("hide");
            alertReport(check, mess);
        } else
            viewError(numberProgress, "Bạn chưa nhập tiến độ");
    });
}

function classifyTask(listTE) {
    if (listTE)
        for (let te of listTE) {
            if (te.paused) listPause.push(te);
            else if (te.task.completeDate) listComplete.push(te);
            else listInProgress.push(te);
        }
}

function lastModify(e, p) {
    if (e.id === p.id) return 'Tôi';
    else return 'Quản lý';
}