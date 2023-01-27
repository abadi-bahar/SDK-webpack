import {getLanguage , fixNumbers , padLeft , numberOnly} from "./Util.js"
import {AppConfig} from "./config.js"

export default  class Input  {


     constructor(placeHolder="",value="",maxLength,id,change=(x)=>x,validator=(v)=>true,type="text" , label="")
     {
         this.placeHolder = placeHolder;
         this.value = value;
         this.maxLength = maxLength;
         this.id = id;
         this.changeValue = change;
         this.validator = validator;
         this.type = type;
         this.inputMode={"number":"numeric","tel":"tel","text":"text"};
         this.isValid=false
         this.label = label
     }


    render(){
        const language = getLanguage()
		 const newInput = document.createElement("input");
        const container = document.createElement("div");
        const errorDiv = document.createElement("div");
        const label = document.createElement("label");
        label.className = language=="fa"?"right-label rtl text-right" : "left-label ltr text-left"
        label.innerText = this.placeHolder
        const dir = language=="fa" ? "rtl text-right" :"ltr text-left"
        errorDiv.className=`input-error-text ${dir}`
        errorDiv.style.display="none"
        errorDiv.id=`error-txt-${this.id}`
        errorDiv.innerText= this.label + " " + AppConfig.dictionary.inputErr[language]
        newInput.setAttribute("id", this.id);
        newInput.className=`baziigram-input ${dir}`;
        newInput.setAttribute("type", "text");
        newInput.setAttribute("inputMode", this.inputMode[this.type]);
        newInput.setAttribute("autoSave", "off");
        newInput.setAttribute("autoCorrect", "off");
        newInput.setAttribute("autoCapitalize", "off");
        newInput.setAttribute("autocomplete", "off");
        newInput.setAttribute("maxlength", this.maxLength);
        newInput.setAttribute("placeholder", " ");
        newInput.setAttribute("value", this.value);

        newInput.addEventListener('focus',(e)=>{this.onfocus(e)})
        newInput.addEventListener('blur',(e)=>{this.onblur(e)})
        newInput.addEventListener('input',(e)=>{this.onChange(e)})
        container.className = 'input-container d-flex flex-column align-items-start'
        container.appendChild(newInput);
        container.appendChild(label);
        container.appendChild(errorDiv);
        return container
    };


    onfocus(event){
    if(typeof document.body !== 'undefined'){
	 let parent=event.target.parentNode.parentNode.parentNode
	     document.body.style.overflow="auto"
        parent.scrollTop = event.target.offsetTop
        document.getElementById("error-txt-"+this.id).style.display="none"
        }
	};
    
	
    onChange(event){
		this.value = fixNumbers(event.target.value)
        if(this.type=='number' || this.type=='tel')
            this.value = numberOnly(this.value)

         this.changeValue(this.value)

         event.target.value=this.value
	};
	
    onblur(event){
    if(typeof document.body !== 'undefined'){
        let element=event.target
        let parent=event.target.parentNode.parentNode.parentNode
        document.body.style.overflow="hidden"
        parent.scrollTop = 0
        document.getElementById("error-txt-"+this.id).style.display="none"
       this.isValid = this.validator(this.value);

		
        if(!this.isValid)
			document.getElementById("error-txt-"+this.id).style.display="block"
			}

    };

}
