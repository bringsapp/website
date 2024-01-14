document.addEventListener("DOMContentLoaded", function(){
    displayLoggedInUserDetails()

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

    let citiElems = document.getElementsByClassName("selectcity")
    for (var i=0; i< citiElems.length; i++){
        citiElems[i].addEventListener("change", search)
    }

    showCountries()
})

function search(){
    console.log("search")
    // validate if at least from and to countries are provided

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

    jwt=getCookie("token=")
    // get username from token
    encodedPayload = jwt.split(".")[1]
    payload=atob(encodedPayload)
    payloadObj=JSON.parse(payload)

    searchTravelURL = host+"/travels/search?token="+jwt
    headers = {
        // "Authorization":"Bearer "+jwt
    }

    let req = {
        "From":{
            "Country": Number(fromCountryId),
            "State": Number(fromStateId),
            "City": Number(fromCityId)
        },
        "To":{
            "Country": Number(toCountryId),
            "State":Number(toStateId),
            "City":Number(toCityId)
        }
    }

    postData(searchTravelURL, req, headers, "GET").then((data)=>{
        if (data){
            console.log("travel search was successful, data ", data)
        } else {
            console.log("failed searching for travels")
        }
    })
}

function showCities(e){
    search()

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

function showStates(e){
    search()

    elem = document.getElementById(e.srcElement.id)
    targetStateElem = document.getElementById(elem.getAttribute("statesElemId"))

    countryName = elem.value
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



                anOption = document.createElement("option")
                anOption.innerHTML = data[i].Name+" ("+data[i].ISO2Code+")"
                anOption.setAttribute("value", data[i].Name+" ("+data[i].ISO2Code+")")
                anOption.setAttribute("countryid", data[i].Id)

                anOption2 = document.createElement("option")
                anOption2.innerHTML = data[i].Name+" ("+data[i].ISO2Code+")"
                anOption2.setAttribute("value", data[i].Name+" ("+data[i].ISO2Code+")")
                anOption2.setAttribute("countryid", data[i].Id)

                // console.log(travelFrom, travelTo, requestFrom, requestTo, anOption)

                travelFrom.appendChild(anOption)
                travelTo.appendChild(anOption2)
            }

        } else {
            console.log("something went wrong fetching the countries data")
        }
    })
}