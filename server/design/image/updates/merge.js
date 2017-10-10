function(doc,req) {
	var input = JSON.parse(req.body);
	var images = input.images;
	images.forEach(function(img){
		if(!doc.images.some(function(i){
			return i.index === img.index
		})) doc.images.unshift(img);
	})
	doc.description = input.description;
	doc.title = input.title;
	doc.favicon = input.favicon;
	return [doc,JSON.stringify(doc)];
}
