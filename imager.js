"use strict"

const express = require('express');
const bodyParser = require('body-parser')
var cors = require('cors');
const app = express();
const child = require('child_process');
const detect = require('detect-port-alt');
const prompt = require('prompt');
const fs = require('fs');
const crypto = require('crypto');

var supersecret = crypto.randomBytes(20).toString('hex');
console.log(supersecret);

if(!fs.existsSync('./server/settings.json')){
	var settings = require('./server/settings.install.json');
	settings.supersecret = crypto.randomBytes(20).toString('hex');
	var data = JSON.stringify(settings,null,'\t');
	fs.writeFileSync('./server/settings.json',data)
	//fs.copyFileSync('./server/settings.install.json','./server/settings.json');
}

app.use(bodyParser.json({limit: '5mb'}));

if(process.argv[2]!=='development'){
	const path = require('path');
	var pub = __dirname + "/build/";
	/*
	app.get('/', function(req, res) {
		res.sendFile(path.join(pub + "index.html"));
	});
	*/
	app.use('/',express.static(pub));
	app.use('/page/*',express.static(pub));
}else{
	var corsOptions = {
	  origin: function(origin,callback){
		  //console.log(origin,homepage);
		  //(origin==='http://'+homepage||origin==='https://'+homepage||process.argv[2]==='development')?callback(null, true):callback('Not allowed by CORS');
		  callback(null, true);
	  },
	  credentials:true
	}
	app.use(cors(corsOptions));
}

new require('./server/crud.js')(app);
new require('./server/scraper.js')(app);

var Port = function(port){
	return new Promise(function(resolve,reject){
		var d = function(p){
			detect(p, (err, _port) => {
				if (err){
					reject(err);
					return;
				}
				if (p == _port) {
					console.log(`port: ${p} was not occupied`);
					resolve(p);
				} else {
					console.log(`port: ${p} was occupied, try port: ${_port}`);
					d(_port);
				}
			});
		}
		d(port);
	})
}

Port(3000).then(function(port){
	if(process.argv[2]==='build') return child.fork('scripts/build.js',{env:{API_PORT:port}});
	process.env['SERVER_PORT'] = port;
	app.listen(port,function() {
		console.log('Imager API listening on port '+port+'!')
	})
	if(process.argv[2]==='development'){
		Port(3000).then(function(port2){
			const react = child.fork('scripts/start.js',['start'],{env:{PORT:port2,API_PORT:port}});
		},function(err){
			console.error(err)
		})
	}
	return;
},function(err){
	console.error(err)
});
