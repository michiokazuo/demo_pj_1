let numberProgress, tableData, btnProgress, textTask, selectSort, textNameTask;
let employeeDTO = {};
let listTaskToEmployee = [];
let listSort = [
    {text: "Hoàn thành", val: "1", field: 1},
    {text: "Đang thực hiện", val: "0", field: 0},
    {text: "Quá hạn", val: "-1", field: -1}
]
let indexTask, idEmployee;

$(async function () {
    btnProgress = $("#btn-progress");
    textTask = $("#progress-task");
    numberProgress = $("#progress");
    tableData = $("#table-data");
    selectSort = $("#sort");
    textNameTask = $("#task-search");

    let url = new URL(window.location.href);
    idEmployee = url.searchParams.get("employeeId");

    listSort = listSort.map((data, index) => {
        data.val = index;
        return data;
    });

    await loadEmployee();

    $("#title-page").html(`<h1>Quản lý Tiến độ công việc cá nhân của ${employeeDTO.employee.name}</h1>`);

    showSelectOption(selectSort, listSort, "Tất cả");
    viewTaskOfEmployee();
    confirmProgressTask();
    searchTaskOfEmployee();
});

async function loadEmployee() {
    listEmployee = [];
    await employeeFindById(idEmployee)
        .then(rs => {
            if (rs.status === 200) {
                employeeDTO = rs.data;
                listTaskToEmployee = employeeDTO.taskToEmployees;
            }
        })
        .catch(function (e) {
            console.log(e);
        });
}

function viewTaskOfEmployee() {
    let rs = `<tr><td colspan='4'><strong>No Data</strong></td></tr>`;

    if (listTaskToEmployee && listTaskToEmployee.length > 0)
        rs = listTaskToEmployee.map((data, index) => {
            if (data) {
                return `<tr data-index="${index}">
                                <th scope="row">${index + 1}</th>
                                <td>${dataFilter(data.task.name + " - " + data.task.project.name)}</td>
                                <td>${dataFilter(checkProgress(data))}</td>
                                <td> 
                                    <button type="button" class="btn btn-warning update-progress" 
                                    ${data.task.completeDate ? `disabled` : ''}>
                                        <i class="fas fa-edit"></i> Cập nhật
                                    </button>
                                </td>
                            </tr>`;
            }
            return ``;
        }).join("");

    tableData.html(rs);
    progressTask();
}

function progressTask() {
    $(".update-progress").click(function () {
        indexTask = $(this).parents("tr").attr("data-index");

        textTask.val(listTaskToEmployee[indexTask - 0].task.name);
        numberProgress.val(listTaskToEmployee[indexTask - 0].progress);

        $("#modal-employee-progress").modal("show");
    });
}

function confirmProgressTask() {
    btnProgress.click(async () => {
        let {val: valProgress, check: checkProgress} = checkData(numberProgress, /^\d+$/, "Bạn chưa nhập tiến độ");

        if (checkProgress) {
            let mess = "Sửa không thành công";
            let check = false;

            listTaskToEmployee[indexTask - 0].progress = valProgress - 0;

            await taskToEmployeeUpdate(listTaskToEmployee[indexTask - 0])
                .then(rs => {
                    if (rs.status === 200) {
                        listTaskToEmployee[indexTask - 0] = rs.data;

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
        }
    });
}

function searchTaskOfEmployee() {
    selectSort.change(async function () {
        let indexSort = selectSort.val();
        let sort = indexSort && indexSort.length > 0 ? listSort[indexSort - 0] : null;

        let q = (sort ? ("status=" + sort.field + "&") : "") + "employeeId=" + employeeDTO.employee.id;

        listTaskToEmployee = [];
        await taskToEmployeeSearch(q)
            .then(rs => {
                if (rs.status === 200) {
                    listTaskToEmployee = rs.data;
                }
            })
            .catch(function (e) {
                console.log(e);
            });

        viewTaskOfEmployee();
    });
}