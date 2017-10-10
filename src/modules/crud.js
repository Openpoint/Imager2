import 'whatwg-fetch';
import Cookies from 'js-cookie';
import tools from './tools.js';

var crud = function(url,port){
	this.init=true;
	this.method = {
		headers:{
			'Accept':'application/json, text/plain',
    		'Content-Type': 'application/json; charset=utf-8',
		}
	};
	this.token = Cookies.get('token');
}
crud.prototype.set = function(url,port){
	if(!url) url='http://localhost';
	this.url = url+':'+port+'/';
}

crud.prototype.logout = function(){
	Cookies.remove('token');
	this.token = false;
	this.username = false;
	this.password = false;
}
crud.prototype.login = function(doc){
	this.method.method = 'GET';
	var req = this.url+'login';
	Object.keys(doc).forEach(function(key,index){
		var op;
		(index===0)?op='?':op='&';
		req+=op+key+'='+doc[key];
	})
	var self = this;
	return send(req,this.method).then(function(data){
		if(data.auth){
			self.token = data.token;
			Cookies.set('token',data.token);
			self.username = doc.username;
			self.password = doc.password;
		}
		return data;
	})
}
crud.prototype.create = function(id,body){

	this.method.body = JSON.stringify(body);
	this.method.method = "PUT";
	var req = this.url+id;
	var self = this;
	return send(req,this.method).then(function(data){
		delete self.method.body;
		return data;
	})

}
crud.prototype.read = function(query,doc,func,params){

	this.method.method = 'GET';
	var req = this.url+'_design/'+doc+'/_'+query+'/'+func;
	req = tools.querystring(req,params);
	return send(req,this.method).then(function(data){
		return data;
	})
}
crud.prototype.update = function(doc,type,id,params){
	var req = this.url+'_design/'+doc+'/_update/'+type+'/'+id;
	var op = '?'
	if(params){
		Object.keys(params).forEach(function(key,i){
			req+=(op+key+'='+params[key]);
			op = '&'
		})
	}
	var self = this;
	return new Promise(function(resolve,reject){
		var go = function(){
			self.method.method = 'PUT';
			var req2 = req+op+'token='+self.token;
			send(req2,self.method).then(function(data){
				return self.auth(data.auth).then(function(isauth){
					if(isauth === 'reauth'){
						go();
						return;
					}
					if(isauth){
						resolve({auth:true,data:data});
					}else{
						self.logout();
						resolve({auth:false});
					}
				})
			})
		}
		go();
	})
}
crud.prototype.delete = function(id){
	var self = this;
	return new Promise(function(resolve,reject){
		var go = function(){
			self.method.method = 'DELETE';
			var req = self.url+id+'?token='+self.token;
			send(req,self.method).then(function(data){
				return self.auth(data.auth).then(function(isauth){
					if(isauth === 'reauth'){
						go();
						return;
					}
					if(isauth){
						resolve({auth:true,data:data});
					}else{
						self.logout();
						resolve({auth:false});
					}
				})
			})
		}
		go();
	})
}
crud.prototype.checkToken = function(token){
	if(!token) token = this.token;
	this.method.method = 'GET';
	var req = this.url+'verify?token='+token;
	var self = this;
	return send(req,this.method).then(function(data){
		return self.auth(data.auth);
	})
}

crud.prototype.auth = function(data){
	var self = this;
	return new Promise(function(resolve,reject){

		if(data === 'true'){
			resolve(true);
		}else if(data === 'jwt expired'){
			if(self.username && self.password){
				self.login({username:self.username,password:self.password}).then(function(data){
					if(data.auth){
						resolve('reauth');
					}else{
						resolve(false);
					}
				})
			}else{
				resolve('expired');
			}
		}else{
			resolve(false);
		}
	})

}
function send(req,opt){
	return new Promise(function(resolve,reject){
		fetch(req,opt).then(function(response){
			var type = response.headers.get("content-type");
			if(type.indexOf('application/json')!==-1){
				return response.json();
			}else{
				return response.text();
			}
		}).then(function(json){
			resolve(json);
		})
	})
}
export default crud.init?crud:new crud();
