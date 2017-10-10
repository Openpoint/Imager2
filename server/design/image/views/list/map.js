function (doc) {
	if(doc.type==='page') emit(doc.date,doc._id);
}
