import 'whatwg-fetch';
import tools from './tools.js';

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
			resolve({process:process,json:json})
		})
	})
}
export default scraper;

function process(json){
	var self = this;
	return new Promise(function(resolve,reject){
		if(json.error){
			reject(json.error);
			return;
		}
		var len = json.images.length;
		self.setState({scrapemessage:'Checking '+len+' images...'})
		var images = [];
		var count = 0;
		var index = [];
		json.images.forEach(function(i){
			var im = document.createElement("IMG");
			i.index = tools.hash(i.src);
			if(index.indexOf(i.index) === -1){
				index.push(i.index)
			}else{
				count ++;
				len --;
				self.setState({scrapemessage:'Checking '+len+' images...'});
				if(count === json.images.length){
					json.images = images;
					resolve(json);
				}
				console.log('dupe');
				return;
			}
			im.src = i.src;
			im.onload = function(){
				i.width = im.width;
				i.height = im.height;
				i.size = i.width*i.height;
				i.ratio = i.width/i.height
				if(i.size > 10000 && i.width > 150 && i.height > 100 && i.ratio < 3 && i.ratio > 0.33) images.push(i);
				im = null;
				count ++;
				len --;
				self.setState({scrapemessage:'Checking '+len+' images...'});
				if(count === json.images.length){
					json.images = images;
					resolve(json);
				}
			}
			im.onerror = function(err){
				im = null;
				count ++;
				len --;
				self.setState({scrapemessage:'Checking '+len+' images...'});
				if(count === json.images.length){
					json.images = images;
					resolve(json);
				}
			}
		})
	})
}
