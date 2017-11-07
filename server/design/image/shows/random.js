function(doc, req) {
	if(!doc) {
		return {body:JSON.stringify({error:'no doc'})}
	}else{
		var images = doc.images.filter(function(im){
			return im.size > 250000 && im.size < 4000000 && im.src && !im.deleted;
		})
		if(!images.length) return{body:JSON.stringify({error:'no images'})};
		var random = Math.floor((Math.random() * images.length));
		var image = images[random];
		if(!image.url) image.url = doc.link;
		if(!image.alt || !image.alt.length) image.alt = page.description;
		if(!image.alt || !image.alt.length) image.alt = page.title;
		return {body:JSON.stringify(image)}
	}
}
