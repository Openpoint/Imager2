function(doc, req) {
	if(!doc) {
		return {body:JSON.stringify({error:'no doc'})}
	}else{
		var body = JSON.parse(req.body);
		var index = body.value;
		var image;
		doc.images.some(function(im){
			if(im.index === index){
				image = im;
				image.parent = doc.id;
				if(!image.url) image.url = doc.link;
				if(!image.alt || !image.alt.length) image.alt = doc.description;
				if(!image.alt || !image.alt.length) image.alt = doc.title;

				return true;
			}
			return false;
		})
		return {body:JSON.stringify(image)}
	}
}
