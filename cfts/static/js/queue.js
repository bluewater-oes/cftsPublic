window.document.title = "CFTS -- Transfer Queue";


/*************************/
/* THE REAL FUN BEGINS!! */
/*************************/
jQuery(document).ready(function() {

    if (document.location.search) {
        let network = document.location.search.split('?')[1]
        let activeQueue = document.getElementsByClassName("tab-pane container active")[0]
        let activeTab = document.getElementsByClassName("nav-link active")[0]
        let newActiveTab = document.querySelector('a.nav-link[href="#tab' + network + '"]')

        activeTab.classList.remove("active")
        newActiveTab.classList.add("active")

        activeQueue.classList.remove("active")

        activeQueue = document.getElementById("tab" + network)
        activeQueue.classList.add("active")

        var scrollID = document.location.search.split('?')[2]
        history.pushState(null, "", location.href.split("?")[0])
        let scrollElm = document.getElementById(scrollID)
        scrollElm.scrollIntoView({
            behavior: "smooth",
            block: "center"
        })
        setTimeout(function() {
            $('#' + scrollID).fadeOut(400).fadeIn(400).fadeOut(400).fadeIn(400)
        }, 500)
    }

    $.ajaxSetup({
        beforeSend: function(xhr, settings) {
            xhr.setRequestHeader("X-CSRFToken", getCookie('csrftoken'));
        }
    });

    // PULL BUTTON CLICK HANDLER
    $('.pull-button').click(e => {
        e.preventDefault();
        pullBtn = $(e.target);
        buttonID = pullBtn.attr('id');
        netName = buttonID.substr(4);
        let url = '/create-zip/' + netName + '/false';

        if ($(e.target).hasClass('disabled')) {
            alert('There are no pending transfer requests to pull for this network.')
        } else {
            $('.pull-button').prop('disabled', true);

            $.get(url, {}, 'json').then(
                function(resp, status) {
                    // TODO: AJAX success != pull success
                    // display success to the user
                    // alert( 'Pull complete. New ZIP file created for ' + netName + '.  Click the download button to retrieve it.' );

                    // prevent a second pull
                    //pullBtn.addClass( 'disabled' );
                    $('.pull-button').addClass('disabled');

                    // update link on page to avoid unnecessary refresh 
                    downloadBtn = $('#dl' + netName);
                    downloadBtn.attr('href', '/static/files/' + netName + '_' + resp.pullNumber + '.zip');
                    downloadBtn.text('Download Current ' + netName + ' Zip')
                    downloadBtn.attr('hidden', false);
                    downloadBtn.focus();

                    // update last pulled info
                    $('.last-pull-info .date-pulled').text(resp.datePulled);
                    $('.last-pull-info .user-pulled').text(resp.userPulled);
                    //notifyUserSuccess("Pull Created Successfully")

                    $("#forceReload").submit();

                },

                function(resp, status) {
                    console.error('Shit broke, yo.');
                    alert("Failed to create pull, send error message to web team.")
                    responseText = resp.responseText
                    errorInfo = responseText.substring(resp.responseText.indexOf("Exception Value"), resp.responseText.indexOf("Python Executable"))

                    //notifyUserError("Error Creating Pull, send error message to web team:  " + errorInfo)
                }
            );
        }
    });

    /***************************/
    /* Show duplicate requests */
    /***************************/
    var dupeButton = document.querySelectorAll('.show-dupe')
    $('.show-dupe').click(e => {
        e.preventDefault();
        $('#' + scrollID).removeAttr("style")
        if ($(e.target).hasClass('dupes-visable')) {
            console.log("hide dupes")

            const dupes = Array.from(document.querySelectorAll('a[request_hash="' + $(e.target).attr('request_hash') + '"]'));
            const others = Array.from(document.querySelectorAll('div.col-12'));
            dupes.forEach(dupe => {
                dupe.classList.remove("dupe");
            });

            others.forEach(other => {
                other.classList.remove("d-none");
            });

            dupeButton.forEach(button => {
                button.textContent = "Show Duplicates"
                button.classList.remove('dupes-visable')
            });

        } else {
            console.log("show dupes")
            const dupes = Array.from(document.querySelectorAll('a[request_hash="' + $(e.target).attr('request_hash') + '"]'));
            const others = Array.from(document.querySelectorAll('a.card'));
            others.forEach(other => {
                other.parentElement.classList.add("d-none");
            });

            dupes.forEach(dupe => {
                dupe.classList.add("dupe");
                dupe.parentElement.classList.remove("d-none");
            });

            dupeButton.forEach(button => {
                button.textContent = "Show All Requests"
                button.classList.add('dupes-visable')
            });
        }

    });
    var cookiesFlipped = 0;
    var flippedCookies = []
    var score = 0

    $('.confetti').hide()

    $('.cookie-card').click(e => {
        e.preventDefault();
        if (cookiesFlipped == 0) {
            cookiesFlipped += 1
            flippedCookies.push(e.currentTarget)

            console.log($(flippedCookies[0]).attr('cookie'))
            $(e.currentTarget).find('.back').addClass('hidden')
            $(e.currentTarget).find('.real').removeClass('hidden')
        } else if (cookiesFlipped == 1) {
            cookiesFlipped += 1
            flippedCookies.push(e.currentTarget)

            console.log($(flippedCookies[0]).attr('cookie'), $(flippedCookies[1]).attr('cookie'))

            $(e.currentTarget).find('.back').addClass('hidden')
            $(e.currentTarget).find('.real').removeClass('hidden')

            if ($(flippedCookies[0]).attr('cookie') == $(flippedCookies[1]).attr('cookie')) {
                console.log('cookie match')

                setTimeout(function() {
                    $(flippedCookies[0]).addClass('cookie-hidden')
                    $(flippedCookies[1]).addClass('cookie-hidden')
                    score += 1
                    console.log(score)

                    flippedCookies = []
                    cookiesFlipped = 0
                    if (score == 10) {
                        $('.confetti').show()
                        $('.cookie-card').hide()
                        $('.cookie-header').text("You ate all the cookies!!!")
                    }
                }, 750)
            } else {
                console.log('no match')
                setTimeout(function() {
                    console.log('reset cards')

                    $(flippedCookies[0]).find('.back').removeClass('hidden')
                    $(flippedCookies[0]).find('.real').addClass('hidden')
                    $(flippedCookies[1]).find('.back').removeClass('hidden')
                    $(flippedCookies[1]).find('.real').addClass('hidden')

                    flippedCookies = []
                    cookiesFlipped = 0
                }, 750)
            }


        }

    });

});