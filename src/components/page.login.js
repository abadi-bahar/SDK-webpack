import {AppConfig} from "./config.js"
import Dialog from "./dialog.js"
import Input from "./input.js"
import {userNameValidator , otpValidator , mobileValidator} from "./validator.js"
import {padLeft,generateUUid} from "./Util.js"
import  MD5 from "./crypto.js"

export default  class Login
{

constructor(s , api) {
   this.state = s
   this.APIService = api
   this.dialog = new Dialog(this.closeLoginDialog)
   this.phoneNo = ""
   this.otp = ""
   this.userName = ""
   this.needRegister=false
   this.baziigramTime = 60
   this.baziigramIv = null
 }

changeValue=(key , value)=>
{
this[key] = value
return value

}

showLoginNode(){
		this.dialog.closeDialog();
		let html = this.renderLoginNode();
        this.dialog.showDialog(html);
       
	}

renderLoginNode(){
   let loginNode = document.createElement("div")
   let phoneNo = new Input(AppConfig.dictionary.phoneNo[this.state.language],"",11,"phoneNo",(v)=>this.changeValue("phoneNo" , v) , mobileValidator,"tel",AppConfig.dictionary.phoneNo[this.state.language])
   let userNameInput = new Input(AppConfig.dictionary.username[this.state.language],"",30,"userName",(v)=>this.changeValue("userName" , v) , userNameValidator,"text",AppConfig.dictionary.username[this.state.language])
   let registerNode = document.createElement("div")

	if(this.needRegister==false)
		registerNode.style.display="none"

	registerNode.id="register";
	/* registerNode.innerHTML = `<img id="profileImg" onclick="ProfilePage.showProfileImages('register');" src="${AppConfig.baseUrl}/images/profileImages/3.png" width="20%" style="margin:auto;border-radius:50%;margin-bottom:10px">
		<div class="text-center my-3" >می توانید عکس پروفایل خود را تغییر دهید</div>`*/
	registerNode.appendChild(userNameInput.render())
	loginNode.appendChild(registerNode)
		 
    loginNode.appendChild(phoneNo.render())
	const button = document.createElement("button");
	button.classList.add("ok-btn")
	button.addEventListener('click',this.loginOrRegister)
	button.innerText=AppConfig.dictionary.ok[this.state.language]
	loginNode.appendChild(button)
	return loginNode
		
}

showVerificationNode ()
{
  let verificationNode = document.createElement("div")
  let otpInput = new Input(AppConfig.dictionary.otp[this.state.language],"",5,"otp",(v)=>this.changeValue("otp" , v) , otpValidator,"tel",AppConfig.dictionary.otp[this.state.language])
  let timerNode = document.createElement("div")
  timerNode.innerHTML = `${AppConfig.dictionary.insertOTP[this.state.language]} <div id="verificationTimer" style="color:red;" class="text-center my-3 rtl" ></div>`
  verificationNode.appendChild(timerNode)
  verificationNode.appendChild(otpInput.render())
			 
  const button = document.createElement("button");
  button.classList.add("ok-btn")
  button.id="verify"
  button.addEventListener('click',this.verifyUser)
  button.innerText=AppConfig.dictionary.ok[this.state.language]
  verificationNode.appendChild(button)
  const resendButton = document.createElement("button");
    resendButton.classList.add("ok-btn")
	resendButton.style.display="none"
	resendButton.id="resend-otp"
    resendButton.addEventListener('click',this.loginOrRegister)
	resendButton.innerText=AppConfig.dictionary.resend[this.state.language]
	verificationNode.appendChild(resendButton)
		 
   this.dialog.closeDialog();
   this.dialog.showDialog(verificationNode);

}

signeUpService(phoneNo,userName){
   let deviceId = MD5(generateUUid());
   this.state.setState({user:{deviceId,userName,logo:3,userName}})
   let body= {
      "phoneNo": phoneNo,
      "deviceId": deviceId,
      "logo": 3,
      "userName": userName
        }
   this.APIService.post(body,AppConfig.apiUrls.UserRegister,this.showTimer)

    }

signeInService(phoneNo){
      let body= {phoneNo:phoneNo}
      let cb=(data)=>{
      if(data && data.code == 1001)
          {alert("شما باید ابتدا ثبت نام کنید");
		   this.needRegister=true
           document.getElementById('register').style.display="block"
           return
           }
      else
       this.showTimer()
        }
this.APIService.post(body,AppConfig.apiUrls.UserLogin,cb)

}

verifyUser=(callback=null)=>
{
   if(otpValidator(this.otp)==false)
          return

       
   let body= {
   "phoneNo": this.phoneNo,
   "otp": this.otp,
   "deviceId":  MD5(generateUUid())
             }

   let cb=(data)=>{
      this.state.setState({user: {
        coins: data.coins,
        logo: data.logo,
        token: data.token,
        userName: data.userName,
                }})

   localStorage.setItem('user', JSON.stringify(this.state.user));
   window.top.postMessage(this.state.user,"https://baziigram.com");
   this.state.setState({startTime : new Date().getTime()})
			
	this.clearIntervals()

    this.baziigramTime = 60
			
    if(this.APIService.queue.length>0)
		{
		let item = this.APIService.queue[this.APIService.queue.length-1];
		item.api(item.arguments.body,item.arguments.url,item.arguments.cb);
		}
                
    else
		{
		 this.dialog.closeDialog();
         this.state.moduleSettings.help.startAction()
		}

    }
this.APIService.post(body,AppConfig.apiUrls.UserVerify,cb)
}

showTimer(){
    this.showVerificationNode()
    this.baziigramTime = 60
    this.baziigramIv = setInterval(()=>{
	let timerDiv = document.getElementById('verificationTimer')
    if(this.baziigramTime>0)
        {
		this.baziigramTime -= 1
         timerDiv.innerHTML = `${parseInt(padLeft(this.baziigramTime%60,2))} : ${parseInt(padLeft(this.baziigramTime/60,2))}`
        }
    else
        {
        timerDiv.innerHTML="";
        document.getElementById('verify').style.display="none"
        document.getElementById('resend-otp').style.display="block"

		this.clearIntervals()

   this.baziigramTime = 60
        }
    },1000)
    return
}
	
loginOrRegister =()=>
{
	if((userNameValidator(this.userName)==false && this.needRegister==true) || mobileValidator(this.phoneNo)==false)
		return
	
	 if(this.needRegister==false)
	this.signeInService(this.phoneNo)
	
	else
	this.signeUpService(this.phoneNo,this.userName)
}


clearIntervals=()=>
{
 for(var i=0;i<=this.baziigramIv;i++)
            clearInterval(i);
}

}