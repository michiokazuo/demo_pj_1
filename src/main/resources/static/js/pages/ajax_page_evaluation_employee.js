let tableData;
let employeeDTO = {};
let listTaskToEmployee = [];
let listProject = [];

$(async function () {
    tableData = $("#table-data");

    await loadEmployee();
    viewTask();
    showChart();
})

async function loadEmployee() {
    listEmployee = [];
    await employeeFindById()
        .then(rs => {
            if (rs.status === 200) {
                employeeDTO = rs.data;
                listTaskToEmployee = employeeDTO.taskToEmployees;
                classifyTP();
            }
        })
        .catch(function (e) {
            console.log(e);
        });
}

function classifyTP() {
    if (!listTaskToEmployee) return;
    for (let te of listTaskToEmployee) {
        if (include(listProject, te.task.project)) {
            te.task.project.taskToEmployees = [];
            listProject.push(te.task.project);
        }
    }

    for (let te of listTaskToEmployee)
        for (let p of listProject)
            if (te.task.project.id === p.id) {
                p.taskToEmployees.push(te);
                break;
            }
}

function viewTask() {
    let rs = `<tr><td colspan='4'><strong>No Data</strong></td></tr>`;
    if (listProject && listProject.length > 0) {
        rs = listProject.map((data, index) => {
            let taskToEmployees = data.taskToEmployees;

            if (data) {
                let tmp = ``;
                let first = `<td></td><td></td><td></td>`;
                let length = 1;
                if (taskToEmployees && taskToEmployees.length > 0) {
                    length = taskToEmployees.length;

                    // start employee 2
                    for (let i = 0; i < length; i++) {
                        if (i === 0)
                            first = `<td>${dataFilter(taskToEmployees[i].task.id + "."
                                + taskToEmployees[i].task.name)}</td>
                                <td>${checkStatus(taskToEmployees[i].createDate, taskToEmployees[i].endDate, taskToEmployees[i].completeDate)}</td>`;
                        else
                            tmp += `<tr data-index="${index}" data-index-employee="${i}">
                                <td>${dataFilter(taskToEmployees[i].task.id + "."
                                + taskToEmployees[i].task.name)}</td>
                                <td>${checkStatus(taskToEmployees[i].createDate, taskToEmployees[i].endDate, taskToEmployees[i].completeDate)}</td>
                            </tr>`;
                    }
                }

                return `<tr data-index="${index}" data-index-employee="0">
                                <th scope="row" rowspan="${length}">${index + 1}</th>
                                <td rowspan="${length}">${dataFilter(data.id + "." + data.name)}</td>`
                    + first + tmp;
            }
            return ``;
        }).join("");
    }

    tableData.html(rs);
}

function include(list, val) {
    for (let te of list) {
        if (te.id === val.id) return false;
    }
    return true;
}

function showChart() {
    let msDay = 24 * 60 * 60 * 1000;
    let taskCompleted = 0, taskValid = 0;
    let percentInProgress = 0, percentInValid = 0;
    let num_of_task = 0;
    if (listTaskToEmployee && listTaskToEmployee.length > 0) {
        num_of_task = listTaskToEmployee.length;
        for (let te of listTaskToEmployee) {
            let end = new Date(te.task.endDate);
            if (te.task.completeDate || te.progress === 100) {
                taskCompleted++;
                if (end.getTime() - new Date(te.modifyDate).getTime() > -msDay) {
                    taskValid++;
                    percentInProgress += 1;
                } else percentInValid += inValid(te);
            } else {
                if (end.getTime() - new Date().getTime() > -msDay) {
                    taskValid++;
                    percentInProgress += inProgress(te);
                } else percentInValid += inValid(te);
            }
        }
    }
    if (num_of_task !== 0)
        if (taskValid === 0) {
            percentInValid /= (num_of_task - taskValid);
            percentInProgress = 0;
        } else {
            if (taskValid === num_of_task) {
                percentInValid = 0;
                percentInProgress /= taskValid;
            } else {
                percentInProgress /= taskValid;
                percentInValid /= (num_of_task - taskValid);
            }
        }

    Highcharts.chart('content-chart', {
        chart: {
            type: 'column'
        },
        title: {
            text: ('Đề xuất đánh giá : ' + (num_of_task
                ? Math.round(5 * (percentInProgress + percentInValid) / 2 * 10 + Number.EPSILON) / 10 + '/5.'
                : 'Hiện tại chưa thể đánh giá do chưa thực hiện công việc nào.'))
        },
        xAxis: {
            categories: [employeeDTO.employee.name]
        },
        yAxis: {
            allowDecimals: false,
            min: 0,
            title: {
                text: 'số lượng công việc'
            },
            labels: {
                overflow: 'justify'
            },
            stackLabels: {
                enabled: true,
                style: {
                    fontWeight: 'bold',
                    color: ( // theme
                        Highcharts.defaultOptions.title.style &&
                        Highcharts.defaultOptions.title.style.color
                    ) || 'gray'
                }

            }
        },
        tooltip: {
            pointFormat: '<span style="color:{series.color}">{series.name}</span>: <b>{point.y}</b> ({point.percentage:.0f}%)<br/>',
            shared: false,
            useHTML: true
        },
        plotOptions: {
            column: {
                stacking: 'normal',
                dataLabels: {
                    enabled: true
                }
            }
        },
        series: [{
            name: 'Đã hoàn thành',
            data: [taskCompleted ? taskCompleted : ''],
            stack: 'Hoàn thành'
        }, {
            name: 'Chưa hoàn thành',
            data: [(num_of_task - taskCompleted) ? (num_of_task - taskCompleted) : ''],
            stack: 'Hoàn thành'
        }, {
            name: 'Chưa quá hạn',
            data: [taskValid ? taskValid : ''],
            stack: 'Quá hạn'
        }, {
            name: 'Đã quá hạn',
            data: [(num_of_task - taskValid) ? (num_of_task - taskValid) : ''],
            stack: 'Quá hạn'
        }]
    });

    $('.highcharts-credits') ? $('.highcharts-credits').remove() : {};

}