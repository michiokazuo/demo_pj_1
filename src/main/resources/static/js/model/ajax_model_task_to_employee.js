const URL_PUBLIC = "/public";
const URL_TASK_TO_EMPLOYEE = URL_PUBLIC + "/task-to-employee/";
const URL_TASK_E = URL_PUBLIC + "/task/";

function findAllTask() {
    return ajaxGet(`${URL_TASK_TO_EMPLOYEE}find-all-task`);
}

function findAllEmployee() {
    return ajaxGet(`${URL_TASK_TO_EMPLOYEE}find-all-employee`);
}

function taskToEmployeeFindAll() {
    return ajaxGet(`${URL_TASK_E}find-all`);
}

function taskToEmployeeInsertToTask(t) {
    return ajaxPost(`${URL_TASK_TO_EMPLOYEE}insert-to-task`, t);
}

function taskToEmployeeInsertToEmployee(t) {
    return ajaxPost(`${URL_TASK_TO_EMPLOYEE}insert-to-employee`, t);
}

function taskToEmployeeInsert(t) {
    return ajaxPost(`${URL_TASK_TO_EMPLOYEE}insert`, t);
}

function taskToEmployeeUpdate(t) {
    return ajaxPut(`${URL_TASK_TO_EMPLOYEE}update`, t);
}

function taskToEmployeeUpdateAll(t) {
    return ajaxPut(`${URL_TASK_TO_EMPLOYEE}update-all`, t);
}

function taskToEmployeeDelete(t) {
    return ajaxDelete(`${URL_TASK_TO_EMPLOYEE}delete`, t);
}

function taskToEmployeePause(t) {
    return ajaxDelete(`${URL_TASK_TO_EMPLOYEE}pause`, t);
}

function taskToEmployeeSearch(q) {
    return ajaxGet(`${URL_TASK_TO_EMPLOYEE}search?` + `${q}`);
}

function taskToEmployeeSearchByName(q) {
    return ajaxGet(`${URL_TASK_TO_EMPLOYEE}search-by-name?` + `${q}`);
}