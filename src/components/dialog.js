import {getLanguage} from "./Util.js"
import {AppConfig} from "./config.js"
export default class Dialog{

constructor(close=()=>{})
{
this.dialog = document.getElementById("dialogContainer")

if(this.dialog == null)
this.addDialogNode()

this.onclose = close

}

closeDialog(id,showMainDialog=true)
{
    window.isStopped=true
    this.dialog.classList.add("hide-dialog")
    this.dialog.classList.remove("show-dialog")

}


 showDialog(body="")
{
    window.isStopped=true;

    const dialogContent = document.getElementById("dialogContent")

    this.dialog.classList.remove("show-dialog")
	if(typeof body == 'string')
	dialogContent.innerHTML=body

	else
	{   dialogContent.innerHTML=""
		dialogContent.appendChild(body)
	}
	var old_element = document.getElementById("closeBtn");
    var new_element = old_element.cloneNode(true);
     old_element.parentNode.replaceChild(new_element, old_element);
	document.getElementById("closeBtn").addEventListener('click',()=>{this.closeDialog() })
    this.dialog.addEventListener('animationend',this.closeEnd)

    this.dialog.classList.add("show-dialog")

}

 addDialogNode(){
    const language = getLanguage()
    const dir = language=="fa" ? "rtl" :"ltr"

    let body = document.body
    let dialogNode = document.createElement("div")
    dialogNode.id="dialogContainer"
    dialogNode.style.display="none"
    dialogNode.setAttribute("lang", language);
    dialogNode.innerHTML = `
    <img  class="papiroos-top" src ="${AppConfig.baseUrl}/images/papiroos-top.png"/>
    <div class="papiroos-middle">
			<div class="w-100 text-left"><button id="closeBtn" class="close-btn"></button></div>
            <div id="loading" style="display:none;" class="loader"></div>
			<div id="dialogContent" class="text-center mx-0 mb-0 px-2" style="overflow:auto;max-height:300px;margin-top:10px" >
				</div>
				</div>
				<img  class="papiroos-bottom" src ="${AppConfig.baseUrl}/images/papiroos-bottom.png"/>`
    if(typeof document.body !== 'undefined'){
    body.appendChild(dialogNode)
    this.dialog = document.getElementById("dialogContainer")
    }

}

closeEnd=(e)=>
{
if(e.animationName=="hide-dialog")
  {this.dialog.classList.remove("hide-dialog");
  this.dialog.removeEventListener('animationend',this.closeEnd)
    this.onclose()
    window.isStopped=false;
  }
}

//export function closeLoginDialog()
//{
//	closeProfileSubMenu();
//	for(var i=0;i<=state.baziigramIv;i++)
//            clearInterval(i);
//}

}