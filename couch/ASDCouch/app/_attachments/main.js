//init page events

$("#home").on("pageinit", function(){});
$("#error404").on("pageinit", function(){});
$("#search-results").on("pageinit", function(){});

$("#display-page").on("pageinit", displayDataList);

$("#add-item").on("pageinit", function(){                
                setDate();
                var myForm = $("#addCharForm");
		    myForm.validate({
			invalidHandler: function(form, validator) {
			},
			submitHandler: function() {
            var data = myForm.serializeArray();
			storeData(data);
		}
	});
});


function setDate()
{
    var curDate = new Date();
    var holder = Number(curDate.getMonth() + 1) + "/" + Number(curDate.getDay() + 7) + "/" + Number(curDate.getFullYear());    
    $("#dateCreated").val(holder);
}

//btn handlers
$("#search-btn").on("click", function()
{
    //var holder = $("#app-search-field").val();
    //searchForCharacter(holder);
});



//p4 functions
function displayDataList()
{
	var db = $.couch.db("asdproject");
	var displayList = $("#display-list");
	
	db.allDocs(
			{
				success: function(data)
				{
					$.each(data.rows, function(index, item)
							{
								if(item.key.substring(0,5) === "char:")
								{
									db.openDoc(item.key, {
										success: function(item)
										{
											var li = $("<li></li>");
						        			li.html('<a href="#">' +
						        						'<h3>'+ item.charName[1] + '</h3>' +
						        						'<h3 class="ui-li-aside">Created: ' + item.dateCreated[1] + '</h3>' +
						        					'</a>');
						        			li.appendTo(displayList);
						        			displayList.listview('refresh');
										}});
								}
							}
					);
				} 
			});
}

function storeData(data)
{
	var itemToStore = {};
	var db = $.couch.db("asdproject");
    
	itemToStore._id = "char:" + getRandomInt(10000, 50000); 
    itemToStore.dateCreated = ["DateCreated", data[0].value];
    itemToStore.charAge = ["Character Age:", data[1].value];
    itemToStore.charName = ["Character Name:", data[2].value];
    itemToStore.charGender = ["Character Gender:", data[3].value];
    itemToStore.charAtts = ["Character Attributes:", data[4].value];
    itemToStore.charSkills = ["Character Skills:", data[5].value];
    itemToStore.charBio = ["Character Bio:", data[6].value];
    itemToStore.charRating = ["Character Bio:", data[7].value];	

    db.saveDoc(itemToStore);
    alert("Character Stored.");
    $.mobile.changePage("#display-page");
}

function getRandomInt(min, max)
{
	return Math.floor(Math.random() * (max - min + 1)) + min;
}


//extra functionality


//search logic
//Only search by name for now, but leaving in this form so other fields can be searched.
function searchForCharacter(query)
{
    var matchedItems = new Array();
    
    if (localStorage.length === 0)
    {
        alert("No data stored. Dummy data will be inserted.");
        insertDummyData();
    }
    
    for (var i = 0, l = localStorage.length; i < l; i++)
    {
        var key = localStorage.key(i);
        var value = localStorage.getItem(key);
        var jsonObj = JSON.parse(value);
        if (searchForName(query, jsonObj.charName[1]))
        {
            matchedItems.push(jsonObj);
        }
        
    }
        createAndDisplayDialog(matchedItems);
}

function searchForName(name, recordName)
{
    if(name.toLowerCase() == recordName.toLowerCase())
    {
       return true; 
    }
    return false;
};

function createAndDisplayDialog(jsonArray)
{
    var numLine = $("#results-num");
    var itemList = $("#results-list");
    
        
    numLine.html("There were " + jsonArray.length + " results found, displayed below:")
    itemList.html("");
    
    for (var i = 0, l = jsonArray.length; i<l; i++)
    {
        var outerLi = $('<li class="padBottom"></li>');
        itemList.append(outerLi);
        
        var innerList = $("<ul></ul>");
        outerLi.append(innerList);
        
        var current = jsonArray[i];
        for (var item in current)
        {
            var innerLi = $("<li></li>");
            innerList.append(innerLi);
            innerLi.html(current[item][0] + " " + current[item][1]);
        }
    }
    $.mobile.changePage("#search-results");
}

//crud
    function insertDummyData()
    {
        for (var item in defaultJson)
        {
            var id = Math.floor((Math.random() + 1) * 10000000);
            localStorage.setItem(id, JSON.stringify(defaultJson[item]));
        }      
    }
    
    function storeDataOld(data)
    {
        var id;
        if(!key)
        {
            id = Math.floor((Math.random() + 1) * 10000000);
        }
        else
        {
            id = key;
        }
        
        var itemToStore = {};
        
        itemToStore.dateCreated = ["DateCreated", data[0].value];
        itemToStore.charAge = ["Character Age:", data[1].value];
        itemToStore.charName = ["Character Name:", data[2].value];
        itemToStore.charGender = ["Character Gender:", data[3].value];
        itemToStore.charAtts = ["Character Attributes:", data[4].value];
        itemToStore.charSkills = ["Character Skills:", data[5].value];
        itemToStore.charBio = ["Character Bio:", data[6].value];
        itemToStore.charRating = ["Character Bio:", data[7].value];
        
        
        localStorage.setItem(id, JSON.stringify(itemToStore));
        alert("Data stored.");
        $.mobile.changePage("#home");
    }
    
    function displayAllData()
    {
        $.ajax(
        		{
                    type:"GET",
                    url:"https://tarkenfire.cloudant.com/asdproject/_design/rpgtracker/_view/characters",
                    dataType: "json",
                    success: parseData
                }
            );
        
        function parseData(res)
        {
        	//I imagine this is sledgehammer-in-face inefficient with a larger data set.
        	var displayList = $("#display-list");
        	$.each(res.rows, function(index, item)
        		{
        			var li = $("<li></li>");
        			li.html('<a href="#">' +
        						'<h3>'+ item.value.charName[1] + '</h3>' +
        						'<p>' + item.value.charAge[0] + " " + item.value.charAge[1] + '</p>' +
        						'<p>' + item.value.gender[0] + " " + item.value.gender[1] + '</p>' +
        						'<p>' + item.value.charAttrs[0] + " " + item.value.charAttrs[1] + '</p>' +
        						'<p>' + item.value.charSkills[0] + " " + item.value.charSkills[1] + '</p>' +
        						'<p>' + item.value.charBio[0] + " " + item.value.charBio[1] + '</p>' +
        						'<p>' + item.value.charRating[0] + " " + item.value.charRating[1] + '</p>' +
        						'<h3 class="ui-li-aside">Created: ' + item.value.dateCreated[1] + '</h3>' +
        					'</a>');
        			li.appendTo(displayList);
        			
        			displayList.listview('refresh');
        		}
        	);
        }
    }
    
    function deleteCharacter()
    {
        var toDelete = confirm("Do you wish to delete this character?");
        if (toDelete)
        {
            var key = $(this).attr('key');
            alert("Character was deleted.");
            localStorage.removeItem(key);
            $("#display-list").html("");
            $.mobile.changePage("#home");
        }
        else
        {
            alert("Character was not deleted.");
        }
    }
    
    function editCharacter()
    {
        var key = $(this).attr("key");
        var item = JSON.parse(localStorage.getItem(key));
       
        $("#dateCreated").val(item.dateCreated[1]);
        $("#charAge").val(item.charAge[1]);
        $("#charName").val(item.charName[1]);
        if (item.gender[1] == "Male")
        {
            $("#radioMale").attr("checked", true);
        }
        else
        {
            $("#radioFemale").attr("checked", true);
        }
        $("#charAttrs").val(item.charAttrs[1]);
        $("#charSkills").val(item.charSkills[1]);
        $("#charBio").val(item.charBio[1]);
        $("#charRating").val(item.charRating[1]);
        
        $.mobile.changePage("#add-item");
        
    }
    
    function clearLocalStorage()
    {
        if (localStorage.length === 0)
        {
            alert("No data is stored.");
        }
        else
        {
            localStorage.clear();
            alert("All data cleared.");
            $("#display-list").html("");
            $.mobile.changePage("#home");
            return false;
        }
        return false;
    }

