var imager_tools = {
	isImage:function(href){
		var ext = href.split('.').pop();
		if(ext && ['jpg','jpeg','png','gif'].indexOf(ext.toLowerCase()) > -1){
			return true;
		}else{
			return false;
		}
	},
	fix:function(href){
		if(href.indexOf('http')!==0){
			if(href.indexOf('//')===0) href = href.replace('//','');
			href = 'http://'+href;
		}
		return href;
	},
	scrape:function(){
		try{
			var foo = [];
			var JQ = window.jQuery;
			JQ('img').each(function(){
				if(this.src) foo.push({src:this.src,alt:this.alt});
			});
			JQ('.efImageLink').each(function(){
				console.log('YES')
			})
			JQ('*').each(function(){
				if(JQ(this).css('background-image').indexOf('url(') === 0){
					foo.push({src:window.jQuery(this).css('background-image')})
				}
				if(JQ(this).attr('href') && imager_tools.isImage(window.jQuery(this).attr('href'))){
					foo.push({src:imager_tools.fix(JQ(this).attr('href'))});
				}
			})
			var favicon;
			var favicon2;
			JQ('head link').each(function(){
				var rel = JQ(this).attr('rel');
				if(rel) rel = rel.toLowerCase();
				if(rel && (rel === 'shortcut' || rel === 'icon')) favicon2 = JQ(this).attr('href');
				//if(rel && (rel.indexOf('shortcut')!==-1 || rel.indexOf('icon')!==-1)) icons2.unshift(JQ(this).attr('href'));
				if(rel && rel.indexOf('shortcut')!==-1 && rel.replace('icon','').replace('shortcut','').trim().length === 0){
					favicon = JQ(this).attr('href');
				}
			})
			var frames = [];
			JQ('iframe').each(function(){
				var src = JQ(this).attr('src');
				if(src) frames.push(src);
			})
			if(!favicon && favicon2) favicon = favicon2;
			return {frames:frames,images:foo,title:JQ('title').html(),description:JQ('meta[name=description]').attr("content"),favicon:favicon};
		}
		catch(err){
			return {error:err}
		}
	}
};
