"use strict";
const request = require('request');
const tools = require('../src/modules/tools.js');
const fs = require('fs');

if(!fs.existsSync('./server/settings.json')){
	fs.copyFileSync('./server/settings.install.json','./server/settings.json');
}

var settings = require('./settings.json');
const design = require('./compile.js');
var jwt = require('jsonwebtoken');
const supersecret = 'supersecret';

//create the database connection strings;
var couch,host,protocol;
function makeCouch(){
	var i = settings.install;
	var u = settings.user;
	protocol = i.protocol+'://';
	host = i.host+':'+i.couchport+'/';
	couch = protocol+u.username+':'+u.password+'@'+host+i.dbname+'/';
	//var host = i.protocol+'://'+u.username+':'+u.password+'@'+i.host+':'+i.couchport+'/';
	//couch = host+i.dbname+'/';
}

var crud = function(app){
	if(!settings.install.installed){
		const install = require('../server/install.js');
		install(app,settings).then(function(nsettings){
			settings = nsettings;
			makeCouch();
		})
	}else{
		makeCouch();
		if(process.argv[2]==='development') design('image',couch)
	}
	app.get("*",function(req,res,next){
		if(settings.install.installed){
			next();
			return;
		}
		res.send(settings);
	})

	app.get('/:action/*',function(req,res,next){
		var url = couch+req.params.action+'/'+req.params[0];
		url = tools.querystring(url,req.query);
		request.get({
			url:url,
			json:true,
		},function(err,resp,body){
			res.send(body)
		})
	})

	app.get('/:action',function(req,res,next){
		switch(req.params.action){
			case 'scrape':
				next();
			break;
			case 'login':
				var username = req.query.username;
				var req = protocol+req.query.username+':'+req.query.password+'@'+host+settings.install.dbname;
				console.log(req);
				request.get({
					url:req,
					json:true,
				},function(err,resp,body){
					console.log(body);
					if(!err && !body.error && body.db_name){
						var token = jwt.sign({username:username},supersecret,{expiresIn:'1d'});
						res.send({auth:true,token:token})
					}else{
						res.send({auth:false})
					}
				})
			break;
			case 'verify':
				res.send({auth:auth(req.query.token)});
			break;
		}

	})

	app.put('/:id',function(req,res,next){
		request.get({
			//first check if the page already exists
			url:couch+req.params.id,
			json:true,
		},function(err,resp,body){
			if(body._rev){
				//Update the page
				request.put({
					url:couch+'_design/image/_update/merge/'+req.params.id,
					body:req.body,
					json:true,
				},function(err,resp,body){
					res.send(body)
				})
			}else{
				//Save the page
				req.body.date = Date.now();
				req.body.type = 'page';
				request.put({
					url:couch+req.params.id,
					body:req.body,
					json:true,
				},function(err,resp,body){
					res.send(req.body)
				})
			}
			console.log(err);
		})
	})

	app.put('/_design/:doc/_update/:type/:id',function(req,res,next){
		var url = couch+'_design/'+req.params.doc+'/_update/'+req.params.type+'/'+req.params.id;
		if(req.query){
			var isAuth = auth(req.query.token);
			if(isAuth!=='true'){
				res.send({auth:isAuth})
				return;
			}
			delete req.query.token;
			Object.keys(req.query).forEach(function(key,i){
				var op;
				(i===0)?op='?':op='&';
				url+=(op+key+'='+req.query[key])
			})
			request.put({
				url:url,
				json:true,
			},function(err,resp,body){
				res.send({auth:isAuth})
			})
		}else{
			res.send({auth:'no token'})
		}
	})
	app.delete('/:id',function(req,res,next){
		if(req.query){
			var isAuth = auth(req.query.token);
			if(isAuth!=='true'){
				res.send({auth:isAuth})
				return;
			}
			delete req.query.token;
			request.get({
				url:couch+req.params.id,
				json:true,
			},function(err,resp,body){
				var url = couch+req.params.id+'?rev='+body._rev;
				request.delete({
					url:url,
				},function(err,resp,body){
					res.send({auth:isAuth})
				})
			})

		}else{
			res.send({auth:'no token'})
		}
	})
}

//check if a auth token is valid
function auth(token){
	if(token === 'undefined') return 'no token given';
	return jwt.verify(token, supersecret, function(err, decoded){
		if(!err){
			return 'true';
		}else{
			return err.message;
		}
	})
}

module.exports = crud;
