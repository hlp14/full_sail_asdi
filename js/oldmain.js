/*
Michael Mancuso
VFW - Project 3
Javascript file
*/

    function getElement(elementID)
    {
        return document.getElementById(elementID);
    };    
    
    //functions related to getting data from form into local storage.
    function storeData(key)
    {
        var id;
        
        if (!key)
        {
            id = Math.floor((Math.random() + 1) * 10000000);
        }
        else
        {
            id = key;    
        }
        var itemToStore = {};
            //gen stats
            itemToStore.dateCreated = ["Date Created:", getElement("dateCreated").value];
            itemToStore.charName = ["Character Name:", getElement("charName").value];
            itemToStore.gender = ["Gender:", getGenderValue()];
            //opt groups
            itemToStore.charRace = ["Character Race:", getElement("charRaceSelect").value];
            itemToStore.charClass = ["Character Class:", getElement("charClassSelect").value];
            //attributes
            itemToStore.charStr = ["STR:", getElement("charStr").value];
            itemToStore.charCon = ["CON:", getElement("charCon").value];
            itemToStore.charDex = ["DEX:", getElement("charDex").value];
            itemToStore.charInt = ["INT:", getElement("charInt").value];
            itemToStore.charWis = ["WIS:", getElement("charWis").value];
            itemToStore.charCha = ["CHA:", getElement("charCha").value];
            //misc fields
            itemToStore.charBio = ["Character Bio:", getElement("charBio").value];
            itemToStore.charRating = ["Rating:", getElement("charRating").value];
            //store data
            localStorage.setItem(id, JSON.stringify(itemToStore));
            alert("Data stored.");
    };
    
    function getGenderValue()
    {
        var genderRadio = document.forms[0].gender;
        
        for (var i = 0, l = genderRadio.length; i < l; i++)
        {
            if (genderRadio[i].checked)
            {
                return genderRadio[i].value;    
            };
        };
        return "";
    };
   
    function insertDummyData()
    {
        for (var item in defaultJson)
        {
            var id = Math.floor((Math.random() + 1) * 10000000);
            localStorage.setItem(id, JSON.stringify(defaultJson[item]));
        }      
    }
   
    //functions relating to showing and manipulating data  
    function displayData()
    {
        setFormDisplay("hide");
        
        if (localStorage.length === 0)
        {
            alert("No data stored. Dummy data will be inserted.");
            insertDummyData();
        }
        
        //div -> outer list -> outer list item -> inner list -> inner list items || document.createElement(), .appendChild();
        var div = document.createElement("div");
        div.setAttribute("id", "displayList");
        var outerList = document.createElement("ul");
        div.appendChild(outerList);
    
        document.body.appendChild(div);
        
        for(var i = 0, l = localStorage.length; i < l; i++)
        {
            var outerLi = document.createElement("li");
            outerList.appendChild(outerLi);
            
            var linkLi = document.createElement("li");
            
            var key = localStorage.key(i);
            var value = localStorage.getItem(key);
            
            var innerList = document.createElement("ul");
            innerList.className += "charList";
            outerLi.appendChild(innerList);
            
            
            var jsonObj = JSON.parse(value);
            
            addClassIcon(jsonObj.charClass[1], innerList);            
            
            for(var num in jsonObj)
            {
                var innerLi = document.createElement("li");
                innerList.appendChild(innerLi);
                innerLi.innerHTML = jsonObj[num][0] + " " + jsonObj[num][1];
                innerList.appendChild(linkLi);
            };
            populateItemLinks(key, linkLi);  
        };
      
    };
    
    function addClassIcon(className, unorderedList)
    {
        var imageLi = document.createElement("li");
        imageLi.className += "imgLi";
        
        unorderedList.appendChild(imageLi);
        var imgBox = document.createElement("img");
        var src = imgBox.setAttribute("src", "img/"+ className + ".jpg");
        imageLi.appendChild(imgBox);
    }
    
    function editCharacter()
    {
        var value = localStorage.getItem(this.key);
        var item = JSON.parse(value);
        
        setFormDisplay("show");
        
        getElement("dateCreated").value = item.dateCreated[1];
        getElement("charName").value = item.charName[1];
        
        var genderRadio = document.forms[0].gender;
        for (var i = 0, l = genderRadio.length; i < l; i++)
        {
            if (genderRadio[i].value == "Male")
            {    
                genderRadio[i].setAttribute("checked", "checked")
            }
            else if(genderRadio[i].value == "Female")
            {
                genderRadio[i].setAttribute("checked", "checked")
            }   
        }
        
        getElement("charStr").value = item.charStr[1];
        getElement("charCon").value = item.charCon[1];
        getElement("charDex").value = item.charDex[1];
        getElement("charInt").value = item.charInt[1];
        getElement("charWis").value = item.charWis[1];
        getElement("charCha").value = item.charCha[1];
        
        getElement("charBio").value = item.charBio[1];
        getElement("charRating").value = item.charRating[1];
        
        
        var editSubmit = getElement("btnSubmit");
        editSubmit.value = "Complete Edit"
        editSubmit.addEventListener("click", validateData);
        editSubmit.key = this.key;
    };
    
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
    
    function validateData(event)
    {
        //had to change to something less graceful than in the video, but functional none the less.
        var charName = getElement("charName");
        
        var charStats = [getElement("charStr"), getElement("charCon"), getElement("charDex"),
          getElement("charInt"), getElement("charWis"), getElement("charCha")];
        
        var errMsgs = new Array();
        
        //name and date validation
        if (charName.value === "")
        {
            errMsgs.push("Character must have a name");
        };
        
        for (var i = 0, l = charStats.length; i < l; i++)
        {
            if(!isValidCharStat(charStats[i].value))
            {
                errMsgs.push("Character stat: " + charStats[i].value + " --ALL character attributes must be whole numbers greater than 8");
            };
        };
        
        if (errMsgs.length > 0)
        {
            var errorString ="The form has the following errors: \n";
            
            for (var i = 0, l = errMsgs.length; i < l; i++)
            {
                errorString += " " + errMsgs[i] + "\n";
            };
            alert(errorString);
                event.preventDefault();
                return false;
        }
        else
        {
            storeData(this.key);
            return true;
        }
    };
    
    function isValidCharStat(stat)
    {
        if (!isNaN(parseInt(stat)) && parseInt(stat) < 8)
        {
            return false;
        }
        return true;
    };
    
    //all functions to do with clearing/deleting data
    
    function clearData()
    {
        if (localStorage.length === 0)
        {
            alert("No data is stored.");
        }
        else
        {
            localStorage.clear();
            alert("All data cleared.");
            window.location.reload();
            return false;
        }
        return false;
    };
    
    function deleteCharacter()
    {
        var toDelete = confirm("Do you wish to delete this character?");
        if (toDelete)
        {
            localStorage.removeItem(this.key);
            window.location.reload();
        }
        else
        {
            alert("Character was not deleted");
        }
    }
    
    //changing control displays
    function setFormDisplay(selector)
    {
        //get handles
        var form = getElement("newCharForm");
            clearLink = getElement("clearLink");
            displayLink = getElement("displayLink");
            newLink = getElement("newCharLink");
            items = getElement("displayList");
        
        switch(selector)
        {
            case "show":
                form.style.display = "block";
                newLink.style.display = "none";
                displayLink.style.display = "inline";
                //items.style.display = "none";
                break;
            case "hide":
                form.style.display = "none";
                displayLink.style.display = "none";
                newLink.style.display = "inline";
                //items.style.display = "block";
                break;
            default:
                return false;
        }
        return false;
    }
    
    
    //handlers
    var displayLink = getElement("displayLink");
    displayLink.addEventListener("click", displayData);
    
    var clearLink = getElement("clearLink");
    clearLink.addEventListener("click", clearData);
    
    var submit = getElement("btnSubmit");
    submit.addEventListener("click", validateData);