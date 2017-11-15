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
		}else if(context === 'front'){
			img.index = img.index*10+i
			return img;
		}
		img.deleted = true;
		return img;
	})
	images = images.filter(function(im){
		return !im.deleted;
	})
	//return images for front page
	if(context === 'front') return images;
	//group images by size for back page
	//images = this.sort(images,'size','desc');
	var types = {big:[],small:[]}
	images.forEach(function(image){
		if(image.size > 250000){
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
	return file.toLowerCase().trim();
}
//get properties from image
tools.prototype.imageInfo = function(image){
	var blank = !image.src||image.src.split('/')[3] === 'blank.png';
	return{
		blank:blank,
		height:image.naturalHeight,
		width:image.naturalWidth,
		complete:!blank && image.complete && image.naturalHeight > 1
	}
}

//cancel pending promises (make sure the promise has been created with bluebird, not native Promise)
tools.prototype.cancel = function(p,type){
	Object.keys(p).forEach(function(key){
		if(p.hasOwnProperty(key)){
			type==='p'?p[key].cancel():clearTimeout(p[key])
			delete p[key];
		}
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
//calculate the range of images to keep in memory
tools.prototype.getrange = function(active,rangesize){
	active.sort(function(a,b){
		return a.index-b.index;
	});
	var b = active[0].index;
	var t = active[active.length-1].index;
	var r = Math.round((rangesize - active.length)/2);
	if(b-r < 0){
		r = r+((b-r)*-1);
		b = 0;
	}else{
		b = b-r;
	}
	return {
		bottom:b,
		top:t+r
	}
}
//apply fullscreen to id
tools.prototype.fullscreen = function(id){
	if (
		document.fullscreenEnabled ||
		document.webkitFullscreenEnabled ||
		document.mozFullScreenEnabled ||
		document.msFullscreenEnabled
	) {
		var i= document.getElementById(id)
		if (i.requestFullscreen) {
			i.requestFullscreen();
		} else if (i.webkitRequestFullscreen) {
			i.webkitRequestFullscreen();
		} else if (i.mozRequestFullScreen) {
			i.mozRequestFullScreen();
		} else if (i.msRequestFullscreen) {
			i.msRequestFullscreen();
		}
	}
}
//exit fullscreen
tools.prototype.nofullscreen = function(){
	if (document.exitFullscreen) {
		document.exitFullscreen();
	} else if (document.webkitExitFullscreen) {
		document.webkitExitFullscreen();
	} else if (document.mozCancelFullScreen) {
		document.mozCancelFullScreen();
	} else if (document.msExitFullscreen) {
		document.msExitFullscreen();
	}
}
//check for fullscreen
tools.prototype.isfullscreen = function(){
	if (
		document.fullscreenElement ||
		document.webkitFullscreenElement ||
		document.mozFullScreenElement ||
		document.msFullscreenElement
	) {
		return true;
	}
	return false;
}
//get index from location
tools.prototype.getindex = function(location){
	var index = location.pathname.split('/');
	index = index[index.length-1];
	if(index.length){
		return index;
	}else{
		return false;
	}
}
//scroll to the top of the pages
tools.prototype.scrolltop = function(){
	if(this.st) clearInterval(this.st);
	if(!window.scrollY) return;
	var wall = document.getElementById('wall');
	wall.setAttribute('scrolling',true);
	var to =15
	var time = 1000/to;
	var step = Math.ceil(window.scrollY/time);
	if(step < 10) step = 10;
	var self = this;
	this.st = setInterval(function(){
		if(!window.scrollY){
			clearInterval(self.st);
			wall.removeAttribute('scrolling');
			return;
		}
		window.scrollTo(0,window.scrollY-step);
	},to)

}
tools.prototype.getURLParameter = function(name) {
	return decodeURIComponent((new RegExp("[?|&]" + name + "=([^&;]+?)(&|#|;|$)").exec(window.location.search) || [null, ''])[1].replace(/\+/g, '%20')) || null;
}
module.exports = new tools();
