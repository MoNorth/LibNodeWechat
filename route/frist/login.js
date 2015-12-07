/**
 * 做登录及缓存
 */
var request = require("request");
var logincache = {};

var login = function(obj,callback) {
		if(obj.name in logincache)
		{
			if(logincache[obj.name].time > Math.floor((new Date()).getTime()/1000))
			{
				callback(true,logincache[obj.name].session);
				return;
			}

		}
		var url = "http://api.xiyoumobile.com/xiyoulibv2/user/login";
		request(
		{
			url : url,
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            form : {"username" : obj.uid,
            		"password" : obj.psw}
		},
		function(err,re,body) {
			if(err)
			{
				callback(false,err);
				return;
			}
			if(!body)
			{
				callback(false,"server error");
				return;
			}
			body = JSON.parse(body);
			if(re.statusCode === 200 && body.Result)
			{
				logincache[obj.name] = {
					session : body.Detail,
					time : Math.floor((new Date()).getTime()/1000) + 2 * 60 * 60};
				callback(true,body.Detail);
				clearCache();
			}
			else
				callback(false,"server error");
		});
}


var clearCache = function() {
	for(var i in logincache)
	{
		if(logincache[i].time < Math.floor((new Date()).getTime()/1000))
			delete logincache[i];

	}
}


exports.login = login;
