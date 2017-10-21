import 'whatwg-fetch';
import tools from './tools.js';
import Promise from "bluebird";

Promise.config({cancellation:true});


function scraper(url,port){
	if(!url) url='http://localhost';
	this.url = url+':'+port+'/scrape?url=';
}
scraper.prototype.getpage = function(query){
	if(query.indexOf('http')!==0) query = 'http://'+query;
	if(query.indexOf('.')===-1){
		query = false;
	}else{
		var q = query.split('://');
		q.shift();
		var id = tools.hash(q.join(''));
	}
	return {query:query,id:id};
}
scraper.prototype.scrape = function(query,id){
	var self = this;
	return new Promise(function(resolve,reject){
		if(!query){
			reject('not a valid url');
			return;
		}
		var req = self.url+encodeURIComponent(query);
		fetch(req).then(function(response){
			return response.json();
		}).then(function(json){
			json.id = id;
			json.link = query;
			var images = [];
			var index = [];
			json.images.forEach(function(i){
				i.index = tools.hash(i.src);
				if(index.indexOf(i.index) === -1){
					index.push(i.index);
					images.push(i);
				}
			})
			json.images = images;
			resolve(json)
		})
	})
}

export default scraper;
