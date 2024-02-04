document.addEventListener("DOMContentLoaded", function(){
    document.getElementById("createacclink").addEventListener("click", showRegistrationForm);
    document.getElementById("loginlink").addEventListener("click", showLoginForm);
    document.getElementById("loginlinkreg").addEventListener("click", showLoginForm);

    document.getElementById("loginbutton").addEventListener("click", function Login() {
        u=document.getElementById("username").value
        p=document.getElementById("password").value

        e = document.getElementById("loginerror")
        if (u.length<5 || p.length<5){
            e.innerText = "Username and Passowrd should have at least 5 chars."
            return
        } else {
            e.innerText = ""
        }

        showLoadingIcon()
        loginCreds = {
                Username: u,
                Password: p
        }
        headers={}
        postData(host+"/login", loginCreds, headers, "POST").then((data) => {
            hideLoadingIcon()
            console.log("response data",  data); // JSON data parsed by `data.json()` call
            // ok is response.ok which returns true if response HTTP code is between
            // 200-299 https://developer.mozilla.org/en-US/docs/Web/API/Response/ok
            if (data){
                if (data.Token !=""){
                    let encodedPayload = data.Token.split(".")[1]
                    let payload=atob(encodedPayload)
                    let payloadObj=JSON.parse(payload)
                    createCookie("token", data.Token, payloadObj.exp)

                    window.location = "entries"
                }
            } else {
                e.innerText = "Login failed, either username or password are incorrect."
            }
        });
    })

    document.getElementById("registrationbutton").addEventListener("click", register)
    document.getElementById("regusername").addEventListener("blur", isUsernameAvailable)
    document.getElementById("regphone").addEventListener("blur", isPhoneRegistered)
    document.getElementById("regpasswordconf").addEventListener("blur", confPassMatches)
    document.getElementById("regpassword").addEventListener("blur", passValid)
    document.getElementById("regfirstname").addEventListener("blur", firstNameValid)
    document.getElementById("reglastname").addEventListener("blur", lastNameValid)
    document.getElementById("reggender").addEventListener("change", genderValid)
})

function genderValid(){
    let g = this.value
    let gmsg = document.getElementById("gmsg")
    if (g == "select"){
        gmsg.innerHTML = "Please select gender."
        gmsg.classList.add("warn")
        gmsg.classList.remove("success")
        this.setAttribute("valid", "false")
    } else {
        gmsg.innerHTML = ""
        this.setAttribute("valid", true)
    }
}

function lastNameValid(){
    let lastName = this.value
    let lnameMsg = document.getElementById("lnamemsg")
    if (lastName.length < 2){
        lnameMsg.innerHTML = "Lastname must have at least 2 chars."
        lnameMsg.classList.add("warn")
        lnameMsg.classList.remove("success")
        this.setAttribute("valid", "false")
    } else {
        lnameMsg.innerHTML = ""
        this.setAttribute("valid", "true")
    }
}

function firstNameValid(){
    let firstName = this.value
    let fnameMsg = document.getElementById("fnamemsg")
    if (firstName.length < 2){
        fnameMsg.innerHTML = "Firstname must have at least 2 chars."
        fnameMsg.classList.add("warn")
        fnameMsg.classList.remove("success")
        this.setAttribute("valid", "false")
    } else {
        fnameMsg.innerHTML = ""
        this.setAttribute("valid", "true")
    }
}

function passValid(){
    let pass = this.value
    let passmsg = document.getElementById("passmsg")
    if (pass.length < 5){
        passmsg.innerHTML = "Password can not have less than 5 chars."
        passmsg.classList.add("warn")
        passmsg.classList.remove("success")
        this.setAttribute("valid", "false")
    } else {
        passmsg.innerHTML = ""
        this.setAttribute("valid", "true")
    }
    confPassMatches()
}

function confPassMatches(){
    let passOne = document.getElementById("regpassword").value
    let two = document.getElementById("regpasswordconf")
    let passTwo = document.getElementById("regpasswordconf").value

    let confPassMsg = document.getElementById("confpassmsg")
    if (passOne != passTwo){
        two.setAttribute("valid", "false")
        confPassMsg.innerHTML = "Passwords don't match."
        confPassMsg.classList.remove("success")
        confPassMsg.classList.add("warn")
        return
    } else {
        confPassMsg.innerHTML = ""
        two.setAttribute("valid", "true")
    }
}

function isPhoneRegistered(){
    let phoneMsg = document.getElementById("phonemsg")
    phoneMsg.innerHTML = ""
    let phoneNo = this.value
    if (phoneNo.length < 5){
        phoneMsg.innerHTML = "Phone no should have at least 5 chars."
        phoneMsg.classList.remove("success")
        phoneMsg.classList.add("warn")
        this.setAttribute("valid", "false")
        return
    } else {
        let phonePattern = /^[\+][0-9]*$/
        if (phonePattern.test(phoneNo)){
            phoneMsg.innerHTML = ""
            this.setAttribute("valid", "true")
        } else{
            phoneMsg.innerHTML = "Enter correct phone with country code."
            phoneMsg.classList.remove("success")
            phoneMsg.classList.add("warn")
            this.setAttribute("valid", "false")
            return
        }
    }


    // encode phone no so that `+` can be encoded in url
    phoneNo = encodeURIComponent(phoneNo)
    postData(host+"/contactno/registered?no="+phoneNo, {}, {}, "GET").then((data) => {
        if (data){
            if (data.Message == "true"){
                phoneMsg.innerHTML = "Phone no is already registered, it looks like you already have an account."
                phoneMsg.classList.remove("success")
                phoneMsg.classList.add("warn")
                this.setAttribute("valid", "false")
            } else {
                phoneMsg.innerHTML = ""
                this.setAttribute("valid", "true")
            }
        } else {
            phoneMsg.classList.add("warn")
            phoneMsg.classList.remove("success")
            phoneMsg.innerHTML = "Something went wrong, while checking if phone is already registered."
            this.setAttribute("valid", false)
        }
    })
}

function isUsernameAvailable(){
    let usernameMsg = document.getElementById("usernamemsg")
    usernameMsg.innerHTML = ""
    let username  = this.value
    if (username.length < 5){
        usernameMsg.innerHTML = "Username can not be less than 5 chars."
        usernameMsg.classList.add("warn")
        usernameMsg.classList.remove("success")
        this.setAttribute("valid", "false")
        return
    } else {
        var specialChars = /[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
        if (specialChars.test(username)){
            usernameMsg.classList.remove("success")
            usernameMsg.classList.add("warn")
            usernameMsg.innerHTML = "Username can only contain alphanumeric chars."
            this.setAttribute("valid", "false")
            return
        } else {
            usernameMsg.innerHTML = ""
            this.setAttribute("valid", "true")
        }
    }

    postData(host+"/username?u="+username, {}, {}, "GET").then((data) => {
        if (data){
            if (data.Message == "true"){
                usernameMsg.classList.add("warn")
                usernameMsg.classList.remove("success")
                usernameMsg.innerHTML = "This username is not available."
                this.setAttribute("valid", "false")
            } else {
                usernameMsg.innerHTML = ""
                this.setAttribute("valid", "true")
            }
        } else {
            usernameMsg.classList.add("warn")
            usernameMsg.classList.remove("success")
            usernameMsg.innerHTML = "Something went wrong, checking if username is available."
            this.setAttribute("valid", "false")
        }
    })
}

function register(){
    let e = document.getElementById("registrationerror")

    let valid = isRegForValid()
    if (!valid){
        e.innerHTML = "Registration form is not valid."
        e.classList.add("warn")
        e.classList.remove("success")
        return
    } else {
        e.innerHTML = ""
    }
    showLoadingIcon("loadingReg")

    username = document.getElementById("regusername").value
    firstName = document.getElementById("regfirstname").value
    lastName = document.getElementById("reglastname").value
    password = document.getElementById("regpassword").value
    gender = document.getElementById("reggender").value
    phone = document.getElementById("regphone").value

    request = {
        "Username":username,
        "FirstName":firstName,
        "LastName":lastName,
        "Password":password,
        "Gender":gender,
        "Phone":phone
    }
    headers={}
    postData(host+"/register", request, headers, "POST").then((data) => {
        // ok is response.ok which returns true if response HTTP code is between
        // 200-299 https://developer.mozilla.org/en-US/docs/Web/API/Response/ok
        hideLoadingIcon("loadingReg")
        if (data){
            if (data.Message =="User created successfully"){
                e.classList.remove("warn")
                e.classList.add("success")
                e.innerText = "Registration was successful."
            }
        } else {
            e.classList.remove("success")
            e.classList.add("warn")
            e.innerText = "Something went wrong registering you to the application."
        }
    });
}

function isRegForValid(){
    let inputs = document.getElementsByClassName("loginforminput")
    for (i=0; i< inputs.length; i++){
        if (inputs[i].getAttribute("valid") == "false"){
            return false
        }
    }
    return true
}

function showRegistrationForm(){
    hideDivWithID("login")
    showDivWithID("registration")
}

function showLoginForm(){
    console.log("showLoginForm was clicked")
    hideDivWithID("registration")
    showDivWithID("login")
}