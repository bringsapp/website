document.addEventListener("DOMContentLoaded", function(){
    showLoadingIcon()
    displayLoggedInUserDetails()
    // instead of displaying just travels in the entries (after login)
    // page, we should instead return all the entries, like we do for
    // a user.
    // and and entry can be labeled as request or travel.
    displayTravels()
    showMessagesCount()
})

function displayTravels(){
    jwt=getCookie("token=")

    // getTravelsURL = host+"/travels?token="+jwt
    getEntriesURL = host+"/entries?token="+jwt
    headers = {
        // "Authorization":"Bearer "+jwt
    }
    postData(getEntriesURL, {}, headers, "GET").then((data)=>{
        hideLoadingIcon()
        if (data){
            for (var i=0; i< data.length; i++){
                if (data[i].EntryType == "travel"){
                    displayTravel(data[i])
                } else if (data[i].EntryType == "request") {
                    displayRequest(data[i])
                }
            }
        } else {
            console.log("something broke while getting all the travels", data)
        }
    })
}

function displayRequest(travel){
    var travelsElem = document.getElementById("travels")

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
                img.setAttribute("src", travel.CreatedBy.ProfilePicture);
                img.classList.add("dpimg")
                dp.appendChild(img)


            var named = document.createElement("div")
            named.classList.add("travellername")
                var nameanchor = document.createElement("a")
                nameanchor.setAttribute("href", "../users#username="+travel.CreatedBy.Username);
                nameanchor.innerHTML=travel.CreatedBy.FirstName+" "+travel.CreatedBy.LastName
                named.appendChild(nameanchor)
            nameWrapper.appendChild(named)

        // travelPost would have actual content/details of travel
        var travelPost = document.createElement("div")
        travelPost.classList.add("travelpost")
        travelPost.innerHTML = "Is anyone travelling from <span class=\"travellocation\">"+createDisplayableLocation(travel.From)
        +"</span> to <span class=\"travellocation\">"+createDisplayableLocation(travel.To)+"</span> and can bring around "+travel.Weight+
            "grams of parcel for me."
        travelElem.appendChild(travelPost)

        // travellingDate would have travel dates of traveller
        var travellingDate = document.createElement("div")
        travellingDate.classList.add("travellingdate")
        travellingDate.innerHTML = "Can I get it before "+travel.BeforeDate+"?"
        travelElem.appendChild(travellingDate)

        var entryTypeDiv = document.createElement("div")
        entryTypeDiv.classList.add("entrytypediv")
        travelElem.appendChild(entryTypeDiv)

        var entryType = document.createElement("span")
            entryType.classList.add("entrytype")
            entryType.innerHTML = travel.EntryType
            entryTypeDiv.appendChild(entryType)

    travelsElem.appendChild(travelElem)
}

function displayTravel(travel){
    var travelsElem = document.getElementById("travels")

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
                img.setAttribute("src", travel.CreatedBy.ProfilePicture);
                img.classList.add("dpimg")
                dp.appendChild(img)


            var name = document.createElement("div")
            name.classList.add("travellername")
            // name.innerHTML = travel.Traveller.FirstName+" "+travel.Traveller.LastName
            nameWrapper.appendChild(name)
                var nameanchor = document.createElement("a")
                nameanchor.setAttribute("href", "../users#username="+travel.CreatedBy.Username);
                nameanchor.innerHTML=travel.CreatedBy.FirstName+" "+travel.CreatedBy.LastName
                name.appendChild(nameanchor)


        // travelPost would have actual content/details of travel
        var travelPost = document.createElement("div")
        travelPost.classList.add("travelpost")
        travelPost.innerHTML = "I am travelling from <span class=\"travellocation\">"+createDisplayableLocation(travel.From)+
        "</span> to <span class=\"travellocation\">"+createDisplayableLocation(travel.To)+"</span> and can bring around "+travel.Weight+
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
            entryType.innerHTML = travel.EntryType
            entryTypeDiv.appendChild(entryType)


    travelsElem.appendChild(travelElem)
}