let selectSort, tableData, tableTitle;

let listTask = [];
let listEmployee = [];
let listSort = [
    {text: "Theo công việc", val: true},
    {text: "Theo nhân viên", val: false}
]

$(async function () {
    selectSort = $("#sort");
    tableTitle = $("#table-title");
    tableData = $("#table-data");

    await loadTask();
    await loadEmployee();
    listSort.forEach(function (e) {
        selectSort.append($('<option></option>').val(e.val).text(e.text));
    })
    viewContent();
})

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

function viewContent() {
    selectSort.change(function () {
        let valSort = selectSort.val().trim();
        valSort === 'true' ? viewTask() : viewEmployee();
    })

}

function viewTask() {
    let title = `<tr>
                    <th scope="col">STT</th>
                    <th scope="col">Tên công việc</th>
                    <th scope="col">Trạng thái</th>
                    <th scope="col">Số lượng tham gia</th>
                    <th scope="col">Nhân viên tham gia</th>
                    <th>Tiến độ</th>
                  </tr>`;
    let rs = `<tr><td colspan='6'><strong>No Data</strong></td></tr>`;
    if (listTask && listTask.length > 0) {
        rs = listTask.map((data, index) => {
            let task = data.task;
            let taskToEmployees = data.taskToEmployees;
            let check = false;

            if (task) {
                let tmp = ``;
                let first = `<td></td><td></td>`;
                let length = 1;
                if (taskToEmployees && taskToEmployees.length > 0) {
                    check = true;
                    length = taskToEmployees.length;

                    // start employee 2
                    for (let i = 0; i < length; i++) {
                        if (i === 0)
                            first = `<td>${dataFilter(taskToEmployees[i].employee.name)}</td>
                                <td>${checkProgress(taskToEmployees[i].progress)}</td>`;
                        else
                            tmp += `<tr data-index="${index}" data-index-employee="${i}">
                                <td>${dataFilter(taskToEmployees[i].employee.name)}</td>
                                <td>${checkProgress(taskToEmployees[i].progress)}</td>
                            </tr>`;
                    }
                }

                return `<tr data-index="${index}" data-index-employee="0">
                                <th scope="row" rowspan="${length}">${index + 1}</th>
                                <td rowspan="${length}">${dataFilter(task.name)}</td>
                                <td rowspan="${length}">${checkStatus(task.createDate, task.endDate, task.completeDate)}</td>
                                <td rowspan="${length}">${check ? length : 0}</td>`
                    + first +
                    `</tr>` + tmp;
            }
            return ``;
        }).join("");
    }

    tableTitle.html(title);
    tableData.html(rs);
}

function viewEmployee() {
    let title = `<tr>
                    <th scope="col">STT</th>
                    <th scope="col">Tên nhân viên</th>
                    <th scope="col">Số lượng tham gia</th>
                    <th scope="col">Công việc tham gia</th>
                    <th>Tiến độ</th>
                  </tr>`;
    let rs = `<tr><td colspan='5'><strong>No Data</strong></td></tr>`;
    if (listEmployee && listEmployee.length > 0) {
        rs = listEmployee.map((data, index) => {
            let employee = data.employee;
            let taskToEmployees = data.taskToEmployees;
            let check = false;

            if (employee) {
                let tmp = ``;
                let first = `<td></td><td></td>`;
                let length = 1;
                if (taskToEmployees && taskToEmployees.length > 0) {
                    check = true;
                    length = taskToEmployees.length;

                    for (let i = 0; i < length; i++) {
                        if (i === 0)
                            first = `<td>${dataFilter(taskToEmployees[i].task.name)}</td>
                                <td>${checkProgress(taskToEmployees[i].progress)}</td>`;
                        else
                            tmp += `<tr data-index="${index}" data-index-task="${i}">
                                <td>${dataFilter(taskToEmployees[i].task.name)}</td>
                                <td>${checkProgress(taskToEmployees[i].progress)}</td>
                            </tr>`;
                    }
                }

                return `<tr data-index="${index}" data-index-task="0">
                                <th scope="row" rowspan="${length}">${index + 1}</th>
                                <td rowspan="${length}">${dataFilter(employee.name)}</td>
                                <td rowspan="${length}">${check ? length : 0}</td>`
                    + first +
                    `</tr>` + tmp;
            }
            return ``;
        }).join("");
    }

    tableTitle.html(title);
    tableData.html(rs);
}