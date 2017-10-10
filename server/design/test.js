{
  _id: "_design/test",
  _rev: "38-92403fb818450e17c6b0f9dc96eb9a62",
  updates: {
    "delete-single": function(doc,req) {
		return [null,JSON.stringify({message:'Image was deleted'})];
	}
  },
  language: "javascript"
}
