const URL_EMPLOYEE = "/public/employee/";
const URL_ADMIN = URL_EMPLOYEE + "admin/";
const URL_USER = URL_EMPLOYEE + "user/";

function employeeFindAll() {
    return ajaxGet(`${URL_ADMIN}find-all`);
}

function employeeFindById(q) {
    return ajaxGet(`${URL_EMPLOYEE}find-by-id/` + `${q ? q : ''}`);
}

function employeeInsert(e) {
    return ajaxPost(`${URL_EMPLOYEE}insert/`, e);
}

function employeeUpdate(e) {
    return ajaxPut(`${URL_EMPLOYEE}update`, e);
}

function employeeDelete(e) {
    return ajaxDelete(`${URL_ADMIN}delete/` + `${e.employee.id}`, e);
}

function employeeSearchSort(q) {
    return ajaxGet(`${URL_ADMIN}search-sort?` + `${q}`);
}