import {AppConfig} from "./config.js"
import Dialog from "./dialog.js"
import "../styles/firework.css"

export default  class GameoverPage
{

constructor(s , api , gameanalytics ) {
   this.state = s
   this.APIService = api
   this.dialog = new Dialog
   this.request={}
   this.gameanalytics = gameanalytics
}

addGameOverNode()
{
	let body = document.body
	if(typeof body !== 'undefined'){
    let gameOverNode = document.createElement("div")
    gameOverNode.setAttribute("lang", this.state.language);
    gameOverNode.id="gameOver";
    gameOverNode.classList.add("gameOver")
	const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0)
	let html = `<img  class="w-100 jungle" src ="${AppConfig.baseUrl}/images/back3.png"/>
    <img  class="phoenix" src ="${AppConfig.baseUrl}/images/phoenix-header2.png"/>
    <div id="cheer" style="display:none;height:100%;position:absolute;width:100%;height:100%;top:0px;left:0px;z-index:0;">`
    html+= `</div><div id="gameOverContent" >
    <div class="game-header w-100 d-flex flex-row justify-content-between align-items-center">
     <img class="moon" src="${AppConfig.baseUrl}/images/moon6.png"/>
       <button  class="replay-button" onclick="removeBanner();"  ></button>
      </div>

      <div id="loading2" class="h-100 flex-fill flex-column justify-content-center">
      <div  style="display:block;margin:auto;" class="loader"></div></div>
      <div class="flex-fill d-flex flex-column" id="gameResult"></div>
    </div>`


    gameOverNode.innerHTML = html
    body.appendChild(gameOverNode)
    }
}

service=(score,duration)=>
{
   let body= {
       "gameId": this.state.gameId,
       "duration": duration,
        "score":this.state.score
            }
this.request = {body, url:AppConfig.apiUrls.GameLog}
this.APIService.post(body,AppConfig.apiUrls.GameLog,(data)=>this.showGameOverResult(data))

}

recordAlternativeLog=(userData,duration,callback)=>
{
  let body= {
      "gameId": this.state.gameId,
      "duration": duration,
      "data":userData,
	  "superGameId":46
			
}
this.request = {body, url:AppConfig.apiUrls.GameAlternativeLog}
this.APIService.post(body,AppConfig.apiUrls.GameAlternativeLog,(data)=>{

   if(data.user)
	{
	 this.state.setState({user:{...this.state.user,...this.data.user}})
	 localStorage.setItem('user',JSON.stringify(this.state.user))
	 window.top.postMessage(state.user,"https://baziigram.com")
	}
callback(data);
})

}


recordGameLevelLog=(score,duration)=>{
  let body= {
      "gameId": this.state.gameId,
      "duration": duration,
      "score":this.state.score,
	  "superGameId":46
        }
this.request = {body, url:AppConfig.apiUrls.GameLevelLog}
this.APIService.post(body,AppConfig.apiUrls.GameLevelLog,(data)=>{
	if(data.user)
	  {
	   this.state.setState({user:{...this.state.user,...data.user}})
	   localStorage.setItem('user',JSON.stringify(this.state.user))
	   window.top.postMessage(this.state.user,"https://baziigram.com")
	  }

this.showGameOverResult(data,score);
})

}

showGameOverResult=(data,score)=>
{
 let html=""
 let unit = AppConfig.dictionary.coin[this.state.language]
  let dir = this.state.language=="fa" ? "rtl" : "ltr"
 let gameOverNode = document.getElementById('gameResult')
 document.getElementById('loading2').style.display="none"
 gameOverNode.innerHTML=""
 gameOverNode.classList.add(`justify-content-${data.nextLevel?'start':'between'}`)


 if(data.coins != undefined && data.nextLevel==null)
 gameOverNode.innerHTML +=`<div class="phoecoins d-flex flex-row justify-content-center align-items-center ltr  pt-2">
 <div class="d-flex flex-row justify-content-center align-items-center ${dir} ">
 <img class="coin" src="${AppConfig.baseUrl}/images/coin2.png"/>
 <div  class="text-warning mx-2 ${dir}" id="yourCoins"></div>
 </div>
 <div  class="your-rank  ${dir}" id="yourRank"></div>
 </div>`

let buttonsContainer = document.createElement("div")
buttonsContainer.className = "d-flex flex-row justify-content-center align-items-center mt-2"


if(data.nextLevel)
{
let nextLevelDiv = document.createElement("div")
 nextLevelDiv.className=" d-flex w-100 flex-fill flex-column justify-content-between  align-items-center"
let nextLevelInnerHTML=""

if(data.nextLevel.video != null)
nextLevelInnerHTML += `<div  class="w-100 flex-wrap d-flex flex-column justify-content-center">
<video id="videoplayer" class="video" poster="${data.nextLevel.map}"  controls>
  <source src="${data.nextLevel.video}" type="video/mp4"/>
Your browser does not support the video tag.
</video>
</div>`

else if(data.nextLevel.description!=null)
nextLevelInnerHTML += `<img  class="level-map"  src="${data.nextLevel.map}"/>
<div  class="next-level-desc flex-wrap">${data.nextLevel.description}</div>`


 nextLevelDiv.innerHTML = nextLevelInnerHTML;
 let nextLevelBtn = document.createElement("button")
 nextLevelBtn.innerText = AppConfig.dictionary.nextLevel[this.state.language]
 nextLevelBtn.className = "login-btn"
 nextLevelBtn.addEventListener('click',(e)=>{
 if(data.nextLevel.link && data.nextLevel.link!="")
 window.location.href=data.nextLevel.link
 })

buttonsContainer.appendChild(nextLevelBtn)

 if(data.code!=400 && data.code != 401)
   nextLevelDiv.appendChild(buttonsContainer)

gameOverNode.appendChild(nextLevelDiv)

if(data && data.nextLevel && data.nextLevel.video != null)
document.getElementById("videoplayer").addEventListener("playing", event => {
    const player = document.getElementById("videoplayer");
    if (player.requestFullscreen)
        player.requestFullscreen();
    else if (player.webkitRequestFullscreen)
        player.webkitRequestFullscreen();
    else if (player.msRequestFullScreen)
      player.msRequestFullScreen();
})
}

if(data.leaderboard && data.leaderboard.length>0)
{

gameOverNode.appendChild(this.addLeaderboardNode(data.leaderboard))
let youElement = document.getElementsByName(AppConfig.dictionary.you[this.state.language])[0]
if(youElement)
{
unit=""
youElement.scrollIntoView({ behavior: "smooth", block: "start", inline: "nearest" });
}
}

if(data.code == 400 || (data.code == 401 && data.coins>0))
{
let div = document.createElement("div")
div.className = `referal-link text-dark ${dir}`
div.innerText = data.message

if(data.code==400 && data.link && data.link!="")
{
let shareBtn = document.createElement("button")
shareBtn.innerText = AppConfig.dictionary.share[this.state.language]
shareBtn.className = (data.nextLevel || data.code==401) ? "secondary-btn" : "login-btn"
shareBtn.addEventListener('click',(e)=>{this.share(data.link)})

buttonsContainer.appendChild(shareBtn)
}

if(data.code==401 )
{
let loginBtn = document.createElement("button")
loginBtn.innerText = AppConfig.dictionary.login[this.state.language]
loginBtn.className = data.nextLevel ? "secondary-btn" : "login-btn"
loginBtn.addEventListener('click',(e)=>{this.authorization(this.state.score)})
buttonsContainer.appendChild(loginBtn)
}

div.appendChild(buttonsContainer)
gameOverNode.appendChild(div)
}

gameOverNode.style.visibility="visible";

		if(score>0)
		document.getElementById("cheer").style.display="block";

		if(data.user)
			this.state.setState({user:{...this.state.user,...data.user}})
		
        localStorage.setItem('user',JSON.stringify(this.state.user))
		window.top.postMessage(this.state.user,"https://baziigram.com")
            
		if(data.coins>=0 && data.nextLevel==null)
		this.showEarnedCoins(data.coins,0 , unit);
		
try{
   this.gameanalytics.GameAnalytics.addProgressionEvent(this.gameanalytics.EGAProgressionStatus.Complete, this.state.gameId, null, null, {...this.state.user,...score});

    if(data.coins>=0 && data.code==200)
	this.gameanalytics.GameAnalytics.addResourceEvent(this.gameanalytics.EGAResourceFlowType.Source, "Phoecoin", data.coins, "playing", "playing",this.state.user);
	}
catch(err){}

}

share (link)
{
if(navigator && navigator.share )
  navigator.share({
    text: AppConfig.dictionary.shareTxt[this.state.language],
    link,
    title: AppConfig.dictionary.shateTitle[this.state.language],
        });
}

showEarnedCoins=(coins,tempCoins , unit="")=>
{

document.getElementById('yourCoins').innerText=tempCoins + " " + unit ;
if(coins!=tempCoins)
 setTimeout(()=>{this.showEarnedCoins(coins,tempCoins+1 , unit)},1)
}

authorization=(score)=>{
	let body= {
         "gameId": this.state.gameId,
         "duration": this.state.endTime - this.state.startTime,
         "score":score
             }
       
this.APIService.queue.push({api: this.APIService.post, arguments: {...this.request,...{cb: (data)=>{
	this.dialog.closeDialog();

if(data.user)
   this.state.setState({user:{...this.state.user,...data.user}})
				
   localStorage.setItem('user',JSON.stringify(this.state.user))
   window.top.postMessage(this.state.user,"https://baziigram.com")
   window.history.back();
          }
     }
}
  });

document.getElementById("gameOver").style.display="none";
this.APIService.login.showLoginNode()
						
}

addLeaderboardNode=(list)=>
{
let leaderboard = document.createElement("div")
leaderboard.className = "flex-fill gameover-leaderboard my-2"
 let dir = this.state.language == "fa" ? "rtl text-right" : "ltr text-left"
        let html = ""
        let textClass="text-light"
        let yourRank = document.getElementById("yourRank")
        yourRank.classList.add("ml-5")

		list.map((item,i)=>{
		textClass="text-light"
		if(item.name == AppConfig.dictionary.you[this.state.language])
		{yourRank.innerHTML = `<div class="your-rank">${AppConfig.dictionary.yourRank[this.state.language]} ${i+1}
		<div class="firework"></div><div class="firework"></div><div class="firework"></div>
		</div>`
		textClass="text-warning"
		}
        let containerClass="logo-container "

        html += ` <div name="${item.name}"   class="${dir} ${textClass} d-flex flex-row justify-content-between align-items-center px-2 prize-item">`
        		if(i<3)
        containerClass += i==0?'gold':(i==1?'silver':'bronze')
        html +=   `<div class="${containerClass}"><img class="leader-board-logo ${i>2?'small-logo':''}" src="${AppConfig.baseUrl}images/profileImages/${item.logo}.png" /></div>
             <div style="max-width:30%;overflow-x:hidden;" class="text-right">${item.name}</div>
              <div class="text-right">${item.score}</div>
               </div>`
        					})
  leaderboard.innerHTML = html
  try{
  let phoenix = document.getElementsByClassName("phoenix")[0]
  phoenix.classList.add("phoenix-near-moon")
  phoenix.classList.remove("phoenix") }catch(err){}
  return leaderboard
}
	
goHome ()
{
window.history.back();
}
	



endGame(score)
{
    this.state.endTime = new Date().getTime();
	this.state.setState({endTime:this.state.endTime,score})
	document.getElementById('loading2').style.display="flex"
    document.getElementById("gameOver").style.display="block";
    this.service(score , this.state.endTime - this.state.startTime)
	try{
      this.gameanalytics.GameAnalytics.addProgressionEvent(this.gameanalytics.EGAProgressionStatus.Complete, this.state.gameId, null, null, {...this.state.user,...score});
	}
	catch(err){}
}

endAlternativeGame(data,cb)
{
    this.state.endTime = new Date().getTime();
	 this.recordGameLevelLog(data , this.state.endTime - this.state.startTime,cb)
	  try{
       this.gameanalytics.GameAnalytics.addProgressionEvent(this.gameanalytics.EGAProgressionStatus.Complete, this.state.gameId, null, null, {...this.state.user,...data});
	    }
	  catch(err){}
}

endGameLevel(score)
{
    this.state.endTime = new Date().getTime();
	this.state.setState({endTime:this.state.endTime,score})
	document.getElementById('loading2').style.display="flex"
    document.getElementById("gameOver").style.display="block";
    this.recordGameLevelLog(score , this.state.endTime - this.state.startTime)
	try{
      this.gameanalytics.GameAnalytics.addProgressionEvent(this.gameanalytics.EGAProgressionStatus.Complete, this.state.gameId, null, null, {...this.state.user,...score});
	}
	catch(err){}
}

}