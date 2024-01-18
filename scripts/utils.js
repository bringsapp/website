// host = "https://api.bringsapp.com"
host = "http://localhost:8080"

document.addEventListener("DOMContentLoaded", function(){
    let logoutButton = document.getElementById("logout")
    if (logoutButton) {
        logoutButton.addEventListener("click", logout)
    }

})

function logout(){
    // get the new token that expires immediately
    // set that in cookie
    // redirect to logout.html

}

function showDivWithID(id){
    document.getElementById(id).style.display = "block";
}

function hideDivWithID(id){
    document.getElementById(id).style.display = "none";
}

function createCookie(name, value, days) {
    console.log("createCookie was called with name and value ", name, value)
    var expires;
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toGMTString();
    }
    else {
        expires = "";
    }
    c = name + "=" + value + "; SameSite=None; Secure";
    document.cookie = c
}

// should be called as getCookie("token=")
function getCookie(name) {
    return document.cookie
    .split("; ")
    .find((row) => row.startsWith(name))
    ?.split("=")[1];
}

document.addEventListener("DOMContentLoaded", function(){
    document.getElementById("logo").addEventListener("click", handleLogoClick)
})

// buggy
// even if token is invalid, it would be set in the cookie
function handleLogoClick(){
    let jwt=getCookie("token=")
    let validateToken = host+"/token/validate?token="+jwt

    postData(validateToken, {}, {}, "GET").then((data)=>{
        if (data){
            window.location = "/entries"
        } else {
            window.location = "/"
            // TODO: remove the cookie
        }
    })
}

function showLoadingIcon(){
}


// is going to show details of the logged in user
// and links for them to go to their profile and
// link to see messages
function displayLoggedInUserDetails(){
    jwt=getCookie("token=")

    // get username from token
    encodedPayload = jwt.split(".")[1]
    payload=atob(encodedPayload) // prints '{"UserID":2,"exp":1704534268}'
    payloadObj=JSON.parse(payload)

    getUserDetails = host+"/users/"+payloadObj.Username+"/?token="+jwt
    headers = {
        // "Authorization":"Bearer "+jwt
    }
    postData(getUserDetails, {}, headers, "GET").then((data)=>{
        if (data){
            imgElem = document.getElementById("loggedinuserimg")
            imgElem.setAttribute("src", data.ProfilePicture)

            nameElem = document.getElementById("loggedinusername")
            nameElem.innerHTML = data.FirstName+" "+ data.LastName
            nameElem.setAttribute("href", "../profile")
        } else {
            console.log("something broke while getting details of a user", data)
        }
    })
}
