import {AppConfig} from "./config.js"
import ProfilePage from "./page.profile.js"
import LeaderboardPage from "./page.leaderboard.js"
import UserAwardsPage from "./page.userAwards.js"
import Dialog from "./dialog.js"

export default class Menu{

constructor(s,api){
this.state = s
this.profilePage = new ProfilePage(s , api)
this.leaderboardPage = new LeaderboardPage(s , api)
this.dialog = new Dialog(this.closeUserProfile)
this.userAwardsPage = new UserAwardsPage(s,api,this)
this.addMenu();
this.APIService = api
}

addMenu()
{
let MenuNode = document.createElement("div")
        MenuNode.id = "baziigramMenu"
        let img = document.createElement("img")
        img.src = 'https://games.baziigram.com/SDK/images/menu-2.png'
        img.className = "baziigram-menu-icon"
        img.id="menu"
        let body = document.body
        if(typeof body !== 'undefined'){
           MenuNode.addEventListener('click',this.showMenu)
           MenuNode.appendChild(img)
           MenuNode.appendChild(this.addProfile())
           MenuNode.appendChild(this.addLeaderboard())
           MenuNode.appendChild(this.addAwards())

            window.showUserProfile = ()=>{this.profilePage.showUserProfile()}
            window.showLeaderBoard = ()=>{this.leaderboardPage.showLeaderBoard()}
            window.showAvailableAwards = ()=>{this.userAwardsPage.showOffers()}
       body.appendChild(MenuNode)
       }
}

showMenu(event)
{

if(event.target.id != "menu")
return

if(event.target.classList.contains("show-menu"))
event.target.classList.remove("show-menu")

else
event.target.classList.add("show-menu")
}

 addProfile () {
        let MenuNode = document.createElement("button")
        MenuNode.setAttribute("lang", this.state.language);
        MenuNode.id = "profileMenu"
           MenuNode.addEventListener('click',()=>{
           document.getElementsByClassName("baziigram-menu-icon")[0].classList.remove("show-menu")
           this.profilePage.showUserProfile()})
        MenuNode.innerHTML=`<img id="profileLogo" width="90%" style="display:block;" class="mx-auto" src="${AppConfig.baseUrl}images/profileImages/${this.state.user.logo}.png">`

       return MenuNode
    }

 addLeaderboard()
    {
        let MenuNode = document.createElement("button")
        MenuNode.setAttribute("lang", this.state.language);
        MenuNode.id = "leaderboardMenu"
            MenuNode.addEventListener('click',()=>{
            document.getElementsByClassName("baziigram-menu-icon")[0].classList.remove("show-menu")
            this.leaderboardPage.showLeaderBoard();
            })

      return MenuNode
    }

addAwards()
    {
        let MenuNode = document.createElement("button")
        MenuNode.setAttribute("lang", this.state.language);
        MenuNode.id = "AwardsMenu"
            MenuNode.addEventListener('click',()=>{
            document.getElementsByClassName("baziigram-menu-icon")[0].classList.remove("show-menu")
            this.userAwardsPage.showOffers();
            })

      return MenuNode
    }

}