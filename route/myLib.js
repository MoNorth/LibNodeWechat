/**
 * 第一个按钮
 */
var mongodb = require("../mongodb/mongodb");

var login = function(req,res) {
	
}


var my_book = function(req,res,result) {
	mongodb.select(result.fromusername,function(err,data) {
		if(!err)
		{
			if(data === 404)
			{
				res.sendText("没有那个啥");
			}
			else
			{
				res.sendText("server error");
			}
		}
		else
			res.sendText("以注册");
	});
}




module.exports = my_book;