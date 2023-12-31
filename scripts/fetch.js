async function postData(url = "", data = {}, headers = {}, method = "GET") {
    try{
        const response = await fetch(url, {
        method: method,
        mode: "cors",
        cache: "no-cache",
        credentials: "same-origin",
        headers: headers,
        redirect: "follow",
        referrerPolicy: "no-referrer",
        body: JSON.stringify(data),
        });

        // in some cases we wouldn't want ok response and wouldn't want to throw an
        // error, for example invalid password et
        if (!response.ok){
            throw new Error("Network response was not ok")
        }

        const result = await response.json()
        return result;
    }
    catch (error){
        console.log("Error in catch ",error)
    }
  }