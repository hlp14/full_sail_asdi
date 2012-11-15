//init page events

$("#home").on("pageinit", function(){});
$("#error404").on("pageinit", function(){});
$("#search-results").on("pageinit", function(){});

$("#display-char-page").on("pageshow", displayCharacter);

$("#display-page").on("pageinit", displayDataList);

$("#add-item").on("pageinit", function(){                
                setDate();
                var myForm = $("#addCharForm");
		    myForm.validate({
			invalidHandler: function(form, validator) {
			},
			submitHandler: function() {
            var data = myForm.serializeArray();
            console.log($("#charId").val());
			
            if ($("charId").val() === "")
            {
            	storeData(data, $("charId").val());
            }
            else
            {
            	storeData(data);
            }
            	
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
var curId;

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
						        			li.html('<a href="#" class=.listViewButton>' +
						        						'<h3>'+ item.charName[1] + '</h3>' +
						        						'<h3 class="ui-li-aside">Created: ' + item.dateCreated[1] + '</h3>' +
						        					'</a>');
						        			li.appendTo(displayList);
						        			
						        			li.on("click", function()
						        				{
						        					curId = item._id;
						        					$.mobile.changePage("#display-char-page");
						        				});
						        			displayList.listview('refresh');
										}});
								}
							}
					);
				} 
			});
}

function displayCharacter()
{
	var db = $.couch.db("asdproject");
	db.openDoc(curId,{success: displayDoc});
	
	function displayDoc(item)
	{
		var container = $("#display-char");
		container.html(
				'<h3>'+ item.charName[1] + '</h3>' +
				'<p>ID: '+ item._id + '</p>' +
				'<p>' + item.charAge[0] + " " + item.charAge[1] + '</p>' +
				'<p>' + item.charGender[0] + " " + item.charGender[1] + '</p>' +
				'<p>' + item.charAttrs[0] + " " + item.charAttrs[1] + '</p>' +
				'<p>' + item.charSkills[0] + " " + item.charSkills[1] + '</p>' +
				'<p>' + item.charBio[0] + " " + item.charBio[1] + '</p>' +
				'<p>' + item.charRating[0] + " " + item.charRating[1] + '</p>' +
				'<p>Created: ' + item.dateCreated[1] + '</p>'
				);
		
		$("#edit-c-btn").on("click", function()
				{
					$("#dateCreated").val(item.dateCreated[1]);
					$("#charAge").val(item.charAge[1]);
					$("#charName").val(item.charName[1]);
					$("#charAttrs").val(item.charAttrs[1]);
					$("#charSkills").val(item.charSkills[1]);
					$("#charBio").val(item.charBio[1]);
					$("#charRating").val(item.charRating[1]);
					
					$("charId").val(item._id);
					
					$.mobile.changePage("#add-item");
				});

		
		$("#del-c-btn").on("click", function()
				{
					if (confirm('Really delete this character? There is no way to reverse this process.'))
					{
						alert("Character Deleted.")
						db.removeDoc({_id:item._id, _rev:item._rev}, {success: function(data){console.log("suc");}, error: function(data){console.log("fail");}});
						$.mobile.changePage("#home");
					}
					else	
					{
						alert("Character Not Deleted");
					}
				});
	}
	
}

function storeData(data, id)
{
	var itemToStore = {};
	var db = $.couch.db("asdproject");
    
	if (!id)
	{
		itemToStore._id = "char:" + getRandomInt(10000, 50000);
	}
	else
	{
		itemToStore._id = id;
	}
	
    itemToStore.dateCreated = ["DateCreated", data[0].value];
    itemToStore.charAge = ["Character Age:", data[1].value];
    itemToStore.charName = ["Character Name:", data[2].value];
    itemToStore.charGender = ["Character Gender:", data[3].value];
    itemToStore.charAttrs = ["Character Attributes:", data[4].value];
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
