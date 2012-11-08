//since the design app isn't returned, this filter will work for "display all"
function(doc) {
  if(doc._id.substring(0, 5) === "char:")
  {
	  emit(doc._id, doc);
  }
}