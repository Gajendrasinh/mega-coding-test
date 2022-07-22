"use strict";

const modalOption = {
    backdrop: "static",
    keyboard: false
}

const fileUploadModal = new bootstrap.Modal('#fileUploadModal', modalOption)

$(document).ready(() => {
    fileUploadModal.show();
    setProgressData()
});

function setFileValue(event) {
    var key = $("#password").val();
    if (key) {
        const iv = CryptoJS.lib.WordArray.random(128 / 8);

        const file = event.target.files[0];

        const reader = new FileReader();

        // Read file callback!
        reader.onload = function (e) {

            let encrypted = CryptoJS.AES.encrypt(e.target.result, key, {
                iv: iv,
                mode: CryptoJS.mode.CBC,
                padding: CryptoJS.pad.Pkcs7
            });

            const encryptedFile = new File([encrypted], file.name + '.encrypted', { type: file.type, lastModified: file.lastModified });
            console.log('encryptedFile', encryptedFile);

            console.log('CryptoJS', CryptoJS.AES.decrypt(encrypted, key).toString(CryptoJS.enc.Utf8));
        }

        reader.readAsDataURL(file);
        $("#uploadFile").val(file.name);
    }
    else {
        $("#result").text("Enter Password to Encrypt Files").addClass("alert-danger");
    }
}

function uploadFileOnServer() {
    if ($("#uploadFile").val()) {
        // Get form
        var form = $('#fileUploadForm')[0];

        // Create an FormData object 
        var data = new FormData(form);

        // disabled the submit button
        $("#submitBtn").prop("disabled", true);

        $.ajax({
            type: "POST",
            enctype: 'multipart/form-data',
            url: "https://upload.imagekit.io/api/v1/files/upload",
            data: data,
            processData: false,
            contentType: false,
            cache: false,
            timeout: 600000,
            success: function (data) {

                $("#result").text(data).addClass("alert-success");
                console.log("SUCCESS : ", data);
                $("#btnSubmit").prop("disabled", false);

            },
            error: function (e) {

                $("#result").text(e.responseJSON['message']).addClass("alert-danger");
                console.log("ERROR : ", e);
                $("#btnSubmit").prop("disabled", false);

            }
        });
    } else {
        $("#result").text("Plase upload file").addClass("alert-danger");
    }


}

let fileStatus = [{
    date: "07/06/2022",
    name: "Z00-001.png",
    status: "complete",
    progress: "100"
},
{
    date: "07/06/2022",
    name: "New house.png",
    status: "fail",
    progress: "100"
},
{
    date: "07/06/2022",
    name: "mycat.jgeg",
    status: "inprogess",
    progress: "60"
},
{
    date: "07/06/2022",
    name: "history-doc.docx",
    status: "started",
    progress: "0"
}]

function setProgressData() {
    let _tbody = fileStatus.map((data, index) => {

        let processClass = 'bg-info';

        if (data.status == "complete") {
            processClass = "bg-success"
        } else if (data.status == "inprogess") {
            processClass = "bg-success"
        } else if (data.status == "started") {
            processClass = "bg-gray"
        } else if (data.status == "fail") {
            processClass = "bg-danger"
        } else {
            processClass = "bg-info"
        }

        return `<tr key=${index.toString()}>
        <td>${data.date}</td>
        <td>${data.name}</td>
        <td>
          <div class="progress">
            <div
            processClass = "bg-danger"
            class="progress-bar  ${processClass}"
              role="progressbar"
              style="width: ${data.progress}%"
              aria-valuenow="100"
              aria-valuemin="0"
              aria-valuemax="${data.progress}"
            ></div>
          </div>
        </td>
      </tr>`
    });
    $(".custom-table > tbody").append(_tbody);
}