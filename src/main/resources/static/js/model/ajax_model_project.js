const URL_PROJECT = "/public/project/admin/";

function projectFindAll() {
    return ajaxGet(`${URL_PROJECT}find-all`);
}

function projectFindById(q) {
    return ajaxGet(`${URL_PROJECT}find-by-id/` + `${q}`);
}

function projectInsert(t) {
    return ajaxPost(`${URL_PROJECT}insert`, t);
}

function projectUpdate(t) {
    return ajaxPut(`${URL_PROJECT}update`, t);
}

function projectDelete(t) {
    return ajaxDelete(`${URL_PROJECT}delete/` + `${t.project.id}`, t);
}

function projectSearchSort(q) {
    return ajaxGet(`${URL_PROJECT}search-sort?` + `${q}`);
}