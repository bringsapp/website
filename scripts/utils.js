// host = "https://api.bringsapp.com"
host = "http://127.0.0.1:8080"

document.addEventListener("DOMContentLoaded", function(){
    let logoutButton = document.getElementById("logout")
    if (logoutButton) {
        logoutButton.addEventListener("click", logout)
    }

    document.getElementById("logo").addEventListener("click", handleLogoClick)
    // animateLocations()
})


function animateLocations(){
    let sources = ["The Hague", "New Delhi"]
    let targets = ["Mumbai",  "Berlin"]
    let r = Math.floor(Math.random() * 2)

    let source = document.getElementById("source")
    let target = document.getElementById("target")
    if (source && target){
        source.innerHTML = sources[r]
        target.innerHTML = targets[r]
        setTimeout(() => {
        animateLocations()
        }, "3000");
    }
}

function logout(){
    // get the new token that expires immediately
    let jwt=getCookie("token=")
    let logout = host+"/logout?token="+jwt

    postData(logout, {}, {}, "GET").then((data)=>{
        if (data){
            eraseCookie()
            window.location = "/logout"
        } else {
            window.location = "/"
            // TODO: remove the cookie
        }
    })
}

function showDivWithID(id){
    document.getElementById(id).style.display = "block";
}

function hideDivWithID(id){
    document.getElementById(id).style.display = "none";
}

function eraseCookie() {
    // let t = getCookie("token")
    // const event = new Date('14 Jun 2017 00:00:00 PDT');
    // let expires = event.toUTCString()
    // c = name + "="+t+";"+ expires+"; SameSite=None; Secure";
    // console.log("expires cookie ", c)
    // document.cookie = c
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
}

function createCookie(name, value, expiration) {
    var expires;
    if (expiration) {
        var date = new Date();
        date.setTime(date.getTime() + (expiration * 24 * 60 * 60 * 1000));
        expires = " expires=" + date.toGMTString();
    }
    else {
        expires = "";
    }
    c = name + "=" + value + ";"+ expires+"; SameSite=None; Secure";
    console.log("setting cookie ", c)
    document.cookie = c
}

// should be called as getCookie("token=")
function getCookie(name) {
    return document.cookie
    .split("; ")
    .find((row) => row.startsWith(name))
    ?.split("=")[1];
}

// buggy
// even if token is invalid, it would be set in the cookie
function handleLogoClick(){
    let jwt=getCookie("token=")
    console.log("token is ", jwt)
    if (jwt == null){
        window.location = "/"
        return
    }

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

    if (jwt == null){
        window.location ="/logout"
    }

    // get username from token
    encodedPayload = jwt.split(".")[1]
    payload=atob(encodedPayload) // prints '{"UserID":2,"exp":1704534268}'
    payloadObj=JSON.parse(payload)

    getUserDetails = host+"/users/"+payloadObj.Username+"/?token="+jwt
    headers = {
        // "Authorization":"Bearer "+jwt
    }
    return postData(getUserDetails, {}, headers, "GET").then((data)=>{
        if (data){
            imgElem = document.getElementById("loggedinuserimg")
            imgElem.setAttribute("src", data.ProfilePicture)

            nameElem = document.getElementById("loggedinusername")
            nameElem.innerHTML = data.FirstName+" "+ data.LastName
            nameElem.setAttribute("href", "../profile")
            return data
        } else {
            console.log("something broke while getting details of a user", data)
        }
    })
}

function showMessagesCount(){
    jwt=getCookie("token=")

    // get username from token
    encodedPayload = jwt.split(".")[1]
    payload=atob(encodedPayload) // prints '{"UserID":2,"exp":1704534268}'
    payloadObj=JSON.parse(payload)

    getUnreadMessagesCountTo(payloadObj.Username).then((data)=>{
        if (data.length > 0){
            let unreadMsgsCount = 0
            for (let i = 0; i< data.length; i++){
                unreadMsgsCount+= data[i].NoOfUnreadMsgs
            }
            if (unreadMsgsCount>0){
                let countElem = document.getElementById("msgcount")
                countElem.innerHTML  = unreadMsgsCount
                countElem.style.padding = "5px"
            }
        }
    })
}

function getUnreadMessagesCountTo(to = ""){
    let getMessagesCount = host+"/messages/count?to="+payloadObj.Username+"&token="+jwt
    let headers = {
        // "Authorization":"Bearer "+jwt
    }

    return postData(getMessagesCount, {}, headers, "GET").then((data)=>{
        if (data){
            return data
        } else {
            console.log("something went wrong getting all the unread messages")
        }

    })
}

// backend might return country/unselected/unselected or country/state/unselected or country/state/city
// we have to remove unnecessary `unselected` and `/` in every case.
function createDisplayableLocation(location){
    // data.From.Country+"/"+data.From.State+"/"+data.From.City
    let loc = location.Country
    if (location.State !="unselected"){
        loc +="/"+location.State
    }

    if (location.City!="unselected"){
        loc += "/"+location.City
    }

    return loc
}

