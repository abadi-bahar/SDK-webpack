import Menu from "./components/menu.js"
import StatusBar from "./components/statusBar.js"
import "./styles/styles.horizontal.css"
import "./styles/styles.vertical.css"
import "./styles/styles.basic.css"
import State from "./components/state.js"
import APIService from "./components/service.js"
import {AppConfig} from "./components/config.js"
import GameoverPage from "./components/page.gameover.js"
import {getLanguage} from "./components/Util.js"
import  {gameanalytics} from "gameanalytics"



 const state = new State()
 const api = new APIService(state)
 window.isStopped=true
 window.getUserLanguage = function(){return getLanguage()}
 window.addEventListener('message',listentOnParent)
 localStorage.removeItem('user');


function listentOnParent(e)
{
	 if(e.origin.indexOf("https://baziigram.com")>-1) {
          localStorage.setItem("user",JSON.stringify(e.data))
		       if(state)
			   {
				if(document.getElementsByClassName("start-playing")[0] == undefined)
				window.loadModule(state.moduleSettings)
			   }
		       
		 }
}



window.loadModule = function (setting={}){
     if(typeof window !== 'undefined' && typeof document.body !== 'undefined'){
	 let cacheUser = localStorage.getItem('user')
	 var queryParams = window.location.href.split('?')
     var gameId = queryParams[1].split('&')[0].replace("gameId=","")

    state.setState({moduleSettings:setting,gameId,language:getLanguage()})
	let timeout=0
	 if (cacheUser)
	 state.setState({user: JSON.parse(cacheUser)})

	else
		{
		state.setState({user: {logo:3,userName:"",coins:0}})
		 window.top.postMessage("getUser","https://baziigram.com")
		 timeout=900
		}

	setTimeout(function(){
		if(document.getElementsByClassName("start-playing")[0] == undefined){
	let dir = state.language=="fa" ? "rtl" : "ltr"
	 let body = document.body
    let helpNode = document.createElement("div")
    helpNode.setAttribute("lang", state.language)
    helpNode.classList.add("start-playing")
    setting.help = setting.help || {}
    let innerNode = document.createElement("div")
    innerNode.className = `${dir} help d-flex flex-column justify-content-center`
    innerNode.innerHTML = setting.help.message || setting.help.body ||  ""
    let playBtn = document.createElement("button")
     playBtn.className = "play-button mt-2"
     playBtn.addEventListener('click',removeBanner)
    innerNode.appendChild(playBtn)
    helpNode.appendChild(innerNode)

    body.appendChild(helpNode)
	const statusBar = new StatusBar(state)
	const gameoverPage = new GameoverPage(state , api )
	statusBar.addTimer()
    statusBar.addPoint()
    const menu = new Menu(state , api)
    gameoverPage.addGameOverNode();
    window.endGame = function(score){gameoverPage.endGame(score);}
    window.endAlternativeGame = function(data,cb){gameoverPage.endAlternativeGame(data,cb);}
    window.endGameLevel = function(score){gameoverPage.endGameLevel(score);}

}
		},timeout)

	try{
		gameanalytics.GameAnalytics.setEnabledInfoLog(true);
		gameanalytics.GameAnalytics("initialize", AppConfig.tracker[`g-${gameId}`].gk,AppConfig.tracker[`g-${gameId}`].sk);
	}catch(err){}

    }
}

window.removeBanner = function(action)
{
	document.getElementsByClassName('start-playing')[0].style.display="none";
	document.getElementById("gameOver").style.display="none";
	document.getElementById('gameResult').style.visibility="hidden";
	document.getElementById("cheer").style.display="block";
    state.resetState();
	state.setState({startTime : new Date().getTime()})
	window.isStopped=false
	state.moduleSettings.help.startAction();

	try{
	 gameanalytics .GameAnalytics.setEnabledInfoLog(true);
     gameanalytics.GameAnalytics.addProgressionEvent(gameanalytics.EGAProgressionStatus.Start, state.gameId, null, null, state.user);
	}
	catch(err){}

}
