import {AppConfig} from "./config.js"
import * as Alert from "./alert.js"
import Login from "./page.login.js"
import {getLanguage} from "./Util.js"

export default class APIService  {

constructor(s){
    this.queue= []
    this.language = getLanguage()
    this.state = s
    this.login = new Login(s , this)
}


get=(body, url, cb = ()=>{})=>{
     Alert.loading(true)
     fetch(AppConfig.apiBaseUrl + url + this.createQueryString(body),
       {
        method: "GET",
        headers: {'Authorization':"Bearer " + this.state.user.accessToken ,  'Language':this.language}
        }).then((response)=> {
            Alert.loading(false)
            if (response) {
                switch (response.status) {
                    case 401:
						if (AppConfig.excludingURLs.indexOf(url)==-1)
						this.unAthorizationHandler({api: this.get, arguments: {body, url, cb}});

                        return ;

                    case 204:
                        cb();
                        return ;

					case 200: case 400:
                        return this.parseResponse(response,cb);
					
					default:
						return ;

                }
            }

   }).catch(error => {
            Alert.loading(false)
            alert(error.message || error);
        })
    }

post=(body, url, cb)=>{

        Alert.loading(true)
         fetch(AppConfig.apiBaseUrl + url,
            {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization':"Bearer " + this.state.user.accessToken,
                     'Language':this.language
                },
                body: JSON.stringify(body)
            }).then((response)=>{
            Alert.loading(false)
            if (response) {
                switch (response.status) {
                    case 401:
						if (AppConfig.excludingURLs.indexOf(url)==-1)
						this.unAthorizationHandler({api: this.post, arguments: {body, url, cb}});

                        return ;

                    case 204:
                        cb();
                        return ;

                    case 200: case 400:
                        return this.parseResponse(response,cb);
						
					default:
						return

                }
            }

        }).catch(error => {
            Alert.loading(false)
            alert(error.message || error);
        })
    }

patch=(body, url, cb)=>{
      Alert.loading(true)
       fetch(AppConfig.apiBaseUrl + url,
            {
                method: "PATCH",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization':"Bearer " + this.state.user.accessToken,
                     'Language':this.language
                },
                body: JSON.stringify(body)
            }).then((response)=>{
            Alert.loading(false)
            if (response) {
                switch (response.status) {
                    case 401:
						if (AppConfig.excludingURLs.indexOf(url)==-1)
                        this.unAthorizationHandler({api: this.patch, arguments: {body, url, cb}});

                        return ;

                    case 204:
                        cb();
                        return ;

                    case 200: case 400:
                        return this.parseResponse(response,cb);
						
					default:
						return

                }
            }

  }).catch(error => {
            Alert.loading(false)
            alert(error.message || error);
        })
    }

createQueryString=(params)=>{
        if (params != null && params != undefined && Object.keys(params).length > 0) {
            let str = "?"
            Object.keys(params).map((x, i) => {
                if (params[x] != null) {
                    str += x + "=" + params[x]
                    if (i < (Object.keys(params).length - 1))
                        str += "&"
                }
            })
            return str
        }

        return ""
    }

unAthorizationHandler=(request , retryCounter=0)=>{
        if(request != null)
        this.queue.push(request);

        if(retryCounter<3 && this.state.user.refreshToken)
        {
        this.post({"RefreshToken":this.state.user.refreshToken},AppConfig.apiUrls.RefreshToken,(data)=>{
        if(data.status == 200 || data.code==200)
           {let u = {...this.state.user,...{"accessToken":data.accessToken ,"refreshToken":data.refreshToken }}
           this.state.setState({user:u})
           localStorage.setItem('user',JSON.stringify(u))
            window.top.postMessage(this.state.user,"https://baziigram.com")
             if(this.queue.length>0)
            	{
            	document.getElementById('dialogContent').innerHTML=""
            	setTimeout(()=>{
            	let item = this.queue[this.queue.length-1];
            	item.api(item.arguments.body,item.arguments.url,item.arguments.cb);
            	},1000)

             }
           }

        else if(data.status != 200 && retryCounter<3)
        return this.unAthorizationHandler(null , retryCounter+1)

         else
         this.login.showLoginNode();

                   })
        }

        else
        this.login.showLoginNode();

    }

parseResponse=(res,cb)=>
{
res.json().then((data)=>{
if(data.code==400 && data.message)
      return alert(data.message);

  else
  return cb(data)

    }).catch(error => {
   Alert.loading(false)
   alert(error.message || error);
  })
}

}
