/**
 * 搜索图书
 */

var request = require("request");

var wechat = require("wechat-node");




var data = require("./newsData");
var makeNews = function(detail) {
	if(!detail)
	{
		return false;
	}
	var bookData = detail.BookData;
	if(!bookData)
	{
		return false;
	}
	var array = [];
	for(var i in bookData)
	{
		array.push(new data(bookData[i]["Title"],
							bookData[i]["Author"],
							bookData[i]["Images"] 
							? bookData[i]["Images"]["large"] 
							|| bookData[i]["Images"]["medium"] 
							|| bookData[i]["Images"]["small"]
							: "https://gss0.bdstatic.com/5eR1dDebRNRTm2_p8IuM_a/res/img/logo/logo201509091.png",
							"http://node.northk.wang/book?id=" + bookData[i]["ID"]
			));
	}
	return array;
}



var search = function(req,res,result) {
	var bookName = result.content;
	console.log(bookName);
	var url = "http://api.xiyoumobile.com/xiyoulibv2/book/search";
	request(
		{
			url : url,
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            form : {"page" : 1,
            		"size" : 10,
            		"keyword" : bookName}
		},
		function(err,re,body) {
			if(err)
			{
				res.sendText(err);
				return;
			}
			if(re.statusCode != 200)
			{
				res.sendText("请重试");
				return;
			}
			if(!body)
			{
				res.sendText("请重试");
				return;
			}
			body = JSON.parse(body);
			if(body.Result)
			{
				var news = makeNews(body.Detail);
				if(news)
					res.sendNews(news);
				else
					res.sendText("请重试");
			}
			else
				res.sendText("请重试");
		}
		);
	// res.sendText("");
}

var searchClick = function(req,res,result) {
	wechat.createSession(result,search);
	res.sendText("请输入图书关键字");
}


module.exports = searchClick;