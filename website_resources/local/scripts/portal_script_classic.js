const online_xml_file = "https://raw.githubusercontent.com/dragos-vacariu/portfolio/main/website_resources/local/database/processed/programming_languages_database_processed.xml";
//const online_xml_file = "http://localhost:8003/dragos-vacariu.github.io/website_resources/local/database/processed/programming_languages_database_processed.xml"; //local resource can be ran using local server with cors
//const online_xml_file = "http://localhost:8003/dragos-vacariu.github.io/website_resources/local/database/original/programming_languages_database.xml"; //local resource can be ran using local server with cors
const programming_languages = [];
const programming_language_selection = document.getElementById("programming_language_selection");
concept_collection = [];
const concept_selection = document.getElementById("concept_selection");
const overall_concept_selection = document.getElementById("overall_concept_selection");
const cookie_element_separator = "<br>"; 
allConceptsSelection = false;

//different styles for list tag selection:
const tag_selection_on = "background-image: linear-gradient(to right, #aa7700, #995500); color: white; border-color: white; text-shadow: 1px 1px black; border-width: 1px";
const tag_selection_off = "background-image: linear-gradient(to right, white, #ffeecc); color: #995500; border-color: black; text-shadow: 0.4px 0.4px black; border-width: 1px";

const copy_GeneralKnowledge_token = "*General-Programming-Knowledge*";

const page_selection = document.getElementById("page_selection");

/*Adding page selection buttons*/
page_selection.appendChild( createLiElement("Modern", false, changeToModernPage) );
page_selection.appendChild( createLiElement("Classic", true, changeToClassicPage) );

const table_content = document.getElementById("table_content");

const language_title_style = "color: #663300; font-family: Calibri; font-size: 22px; text-align: center; text-transform: uppercase; border: outset 1px rgba(143,55,0, 0.1); width: 98%; padding: 1%; margin: 1% 0%; background-image: radial-gradient(circle, rgba(255,255,255,0.3), rgba(143,55,0, 0.2)); letter-spacing: 2px;";
const concept_title_style = "color: darkred; font-family: Calibri; font-size: 20px; text-align: left; text-transform: capitalize; border: double 1px rgba(143,55,0, 0.1); width: 98%; padding: 1%; margin: 0%; background-image: linear-gradient(to right, rgba(255,255,255,0.4), rgba(255,255,255,0.1)); letter-spacing: 1px; ";
const concept_value_style = "color: #663300; font-family: Calibri; font-size: 18px; text-align: left; text-transform: none; border: solid 1px rgba(143,55,0, 0.1); width: 98%; padding: 1%; margin: 0%;";
const cell_style = "vertical-align: top;";

function dbCookieRouteHandling()
{
    /*Handling of routing or database related cookies. For these cookies we need the content from the Database
      So we need to wait until the HTTP Request is ready. These cookies will be set slower than predefined elements cookie.
    */
    var window_href_values = window.location.href.split("#");
    if(window_href_values.length > 1 && window_href_values[1] != "")
    {
        /*We will ignore the database related cookie if we are provided with a route*/
        useProvidedRoute(); // this should only be called when opening the webpage
    }
    //reading from the cookie file:
    else if(document.cookie.length > 0)
    {
        restoreDBSingleSelectionCookie();
    }
    showTable();
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
        for(var i = 0; i < programming_language_selection.children.length; i++)
        {
            programming_language_selection.children[i].value = false;
            programming_language_selection.children[i].style = tag_selection_off;
            updateCookie(programming_language_selection.children[i].innerHTML, programming_language_selection.children[i].value);
        }
        //Selecting only the languages specified by the route:
        for(var i = 0; i < languages.length; i++)
        {
            var matchIndex = programming_languages.findIndex(element => String(element.name).toLowerCase() == String(languages[i]).toLowerCase());
            if(matchIndex >= 0 )
            {
                /*programming_language_selection has one less index compared to programming_languages because 
                General-Programming-Knowledge is not available for selection */
                if(programming_language_selection.children[matchIndex-1].value == false)
                {
                    //if element specified via the routing is found and is deselected we will select it
                    programming_language_selection.children[matchIndex-1].click(); 
                    //click will select this item and deselect all others
                }
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
                }
            }
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
            var language_index = programming_languages.findIndex(element => String(element.name) == String(pairs[1]))
            if(language_index >= 0 )
            {
                 /*
                    programming_language_selection is built based on programming_languages without General-Programming-Knowledge. 
                    programming_language_selection has 1 less element compared to programming_languages so 1 less index.
                */
                language_index-=1;
                programming_language_selection.children[language_index].click(); 
                //click will select this item and deselect all others
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
                concept_selection.children[concept_index].click(); 
                //click will select this item and deselect all others
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
            var xml_tag_content = xml_Document.getElementsByTagName("programming_language");

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
                programming_languages.push(Programming_Lang);
            }
            
            /*Adding the overall concept selection functions*/
            overall_concept_selection.appendChild( createLiElement("deselect all", true, deselectionOfAllConceptElements) );
            overall_concept_selection.appendChild( createLiElement("select all", true, selectionOfAllConceptElements) );
            
            //Adding programming languages to the selection
            for(var index=0; index< programming_languages.length; index++)
            {
                /*Grabbing all concepts available for all the programming languages*/
                /*Ignore everything for General-Programming-Knowledge*/
                if(programming_languages[index].name != "General-Programming-Knowledge")
                {
                    if(index==1) //display only 3 columns in the table by default -> General-Programming-Knowledge is not gonna be visible
                    {
                        /*Adding the programming language selection*/                
                        for(var concept_index=0; concept_index< programming_languages[index].concepts.length; concept_index++)
                        {
                            if(concept_index == 0)
                            {
                                concept_selection.appendChild(createLiElement(programming_languages[index].concepts[concept_index].concept_name, true, conceptSelectionBehavior));
                            }
                            else
                            {
                                concept_selection.appendChild(createLiElement(programming_languages[index].concepts[concept_index].concept_name, false, conceptSelectionBehavior));
                            }
                            concept_collection.push(programming_languages[index].concepts[concept_index].concept_name);
                        }
                        programming_language_selection.appendChild(createLiElement(programming_languages[index].name, true, languageSelectionBehaviour));
                    }
                    else
                    {
                        programming_language_selection.appendChild(createLiElement(programming_languages[index].name, false, languageSelectionBehaviour));
                    }
                }
            }
            /*read cookie and/or handle the display of the elements*/
            dbCookieRouteHandling();
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
    for(var index=0; index < programming_languages.length; index++)
    {
        for(var lang_selection_index=0; lang_selection_index < programming_language_selection.children.length; lang_selection_index++)
        {
            /*check if the language is selected to be displayed*/
            if(programming_language_selection.children[lang_selection_index].innerHTML == programming_languages[index].name && programming_language_selection.children[lang_selection_index].value==true)
            {
                /*Insert a new row for each language title selected to be displayed*/
                row = table_content.insertRow();
                cell = row.insertCell();
                cell.innerHTML = programming_languages[index].name;
                cell.style = language_title_style;
                cell.style.paddingTop = "1%";
                /*For each concept the language has*/
                for(var concept_index=0; concept_index < concept_collection.length; concept_index++)
                {
                    /*If the concept is selected to be displayed*/
                    if(concept_collection[concept_index] == concept_selection.children[concept_index].innerHTML &&
                        concept_selection.children[concept_index].value == true)
                    {
                        var found_element_index =  programming_languages[index].concepts.findIndex(element => element.concept_name ==concept_collection[concept_index]);
                        
                        /*
                        The findIndex() method of Array instances returns the index of the first element in an 
                        array that satisfies the provided testing function. If no elements satisfy the testing 
                        function, -1 is returned.
                        */
                        row = table_content.insertRow();
                        cell = row.insertCell(); //empty cell

                        /*Insert the concept name within the cell*/
                        var p = document.createElement("p");
                        p.innerHTML = concept_collection[concept_index] + ":";
                        p.style = concept_title_style;
                        cell.appendChild(p);
                        p = document.createElement("p");
                        /*If the concept exists for this language*/
                        if(found_element_index >= 0) 
                        {
                            p.innerHTML += programming_languages[index].concepts[found_element_index].concept_value;
                            checkCopyConceptFromGeneralKnowledge(p, programming_languages[index].concepts[found_element_index]);
                                                    
                        }
                        else
                        {
                            p.innerHTML += "NA";
                        }
                        p.style = concept_value_style;
                        cell.appendChild(p);
                        cell.style = cell_style;
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
    for(var index=0; index < this.parentElement.children.length; index++)
    {
        var opacity = this.parentElement.children[index].style.opacity;
        if(this.parentElement.children[index] != this)
        {
            this.parentElement.children[index].value = false;
            this.parentElement.children[index].style = tag_selection_off;
        }
        else
        {
            this.value = true;
            this.style = tag_selection_on;
        }
        this.parentElement.children[index].style.opacity = opacity;
    }
    allConceptsSelection = false;
    window.scrollTo(0, 400);
    showTable();
    updateRoute();
}

function languageSelectionBehaviour()
{
    /*This function describes the behaviour of a language li element*/

    //Deselect the old item and select the new one:
    for(var index=0; index < this.parentElement.children.length; index++)
    {
        if(this.parentElement.children[index] != this)
        {
            this.parentElement.children[index].value = false;
            this.parentElement.children[index].style = tag_selection_off;
        }
        else
        {
            this.value = true;
            this.style = tag_selection_on;
        }
    }
    
    /*get the language item and enable / disable the concepts within*/
    var active_language = programming_languages.find(element => element.name == this.innerHTML);
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
            concept_selection.children[0].remove()
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
    updateCookie("SingleSelectionLanguage", this.innerHTML);
    
    showTable();
    updateRoute();
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
            
            var found_element_index = programming_languages.findIndex(element => element.name == "General-Programming-Knowledge");
            if( found_element_index >= 0 )
            {
                var found_concept = programming_languages[found_element_index].concepts.findIndex(element => element.concept_name == concept.concept_name);
                if( found_concept >= 0 )
                {
                    html_element.innerHTML = String(html_element.innerHTML).replace(copy_GeneralKnowledge_token, programming_languages[found_element_index].concepts[found_concept].concept_value);
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

    for(var i=0; i<programming_language_selection.children.length; i++)
    {
        if(programming_language_selection.children[i].value == true)
        {
            routeString += programming_language_selection.children[i].innerHTML + "_";
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

//Restore the cookies which can be restored before accessing the database
restoreCookiePredefinedElements();

loadXMLDoc(online_xml_file)
