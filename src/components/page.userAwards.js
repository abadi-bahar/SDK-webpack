import {AppConfig} from "./config.js"
import Dialog from "./dialog.js"
import * as Alert from "./alert.js"
import {needMarquee} from "./Util.js"
export default  class UserAwardsPage  {

constructor(s , api , profile=null) {
   this.state = s
   this.APIService = api
   this.profilePage = profile
   this.dialog = profile != null ? new Dialog(()=>this.profilePage.showUserProfile(false)) : new Dialog();
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
         html += `<div class=' prize-item ${i==data.list.length-1? "border-0" : ""} ${dir}'>
         <div class="${dir} d-flex flex-row justify-content-start align-items-center">
         <img class="prize-logo mx-2" src="${item.logo}" />
         <div>
         <div class="${dir}">${item.name}</div>
         <div class="${dir} my-1 rtl">${item.category == AppConfig.dictionary.charge[this.state.language] ? AppConfig.dictionary.pinCharge[this.state.language] : AppConfig.dictionary.discountCode[this.state.language]}  ${item.code}</div>
         <div class="${dir} my-1 rtl">
         ${(item.expirationDate != null && item.expirationDate != "") ? (AppConfig.dictionary.expirationDate[this.state.language] + item.expirationDate) : ""}
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
   if (data.list.length > 0) {
   data.list.map((item,i)=>{
   html = ""
   let prizeNode = document.createElement("div");
   prizeNode.className = `prize-item ${i==data.list.length-1? "border-0" : ""} ${dir}`
   let logoRow = document.createElement("div");
   logoRow.className = "d-flex flex-row justify-content-between align-items-center"
   logoRow.setAttribute("expand",false);
   logoRow.innerHTML =  `<div class="d-flex flex-row justify-content-start align-items-center ${dir}">
                        <img class="prize-logo mx-2" src="${item.logo}" />
                        <div class="${dir} ">${item.name}</div>
                          </div>
                          <div  class="arrow"></div>`
   prizeNode.appendChild(logoRow);
   logoRow.lastChild.addEventListener('click',(e)=>{this.expand(e, item)})


         if(item.options.length>0)
         {item.options.map((option,index)=>{
         let optionNode = document.createElement("div");
           optionNode.className = "options d-flex flex-column justify-content-start my-2"
         let opInnerHtml= ` <div  class="d-flex flex-row justify-content-between ${dir} ">`
           opInnerHtml += needMarquee(option.description)
           opInnerHtml += `<div  class="${dir} d-flex flex-row justify-content-end align-items-center mx-2 mb-2">
                          <img class="mx-1" src="${AppConfig.baseUrl}/images/coin2.png" height="35px" width="35px" />
                          <div class="text-center mx-1 ">${option.requiredCoins}</div>
                          </div>
                          </div>`
         optionNode.innerHTML = opInnerHtml
         prizeNode.appendChild(optionNode)
         let btn = document.createElement("button")
         btn.innerText = AppConfig.dictionary.get[this.state.language]
         btn.className = "ok-btn mx-0 mt-2 mb-0 w-100"
         btn.addEventListener('click',(e)=>{this.showConfirmDialog( item , option)})
         optionNode.appendChild(btn)
                          })
         }

          awardListNode.appendChild(prizeNode)

                })
         }

         else
         awardListNode.innerHTML = `<div>${AppConfig.dictionary.notEnoughCoin[this.state.language]}</div>`

        }
        this.APIService.get(null, AppConfig.apiUrls.GetAwardsList, cb)

    }

showConfirmDialog=(award, option)=>{
let txt = "آیا از تبدیل " + option.requiredCoins + " سکه خود به جایزه اطمینان دارید؟ "
if(this.state.language=="en")
txt = "Do you confirm conversion of " + option.requiredCoins + " Phoecoins to prize? "
  let confirm =  ()=>{
      this.getPrize(award,option);
      }
Alert.confirmAlert(txt, confirm, this.showOffers)
    }

getPrize=(award,option)=>{
    let cb =  (data)=>{
            let html = ""
            html += `<div> <div class="d-flex flex-column justify-content-between align-items-center">
             <img class="prize-logo mb-2" src="${award.logo}" />
            <div class="text-center my-1 rtl">${data.award.category == AppConfig.dictionary.charge[this.state.language] ? AppConfig.dictionary.pinCharge[this.state.language] : AppConfig.dictionary.discountCode[this.state.language]}  ${data.award.code}</div>`
			if(data.award.expirationDate && data.award.expirationDate != "")
             html += `<div class="text-center my-1 rtl">${(AppConfig.dictionary.expirationDate[this.state.language] + data.award.expirationDate)}</div>`
				   
			html += `<div class="text-center my-1">${data.award.description || ""}</div> </div>`
            if (data.award.link != null && data.award.link != "")
                html += `<button onclick="function a(){window.open('${data.award.link}')}a();" class="w-100 ok-btn">${AppConfig.dictionary.purchase[this.state.language]}</button>`
            html += `</div>`

            this.state.user.coins = data.userCoins
            localStorage.setItem('user', JSON.stringify(this.state.user))
           let awardListNode = document.getElementById('dialogContent')
           awardListNode.innerHTML = html
            
        }
        this.APIService.post({businessId:award.id,description:option.description}, AppConfig.apiUrls.GetPrize, cb)
    }


expand=(e,award,option)=>{
let expand = e.target.parentNode.getAttribute("expand")
e.target.parentNode.setAttribute("expand",expand=="false" ? true : false)
}

}