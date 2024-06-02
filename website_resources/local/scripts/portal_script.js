const online_xml_file = "https://raw.githubusercontent.com/dragos-vacariu/portfolio/main/programming_languages_database.xml";
const programming_languages = [];
const programming_language_selection = document.getElementById("programming_language_selection");
const concept_collection = [];
const concept_selection = document.getElementById("concept_selection");
const overall_concept_selection = document.getElementById("overall_concept_selection");
const overall_language_selection = document.getElementById("overall_language_selection");
const cookie_element_separator = "<br>"; 
const searchBox = document.getElementById("SearchBox");
const searchType = document.getElementById("searchType");

const disabledElementOpacity = 0.3;

//different styles for list tag selection:
const tag_selection_on = "background-image: linear-gradient(to right, #aa7700, #995500); color: white; border-color: white; text-shadow: 1px 1px black";
const tag_selection_off = "background-image: linear-gradient(to right, white, #ffeecc); color: #995500; border-color: black; text-shadow: 0.4px 0.4px black";

const copy_GeneralKnowledge_token = "*General-Programming-Knowledge*";

const view_selection = document.getElementById("view_selection");
const page_selection = document.getElementById("page_selection");
const selection_type = document.getElementById("selection_type");

/*Adding page selection buttons*/
page_selection.appendChild( createLiElement("Modern", true, changeToModernPage) );
page_selection.appendChild( createLiElement("Classic", false, changeToClassicPage) );

/*Adding view selection buttons*/
view_selection.appendChild(createLiElement("regular", false, switchToRegularView));
view_selection.appendChild(createLiElement("multi-compare", true, switchToCompareView));

/*Adding selection type buttons*/
selection_type.appendChild(createLiElement("single", true, switchSelectionTypeSingle));
selection_type.appendChild(createLiElement("multiple", false, switchSelectionTypeMultiple));

const table_content = document.getElementById("table_content");

const language_title_style = "color: #663300; font-family: Tahoma; font-size: 20px; text-align: center; text-transform: uppercase; border: outset 1px rgba(143,55,0, 0.1); width: 98%; padding: 1%; margin: 1% 0%; background-image: radial-gradient(circle, rgba(255,255,255,0.3), rgba(143,55,0, 0.2)); letter-spacing: 2px;";
const concept_title_style = "color: darkred; font-family: Tahoma; font-size: 18px; text-align: left; text-transform: capitalize; border: double 1px rgba(143,55,0, 0.1); width: 98%; padding: 1%; margin: 0%; background-image: linear-gradient(to right, rgba(255,255,255,0.4), rgba(255,255,255,0.1)); letter-spacing: 1px; ";
const concept_value_style = "color: #663300; font-family: Tahoma; font-size: 15px; text-align: left; text-transform: none; border: solid 1px rgba(143,55,0, 0.1); width: 98%; padding: 1%; margin: 0%;";
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
        if(selection_type.children[0].value == true) //if single selection type
        {
            restoreDBSingleSelectionCookie();
        }
        else //enter here on multiple selection type
        {
            restoreDBMultipleSelectionCookie();
        }
    }
    /*set the view with default values*/
    setSelectionType(); // this will set the selection and the view
}

function useProvidedRoute()
{
    /*This function will use the provided route to select the specified elements*/
    var window_href_values = window.location.href.split("#");
    var routes = window_href_values[1].split("@");
    if(routes.length > 0 && routes[0] != "")
    {
        //routes[0] usually should store the selection type
        //if the route was messed around, nothing will happen
        if(selection_type.children[0].innerHTML == routes[0])
        {
            /*Activate selection type: single*/
            selection_type.children[0].value = true;
            selection_type.children[1].value = false;
            selection_type.children[0].style = tag_selection_on;
            selection_type.children[1].style = tag_selection_off;
        }
        else if(selection_type.children[1].innerHTML == routes[0])
        {
            /*Activate selection type: multiple*/
            selection_type.children[0].value = false;
            selection_type.children[1].value = true;
            selection_type.children[0].style = tag_selection_off;
            selection_type.children[1].style = tag_selection_on;
        }
    }
    if(routes.length > 1 && routes[1] != "")
    {
        //We have active languages that we need to set
        var items = routes[1].split("&")
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
            deselectionOfAllLanguageElements();
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
                        programming_language_selection.children[matchIndex-1].value = true
                        programming_language_selection.children[matchIndex-1].style = tag_selection_on
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
                if(view != "")
                {
                    //If there is a view switch to the view
                    if(view == view_selection.children[0].innerHTML)
                    {
                        switchToRegularView();
                    }
                    else if(view == view_selection.children[1].innerHTML)
                    {
                        switchToCompareView();
                    }
                }
            }
            //Deselect all concepts
            deselectionOfAllConceptElements();
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
}

function restoreCookiePredefinedElements()
{
    /*
        Restoring the values from the cookie for elements defined outside the database.
        These cookies should be restored instantly as they don't have to wait until the HTTP Request is ready
    */
    
    var cookie_elements = document.cookie.split(cookie_element_separator);
    var foundPageView = cookie_elements.findIndex(element => String(element) == "page=classic");
    var foundViewSelection = cookie_elements.find(element => String(element).split("=")[0] == "view");
    var foundSelectionType = cookie_elements.find(element => String(element).split("=")[0] == "selection");
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
        window.location.href = "./portal_classic.html";
        /*Page will change and script run will stop*/
    }
    if(foundViewSelection != undefined) //if view selection found amongst cookies
    {
        if(foundViewSelection.split("=")[1] == "compare")
        {
            //Set compare view to true
            switchToCompareView();
        }
        else
        {
            //Set regular view to true
            switchToRegularView();
        }
    }
    if(foundSelectionType != undefined) //if selection type found amongst cookies
    {        
        /*if selection type is single*/
        if(foundSelectionType.split("=")[1] == selection_type.children[0].innerHTML)
        {
            selection_type.children[0].value = true;
            selection_type.children[1].value = false;
            selection_type.children[0].style = tag_selection_on;
            selection_type.children[1].style = tag_selection_off;
        }
        else
        {
            selection_type.children[0].value = false;
            selection_type.children[1].value = true;
            selection_type.children[0].style = tag_selection_off;
            selection_type.children[1].style = tag_selection_on;
        }
    }
    setSelectionType();
}

function restoreDBMultipleSelectionCookie()
{
    /*Restoring values from the cookie for Selection Type Multiple for elements added based on Database*/
    var cookie_elements = document.cookie.split(cookie_element_separator);
    
    for(var i=0; i<cookie_elements.length; i++)
    {
        var pairs = cookie_elements[i].split("=");
        
        //Process and restore the values stored in the cookie
        
        //Checking if pairs[0] is a CONCEPT:
        var concept_index = concept_collection.findIndex(element => element == pairs[0]);
        
        /*
        The findIndex() method of Array instances returns the index of the first element in an 
        array that satisfies the provided testing function. If no elements satisfy the testing 
        function, -1 is returned.
        */
        
        if(concept_index >= 0)
        {
            /*The concept_selection.children were added based on concept_collection array. 
            So they wear same index.
            */
            if(pairs[1]=="1") // if element was selected
            {
                concept_selection.children[concept_index].value = true;
                concept_selection.children[concept_index].style = tag_selection_on;
            }
            else
            {
                concept_selection.children[concept_index].value = false;
                concept_selection.children[concept_index].style = tag_selection_off;
            }
        }
        else
        {
            //Checking if pairs[0] is a LANGUAGE:
            var language_index = -1;
            for(var lang_sel_index = 0; lang_sel_index < programming_language_selection.children.length; lang_sel_index++)
            {
                if(pairs[0] == programming_language_selection.children[lang_sel_index].innerHTML)
                {
                    language_index = lang_sel_index;
                    break;
                }
            }
            if( language_index >= 0 )
            {
                if(pairs[1]=="1")
                {
                    programming_language_selection.children[language_index].value = true;
                    programming_language_selection.children[language_index].style = tag_selection_on;
                }
                else
                {
                    programming_language_selection.children[language_index].value = false;
                    programming_language_selection.children[language_index].style = tag_selection_off;
                }
            }
        }
    }
    setSelectionType();
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
    //console.log("Cookie Update.");
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
            
            /*formatting the xml_Document content*/
            xml_Document = format_XML_Document_Content(xml_Document);
            
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
            
            /*Adding the overall language selection functions*/
            overall_language_selection.appendChild( createLiElement("deselect all", true, deselectionOfAllLanguageElements) );
            overall_language_selection.appendChild( createLiElement("select all", true, selectionOfAllLanguageElements) );
            
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
                    /*Adding the programming language selection*/                
                    for(var concept_index=0; concept_index< programming_languages[index].concepts.length; concept_index++)
                    {
                        if(concept_collection.includes(programming_languages[index].concepts[concept_index].concept_name) == false)
                        {
                            concept_collection.push(programming_languages[index].concepts[concept_index].concept_name);
                        }
                    }
                    if(index<4) //display only 3 columns in the table by default -> General-Programming-Knowledge is not gonna be visible
                    {
                        programming_language_selection.appendChild(createLiElement(programming_languages[index].name, true, languageSelectionBehaviour));
                    }
                    else
                    {
                        programming_language_selection.appendChild(createLiElement(programming_languages[index].name, false, languageSelectionBehaviour));
                    }
                }
            }
            /*Adding the concept collection to selection*/
            for(var i=0; i< concept_collection.length; i++)
            {
                concept_selection.appendChild(createLiElement(concept_collection[i], true, conceptSelectionBehavior));
            }
            /*read cookie and/or hanndle the display of the elements*/
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
    if(view_selection.children[0].value == true)
    {
        /*View selection is Regular*/
        fillTableRegular();
    }
    else
    {
        /*View selection is Dual Compare*/
        fillTableCompare();
    }
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

function fillTableCompare()
{   
    /*This function will fill the table in multiple columns to allow comparison*/
    
    //Calculate the number of columns to be displayed
    var active_columns = 0; 
    for(var j=0; j<programming_language_selection.children.length; j++)
    {
        if(programming_language_selection.children[j].value == true)
        {
            active_columns++;
        }
    }
    //Draw the first raw in the table (also known as table header)
    
    //Draw a column for the concept - the first row cell in the concept column will be empty
    var row = table_content.insertRow();
    var cell = null;
    //Draw separate column for each programming language selected to be displayed
    for(var index=0; index < programming_languages.length; index++)
    {        
        /*check if language is selected to be displayed*/
        for(var i=0; i < programming_language_selection.children.length; i++)
        {
            if(programming_language_selection.children[i].innerHTML == programming_languages[index].name &&
                programming_language_selection.children[i].value==true)
            {
                cell = row.insertCell();
                cell.innerHTML = programming_languages[index].name;
                cell.style = language_title_style;
                cell.style.width = String(100 / active_columns + "%");
            }
        }
    }
    
    //draw the rest of the table
    for(var concept_index=0; concept_index < concept_collection.length; concept_index++)
    {
        if(concept_collection[concept_index] == concept_selection.children[concept_index].innerHTML &&
            concept_selection.children[concept_index].value == true)
        {
            /*Insert a new row for each concept selected to be displayed*/
            row = table_content.insertRow();
            
            /*For each language in the table selected to be displayed - insert a column*/
            for(var index=0; index < programming_languages.length; index++)
            {
                for(var lang_selection_index=0; lang_selection_index < programming_language_selection.children.length; lang_selection_index++)
                {
                    /*check if the language is selected to be displayed*/
                    if(programming_language_selection.children[lang_selection_index].innerHTML == programming_languages[index].name && programming_language_selection.children[lang_selection_index].value==true)
                    {
                        var found_element_index =  programming_languages[index].concepts.findIndex(element => element.concept_name ==concept_collection[concept_index]);
                        
                        /*
                        The findIndex() method of Array instances returns the index of the first element in an 
                        array that satisfies the provided testing function. If no elements satisfy the testing 
                        function, -1 is returned.
                        */
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
                            p.innerHTML = programming_languages[index].concepts[found_element_index].concept_value;
                            
                            //Don't copy general knowledge on compare. As those informations are available to all languages.
                            p.innerHTML = String(p.innerHTML).replace(copy_GeneralKnowledge_token, "");
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
    /*This function describes the behaviour of a concept li element*/
    if(selection_type.children[0].value == true)
    {
        //opacity is used to specify whether a concept is available or not for the selected programming language
        if(this.style.opacity != disabledElementOpacity) //if opacity != 0.3, it means concept is available for this programming language
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
            updateCookie("SingleSelectionConcept", this.innerHTML);
        }
        //each time a new item is selected just scroll to the beggining
        window.scrollTo(0, 400);
    }
    else if(selection_type.children[1].value == true)
    {
        if(this.value == true)
        {
            this.value = false;
            this.style = tag_selection_off;
        }
        else
        {
            this.value = true;
            this.style = tag_selection_on;
        }
        updateCookie(this.innerHTML, this.value);
    }
    showTable();
    updateRoute();
}

function languageSelectionBehaviour()
{
    /*This function describes the behaviour of a language li element*/
    //if Selection type is single:
    if (selection_type.children[0].value == true)
    {
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
            for(var index=0; index < concept_selection.children.length; index++)
            {
                //Check if concept exists for the active language
                var elementIndex = active_language.concepts.findIndex(element => element.concept_name == concept_selection.children[index].innerHTML)
                if(elementIndex < 0)
                {
                    /*This opacity style will make them look disabled.*/
                    concept_selection.children[index].style.opacity = disabledElementOpacity;
                }
                else
                {
                    /*This opacity will ensure that the element is enabled.*/
                    concept_selection.children[index].style.opacity = 1;
                }
            }
        }
        updateCookie("SingleSelectionLanguage", this.innerHTML);
    }
    //If Selection type is multiple and view is whatever:
    else
    {
        //Allow multiple selections
        if(this.value == true)
        {
            this.value = false;
            this.style = tag_selection_off;
        }
        else
        {
            this.value = true;
            this.style = tag_selection_on;
        }
        updateCookie(this.innerHTML, this.value);
    }
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
    showTable();
    updateRoute();
}

function deselectionOfAllLanguageElements() 
{
    /*This function will describe the behavior of deselect all button within the Overall Language Selection.*/
    for(var i = 0; i < programming_language_selection.children.length; i++)
    {
        programming_language_selection.children[i].value = false;
        programming_language_selection.children[i].style = tag_selection_off;
        updateCookie(programming_language_selection.children[i].innerHTML, programming_language_selection.children[i].value);
    }
    showTable();
    updateRoute();
}

function selectionOfAllLanguageElements() 
{
    /*This function will describe the behavior of select all button within the Overall Language Selection.*/
    for(var i = 0; i < programming_language_selection.children.length; i++)
    {
        programming_language_selection.children[i].value = true;
        programming_language_selection.children[i].style = tag_selection_on;
        updateCookie(programming_language_selection.children[i].innerHTML, programming_language_selection.children[i].value);
    }
    showTable();
    updateRoute();
}

function switchToRegularView()
{
    //This function will change the view to Regular
    
    //Check if compare view is true
    if(view_selection.children[1].value == true)
    {
        //Toggle the selection
        for(var i = 0; i < view_selection.children.length; i++)
        {
            if (i != 0)
            {
                view_selection.children[i].value = false;
                view_selection.children[i].style = tag_selection_off;
            }
            else
            {
                view_selection.children[i].value = true;
                view_selection.children[i].style = tag_selection_on;
            }
        }
        showTable();
        updateCookie("view", "regular");
        updateRoute();
    }
}

function switchToCompareView()
{
    //This function will change the view to Multi-Compare
    
    //Check if regular view is true and selection type is multiple else this mode will be unavailable
    if(view_selection.children[0].value == true && selection_type.children[1].value == true)
    {
        //toggle switches
        for(var i = 0; i < view_selection.children.length; i++)
        {
            if (i != 1)
            {
                view_selection.children[i].value = false;
                view_selection.children[i].style = tag_selection_off;
            }
            else
            {
                view_selection.children[i].value = true;
                view_selection.children[i].style = tag_selection_on;
            }
        }
        showTable();
        updateCookie("view", "compare");
        updateRoute();
    }
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

function format_XML_Document_Content(xml_Document_Content)
{   
    //This function will format the Database code elements by adding lineNumbers and Comment Styles
    var codeElements =  xml_Document_Content.getElementsByTagName("code");    
    for(var index = 0; index < codeElements.length; index++)
    {
        
        //Format the code elements with different style.
        var lines = codeElements[index].innerHTML.split("\n");
        
        lines = formatMultiLineComments(lines);
        for(var i=0; i < lines.length; i++)
        {
            //Format the comments within the code elements with different style.
            lines[i] = formatSingleLineComments(lines[i]);
            var spaces = " ".repeat(4-String(i).length);
            
            //Add line numbers:
            if(lines.length > 1) // do not add line number to single-line content
            {
                //Insert lineNumber and content in different table columns
                lines[i] = "<tr>" + "<td style='width:26px; text-align:left; padding:0px;" +
                "margin:0px; border: solid 1px rgba(0,0,0,0.1);'>" +
                "<lineNumber>" + i + spaces + "</lineNumber>" + "</td>" + 
                "<td style='text-align:left; padding:0px; margin:0px;'>" + lines[i] + 
                "</td>" + "</tr>";
            }
        }
        //if we have multiline code means we need to use table as we've added LineNumbers
        if(lines.length > 1)
        {
            codeElements[index].innerHTML = "<table>" + lines.join("\n") + "</table>";
        }
        else
        {
            codeElements[index].innerHTML = lines.join("\n");
        }
        
        //Put the code elements with more than 2 lines into a box
        if(codeElements[index].innerHTML.split("\n").length > 2)
        {
            codeElements[index].innerHTML = addStyleCodeBoxes(codeElements[index].innerHTML);
        }
    }
    
    return xml_Document_Content;
}

function addStyleCodeBoxes(contentToPutInBox)
{
    //This function will draw a box around the code elements
    contentToPutInBox = "<box>" + contentToPutInBox + "</box>"
    return contentToPutInBox;
}

function formatSingleLineComments(line)
{
    /*This function will format/style single line comments in all programming languages*/
    
    //use if instead of if-else as the line can contain all of them at the same time.
    
    if(String(line).includes("//")) // do not add line number to single-line content
    {
        line = line.replace("//", "<comment>//");
        line = line + "</comment>";
    }
    
    if(String(line).includes("/*") && String(line).includes("*/"))
    {
        line = line.replace("/*", "<comment>/*");
        line = line.replace("*/", "*/</comment>");
        multiline_comment=true;
    }
    //if Python Comment
    if( String(line).includes("#") == true && 
        String(line).includes("#define")==false && 
        String(line).includes("#include")==false &&
        String(line).includes("#ifndef")==false &&
        String(line).includes("#undef")==false &&
        String(line).includes("#if")==false &&
        String(line).includes("#pragma")==false &&
        String(line).includes("#error")==false &&
        String(line).includes("#region")==false &&
        String(line).includes("#endregion")==false &&
        String(line).includes("#endif")==false &&
        String(line)!="#" //if not empty #
        )
    {
        line = line.replace("#", "<comment>#");
        line = line + "</comment>";
    }
    
    return line;
}

function formatMultiLineComments(codeElementListOfLines)
{
    //This function will format multiline_comments in all programming languages
    
    var multiline_comment_found = 0;

    for(var i=0; i < codeElementListOfLines.length; i++)
    {
        //if comment on multiple lines
        if(String(codeElementListOfLines[i]).includes("/*") && 
            String(codeElementListOfLines[i]).includes("*/") == false)
        {
            codeElementListOfLines[i] = codeElementListOfLines[i].replace("/*", "<comment>/*");
            codeElementListOfLines[i] = codeElementListOfLines[i] + "</comment>";
            multiline_comment_found++;
        }
        else if (String(codeElementListOfLines[i]).includes("*/") && multiline_comment_found > 0)
        {
            codeElementListOfLines[i] = codeElementListOfLines[i].replace("*/", "*/</comment>");
            codeElementListOfLines[i] = "<comment>" + codeElementListOfLines[i];
            multiline_comment_found--;
        }
        else if(multiline_comment_found > 0)
        {
            codeElementListOfLines[i] = "<comment>" + codeElementListOfLines[i] + "</comment>";
        }

    }
    return codeElementListOfLines;
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

function switchSelectionTypeSingle()
{
    //This function will switch the Selection Type from Multiple to Single
    
    //Check if selection type is not single
    if(selection_type.children[0].value != true)
    {
        for(var i = 0; i < selection_type.children.length; i++)
        {
            if (i != 0) 
            {
                selection_type.children[i].value = false;
                selection_type.children[i].style = tag_selection_off;
            }
            else
            {
                selection_type.children[i].value = true;
                selection_type.children[i].style = tag_selection_on;
            }
        }
        updateCookie("selection", selection_type.children[0].innerHTML);
        //Restore the selection stored in Cookie, if any
        if(document.cookie.length > 0)
        {
            restoreDBSingleSelectionCookie();
        }
        setSelectionType();
        updateRoute();
    }
}

function switchSelectionTypeMultiple()
{
    //This function will switch the Selection Type from Single to Multiple
    
    //Check if selection type is not multiple
    if(selection_type.children[1].value != true)
    {
        for(var i = 0; i < selection_type.children.length; i++)
        {
            if (i != 1)
            {
                selection_type.children[i].value = false;
                selection_type.children[i].style = tag_selection_off;
            }
            else
            {
                selection_type.children[i].value = true;
                selection_type.children[i].style = tag_selection_on;
            }
        }
        updateCookie("selection", selection_type.children[1].innerHTML);
        //Restore the selection stored in Cookie, if any
        if(document.cookie.length > 0)
        {
            restoreDBMultipleSelectionCookie();
        }
        setSelectionType();
        updateRoute();
    }
}

function setSelectionType()
{
    //This function will set everything for the Selection Type which was selected prior to it.
    
    //if selection type is single
    if(selection_type.children[0].value == true)
    {
        /*Selection type: multiple gets deselected and gets the disabled opacity while Selection type: 
            single gets selected and active*/
        view_selection.children[1].value = false;
        view_selection.children[1].style = tag_selection_off;
        view_selection.children[1].style.opacity = disabledElementOpacity;
        view_selection.children[0].value = true;
        view_selection.children[0].style = tag_selection_on;
        //Hide the overall selection elements;
        if (overall_concept_selection.getAttribute("hidden")==false ||
            overall_concept_selection.getAttribute("hidden")==null) 
        {
            overall_concept_selection.setAttribute("hidden", "hidden");
            document.getElementById("overall_concept_selection_title").setAttribute("hidden", "hidden");
        }
        if (overall_language_selection.getAttribute("hidden")==false ||
            overall_language_selection.getAttribute("hidden")==null) 
        {
            overall_language_selection.setAttribute("hidden", "hidden");
            document.getElementById("overall_language_selection_title").setAttribute("hidden", "hidden");
        }
        /*
            Get the active language. There should be only one active language selected 
            since Cookie values were restored in the switchSelectionTypeSingle() 
        */
        var active_languages = getActiveElements(programming_language_selection.children);
        var active_concepts = getActiveElements(concept_selection.children)
        if(active_concepts.length > 1) //this condition should always be true
        {
            /*if more than once concept is selected, deselect all except the first*/
            active_concepts[0].click();
        }
        var active_language = undefined
        if(active_languages.length > 0) //should only be one element stored in active_languages
        {
            //If there is more than a single element selected.
            if(active_languages.length > 1)
            {
                //we will make sure any other active languages and concepts will be deselected
                active_languages[0].click();
            }
            active_language = programming_languages.find(element=> element.name == active_languages[0].innerHTML);
        }
        //For the selected language check all concepts for the selection and if they are not available
        //for the selected language change their opacity to look disabled and unselectable
        for(var index=0; index < concept_selection.children.length; index++)
        {
            //Check if concept exists for the active language
            if(active_language != undefined)
            {
                var elementIndex = active_language.concepts.findIndex(element => element.concept_name == concept_selection.children[index].innerHTML)
                if(elementIndex < 0)
                {
                    /*This opacity style will make them look disabled.*/
                    concept_selection.children[index].style.opacity = disabledElementOpacity;
                }
            }
        }
    }
    else if(selection_type.children[1].value == true)
    {
        /*Selection type: multiple gets the enabled opacity*/
        view_selection.children[1].style.opacity = 1;
        //Show the overall selecton elements;
        if (overall_concept_selection.getAttribute("hidden")=="hidden") 
        {
            overall_concept_selection.removeAttribute("hidden");
            document.getElementById("overall_concept_selection_title").removeAttribute("hidden", "hidden");
        }
        if (overall_language_selection.getAttribute("hidden")=="hidden") 
        {
            overall_language_selection.removeAttribute("hidden");
            document.getElementById("overall_language_selection_title").removeAttribute("hidden", "hidden");
        }
        /*Remove the opacity so that all elements look enabled and become selectable*/
        for(var index=0; index < concept_selection.children.length; index++)
        {
            concept_selection.children[index].style.opacity = 1;
        }
    }
    showTable();
}

function updateRoute()
{
    var routeString = "";
    //Add the selection type to the route
    if(selection_type.children[0].value==true)
    {
        routeString += selection_type.children[0].innerHTML;
    }
    else
    {
        routeString += selection_type.children[1].innerHTML;
    }
    routeString += "@";
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
    if(view_selection.children[0].value==true)
    {
        routeString += "%" + view_selection.children[0].innerHTML;
    }
    else
    {
        routeString += "%" + view_selection.children[1].innerHTML;
    }
    //workaround for C# because it uses # which has special meaning.
    routeString = routeString.replaceAll("C#", "CSharp"); //we cannot use # within the route as it has special meaning
    var href = window.location.href .split("#")[0];
    window.location.href = href + "#" + routeString;
}

function wordMatchingSearch()
{
    //Refilling the table with the results:
    var row = table_content.insertRow();
    var cell = row.insertCell();
    //inserting the name of the language:
    cell.innerHTML = searchType[1].innerHTML  + " results found:";
    //Matching words search type is currently the index 1 within the options list.
    cell.style = language_title_style;
    cell.style.paddingTop = "1%";
    var result_counter = 0;

    //Adding word for word searching to improve the overall results:
    searchBox_value = searchBox.value.trim().split(" "); //trim() will remove whitespaces from the beggining and end of the string
    //Getting the unique findings to optimize the upcoming loops
    searchBox_value = [...new Set(searchBox_value)];
    
    for(var i=0; i < programming_languages.length; i++)
    {
        for(var j=0; j < programming_languages[i].concepts.length; j++)
        {
            var sentences = programming_languages[i].concepts[j].concept_value;
            //Hide the replacement token for General-Programming-Knowledge
            sentences = sentences.replaceAll("*General-Programming-Knowledge*", "");
            //<br> and </br> elements within the database are seen as <br/>
            sentences = sentences.split("<br/>");
            var concept_result_counter = 0; //will count how many appearences found in current concept
            for(var k=0; k < sentences.length; k++)
            {
                var isFinding = true;
                for(var word_index = 0; word_index < searchBox_value.length; word_index++)
                {
                    if(String(sentences[k].toLowerCase()).includes(String(searchBox_value[word_index]).toLowerCase()))
                    {
                        continue;
                    }
                    else
                    {
                        //if any word in the search value cannot be found amongst the sentences then this is not a finding
                        isFinding = false;
                        break;
                    }
                }
                //If there is a finding matching the searched value add it to the search results
                if(isFinding == true)
                {
                    row = table_content.insertRow();
                    cell = row.insertCell(); //empty cell
                    
                    /*We will insert the name of the concept only once*/
                    if(concept_result_counter==0)
                    {
                        /*Insert the concept name within the cell*/
                        var p = document.createElement("p");
                        p.innerHTML = programming_languages[i].name + " - " + programming_languages[i].concepts[j].concept_name + ":";
                        p.style = concept_title_style;
                    }
                    
                    //Format the text by adding highlights on every finding:
                    var concept_words = sentences[k].trim().split(" ")
                    
                    //Put case-insesitive findings between <searchHighlight> tags. This will allow us to highlight the findings word for word
                    for(var word_index = 0; word_index < searchBox_value.length; word_index++)
                    {
                        //var pattern = new RegExp(String(searchBox_value[word_index]), 'gi');
                        //p.innerHTML = p.innerHTML.replaceAll(pattern, "<searchHighlight>" + String(searchBox_value[word_index]) + "</searchHighlight>") // works for finding the case-insesitive item but does not work for replacing it
                        
                        for (var counter = 0; counter < concept_words.length; counter++)
                        {
                            //if some word includes the one of the value within the searchBox
                            if(String(concept_words[counter]).toLowerCase().includes(String(searchBox_value[word_index]).toLowerCase()) // this will ensure that we search case insesitive values
                               && String(concept_words[counter]).includes("<") == false && String(concept_words[counter]).includes(">") == false // this will ensure that we don't modify the html / xml tags
                             )
                            {
                                //get the index of the searchBox substring value within the word
                                var index = String(concept_words[counter]).toLowerCase().indexOf(String(searchBox_value[word_index]).toLowerCase());
                                
                                //Slicing the word to pieces to add the searchHeighlight to the finding within it.
                                //This way we will maintain the case sensitiveness intact.
                                var replacement = concept_words[counter].slice(0, index);
                                replacement += "<searchHighlight>" + concept_words[counter].slice(index, index + searchBox_value[word_index].length) + "</searchHighlight>";
                                replacement += concept_words[counter].slice(index + searchBox_value[word_index].length);
                                concept_words[counter] = replacement;
                            }
                        }
                    }
                    
                    //inserting the sentence
                    cell.appendChild(p);
                    p = document.createElement("p");
                    p.innerHTML = concept_words.join(" ");
                    
                    //Add styling to the cell
                    p.style = concept_value_style;
                    cell.appendChild(p);
                    cell.style = cell_style;
                    
                    //Increase the counters
                    result_counter++;
                    concept_result_counter++;
                }
            }
        }
    }
    //Add to first row of the table of the number of results
    table_content.rows[0].cells[0].innerHTML = result_counter + " " + table_content.rows[0].cells[0].innerHTML;
}

function ContextualSearch()
{
    //contextual search means we search exactly the searchBox_value;
    
    //Refilling the table with the results:
    var row = table_content.insertRow();
    var cell = row.insertCell();
    //inserting the name of the language:
    cell.innerHTML = searchType[0].innerHTML + " results found:";
    cell.style = language_title_style;
    cell.style.paddingTop = "1%";
    var result_counter = 0;

    for(var i=0; i < programming_languages.length; i++)
    {
        for(var j=0; j < programming_languages[i].concepts.length; j++)
        {
            var sentences = programming_languages[i].concepts[j].concept_value;
            //Hide the replacement token for General-Programming-Knowledge
            sentences = sentences.replaceAll("*General-Programming-Knowledge*", "");
            //<br> and </br> elements within the database are seen as <br/>
            sentences = sentences.split("<br/>");
            var concept_result_counter = 0; //will count how many appearences found in current concept
            for(var k=0; k < sentences.length; k++)
            {
                if(String(sentences[k].toLowerCase()).includes(String(searchBox.value).trim().toLowerCase()))
                {
                    row = table_content.insertRow();
                    cell = row.insertCell(); //empty cell
                    
                    /*We will insert the name of the concept only once*/
                    if(concept_result_counter==0)
                    {
                        /*Insert the concept name within the cell*/
                        var p = document.createElement("p");
                        p.innerHTML = programming_languages[i].name + " - " + programming_languages[i].concepts[j].concept_name + ":";
                        p.style = concept_title_style;
                    }
                    
                    //Format the text by adding highlights on every finding:
                    var concept_words = sentences[k].trim().split(" ")
                    
                    var searchBox_value = searchBox.value.trim().split(" ");
                    //trim() will remove whitespaces from the beggining and end of the string
                    //searchBox.value will be converted according to our needs to facilitate best search
                    
                    //Format the text by adding highlights on every finding:
                    
              //      for (var counter = 0; counter < concept_words.length; counter++)
              //      {
              //          //if some word includes the first word in the search box
              //         if(String(concept_words[counter]).toLowerCase().includes(String(searchBox_value[0]).toLowerCase()) // this will ensure that we search case insesitive values
              //             && String(concept_words[counter]).includes("<") == false && String(concept_words[counter]).includes(">") == false // this will ensure that we don't modify the html / xml tags
              //           )
              //          {
              //              //first word checked and is matching
              //              var wordsLeft = searchBox_value.length-1;
              //              //if are enough words left in the sentence to be able to match the searched value
              //              if(counter + wordsLeft < concept_words.length)
              //              {
              //                  var isMatchFound = true;
              //                  for(var search_word_index = 1; search_word_index < searchBox_value.length; search_word_index++)
              //                  {
              //                      /*We are checking if this word within concept_words includes the searched word
              //                      and if it does, we are checking that the word is not < between > as a HTML/XML tag specifier
              //                      although the <w> word </w> is allowed to be within tags but not a tag.
              //                      */
              //                      if(String(concept_words[counter+search_word_index]).toLowerCase().includes(String(searchBox_value[search_word_index]).toLowerCase()) // this will ensure that we search case insesitive values
              //                         
              //                       )
              //                          word = concept_words[counter+search_word_index].split()
              //                          if(String(concept_words[counter+search_word_index]).includes(">") == false && String(concept_words[counter+search_word_index]).includes("<") == false
              //                           // this will ensure that we don't modify the html / xml tags
              //                              ||
              //                              String(concept_words[counter+search_word_index]).indexOf(String(searchBox_value[search_word_index]).toLowerCase()) > String(concept_words[counter+search_word_index]).indexOf(">")  &&
              //                              String(concept_words[counter+search_word_index]).indexOf(String(searchBox_value[search_word_index]).toLowerCase()) < String(concept_words[counter+search_word_index]).lastIndexOf("<") 
              //                              )
              //                           {
              //                               //enter here if the next word is a match
              //                               continue;
              //                           }
              //                           else
              //                           {
              //                               //if not a match break out of the loop, this is not the one
              //                               isMatchFound = false;
              //                               break;
              //                           }
              //                      }
              //                  }
              //                  if(isMatchFound)
              //                  {
              //                      var index = String(concept_words[counter]).toLowerCase().indexOf(String(searchBox_value[0]).toLowerCase());
              //                      //Slicing the word to pieces to add the searchHeighlight to the finding within it.
              //                      //This way we will maintain the case sensitiveness intact.
              //                      var replacement = concept_words[counter].slice(0, index);
              //                      replacement += "<searchHighlight>" + concept_words[counter].slice(index, index + searchBox_value[0].length);
              //                      replacement += concept_words[counter].slice(index + searchBox_value[0].length);
              //                      concept_words[counter] = replacement;
              //                      
              //                      index = String(concept_words[counter + wordsLeft]).toLowerCase().indexOf(String(searchBox_value[wordsLeft]).toLowerCase());
              //                      replacement = concept_words[counter + wordsLeft].slice(0, index);
              //                      replacement += concept_words[counter + wordsLeft].slice(index, index + searchBox_value[wordsLeft].length) +"</searchHighlight>";
              //                      replacement += concept_words[counter + wordsLeft].slice(index + searchBox_value[wordsLeft].length);
              //                      concept_words[counter + wordsLeft] = replacement;
              //                      //concept_words[counter] = "<searchHighlight>" + concept_words[counter];
              //                      //concept_words[counter + wordsLeft] += "</searchHighlight>";
              //                      
              //                  }
              //              }
              //              
              //          }
              //      }
                                        
                    //inserting the sentence
                    cell.appendChild(p);
                    p = document.createElement("p");
                    p.innerHTML = concept_words.join(" ");
                    
                    //Add styling to the cell
                    p.style = concept_value_style;
                    cell.appendChild(p);
                    cell.style = cell_style;
                    
                    //Increase the counters
                    result_counter++;
                    concept_result_counter++;
                }
            }
        }
    }
    //Add to first row of the table of the number of results
    table_content.rows[0].cells[0].innerHTML = result_counter + " " + table_content.rows[0].cells[0].innerHTML;
}

function highlightInformationInWord(param_word, highlight_keyword)
{
    var indexOfLessThan = param_word.indexOf("<");
    var indexOfGreaterThan = param_word.indexOf(">")
    var indexOfHighlightKeyword = param_word.indexOf(highlight_keyword)

    if(param_word.includes(">") && param_word.includes("<") && indexOfLessThan < indexOfGreaterThan)
    {
        
        var tag = param_word.slice(indexOfLessThan, indexOfGreaterThan+1);
        param_word =  param_word.replace(tag, "");
        param_word = highlightInformationInWord(param_word, highlight_keyword);
        if(indexOfGreaterThan < indexOfHighlightKeyword)
        {
            //to be added
            param_word = param_word.replace(param_word[indexOfLessThan], tag+param_word[indexOfLessThan]);
        }
        else if(indexOfHighlightKeyword < indexOfLessThan)
        {
            //to be added
            param_word = param_word.replace(param_word[indexOfGreaterThan], param_word[indexOfGreaterThan]+tag);
        }
        return param_word;
    }
    else
    {
        param_word = String(param_word).replaceAll(highlight_keyword, "<searchHighlight>" + highlight_keyword + "</searchHighlight>");
        return param_word;
    }
}

//console.log(highlightInformationInWord("<blue>generic pointer</blue><code>alin</code><as>rr</as>", "eric"));

function SearchFunction(e)
{
    /*This function will search for results matching the search value*/
    if(searchBox.value != "" && e.key == "Enter")
    {
        removeTable();
        
        if(searchType.value == "matching_words")
        {
            wordMatchingSearch();
        }
        else if(searchType.value == "contextual")
        {
            ContextualSearch();
        }
    }
    else
    {
        /*Put everything back as it used to be before the search*/
        removeTable();
        if(view_selection.children[0].value==true)
        {
            fillTableRegular();
        }
        else if(view_selection.children[1].value==true)
        {
            fillTableCompare();
        }
    }
}

function ClearSearchBox()
{
    if(searchBox.value != "")
    {
        /*Clear the search box and put everything back as it used to be before the search*/
        searchBox.value = "";
        SearchFunction(); // this should not put everything as it used to be before the search
    }
}

//Triggered event when key is pressed down
searchBox.onkeydown = function(e) { SearchFunction(e); } 

//Triggered event when clicking on searchButton
document.getElementById("searchButton").addEventListener("click", function (e) {
    e.key = "Enter";  
    SearchFunction(e);
});

//Triggered event when clicking on clearSearchButton
document.getElementById("clearSearchButton").addEventListener("click", function (e) {ClearSearchBox();});


//Restore the cookies which can be restored before accessing the database
restoreCookiePredefinedElements();

loadXMLDoc(online_xml_file);

/*
//Fullscreen no longer available:

function FullscreenMode(e) 
{
    //Function not used - fullscreen no longer available
    var fullscreen_element = document.getElementById("page_table");
    if (document.fullscreenElement == null)
    {
        if (fullscreen_element.requestFullscreen) 
        {
            fullscreen_element.requestFullscreen();
        } 
        else if (fullscreen_element.webkitRequestFullscreen) 
        { 
            //Safari
            fullscreen_element.webkitRequestFullscreen();
        } 
        else if (fullscreen_element.msRequestFullscreen) 
        { 
            // IE11
            fullscreen_element.msRequestFullscreen();
        }
    }
    else
    {

        if (document.exitFullscreen) 
        {
            document.exitFullscreen();
        } 
        else if (document.webkitExitFullscreen) 
        { 
            //Safari
            document.webkitExitFullscreen();
        } 
        else if (document.msExitFullscreen) 
        { 
            // IE11
            document.msExitFullscreen();
        }
    }
}

function Enter_FullScreen(e)
{
    //Function not used - fullscreen no longer available
    if (e.key == "f")
    {
        FullscreenMode(); 
    }
}

function FullScreenZoom()
{
    //Function not used - fullscreen no longer available
   if (document.fullscreenElement != null)
   {
        //Fullscreen turned on -> Zooming in:
        document.getElementById("content_div").style.height = "98%";
        document.getElementById("menu_div").style.height = "98%";
   }
   else
   {
        //Fullscreen turned off - > Zooming out:
        document.getElementById("content_div").style.height = "40vw";
        document.getElementById("menu_div").style.height = "40vw";
   }
}

//When fullscreen changes call my function to handle the zooming
document.addEventListener("fullscreenchange", FullScreenZoom, false); //fullscreen no longer available

//When this button is pressed call this function
document.getElementById("fullscreen_button").addEventListener("click", function (e) {FullscreenMode();});
*/
