import {AppConfig} from "./config.js"
import Dialog from "./dialog.js"
import Input from "./input.js"
import {nameValidator} from "./validator.js"
import UserAwardsPage from "./page.userAwards.js"
export default  class  ProfilePage
{
   constructor(s , api) {
   this.name=s.user.name || ""
   this.logo=s.user.logo || 3
   this.state = s
   this.APIService = api
   this.dialog = new Dialog(this.closeUserProfile)
   this.userAwardsPage = new UserAwardsPage(s,api,this)
 }

onNameChange=(value)=>
{
    this.name = value
    return value
}

showUserProfile=()=>
{
this.dialog.showDialog();
this.getProfile()
}

getProfile=()=>{
let cb = (data)=>{
           if(data.user){
			this.name=data.user.name
            this.logo=data.user.logo
			this.state.setState({user:{...this.state.user,...data.user}})
           let profileNode = document.getElementById('dialogContent')
        		 let dir = this.state.language=="fa" ? "rtl" : "ltr"
        		 profileNode.style.direction="rtl"
        		 let innerNode = document.createElement("div")
        		 let profileImage = document.createElement("img")
        		 profileImage.addEventListener('click',(e)=>{this.showProfileImages()})
        		 profileImage.src = `${AppConfig.baseUrl}/images/profileImages/${this.logo || 3}.png`
        		 profileImage.className="profile-image"
        		 profileNode.append(profileImage)
                 let nameInput = new Input(AppConfig.dictionary.name[this.state.language],this.name,30,"name",this.onNameChange , nameValidator,"text",AppConfig.dictionary.name[this.state.language])
                 profileNode.append(nameInput.render())
                 let userAwards = document.createElement("button")
                 userAwards.innerText = AppConfig.dictionary.awardHistory[this.state.language]
                 userAwards.className = "ok-btn"
                 userAwards.addEventListener('click',(e)=>{this.userAwardsPage.showUserAwards()})

                 let buttonsContainer = document.createElement("div")
                 buttonsContainer.className = "d-flex flex-row justify-content-center align-items-center"
                 buttonsContainer.appendChild(userAwards)
                 innerNode.innerHTML = `
                 <div class="d-flex flex-row justify-content-start align-items-center ${dir}"><img src="${AppConfig.baseUrl}/images/coin2.png" height="40px" width="40px" />
                 <div class="text-center mx-2">${AppConfig.dictionary.myPhoecoins[this.state.language]} : ${this.state.user.coins}</div>
                 </div>
                  `
             profileNode.append(innerNode)
             profileNode.append(buttonsContainer)

             this.dialog.onclose = ()=>this.closeUserProfile()
        	// this.dialog.showDialog(profileNode);
        	}
	}
	this.APIService.get(null, AppConfig.apiUrls.GetUserProfile, cb)

}

showProfileImages ()
{
const images=[1,3,4,5,6,7,8,9,10,11,12]
let parent = document.createElement("div")

images.map(image=>{
let img = document.createElement("img")
img.className = "profile-image-options"
img.src = `${AppConfig.baseUrl}/images/profileImages/${image}.png`
img.addEventListener('click',(e)=>{this.selectImage(image)})
parent.appendChild(img)
})

    this.dialog.showDialog(parent)

}

 selectImage(id){
    this.logo = parseInt(id)
    try{document.getElementById("profileImg").src= AppConfig.baseUrl + "/images/profileImages/"+id+".png"}catch(err){}
     document.getElementById("profileLogo").src= AppConfig.baseUrl + "/images/profileImages/"+id+".png"
    this.closeProfileSubMenu();
}

closeUserProfile(id)
{
    let user = this.state.user
    if(user==null || (this.name!=user.name && this.name.length>0) || this.logo != user.logo)
        this.updateProfile()
}

updateProfile(name , logo)
{
    let user = this.state.user;
    let body= {
        "name": this.name,
        "logo": this.logo,
        }

    let cb = ()=>
    {
        user.name = name
        user.logo = logo
        this.state.setState({user})
        localStorage.setItem('user', JSON.stringify(user));
    }
    this.APIService.patch(body,AppConfig.apiUrls.EditProfile,cb)

}

closeProfileSubMenu()
{
    this.dialog.onclose = ()=>this.showUserProfile()
    this.dialog.closeDialog();
}

}