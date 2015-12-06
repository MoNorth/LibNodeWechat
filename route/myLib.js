/**
 * 第一个按钮
 */
var mongodb = require("../mongodb/mongodb");
var wechat = require("wechat-node");

var login = function(req,res) {
	
}

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

	}
	else
		res.sendText("输入错误");
}



var my_book = function(req,res,result) {
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
			res.sendText("以注册");
	});
}




module.exports = my_book;