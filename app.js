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


wechat.reclick({
	"ser_book":searchClick
},"");


//监听

app.listen(8080);



/**
 * 搜索图书
 */

var searchClick = function(req,res,result) {
	wechat.createSession(result,search);
	res.sendText("请输入图书关键字");
}

var search = function(req,res,result) {
	var bookName = result.content;
	var url = " http://api.xiyoumobile.com/xiyoulibv2/book/search?page=1&size=10&keyword=" + bookName;
	request(
		url,
		function(err,res,body) {
			console.log(body);
		}
		);
}