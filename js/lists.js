//This file contains ideas I am playing around with for the week 3 project.

//JSON sorting function
var sort_by = function(field, reverse, primer)
{

   var key = function (x) {return primer ? primer(x[field]) : x[field]};

   return function (a,b)
   {
       var A = key(a), B = key(b);
        return (A < B ? -1 : (A > B ? 1 : 0)) * [1,-1][+!!reverse];             
   }
}

var items = defaultJson;

function populateListAlpha()
{
    items.sort(sort_by(""))
}

function populateListRating()
{
    
}