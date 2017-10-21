"use strict"

const request = require('request');

var auth = function(couch,host){
	this.couch = couch;
	this.host = host;
}
auth.prototype.getUser = function(user){
	var self = this;
	return new Promise(function(resolve,reject){
		request.get({url:self.host+'_users/org.couchdb.user:'+user,json:true},function(err,res,body){
			resolve(body);
		})
	})
}
auth.prototype.makeUser = function(user){
	var self = this;
	return new Promise(function(resolve,reject){
		var url = self.host+'_users/org.couchdb.user:'+user.username;
		user.name = user.username;
		user.type = 'user';
		delete user.username;
		user.roles?user.roles.push('imager'):user.roles = ['imager'];
		if(user.rev){
			url+='?rev='+user.rev;
			delete user.rev;
		}
		console.log(url);
		request.put({
			url:url,
			json:true,
			body:user
		},function(err,res,body){
			resolve(body);
		})
	})
}

module.exports = auth;
