var fs = require("fs");
var path = require("path");
var request = require("request");
var htmlsrc = path.join(__dirname , "bookinfo.html");
var html = fs.readFileSync(htmlsrc,"utf-8");
function bookinfo (req,res,next) {
	var id = req.query.id;
	var url = "http://api.xiyoumobile.com/xiyoulibv2/book/detail/id/" + id;
	request(
		{
			url : url,
            method: 'GET',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
		},
		function(err,re,body) {
			body = JSON.parse(body);
			if(body.Result && re.statusCode === 200)
			{
				res.send(makehtml(body.Detail));
			}
			else
			{
				res.send(body);
			}
		});

}


var makehtml = function(Detail) {
	
   return html.replace("%img%",Detail["DoubanInfo"] 
						? ( Detail["DoubanInfo"]["Images"]
							? Detail["DoubanInfo"]["Images"]["large"]
							|| Detail["DoubanInfo"]["Images"]["medium"]
							|| Detail["DoubanInfo"]["Images"]["small"]
							: "https://gss0.bdstatic.com/5eR1dDebRNRTm2_p8IuM_a/res/img/logo/logo201509091.png")
						: "https://gss0.bdstatic.com/5eR1dDebRNRTm2_p8IuM_a/res/img/logo/logo201509091.png"
				).replace("%Title%",Detail["Tilte"])
				 .replace("%Author%",Detail["Author"])
				 .replace("%Pub%",Detail["Pub"]);

}


module.exports = bookinfo;