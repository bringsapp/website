host = "http://localhost:8080"

document.addEventListener("DOMContentLoaded", function(){
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
            console.log("response data ", data); // JSON data parsed by `data.json()` call
            if (data.Token !=""){
                window.location = "entries"
            }
        });
    })
})

