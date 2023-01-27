import {AppConfig} from "./config.js"
import Dialog from "./dialog.js"
import * as Alert from "./alert.js"
export default  class UserAwardsPage  {

constructor(s , api , profile) {
   this.state = s
   this.APIService = api
   this.profilePage = profile
   this.dialog = new Dialog(this.profilePage.showUserProfile)
 }


showUserAwards() {
 this.dialog.showDialog();
 this.getUserAwards();
    }

getUserAwards=()=>{
      let cb = (data)=>{
      let html = ""
       let dir = this.state.language == "fa" ? "rtl text-right" : "ltr text-left"
      let awardListNode = document.getElementById('dialogContent')
      if (data.list.length > 0) {
        data.list.map((item,i)=>{
         html += `<div class=' prize-item ${i==data.list.length-1? "border-0" : ""} ${dir}'> <div class="${dir} d-flex flex-row justify-content-start align-items-center">`
         if (item.logo != null && item.logo != "") html += `<img class="prize-logo mx-2" src="${AppConfig.baseUrl}companyLogos/${item.logo}" />`
         html += `<div>
         <div class="${dir}">${item.companyName}</div>
         <div class="${dir} my-1 rtl">${item.category == "charge" ? AppConfig.dictionary.pinCharge[this.state.language] : AppConfig.dictionary.discountCode[this.state.language]}  ${item.code}</div>
         <div class="${dir} my-1 rtl">
         ${(item.expireDate != null && item.expireDate != "") ? (AppConfig.dictionary.expirationDate[this.state.language] + item.expireDate) : ""}
         </div>
         <div class="${dir}">${item.description || ""}</div>
         </div>
         </div>`
       if (item.link != null && item.link != "")
       html += `<button onclick="function a(){window.open('${item.link}')}a();" class="w-100 ok-btn">${AppConfig.dictionary.purchase[this.state.language]}</button>`

       html += `</div>`
            })
       }
        else
        html = `<div>${AppConfig.dictionary.noPrize[this.state.language]}</div>`

            awardListNode.innerHTML = html
        }

      this.APIService.get(null, AppConfig.apiUrls.GetUserPrizes, cb)

    }

showOffers=()=>{

 this.dialog.showDialog();
 this.getOffers();
  }

getOffers=()=>{
   let cb = (data)=>{
   let html = ""
   let dir = this.state.language == "fa" ? "rtl text-right" : "ltr text-left"
   let awardListNode = document.getElementById('dialogContent')
   if (data.awards.length > 0) {
   data.awards.map((item,i)=>{
   html = ""
   let prizeNode = document.createElement("div");
   prizeNode.className = `prize-item ${i==data.awards.length-1? "border-0" : ""} ${dir}`
   html += `<div class="d-flex flex-row justify-content-between align-items-center">
                  <div class="d-flex flex-row justify-content-start align-items-center ${dir}">`
         if (item.logo && item.logo != "")
            html += `<img class="prize-logo mx-2" src="${AppConfig.baseUrl}companyLogos/${item.logo}" />`

            html += `<div class="${dir} ">${item.name}</div>
                     </div>
                     <div  class="${dir} d-flex flex-row justify-content-between align-items-center mx-2 mb-2">
                     <img class="mx-1" src="${AppConfig.baseUrl}/images/coin2.png" height="35px" width="35px" />
                     <div class="text-center mx-1 ">${item.requiredCoins}</div>
                     </div>
                     </div>`

         prizeNode.innerHTML = html
         if (item.requiredCoins <= this.state.user.coins)
         {
         let btn = document.createElement("button")
         btn.innerText = AppConfig.dictionary.get[this.state.language]
         btn.className = "ok-btn mx-0 w-100"
         btn.addEventListener('click',(e)=>{this.showConfirmDialog( item.id , item.requiredCoins )})
         prizeNode.appendChild(btn)
         }
          awardListNode.appendChild(prizeNode)

                })
         }

         else
         awardListNode.innerHTML = `<div>${AppConfig.dictionary.notEnoughCoin[this.state.language]}</div>`

        }
        this.APIService.get(null, AppConfig.apiUrls.GetAwardsList, cb)

    }

showConfirmDialog=(id, coins)=>{
let txt = "آیا از تبدیل " + coins + " سکه خود به جایزه اطمینان دارید؟ "
if(this.state.language=="en")
txt = "Do you confirm conversion of " + coins + " Phoecoins to prize? "
  let confirm =  ()=>{
      this.getPrize(id);
      }
Alert.confirmAlert(txt, confirm, this.showOffers)
    }

getPrize=(id)=>{
    let cb =  (data)=>{
            let html = ""
            html += `<div> <div class="d-flex flex-column justify-content-between align-items-center">`
            if (data.prize.logo && data.prize.logo != "")
             html += `<img class="prize-logo mb-2" src="${AppConfig.baseUrl}companyLogos/${data.prize.logo}" />`
            html += `<div class="text-center my-1 rtl">${data.prize.category == "charge" ? AppConfig.dictionary.pinCharge[this.state.language] : AppConfig.dictionary.discountCode[this.state.language]}  ${data.prize.code}</div>`
			if(data.prize.expireDate && data.prize.expireDate != "")
             html += `<div class="text-center my-1 rtl">${(AppConfig.dictionary.expirationDate[this.state.language] + data.prize.expireDate)}</div>`
				   
			html += `<div class="text-center my-1">${data.prize.description || ""}</div> </div>`
            if (data.prize.link != null && data.prize.link != "")
                html += `<button onclick="function a(){window.open('${data.prize.link}')}a();" class="w-100 ok-btn">${AppConfig.dictionary.purchase[this.state.language]}</button>`
            html += `</div>`

            this.state.user.coins = data.userCoin
            localStorage.setItem('user', JSON.stringify(this.state.user))
           let awardListNode = document.getElementById('dialogContent')
           awardListNode.innerHTML = html
            
        }
        this.APIService.get({id}, AppConfig.apiUrls.GetPrize, cb)
    }
	


}