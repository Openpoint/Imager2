"use strict"

const request = require('request');

var auth = function(couch,host,i){
	this.couch = couch;
	this.host = host;
	this.i = i;
}
auth.prototype.checkUser = function(user,pass){
	var i = this.i;
	var url = i.protocol+'://'+user+':'+pass+'@'+i.host+':'+i.couchport+'/_users/org.couchdb.user:'+user;
	console.log(url);
	return new Promise(function(resolve,reject){
		request.get({
			url:url,
			json:true,
		},function(err,resp,body){
			resolve(body);
		})
	})
}
auth.prototype.updateUser = function(user){

	var url = this.host+'_users/org.couchdb.user:'+user.name+'?rev='+user._rev;
	delete user._rev;
	delete user._id;
	console.log(url);
	return new Promise(function(resolve,reject){
		request.put({
			url:url,
			body:user,
			json:true
		},function(err,res,body){
			resolve(body);
		})
	})
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
		user.roles?user.roles.push('imager'):user.roles = ['imager'];
		request.put({
			url:url,
			json:true,
			body:{
				name:user.username,
				type:'user',
				roles:user.roles,
				email:user.email,
				password:user.password
			}
		},function(err,res,body){
			resolve(body);
		})
	})
}

module.exports = auth;
