export function padLeft(input,count,paddChar="0"){
    let strLen = String(input).length;
    if(strLen < count) {
        return Array(count-strLen+1).join(paddChar||'0')+input;
    } else {
        return input;
    }
}

export function fixNumbers(input){
    const numberMap = {"٠" : "0", "۰" : "0","١" : "1", "۱" : "1", "٢":"2","۲" : "2", "٣":"3", "۳" : "3", "۴" : "4", "٤" : "4", "٥" : "5", "۵" : "5", "۶" : "6", "٦" : "6", "٧":"7", "۷" : "7", "٨":"8", "۸" : "8", "٩":"9", "۹" : "9"};

    if(typeof input == 'undefined')
        return input;

    Object.keys(numberMap).map(key => {
        input = input.toString().replace(new RegExp(key, 'g'),numberMap[key])
    })
    return input
}


export function numberOnly(x){
    x = x || ""
    return x.toString().replace(/\D/g,'');
}





export function generateUUid()
{
    var navigator_info = window.navigator;
    var screen_info = window.screen;
    var uid = navigator_info.mimeTypes.length;
    uid += navigator_info.userAgent.replace(/\D+/g, '');
    uid += navigator_info.plugins.length;
    uid += screen_info.height || '';
    uid += screen_info.width || '';
    uid += screen_info.pixelDepth || '';
    return	uid
}

export function getLanguage()
{
const date = new Date()
const timestamp = date.getTime()
const timezone = date.getTimezoneOffset()
const summerStart = (new Date(date.getFullYear()+'-03-21')).getTime();
  const summerEnd = (new Date(date.getFullYear()+'-09-23')).getTime();

//  condition for  timezone if time changes at 1th farvardin and 1th mehr
//if((timezone==-270 && timestamp>=summerStart &&  timestamp<summerEnd) || (timezone==-210 && timestamp<summerStart))

if(timezone==-210)
return "fa"

return "en"

}

export function needMarquee(text){
const vw = Math.min(Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0) , 900)

if (text.length*8 > Math.floor((vw-40)*0.55))
      return `<marquee behavior="scroll" scrollamount="2" direction="right">
          ${text}
        </marquee>`

 return text
}