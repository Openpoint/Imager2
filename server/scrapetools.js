window.imager_tools = function(){
	var i$;
	var self = this;

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
			//to = 5000;
			count = 0;
			var p = new Promise(function(res,reject){
				resolve = res;
			});
		}else{
			count++
		}
		//console.log(count,dir,oh,h)
		if((h >= oh || count > 30) && !init){
			resolve(true);
			return;
		}
		dir==='y'?i$(window).scrollTop(i$(window).scrollTop()+900):i$(window).scrollLeft(i$(window).scrollLeft()+900);

		setTimeout(function(){
			self.scroll(wh,dir,h,resolve,count)
		},to)
		if(init) return p;
	},
	this.scrape = function(site){
		this.site = site;
		i$ = window.jQuery;
		var self = this;
		this.title = i$('title').html();
		this.description = i$('meta[name=description]').attr("content");
		go();
		function go(){
			clearTimeout(self.gto);
			self.launched = true;
			var wh = i$(window).height();
			var ww = i$(window).width();
			if(self.site==='wikipedia'){
				self.ready();
				return;
			}
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
	this.isImage = function(href){
		if(!href) return false;
		var ext = href.split('?')[0];
		ext = ext.split('.');
		ext=ext.pop();
		if(ext && ['jpg','jpeg','png','gif','bmp'].indexOf(ext.toLowerCase()) > -1){
			return href;
		}else{
			return false;
		}
	},
	this.fix = function(href){
		if(href.indexOf('data:image/svg') === 0) return false;
		if(href.indexOf('data:image') === 0) return href;
		if(href.indexOf('http')!==0){
			if(href.indexOf('//')===0){
				href = href.replace('//','');
				href = 'http://'+href;
			}else{
				href = window.location.href+href
			}
		}
		href = href.split('?')[0];
		if(this.isImage(href)) return href;
		return false;

	},
	this.mod = function(src){
		if(!src) return false;
		if(src.indexOf('url(')===0){
			src = src.slice(0, -1).replace('url(','').trim();
		}
		src = self.fix(src);
		if(!src) return false;
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
		if(this.site==='magnumphotos'){
			if(src.indexOf('//content.magnumphotos')!==-1) src = src.replace('//content.magnumphotos','//www.magnumphotos');
			var file = src.split('/');
			file = file[file.length-1].split('.')[0];
			file = file.split('-');
			if(file.length > 1){
				file.shift();
				file = '-'+file.join('-');
				src = src.replace(file,'');
			}
		}
		if(this.site==='beetlesandhuxley'){
			src = src.replace('imagecache/stock-image-medium/','')
			src = src.replace('imagecache/stock-image-small/','')
			src = src.replace('imagecache/stock-image-large/','')
		}
		if(src.indexOf('wikimedia.org/')!==-1 && src.indexOf('px-')!==-1 && src.indexOf('thumb/')!==-1){
			var file = src.split('/');
			file.pop();
			src = file.join('/');
			src = src.replace('thumb/','');
		}

		return src;
	},
	this.search = function(i){
		if(i.css('background-image').indexOf('url(') === 0){
			var src = i.css('background-image');
			src = this.mod(src);
			var alt,url,urltitle;
			if(self.site==='flickr'){
				urltitle = i$('.interaction-bar',i).attr('title');
				url = 'https://flickr.com'+i$('.overlay',i).attr('href');
				alt = i$('.title',i).text();
			}
			if(src) this.foo.push({src:src,alt:alt,url:url,urltitle:urltitle});
		}
		if(i.attr('href')){
			src = this.mod(i.attr('href'));
			//src = self.isImage(src);
			if(src) this.foo.push({src:src});
		}

		if(i.attr('data-src')){
			src = this.mod(i.attr('data-src'));
			if(src) this.foo.push({src:src});
		}
	},
	this.ready = function(){
		console.log('Scraping')
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
								urltitle:data.st||null,
								width:data.ow,
								height:data.oh
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
					var src = self.mod(this.src);
					if(!src) src = self.mod(this.getAttribute('data-src'));
					if(self.site==='magnumphotos'){
						var container = i$(this).closest('a');
						var onpage;

						if(container.hasClass('js-overlay-open')||container.hasClass('image-player-link')||!container.attr('class')||container.attr('class')==='image'){
							if(container.attr('class') && container.attr('class')!=='image') onpage = true;
							container = container.parent();
						}

						var alt = i$('.b-caption__text,.data,h4 a',container).contents();
						var a='';
						var b = '';
						alt.each(function(i){
							var snippet = i$(this).text().trim();
							if(this.nodeType === 3 && snippet){
								a = a+snippet;
								if(i < alt.length-1) a=a+' '
							};
							if(snippet){
								b = b+snippet;
								if(i < alt.length-1) b=b+' | ';
							}

						});

						a = a.trim();
						b = b.trim();
						if(b.slice(-1)==='|') b = b.slice(0, -1).trim();
						//b = b.trim().replace(/\|\|/g,'|');
						//b = b.replace(/\|\ \|/g,'|')
						this.alt = a?a:b;
						if(!onpage){
							this.url = container.attr('href');
							this.urltitle = b;
						}

					}
					if(self.site==='wikipedia'){
						var url = i$(this).parent().attr('href');
						if(url && url.indexOf('/wiki/')===0){
							this.url="https://en.wikipedia.org"+url;
							this.urltitle = "Image on wikipedia"
						}

						var info = i$('.searchresult,.thumbcaption',i$(this).parent().parent().parent());
						if(info){
							var alt = i$(info[0]).contents().text();
							if(alt.indexOf('English:') > 0) alt = alt.split('English:')[1];
							alt = alt.trim();
							if(alt.indexOf('Description:')!==-1) alt=alt.replace('Description:','');
							if(alt.indexOf('Description')===0) alt=alt.replace('Description','');
							if(!this.alt && alt) this.alt = alt;
						}
					}
					if(src) self.foo.push({src:src,alt:this.alt,url:this.url,urltitle:this.urltitle});
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
