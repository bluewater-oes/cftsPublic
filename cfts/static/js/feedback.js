window.document.title = "CFTS -- Feedback Submit"
xferForm = document.querySelector("#transfer-request-form");
xferForm.addEventListener("submit", process, false);

let buggedPKIs = ['f7d359ebb99a6a8aac39b297745b741b']


/* *************************************************** */
/* GET USER CERT INFORMATION FROM VAR IN FRONTEND.HTML */
/* *************************************************** */
  // console.log(cert)
  subject = cert.split("=")
  subject = subject[subject.length-1]
  // console.log(subject)
  user = subject.split(".")
  // console.log(user)

  if (buggedPKIs.includes(userHash) == false){
	$("#firstName").val(user[1])
  	$("#lastName").val(user[0]) 
    }
  
  $("#userID").val(userHash)

  
  // change place holder text when category has changed
  $('#category').change(function(){
    switch($("select option:selected").val()){
      case "Feedback":
        $("#feedback").attr("placeholder","We'd love to hear your thoughts.")
        break
      case "Bug Report":
        $("#feedback").attr("placeholder","Please be as detailed as possible and provide steps to reproduce the bug if possible.")
        break
      case "Feature Request":
        $("#feedback").attr("placeholder","Give us the details for your feature request. Go as in depth as possible, also please include your justification for the feature if possible.")
        break
    }

  })



/* **************** */
/* EMAIL VALIDATION */
/* **************** */
function checkEmail(email, net, direction) {
  // look -- if it's not even a real email address, just kick it the eff out
  var emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  if (!email.match(emailRegex)) return false;

  let domain = email.split("@").pop();
  let domainArray = domain.split(".");
  let check = "";
  switch (net) {
    case "NIPR":
      check = domainArray.pop();
      return domain.indexOf("smil") == -1 && domain.indexOf("cmil") == -1 && (check == "mil" || check == "gov") ? true : false;
    case "SIPR":
      return domainArray.slice(-2).join(".") == "smil.mil" ? true : false;
    default:
	    check = domainArray.pop();
      return (check == "mil" || check == "gov" || check == "edu" || check == "org") ? true : false;
  }
  // fail by default
  return false;
}

/* *************** */
/* FORM VALIDATION */
/* *************** */
function validateForm(form) {
  let thisNet = "SIPR";
  let isValid = true;
  let errors = [];

  // CLEAR!!  ...any previous submissions
  [...form.elements].forEach((elem) => {
    elem.classList.remove("is-valid");
    elem.classList.remove("is-invalid");
  });

  // name
  if (!(form.elements.firstName.value.length && form.elements.lastName.value.length)) {
    console.log("missing names")
    errors.push(form.elements.firstName, form.elements.lastName);
    isValid = false;
  }

  // source email
  if (!(form.elements.userEmail.value.length && checkEmail(form.elements.userEmail.value, thisNet, "from"))) {
    errors.push(form.elements.userEmail);
    isValid = false;
  }

  // category
  if (!(form.elements.title.value.length )) {
    errors.push(form.elements.title);
    isValid = false;
  }

  // category
  if (!(form.elements.category.value.length )) {
    errors.push(form.elements.category);
    isValid = false;
  }

  // feedback body
  if (!(form.elements.feedback.value.length )) {
    errors.push(form.elements.feedback);
    isValid = false;
  }

  // process errors
  if (!isValid) {
    // it's just a bunch of screwing around and explosions until you write it down (aka: log it)
    //errors.forEach( ( elem ) => console.dir( elem ) );

    // mark everything good
    [ ...form.elements ].forEach( ( elem ) => elem.classList.add( "is-valid" ) );

    // mark the naughty-naughties
    errors.forEach((elem) => {
      elem.classList.remove( "is-valid" );
      elem.classList.add( "is-invalid" );
    });
  }

  return isValid;
}

/* ****************************** */
/* AJAX REQUEST SENT SUCCESSFULLY */
/* ****************************** */
function successHandler(r) {
  console.dir(r);
  notifyUserSuccess("THANK YOU! Your feedback have been submitted. ");
  // CLEAN UP!!

  email = $("#userEmail").val();
  //phone = $("#userPhone").val();

  document.getElementById("transfer-request-form").reset();
  //resetFileQueue();
  //resetAdditionalEmails();
  autoFileUserInfo(email);

  // re-enable the submit button
  $('#submitButton').prop('disabled',false);
}

function autoFileUserInfo(email){
  if (buggedPKIs.includes(userHash) == false){
	$("#firstName").val(user[1])
  	$("#lastName").val(user[0])
    } 

  $("#PKIinfo").val(cert) 
  $("#userID").val(userHash)
  $("#userEmail").val(email)
  //$("#userPhone").val(phone)
}

/* ******************* */
/* AJAX REQUEST FAILED */
/* ******************* */
function failHandler(r, s) {
  notifyUserError(
    "A system error occurred while trying to submit the feedback.\n\n" +
      r.status +
      ": " +
      r.statusText +
      '.  Please notify the CFTS administrators of this error. Contact info can be found by clicking "Contact Us" at the bottom of the page.'
  );

  // re-enable the submit button
  $('#submitButton').prop('disabled',false);
}



/* ***************************************************************** */
/* THE ROOT FORM PROCESSING FUNCTION (EVERYTHING ELSE SUPPORTS THIS) */
/* ***************************************************************** */
function process(e) {
  preventDefaults(e);
  
  // disable the submit button once clicked, prevent duplicate submissions from multi clicks
  $('#submitButton').prop('disabled',true);

  let isValid = validateForm(xferForm);

  if (isValid) {
    // Give user feedback that the submit action occurred and things are happening
    notifyUserSuccess(
      "Submitting the feedback now. Please stand by ... "
    );

    // give it a quick refresh
    //updateFileInfo();

    let prepData = new FormData(xferForm);


    
      //Add the CSRF token to ajax requests
     $.ajaxSetup({
       beforeSend: function (xhr, settings) {
         xhr.setRequestHeader("X-CSRFToken", getCookie("csrftoken"));
       },
     });


    ajaxSettings = {
      url: "submitfeedback",
      method: "POST",
      data: prepData,
      contentType: false,
      processData: false,
    };
    $.ajax(ajaxSettings).done(successHandler).fail(failHandler);
  } else {

    // notify the user there were validation errors
    notifyUserWarning("There are errors on the request form.  Please review and address the indicated fields.");

    // re-enable the submit button
    $('#submitButton').prop('disabled',false);
  }
}

