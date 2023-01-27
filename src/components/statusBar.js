import {AppConfig} from "./config.js"

export default class StatusBar  {

    constructor(s)
    {
    this.state = s
    }

    addTimer () {
    let body = document.body
        if (this.state.moduleSettings.timer && typeof body !== 'undefined') {
			let timerNode = document.createElement("div")
            timerNode.classList.add("timer")
            timerNode.setAttribute("lang", this.state.language);
            timerNode.innerHTML = `<div class="d-flex flex-row justify-content-end ">
                                           <div class="mx-1 flex-fill" id='${this.state.moduleSettings.timer.id}'></div>
                                           <img style="margin:auto auto auto 4px;" src="${AppConfig.baseUrl}/images/timer.png" height="25px"/>
                                         </div>`
            body.appendChild(timerNode)
        }
    }

    addPoint()
    {
         let body = document.body

    	 if(this.state.moduleSettings.point && typeof body !== 'undefined')
        {
			let pointNode = document.createElement("div")
            pointNode.classList.add("point")
            pointNode.setAttribute("lang", this.state.language);
             pointNode.innerHTML = ` <div class="d-flex flex-row justify-content-end ">
                                          <div class="mx-1 flex-fill" id='${this.state.moduleSettings.point.id}'></div>
                                           <img style="margin:auto 4px auto auto;" src="${AppConfig.baseUrl}/images/star5.png" height="25px"/>
                                           </div>`
            body.appendChild(pointNode)
        }
    }

}