import {getLanguage} from "./Util.js"
import {AppConfig} from './config.js'
import Dialog from "./dialog.js"
 export function errorAlert (message){
        let child=document.createElement("div");
        let alertContent = document.createElement("div");
        alertContent.className = "alertErrorBackground"
        alertContent.innerHTML = "<div class='px-2 rtl w-100 d-flex flex-row justify-content-between align-items-center'>" +
            "<div style='font-size: 18px;color:#d32020;font-weight: bold;' >خطا</div>" +
            "<img src='./images/ic_close_red.png' width='25px' height='25px' onclick='Alert.close();'/></div>"+
            "<div style='font-size: 14px'  class='text-right p-2'>"+message+"</div>"

        child.appendChild(alertContent);
        child.className = "alertBackground"
        try {
            if(typeof document.body !== 'undefined')
            document.body.appendChild(child)
        }
        catch(error){}
    }
    
 export  function close (onConfirm) {
        try {

            document.getElementsByClassName("alertBackground")[0].remove();
            onConfirm()

        }
        catch(error){
            console.error(error)
        }
    }

export function  confirmAlert (message,onConfirm=()=>{},onClose=()=>{})
    {
        const language = getLanguage()
        const d = new Dialog(onClose)
		 const containerNode = document.createElement("div");
		containerNode.classList.add('text-center')
		containerNode.innerHTML = message
		 const buttonBoxNode = document.createElement("div");
		buttonBoxNode.className = 'd-flex flex-row justify-content-between rtl'
		const okButton = document.createElement("button");
		okButton.className='ok-btn ml-2';
		okButton.innerText=AppConfig.dictionary.ok[language];
		okButton.addEventListener('click',onConfirm)
		const cancelButton = document.createElement("button");
		cancelButton.className = 'cancel-btn mr-2';
		cancelButton.innerText=AppConfig.dictionary.cancel[language];
		cancelButton.addEventListener('click',()=>{d.closeDialog();})
		buttonBoxNode.appendChild(okButton)
		buttonBoxNode.appendChild(cancelButton)
		containerNode.appendChild(buttonBoxNode)

        d.showDialog(containerNode);

    }

export function  loading(show=true)
    {
		 let loading = document.getElementById("loading");
           
        if(show) 
            loading.style.display="block"

        
        else
        loading.style.display="none"
    }



