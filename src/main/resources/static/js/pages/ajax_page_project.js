let textName, dateComplete, dateCreate, dateEnd, textareaDescription, btnConfirmSave, btnConfirmDelete, btnAddProject
    , selectSort, textSearchName, dateSearchCreate, selectSearchStatus, btnSearch, tableData;

let listProject = [];
let listStatus = [
    {text: "Hoàn thành", val: "1"},
    {text: "Đang thực hiện", val: "0"},
    {text: "Quá hạn", val: "-1"}
];
let listSort = [
    {text: "(A -> Z) Tên", val: "0", field: "name", isASC: "true"},
    {text: "(Z -> A) Tên", val: "0", field: "name", isASC: "false"},
    {text: "Tạo gần đây", val: "", field: "createDate", isASC: "false"}
]
let indexProject, projectDTO, project;
let checkAction;

$(async function () {
    dateComplete = $("#complete_date");
    textName = $("#name");
    dateCreate = $("#create_date");
    dateEnd = $("#end_date");
    textareaDescription = $("#description");
    btnConfirmSave = $("#btn-save");
    btnConfirmDelete = $("#btn-delete");
    btnAddProject = $("#btn-add-project");
    textSearchName = $("#name-search");
    dateSearchCreate = $("#create_date_search");
    selectSearchStatus = $("#status_search");
    btnSearch = $("#btn-search");
    selectSort = $("#sort");
    tableData = $("#table-data");

    listSort = listSort.map((data, index) => {
        data.val = index;
        return data;
    });

    await loadProject();
    showSelectOption(selectSearchStatus, listStatus, "Tất cả");
    showSelectOption(selectSort, listSort, "Sắp xếp");
    viewProject();
    addProject();
    confirmDeleteProject();
    confirmSaveProject();
    sortProject();
    searchProject();
});

async function loadProject() {
    listProject = [];
    await projectFindAll()
        .then(function (rs) {
            if (rs.status === 200) {
                listProject = rs.data;
            }
        }).catch(function (e) {
            console.log(e);
        });
}

function viewProject() {
    let rs = `<tr><td colspan='6'><strong>No Data</strong></td></tr>`;

    if (listProject && listProject.length > 0) {
        rs = listProject.map((data, index) => {
            let project = data.project;

            if (project) {
                return `<tr data-index="${index}">
                        <th scope="row">${index + 1}</th>
                        <td>${dataFilter(project.name)}</td>
                        <td>${dataFilter(new Date(project.createDate).toLocaleDateString())}</td>
                        <td>${checkStatus(project.createDate, project.endDate, project.completeDate)}</td>
                        <td>
                            <a target="_blank" href="du-an/cong-viec-thanh-phan?projectId=${project.id}" 
                            class="text-decoration-none text-light btn btn-success m-1">
                                        <i class="fas fa-tasks"></i>
                                        <span class="text-light"> Xem </span>
                            </a>
                        </td>
                            <td>
                                <button type="button" class="btn btn-info m-1 update-project">
                                    <i class="far fa-eye"></i>
                                    Chi tiết
                                </button>`
                    + `${project.completeDate ? `` : `<button type="button" class="btn btn-danger m-1 delete-project">
                                    <i class="fas fa-trash-alt" ></i> Xóa
                                </button>`}`
                    + `</td>
                        </tr>`;
            }
            return ``;
        }).join("");

    }

    tableData.html(rs);
    updateProject();
    deleteProject();
}

function addProject() {
    btnAddProject.click(function () {
        checkAction = false;
        projectDTO = {};
        projectDTO.project = {}
        projectDTO.taskDTOs = null;

        dateComplete.prop('disabled', true);
        viewError(dateComplete, "Dự án mới tạo không được phép hoàn thành ngay");

        $("#modal-project").modal("show");
    });
}

function updateProject() {
    $(".update-project").click(function () {
        dateComplete.prop('disabled', false);
        checkAction = true;

        indexProject = $(this).parents("tr").attr("data-index");
        projectDTO = listProject[indexProject - 0];
        project = projectDTO.project;

        textName.val(project.name);
        dateCreate.val(new Date(project.createDate).toLocaleDateString('fr-CA'));
        dateEnd.val(new Date(project.endDate).toLocaleDateString('fr-CA'));
        dateComplete.val(project.completeDate ? new Date(project.completeDate).toLocaleDateString('fr-CA') : null);

        let test = false;
        if (projectDTO.taskDTOs && projectDTO.taskDTOs.length > 0) {
            for (let val of projectDTO.taskDTOs)
                if (!val.task.completeDate) {
                    test = true;
                    break;
                }

        } else test = true;

        if (test) {
            dateComplete.prop('disabled', true);
            viewError(dateComplete, "Dự án chưa được phép hoàn thành do vẫn còn đang thực hiện.");
        }

        $("#modal-project").modal("show");
    });
}

function confirmSaveProject() {
    btnConfirmSave.click(async function () {
        let {val: valName, check: checkName} = checkData(textName, /./, "Chưa nhập tên dự án");
        let {val: valEndDate, check: checkEndDate} = checkData(dateEnd,
            /([12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]))/, "Chưa nhập ngày kết thúc công việc");
        let {val: valCreateDate, check: checkCreateDate} = checkData(dateCreate,
            /([12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]))/, "Chưa nhập ngày bắt đầu công việc");

        if (checkName && checkCreateDate && checkEndDate) {
            // checkAction : false -- insert
            //               true -- update
            if (projectDTO && projectDTO.taskDTOs && projectDTO.taskDTOs.length > 0
                && dateComplete.val().trim() !== "") {
                let {val: valCompleteDate, check: checkCompleteDate} = checkData(dateComplete,
                    /([12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]))/, "Chưa nhập ngày hoàn thành");
                if (checkCompleteDate) {
                    projectDTO.project.completeDate = new Date(valCompleteDate);
                }
            }

            projectDTO.project.name = valName;
            projectDTO.project.createDate = new Date(valCreateDate);
            projectDTO.project.endDate = new Date(valEndDate);

            let {val: messSave, check: checkSaveRS} = checkSave(projectDTO);
            if (checkSaveRS) {
                let mess, check = false;
                if (checkAction) {
                    mess = "Sửa không thành công!!!";
                    await projectUpdate(projectDTO)
                        .then(function (rs) {
                            if (rs.status === 200) {
                                listProject[indexProject - 0] = rs.data;

                                mess = "Sửa thành công.";
                                check = true;
                            }
                        })
                        .catch(function (e) {
                            console.log(e);
                        });
                } else {
                    mess = "Thêm không thành công!!!";
                    await projectInsert(projectDTO)
                        .then(function (rs) {
                            if (rs.status === 200) {
                                listProject.push(rs.data);

                                mess = "Thêm thành công.";
                                check = true;
                            }
                        })
                        .catch(function (e) {
                            console.log(e);
                        });
                }

                viewProject();
                selectSort.prop('selectedIndex', 0);
                $("#modal-project").modal("hide");
                alertReport(check, mess);
            } else {
                alert(messSave);
            }
        }
    });
}

function deleteProject() {
    $(".delete-project").click(function () {
        indexProject = $(this).parents("tr").attr("data-index");
        projectDTO = listProject[indexProject - 0];
        project = projectDTO.project;

        $("#modal-delete").modal("show");
    });
}

function confirmDeleteProject() {
    btnConfirmDelete.click(async function () {
        let mess = "Xóa không thành công!!!";
        let check = false;

        await projectDelete(projectDTO)
            .then(function (rs) {
                if (rs.status === 200) {
                    listProject = listProject.filter((data, index) => {
                        return index !== (indexProject - 0);
                    });

                    mess = "Xóa thành công.";
                    check = true;
                }
            })
            .catch(function (e) {
                console.log(e);
            });

        viewProject();
        $("#modal-delete").modal("hide");
        alertReport(check, mess);
    });
}

function sortProject() {
    selectSort.change(async function () {
        await search_sort();
    });
}

function searchProject() {
    btnSearch.click(async function () {
        await search_sort();
    })
}

async function search_sort() {
    let indexSort = selectSort.val();
    let sort = listSort[indexSort - 0];

    let valNameSearch = textSearchName.val().trim();
    let valDateCreateSearch = dateSearchCreate.val().trim().replaceAll("-", "/");
    let valStatus = selectSearchStatus.val().trim();

    let q = (valNameSearch === "" ? "" : ("name=" + valNameSearch + "&"))
        + (valDateCreateSearch === "" ? "" : ("createDate=" + valDateCreateSearch + "&"))
        + (valStatus === "" ? "" : ("status=" + valStatus + "&"))
        + (sort ? ("field=" + sort.field + "&isASC=" + sort.isASC) : "");

    listProject = [];
    await projectSearchSort(q)
        .then(function (rs) {
            if (rs.status === 200) {
                listProject = rs.data;
            }
        })
        .catch(function (e) {
            console.log(e);
        });

    viewProject();
}

function checkSave(project) {
    // let msDay = 24 * 60 * 60;
    let check = false;
    let val = 'Logic ngày có vấn đế mời nhập lại!';

    let createDate = new Date(project.project.createDate);
    let endDate = new Date(project.project.endDate);
    let complete = project.project.completeDate;

    if (endDate.getTime() - createDate.getTime() >= 0)
        if (!complete) {
            check = true;
        } else {
            let completeDate = new Date(complete);
            let complete_create = completeDate.getTime() - createDate.getTime();
            // let end_complete = endDate.getTime() - completeDate.getTime();

            // trong cung 1 ngay
            if (complete_create >= 0) {
                check = true;
            }

            if (check) {
                if (!project.taskDTOs) {
                    check = false;
                    val = 'Dự án chưa được tạo công việc!';
                } else
                    for (const dto of project.taskDTOs)
                        if (dto.task.completeDate == null
                            || completeDate.getTime() - new Date(dto.task.completeDate).getTime() < 0) {
                            check = false;
                            val = 'Còn công việc chưa hoàn thành hoặc ngày hoàn thành dự án không hợp lệ. Mời nhập lại!';
                            break;
                        }
            }
        }

    return {val, check};
}