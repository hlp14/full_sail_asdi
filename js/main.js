$('#add-item').on('pageinit', function(){                
                setDate();
                var myForm = $('#addCharForm');
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
$("#search-btn").click(function()
{
    var holder = $("#app-search-field").val();
    searchForCharacter(holder);
});

$("#clearStorageBtn").click(function()
{
    clearLocalStorage();
});

$("#displayStorageBtn").click(function()
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
        console.log(query + " " + jsonObj);
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
        var outerLi = document.createElement("li");
        itemList.append(outerLi);
        
        var innerList = document.createElement("ul");
        outerLi.appendChild(innerList);
        
        var current = jsonArray[i];
        for (var item in current)
        {
            var innerLi = document.createElement("li");
            innerList.appendChild(innerLi);
            innerLi.innerHTML= current[item][0] + " " + current[item][1];
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
            var outerLi = document.createElement("li");
            outerList.append(outerLi);
            
            var linkLi = document.createElement("li");
            
            var key = localStorage.key(i);
            var value = localStorage.getItem(key);
            
            var innerList = document.createElement("ul");
            outerLi.appendChild(innerList);
            
            var jsonObj = JSON.parse(value);
            
            for (var item in jsonObj)
            {
                var innerLi = document.createElement("li");
                innerList.appendChild(innerLi);
                innerLi.innerHTML= jsonObj[item][0] + " " + jsonObj[item][1];
                innerList.appendChild(linkLi);
            }
            populateItemLinks(key, linkLi); 
        }
    }
    
    function populateItemLinks(key, listItem)
    {
        var editCharacterLink = document.createElement("a");
        editCharacterLink.href="#"
        editCharacterLink.key = key;
        editCharacterLink.innerHTML = "Edit Character";
        editCharacterLink.addEventListener("click", editCharacter)
        listItem.appendChild(editCharacterLink);
        
        var deleteCharacterLink = document.createElement("a");
        deleteCharacterLink.href="#"
        deleteCharacterLink.key = key;
        deleteCharacterLink.innerHTML = "Delete Character";
        deleteCharacterLink.addEventListener("click", deleteCharacter)
        listItem.appendChild(deleteCharacterLink);
    };
    
    function deleteCharacter()
    {
        var toDelete = confirm("Do you wish to delete this character?");
        if (toDelete)
        {
            localStorage.removeItem(this.key);
            $.mobile.changePage("#home");
        }
        else
        {
            alert("Character was not deleted");
        }
    }
    
    function editCharacter()
    {
        //did not finish in time
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

