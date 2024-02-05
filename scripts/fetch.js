async function postData(url = "", data = {}, headers = {}, method = "GET") {
    try{
        requestInfo = {
            method: method,
            mode: "cors",
            cache: "no-cache",
            credentials: "omit",
            // credentials: "include",
            headers: headers,
            redirect: "follow",
            referrerPolicy: "no-referrer",
        }


        if (method !="GET"){
            if (url.includes("/user/dp")){
                requestInfo.body = data
            } else {
                requestInfo.body = JSON.stringify(data)
            }
        }

        const response = await fetch(url, requestInfo);

        // in some cases we wouldn't want ok response and wouldn't want to throw an
        // error, for example invalid password et
        // if (!response.ok){
        //     throw new Error("Network response was not ok")
        // }
        ok = response.ok

        if (ok) {
            const result = await response.json()
            return result
        } else {
            const notOKResult = await response.text()
            console.log("notOKResult ", notOKResult)
            if (notOKResult == "Token provided in request is invalid\n"){
                window.location ="/logout"
                return
            }
        }
        return ok
    }
    catch (error){
        console.log("Error in catch ",error)
    }
  }
