function(doc, req) {
	if(!doc) {
		return {body: "no doc"}
	}else{
		var sort = function(array,field,dir){
			return array.sort(function(a,b){
				if(a[field] < b[field]) return dir==='desc'?1:-1;
				if(a[field] > b[field]) return dir==='desc'?-1:1;
				return 0;
			})
		}
		var deleted;
		if(req.query) req.query.deleted==='false'?deleted = false:deleted = true;
		doc.images = doc.images.filter(function(img){
			if(!deleted) return !img.deleted;
			return img.deleted;
		})

		var types = {big:[],small:[]}
		doc.images.forEach(function(image){
			if(image.width > 450 && image.height > 450){
				image.class='big';
				types.big.push(image);
			}else{
				image.class='small';
				types.small.push(image);
			}
		})
		types.big = sort(types.big,'date','desc');
		types.small = sort(types.small,'date','desc');
		doc.images = types.big.concat(types.small);

		return {body:JSON.stringify(doc)}
	}
}
