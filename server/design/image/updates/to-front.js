function(doc,req) {
	if(!req.query.imageid||!doc.images) return [null,JSON.stringify({message:'No image id identified'})];
	doc.images = doc.images.map(function(img){
		if(img.index.toString() === req.query.imageid.toString()){
			img.front = true;
		}else{
			img.front = false;
		}
		return img;
	})
	return [doc,JSON.stringify({message:'Image set to front'})];
}
