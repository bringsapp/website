document.addEventListener("DOMContentLoaded", function(){
    document.getElementById("sendcodeforgotpwd").addEventListener("click", sendPasswordResetOTP)
    document.getElementById("resetpassword").addEventListener("click", resetPassword)
})

function resetPassword(){
    let username = document.getElementById("username").value
    let otp = document.getElementById("forgotpassotp").value
    let passone = document.getElementById("password").value
    let passconf = document.getElementById("passwordconf").value

    let resetPassResp = document.getElementById("resetpassresp")
    if (passone != passconf){
        resetPassResp.innerHTML = "Password and confirm password don't match."
        resetPassResp.classList.add("warn")
        return
    } else {
        resetPassResp.innerHTML = ""
        resetPassResp.classList.remove("warn")
    }
    showLoadingIcon()
    let resetReq = {
        "Username" : username,
        "Password" : passone,
        "OTP" : otp
    }

    let resetPassURI = host+"/password/reset"
    postData(resetPassURI, resetReq, {}, "POST").then((data) => {
        hideLoadingIcon()
        // ok is response.ok which returns true if response HTTP code is between
        // 200-299 https://developer.mozilla.org/en-US/docs/Web/API/Response/ok

        if (data){
            resetPassResp.innerHTML = "Password reset was successful."
            resetPassResp.classList.add("success")
        } else {
            resetPassResp.classList.add("warn")
            resetPassResp.innerHTML = "Something went wrong resetting the password."
        }
    });
}

function sendPasswordResetOTP(){
    let username = document.getElementById("username").value
    let contactno = document.getElementById("contactno").value
    let otpElem = document.getElementById("otpmsg")
    if (username == "" || contactno == ""){
        otpElem.classList.add("warn")
        otpElem.innerHTML = "Please fill in username and contact no correctly."
        return
    }

    let req = {
        "Username" : username,
        "Contact" : contactno
    }

    let uri = host+"/password/otp"
    postData(uri, req, {}, "POST").then((data) => {
        console.log("response data",  data); // JSON data parsed by `data.json()` call
        // ok is response.ok which returns true if response HTTP code is between
        // 200-299 https://developer.mozilla.org/en-US/docs/Web/API/Response/ok

        if (data){
            otpElem.innerHTML = "OTP was sent successully."
            otpElem.classList.remove("warn")
            otpElem.classList.add("success")
        } else {
            otpElem.classList.add("warn")
            otpElem.classList.remove("success")
            otpElem.innerHTML = "Something went wrong sending the OTP."
        }
    });
}