const URL_TASK = "/public/task/admin/";

function taskFindAll() {
    return ajaxGet(`${URL_TASK}find-all`);
}

function taskFindById(q) {
    return ajaxGet(`${URL_TASK}find-by-id/` + `${q}`);
}

function taskInsert(t) {
    return ajaxPost(`${URL_TASK}insert`, t);
}

function taskUpdate(t) {
    return ajaxPut(`${URL_TASK}update`, t);
}

function taskDelete(t) {
    return ajaxDelete(`${URL_TASK}delete/` + `${t.task.id}`, t);
}

function taskSearchSort(q) {
    return ajaxGet(`${URL_TASK}search-sort?` + `${q}`);
}