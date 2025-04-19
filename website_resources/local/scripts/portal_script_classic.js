const online_xml_file = "https://raw.githubusercontent.com/dragos-vacariu/portfolio/main/website_resources/local/database/processed/portal_database_processed.xml";
//const online_xml_file = "http://localhost:8003/dragos-vacariu.github.io/website_resources/local/database/processed/portal_database_processed.xml"; //local resource can be ran using local server with cors
//const online_xml_file = "http://localhost:8003/dragos-vacariu.github.io/website_resources/local/database/original/portal_database.xml"; //local resource can be ran using local server with cors
const manifests = [];
const manifest_selection = document.getElementById("manifest_selection");
concept_collection = [];
const concept_selection = document.getElementById("concept_selection");
const overall_concept_selection = document.getElementById("overall_concept_selection");
const cookie_element_separator = "<br>"; 
allConceptsSelection = false;

//different styles for list tag selection:
const tag_selection_on = "font:var(--menu-font); font-variant: small-caps; font-weight: normal; background-image: linear-gradient(to right, rgba(90,0,0,0.8), rgba(90,0,0,0.7)); color: white; border: ridge 0.2vw rgba(255,255,255,0.7); text-shadow: 0px 0px black; padding: 1px 5px; margin: 1px;";
const tag_selection_off = "font:var(--menu-font); font-variant: small-caps; background-image: linear-gradient(to right, white, rgba(255,200,200,0.1)); color: black; border: solid 0.2vw rgba(0,0,0,0.7); padding: 1px 5px; margin: 1px;";

const copy_GeneralKnowledge_token = "*General-Programming-Knowledge*";

const page_selection = document.getElementById("page_selection");

/*Adding page selection buttons*/
page_selection.appendChild( createLiElement("Modern", false, changeToModernPage) );
page_selection.appendChild( createLiElement("Classic", true, changeToClassicPage) );

const table_content = document.getElementById("table_content");

const language_title_style = "color: black; font: var(--paragraph-header-font); text-align: center; text-transform: uppercase; border: outset 1px rgba(143,55,0, 0.1); width: 98%; padding: 1%; margin: 1% 0%; background-image: radial-gradient(circle, rgba(255,255,255,0.1), rgba(143,55,0, 0.05)); letter-spacing: 2px;";
const concept_title_style = "color: var(--darkred-color); font: var(--big-header-font);  text-align: left; text-transform: capitalize; border: groove 0.2vw rgba(143,55,0, 0.1); width: 98%; padding: 1%; margin: 0%; background-image: linear-gradient(to right, rgba(255,255,255,0.4), rgba(255,255,255,0.1)); letter-spacing: var(--big-header-font-letter-spacing)";
const concept_value_style = "color: black; text-shadow: 0px 0px #663300; font:var(--paragraph-font); text-align: left; text-transform: none; border: none 0px rgba(143,55,0, 0.1); width: 98%; padding: 1%; margin: 0%;"
const cell_style = "vertical-align: top;";

function dbCookieRouteHandling()
{
    /*Handling of routing or database related cookies. For these cookies we need the content from the Database
      So we need to wait until the HTTP Request is ready. These cookies will be set slower than predefined elements cookie.
    */
    var window_href_values = window.location.href.split("#");
    var return_value = false;
    
    if(window_href_values.length > 1 && window_href_values[1] != "")
    {
        /*We will ignore the database related cookie if we are provided with a route*/
        useProvidedRoute(); // this should only be called when opening the webpage
        
        showTable(); // this will set the selection and the view
        return_value = true
    }
    //reading from the cookie file:
    else if(document.cookie.length > 0)
    {
        restoreDBSingleSelectionCookie();
        showTable(); // this will set the selection and the view
        return_value = true
    }
    
    return return_value;
}

function useProvidedRoute()
{
    /*This function will use the provided route to select the specified elements*/
    var window_href_values = window.location.href.split("#");
    
    //We have active languages that we need to set
    var items = window_href_values[1].split("&")
    if(items.length > 0 && items[0] != "")
    {
        var languages = items[0].split("_");
        //Redoing the workaround provided for C# due to usage of special meaning character which is '#'
        var csharp_index = languages.findIndex(element => element == "CSharp");
        if(csharp_index >= 0)
        {
            languages[csharp_index] = "C#";
        }
        //Deselect all languages
        for(var i = 0; i < manifest_selection.children.length; i++)
        {
            manifest_selection.children[i].value = false;
            manifest_selection.children[i].style = tag_selection_off;
            updateCookie(manifest_selection.children[i].innerHTML, manifest_selection.children[i].value);
        }
        //Selecting only the languages specified by the route:
        for(var i = 0; i < languages.length; i++)
        {
            var matchIndex = manifests.findIndex(element => String(element.name).toLowerCase() == String(languages[i]).toLowerCase());
            if(matchIndex >= 0 )
            {
                /*manifest_selection has one less index compared to manifests because 
                General-Programming-Knowledge is not available for selection */
                if(manifest_selection.children[matchIndex-1].value == false)
                {
                    //if element specified via the routing is found and is deselected we will select it
                    toggleManifestOnOff(manifest_selection.children[matchIndex-1])
                    //click will select this item and deselect all others
                }
                updateCookie(manifest_selection.children[matchIndex-1].innerHTML, manifest_selection.children[matchIndex-1].value);
            }
        }
    }
    if(items.length > 1 && items[1] != "")
    {
        //We have active concepts that we need to set
        var view = items[1].split("%")
        var concepts = items[1].split("_");
        //If there is a view mentioned in the route:
        if(view.length > 1)
        {
            view = items[1].split("%")[1];
            concepts = items[1].split("%")[0];
            concepts = concepts.split("_");
        }
        //Deselect all concepts
        for(var i = 0; i < concept_selection.children.length; i++)
        {
            concept_selection.children[i].value = false;
            concept_selection.children[i].style = tag_selection_off;
            updateCookie(concept_selection.children[i].innerHTML, concept_selection.children[i].value);
        }
        //Selecting only the concepts specified by the route:
        
        var conceptsEnabledCounter = 0;
        for(var i = 0; i < concepts.length; i++)
        {
            var matchIndex = concept_collection.findIndex(element => String(element).toLowerCase() == String(concepts[i]).toLowerCase());
            if(matchIndex >= 0 )
            {
                if(concept_selection.children[matchIndex].value == false)
                {
                    //if element specified via the routing is found and is deselected we will select it
                    concept_selection.children[matchIndex].value = true
                    concept_selection.children[matchIndex].style = tag_selection_on
                    conceptsEnabledCounter++;
                }
                updateCookie(concept_selection.children[matchIndex].innerHTML, concept_selection.children[matchIndex].value);
            }
        }
        if(conceptsEnabledCounter == concept_selection.children.length)
        {
            allConceptsSelection = true;
        }
    }
}

function restoreCookiePredefinedElements()
{
    /*
        Restoring the values from the cookie for elements defined outside the database.
        These cookies should be restored instantly as they don't have to wait until the HTTP Request is ready
    */
    
    var cookie_elements = document.cookie.split(cookie_element_separator);
    var foundPageView = cookie_elements.findIndex(element => String(element) == "page=modern");
    /*
        The findIndex() method of Array instances returns the index of the first element in an 
        array that satisfies the provided testing function. If no elements satisfy the testing 
        function, -1 is returned.
        
        The find() method of Array instances returns the first element in the provided array that 
        satisfies the provided testing function. If no values satisfy the testing function, undefined 
        is returned.
    */
    if(foundPageView >= 0) //if page view found amongst cookies
    {
        window.location.href = "./portal.html";
        /*Page will change and script run will stop*/
    }
}

function restoreDBSingleSelectionCookie()
{
    var cookie_elements = document.cookie.split(cookie_element_separator);
    var active_language = cookie_elements.find(element => String(element).split("=")[0] == "SingleSelectionLanguage");
    var active_concept = cookie_elements.find(element => String(element).split("=")[0] == "SingleSelectionConcept");
    /*
        The find() method of Array instances returns the first element in the provided array that 
        satisfies the provided testing function. If no values satisfy the testing function, undefined 
        is returned.
    */
    if(active_language != undefined) //if selection type found amongst cookies
    {
        var pairs = active_language.split("="); 
        
        if(pairs.length > 1)
        {
            var language_index = manifests.findIndex(element => String(element.name) == String(pairs[1]))
            if(language_index >= 0 )
            {
                 /*
                    manifest_selection is built based on manifests without General-Programming-Knowledge. 
                    manifest_selection has 1 less element compared to manifests so 1 less index.
                */
                language_index-=1;
                toggleManifestOnOff(manifest_selection.children[language_index])
            }
        }
    }
    if(active_concept != undefined) //if selection type found amongst cookies
    {
        var pairs = active_concept.split("="); 
        if(pairs.length > 1)
        {
            var concept_index = concept_collection.findIndex(element => String(element) == String(pairs[1]))
             
            if(concept_index >= 0 )
            {
                 /*concept_selection is built based on concept_collection. They have the same indexing*/
                toggleConceptOnOff(concept_selection.children[concept_index])
            }
        }
    }
}

function updateCookie(property, value)
{
    var cookie_elements = document.cookie.split(cookie_element_separator);
    var matchIndex = cookie_elements.findIndex(element => String(element.split("=")[0]) == String(property) ); //check whether the property exists in the document.cookie
    if(matchIndex >= 0)
    {
        var pairs = cookie_elements[matchIndex].split("=");
        pairs[1] = value;
        cookie_elements[matchIndex] = pairs[0] + "=" + pairs[1];
        document.cookie = cookie_elements.join(cookie_element_separator);
    }
    else
    {
        var element =  property + "=" + value;
        if(document.cookie.length > 0)
        {
            /*cookie_element_separator = <br> is used as separator. There is no need adding separator before the first item*/
            element = cookie_element_separator + element;  
        }
        document.cookie += element;
    }

}

class Programming_Language
{
    constructor()
    {
        this.name = "null";
        this.concepts = [];
    }
    addConcept(concept_name, value)
    {
        this.concepts.push(new Programming_Concept(concept_name, value));
    }
    change_name(name)
    {
        this.name = name;
    }
}

class Programming_Concept
{
    constructor(concept_name, value)
    {
        this.concept_name = concept_name;
        this.concept_value = value;
    }
}

function loadXMLDoc(xml_file) 
{
    var xml_http_request = new XMLHttpRequest();
    
    /*when the request changes its ready-state call this function*/
    xml_http_request.onreadystatechange = function() 
    {
        if (this.readyState == 4 && this.status == 200) 
        {
            var parser = new DOMParser();
            var xml_Document = parser.parseFromString(this.responseText, "application/xml");
            
            /*get the content of the specified xml tag and store the information*/
            var xml_tag_content = xml_Document.getElementsByTagName("manifest");

            for (var i = 0; i< xml_tag_content.length; i++) 
            {
                var Programming_Lang = new Programming_Language();
                for(var j=0 ; j< xml_tag_content[i].childNodes.length; j++)
                {
                    if(String(xml_tag_content[i].childNodes[j]) == "[object Element]")
                    {
                        if(String(xml_tag_content[i].childNodes[j].tagName) == "name")
                        {
                            Programming_Lang.change_name( String(xml_tag_content[i].childNodes[j].innerHTML) );
                        }
                        else
                        {
                            Programming_Lang.addConcept( String(xml_tag_content[i].childNodes[j].tagName) , String(xml_tag_content[i].childNodes[j].innerHTML));
                        }
                    }
                }
                manifests.push(Programming_Lang);
            }
            
            /*Adding the overall concept selection functions*/
            overall_concept_selection.appendChild( createLiElement("deselect all", true, deselectionOfAllConceptElements) );
            overall_concept_selection.appendChild( createLiElement("select all", true, selectionOfAllConceptElements) );
            
            //Adding programming languages to the selection
            for(var index=0; index< manifests.length; index++)
            {
                /*Grabbing all concepts available for all the programming languages*/
                /*Ignore everything for General-Programming-Knowledge*/
                if(manifests[index].name != "General-Programming-Knowledge")
                {
                    if(index==1) //display only 3 columns in the table by default -> General-Programming-Knowledge is not gonna be visible
                    {
                        manifest_selection.appendChild(createLiElement(manifests[index].name, true, manifestSelectionBehavior));
                    }
                    else
                    {
                        manifest_selection.appendChild(createLiElement(manifests[index].name, false, manifestSelectionBehavior));
                    }
                }
            }
            /*read cookie and/or hanndle the display of the elements*/
            if ( dbCookieRouteHandling() == false ) //if no cookie or route was provided, we will display the default selection
            {
                for(var concept_index=0; concept_index < manifests[1].concepts.length; concept_index++)
                {
                    if(concept_index == 0)
                    {
                        concept_selection.appendChild(createLiElement(manifests[1].concepts[concept_index].concept_name, true, conceptSelectionBehavior));
                    }
                    else
                    {
                        concept_selection.appendChild(createLiElement(manifests[1].concepts[concept_index].concept_name, false, conceptSelectionBehavior));
                    }
                    concept_collection.push(manifests[1].concepts[concept_index].concept_name);
                }
                showTable(); // this will set the selection and the view
            }
        }
    };
    
    //open a GET request to get the item
    xml_http_request.open("GET", xml_file, true);
    
    //send the request to the server
    xml_http_request.send();
}

function showTable()
{
    //The table is hidden only at the beggining - when HTTP Request is accessing the database.
    var hidden = table_content.getAttribute("hidden");
    if (hidden) 
    {
        table_content.removeAttribute("hidden");
    }
    removeTable();
    
    /*View selection is Regular*/
    fillTableRegular();
}

function removeTable()
{
    /*Remove every element within the table*/
    var tableHeaderRowCount = 0;
    var rowCount = table_content.rows.length;
    for (var i = tableHeaderRowCount; i < rowCount; i++) 
    {
        table_content.deleteRow(tableHeaderRowCount);
    }
}

function fillTableRegular()
{    
    /*This function will fill the table in one column only*/
    var row = null;
    var cell = null;
    
    //draw the table
    for(var index=0; index < manifests.length; index++)
    {
        for(var lang_selection_index=0; lang_selection_index < manifest_selection.children.length; lang_selection_index++)
        {
            /*check if the language is selected to be displayed*/
            if(manifest_selection.children[lang_selection_index].innerHTML == manifests[index].name && manifest_selection.children[lang_selection_index].value==true)
            {
                /*Insert a new row for each language title selected to be displayed*/
                row = table_content.insertRow();
                cell = row.insertCell();
                cell.innerHTML = manifests[index].name;
                cell.style = language_title_style;
                cell.style.paddingTop = "1%";
                /*For each concept the language has*/
                for(var concept_index=0; concept_index < concept_collection.length; concept_index++)
                {
                    /*If the concept is selected to be displayed*/
                    if(concept_collection[concept_index] == concept_selection.children[concept_index].innerHTML &&
                        concept_selection.children[concept_index].value == true)
                    {
                        var found_element_index =  manifests[index].concepts.findIndex(element => element.concept_name ==concept_collection[concept_index]);
                        
                        /*
                        The findIndex() method of Array instances returns the index of the first element in an 
                        array that satisfies the provided testing function. If no elements satisfy the testing 
                        function, -1 is returned.
                        */
                        
                        /*If the concept exists for this language*/
                        if(found_element_index >= 0) 
                        {
                            row = table_content.insertRow();
                            cell = row.insertCell(); //empty cell

                            /*Insert the concept name within the cell*/
                            var p = document.createElement("p");
                            p.innerHTML = concept_collection[concept_index] + ":";
                            p.style = concept_title_style;
                            cell.appendChild(p);
                            p = document.createElement("p");

                            p.innerHTML += manifests[index].concepts[found_element_index].concept_value;
                            checkCopyConceptFromGeneralKnowledge(p, manifests[index].concepts[found_element_index]);
                            
                            p.style = concept_value_style;
                            cell.appendChild(p);
                            cell.style = cell_style;
                                                    
                        }
                    }
                }
            }
        }
    }
}

function createLiElement(string_value, enablingStatus, function_behaviour)
{
    /*
    This function will create li elements to allow selection and deselection of elements 
    within the database.
    */
    
    var li = document.createElement("li");
    li.appendChild(document.createTextNode(string_value));
    li.value = enablingStatus;
    if (li.value == true)
    {
        li.style = tag_selection_on;
    }
    else
    {
        li.style = tag_selection_off;
    }
    li.onclick = function_behaviour;
    return li;
}

function conceptSelectionBehavior()
{
    /*This function describes the behaviour of a concept li element*/
    
    toggleConceptOnOff(this)
    updateRoute();
}

function toggleConceptOnOff(concept_element)
{
    /*This function will toggle the selection of manifest.concept element*/
    
    for(var index=0; index < concept_element.parentElement.children.length; index++)
    {
        if(concept_element.parentElement.children[index] != concept_element)
        {
            concept_element.parentElement.children[index].value = false;
            concept_element.parentElement.children[index].style = tag_selection_off;
        }
        else
        {
            concept_element.value = true;
            concept_element.style = tag_selection_on;
        }
    }
    
    updateCookie("SingleSelectionConcept", concept_element.innerHTML);
    allConceptsSelection = false;
    window.scrollTo(0, 400);
    showTable();
}

function manifestSelectionBehavior()
{
    /*This function describes the behaviour of a language li element*/
    toggleManifestOnOff(this);
    updateRoute();
}

function toggleManifestOnOff(manifest_element)
{
    //Deselect the old item and select the new one:
    for(var index=0; index < manifest_element.parentElement.children.length; index++)
    {
        if(manifest_element.parentElement.children[index] != manifest_element)
        {
            manifest_element.parentElement.children[index].value = false;
            manifest_element.parentElement.children[index].style = tag_selection_off;
        }
        else
        {
            manifest_element.value = true;
            manifest_element.style = tag_selection_on;
        }
    }
    
    /*get the language item and enable / disable the concepts within*/
    var active_language = manifests.find(element => element.name == manifest_element.innerHTML);
    if(active_language != undefined)
    {
        selected_concept = ""
        //Removing existing concepts in the concept_selection
        while(concept_selection.children.length > 0)
        {
            if (concept_selection.children[0].value == true)
            {
                selected_concept = concept_selection.children[0].innerHTML
            }
            concept_selection.children[0].remove();
        }
        concept_collection = [] //clearing the concept_collection
        
        //Appending the new concepts
        for(var index=0; index < active_language.concepts.length; index++)
        {
            if (allConceptsSelection == true)
            {
                concept_selection.appendChild(createLiElement(active_language.concepts[index].concept_name, true, conceptSelectionBehavior));
            }
            else
            {
                if(index == 0)
                {
                    concept_selection.appendChild(createLiElement(active_language.concepts[index].concept_name, true, conceptSelectionBehavior));
                }
                else if (selected_concept != "" && active_language.concepts[index].concept_name ==  selected_concept)
                {
                    concept_selection.appendChild(createLiElement(active_language.concepts[index].concept_name, true, conceptSelectionBehavior));
                    concept_selection.children[0].value = false
                    concept_selection.children[0].style = tag_selection_off;
                }
                else
                {
                    concept_selection.appendChild(createLiElement(active_language.concepts[index].concept_name, false, conceptSelectionBehavior));
                }
            }
            concept_collection.push(active_language.concepts[index].concept_name);
        }
    }
    updateCookie("SingleSelectionLanguage", manifest_element.innerHTML);
    
    showTable();
}

function getActiveElements(element)
{
    /*This function will return the number of active elements within an HTML ul list*/
    activeElements=[];
    if(element.length != undefined)
    {
        for(var i=0; i< element.length; i++)
        {
            if(element[i].value ==true)
            {
                activeElements.push(element[i])
            }
        }
    }
    return activeElements;
}

function deselectionOfAllConceptElements() 
{
    /*This function will describe the behavior of deselect all button within the Overall Concept Selection.*/
    for(var i = 0; i < concept_selection.children.length; i++)
    {
        concept_selection.children[i].value = false;
        concept_selection.children[i].style = tag_selection_off;
        updateCookie(concept_selection.children[i].innerHTML, concept_selection.children[i].value);
    }
    allConceptsSelection = false;
    showTable();
    updateRoute();
}

function selectionOfAllConceptElements() 
{
    /*This function will describe the behavior of select all button within the Overall Concept Selection.*/
    for(var i = 0; i < concept_selection.children.length; i++)
    {
        concept_selection.children[i].value = true;
        concept_selection.children[i].style = tag_selection_on;
        updateCookie(concept_selection.children[i].innerHTML, concept_selection.children[i].value);
    }
    allConceptsSelection = true;
    showTable();
    updateRoute();
}

function checkCopyConceptFromGeneralKnowledge(html_element, concept)
{
    /*This function will copy information from General-Programming-Knowledge*/
    
    //Enter here if this table cell
    if(String(html_element.tagName).toLowerCase() == "td" || 
        String(html_element.tagName).toLowerCase() == "p")
    {
        if(String(html_element.innerHTML).includes(copy_GeneralKnowledge_token))
        {
            
            var found_element_index = manifests.findIndex(element => element.name == "General-Programming-Knowledge");
            if( found_element_index >= 0 )
            {
                var found_concept = manifests[found_element_index].concepts.findIndex(element => element.concept_name == concept.concept_name);
                if( found_concept >= 0 )
                {
                    html_element.innerHTML = String(html_element.innerHTML).replace(copy_GeneralKnowledge_token, manifests[found_element_index].concepts[found_concept].concept_value);
                }
                else
                {
                    /*If something happened and for some reason there is no such entry in the General-Programming-Knowledge just clear this substring*/
                    html_element.innerHTML = String(html_element.innerHTML).replace(copy_GeneralKnowledge_token, "");
                }
            }
            else
            {
                /*If something happened and cannot find General-Programming-Knowledge just clear this substring*/
                html_element.innerHTML = String(html_element.innerHTML).replace(copy_GeneralKnowledge_token, "");
            }
            
        }
    }
}

function changeToModernPage()
{
    //This function is executed when changing the classic page to modern page
    if(this.value == false)
    {
        updateCookie("page", "modern");
        window.location.href = "./portal.html";
    }
}

function changeToClassicPage()
{
    //This function is executed when changing the modern page to classic page
    if(this.value == false)
    {
        updateCookie("page", "classic");
        window.location.href = "./portal_classic.html";
    }
}

function updateRoute()
{
    var routeString = "";

    for(var i=0; i<manifest_selection.children.length; i++)
    {
        if(manifest_selection.children[i].value == true)
        {
            routeString += manifest_selection.children[i].innerHTML + "_";
        }
    }
    routeString = routeString.slice(0, routeString.length-1); //remove the last _
    routeString += "&";
    for(var i=0; i < concept_selection.children.length; i++)
    {
        if(concept_selection.children[i].value == true)
        {
            routeString += concept_selection.children[i].innerHTML + "_";
        }
    }
    routeString = routeString.slice(0, routeString.length-1); //remove the last _

    //workaround for C# because it uses # which has special meaning.
    routeString = routeString.replaceAll("C#", "CSharp"); //we cannot use # within the route as it has special meaning
    var href = window.location.href .split("#")[0];
    window.location.href = href + "#" + routeString;
}

function workaroundForFooterRoutedLinksForPortalPage(value)
{
    /*This function will be called if I'm on the Portal Page and click on a footer link pointing to a 
    route of the Portal Page*/
    window.location.href = value
    
    /*Force a reload, that will ensure the route is loaded*/
    window.location.reload()
}

//Restore the cookies which can be restored before accessing the database
restoreCookiePredefinedElements();

loadXMLDoc(online_xml_file)
