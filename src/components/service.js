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
        headers: {'Authorization': this.state.user.token ,  'Language':this.language}
        }).then((response)=> {
            Alert.loading(false)
            if (response) {
                switch (response.status) {
                    case 401:
						if (AppConfig.excludingURLs.indexOf(url)==-1)
						{this.queue.push({api: this.get, arguments: {body, url, cb}});
                        this.login.showLoginNode();
						}
                        return response.json();

                    case 204:
                        cb();
                        return response.body;

					case 200: case 400:
                        return response.json();
					
					default:
						return response.body;

                }
            }

   }).then((data)=>{
            if( data.code==undefined || data.code==200  || AppConfig.excludingURLs.indexOf(url)>-1)
            return cb(data);
			
			else if(AppConfig.excludingURLs.indexOf(url)==-1 && data.message && data.code != 401)
				return alert(data.message);	

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
                    'Authorization': this.state.user.token,
                     'Language':this.language
                },
                body: JSON.stringify(body)
            }).then((response)=>{
            Alert.loading(false)
            if (response) {
                switch (response.status) {
                    case 401:
						if (AppConfig.excludingURLs.indexOf(url)==-1)
						{this.queue.push({api: this.post, arguments: {body, url, cb}});
                        this.login.showLoginNode()
						}
                        return response.json();

                    case 204:
                        cb();
                        return response.body;

                    case 200: case 400:
                        return response.json();
						
					default:
						return response.body

                }
            }

        }).then((data)=>{

            if(data.code == undefined || data.code==2000 || data.code==1000 || AppConfig.excludingURLs.indexOf(url)>-1)
            return cb(data);
			
			else if(AppConfig.excludingURLs.indexOf(url)==-1 && data.message && data.code != 401)
				return alert(data.message);	
			
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
                    'Authorization': this.state.user.token,
                     'Language':this.language
                },
                body: JSON.stringify(body)
            }).then((response)=>{
            Alert.loading(false)
            if (response) {
                switch (response.status) {
                    case 401:
						if (AppConfig.excludingURLs.indexOf(url)==-1){
                        this.queue.push({api: this.patch, arguments: {body, url, cb}});
                        this.login.showLoginNode()
						}
                        return response.json();

                    case 204:
                        cb();
                        return response.body;

                    case 200: case 400:
                        return response.json();
						
					default:
						return response.body

                }
            }

  }).then((data)=> {
           if(data.code == undefined  || AppConfig.excludingURLs.indexOf(url)>-1)
            return cb(data);
			
			else if(AppConfig.excludingURLs.indexOf(url)==-1 && data.message && data.code != 401)
				return alert(data.message);		

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


}
