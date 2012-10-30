//week 2 stuff; to be removed for week 3.
var p2Label = $("#p2Label");
var p2Output = $("#p2Results");

$("#p2JBtn").on("click", changeToJSON);
$("#p2XBtn").on("click", changeToXML);
$("#p2CBtn").on("click", changeToCSV);

function changeToJSON()
{
    p2Label.html("Current format is JSON.");
    $.ajax(
        {
            type:"GET",
            url:"data/data.json",
            dataType: "json",
            success: parseJData
        }
    );
    
    function parseJData(data)
    {
        console.log("Raw JSON input from data/data.json:");
        console.log(data);
        
        p2Output.html("");
        $.each(data,
        function(index, element)
        {
            //this is MUCH more brute force than I like, but it works.
            var li = $("<li></li>");
            li.appendTo(p2Output);
            
            var p = $("<p></p>");
            p.html(element.dateCreated[0] + " " + element.dateCreated[1] + "<br>"
                   + element.charAge[0] + " " + element.charAge[1] + "<br>"
                   + element.charName[0] + " " + element.charName[1] + "<br>"
                   + element.gender[0] + " " + element.gender[1] + "<br>"
                   + element.charAttrs[0] + " " + element.charAttrs[1] +"<br>"
                   + element.charSkills[0] + " " + element.charSkills[1] + "<br>"
                   + element.charBio[0] + " " + element.charBio[1] + "<br>"
                   + element.charRating[0] + " " + element.charRating[1]);
            p.appendTo(li);
        }
        ); 
    }
}

function changeToXML()
{
    p2Label.html("Current format is XML.");
    $.ajax(
        {
            type:"GET",
            url:"data/data.xml",
            dataType:"xml",
            success: parseXData
        }
    );
    
    function parseXData(data)
    {
        console.log("Raw XML input from data/data.xml:");
        console.log(data);
        
        p2Output.html("");
        
        $(data).find("character").each(
            function()
            {
                //this is probably brutally inefficient, but it works.
                var li = $("<li></li>");
                li.appendTo(p2Output);
                
                var p = $("<p></p>");
                p.appendTo(li);
                
                var cur = $(this);
                p.append("Date Created: " + findString("dateCreated")
                         + "Character Age: " + findString("charAge")
                         + "Character Name: " + findString("charName")
                         + "Gender: " + findString("gender")
                         + "Character Attributes: " + findString("charAttrs")
                         + "Character Skills: " + findString("charSkills")
                         + "Character Biography: " + findString("charBio")
                         + "Character Rating: " + findString("charRating")
                        );
                

                function findString(string)
                {
                    return cur.find(string).text() + "<br>";
                }
            }
        );
    }
}

function changeToCSV()
{
    p2Label.html("Current format is CSV.");
    $.ajax(
        {
            type:"GET",
            url:"data/data.csv",
            dataType:"text",
            success: parseCData
        }
    );
    
    function parseCData(data)
    {
        console.log("Raw CSV input from data/data.csv:");
        console.log(data);
        
        p2Output.html("");
        
        //found a third party lib to help with getting CSV to more JS-friendly arrays.
        var chars = $.csv.toArrays(data);
        
        //chars[0] is the CVS header, which we don't want to print.
        for (var outer = 1; outer < chars.length; outer++)
        {
            var li = $("<li></li>");
            li.appendTo(p2Output);
            
            var p = $("<p></p>");
            p.appendTo(li);
            
            for (var inner = 0; inner < chars[0].length; inner++)
            {
                p.append(chars[0][inner] + ": " + chars[outer][inner]);
                p.append("<br>")
            }
        }
    }
}


//init apge events

$("#home").on("pageinit", function(){});
$("#error404").on("pageinit", function(){});
$("#search-results").on("pageinit", function(){});
$("#display-page").on("pageinit", function(){});

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
    var holder = $("#app-search-field").val();
    searchForCharacter(holder);
});

$("#clearStorageBtn").on("click", function()
{
    clearLocalStorage();
});

$("#displayStorageBtn").on("click", function()
{
    displayData();
});

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
    
    function storeData(data, key)
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
    
    function displayData()
    {
        if (localStorage.length === 0)
        {
            alert("No data stored. Dummy data will be inserted.");
            insertDummyData();
        }
        
        var outerList = $("#display-list");
        
        for (var i = 0, l = localStorage.length; i < l; i++)
        {
            var outerLi = $("<li></li>");
            outerList.append(outerLi);
            
            var linkLi = $('<li class="padBottom"></li>');
            
            var key = localStorage.key(i);
            var value = localStorage.getItem(key);
            
            var innerList = $("<ul></ul>");
            outerLi.append(innerList);
            
            var jsonObj = JSON.parse(value);
            
            for (var item in jsonObj)
            {
                var innerLi = $("<li></li>");
                innerList.append(innerLi);
                innerLi.html(jsonObj[item][0] + " " + jsonObj[item][1]);
                innerList.append(linkLi);
            }
            populateItemLinks(key, linkLi); 
        }
    }
    
    function populateItemLinks(key, listItem)
    {
        var ecLink = $('<a class="padRight"></a>');
                ecLink.attr("href", "#");
                ecLink.attr("key", key);
                ecLink.html("Edit Character");
                ecLink.on("click", editCharacter);
                ecLink.appendTo(listItem);
                

            ecLink = $('<a class="padLeft"></a>');
                ecLink.attr("href", "#");
                ecLink.attr("key", key);
                ecLink.html("Delete Character");
                ecLink.on("click", deleteCharacter);
                ecLink.appendTo(listItem);
    };
    
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
        //TODO: The line below is dangerous as is, idiot-proof it.
        $("#charGender").val(item.gender[1]);
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

