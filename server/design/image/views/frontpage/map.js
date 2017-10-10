function (doc) {
	var biggest = 0;
	var image;

	var images = doc.images.some(function(img){

		if(!img.deleted && img.front){
			image = img;
			return true;
		}
		if(img.size > biggest && !img.deleted){
			image = img;
			biggest = img.size;
		}
	});
	if(image){
		var returned = {
			parent:doc._id,
			parenturl:doc.link,
			info:doc.title+' | '+doc.description,
			favicon:doc.favicon
		};
		Object.keys(image).forEach(function(key){
			if(image.hasOwnProperty(key)) returned[key] = image[key];
		})
		emit(doc.date,returned);
	}
}
