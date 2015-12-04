/**
 * xiyouLib wechat 
 * Create by MoNorth
 */


var express = require("express");
var app = express();
var wechat_node = require("wechat-node");
var wechat = new wechat_node(app,"wx2d99e56a3326b348","d4624c36b6795d1d99dcf0547af5443d","northk");
var request = require("request");

//设置菜单
//
//
// console.log("设置菜单");
// wechat.use("setMenu",function(ok,result) {
// 	console.log(result);
// });


wechat.use("postData");
wechat.use("session");


wechat.retext(function(ok,req,res,result) {
	res.sendText("暂时不能自动回复");
});


var data = function(title,description,picUrl,url) {
		this.Title = title;
		this.Description = description;
		this.PicUrl = picUrl;
		this.Url = url;
	}

/**
 * 搜索图书
 */
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
	var array = []
	for(var i in bookData)
	{
		array.push(new data(bookData[i]["Title"],
							bookData[i]["Author"],
							bookData[i]["Images"] 
							? bookData[i]["Images"]["large"] 
							|| bookData[i]["Images"]["medium"] 
							|| bookData[i]["Images"]["small"]
							: "https://gss0.bdstatic.com/5eR1dDebRNRTm2_p8IuM_a/res/img/logo/logo201509091.png",
							"http://borth.gitcafe.io"
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
				res.sendNews(makeNews(body.Detail));
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



wechat.reclick({
	"ser_book":searchClick
},"");


//监听

app.listen(8080);



