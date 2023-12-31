document.addEventListener("DOMContentLoaded", function(){
    document.getElementById("loginbutton").addEventListener("click", function Login() {
        console.log("Login button clicket")
        loginCreds = {
                Username: "anakata",
                Password: "anakata"
        }
        headers = {
            "Access-Control-Allow-Origin": "*"
        }

        postData("http://167.71.9.162:8080/login", loginCreds, headers).then((data) => {
            console.log("response data ", data); // JSON data parsed by `data.json()` call
        });
    })
})

async function postData(url = "", data = {}, headers = {}) {
    console.log("header that we got ", headers)
    // Default options are marked with *
    try{
        const response = await fetch(url, {
        method: "POST", // *GET, POST, PUT, DELETE, etc.
        mode: "cors", // no-cors, *cors, same-origin
        cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
        credentials: "same-origin", // include, *same-origin, omit
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Origin":"http://localhost:8080"
            // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        redirect: "follow", // manual, *follow, error
        referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
        body: JSON.stringify(data), // body data type must match "Content-Type" header
        });

        console.log("response http status ", response.status, response.statusText)

        if (!response.ok){
            throw new Error("Network response was not ok")
        }


        console.log("response ", response)
        const result = await response.json()
        console.log("result", result)
        return result; // parses JSON response into native JavaScript objects
    }
    catch (error){
        console.log("Error in catch ",error)
    }
  }