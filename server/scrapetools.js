window.imager_tools = function(){
	var i$;
	var self = this;
	this.isImage = function(href){
		if(!href) return false;
		var ext = href.split('?')[0];
		ext = ext.split('.');
		ext=ext.pop();
		if(ext && ['jpg','jpeg','png','gif'].indexOf(ext.toLowerCase()) > -1){
			return href;
		}else{
			return false;
		}
	},
	this.fix = function(href){
		if(href.indexOf('data:image')===0) return href;
		if(href.indexOf('http')!==0){
			if(href.indexOf('//')===0){
				href = href.replace('//','');
				href = 'http://'+href;
			}else{
				href = window.location.href+href
			}
		}
		if(this.isImage(href)) href = href.split('?')[0];
		return href;
	},
	this.scroll = function(wh,dir,oh,resolve,count){

		var h;
		var scroll;
		var to = 1000;
		switch(dir){
			case 'y':
				oh = i$(document).outerHeight();
				h = i$(window).scrollTop()+wh

			break;
			case 'x':
				oh = i$(document).outerWidth();
				h = i$(window).scrollLeft()+wh
			break
		}

		if(!resolve){
			var init = true;
			//to = 1000;
			count = 0;
			var p = new Promise(function(res,reject){
				resolve = res;
			});
		}else{
			count++
		}
		console.log(count,dir,oh,h)
		if((h >= oh || count > 30) && !init){
			resolve(true);
			return;
		}
		/*
		//if(h <= wh||h===oh||count > 10){
		if(h <= wh||h===oh){
			if(init){
				to = 1000;
			}else{
				resolve(true);
				return;
			}
		}
		*/
		//dir==='y'?i$(window).scrollTop(h-wh):i$(window).scrollLeft(h-wh);
		dir==='y'?i$(window).scrollTop(i$(window).scrollTop()+900):i$(window).scrollLeft(i$(window).scrollLeft()+900);

		setTimeout(function(){
			//console.log('awake:'+i$('.awake').length+' view:'+i$('.view').length)
			self.scroll(wh,dir,h,resolve,count)
		},to)
		if(init) return p;
	},
	this.scrape = function(site){
		this.site = site;
		i$ = window.jQuery;
		var self = this;
		console.log("scraping")
		this.title = i$('title').html();
		this.description = i$('meta[name=description]').attr("content");
		if(document.readyState === 'complete'){
			if(!self.launched) go();
		}else{
			i$(window).on('load',function(){
				if(!self.launched) go();
			})
			self.gto = setTimeout(function(){
				if(!self.launched) go()
			},3000)
		}

		function go(){
			console.log('gooooooooooooooooooo!')
			clearTimeout(self.gto);
			self.launched = true;
			var wh = i$(window).height();
			var ww = i$(window).width();
			var count = 0;
			self.scroll(wh,'y').then(function(){
				console.log('at the bottom');
				count++;
				if(count === 2) self.ready();
			});
			self.scroll(ww,'x').then(function(){
				console.log('at the right');
				count++;
				if(count === 2) self.ready();
			});
		}
		return true;
	},
	this.mod = function(src){
		if(!src) return false;
		if(src.indexOf('url(')===0){
			src = src.slice(0, -1).replace('url(','').trim();
		}
		if(this.site==='flickr'){
			if(src.indexOf('/sprites/') > -1) return false;
			src = src.split('?');
			src[0] = src[0].split('/');
			src[0][src[0].length-1] = src[0][src[0].length-1].split('.')
			var f = src[0][src[0].length-1][0];
			var end = f.slice(-2);
			if(end.indexOf('_')===0) src[0][src[0].length-1][0] = f.replace(end,'_b');
			src[0][src[0].length-1] = src[0][src[0].length-1].join('.')
			src[0] = src[0].join('/');
			src = src.join('?');
		}
		if(this.site==='google'){
			if(src.indexOf('gstatic.com')!==-1) return false;
			if(src.indexOf('imgurl=')!==-1){
				src=src.split('imgurl=')[1].split('&')[0];
				src = decodeURIComponent(src);
			}
		}
		if(this.site==='imgur'){
			//src=src.split('.');
			//src[src.length-2] = src[src.length-2].slice(0.-1);
			//src = src.join('.');
			//console.log(src)
		}
		src = self.fix(src);
		return src;
	},
	this.search = function(i,foo){
		if(i.css('background-image').indexOf('url(') === 0){
			var src = i.css('background-image');
			src = this.mod(src);
			if(src) this.foo.push({src:src})
		}
		if(i.attr('href')){
			src = this.mod(i.attr('href'));
			src = self.isImage(src);
			if(src) this.foo.push({src:src});
		}
	},
	this.ready = function(){
		try{
			this.foo = [];
			var self = this;
			if(this.site === 'google'){
				i$('.rg_meta').each(function(){
					var data = i$(this).html();
					try {
						data = JSON.parse(data);
						if(data.ou){
							self.foo.push({
								src:data.ou,
								alt:data.pt||'',
								url:data.ru||null,
								urltitle:data.st||null
							})
						}
					}
					catch(err){
						console.error(err);
					}
				})
			}
			if(!this.foo.length){
				i$('img,object').each(function(){
					this.src = self.mod(this.src)
					if(this.src) self.foo.push({src:this.src,alt:this.alt});
				});

				i$('div,a,span,body,li,main,td,table,tr,th').each(function(){
					self.search(i$(this));
				})
			}

			var favicon;
			var favicon2;
			i$('head link').each(function(){
				var rel = i$(this).attr('rel');
				if(rel) rel = rel.toLowerCase();
				if(rel && (rel === 'shortcut' || rel === 'icon')) favicon2 = i$(this).attr('href');
				//if(rel && (rel.indexOf('shortcut')!==-1 || rel.indexOf('icon')!==-1)) icons2.unshift(i$(this).attr('href'));
				if(rel && rel.indexOf('shortcut')!==-1 && rel.replace('icon','').replace('shortcut','').trim().length === 0){
					favicon = i$(this).attr('href');
				}
			})
			var frames = [];
			/*
			i$('iframe').each(function(){
				var src = i$(this).attr('src');
				if(src) frames.push(src);
			})
			*/
			if(!favicon && favicon2) favicon = favicon2;
			var result =  {frames:frames,images:this.foo,title:this.title,description:this.description,favicon:favicon};
			if (typeof window.callPhantom === 'function') {
				window.callPhantom(result);
			}else{
				console.error('window.callPhantom() failed');
			}
		}
		catch(err){
			return {error:err}
		}
	}
};
window.imager_tools = new window.imager_tools();
