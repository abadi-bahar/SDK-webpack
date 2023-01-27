var CashBackPage = {
    cashback: function () {
        if (state.user.coins < 20000) {
            alert("حداقل مبلغ قابل انتقال 20,000 فیکوین است.")
            
        } else {
            closeDialog('dialog');
			let html = CashBackPage.cardNo()
            showDialog(html  ,'dialog', closeProfileSubMenu);
        }

    }, cardNo: function () {
        let onchange = function (value) {
            return chunk(numberOnly(fixNumbers(value)), 4).join('-');
        }
        let cardNoInput = new Input("****-****-****-****", "", 19, "cardNo", onchange, cardNo, "number" , "شماره کارت")
        state.setState({cashback: Object.assign({}, state.cashback, {cardNoInput})})

		 const node = document.createElement("div");
		const label = document.createElement("div");
		const button = document.createElement("button");
		button.classList.add("ok-btn")
		button.addEventListener('click',CashBackPage.cashbackRequest)
		button.innerText="تایید"
		label.innerHTML="شماره کارت خود را وارد نمایید"
		node.appendChild(label);
		node.appendChild(cardNoInput.render());
		node.appendChild(button);
         
        return node
    },

    cashbackRequest: function () {
		if(state.cashback.cardNoInput.isValid==false)
			return
        let body = JSON.stringify({cardNo: state.cashback.cardNoInput.value})
        let cb = function (data) {
            closeDialog('dialog')
            setTimeout(function () {
                ProfilePage.showUserProfile();
            }, 500)
            alert(data.message)
        }
        APIService.post(body, AppConfig.apiUrls.CashBack, cb)

    }

}