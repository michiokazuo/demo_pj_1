let selectSort, tableData, tableTitle, data;

let listProject = [];
let listEmployee = [];
let listSort = [
    {text: "Theo dự án", val: true},
    {text: "Theo nhân viên", val: false}
]

$(async function () {
    selectSort = $("#sort");
    tableTitle = $("#table-title");
    tableData = $("#table-data");
    data = $(".table-data .table-responsive");

    selectSort.empty();
    listSort.forEach(function (e) {
        selectSort.append($('<option></option>').val(e.val).text(e.text));
    });
    await loadProject();
    await loadEmployee();
    viewContent();
})

async function loadProject() {
    listTask = [];
    await projectFindAll()
        .then(function (rs) {
            if (rs.status === 200) {
                listProject = rs.data;
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
        valSort === 'true' ? viewProject() : viewEmployee();
    })

}

function viewProject() {
    data.empty();
    if (listProject && listProject.length > 0)
        for (let i = 0; i < listProject.length; i++) {
            viewTask(listProject[i], i);
        }
    else data.html(`<h1 class="text-center"><b>NoData</b></h1>`);
}

function viewTask(projectDTO, i) {
    listTask = projectDTO.taskDTOs;
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
                                <td>${checkProgress(taskToEmployees[i])}</td>`;
                        else
                            tmp += `<tr data-index="${index}" data-index-employee="${i}">
                                <td>${dataFilter(taskToEmployees[i].employee.name)}</td>
                                <td>${checkProgress(taskToEmployees[i])}</td>
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

    let table = `<h3>${(i + 1) + ". " + projectDTO.project.name}</h3>
                <table class="table table-bordered table-hover bg-white">
                <thead id="table-title">
                  <tr>
                    <th scope="col">STT</th>
                    <th scope="col">Tên công việc</th>
                    <th scope="col">Trạng thái</th>
                    <th scope="col">Số lượng tham gia</th>
                    <th scope="col">Nhân viên tham gia</th>
                    <th>Tiến độ</th>
                  </tr>
                </thead>
                <tbody id="table-data">`
        + rs +
        `</tbody>
              </table>`;

    data.append(table);
}

function viewEmployee() {
    let title = `<tr>
                    <th scope="col">STT</th>
                    <th scope="col">Tên nhân viên</th>
                    <th scope="col">Số công việc tham gia</th>
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
                            first = `<td>${dataFilter(taskToEmployees[i].task.project.id + '.' + taskToEmployees[i].task.id + '.' + taskToEmployees[i].task.name)}</td>
                                <td>${checkProgress(taskToEmployees[i])}</td>`;
                        else
                            tmp += `<tr data-index="${index}" data-index-task="${i}">
                                <td>${dataFilter(taskToEmployees[i].task.project.id + '.' + taskToEmployees[i].task.id + '.' + taskToEmployees[i].task.name)}</td>
                                <td>${checkProgress(taskToEmployees[i])}</td>
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