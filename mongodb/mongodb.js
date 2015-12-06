var  mongodb = require('mongodb');
var  server  = new mongodb.Server('localhost', 10001, {auto_reconnect:true});
var  db = new mongodb.Db('demo1', server, {safe:true});






var select  = function(name,callback) {
	dbOpen(function(ok,db,coll) {
		if(!ok)
		{
			callback(false,db);
			return;
		}
		coll.find({name:name}).toArray(function(err,docs) {
			db.close();
			if(err)
			{
				callback(false,err);
				return;
			}
			if(docs.length === 0)
			{
				callback(false,404);
				return;
			}
			callback(true,docs[0]);


		})
	})
}


var insert = function(obj,callback) {
	dbOpen(function(ok,db,coll) {
		if(!ok)
		{
			callback(false,db);
			return;
		}
		coll.insert(obj,{safe:true},function(err,result) {
			db.close();
			if(err)
			{
				callback(false,err);
				return;
			}
			callback(true,result);
		})
	})
}


var dbOpen = function(callback) {
	db.open(function(err,db) {
		if(err)
		{
			callback(false,err);
			db.close();
			return;
		}
		db.collection("user",{safe:true},function(err,coll) {
			if(err)
			{
				callback(false,err);
				db.close();
				return;
			}
			callback(true,db,coll);
		})
	})
}


exports.select = select;
exports.insert = insert;








// db.open(function(err,db) {
// 	if(err)
// 	{
// 		console.log(err);
// 		return;
// 	}
// 	db.collection("test",{safe:true},function(err,collection) {
// 		if(err)
// 		{
// 			console.log(err);
// 			return;
// 		}
// 		collection.find({title:"接啊接啊就"}).toArray(function(err,docs) {
// 			db.close();
// 			console.log(docs);
			
// 		});
// 		// collection.fineOne(function(err,doc) {
// 		// 	console.log(doc);
// 		// 	db.close();
// 		// })

// 	})
// });

// var a = [];
// console.log(a.length);