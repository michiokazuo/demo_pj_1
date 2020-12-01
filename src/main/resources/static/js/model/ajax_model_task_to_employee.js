const URL_PUBLIC = "/public";
const URL_TASK_TO_EMPLOYEE = URL_PUBLIC + "/task-to-employee/";
const URL_TASK_E = URL_PUBLIC + "/task/admin/";
const URL_ADMIN_TE = URL_TASK_TO_EMPLOYEE + "admin/";
const URL_USER_TE = URL_TASK_TO_EMPLOYEE + "user/";

function findAllTask() {
    return ajaxGet(`${URL_ADMIN_TE}find-all-task`);
}

function findAllEmployee() {
    return ajaxGet(`${URL_ADMIN_TE}find-all-employee`);
}

function taskToEmployeeFindAll() {
    return ajaxGet(`${URL_TASK_E}find-all`);
}

function taskToEmployeeInsertToTask(t) {
    return ajaxPost(`${URL_ADMIN_TE}insert-to-task`, t);
}

function taskToEmployeeInsertToEmployee(t) {
    return ajaxPost(`${URL_ADMIN_TE}insert-to-employee`, t);
}

function taskToEmployeeInsert(t) {
    return ajaxPost(`${URL_ADMIN_TE}insert`, t);
}

function taskToEmployeeUpdate(t) {
    return ajaxPut(`${URL_TASK_TO_EMPLOYEE}update`, t);
}

function taskToEmployeeUpdateAll(t) {
    return ajaxPut(`${URL_ADMIN_TE}update-all`, t);
}

function taskToEmployeeDelete(t) {
    return ajaxDelete(`${URL_ADMIN_TE}delete`, t);
}

function taskToEmployeePause(t) {
    return ajaxDelete(`${URL_ADMIN_TE}pause`, t);
}

function taskToEmployeeSearch(q) {
    return ajaxGet(`${URL_TASK_TO_EMPLOYEE}search?` + `${q}`);
}

function taskToEmployeeSearchByName(q) {
    return ajaxGet(`${URL_TASK_TO_EMPLOYEE}search-by-name?` + `${q}`);
}