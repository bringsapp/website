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
    let otpRequest = host+"/contactno/verifyotp?otp="+otp

    let msg = document.getElementById("otpverifmsg")
    postData(otpRequest, {}, authorizationHeader(), "POST").then((data)=>{
        if (data){
            msg.innerHTML=""
            msg.classList.add("success")
            msg.innerHTML = "OTP verification was successful"

        } else{
            msg.innerHTML=""
            msg.classList.add("warn")
            msg.innerHTML = "Something went wrong while verifying the OTP."
        }
    })
}

function sendOTPAndVerify(){
    let otpRequest = host+"/contactno/sendotp"

    postData(otpRequest, {}, authorizationHeader(), "POST").then((data)=>{
        if (data){
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

    let rDate = new Date(requestedDate)
    let todaysDate = todaysJustDate()

    let msg = document.getElementById("requestmessage")
    if (fromCountry.value =="" || fromCountry.value =="select"
        || toCountry.value ==""  || toCountry.value == "select"
        || requestedDate =="" || requestWeight =="" || requestWeight == "0" ) {

        msg.innerHTML = ""
        msg.innerHTML ="From country, to country, date and weight are required fields."
        msg.classList.remove("success")
        msg.classList.add("warn")
        return
    } else if (rDate < todaysDate){
        msg.innerHTML = ""
        msg.innerHTML ="Date can not be in the past."
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


    let submitRequest = host+"/requests"

    postData(submitRequest, request, authorizationHeader(), "POST").then((data)=>{
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
    // handle cases where random inputs are added manually and not selected via datalist
    if (fromCountryId === undefined || fromStateId === undefined || fromCityId === undefined || toCountryId === undefined || toStateId === undefined || toCityId === undefined){
        msg.innerHTML = ""
        msg.innerHTML ="Please input data correctly. Select inputs from drop down if available."
        msg.classList.remove("success")
        msg.classList.add("warn")
        return
    }

    let todaysDate = todaysJustDate()
    let dRangeStart = new Date(dateRangeStart)
    let dRangeEnd =  new Date(dateRangeEnd)

    if (fromCountry.value =="" || fromCountry.value =="select"
        || toCountry.value ==""  || toCountry.value == "select"
        || dateRangeStart =="" || dateRangeEnd=="" || weight =="" || weight == "0" ) {
        msg.innerHTML = ""
        msg.innerHTML ="From country, to country, dates and weight are required fields."
        msg.classList.remove("success")
        msg.classList.add("warn")
        return

    } else if (( dRangeStart < todaysDate ) || ( dRangeEnd < dRangeStart) ){
        msg.innerHTML =""
        msg.innerHTML ="Please input dates correctly. Start date can not be after end date, and it can not be in the past."
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

    travelEntry = host+"/travels"
    postData(travelEntry, travel, authorizationHeader(), "POST").then((data)=>{
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
}

function showCities(e){
    elem = document.getElementById(e.srcElement.id)
    targetCitiesElem = document.getElementById(elem.getAttribute("citiesElemId"))

    stateValue = elem.value
    // if (countryValue == "select"){
    //     console.log("country is not selected")
    //     return
    // }
    let stateID = getDatalistOptionsAttr(elem, "stateid", stateValue)
    let countryID =  getDatalistOptionsAttr(elem, "countryid", stateValue)

    let msg = document.getElementById("travelmessage")
    if (stateID === undefined || countryID === undefined){
        msg.innerHTML = ""
        msg.innerHTML ="Please select country from drop down."
        msg.classList.remove("success")
        msg.classList.add("warn")
        return
    } else {
        msg.innerHTML = ""
        msg.classList.remove("warn")
    }

    let citiesURI = host+"/countries/"+countryID+"/states/"+stateID+"/cities"
    postData(citiesURI, {}, authorizationHeader(), "GET").then((data)=>{
        if (data) {
            emptyDataList(targetCitiesElem)
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
    let elem = document.getElementById(e.srcElement.id)
    let targetStateElem = document.getElementById(elem.getAttribute("statesElemId"))

    countryName = elem.value
    countryID = getDatalistOptionsAttr(elem, "countryid", countryName)

    let msg = document.getElementById("travelmessage")
    if (countryID === undefined){
        msg.innerHTML = ""
        msg.innerHTML ="Please select country from drop down."
        msg.classList.remove("success")
        msg.classList.add("warn")
        return
    } else {
        msg.innerHTML = ""
        msg.classList.remove("warn")
    }

    let statesURI = host+"/countries/"+countryID+"/states"

    postData(statesURI, {}, authorizationHeader(), "GET").then((data)=>{
        if (data){
            emptyDataList(targetStateElem)
            for (var i=0; i<data.length; i++){
                let o = document.createElement("option")
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
    if (countryName == ""){
        return ""
    }
    parent = elem.parentNode
    siblings = parent.children
    for (var i=0; i< siblings.length; i++){
        // nodeName:  "DATALIST"
        if (siblings[i].nodeName == "DATALIST"){
            datalist = siblings[i]
            for (var j=0; j < datalist.options.length; j++){
                if (datalist.options[j].value == countryName){
                    return datalist.options[j].getAttribute(attrName)
                }
            }
        }
    }
}

// how countries displays the countries in the
// travel and rqeust forms
function showCountries(){
    let countriesURI = host+"/countries"

    postData(countriesURI, {}, authorizationHeader(), "GET").then((data)=>{
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

    let getUserDetails = host+"/users/"+payloadObj.Username

    postData(getUserDetails, {}, authorizationHeader(), "GET").then((data)=>{
        if (data){
            if (data.PhoneVerified){
                let metaElem = document.getElementById("loggedinusermeta")
                metaElem.innerHTML = ""
                let verifiedElem = document.createElement("span")
                verifiedElem.innerHTML = "Contact number is verified."
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

    let getUserEntries = host+"/users/"+payloadObj.Username+"/entries"

    postData(getUserEntries, {}, authorizationHeader(), "GET").then((data)=>{
        hideLoadingIcon()
        let msgInfo = document.getElementById("entriesinfo")
        if (data){
            msgInfo.innerHTML = ""
            if (data.length == 0){
                msgInfo.innerHTML = ""
                msgInfo.classList.remove("warn")
                msgInfo.classList.add("nodata")
                msgInfo.innerHTML = "You have not made any entry yet."
                return
            }

            for (var i=0; i< data.length; i++){
                showUserEntry(data[i])
            }
        } else {
            msgInfo.classList.add("warn")
            msgInfo.classList.remove("nodata")
            msgInfo.innerHTML = ""
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
