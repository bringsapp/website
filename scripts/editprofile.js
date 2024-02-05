document.addEventListener("DOMContentLoaded", function(){
    displayLoggedInUserDetailsInEditProfile()

    imgInp.onchange = evt => {
        const [file] = imgInp.files
        if (file) {
          preview.src = URL.createObjectURL(file)
        }
      }


    document.getElementById("updatedp").addEventListener("click", function(){
        showLoadingIcon()
        let imgIp = document.getElementById("imgInp")

        uploadImageURL = host+"/user/dp"
        postData(uploadImageURL, imgIp.files[0], authorizationHeader(), "POST").then((data)=>{
            hideLoadingIcon()
            let imgInfo = document.getElementById("uploadimginfo")
            if (data){
                imgInfo.classList.remove("warn")
                imgInfo.classList.add("success")
                imgInfo.innerHTML = "Image was updated successfully."
            } else {
                imgInfo.classList.remove("success")
                imgInfo.classList.add("warn")
                imgInfo.innerHTML = "Something went wrong updating the image."
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

    getUserDetails = host+"/users/"+payloadObj.Username

    postData(getUserDetails, {}, authorizationHeader(), "GET").then((data)=>{
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