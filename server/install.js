"use strict"

const request = require('request');
const fs = require('fs');
const design = require('./compile.js')
var auth = require('./auth.js');

var couch;
var host;
var settings;
var version = require('../package.json').version;

module.exports =  function(app,set){
	settings = set;
	settings.version = version;
	return new Promise(function(resolve,reject){
		app.post('/:action',function(req,res,next){
			switch(req.params.action){
				case 'install':
					settings.install = req.body;
					checkinstall().then(function(data){
						if(data.version||data.ok){
							res.send(data)
							auth = new auth(couch,host,settings.install);
							return;
						}
						if(data.installed){
							data = save(data);
							resolve(data);
							res.send({installed:true})
							return;
						}
						res.send(data)
					});
					return;
				break;
				case 'adminuser':
					delete req.body.pass2;
					settings.user = req.body;
					auth.getUser(settings.user.username).then(function(user){
						if(user.error){
							settings.user.roles = ['imageradmin'];
							auth.makeUser(settings.user).then(function(data){
								console.log('makeuser');
								if(data.ok){
									ok(data);
								}
							})
							return;
						}
						auth.checkUser(settings.user.username,settings.user.password).then(function(user){
							console.log('checkuser')
							if(user.error||(user.email && user.email!==settings.user.email)){
								res.send({error:true,reason:'User already exists, but the password or email is incorrect'});
							}else{
								if(user.roles.indexOf('imageradmin') === -1) user.roles.push('imageradmin');
								if(user.roles.indexOf('imager') === -1) user.roles.push('imager');
								user.email = settings.user.email;
								auth.updateUser(user).then(function(data){
									console.log('updateuser');
									if(data.ok) {
										ok(data);
									}
								});
							}
						});

					})
					function ok(data){
						console.log('OK');
						settings.user={
							username:settings.user.username,
							password:settings.user.password,
							email:settings.user.email
						}
						settings.install.installed = true;
						delete settings.install.dbadmin;
						delete settings.install.dbpass;
						resolve(settings);
						save(settings);
						res.send(data);
					}
					return;
				break;
				next();
			}
		})
	})
}

//check if the couchDB is installed
function checkinstall(){
	var i = settings.install;
	host = i.protocol+'://'+i.dbadmin+':'+i.dbpass+'@'+i.host+':'+i.couchport+'/';
	couch = host+i.dbname+'/';
	return new Promise(function(resolve,reject){
		request.get({url:host,json:true},function(err,res,body){
			if(!err){
				if(body.couchdb){
					request.get({url:couch,json:true},function(err,res,body){
						if(body.db_name){
							request.get({url:couch+'$Imager',json:true},function(err,res,body){
								resolve(body);
							})
							return;
						}
						makedb().then(function(data){
							resolve(data);
						})
					})
					return;
				}
				resolve(body);
			}else{
				resolve(err);
			}
		})
	})

}

function makedb(){
	return new Promise(function(resolve,reject){
		request.put({url:couch,json:true},function(err,res,body){
			if(body.ok){
				design('image',couch).then(function(data){
					if(!data.ok){
						resolve(data);
						return;
					}
					request.put({
						url:couch+'$Imager',
						json:true,
						body:{
							version:settings.version
						}
					},function(err,res,body){
						if(body.ok){
							request.put({
								url:couch+'_security',
								json:true,
								body:usersdoc
							},function(err,res,body){
								resolve(body);
							})
							return;
						}
						resolve(body);
					})
				})
				return;
			}
			resolve(body);
		})
	})
}


//save the settings to file
var save = function(data){
	data = JSON.stringify(data,null,'\t');
	fs.writeFileSync('./server/settings.json',data)
}
var usersdoc = {
    admins: {
        names: [],
        roles: ['imageradmin']
    },
    members: {
        names: [],
        roles: ['imager']
    }
}
