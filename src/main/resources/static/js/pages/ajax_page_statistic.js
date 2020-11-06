let selectSort, data;

let listProject = [];
let listEmployee = [];
let listSort = [
    {text: "Theo dự án", val: true},
    {text: "Theo nhân viên", val: false}
]
let indexE, employee;

$(async function () {
    selectSort = $("#sort");
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
    viewProject();
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
    else data.html(`<h2 class="text-center"><b>NoData</b></h2>`);
}

function viewTask(projectDTO, i) {
    let msDay = 24 * 60 * 60 * 1000;
    let taskCompletedValid = 0, taskCompletedInvalid = 0, taskInvalid = 0, taskInProgress = 0;
    let num_of_task = 0, taskComplete = 0;
    listTask = projectDTO.taskDTOs;

    let rs = `<tr><td colspan='6'><strong>No Data</strong></td></tr>`;

    if (listTask && listTask.length > 0) {
        num_of_task = listTask.length;
        rs = listTask.map((data, index) => {
            let task = data.task;
            let taskToEmployees = data.taskToEmployees;
            let check = false;

            if (task) {

                let diff = new Date(task.endDate).getTime() - new Date().getTime();
                if (task.completeDate) {
                    taskComplete++;
                    diff = new Date(task.endDate).getTime() - new Date(task.completeDate).getTime();
                    (diff > -msDay) ? taskCompletedValid++ : taskCompletedInvalid++;
                } else {
                    (diff > -msDay) ? taskInProgress++ : taskInvalid++;
                }

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

    let table = `<h3 class="mb-3">${(i + 1) + ". " + projectDTO.project.name}</h3>
                 <figure class="highcharts-figure mb-4">
                                <div id="content-chart-${i}" class="chart"></div>
                            </figure>
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

    let progress_pj = num_of_task === 0 ? 0 : Math.round(taskComplete * 100 / num_of_task);

    Highcharts.chart('content-chart-' + i, {
        chart: {
            type: 'column'
        },
        title: {
            text: ('Tiến độ: ' + progress_pj + "%. "
                + (projectDTO.project.completeDate ? ('Đánh giá: ' + Math.round(5 * (1 - taskCompletedInvalid / num_of_task) * 10 + Number.EPSILON) / 10 + '/5.') : ''))
        },

        xAxis: {
            categories: [
                'Hoàn thành',
                'Đang thực hiện',
                'Hoàn thành quá hạn',
                'Quá hạn'
            ],
            crosshair: true
        },
        yAxis: {
            min: 0,
            title: {
                text: 'số lượng công việc'
            }
        },
        tooltip: {
            headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
            pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                '<td style="padding:0"><b>{point.y:f}</b></td></tr>',
            footerFormat: '</table>',
            shared: true,
            useHTML: true
        },
        plotOptions: {
            column: {
                pointPadding: 0.2,
                borderWidth: 0,
                colorByPoint: true
            }
        },
        series: [{
            name: projectDTO.project.name,
            data: [{y: taskCompletedValid, color: "rgb(144, 237, 125)"},
                {y: taskInProgress, color: "rgb(124, 181, 236)"},
                {y: taskCompletedInvalid, color: "rgb(228, 211, 84)"},
                {y: taskInvalid, color: "rgb(244, 91, 91)"}]
        }]
    });

    $('.highcharts-credits') ? $('.highcharts-credits').remove() : {};
}

function viewEmployee() {
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
                            tmp += `<tr data-index="${index}" data-index-task="${i}" data-toggle="collapse" href="#chart${index}" 
                                role="button" aria-expanded="false" aria-controls="collapseExample">
                                <td>${dataFilter(taskToEmployees[i].task.project.id + '.' + taskToEmployees[i].task.id + '.' + taskToEmployees[i].task.name)}</td>
                                <td>${checkProgress(taskToEmployees[i])}</td>
                            </tr>`;
                    }
                }

                return `<tr data-index="${index}" data-index-task="0" data-toggle="collapse" href="#chart${index}" 
                                role="button" aria-expanded="false" aria-controls="collapseExample">
                                <th scope="row" rowspan="${length}">${index + 1}</th>
                                <td rowspan="${length}">${dataFilter(employee.name)}</td>
                                <td rowspan="${length}">${check ? length : 0}</td>`
                    + first +
                    `</tr>` + tmp +
                    `<tr>
                        <td colspan="5">
                      <div class="collapse" id="chart${index}">
                        <div class="card card-body">
                          <figure class="highcharts-figure w-100">
                                <div id="content-chart-${index}" class="chart w-100"></div>
                            </figure>
                        </div>
                      </div>
                    </td>
                    </tr>`;
            }
            return ``;
        }).join("");
    }

    let table = `<table class="table table-bordered table-hover bg-white">
                <thead id="table-title">
                 <tr>
                    <th scope="col">STT</th>
                    <th scope="col">Tên nhân viên</th>
                    <th scope="col">Số công việc tham gia</th>
                    <th scope="col">Công việc tham gia</th>
                    <th>Tiến độ</th>
                  </tr>
                </thead>
                <tbody id="table-data">`
        + rs +
        `</tbody>
              </table>`;

    data.html(table);
    showChart();
}

function showChart() {
    $('[data-index]').click(function () {
        let msDay = 24 * 60 * 60 * 1000;
        indexE = $(this).attr("data-index");
        employee = listEmployee[indexE - 0];
        let taskCompletedValid = 0, taskCompletedInvalid = 0, taskInvalid = 0, taskInProgress = 0;
        let num_of_task = 0;
        let listTask = employee.taskToEmployees;
        if (listTask && listTask.length > 0) {
            num_of_task = listTask.length;
            for (let te of listTask) {
                let diff = new Date(te.task.endDate).getTime() - new Date(te.lastModify).getTime();
                if (te.task.completeDate || te.progress === 100) {
                    (diff > -msDay) ? taskCompletedValid++ : taskCompletedInvalid++;
                } else {
                    diff = new Date(te.task.endDate).getTime() - new Date().getTime();
                    (diff > -msDay) ? taskInProgress++ : taskInvalid++;
                }
            }
        }

        Highcharts.chart('content-chart-' + indexE, {
            chart: {
                type: 'column'
            },
            title: {
                text: ('Đánh giá : ' + ((taskCompletedValid !== 0 || taskCompletedInvalid !== 0)
                    ? Math.round(5 * (1 - (taskCompletedInvalid + taskInvalid) / num_of_task) * 10 + Number.EPSILON) / 10 + '/5.'
                    : 'Hiện tại chưa thể đánh giá do chưa hoàn thành công việc nào.'))
            },

            xAxis: {
                categories: [
                    'Hoàn thành',
                    'Đang thực hiện',
                    'Hoàn thành quá hạn',
                    'Quá hạn'

                ],
                crosshair: true
            },
            yAxis: {
                min: 0,
                title: {
                    text: 'số lượng công việc'
                }
            },
            tooltip: {
                headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
                pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                    '<td style="padding:0"><b>{point.y:f}</b></td></tr>',
                footerFormat: '</table>',
                shared: true,
                useHTML: true
            },
            plotOptions: {
                column: {
                    pointPadding: 0.2,
                    borderWidth: 0,
                    colorByPoint: true
                }
            },
            series: [{
                name: employee.employee.name,
                data: [{y: taskCompletedValid, color: "rgb(144, 237, 125)"},
                    {y: taskInProgress, color: "rgb(124, 181, 236)"},
                    {y: taskCompletedInvalid, color: "rgb(228, 211, 84)"},
                    {y: taskInvalid, color: "rgb(244, 91, 91)"}]
            }]
        });

        $('.highcharts-credits') ? $('.highcharts-credits').remove() : {};

        $('.collapse').collapse("hide");
    })
}