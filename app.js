/**
 * xiyouLib wechat 
 * Create by MoNorth
 */


var express = require("express");
var app = express();
var wechat_node = require("wechat-node");
var wechat = new wechat_node(app,"wx2d99e56a3326b348","d4624c36b6795d1d99dcf0547af5443d","northk");
var myLib = require("./route/myLib");




app.set("view engine","ejs");

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
	// res.sendText("暂时不能自动回复");
	res.sendNews([
	{
		Title : "标题",
		Description : "第一行
		第二行,
		第三行
		第四航"
	}

		]);
});







wechat.reclick({
	"ser_book":require("./route/search"),
	"my_book" : myLib.my_book,
	"fav_book": myLib.fav_book,
	"history_book" : myLib.history_book
},"");


//监听

app.listen(8080);



app.get("/book",require("./route/bookinfo"));



