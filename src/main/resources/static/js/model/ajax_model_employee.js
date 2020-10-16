const URL_EMPLOYEE = "/public/employee/";

function employeeFindAll() {
    return ajaxGet(`${URL_EMPLOYEE}find-all`);
}

function employeeFindById(q) {
    return ajaxGet(`${URL_EMPLOYEE}find-by-id/` + `${q}`);
}

function employeeInsert(e) {
    return ajaxPost(`${URL_EMPLOYEE}insert`, e);
}

function employeeUpdate(e) {
    return ajaxPut(`${URL_EMPLOYEE}update`, e);
}

function employeeDelete(e) {
    return ajaxDelete(`${URL_EMPLOYEE}delete/` + `${e.employee.id}`, e);
}

function employeeSearchSort(q) {
    return ajaxGet(`${URL_EMPLOYEE}search-sort?` + `${q}`);
}