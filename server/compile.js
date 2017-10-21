"use strict"

const compile = require('couchdb-compile');
const request = require('request');

//create the couchDB design documents
function design(path,couch){
	return new Promise(function(resolve,reject){
		compile('server/design/'+path, function(error, doc) {
			if(error){
				console.log(error);
			}else{
				var id = doc['_id'];
				request.get({
					url:couch+id,
					json:true
				},function(err,resp,body){
					var url = couch+id;
					if(body['_rev']) url+='?rev='+body['_rev'];
					request.put({
						url:url,
						body:doc,
						json:true,
					},function(err,resp,body){
						if(err){
							resolve(err);
						}else{
							resolve(body);
						}
					})
				})
			}
		});
	})
}

module.exports = design;
