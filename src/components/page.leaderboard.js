import {AppConfig} from "./config.js"
import Dialog from "./dialog.js"
import Input from "./input.js"

export default  class  LeaderboardPage
{

 constructor(s , api) {
   this.state = s
   this.APIService = api
   this.dialog = new Dialog()
 }


showLeaderBoard()
{
  this.dialog.showDialog();
  this.getLeaderboard()
}


getLeaderboard()
{
	let body= {
        "gameId": this.state.gameId,
       }

    let cb = (data)=>
    {
       let dir = this.state.language == "fa" ? "rtl text-right" : "ltr text-left"
        let html = ""
				let leaderboardNode = document.getElementById('dialogContent')
				if(data.list.length>0)
				{
					data.list.map((item,i)=>{
					let containerClass="logo-container "
					html += ` <div  class="${dir} d-flex flex-row justify-content-between align-items-center px-2 prize-item">`
					if(i<3)
					containerClass += i==0?'gold':(i==1?'silver':'bronze')

                    html +=   `<div class="${containerClass}"><img class="leader-board-logo ${i>2?'small-logo':''}" src="${AppConfig.baseUrl}images/profileImages/${item.logo}.png" /></div>
                                   <div style="max-width:30%;overflow-x:hidden;" class="text-right">${item.name}</div>
                                  <div class="text-right">${item.score}</div>
                                  </div>`
					})
				}
			else
				html=`<div>${AppConfig.dictionary.noRecord[this.state.language]}</div>`
	         leaderboardNode.innerHTML = html
    }
    this.APIService.get(body,AppConfig.apiUrls.GetLeaderboard,cb)
	
}

}

