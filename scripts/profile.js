document.addEventListener("DOMContentLoaded", function(){
    showLoadingIcon()
    displayLoggedInUserDetails()

    document.getElementById("travelbutton").addEventListener("click", showTravelForm)
    document.getElementById("requestbutton").addEventListener("click", showRequestForm)
    document.getElementById("submittravel").addEventListener("click", createTravel)
    document.getElementById("submitrequest").addEventListener("click", createRequest)

    document.getElementById("verifyphone").addEventListener("click", sendOTPAndVerify)
    document.getElementById("otpverifybuton").addEventListener("click", verifyOTP)

    document.getElementById("closeotpbox").addEventListener("click", hideOTPBox)

    let closes =  document.getElementsByClassName("closeentryforms")
    for (var i=0; i< closes.length; i++){
        closes[i].addEventListener("click", hideEntryForms)
    }


    cs  = document.getElementsByClassName("selectcountry")
    for (var i=0; i< cs.length; i++){
        cs[i].addEventListener("change", (e)=>{
            showStates(e)
        })
    }

    stateElems = document.getElementsByClassName("selectstate")
    for (var i=0; i< stateElems.length; i++){
        stateElems[i].addEventListener("change", (e)=>{
            showCities(e)
        })
    }
    showOwnDetails()
    showEntries()

    showCountries()
    showMessagesCount()
})

function hideOTPBox(){
    hideDivWithID("otpwrapper")
}

function verifyOTP(){
    let otp = document.getElementById("otp").value
    let jwt=getCookie("token=")
    let otpRequest = host+"/contactno/verifyotp?otp="+otp+"&token="+jwt
    let headers = {
        // "Authorization":"Bearer "+jwt
    }

    let msg = document.getElementById("otpverifmsg")
    postData(otpRequest, {}, headers, "POST").then((data)=>{
        if (data){
            msg.innerHTML=""
            msg.classList.add("success")
            msg.innerHTML = "OTP verification was successful"

        } else{
            msg.innerHTML=""
            msg.classList.add("warn")
            msg.innerHTML = "Something went wrong while verifying the OTP."
            console.log("something went wrong verifying the OTP")
        }
    })
}

function sendOTPAndVerify(){
    let jwt=getCookie("token=")
    let otpRequest = host+"/contactno/sendotp?token="+jwt
    let headers = {
        // "Authorization":"Bearer "+jwt
    }

    postData(otpRequest, {}, headers, "POST").then((data)=>{
        if (data){
            console.log("message was sent successfully")
            // show div
            document.getElementById("otpwrapper").style.display = "block"
        } else{
            console.log("something went wrong sending the OTP, try again")
        }
    })
}

function hideEntryForms(){
    hideDivWithID("travelform")
    hideDivWithID("requestform")
    document.getElementById("travelmessage").innerHTML = ""
    document.getElementById("requestmessage").innerHTML = ""
}

function createRequest(){
    // validate data
    fromCountry = document.getElementById("requestfromselectcountryip")
    fromState = document.getElementById("requestselectstateip")
    fromCity = document.getElementById("requestselectcityip")

    fromCountryId = getDatalistOptionsAttr(fromCountry, "countryid", fromCountry.value)
    fromStateId = getDatalistOptionsAttr(fromState, "stateid", fromState.value)
    fromCityId = getDatalistOptionsAttr(fromCity, "cityid", fromCity.value)

    toCountry = document.getElementById("requesttoselectcountryip")
    toState = document.getElementById("requesttoselectstateip")
    toCity = document.getElementById("requesttoselectcityip")

    toCountryId = getDatalistOptionsAttr(toCountry, "countryid", toCountry.value)
    toStateId = getDatalistOptionsAttr(toState, "stateid", toState.value)
    toCityId = getDatalistOptionsAttr(toCity, "cityid", toCity.value)

    requestedDate = document.getElementById("requesteddate").value
    requestWeight = document.getElementById("requestedweight").value

    let msg = document.getElementById("requestmessage")
    if (fromCountry.value =="" || fromCountry.value =="select"
        || toCountry.value ==""  || toCountry.value == "select"
        || requestedDate =="" || requestWeight =="" || requestWeight == "0" ) {
        msg.innerHTML ="From country, to country, date and weight are required fields."
        msg.classList.remove("success")
        msg.classList.add("warn")
        return
    } else {
        msg.innerHTML =""
        msg.classList.remove("warn")
        msg.classList.remove("success")
    }

    let request = {
        "From":{
            "Country": Number(fromCountryId),
            "State": Number(fromStateId),
            "City": Number(fromCityId)
        },
        "To":{
            "Country": Number(toCountryId),
            "State": Number(toStateId),
            "City": Number(toCityId)
        },
        "BeforeDate": requestedDate,
        "Weight": Number(requestWeight)
    }


    let jwt=getCookie("token=")
    let submitRequest = host+"/requests?token="+jwt
    let headers = {
        // "Authorization":"Bearer "+jwt
    }


    postData(submitRequest, request, headers, "POST").then((data)=>{
        if (data){
            msg.innerHTML = ""
            let sp = document.createElement("span")
            sp.classList.add("success")
            sp.innerHTML = "Request entry was made successfully."
            msg.appendChild(sp)
            document.getElementById("requestformid").reset()
        } else {
            msg.innerHTML = ""
            let sp = document.createElement("span")
            sp.classList.add("warn")
            sp.innerHTML = "Something went wrong making the request entry."
            msg.appendChild(sp)
        }
    })
}

function createTravel(){
    // validate data

    fromCountry = document.getElementById("travelfromselectcountryip")
    fromState = document.getElementById("travelselectstateip")
    fromCity = document.getElementById("travelselectcityip")

    fromCountryId = getDatalistOptionsAttr(fromCountry, "countryid", fromCountry.value)
    fromStateId = getDatalistOptionsAttr(fromState, "stateid", fromState.value)
    fromCityId = getDatalistOptionsAttr(fromCity, "cityid", fromCity.value)


    toCountry = document.getElementById("traveltoselectcountryip")
    toState = document.getElementById("traveltoselectstateip")
    toCity = document.getElementById("traveltoselectcityip")

    toCountryId = getDatalistOptionsAttr(toCountry, "countryid", toCountry.value)
    toStateId = getDatalistOptionsAttr(toState, "stateid", toState.value)
    toCityId = getDatalistOptionsAttr(toCity, "cityid", toCity.value)


    dateRangeStart = document.getElementById("traveldaterangestart").value
    dateRangeEnd = document.getElementById("traveldaterangeend").value

    weight = document.getElementById("travelitemweight").value

    let msg = document.getElementById("travelmessage")
    if (fromCountry.value =="" || fromCountry.value =="select"
        || toCountry.value ==""  || toCountry.value == "select"
        || dateRangeStart =="" || dateRangeEnd=="" || weight =="" || weight == "0" ) {
        msg.innerHTML ="From country, to country, dates and weight are required fields."
        msg.classList.remove("success")
        msg.classList.add("warn")
        return
    } else {
        msg.innerHTML =""
        msg.classList.remove("warn")
        msg.classList.remove("success")
    }

    travel = {
        "From":{
            "Country": Number(fromCountryId),
            "State":  Number(fromStateId),
            "City": Number(fromCityId)
        },
        "To":{
            "Country": Number(toCountryId),
            "State": Number(toStateId),
            "City": Number(toCityId)
        },
        "TravelDateRangeStart": dateRangeStart,
        "TravelDateRangeEnd": dateRangeEnd,
        "Weight": Number(weight)
    }

    console.log("creating travel with ", travel)

    travelEntry = host+"/travels?token="+jwt
    postData(travelEntry, travel, headers, "POST").then((data)=>{
        if (data){
            msg.innerHTML = ""
            let sp = document.createElement("span")
            sp.classList.add("success")
            sp.innerHTML = "Travel entry was made successfully."
            msg.appendChild(sp)
            // reset form
            document.getElementById("travelformid").reset()
        } else {
            msg.innerHTML = ""
            let sp = document.createElement("span")
            sp.classList.add("warn")
            sp.innerHTML = "Something went wrong making the travel entry."
            msg.appendChild(sp)
        }
    })


    console.log(fromCountryId, fromStateId, fromCityId)
}

function showCities(e){
    elem = document.getElementById(e.srcElement.id)
    targetCitiesElem = document.getElementById(elem.getAttribute("citiesElemId"))

    stateValue = elem.value
    // if (countryValue == "select"){
    //     console.log("country is not selected")
    //     return
    // }
    stateID = getDatalistOptionsAttr(elem, "stateid", stateValue)
    countryID =  getDatalistOptionsAttr(elem, "countryid", stateValue)

    jwt=getCookie("token=")
    // get username from token
    encodedPayload = jwt.split(".")[1]
    payload=atob(encodedPayload)
    payloadObj=JSON.parse(payload)

    getUserDetails = host+"/countries/"+countryID+"/states/"+stateID+"/cities?token="+jwt
    headers = {
        // "Authorization":"Bearer "+jwt
    }

    postData(getUserDetails, {}, headers, "GET").then((data)=>{
        if (data) {
            for (var i=0; i< data.length; i++){
                o = document.createElement("option")
                o.innerHTML = data[i].Name
                o.setAttribute("value", data[i].Name)
                o.setAttribute("cityid", data[i].Id)
                targetCitiesElem.appendChild(o)
            }
        } else {
            console.log("something went wrong getting cities for state ",data)
        }
    })
}

function showStates(e){
    console.log(e)
    elem = document.getElementById(e.srcElement.id)
    targetStateElem = document.getElementById(elem.getAttribute("statesElemId"))

    countryName = elem.value
    console.log("elem ", elem)
    countryID = getDatalistOptionsAttr(elem, "countryid", countryName)

    // if (countryValue == "select"){
    //     console.log("country is not selected")
    //     return
    // }

    jwt=getCookie("token=")
    // get username from token
    encodedPayload = jwt.split(".")[1]
    payload=atob(encodedPayload)
    payloadObj=JSON.parse(payload)

    getUserDetails = host+"/countries/"+countryID+"/states?token="+jwt
    headers = {
        // "Authorization":"Bearer "+jwt
    }

    postData(getUserDetails, {}, headers, "GET").then((data)=>{
        if (data){
            targetStateElem.length = 1

            for (var i=0; i<data.length; i++){
                o = document.createElement("option")
                o.innerHTML = data[i].Name +" ("+data[i].ISO2Code+")"
                o.setAttribute("value", data[i].Name +" ("+data[i].ISO2Code+")")
                o.setAttribute("stateid", data[i].Id)
                o.setAttribute("countryid", countryID)

                targetStateElem.appendChild(o)
            }
        } else {
            console.log("something went wrong fetching all the countries", data)
        }
    })
}

function getDatalistOptionsAttr(elem, attrName, countryName){
    parent = elem.parentNode
    siblings = parent.children
    for (var i=0; i< siblings.length; i++){
        // nodeName:  "DATALIST"
        if (siblings[i].nodeName == "DATALIST"){
            datalist = siblings[i]
            for (var i=0; i < datalist.options.length; i++){
                if (datalist.options[i].value == countryName){
                    return datalist.options[i].getAttribute(attrName)
                }
            }
        }
    }
}

// how countries displays the countries in the
// travel and rqeust forms
function showCountries(){
    jwt=getCookie("token=")

    // get username from token
    encodedPayload = jwt.split(".")[1]
    payload=atob(encodedPayload)
    payloadObj=JSON.parse(payload)

    getUserDetails = host+"/countries?token="+jwt
    headers = {
        // "Authorization":"Bearer "+jwt
    }

    postData(getUserDetails, {}, headers, "GET").then((data)=>{
        if (data){
            // display countries in the from and to options of travel and request forms
            for (var i=0; i< data.length; i++){
                var travelFrom = document.getElementById("travelfromselectcountry")
                var travelTo = document.getElementById("traveltoselectcountry")
                var requestFrom = document.getElementById("requestfromselectcountry")
                var requestTo = document.getElementById("requesttoselectcountry")



                anOption = document.createElement("option")
                anOption.innerHTML = data[i].Name+" ("+data[i].ISO2Code+")"
                anOption.setAttribute("value", data[i].Name+" ("+data[i].ISO2Code+")")
                anOption.setAttribute("countryid", data[i].Id)

                anOption2 = document.createElement("option")
                anOption2.innerHTML = data[i].Name+" ("+data[i].ISO2Code+")"
                anOption2.setAttribute("value", data[i].Name+" ("+data[i].ISO2Code+")")
                anOption2.setAttribute("countryid", data[i].Id)

                anOption3 = document.createElement("option")
                anOption3.innerHTML = data[i].Name+" ("+data[i].ISO2Code+")"
                anOption3.setAttribute("value", data[i].Name+" ("+data[i].ISO2Code+")")
                anOption3.setAttribute("countryid", data[i].Id)

                anOption4 = document.createElement("option")
                anOption4.innerHTML = data[i].Name+" ("+data[i].ISO2Code+")"
                anOption4.setAttribute("value", data[i].Name+" ("+data[i].ISO2Code+")")
                anOption4.setAttribute("countryid", data[i].Id)

                // console.log(travelFrom, travelTo, requestFrom, requestTo, anOption)

                travelFrom.appendChild(anOption)
                travelTo.appendChild(anOption2)
                requestFrom.appendChild(anOption3)
                requestTo.appendChild(anOption4)
            }

        } else {
            console.log("something went wrong fetching the countries data")
        }
    })
}

function showTravelForm(){
    showDivWithID("travelform")
    hideDivWithID("requestform")
}

function showRequestForm(){
    showDivWithID("requestform")
    hideDivWithID("travelform")
}

// showOwnDetails just make sure verify phone is proper, that would mean
// show the button only if the user's phone is not verified
function showOwnDetails(){
    let jwt =  getCookie("token=")

    // get username from token
    encodedPayload = jwt.split(".")[1]
    payload=atob(encodedPayload)
    payloadObj=JSON.parse(payload)

    getUserDetails = host+"/users/"+payloadObj.Username+"/?token="+jwt
    headers = {
        // "Authorization":"Bearer "+jwt
    }

    postData(getUserDetails, {}, headers, "GET").then((data)=>{
        if (data){
            if (data.PhoneVerified){
                let metaElem = document.getElementById("loggedinusermeta")
                metaElem.innerHTML = ""
                let verifiedElem = document.createElement("span")
                verifiedElem.innerHTML = "Phone is verified"
                metaElem.appendChild(verifiedElem)
            }
        } else {
            console.log("something broke while loading the profile", data)
        }
    })
}

function showEntries(){
    jwt=getCookie("token=")

    // get username from token
    encodedPayload = jwt.split(".")[1]
    payload=atob(encodedPayload)
    payloadObj=JSON.parse(payload)

    getUserEntries = host+"/users/"+payloadObj.Username+"/entries?token="+jwt
    headers = {
        // "Authorization":"Bearer "+jwt
    }

    postData(getUserEntries, {}, headers, "GET").then((data)=>{
        hideLoadingIcon()
        let msgInfo = document.getElementById("entriesinfo")
        if (data){
            msgInfo.innerHTML = ""
            for (var i=0; i< data.length; i++){
                showUserEntry(data[i])
            }
        } else {
            msgInfo.innerHTML = "Something went wrong fetching your entries. Please try again."
        }
    })
}

function showUserEntry(data){
    var entries = document.getElementById("entries")

        var entriesWrapper = document.createElement("div")
        entriesWrapper.classList.add("userentrieswrapper")
    entries.appendChild(entriesWrapper)

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
            entryCreatedOn.innerHTML = "Created on: "+data.CreatedOn
        entriesWrapper.appendChild(entryCreatedOn)
}
