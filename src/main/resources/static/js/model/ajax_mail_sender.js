const URL_MAIL_API = "/api/v1/public/mail";

function notify(formData) {
    return ajaxUploadFormData(`${URL_MAIL_API}/notify`, formData);
}