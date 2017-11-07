"use strict"

const express = require('express');
const bodyParser = require('body-parser')
var cors = require('cors');
const app = express();
const child = require('child_process');
const detect = require('detect-port-alt');
const homepage = require('./package.json').installdomain;
if(!homepage){
	console.error("Please set the 'installdomain' value in 'package.json' at the root of your installation.");
	return;
}
var corsOptions = {
  origin: function(origin,callback){
	  //console.log(origin,homepage);
	  (origin==='http://'+homepage||origin==='https://'+homepage||process.argv[2]==='development')?callback(null, true):callback('Not allowed by CORS');
  },
  credentials:true
}
app.use(cors(corsOptions));
app.use(bodyParser.json({limit: '5mb'}));

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
	process.env['SERVER_PORT'] = port;
	if(process.argv[2]!=='build'){
		app.listen(port, function () {
			console.log('Imager API listening on port '+port+'!')
		})
	}
	if(process.argv[2]==='development'){
		Port(3000).then(function(port2){
			const react = child.fork('scripts/start.js',['start'],{env:{PORT:port2,API_PORT:port,_HOME:homepage}});
		},function(err){
			console.error(err)
		})
	}else if(process.argv[2]==='build'){
		const react = child.fork('scripts/build.js',{env:{API_PORT:port,_HOME:homepage}});
	}
},function(err){
	console.error(err)
});
