export function mobileValidator(value)
{
    return value.length==11 && value.substring(0,2)=="09"
}

export  function otpValidator(value)
{
    return value.length==5
}

export function nameValidator(value)
{
    return value.length>0
}

export function emailValidator(value)
{
 if (!value || value.length < 5) {
        return false;
    }
    var re =
        /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(value).toLowerCase());
}

export function userNameValidator(value)
{
    return mobileValidator(value) || emailValidator(value)
}


export function cardNo(str)
{
    str = str.replace(/-/g,"");
    let len = str.length;
    let sum = 0


    if(len < 16) {
        return false;
    }

    for (let i = 0; i < len; i++) {

        const digit = parseInt(str.substring(i, i+1));
        let temp = (i%2 == 0)?(digit * 2):(digit)
        sum += (temp > 9)?(temp - 9):(temp)
    }

    return (sum % 10 == 0)
}

