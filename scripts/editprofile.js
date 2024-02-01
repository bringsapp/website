document.addEventListener("DOMContentLoaded", function(){
    displayLoggedInUserDetailsInEditProfile()

    imgInp.onchange = evt => {
        const [file] = imgInp.files
        if (file) {
          preview.src = URL.createObjectURL(file)
        }
      }


    document.getElementById("updatedp").addEventListener("click", function(){
        let jwt=getCookie("token=")
        let imgIp = document.getElementById("imgInp")
        console.log(imgIp.files[0])
        uploadImageURL = host+"/user/dp?token="+jwt
        postImage(uploadImageURL, imgIp.files[0], {}, "POST").then((data)=>{
            if (data){
                console.log("success uploading image")
            } else {
                console.log("failed uploading image")
            }
        })
    })


})


function displayLoggedInUserDetailsInEditProfile(){
    jwt=getCookie("token=")

    if (jwt == null){
        window.location ="/logout"
    }

    // get username from token
    encodedPayload = jwt.split(".")[1]
    payload=atob(encodedPayload) // prints '{"UserID":2,"exp":1704534268}'
    payloadObj=JSON.parse(payload)

    getUserDetails = host+"/users/"+payloadObj.Username+"/?token="+jwt
    headers = {
        // "Authorization":"Bearer "+jwt
    }
    postData(getUserDetails, {}, headers, "GET").then((data)=>{
        if (data){
            imgElem = document.getElementById("loggedinuserimg")
            imgElem.setAttribute("src", data.ProfilePicture)

            nameElem = document.getElementById("loggedinusername")
            nameElem.innerHTML = data.FirstName+" "+ data.LastName
            nameElem.setAttribute("href", "../profile")

            // show previous image in preview box
            preview.src = data.ProfilePicture
        } else {
            console.log("something broke while getting details of a user", data)
        }
    })
}