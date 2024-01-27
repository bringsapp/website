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

    let cityElems = document.getElementsByClassName("selectcity")
    for (var i=0; i< cityElems.length; i++){
        cityElems[i].addEventListener("change", search)
    }

    let searchType = document.getElementById("searchtype")
    searchType.addEventListener("change", search)

    // let citiElems = document.getElementsByClassName("selectcity")
    // for (var i=0; i< citiElems.length; i++){
    //     citiElems[i].addEventListener("change", search)
    // }

    showCountries()
    showMessagesCount()

    // document.getElementById("searchbutton").addEventListener("click", search)
})

function search(){
    // validate if at least from and to countries are provided
    let searchType = document.getElementById("searchtype").value

    let fromCountry = document.getElementById("travelfromselectcountryip")
    let fromState = document.getElementById("travelselectstateip")
    let fromCity = document.getElementById("travelselectcityip")

    let fromCountryId = getDatalistOptionsAttr(fromCountry, "countryid", fromCountry.value)
    let fromStateId = getDatalistOptionsAttr(fromState, "stateid", fromState.value)
    let fromCityId = getDatalistOptionsAttr(fromCity, "cityid", fromCity.value)

    let toCountry = document.getElementById("traveltoselectcountryip")
    let toState = document.getElementById("traveltoselectstateip")
    let toCity = document.getElementById("traveltoselectcityip")

    let toCountryId = getDatalistOptionsAttr(toCountry, "countryid", toCountry.value)
    let toStateId = getDatalistOptionsAttr(toState, "stateid", toState.value)
    let toCityId = getDatalistOptionsAttr(toCity, "cityid", toCity.value)

    if (fromCountry.value =="" || toCountry.value =="" || fromCountry.value =="start" || fromState.value =="start" || fromCity.value == "start" || toCountry.value == "start" || toState.value == "start" || toCity.value =="start"){
        console.log("form not filled properly")
        return
    }

    let jwt=getCookie("token=")
    // get username from token
    let encodedPayload = jwt.split(".")[1]
    let payload=atob(encodedPayload)
    let payloadObj=JSON.parse(payload)

    let searchTravelURL = ""
    if (searchType == "travel"){
        searchTravelURL = host+"/travels/search?token="+jwt
    } else {
        searchTravelURL = host+"/requests/search?token="+jwt
    }

    let headers = {
        // "Authorization":"Bearer "+jwt
    }


    let req = {
        "From":{
            "Country": Number(fromCountryId),
        },
        "To":{
            "Country": Number(toCountryId),
        }
    }

    if (fromState.value != ""){
        req.From.State = Number(fromStateId)
    }
    if (fromCity.value != ""){
        req.From.City = Number(fromCityId)
    }
    if (toState.value != ""){
        req.To.State = Number(toStateId)
    }
    if (toCity.value !=""){
        req.To.City = Number(toCityId)
    }

    console.log(req)

    postData(searchTravelURL, req, headers, "POST").then((data)=>{
        if (data){
            console.log("search result ", data)
            let e = document.getElementById("searchresult")
            e.innerHTML = ""

            if (data.length ==0){
                document.getElementById("noresult").innerHTML ="No results found."
                return
            } else {
                document.getElementById("noresult").innerHTML =""
            }


            for (let i=0; i< data.length; i++){
                if (searchType == "travel"){
                    displayTravel(data[i], e)
                } else {
                    displayRequest(data[i], e)
                }

            }
        } else {
            console.log("failed searching for travels")
        }
    })
}

function displayRequest(request, requestsElem){
    console.log("show ", request, " in ", requestsElem)
    // travelElem would have one travel entry
    var travelElem = document.createElement("div")
	travelElem.classList.add("atravel");
        // namewrapper would have name and profile picture
        var nameWrapper = document.createElement("div")
        nameWrapper.classList.add("namewrapper")
        travelElem.appendChild(nameWrapper)
            var dp = document.createElement("div")
            dp.classList.add("travellerdp")
            nameWrapper.appendChild(dp)
                var img = document.createElement("img")
                img.setAttribute("src", request.Requester.ProfilePicture);
                img.classList.add("dpimg")
                dp.appendChild(img)


            var name = document.createElement("div")
            name.classList.add("travellername")
            // name.innerHTML = travel.Traveller.FirstName+" "+travel.Traveller.LastName
            nameWrapper.appendChild(name)
                var nameanchor = document.createElement("a")
                nameanchor.setAttribute("href", "../users#username="+request.Requester.Username);
                nameanchor.innerHTML=request.Requester.FirstName+" "+request.Requester.LastName
                name.appendChild(nameanchor)


        // travelPost would have actual content/details of travel
        var travelPost = document.createElement("div")
        travelPost.classList.add("travelpost")
        travelPost.innerHTML = "Is anyone travelling from <span class=\"travellocation\">"+request.From.Country+"/"+
            request.From.State+"/"+request.From.City+"</span> to <span class=\"travellocation\">"+request.To.Country+"/"+
            request.To.State+"/"+request.To.City+"</span> and can bring around "+request.Weight+
            "grams of parcel with me."
        travelElem.appendChild(travelPost)

        // travellingDate would have travel dates of traveller
        var travellingDate = document.createElement("div")
        travellingDate.classList.add("travellingdate")
        travellingDate.innerHTML = "Can I get it before "+request.BeforeDate+"?"
        travelElem.appendChild(travellingDate)

        var entryTypeDiv = document.createElement("div")
        entryTypeDiv.classList.add("entrytypediv")
        travelElem.appendChild(entryTypeDiv)

        var entryType = document.createElement("span")
            entryType.classList.add("entrytype")
            entryType.innerHTML = "request"
            entryTypeDiv.appendChild(entryType)


    requestsElem.appendChild(travelElem)
}

function displayTravel(travel, travelsElem){
    // travelElem would have one travel entry
    var travelElem = document.createElement("div")
	travelElem.classList.add("atravel");
        // namewrapper would have name and profile picture
        var nameWrapper = document.createElement("div")
        nameWrapper.classList.add("namewrapper")
        travelElem.appendChild(nameWrapper)
            var dp = document.createElement("div")
            dp.classList.add("travellerdp")
            nameWrapper.appendChild(dp)
                var img = document.createElement("img")
                img.setAttribute("src", travel.Traveller.ProfilePicture);
                img.classList.add("dpimg")
                dp.appendChild(img)


            var name = document.createElement("div")
            name.classList.add("travellername")
            // name.innerHTML = travel.Traveller.FirstName+" "+travel.Traveller.LastName
            nameWrapper.appendChild(name)
                var nameanchor = document.createElement("a")
                nameanchor.setAttribute("href", "../users#username="+travel.Traveller.Username);
                nameanchor.innerHTML=travel.Traveller.FirstName+" "+travel.Traveller.LastName
                name.appendChild(nameanchor)


        // travelPost would have actual content/details of travel
        var travelPost = document.createElement("div")
        travelPost.classList.add("travelpost")
        travelPost.innerHTML = "I am travelling from <span class=\"travellocation\">"+travel.From.Country+"/"+
            travel.From.State+"/"+travel.From.City+"</span> to <span class=\"travellocation\">"+travel.To.Country+"/"+
            travel.To.State+"/"+travel.To.City+"</span> and can bring around "+travel.Weight+
            "grams of parcel with me."
        travelElem.appendChild(travelPost)

        // travellingDate would have travel dates of traveller
        var travellingDate = document.createElement("div")
        travellingDate.classList.add("travellingdate")
        travellingDate.innerHTML = "Travelling between "+travel.TravelDateRangeStart+
        " and "+travel.TravelDateRangeEnd+"."
        travelElem.appendChild(travellingDate)

        var entryTypeDiv = document.createElement("div")
        entryTypeDiv.classList.add("entrytypediv")
        travelElem.appendChild(entryTypeDiv)

        var entryType = document.createElement("span")
            entryType.classList.add("entrytype")
            entryType.innerHTML = "travel"
            entryTypeDiv.appendChild(entryType)


    travelsElem.appendChild(travelElem)
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