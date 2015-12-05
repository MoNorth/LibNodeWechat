
var request = require("request");

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
				res.render("bookDetail",makehtml(body.Detail));
			}
			else
			{
				res.render("error");
			}
		});

}


var makehtml = function(Detail) {
	var obj = {
		title:"",
		pub : "",
		author : "",
		subject : "",
		img : "https://gss0.bdstatic.com/5eR1dDebRNRTm2_p8IuM_a/res/img/logo/logo201509091.png"

	};
	if(Detail.Title)
		obj.title = Detail.Title;
	if(Detail.Pub)
		obj.pub = Detail.Pub;
	if(Detail.Author)
		obj.author = Detail.Author;
	if(Detail.Subject)
		obj.subject = Detail.Subject;
	if(Detail.DoubanInfo && Detail.DoubanInfo.Images)
	{
		obj.img = Detail.DoubanInfo.Images.large || 
				  Detail.DoubanInfo.Images.medium || 
				  Detail.DoubanInfo.Images.small;

	}
	return obj;
}


module.exports = bookinfo;