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
        console.log("immediately before fetch")
        const response = await fetch(url, requestInfo);
        console.log("immediately after fetch")
        // in some cases we wouldn't want ok response and wouldn't want to throw an
        // error, for example invalid password et
        // if (!response.ok){
        //     throw new Error("Network response was not ok")
        // }
        ok = response.ok

        if (ok) {
            console.log("response was ok")
            const result = await response.json()
            return result
        } else {
            console.log("response was not ok")
            const notOKResult = await response.text()
            console.log("Not ok response ", notOKResult)
            if (notOKResult == "Token provided in request is invalid\n"){
                window.location ="/logout"
                return
            }
        }
        return ok
    }
    catch (error){
        console.log("Something broke ", error)
    }
  }
