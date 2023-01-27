import {AppConfig} from "./config.js"
import Dialog from "./dialog.js"
import  {gameanalytics} from "gameanalytics"

export default  class GameoverPage
{

constructor(s , api ) {
   this.state = s
   this.APIService = api
   this.dialog = new Dialog()
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
      <div class="flex-fill d-flex flex-column" id="gameResult"></div>
    </div>`
    html+=`<div id="loading2" class="h-100 d-flex flex-column justify-content-center"><div  style="display:block;margin:auto;" class="loader"></div></div>`

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
this.APIService.post(body,AppConfig.apiUrls.GameLog,(data)=>this.showGameOverResult(data))

}

recordAlternativeLog=(userData,duration,callback)=>
{
  let body= {
      "gameId": this.state.gameId,
      "duration": duration,
      "data":userData,
	  "superGameId":48
			
}

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
	  "superGameId":48
        }

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
  let dir = this.state.language=="fa" ? "rtl" : "ltr"
 let gameOverNode = document.getElementById('gameResult')
 document.getElementById('loading2').style.display="none"
 gameOverNode.innerHTML=""
 gameOverNode.classList.add(`justify-content-${data.nextLevel?'start':'center'}`)


 if(data.coins != undefined && data.nextLevel==null)
 gameOverNode.innerHTML +=`<div class="d-flex flex-row justify-content-center align-items-start ${dir} flex-fill pt-4">
 <img width="70px" height="70px" src="${AppConfig.baseUrl}/images/coin2.png"/>
 <div  class="text-warning mx-2 ${dir}" id="yourCoins"></div>
 </div>`

let buttonsContainer = document.createElement("div")
buttonsContainer.className = "d-flex flex-row justify-content-center align-items-center"


if(data.nextLevel)
{
let nextLevelDiv = document.createElement("div")
 nextLevelDiv.className=" d-flex w-100 flex-fill flex-column justify-content-between  align-items-center"

nextLevelDiv.innerHTML=`<img  class="level-map"  src="${data.nextLevel.map}"/>
       <div  class="next-level-desc flex-wrap">${data.nextLevel.description}</div>`

 let nextLevelBtn = document.createElement("button")
 nextLevelBtn.innerText = AppConfig.dictionary.nextLevel[this.state.language]
 nextLevelBtn.className = "ok-btn"
 nextLevelBtn.addEventListener('click',(e)=>{
 if(data.nextLevel.link && data.nextLevel.link!="")
 window.location.href=data.nextLevel.link
 })

buttonsContainer.appendChild(nextLevelBtn)

 if(data.code!=400 && data.code != 401)
   nextLevelDiv.appendChild(buttonsContainer)

gameOverNode.appendChild(nextLevelDiv)
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
shareBtn.className = data.nextLevel ? "cancel-btn" : "ok-btn"
shareBtn.addEventListener('click',(e)=>{this.share(data.link)})

buttonsContainer.appendChild(shareBtn)
}

if(data.code==401 )
{
let loginBtn = document.createElement("button")
loginBtn.innerText = AppConfig.dictionary.login[this.state.language]
loginBtn.className = data.nextLevel ? "cancel-btn" : "ok-btn"
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
		this.showEarnedCoins(data.coins,0);
		
try{
   gameanalytics.GameAnalytics.addProgressionEvent(gameanalytics.EGAProgressionStatus.Complete, this.state.gameId, null, null, {...this.state.user,...score});

    if(data.coins>=0 && data.code==200)
	gameanalytics.GameAnalytics.addResourceEvent(gameanalytics.EGAResourceFlowType.Source, "Phoecoin", data.coins, "playing", "playing",this.state.user);
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

showEarnedCoins=(coins,tempCoins)=>
{

document.getElementById('yourCoins').innerText=tempCoins + " " + AppConfig.dictionary.coin[this.state.language]  ;
if(coins!=tempCoins)
 setTimeout(()=>{this.showEarnedCoins(coins,tempCoins+1)},1)
}

authorization=(score)=>{
	let body= {
         "gameId": this.state.gameId,
         "duration": this.state.endTime - this.state.startTime,
         "score":score
             }
       
this.APIService.queue.push({api: this.APIService.post, arguments: {body, url:AppConfig.apiUrls.GameLog,cb: (data)=>{
	this.dialog.closeDialog();

if(data.user)
   this.state.setState({user:{...this.state.user,...data.user}})
				
   localStorage.setItem('user',JSON.stringify(this.state.user))
   window.top.postMessage(this.state.user,"https://baziigram.com")
   window.history.back();
}
}
  });

document.getElementById("gameOver").style.display="none";
this.APIService.login.showLoginNode()
						
}
	
goHome ()
{
window.history.back();
}
	



endGame(score)
{
    this.state.endTime = new Date().getTime();
	this.state.setState({endTime:this.state.endTime,score})
	document.getElementById('loading2').style.display="block"
    document.getElementById("gameOver").style.display="block";
    this.service(score , this.state.endTime - this.state.startTime)
	try{
      gameanalytics.GameAnalytics.addProgressionEvent(gameanalytics.EGAProgressionStatus.Complete, this.state.gameId, null, null, {...this.state.user,...score});
	}
	catch(err){}
}

endAlternativeGame(data,cb)
{
    this.state.endTime = new Date().getTime();
	 this.recordGameLevelLog(data , this.state.endTime - this.state.startTime,cb)
	  try{
       gameanalytics.GameAnalytics.addProgressionEvent(gameanalytics.EGAProgressionStatus.Complete, this.state.gameId, null, null, {...this.state.user,...data});
	    }
	  catch(err){}
}

endGameLevel(score)
{
    this.state.endTime = new Date().getTime();
	this.state.setState({endTime:this.state.endTime,score})
	document.getElementById('loading2').style.display="block"
    document.getElementById("gameOver").style.display="block";
    this.recordGameLevelLog(score , this.state.endTime - this.state.startTime)
	try{
      gameanalytics.GameAnalytics.addProgressionEvent(gameanalytics.EGAProgressionStatus.Complete, this.state.gameId, null, null, {...this.state.user,...score});
	}
	catch(err){}
}

}