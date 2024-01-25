document.addEventListener("DOMContentLoaded", function(){
    document.getElementById("createacclink").addEventListener("click", showRegistrationForm);
    document.getElementById("loginlink").addEventListener("click", showLoginForm);
    document.getElementById("loginlinkreg").addEventListener("click", showLoginForm);

    document.getElementById("loginbutton").addEventListener("click", function Login() {
        u=document.getElementById("username").value
        p=document.getElementById("password").value

        e = document.getElementById("loginerror")
        if (u.length<5 || p.length<5){
            e.innerText = "Username/Passowrd should at least have 5 chars"
            return
        } else {
            e.innerText = ""
        }

        loginCreds = {
                Username: u,
                Password: p
        }
        headers={}
        postData(host+"/login", loginCreds, headers, "POST").then((data) => {
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
})


function register(){
    e = document.getElementById("registrationerror")

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
        console.log("response data after registration",  data); // JSON data parsed by `data.json()` call
        // ok is response.ok which returns true if response HTTP code is between
        // 200-299 https://developer.mozilla.org/en-US/docs/Web/API/Response/ok
        if (data){
            if (data.Message =="User created successfully"){
                console.log("user created successfully")
                e.innerText = "user created successfully"
            }
        } else {
            e.innerText = "Registration failed."
        }
    });
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