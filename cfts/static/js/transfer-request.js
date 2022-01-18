/* transfer-request.js */
window.document.title = "Request Info";

// ADD SHIFT-CLICK SELECTION
function enableGroupSelection(selector) {
    let lastChecked = null;
    const checkboxes = Array.from(document.querySelectorAll(selector));

    checkboxes.forEach(checkbox => checkbox.addEventListener('click', event => {
        if (!lastChecked) {
            lastChecked = checkbox;
            checkbox.nextElementSibling.style.display = 'inline-block';
            return;
        }

        if (event.shiftKey) {
            const start = checkboxes.indexOf(checkbox);
            const end = checkboxes.indexOf(lastChecked);
            checkboxes
                .slice(Math.min(start, end), Math.max(start, end) + 1)
                .forEach(checkbox => checkbox.checked = lastChecked.checked);
        }

        // match reject buttons to checkboxes on each click
        //checkboxes.forEach( checkbox => checkbox.nextElementSibling.style.display = ( checkbox.checked ) ? 'inline-block' : 'none' );

        lastChecked = checkbox;
    }));
}

jQuery(document).ready(function() {

    if (document.location.search) {
        eml = document.location.search.substring(1, 7)
        if (eml == "mailto") {
            window.open(document.location.search.substring(1))
            history.pushState(null, "", location.href.split("?")[0])
        } else {
            let file = document.location.search.split('?')[1]
            if (file == 'false') {
                $('.btn-back').attr('href', '/queue')
            } else {
                let row = document.getElementById("row_" + file)

                row.scrollIntoView({
                    behavior: "smooth",
                    block: "center"
                })
                setTimeout(function() {
                    $('#row_' + file).fadeOut(400).fadeIn(400).fadeOut(400).fadeIn(400)
                }, 500)

                let fileLink = document.getElementById(file)
                // console.log(fileLink)
                history.pushState(null, "", location.href.split("?")[0])

                // fileLink.click()
                window.open(fileLink.href, '_blank');
            }
        }
    }

    $.ajaxSetup({
        beforeSend: function(xhr, settings) {
            xhr.setRequestHeader("X-CSRFToken", getCookie('csrftoken'));
        }
    });

    $('.btn-back').click(e => {
        e.preventDefault();
        window.location.href = jQuery(e.target).attr('href');
    });

    $('#noteBtn').click(e => {
        e.preventDefault();
        data = {
            'notes': $('#notesField').val()
        }


        $.post("/api-requestnotes/" + rqst_id, data, 'json').then(
            function(resp) {
                window.location.replace(window.location)
            },
        );

    });


    $('.reject-dupes').click(e => {
        e.preventDefault();
        requestIDs = []

        keeperID = $(e.target).attr('current_id');
        requestHash = $(e.target).attr('request_hash');

        requests = document.querySelectorAll('a.card[request_hash="' + requestHash + '"]')
        requests.forEach(request => {
            requestIDs.push(request.id)
        });

        data = {
            'requestIDs': requestIDs,
            'keeperRequest': keeperID
        }

        $.post("/api-setrejectdupes", data, 'json').then(
            function(resp) {
                window.location.replace(window.location)
            },
        );

    });

    $('.request-reject').click(e => {
        e.preventDefault();
        let requests = []

        if ($(e.target).hasClass('selected-reject')) {
            console.log("selcted reject clicked")

            const $checkedItems = $("[name='fileSelection']:checked[not-rejected]");
            const $checkedItemsRejected = $("[name='fileSelection']:checked[rejected]");

            // no files selected to reject or un-reject
            if ($checkedItems.length == 0 && $checkedItemsRejected.length == 0) {
                alert('Select 1 or more files to change rejection status.');
            }

            // selected files are a mix of rejected and not rejected files
            else if ($checkedItems.length > 0 && $checkedItemsRejected.length > 0) {
                alert('Cannot process a mix of rejected and non-rejected files. Rejection and un-rejection are seperate processes. Please select only files to reject or only files to un-reject.');
            }

            // files to reject
            else if ($checkedItems.length > 0) {
                $checkedItems.each(i => {
                    if (!requests.includes($($checkedItems[i]).attr('request_id'))) {
                        requests.push($($checkedItems[i]).attr('request_id'))
                    }

                });

                console.log(requests)

                if (requests.length > 1) {
                    alert('You can only reject files from the same request.')
                    requests = []
                } else {
                    let data = [];
                    $checkedItems.each(i => {
                        data.push({
                            'fileID': $checkedItems[i].id.slice(4),
                            'fileName': $($checkedItems[i]).attr('file_name'),
                            'requestID': $($checkedItems[i]).attr('request_id'),
                            'requestEmail': $($checkedItems[i]).attr('request_email')
                        })
                    });
                    rejectDialog.data('data', data).dialog('open');
                }
            }

            //files to un-reject
            else if ($checkedItemsRejected.length > 0) {
                let data = [];
                $checkedItemsRejected.each(i => {
                    data.push({
                        'fileID': $checkedItemsRejected[i].id.slice(4),
                        'fileName': $($checkedItemsRejected[i]).attr('file_name'),
                        'requestID': $($checkedItemsRejected[i]).attr('request_id'),
                        'requestEmail': $($checkedItemsRejected[i]).attr('request_email'),
                        'unreject': true
                    })
                });
                sendUnrejectRequest(data)
            }

        } else {
            console.log("request reject clicked")
            const checkboxes = Array.from(document.querySelectorAll('input[type="checkbox"]'));
            checkboxes.forEach(checkbox => {
                checkbox.removeAttribute("hidden");
            });

            $(e.target).text("Reject Selected")
            $(e.target).addClass('selected-reject')
        }

    });

    const sendUnrejectRequest = (data) => {
        console.log(data);

        let csrftoken = getCookie('csrftoken');

        let id_list = [];
        data.forEach((f) => {
            id_list.push(f.fileID)
        });

        const postData = {
            'request_id': data[0]['requestID'], // doesn't matter which request we grab
            'id_list': id_list
        };

        const setUnrejectOnFiles = $.post('/api-unreject', postData, 'json').then(
            // success
            function(resp, status) {
                console.log('SUCCESS');
                // notifyUserSuccess("File Unreject Successful")
                $("#forceReload").submit();
            },
            // fail 
            function(resp, status) {
                console.log('FAIL');

                alert("Failed to unreject files, send error message to web team.")
                responseText = resp.responseText
                errorInfo = responseText.substring(resp.responseText.indexOf("Exception Value"), resp.responseText.indexOf("Python Executable"))

                notifyUserError("Error unrejecting file, send error message to web team: " + errorInfo)
                //console.log( 'Server response: ' + JSON.stringify(resp,null, 4));
                // console.log( 'Response status: ' + status );
            }
        );

    };


    /****************************/
    /* Encrypt files in request */
    /****************************/

    $('.request-encrypt').click(e => {
        e.preventDefault();

        if ($(e.target).hasClass('selected-encrypt')) {
            console.log("selcted encrypt clicked")

            const $checkedItems = $("[name='fileSelection']:checked");

            if ($checkedItems.length == 0) {
                alert(' Select 1 or more files to encrypt.');
            } else {
                let data = [];
                $checkedItems.each(i => {
                    data.push({
                        'fileID': $checkedItems[i].id.slice(4),
                        'fileName': $($checkedItems[i]).attr('file_name'),
                        'requestID': $($checkedItems[i]).attr('request_id'),
                        'requestEmail': $($checkedItems[i]).attr('request_email')
                    })
                });
                sendEncryptRequest(data)
            }

        } else {
            console.log("request encrypt clicked")
            const checkboxes = Array.from(document.querySelectorAll('input[type="checkbox"]'));
            checkboxes.forEach(checkbox => {
                checkbox.removeAttribute("hidden");
            });

            $(e.target).text("Encrypt Selected")
            $(e.target).addClass('selected-encrypt')
        }

    });

    const sendEncryptRequest = (data) => {
        console.log(data);

        let csrftoken = getCookie('csrftoken');

        let id_list = [];
        data.forEach((f) => {
            id_list.push(f.fileID)
        });

        const postData = {
            'request_id': data[0]['requestID'], // doesn't matter which request we grab
            'id_list': id_list
        };

        const setEncryptOnFiles = $.post('/api-setencrypt', postData, 'json').then(
            // success
            function(resp, status) {
                console.log('SUCCESS');
                // notifyUserSuccess("File Encryption Successful")
                $("#forceReload").submit();
            },
            // fail 
            function(resp, status) {
                console.log('FAIL');

                alert("Failed to encrypt files, send error message to web team.")
                responseText = resp.responseText
                errorInfo = responseText.substring(resp.responseText.indexOf("Exception Value"), resp.responseText.indexOf("Python Executable"))

                notifyUserError("Error encrypting file, send error message to web team: " + errorInfo)
                //console.log( 'Server response: ' + JSON.stringify(resp,null, 4));
                // console.log( 'Response status: ' + status );
            }
        );

    };

    const checkSelection = (selector) => {
        let $ele = $(selector);
        if ($ele.val().length == 0) {
            $ele.addClass('ui-state-error');
            alert($ele.attr('name') + ' cannot be blank.');
            return false;
        } else {
            return true;
        }
    };

    // REJECTION MODAL INPUT VALIDATION AND ACTION
    const rejectFormCallback = (theDialog) => {
        // user input validation
        let isValid = true;
        isValid = isValid && checkSelection("[name='reason']");

        /* THE REAL WORK GOES HERE */
        if (isValid) {
            let data = $(theDialog).data().data;

            let $this = $("[name='reason'] option:selected");
            let requests = {};

            let csrftoken = getCookie('csrftoken');

            let id_list = [];
            data.forEach((f) => {
                id_list.push(f.fileID)
            });

            const postData = {
                'reject_id': $this.val(),
                'request_id': data[0]['requestID'], // doesn't matter which request we grab
                'id_list': id_list
            };

            const setRejectOnFiles = $.post('/api-setreject', postData, 'json').then(
                // success
                function(resp) {
                    console.log('SUCCESS');
                    // notifyUserSuccess("File rejection Successful")
                    //console.log( 'Server response: ' + resp);
                    if (resp != "DEBUG") {
                        // create mailto anchor
                        let $anchor = $("<a class='emailLink' target='_blank' href='" + resp + "''></a>");
                        $(document.body).append($anchor);

                        $('.emailLink').each(function() {
                            $(this)[0].click();
                        });


                        // close the dialog
                        $(theDialog).dialog('close');
                    }
                    // reload the page from server
                    $("#forceReload").submit();

                },
                // fail 
                function(resp, status) {
                    // close the dialog
                    $(theDialog).dialog('close');
                    alert("Failed to reject files, send error message to web team.")

                    console.log('FAIL');
                    responseText = resp.responseText
                    errorInfo = responseText.substring(resp.responseText.indexOf("Exception Value"), resp.responseText.indexOf("Python Executable"))

                    notifyUserError("Error rejecting file, send error message to web team: " + errorInfo)
                    //console.log( 'Server response: ' + JSON.stringify(resp,null, 4));
                    // console.log( 'Response status: ' + status );
                }
            );



        } else {
            /* bad user, no cookie */
            console.log("What did you do, Ray?");
        }
    };

    const rejectDialog = $('#reject-form').dialog({
        autoOpen: false,
        height: 200,
        width: 350,
        modal: true,
        buttons: {
            "Reject Files": function() {
                let theDialog = this;
                rejectFormCallback(theDialog);
            },
            Cancel: () => rejectDialog.dialog('close')
        },
        close: () => {
            rejectForm[0].reset();
            $("[name='reason']").removeClass('ui-state-error');
        }
    });

    const rejectForm = rejectDialog.find('form').submit(e => {
        e.preventDefault();
        rejectFormCallback(rejectDialog);
    })

    // supersuer button to remove users from file review
    $('.request-remove').click(e => {
        e.preventDefault();

        if ($(e.target).hasClass('selected-remove')) {
            console.log("selcted Remove clicked")

            const $checkedItems = $("[name='fileSelection']:checked");

            if ($checkedItems.length == 0) {
                alert(' Select 1 or more files to remove reviewer from.');
            } else {
                let data = [];

                if ($(e.target).hasClass('one-eye')) {
                    stage = 1
                } else if ($(e.target).hasClass('two-eye')) {
                    stage = 2
                }

                $checkedItems.each(i => {
                    data.push({
                        'fileID': $checkedItems[i].id.slice(4),
                    })
                });

                rqst_id = $(e.target).attr('rqst_id')

                sendRemoveRequest(data, stage, rqst_id)
            }

        } else {
            console.log("request remove clicked")
            const checkboxes = Array.from(document.querySelectorAll('input[type="checkbox"]'));
            checkboxes.forEach(checkbox => {
                checkbox.removeAttribute("hidden");
            });
            const reviewers = Array.from(document.querySelectorAll('.reviewers'))
            reviewers.forEach(elem => {
                elem.classList.remove('d-none')
            })
            $(e.target).text("Remove Selected")
            $(e.target).addClass('selected-remove')
        }

    });

    const sendRemoveRequest = (data, stage, rqst_id) => {
        console.log(stage)
        let csrftoken = getCookie('csrftoken');

        let id_list = [];
        data.forEach((f) => {
            id_list.push(f.fileID)
        });

        const postData = {
            'id_list': id_list,
            'rqst_id': rqst_id
        };

        const removeReviewers = $.post('/removeFileReviewer/' + stage, postData, 'json').then(
            // success
            function(resp, status) {
                console.log('SUCCESS');
                // notifyUserSuccess("Reviewer removed Sccessfully")
                $("#forceReload").submit();
            },
            // fail 
            function(resp, status) {
                console.log('FAIL');

                alert("Failed to remove reviewer, send error message to web team.")
                responseText = resp.responseText
                errorInfo = responseText.substring(resp.responseText.indexOf("Exception Value"), resp.responseText.indexOf("Python Executable"))

                notifyUserError("Error removing reviewer, send error message to web team: " + errorInfo)
                //console.log( 'Server response: ' + JSON.stringify(resp,null, 4));
                // console.log( 'Response status: ' + status );
            }
        );

    };
    // RUN THIS STUFF NOW THAT THE PAGE IS LOADED
    enableGroupSelection('input[type="checkbox"]')

});