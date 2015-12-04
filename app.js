/**
 * xiyouLib wechat 
 * Create by MoNorth
 */


var express = require("express");
var app = express();
var wechat_node = require("wechat-node");
var wechat = new wechat_node(app,"wx2d99e56a3326b348","d4624c36b6795d1d99dcf0547af5443d","northk");


//设置菜单
//
//
wechat.use("setMune",function(ok,result) {
	console.log(result);
});




//监听

// app.listen(8080);