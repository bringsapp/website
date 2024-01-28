document.addEventListener("DOMContentLoaded", function(){
    document.getElementById("usermessagebutton").addEventListener("click", showMessageBox)
    document.getElementById("closemessagebox").addEventListener("click", hideMessageBox)

    document.getElementById("messageinput").addEventListener("keypress", (e)=>{
        messageTyped(e)
    })

    showLoadingIcon()
    displayLoggedInUserDetails()
    showUser()
    // will show the entires made by a user
    // and this will be shown when a logged in user clicked on a name to visit
    // their profile
    showEntries()
    showMessagesCount()
})

function showPreviousMessages(){
    jwt=getCookie("token=")

    // get username from token
    encodedPayload = jwt.split(".")[1]
    payload=atob(encodedPayload)
    payloadObj=JSON.parse(payload)
    let userTwo = document.getElementById("username").innerHTML

    console.log(payloadObj)
    let getConv = host+"/conversations?to="+payloadObj.Username+"&from="+userTwo+"&token="+jwt
    postData(getConv, {}, {}, "GET").then((data)=>{
        messagesBox = document.getElementById("messageshere")

        if (data){
            for (let i=0; i< data.length; i++){
                msg = document.createElement("div")
                msg.classList.add("convmsg")

                msgSpan = document.createElement("span")
                if (data[i].From.Id == payloadObj.UserID){
                    msg.classList.add("fromusertologgedin")
                    msgSpan.classList.add("convmsgspan")
                } else{
                    msg.classList.add("fromloggedintouser")
                    msgSpan.classList.add("convmsgspantwo")
                }


                    msgSpan.innerHTML = data[i].Body
                    msg.appendChild(msgSpan)
                messagesBox.appendChild(msg)
            }
        } else {
            console.log("something  went wrong getting all the conversations")
        }
    })
}

function messageTyped(e){
     if (e.keyCode == 13){
        body = document.getElementById(e.srcElement.id).value
        to = document.getElementById("hiddenuserid").innerHTML
        sendMessage(body, to, e.srcElement.id)
     }
}

function sendMessage(body, to, msgElementId){
    jwt=getCookie("token=")

    // get username from token
    encodedPayload = jwt.split(".")[1]
    payload=atob(encodedPayload) // prints '{"UserID":2,"exp":1704534268}'
    payloadObj=JSON.parse(payload)

    from = payloadObj.UserID

    postMessage = host+"/messages?token="+jwt

    message = {
        "From" : {
            "Id": from
        },
        "To" :{
            "Id": Number(to)
        },
        "Body" : body
    }

    messagesHere = document.getElementById("messageshere")

    postData(postMessage, message, {}, "POST").then((data)=>{
        if (data){
            document.getElementById(msgElementId).value = ""

            var newMessage = document.createElement("div")
            newMessage.classList.add("newmsg")
            newMessage.innerHTML = body
            messagesHere.appendChild(newMessage)
            newMessage.scrollIntoView()
        } else {
            console.log("something went wront writng the message", data)
        }
    })
}

function showMessageBox(){
    // we also need to delete the previously loaded messages
    document.getElementById("messageshere").innerHTML = ""

    showPreviousMessages()

    hideDivWithID("userentries")
    showDivWithID("messageboxtouser")
}

function hideMessageBox(){
    showDivWithID("userentries")
    hideDivWithID("messageboxtouser")
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

function showEntries(){
    jwt=getCookie("token=")

    hash = window.location.hash
    username = hash.split("=")[1]

    getUserEntries = host+"/users/"+username+"/entries?token="+jwt
    headers = {
        // "Authorization":"Bearer "+jwt
    }

    postData(getUserEntries, {}, headers, "GET").then((data)=>{
        if (data){
            for (var i=0; i< data.length; i++){
                showUserEntry(data[i])
            }
        } else {
            console.log("something went wrong getting user data")
        }
    })
}

function showUserEntry(data){
    var userDetails = document.getElementById("userentries")

        var entriesWrapper = document.createElement("div")
        entriesWrapper.classList.add("userentrieswrapper")
    userDetails.appendChild(entriesWrapper)

            var entryType = document.createElement("span")
            entryType.classList.add("entrytype")
            entryType.innerHTML = data.EntryType
        entriesWrapper.appendChild(entryType)

            var entry = document.createElement("div")
            entry.classList.add("userentry")
            if (data.EntryType =="travel"){
                entry.innerHTML = "I am travelling from <span class=\"bold\">"+
                createDisplayableLocation(data.From)+"</span> to <span class=\"bold\">"+
                createDisplayableLocation(data.To)+".";
            } else if (data.EntryType =="request") {
                entry.innerHTML = "Is anyone travelling from <span class=\"bold\">"+
                createDisplayableLocation(data.From)+"</span> to <span class=\"bold\">"+
                createDisplayableLocation(data.To)+".";
            }
        entriesWrapper.appendChild(entry)

            var entryCreatedOn = document.createElement("div")
            entryCreatedOn.classList.add("entrycreatedon")
            entryCreatedOn.innerHTML = data.CreatedOn
        entriesWrapper.appendChild(entryCreatedOn)
}

function showUser(){
    jwt=getCookie("token=")

    // we have to get the username of the user, that somone clicked on
    // from the entries page
    hash = window.location.hash
    username = hash.split("=")[1]

    getProfileURL = host+"/users/"+username+"/?token="+jwt
    headers = {
        // "Authorization":"Bearer "+jwt
    }
    postData(getProfileURL, {}, headers, "GET").then((data)=>{
        if (data){
                var dpImg = document.getElementById("userimg")
                dpImg.setAttribute("src", data.ProfilePicture)

                var nameDiv = document.getElementById("usersname")
                nameDiv.innerHTML = data.FirstName +" "+ data.LastName

                var usernameDiv = document.getElementById("username")
                usernameDiv.innerHTML = data.Username

                var userid = document.getElementById("hiddenuserid")
                userid.innerHTML = data.Id
                userid.setAttribute("userid", data.Id)

                var phoneVerified = document.getElementById("isphoneverified")
                let verifImg = document.createElement("img")
                console.log("phone verified ", data.PhoneVerified)
                if (data.PhoneVerified == true){
                    verifImg.setAttribute("src", "../images/success.png")
                } else {
                    verifImg.setAttribute("src", "../images/cross.png")
                }
                phoneVerified.appendChild(verifImg)

                document.getElementById("convwuser").innerHTML = data.FirstName +" "+ data.LastName
        } else{
            console.log("something broke while loading the profile", data)
        }
    })
}
