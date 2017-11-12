function (doc) {
	if(doc.type === 'page' && doc.images.length){
		doc.images.forEach(function(im){
			if(im.size > 250000 && im.size < 4000000 && im.src && !im.deleted){
				emit(doc.index,im.index);
			}
		})
	}
}
