document.addEventListener("DOMContentLoaded", function(){
    imgInp.onchange = evt => {
        const [file] = imgInp.files
        if (file) {
          blah.src = URL.createObjectURL(file)
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