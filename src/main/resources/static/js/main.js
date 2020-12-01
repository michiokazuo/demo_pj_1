$(function () {
    $("a[href$='/" + window.location.pathname.split('/')[1] + "']").addClass("active");

    $(".modal").on("hidden.bs.modal", function () {
        $("form.form-post").trigger("reset");
        $("form.form-post input").removeClass("is-invalid");
    })

    $('.highcharts-credits').remove();
})

function dataFilter(field) {
    return field ? field : "";
}

function showSelectOption(element, list, defaultVal) {
    element.empty();
    element.append($('<option></option>').val("").text("- " + defaultVal + " -"));
    list.forEach(function (e) {
        element.append($('<option></option>').val(e.val).text(e.text));
    });
}

function checkStatus(create, end, complete) {
    let msDay = 24 * 60 * 60 * 1000;
    let rs = `<span class="badge badge-success">Hoàn thành</span>`;
    if (!complete) {
        let time = new Date(end).getTime() - new Date().getTime();
        rs = (time > -msDay) ? `<span class="badge badge-primary">Đang thực hiện</span>`
            : `<span class="badge badge-danger">Quá hạn</span>`;
    }

    return rs;
}

function checkProgress(taskTE) {
    return (taskTE.progress - 0 === 100 || taskTE.task.completeDate) ? `<span class="badge badge-success">100%</span>`
        : (new Date(taskTE.task.endDate).getTime() - new Date().getTime() > -24 * 60 * 60 * 1000
            ? `<span class="badge badge-primary">${taskTE.progress}%</span>`
            : `<span class="badge badge-secondary">${taskTE.progress}%</span>`);
}

function checkData(selector, regex, textError) {
    let val = $(selector).val().trim();
    let check = false;
    if (val.length > 0 && regex.test(val)) {
        check = true;
        hiddenError(selector);
    } else {
        viewError(selector, textError);
    }

    return {val, check};
}

function checkEmail(selector, textError) {
    let val = $(selector).val().trim();
    let check = false;
    if (val.length > 0 && /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(val)) {
        check = true;
        hiddenError(selector);
    } else {
        viewError(selector, textError);
    }

    return {val, check};
}

function checkPhone(selector, textError) {
    let val = $(selector).val().trim().replace('+84', '0');
    let check = false;
    if (val.length > 0 && /((09|03|07|08|05)+([0-9]{8})\b)/g.test(val)) {
        check = true;
        hiddenError(selector);
    } else {
        viewError(selector, textError);
    }

    return {val, check};
}

function checkPassword(selector, textError) {
    let val = $(selector).val();
    let check = false;
    const regex_password = /^(?=.*\d)(?=.*[a-zA-Z]).{8,}$/;
    if (val.length > 0 && regex_password.test(val)) {
        check = true;
        hiddenError(selector);
    } else {
        viewError(selector, textError);
    }
    return {val, check};
}

function viewError(selector, text) {
    $(selector).addClass("is-invalid");
    $(selector).siblings(".invalid-feedback").html(text);
}

function hiddenError(selector) {
    $(selector).removeClass("is-invalid");
}

function dateDiff(start, end) {
    return Math.round((new Date(end) - new Date(start)) / (24 * 60 * 60 * 1000)) + 1;
}

function inProgress(te) {
    let today = dateDiff(te.task.createDate, new Date());
    let deadline = dateDiff(te.task.createDate, te.task.endDate);
    let rs = today / deadline;
    return te.progress >= rs ? 1 : te.progress / rs;
}

function inValid(te) {
    let today = dateDiff(te.task.endDate, new Date());
    let deadline = dateDiff(te.task.createDate, te.task.endDate);
    let rs = today / deadline;
    return rs >= 2 ? 1 : (te.progress - rs);
}

const URL_API = "/api";

async function ajaxGet(url) {
    let rs = null;
    await $.ajax({
        type: 'GET',
        dataType: "json",
        url: URL_API + url,
        timeout: 30000,
        cache: false,
        success: function (result, textStatus, xhr) {
            rs = {
                data: result,
                status: xhr.status
            }
        }
    });
    return rs;
}

async function ajaxPost(url, data) {
    let rs = null;
    await $.ajax({
        type: 'POST',
        data: JSON.stringify(data),
        url: URL_API + url,
        timeout: 30000,
        contentType: "application/json",
        success: function (result, textStatus, xhr) {
            rs = {
                data: result,
                status: xhr.status
            }
        }
    });
    return rs;
}

async function ajaxPut(url, data) {
    let rs = null;
    await $.ajax({
        type: 'PUT',
        data: JSON.stringify(data),
        url: URL_API + url,
        timeout: 30000,
        contentType: "application/json",
        miniType: "application/json",
        success: function (result, textStatus, xhr) {
            rs = {
                data: result,
                status: xhr.status
            }
        }
    });
    return rs;
}

async function ajaxDelete(url, data) {
    let rs = null;
    await $.ajax({
        type: 'DELETE',
        data: JSON.stringify(data),
        url: URL_API + url,
        timeout: 30000,
        contentType: "application/json",
        success: function (result, textStatus, xhr) {
            rs = {
                data: result,
                status: xhr.status
            }
        }
    });
    return rs;
}

async function ajaxUploadFormData(url, formData) {
    let rs = null;
    await $.ajax({
        type: "POST",
        url: url,
        data: formData,
        cache: false,
        contentType: false,
        enctype: "multipart/form-data",
        processData: false,
        success: function (result, textStatus, xhr) {
            rs = {
                data: result,
                status: xhr.status
            }
        }
    });
    return rs;
}

function alertReport(isSuccess, text) {
    let alert = $("#alert-report");
    let result = `<div class="alert alert-${isSuccess ? "success" : "danger"} animate-report">
                    <strong>!</strong> ${text}
                  </div>`;
    alert.prepend(result);
    let firstElement = alert.children().first();
    setTimeout(function () {
        firstElement.remove();
    }, 3000);
}