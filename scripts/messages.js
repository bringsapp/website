document.addEventListener("DOMContentLoaded", function(){
    showLoadingIcon()
    displayLoggedInUserDetails().then((data)=>{
        initMessagesAndCount(data.PhoneVerified)
    })

    document.getElementById("notifsubs").addEventListener("click", subscribeForNotifs)
    showMessagesCount()
})

function initMessagesAndCount(isUsersPhoneVerified){
    // get username from token
    let encodedPayload = jwt.split(".")[1]
    let payload=atob(encodedPayload)
    let payloadObj=JSON.parse(payload)

    let getMessagesCount = host+"/messages/count?to="+payloadObj.Username
    postData(getMessagesCount, {}, authorizationHeader(), "GET").then((data)=>{
        hideLoadingIcon()
        console.log("data that we got for messages and count ", data)
        if (data){
            let msgsOfUserElem = document.getElementById("messageswrapper")
            if (data.length == 0){
                document.getElementById("nomsgs").innerHTML = "No messages found."
            } else {
                document.getElementById("nomsgs").innerHTML = ""
            }

            for (let i=0; i< data.length; i++){
                let messanger = document.createElement("div")
                messanger.classList.add("conversationwrapper")
                    let namewrapper = document.createElement("div")
                    // namewrapper.addEventListener("click", showConversation)
                    namewrapper.classList.add("convnamewrapper")
                        let nameAndCount = document.createElement("div")
                        nameAndCount.classList.add("messagenameandcount")
                            let nameAndCountA = document.createElement("a")
                            nameAndCountA.setAttribute("href", "../users#username="+data[i].From.Username)
                            if (data[i].NoOfUnreadMsgs>0){
                                nameAndCountA.innerHTML = data[i].From.FirstName +" "+ data[i].From.LastName +" ("+data[i].NoOfUnreadMsgs+")"
                            } else {
                                nameAndCountA.innerHTML = data[i].From.FirstName +" "+ data[i].From.LastName
                            }
                            nameAndCount.appendChild(nameAndCountA)
                        namewrapper.appendChild(nameAndCount)

                        let showConv = document.createElement("div")
                        showConv.classList.add("msgusername")
                        showConv.innerHTML = data[i].From.Username
                        namewrapper.appendChild(showConv)

                        let showConversationIcon = document.createElement("div")
                        showConversationIcon.classList.add("showconversation")
                            let showConvImg = document.createElement("img")
                            showConvImg.setAttribute("src", "../images/right-arrow.png")
                            showConvImg.classList.add("showconv")
                            showConvImg.setAttribute("id", data[i].From.Username)
                            showConvImg.addEventListener("click", showConversation)
                            showConversationIcon.appendChild(showConvImg)
                        namewrapper.appendChild(showConversationIcon)


                    messanger.appendChild(namewrapper)

                    let convs = document.createElement("div")
                    convs.classList.add("conv")
                    convs.setAttribute("id", "conv-"+data[i].From.Username)
                    messanger.appendChild(convs)

                    let postMessageSection = document.createElement("div")
                    postMessageSection.classList.add("postmessage")
                    postMessageSection.setAttribute("id", "postmessage-"+data[i].From.Username)
                            let msgInfo = document.createElement("div")
                            msgInfo.classList.add("text-cen")
                            msgInfo.classList.add("fontsmall")

                        let msgBox = document.createElement("textarea")
                        msgBox.classList.add("usermsgbox")
                        msgBox.setAttribute("id", "msgbox-"+data[i].From.Username)
                        msgBox.setAttribute("userid", data[i].From.Id)
                        msgBox.setAttribute("username", data[i].From.Username)
                        msgBox.setAttribute("placeholder", "Hit enter to send.")
                        msgBox.addEventListener("keypress", function(e){
                            msgBoxKeyPress(e, isUsersPhoneVerified, msgInfo)
                        })
                        postMessageSection.appendChild(msgBox)
                        postMessageSection.appendChild(msgInfo)

                    messanger.appendChild(postMessageSection)

                msgsOfUserElem.appendChild(messanger)
            }
        } else {
            console.log("soemthing went wrong gettting messages count")
        }
    })
}

function showConversation(e){
    let senderUsername = e.srcElement.parentNode.parentNode.children[1].innerHTML
    let clickedId = e.srcElement.getAttribute("id")
    // hide all the conversation boxes and just show the clicked one
    let conversationsBox = document.getElementsByClassName("conv")
    for (let i=0; i< conversationsBox.length; i++){
        let id = conversationsBox[i].getAttribute("id")
        if ( id != "conv-"+clickedId){
            conversationsBox[i].style.display = "none"
        }
    }
    let convBox = document.getElementById("conv-"+senderUsername)
    if (convBox.style.display == "block"){
        convBox.style.display ="none"
    } else if (convBox.style.display == "none"){
        convBox.style.display ="block"
    } else {
        convBox.style.display ="block"
    }
    convBox.innerHTML = ""

    // hide all the post message text areas and just how the clicked one
    let allMsgBoxes = document.getElementsByClassName("usermsgbox")
    for (let i=0; i< allMsgBoxes.length; i++){
        let id = allMsgBoxes[i].getAttribute("id")
        if (id != "msgbox-"+clickedId){
            allMsgBoxes[i].style.display = "none"
        }
    }
    let msgBox = document.getElementById("msgbox-"+senderUsername)
    if (msgBox.style.display == "block"){
        msgBox.style.display ="none"
    } else if (msgBox.style.display == "none"){
        msgBox.style.display ="block"
    } else {
        msgBox.style.display ="block"
    }

    jwt=getCookie("token=")

    // get username from token
    encodedPayload = jwt.split(".")[1]
    payload=atob(encodedPayload)
    payloadObj=JSON.parse(payload)

    let getConv = host+"/conversations?to="+payloadObj.Username+"&from="+senderUsername
    postData(getConv, {}, authorizationHeader(), "GET").then((data)=>{
        messagesBox = document.getElementById("conv-"+senderUsername)

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
    // TODO: scroll to the bottom if there are two many messages, there is no point staying at the top
    // mark all the message from this user (senderUsername) to logged in user read
    readAllMessage(payloadObj.Username, senderUsername)
}

function readAllMessage(to, from){
    let readMessages = host+"/messages/readall?to="+to+"&from="+from
    postData(readMessages, {}, authorizationHeader(), "POST").then((data)=>{
        if (data){
            console.log(data)
        } else {
            console.log("Something went wrong reading data from ", from , " to ", to)
        }
    })
}

function msgBoxKeyPress(e, isUsersPhoneVerified, info){
    if (e.keyCode == 13){
        console.log(e)
        body = document.getElementById(e.srcElement.id).value
        to = e.srcElement.getAttribute("userid")
        toUsername = e.srcElement.getAttribute("username")
        if (!isUsersPhoneVerified){
            info.innerHTML = "Your contact number doesn't seem to be verified. Please <a class=\"ainspan\" href=\"../profile\">verify</a> it to be able to send messages."
            info.classList.add("warn")
            return
        } else{
            info.classList.remove("warn")
            info.innerHTML = ""
        }

        if (body.trim() != ""){
            sendMessage(body, to, e.srcElement.id, toUsername, info)
        } else {
            e.srcElement.value =""
        }
    }
}


function sendMessage(body, to, msgElementId, toUsername, info){
    jwt=getCookie("token=")

    // get username from token
    encodedPayload = jwt.split(".")[1]
    payload=atob(encodedPayload) // prints '{"UserID":2,"exp":1704534268}'
    payloadObj=JSON.parse(payload)

    from = payloadObj.UserID

    postMessage = host+"/messages"

    message = {
        "From" : {
            "Id": from
        },
        "To" :{
            "Id": Number(to)
        },
        "Body" : body
    }

    messagesHere = document.getElementById("conv-"+toUsername)

    postData(postMessage, message, authorizationHeader(), "POST").then((data)=>{
        if (data){
            info.innerHTML = ""
            info.classList.remove("warn")
            document.getElementById(msgElementId).value = ""

            var newMessage = document.createElement("div")
            newMessage.classList.add("newmsg")
            newMessage.innerHTML = body
            messagesHere.appendChild(newMessage)
            newMessage.scrollIntoView()
        } else {
            info.classList.add("warn")
            info.innerHTML = "Something went wrong, sending the message."
        }
    })
}

function subscribeForNotifs(){
    let jwt=getCookie("token=")
    let encodedPayload = jwt.split(".")[1]
    let payload=atob(encodedPayload)
    let payloadObj=JSON.parse(payload)
    let from = payloadObj.UserID

    let vapidPublicKey =
      'BOZ5ZT9HIZPM9r_fFh5DIiv5uNQ80i10m1kMcxTVEB522WujTj6q6x9JNIjPUj5i5DlTJssaX5K7f8XOiM13-nQ';

    let notifStatus = document.getElementById("subsstatus")
    if ('serviceWorker' in navigator ){
        navigator.serviceWorker.register('sw.js').then(function (registration){
            return registration.pushManager.getSubscription().then(function (subscription){
                if (subscription){
                    // already subscribed
                    notifStatus.innerHTML = "You are already subscribed for notifications."
                    setTimeout(() => {
                        notifStatus.innerHTML=""
                    }, 4000);
                    return
                }

                // not subscribed
                return registration.pushManager.subscribe({
                    userVisibleOnly: true,
                    applicationServerKey: urlBase64ToUint8Array(vapidPublicKey)
                }).then(function (subscription){
                    let rawKey = subscription.getKey ? subscription.getKey('p256dh'):'';
                    key = rawKey ? btoa(String.fromCharCode.apply(null, new Uint8Array(rawKey))): '';
                    let rawAuthSecret = subscription.getKey ? subscription.getKey('auth'):'';
                    authSecret = rawAuthSecret ? btoa(String.fromCharCode.apply(null, new Uint8Array(rawAuthSecret))):'';
                    endpoint = subscription.endpoint

                    let headers =  new Headers({
                            'content-type': 'application/json',
                            'Authorization' : 'Bearer '+jwt
                            })
                    let subData = {
                        endpoint: endpoint,
                        key: key,
                        authSecret: authSecret,
                    }
                    postData(host+'/notifs/register?userid='+from, subData, headers,"POST").then((data)=>{
                        if (data){
                            notifStatus.innerHTML = "You are now subscribed for new messages notifications."
                            setTimeout(() => {
                                notifStatus.innerHTML = ""
                            }, 4000);
                        } else {
                            notifStatus.innerHTML = "Somthing went wrong. Please try again."
                            setTimeout(() => {
                                notifStatus.innerHTML = ""
                            }, 4000);
                        }
                    })
                })

            })
        }).catch(function (err){
            console.log("service worker registration failed ", err)
        })
    }
}

function urlBase64ToUint8Array(pubKey){
    const padding = '='.repeat((4 - pubKey.length % 4) % 4);
    const base64 = (pubKey + padding)
      .replace(/\-/g, '+')
      .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}
