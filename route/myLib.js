/**
 * 第一个按钮
 */
var mongodb = require("../mongodb/mongodb");
var wechat = require("wechat-node");
var login = require("./frist/login");


var registered = function(req,res,result) {
	var content = result.content;
	var obj = content.split("&");
	if(obj.length === 2)
	{
		var obj2 = {
			name : result.fromusername,
			uid : obj[0],
			psw : obj[1]
		};
		login.login(obj2,function(ok,result) {
			if(!ok)
			{
				res.sendText("用户名或密码错误");
				console.log(result);
				return;
			}
			mongodb.insert(obj2,function(ok,result) {
				if(!ok)
				{
					res.sendText("server error");
					console.log(result);
				}
				else
				{
					res.sendText("注册成功");
					console.log(result);
				}
			})

		})
	}
	else
		res.sendText("输入错误");
}



var fristButClick = function(req,res,result,callback) {
	mongodb.select(result.fromusername,function(err,data) {
		if(!err)
		{
			if(data === 404)
			{
				res.sendText("请输入学号&密码.\n如 S04130000&123456");
				wechat.createSession(result,registered);
			}
			else
			{
				console.log(data);
				res.sendText("server error");
			}
		}
		else
		{
			callback(req,res,data);
		}
	});
}


var my_book = function(req,res,result) {
	fristButClick(req,res,result,function(req,res,data) {
		login.login(data,(require("./frist/getMybook"))(res));
	});
}
var fav_book = function(req,res,result) {
	fristButClick(req,res,result,function(req,res,data) {
		res.sendText("fav_book");
	});
}
var history_book = function(req,res,result) {
	fristButClick(req,res,result,function(req,res,data) {
		res.sendText("history_book");
	});
}







exports.my_book = my_book;
exports.fav_book = fav_book;
exports.history_book = history_book;