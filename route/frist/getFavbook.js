/**
 * 获取我的收藏
 */

var request = require("request");
var data  = require("../newsData");



var getFavbook = function(res) {
	return function(ok,result) {
		if(!ok)
		{
			res.sendText("server error");
			console.log(result);
			return;
		}
		var url = "http://api.xiyoumobile.com/xiyoulibv2/user/favoriteWithImg";
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
						var img = body.Detail[i]["Images"] ? 
								  body.Detail[i]["Images"]["small"] || 
								  body.Detail[i]["Images"]["medium"] || 
								  body.Detail[i]["Images"]["large"] :
								  "https://gss0.bdstatic.com/5eR1dDebRNRTm2_p8IuM_a/res/img/logo/logo201509091.png";


						news.push(new data(
							body.Detail[i]["Title"],
							body.Detail[i]["Author"],
							img,
							"http://node.northk.wang/book?id=" +body.Detail[i]["ID"]
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

module.exports = getFavbook;