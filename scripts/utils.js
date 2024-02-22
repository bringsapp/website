host = "https://api.bringsapp.com"
// host = "http://127.0.0.1:8080"

document.addEventListener("DOMContentLoaded", function(){
    let logoutButton = document.getElementById("logout")
    if (logoutButton) {
        logoutButton.addEventListener("click", logout)
    }

    let logoElem = document.getElementById("logo")
    if (logoElem){
        logoElem.addEventListener("click", handleLogoClick)
    }


    let landingLogoElem = document.getElementById("landinglogo")
    if (landingLogoElem){
        landingLogoElem.addEventListener("click", handleLandingLogoClick)
    }
    // animateLocations()
})

function handleLandingLogoClick(){
    window.location = "/"
}

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
    let logout = host+"/logout"

    postData(logout, {}, authorizationHeader(), "GET").then((data)=>{
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
    let validateToken = host+"/token/validate"

    postData(validateToken, {}, authorizationHeader(), "GET").then((data)=>{
        if (data){
            window.location = "/entries"
        } else {
            window.location = "/"
            // TODO: remove the cookie
        }
    })
}

function showLoadingIcon(elemID = ""){
    if (elemID == ""){
        document.getElementById("circleG").style.display = "block";
    } else {
        document.getElementById(elemID).style.display = "block";
    }
}

function hideLoadingIcon(elemID = ""){
    if (elemID == ""){
        document.getElementById("circleG").style.display = "none"
    } else {
        document.getElementById(elemID).style.display = "none"
    }
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

    getUserDetails = host+"/users/"+payloadObj.Username
    return postData(getUserDetails, {}, authorizationHeader(), "GET").then((data)=>{
        if (data){
            imgElem = document.getElementById("loggedinuserimg")
            imgElem.setAttribute("alt", "Logged in user's profile picture")
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

// showMessagesCount shows unread messages count in the profile
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
    let getMessagesCount = host+"/messages/count?to="+payloadObj.Username

    return postData(getMessagesCount, {}, authorizationHeader(), "GET").then((data)=>{
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

function todaysJustDate(){
    let today = new Date()
    let currentDate = (today.getDate() < 10) ? '0'.concat(today.getDate()) : today.getDate()
    let currentMonth = (today.getMonth()+1 < 10) ?  '0'.concat(1+today.getMonth()) : today.getMonth()
    let currentYear = today.getFullYear()
    return new Date(currentYear+"-"+currentMonth+"-"+currentDate)
}

function authorizationHeader(){
    let jwt=getCookie("token=")

    if (jwt == null){
        window.location ="/logout"
    }

    return {
        "Authorization":"Bearer "+jwt
    }
}

function userNameAnchorInEntries(username){
    let jwt=getCookie("token=")

    if (jwt == null){
        window.location ="/logout"
    }

    // get username from token
    let encodedPayload = jwt.split(".")[1]
    let payload = atob(encodedPayload) // prints '{"UserID":2,"exp":1704534268}'
    let payloadObj = JSON.parse(payload)

    if (username == payloadObj.Username){
        // click on name of logged in user
        return "../profile"
    }

    return "../users#username="+username
}

function emptyDataList(dataList){
    // set datalist's respective input field to empty
    dataList.parentNode.children[0].value=""

    dataList.innerHTML = ""
}
