const URL_PUBLIC = "/public";
const URL_TASK_TO_EMPLOYEE = URL_PUBLIC + "/task-to-employee/";
const URL_TASK = URL_PUBLIC + "/task/";

function findAllTask() {
    return ajaxGet(`${URL_TASK_TO_EMPLOYEE}find-all-task`);
}

function findAllEmployee() {
    return ajaxGet(`${URL_TASK_TO_EMPLOYEE}find-all-employee`);
}

function taskToEmployeeFindAll() {
    return ajaxGet(`${URL_TASK}find-all`);
}

function taskToEmployeeInsert(t) {
    return ajaxPost(`${URL_TASK_TO_EMPLOYEE}insert`, t);
}

function taskToEmployeeDelete(t) {
    return ajaxDelete(`${URL_TASK_TO_EMPLOYEE}delete`, t);
}

function taskToEmployeeSearch(q) {
    return ajaxGet(`${URL_TASK_TO_EMPLOYEE}search?` + `${q}`);
}