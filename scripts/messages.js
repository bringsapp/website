document.addEventListener("DOMContentLoaded", function(){
    let jwt=getCookie("token=")
    // get username from token
    let encodedPayload = jwt.split(".")[1]
    let payload=atob(encodedPayload)
    let payloadObj=JSON.parse(payload)

    let getMessagesCount = host+"/messages/count?to="+payloadObj.Username+"&token="+jwt
    let headers = {
        // "Authorization":"Bearer "+jwt
    }

    postData(getMessagesCount, {}, headers, "GET").then((data)=>{
        if (data){
            console.log("got inread message ", data)
            let msgsOfUserElem = document.getElementById("messageswrapper")
            for (let i=0; i< data.length; i++){
                let messanger = document.createElement("div")
                messanger.classList.add("conversationwrapper")
                    let namewrapper = document.createElement("div")
                    namewrapper.addEventListener("click", showConversation)
                    namewrapper.classList.add("convnamewrapper")
                        let nameAndCount = document.createElement("div")
                        nameAndCount.classList.add("messagenameandcount")
                        nameAndCount.innerHTML = data[i].From.FirstName +" "+ data[i].From.LastName +" ("+data[i].NoOfUnreadMsgs+")"
                        namewrapper.appendChild(nameAndCount)

                        let showConv = document.createElement("div")
                        showConv.classList.add("showconv")
                        showConv.innerHTML = data[i].From.Username
                        namewrapper.appendChild(showConv)
                    messanger.appendChild(namewrapper)

                    let convs = document.createElement("div")
                    convs.classList.add("conv")
                    convs.setAttribute("id", "conv-"+data[i].From.Username)
                    messanger.appendChild(convs)

                    let postMessageSection = document.createElement("div")
                    postMessageSection.classList.add("postmessage")
                    postMessageSection.setAttribute("id", "postmessage-"+data[i].From.Username)
                        let msgBox = document.createElement("textarea")
                        msgBox.classList.add("usermsgbox")
                        msgBox.setAttribute("id", "msgbox-"+data[i].From.Username)
                        msgBox.setAttribute("userid", data[i].From.Id)
                        msgBox.setAttribute("username", data[i].From.Username)
                        msgBox.setAttribute("placeholder", "Hit ente to send.")
                        msgBox.addEventListener("keypress", msgBoxKeyPress)
                        postMessageSection.appendChild(msgBox)
                    messanger.appendChild(postMessageSection)

                msgsOfUserElem.appendChild(messanger)
            }
        } else {
            console.log("soemthing went wrong gettting messages count")
        }
    })
})

function showConversation(e){
    let senderUsername = e.srcElement.parentNode.children[1].innerHTML

    // hide all the conversation boxes and just show the clicked one
    let conversationsBox = document.getElementsByClassName("conv")
    for (let i=0; i< conversationsBox.length; i++){
        conversationsBox[i].style.display = "none"
    }
    let convBox = document.getElementById("conv-"+senderUsername)
    convBox.style.display ="block"
    convBox.innerHTML = ""

    // hide all the post message text areas and just how the clicked one
    let allMsgBoxes = document.getElementsByClassName("usermsgbox")
    for (let i=0; i< allMsgBoxes.length; i++){
        allMsgBoxes[i].style.display = "none"
    }
    let msgBox = document.getElementById("msgbox-"+senderUsername)
    msgBox.style.display = "block"

    jwt=getCookie("token=")

    // get username from token
    encodedPayload = jwt.split(".")[1]
    payload=atob(encodedPayload)
    payloadObj=JSON.parse(payload)

    console.log(payloadObj)
    let getConv = host+"/conversations?to="+payloadObj.Username+"&from="+senderUsername+"&token="+jwt
    postData(getConv, {}, {}, "GET").then((data)=>{
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
}

function msgBoxKeyPress(e){
    if (e.keyCode == 13){
       body = document.getElementById(e.srcElement.id).value
       to = e.srcElement.getAttribute("userid")
       toUsername = e.srcElement.getAttribute("username")
       sendMessage(body, to, e.srcElement.id, toUsername)
    }
}


function sendMessage(body, to, msgElementId, toUsername){
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

    messagesHere = document.getElementById("conv-"+toUsername)

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