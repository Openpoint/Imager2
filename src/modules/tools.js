var tools=function(){};

tools.prototype.hash = function(str){
	var hash = 0;
	if (str.length === 0) return hash;
	for (var i = 0; i < str.length; i++) {
		var char = str.charCodeAt(i);
		hash = ((hash<<5)-hash)+char;
		hash = hash & hash; // Convert to 32bit integer
	}
	return hash;
}
tools.prototype.sort = function(array,field,dir){
	return array.sort(function(a,b){
		if(a[field] < b[field]) return dir==='desc'?1:-1;
		if(a[field] > b[field]) return dir==='desc'?-1:1;
		return 0;
	})
}
tools.prototype.imageSort = function(images,context){
	if(!images) return [];
	var index = {};
	//remove duplicate images
	images = images.map(function(img,i){
		if(!index[img.index]){
			index[img.index]=true;
			return img;
		}else{
			console.error('dupe:' +i);
			img.index = img.index*10+i
			return img;
		}
	})
	//return images for front page
	if(context === 'front') return images;
	//group images by size for back page
	//images = this.sort(images,'size','desc');
	var types = {big:[],small:[]}
	images.forEach(function(image){
		if(image.width > 450 && image.height > 450){
			image.class='big';
			types.big.push(image);
		}else{
			image.class='small';
			types.small.push(image);
		}
	})
	types.big = this.sort(types.big,'date','desc');
	types.small = this.sort(types.small,'date','desc');
	return types.big.concat(types.small);
}

tools.prototype.decode = function(encoded){
	if(!encoded || typeof encoded!=='string') return false;
	var decoded = document.createElement('textarea');
	decoded.innerHTML = encoded;
	var dec = decoded.value;
	decoded = null;
	return dec;
}
/*
tools.prototype.getFunctions = function(f){
	var functions = {}
	Object.keys(f).forEach((key)=>{
		if(f.hasOwnProperty(key) && typeof f[key]==='function'){
			functions[key] = f[key];
		}
	})
	return functions;
}
*/
tools.prototype.querystring = function(req,params){
	if(params && typeof params === 'object'){
		Object.keys(params).forEach(function(key,i){
			i===0?req+='?'+key+'='+params[key]:req+='&'+key+'='+params[key]
		})
	}
	return req;
}
tools.prototype.getDataUri = function(url) {
	url = 'https://www.google.ie/searchbyimage?image_url='+encodeURIComponent(url);
	var win = window.open(url, '_blank');
  	win.focus();
}
tools.prototype.sitename = function(url){
	url = url.replace(':/','').split('/');
	url = url[1];
	if(url.split('.')[0].indexOf('www') === 0) url = url.replace('www.','')
	return(url);
}

tools.prototype.getClass = function(image){
	var w;
	if(image.class === 'small'){
		w = 5;
	}else if(image.class==='big'){
		w=10;
	}else{
		w=8;
	}
	return w;
}
tools.prototype.filetype = function(file){
	file=file.split('?')[0].split('.');
	file = file[file.length-1];
	return file.toLowerCase();
}

//cancel pending promises (make sure the promise has been created with bluebird, not native Promise)
tools.prototype.cancel = function(p){
	Object.keys(p).forEach(function(key){
		if(p.hasOwnProperty(key)) p[key].cancel();
	})
}

//hack to save page data to API before page closes
tools.prototype.sleep = function(milliseconds) {
	var start = new Date().getTime();
	for (var i = 0; i < 1e7; i++) {
		if ((new Date().getTime() - start) > milliseconds){
			break;
		}
	}
}
module.exports = new tools();
