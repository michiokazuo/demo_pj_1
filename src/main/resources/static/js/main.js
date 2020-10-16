$(function () {
    let pathName = $("#pathName").val();
    if (window.location.pathname.indexOf(pathName) >= 0) {
        $("a[href$='" + pathName + "']").addClass("active");
    }

    $(".modal").on("hidden.bs.modal", function () {
        $("form.form-post").trigger("reset");
        $("form.form-post input").removeClass("is-invalid");
    })
})

function dataFilter(field) {
    return field ? field : "";
}

function showSelectOption(element, list, defaultVal) {
    element.empty();
    element.append($('<option disabled></option>').val("").text("- " + defaultVal + " -"));
    list.forEach(function (e) {
        element.append($('<option></option>').val(e.val).text(e.text));
    })
}

function checkStatus(create, end, complete) {
    let msDay = 24 * 60 * 60 * 1000;
    let rs = `<span class="badge badge-success">Hoàn thành</span>`;
    if (!complete) {
        let endDate = new Date(end);
        let date = new Date();
        let time = endDate.getTime() - date.getTime();
        rs = (time >= 0 || -time < msDay) ? `<span class="badge badge-primary">Đang thực hiện</span>` : `<span class="badge badge-danger">Quá hạn</span>`;
    }

    return rs;
}

function checkProgress(progress) {
    return progress ? (progress - 0 === 100 ? `\`<span class="badge badge-success">100%</span>\`` : `<span class="badge badge-primary">${progress}%</span>`)
        : `<span class="badge badge-secondary">0%</span>`
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
    if (val.length > 0 && /^[a-z][a-z0-9_\.]{5,32}@[a-z0-9]{2,}(\.[a-z0-9]{2,4}){1,2}$/.test(val)) {
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

function viewError(selector, text) {
    $(selector).addClass("is-invalid");
    $(selector).siblings(".invalid-feedback").html(text + ". Mời nhập lại!");
}

function hiddenError(selector) {
    $(selector).removeClass("is-invalid");
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