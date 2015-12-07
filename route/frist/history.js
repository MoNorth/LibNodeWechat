/**
 * 查看历史借阅
 */
var request = require("request");
var data  = require("../newsData");



var gethistory = function(res) {
	return function(ok,result) {
		if(!ok)
		{
			res.sendText("server error");
			console.log(result);
			return;
		}
		var url = "http://api.xiyoumobile.com/xiyoulibv2/user/history";
		request(
		{
			url : url,
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            form : {"session" : result}
		},
		function(err,re,body) {
			if(err)
			{
				res.sendText("server error");
				console.log(err);
				return;
			}
			if(!body)
			{
				res.sendText("server error");
				console.log('body 不存在');
				return;
			}
			body = JSON.parse(body);
			if(re.statusCode === 200 && body.Result)
			{
				if(typeof body.Detail === "string")
					res.sendText(body.Detail);
				else
				{
					var news = [];
					for(var i in body.Detail)
					{
						if(news.length > 9)
							break;
						news.push(new data(
							body.Detail[i]["Title"],
							body.Detail[i]["Date"],
							"https://gss0.bdstatic.com/5eR1dDebRNRTm2_p8IuM_a/res/img/logo/logo201509091.png",
							"http://node.northk.wang/book?barcode=" +body.Detail[i]["Barcode"]
							));
					}
					res.sendNews(news);
				}
			}
			else
				res.sendText("server error");
		}

		);
	}
}

module.exports = gethistory;
