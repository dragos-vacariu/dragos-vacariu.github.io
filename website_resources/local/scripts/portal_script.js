var domain = "https://raw.githubusercontent.com/dragos-vacariu/portfolio/main/"
//var domain = "http://localhost:8003/dragos-vacariu.github.io/"

const online_xml_file = domain + "website_resources/local/database/processed/portal_database_processed.xml";
//const online_xml_file = domain + "website_resources/local/database/processed/portal_database_processed.xml"; //local resource can be ran using local server with cors
//const online_xml_file = domain + "website_resources/local/database/original/portal_database.xml"; //local resource can be ran using local server with cors

const manifests = [];
const manifest_selection = document.getElementById("manifest_selection");
concept_collection = [];
const concept_selection = document.getElementById("concept_selection");
const overall_concept_selection = document.getElementById("overall_concept_selection");
const overall_language_selection = document.getElementById("overall_language_selection");
const cookie_element_separator = "<br>"; 
const searchBox = document.getElementById("SearchBox");
const searchType = document.getElementById("searchType");
allConceptsSelection = false;

const disabledElementOpacity = 0.3;

//different styles for list tag selection:
const tag_selection_on = "font:var(--menu-font); font-variant: small-caps; font-weight: normal; background-image: linear-gradient(to right, rgba(90,0,0,0.8), rgba(90,0,0,0.7)); color: white; border: ridge 0.2vw rgba(255,255,255,0.7); text-shadow: 0px 0px black; padding: 1% 5%; margin: 1%;";
const tag_selection_off = "font:var(--menu-font); font-variant: small-caps; background-image: linear-gradient(to right, white, rgba(255,200,200,0.1)); color: black; border: solid 0.2vw rgba(0,0,0,0.7); padding: 1% 5%; margin: 1%;";

//special class to add separate styles for list tag concept_selection_elements:
const concept_item_class = "concept_collection_element"

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
        
        setSelectionType(); // this will set the selection and the view
        return_value = true
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
        setSelectionType(); // this will set the selection and the view
        return_value = true
    }
    
    return return_value;
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
                        toggleManifestOnOff(manifest_selection.children[matchIndex-1])
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
                if(view != "")
                {
                    //If there is a view switch to the view
                    if(view == view_selection.children[0].innerHTML)
                    {
                        //Set regular view to true
                        view_selection.children[0].value = true;
                        view_selection.children[0].style = tag_selection_on;
                        view_selection.children[1].value = false;
                        view_selection.children[1].style = tag_selection_off;
                    }
                    else if(view == view_selection.children[1].innerHTML)
                    {
                         //Set compare view to true
                        view_selection.children[0].value = false;
                        view_selection.children[0].style = tag_selection_off;
                        view_selection.children[1].value = true;
                        view_selection.children[1].style = tag_selection_on;
                    }
                }
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
                    updateCookie(concept_selection.children[matchIndex].innerHTML, concept_selection.children[matchIndex].value);
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
            view_selection.children[1].value = true;
            view_selection.children[1].style = tag_selection_on;
            view_selection.children[0].value = false;
            view_selection.children[0].style = tag_selection_off;
        }
        else
        {
            //Set regular view to true
            view_selection.children[1].value = false;
            view_selection.children[1].style = tag_selection_off;
            view_selection.children[0].value = true;
            view_selection.children[0].style = tag_selection_on;
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
    
    //Ensuring every manifest is deselected
    for(var lang_sel_index = 0; lang_sel_index < manifest_selection.children.length; lang_sel_index++)
    {
        if(manifest_selection.children[lang_sel_index].value == true)
        {
            manifest_selection.children[lang_sel_index].value = false
            manifest_selection.children[lang_sel_index].style = tag_selection_off;
        }
    }
    //Ensuring every concept is removed
    for(var index = 0; index < concept_selection.children.length; index++)
    {
        concept_selection.children[index].remove();
        concept_collection.splice(index, 1);
        index--;
    }
    
    var cookie_elements = document.cookie.split(cookie_element_separator);
    
    for(var i=0; i < cookie_elements.length; i++)
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
                //Ensuring concept is deselected
                if(concept_selection.children[concept_index].value == true)
                {
                    concept_selection.children[concept_index].value = false;
                    concept_selection.children[concept_index].style = tag_selection_off;
                }
                //Selecting the concept
                toggleConceptOnOff(concept_selection.children[concept_index])
            }
            else
            {
                //Ensuring concept is selected
                if(concept_selection.children[concept_index].value == false)
                {
                    concept_selection.children[concept_index].value = true;
                    concept_selection.children[concept_index].style = tag_selection_on;
                }
                //Deselecting the concept
                toggleConceptOnOff(concept_selection.children[concept_index])
            }
        }
        else
        {
            //Checking if pairs[0] is a LANGUAGE:
            var language_index = -1;
            for(var lang_sel_index = 0; lang_sel_index < manifest_selection.children.length; lang_sel_index++)
            {
                if(pairs[0] == manifest_selection.children[lang_sel_index].innerHTML)
                {
                    language_index = lang_sel_index;
                    break;
                }
            }
            if( language_index >= 0 )
            {
                if(pairs[1]=="1")
                {
                    var selected_language = manifests.find(element => element.name == manifest_selection.children[language_index].innerHTML);
                    manifest_selection.children[language_index].value = true;
                    manifest_selection.children[language_index].style = tag_selection_on;
                    
                    //Appending the new concepts
                    for(var index=0; index < selected_language.concepts.length; index++)
                    {
                        if (concept_collection.findIndex(element => element == selected_language.concepts[index].concept_name) < 0)
                        {
                            concept_selection.appendChild(createLiElement(selected_language.concepts[index].concept_name, false, conceptSelectionBehavior, concept_item_class));
                            concept_collection.push(selected_language.concepts[index].concept_name);
                        }                 
                    }
                }
            }
        }
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
                manifest_selection.children[language_index].click(); 
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
            
            /*Adding the overall language selection functions*/
            overall_language_selection.appendChild( createLiElement("deselect all", true, deselectionOfAllLanguageElements) );
            overall_language_selection.appendChild( createLiElement("select all", true, selectionOfAllLanguageElements) );
            
            /*Adding the overall concept selection functions*/
            overall_concept_selection.appendChild( createLiElement("deselect all", true, deselectionOfAllConceptElements) );
            overall_concept_selection.appendChild( createLiElement("select all", true, selectionOfAllConceptElements) );
            
            //Adding programming languages to the selection
            for(var index=0; index < manifests.length; index++)
            {
                /*Grabbing all concepts available for all the programming languages*/
                /*Ignore everything for General-Programming-Knowledge*/
                if(manifests[index].name != "General-Programming-Knowledge")
                {
                    if(index==1) //display only 3 columns in the table by default -> General-Programming-Knowledge is not gonna be visible
                    {
                        /*Adding the programming language selection*/                
                        manifest_selection.appendChild(createLiElement(manifests[index].name, true, manifestSelectionBehaviour));
                    }
                    else
                    {
                        manifest_selection.appendChild(createLiElement(manifests[index].name, false, manifestSelectionBehaviour));
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
                        concept_selection.appendChild(createLiElement(manifests[1].concepts[concept_index].concept_name, true, conceptSelectionBehavior, concept_item_class));
                    }
                    else
                    {
                        concept_selection.appendChild(createLiElement(manifests[1].concepts[concept_index].concept_name, false, conceptSelectionBehavior, concept_item_class));
                    }
                    concept_collection.push(manifests[1].concepts[concept_index].concept_name);
                }
                setSelectionType(); // this will set the selection and the view
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
    for(var j=0; j<manifest_selection.children.length; j++)
    {
        if(manifest_selection.children[j].value == true)
        {
            active_columns++;
        }
    }
    //Draw the first raw in the table (also known as table header)
    
    //Draw a column for the concept - the first row cell in the concept column will be empty
    var row = table_content.insertRow();
    var cell = null;
    //Draw separate column for each programming language selected to be displayed
    for(var index=0; index < manifests.length; index++)
    {        
        /*check if language is selected to be displayed*/
        for(var i=0; i < manifest_selection.children.length; i++)
        {
            if(manifest_selection.children[i].innerHTML == manifests[index].name &&
                manifest_selection.children[i].value==true)
            {
                cell = row.insertCell();
                cell.innerHTML = manifests[index].name + "<sup>(Manifest)</sup>";
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
            for(var index=0; index < manifests.length; index++)
            {
                for(var lang_selection_index=0; lang_selection_index < manifest_selection.children.length; lang_selection_index++)
                {
                    /*check if the language is selected to be displayed*/
                    if(manifest_selection.children[lang_selection_index].innerHTML == manifests[index].name && manifest_selection.children[lang_selection_index].value==true)
                    {
                        var found_element_index =  manifests[index].concepts.findIndex(element => element.concept_name ==concept_collection[concept_index]);
                        
                        /*
                        The findIndex() method of Array instances returns the index of the first element in an 
                        array that satisfies the provided testing function. If no elements satisfy the testing 
                        function, -1 is returned.
                        */
                        cell = row.insertCell(); //empty cell
                        /*Insert the concept name within the cell*/
                        var p = document.createElement("p");
                        p.innerHTML =  "<sup>" + manifests[index].name + "</sup> "+ concept_collection[concept_index] + ": <sup>(Concept)</sup>";
                        p.style = concept_title_style;
                        cell.appendChild(p);
                        p = document.createElement("p");
                        /*If the concept exists for this language*/
                        if(found_element_index >= 0) 
                        {
                            p.innerHTML = manifests[index].concepts[found_element_index].concept_value;
                            
                            //Don't copy general knowledge on compare. As those informations are available to all languages.
                            p.innerHTML = String(p.innerHTML).replace(copy_GeneralKnowledge_token, "");
                            
                            if(p.innerHTML == "")
                            {
                                p.innerHTML = "No particularities to show."
                            }
                        
                        }
                        else
                        {
                            p.innerHTML += "Concept not present in this manifest."
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
                cell.innerHTML = manifests[index].name + "<sup>(Manifest)</sup>";
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
                            p.innerHTML = "<sup>" + manifests[index].name + "</sup> "+ concept_collection[concept_index] + ":<sup>(Concept)</sup>";
                            p.style = concept_title_style;
                            cell.appendChild(p);
                            p = document.createElement("p");

                            p.innerHTML += manifests[index].concepts[found_element_index].concept_value;
                            checkCopyConceptFromGeneralKnowledge(p, manifests[index].concepts[found_element_index]);
                            
                                                        
                            p.style = concept_value_style;
                            cell.appendChild(p);
                            cell.style = cell_style;
                            
                            /*Insert the concept value within the cell*/
                            row = table_content.insertRow();
                            cell = row.insertCell();
                            cell.style = cell_style;
                            
                            /*Inserting buttons elements at the end of each paragraph based on the selection type*/
                            if(selection_type.children[0].value == true)
                            {
                                /*Selection type is single. We'll insert 2 buttons for switching between Previous / Next Concepts*/
                                
                                var ul = document.createElement("ul");
                                ul.style = "position: relative; width:  auto; padding: 0%;" +
                                            "display: inline-grid; grid-template-columns: 1fr 1fr;" + /*this will ensure we have 2 columns of equal size*/
                                            "border: none 0px black; word-wrap: break-word; overflow-wrap: break-word; white-space: normal;";
                                
                                if (concept_index-1 >= 0)
                                {
                                    var li = createLiElement("◀ Previous", false, paragraphButtonBehavior);
                                    var span = document.createElement("span");
                                    li.innerHTML += "<br>";
                                    span.innerHTML = concept_selection.children[concept_index-1].innerHTML;
                                    li.concept_substitue = concept_selection.children[concept_index-1].innerHTML;
                                    span.style.setProperty("color", "var(--darkred-color)");
                                    span.style.setProperty("font-weight", "normal");
                                    span.id = "concept_name_value";
                                    li.append(span);
                                    
                                    /*if our li has children, those children will be displayed underneath*/
                                    li.style.setProperty("display", "block");
                                    li.style.setProperty("text-align", "center");
                                    li.style.setProperty("border-radius", "2vw");
                                    li.style.setProperty("border", "solid 1px black");
                                    
                                    /*overflow: hidden will ensure the content of the li will not overlap outside the ul*/
                                    li.style.setProperty("overflow", "hidden");
                                    
                                    /*box-sizing: border-box will ensure that borders size will be contained within the element's width*/
                                    li.style.setProperty("box-sizing", "border-box");
                                    ul.appendChild(li);
                                }
                                if (concept_index+1 < concept_collection.length)
                                {
                                    var li = createLiElement(" Next ▶", false, paragraphButtonBehavior);
                                    var span = document.createElement("span");
                                    li.innerHTML += "<br>";
                                    span.innerHTML = concept_selection.children[concept_index+1].innerHTML;
                                    li.concept_substitue = concept_selection.children[concept_index+1].innerHTML;
                                    span.style.setProperty("color", "var(--darkred-color)");
                                    span.style.setProperty("font-weight", "normal");
                                    span.id = "concept_name_value";
                                    
                                    /*this can be used to insert an element at the very beggining*/
                                    //li.insertAdjacentElement('afterbegin', span);
                                    
                                    li.append(span);
                                    
                                    /*if our li has children, those children will be displayed underneath*/
                                    li.style.setProperty("display", "block"); 
                                    li.style.setProperty("text-align", "center");
                                    li.style.setProperty("border-radius", "2vw");
                                    li.style.setProperty("border", "solid 1px black");
                                    
                                    /*overflow: hidden will ensure the content of the li will not overlap outside the ul*/
                                    li.style.setProperty("overflow", "hidden");
                                    
                                    /*box-sizing: border-box will ensure that borders size will be contained within the element's width*/
                                    li.style.setProperty("box-sizing", "border-box");
                                    ul.appendChild(li);
                                }
                                cell.appendChild(ul);

                            }
                            else
                            {
                                var p = document.createElement("p");
                                p.style = concept_title_style;
                                p.innerHTML = "<sub style='font-variant: small-caps'>" +  manifests[index].name  + " - " + concept_selection.children[concept_index].innerHTML + "</sub>"
                                p.style.setProperty("text-align", "center");

                                cell.append(p)
                                
                                /*Selection type is multiple. We'll insert 1 buttons for deselection of the Concept element that was read.*/
                                var ul = document.createElement("ul");
                                ul.style = "position: relative; width:  auto; padding: 0%;" +
                                            "display: block;" + /*this will ensure we have 2 columns of equal size*/
                                            "border: none 0px black; word-wrap: break-word; overflow-wrap: break-word; white-space: normal;";
                                

                                var li = createLiElement("↑ Deselect", false, paragraphButtonBehavior);
                                li.concept_substitue = concept_selection.children[concept_index].innerHTML;
                                
                                /*this can be used to insert an element at the very beggining*/
                                //li.insertAdjacentElement('afterbegin', sup) 
                                
                                /*if our li has children, those children will be displayed on the same line*/
                                li.style.setProperty("display", "inline-block"); 

                                li.style.setProperty("text-align", "center");
                                li.style.setProperty("border-radius", "2vw");
                                li.style.setProperty("padding", "0% 2%");
                                li.style.setProperty("border", "solid 1px black");
                                li.style.setProperty("width", "auto");
                                
                                /*overflow: hidden will ensure the content of the li will not overlap outside the ul*/
                                li.style.setProperty("overflow", "hidden");
                                
                                /*box-sizing: border-box will ensure that borders size will be contained within the element's width*/
                                li.style.setProperty("box-sizing", "border-box"); 
                                ul.appendChild(li);
                                cell.appendChild(ul);
                                cell.style = cell_style;
                            }
                        }
                    }
                }
            }
        }
    }
}

function createLiElement(string_value, enablingStatus, function_behaviour, class_name="selection_list_element")
{
    /*
    This function will create li elements to allow selection and deselection of elements 
    within the database.
    */
    var li = document.createElement("li");
    li.appendChild(document.createTextNode(string_value));
    li.value = enablingStatus;
    if(class_name != "")
    {
        li.classList.add(class_name);
    }
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
    if(selection_type.children[0].value == true)
    {
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
        //each time a new item is selected just scroll to the beggining
        window.scrollTo(0, 250);
    }
    else if(selection_type.children[1].value == true)
    {
        if(concept_element.value == true)
        {
            concept_element.value = false;
            concept_element.style = tag_selection_off;
        }
        else
        {
            concept_element.value = true;
            concept_element.style = tag_selection_on;
        }
        updateCookie(concept_element.innerHTML, concept_element.value);
    }
    allConceptsSelection = false;
    showTable();
}

function paragraphButtonBehavior()
{
    /*This function will be called when clicking the paragraph buttons for Deselect Concepts or switching Previous/Next Concepts*/
    
    //const concept_name_value = this.querySelector("#concept_name_value").innerHTML;
    for(var index=0; index < concept_selection.children.length; index++)
    {

        if(concept_selection.children[index].innerHTML == this.concept_substitue)
        {
            if(concept_selection.children[index].value == true)
            {
                /*The value will be true only when mutiple selection is enabled. 
                Meaning the Deselect button displayed was hit by the user*/
                
                
                /*Here is the logic for auto-scrolling on concept deselection from the paragraph button*/
                if (index + 1 < concept_selection.children.length)
                {
                    var current_Cell = this.closest('td');
                    var current_Row = current_Cell.closest('tr');
                    const current_RowIndex = Array.from(current_Row.parentNode.children).indexOf(current_Row);
                    
                    /*current_RowIndex -1 is the row the concept_value, and current_RowIndex-2 is the row with concept_name*/
                    const titleRow = current_Row.parentNode.children[current_RowIndex-2] 
                    
                    // Get the row's position on the page
                    const rect = titleRow.getBoundingClientRect();
                    const rowY = window.scrollY + rect.top;
                    
                    // Scroll to it
                    window.scrollTo({
                      top: rowY,
                      behavior: 'smooth' // or 'instant' for no animation
                    });
                    /*We scrolled back to the beggining of the concept.
                    It's important to do this before the deselection.
                    */
                }
            }
            concept_selection.children[index].click(); /*Now we deselect the concept*/
            return;
        }
    }
}

function manifestSelectionBehaviour()
{
    /*This function describes the behaviour of a language li element*/
    
    //if Selection type is single:
    toggleManifestOnOff(this)
    updateRoute();
}

function toggleManifestOnOff(manifest_element)
{
    /*This function will toggle the selection of manifest element*/
    
    //if Selection type is single:
    if (selection_type.children[0].value == true)
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
                concept_selection.children[0].remove()
            }
            concept_collection = [] //clearing the concept_collection
            
            //Appending the new concepts
            for(var index=0; index < active_language.concepts.length; index++)
            {
                if(index == 0)
                {
                    concept_selection.appendChild(createLiElement(active_language.concepts[index].concept_name, true, conceptSelectionBehavior, concept_item_class));
                }
                else if (selected_concept != "" && active_language.concepts[index].concept_name ==  selected_concept)
                {
                    concept_selection.appendChild(createLiElement(active_language.concepts[index].concept_name, true, conceptSelectionBehavior, concept_item_class));
                    concept_selection.children[0].value = false
                    concept_selection.children[0].style = tag_selection_off;
                }
                else
                {
                    concept_selection.appendChild(createLiElement(active_language.concepts[index].concept_name, false, conceptSelectionBehavior, concept_item_class));
                }
                concept_collection.push(active_language.concepts[index].concept_name);
            }
        }
        updateCookie("SingleSelectionLanguage", manifest_element.innerHTML);
    }
    //If Selection type is multiple and view is whatever:
    else
    {
        //Allow multiple selections
        if(manifest_element.value == true)
        {
            manifest_element.value = false;
            manifest_element.style = tag_selection_off;           

            //Removing existing concepts in the concept_selection
            for(var existing_concept=0; existing_concept < concept_selection.children.length; existing_concept++)
            {
                concept_to_be_removed = true
                
                for(var language_index = 0; language_index < manifest_selection.children.length; language_index++)
                {
                    if (manifest_selection.children[language_index].value == true)
                    {
                        var found_element_index = manifests[language_index+1].concepts.findIndex(element => element.concept_name == concept_selection.children[existing_concept].innerHTML);
                        if( found_element_index < 0)
                        {
                            concept_to_be_removed = true
                        }
                        else
                        {
                            concept_to_be_removed = false
                        }
                    }
                }
                
                if (concept_to_be_removed)
                {
                    concept_selection.children[existing_concept].remove();
                    concept_collection.splice(existing_concept, 1);
                    existing_concept--;
                }
            }
        }
        else
        {
            manifest_element.value = true;
            manifest_element.style = tag_selection_on;
            
            var selected_language = manifests.find(element => element.name == manifest_element.innerHTML);
            
            if(selected_language != undefined)
            {                
                //Appending the new concepts
                for(var index=0; index < selected_language.concepts.length; index++)
                {
                    if (concept_collection.findIndex(element => element == selected_language.concepts[index].concept_name) < 0)
                    {
                        if (allConceptsSelection == true)
                        {
                            concept_selection.appendChild(createLiElement(selected_language.concepts[index].concept_name, true, conceptSelectionBehavior, concept_item_class));
                        }
                        else
                        {
                            concept_selection.appendChild(createLiElement(selected_language.concepts[index].concept_name, false, conceptSelectionBehavior, concept_item_class));
                        }
                        concept_collection.push(selected_language.concepts[index].concept_name);
                    }                 
                }
            }
        }
        updateCookie(manifest_element.innerHTML, manifest_element.value);
    }
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
        /*Making sure the elements is selected*/
        concept_selection.children[i].value = true;
        concept_selection.children[i].style = tag_selection_on;
        
        //This will deselect the element
        toggleConceptOnOff(concept_selection.children[i])
        /*By using toggleConceptOnOff function we will now deselect the concept*/
        
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
        /*Making sure the elements is deselected*/
        concept_selection.children[i].value = false;
        concept_selection.children[i].style = tag_selection_off;
        
        //This will select the element
        toggleConceptOnOff(concept_selection.children[i])
        /*By using toggleConceptOnOff function we will now display the concept*/
        
        updateCookie(concept_selection.children[i].innerHTML, concept_selection.children[i].value);
    }
    allConceptsSelection = true;
    showTable();
    updateRoute();
}

function deselectionOfAllLanguageElements() 
{
    /*This function will describe the behavior of deselect all button within the Overall Language Selection.*/
    
    for(var i = 0; i < manifest_selection.children.length; i++)
    {
        /*Making sure the elements is selected*/
        manifest_selection.children[i].value = true;
        manifest_selection.children[i].style = tag_selection_on;
        
        //This will deselect the element
        toggleManifestOnOff(manifest_selection.children[i])
        /*By using toggleManifestOnOff we will now CLEAR the item and remove it's particular concepts from selection*/
        
        updateCookie(manifest_selection.children[i].innerHTML, manifest_selection.children[i].value);
    }
    showTable();
    updateRoute();
}

function selectionOfAllLanguageElements() 
{
    /*This function will describe the behavior of select all button within the Overall Language Selection.*/
    
    for(var i = 0; i < manifest_selection.children.length; i++)
    {
        /*Making sure the elements is deselected*/
        manifest_selection.children[i].value = false;
        manifest_selection.children[i].style = tag_selection_off;
        
        //This will select the element
        toggleManifestOnOff(manifest_selection.children[i])
        /*By using toggleManifestOnOff we will now SELECT the item and add it's particular concepts for the  selection*/
        
        updateCookie(manifest_selection.children[i].innerHTML, manifest_selection.children[i].value);
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
            restoreCookiePredefinedElements();
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
        
        //Removing overall_concept_selection elements:
        while(overall_concept_selection.children.length > 0)
        {
            overall_concept_selection.children[0].remove()
        }
        document.getElementById("overall_concept_selection_title").setAttribute("hidden", "hidden");
        document.getElementById("overall_concept_selection_div").setAttribute("hidden", "hidden");
        
        //Removing overall_language_selection elements:
        while(overall_language_selection.children.length > 0)
        {
            overall_language_selection.children[0].remove()
        }
        document.getElementById("overall_language_selection_title").setAttribute("hidden", "hidden");
        document.getElementById("overall_language_selection_div").setAttribute("hidden", "hidden");
        
        /*
            Get the active language. There should be only one active language selected 
            since Cookie values were restored in the switchSelectionTypeSingle() 
        */
        var active_languages = getActiveElements(manifest_selection.children);
        var active_concepts = getActiveElements(concept_selection.children)
        
        if(active_concepts.length > 1) //this condition should always be true
        {
            /*if more than once concept is selected, deselect all except the first*/
            toggleConceptOnOff(active_concepts[0])
        }

        if(active_languages.length > 0) //should only be one element stored in active_languages
        {
            //If there is more than a single element selected.
            if(active_languages.length > 1)
            {
                //we will make sure any other active languages and concepts will be deselected
                toggleManifestOnOff(active_languages[0])
            }
        }
    }
    else if(selection_type.children[1].value == true)
    {
        /*Selection type: multiple gets the enabled opacity*/
        view_selection.children[1].style.opacity = 1;
        //Show the overall selecton elements;
    
        if (overall_language_selection.children.length == 0)
        {
            /*Adding the overall language selection functions*/
            overall_language_selection.appendChild( createLiElement("deselect all", true, deselectionOfAllLanguageElements) );
            overall_language_selection.appendChild( createLiElement("select all", true, selectionOfAllLanguageElements) );
        }
        
        if(overall_concept_selection.children.length == 0)
        {
            /*Adding the overall concept selection functions*/
            overall_concept_selection.appendChild( createLiElement("deselect all", true, deselectionOfAllConceptElements) );
            overall_concept_selection.appendChild( createLiElement("select all", true, selectionOfAllConceptElements) );
        }
        document.getElementById("overall_concept_selection_title").removeAttribute("hidden", "hidden");
        document.getElementById("overall_concept_selection_div").removeAttribute("hidden", "hidden");
        document.getElementById("overall_language_selection_title").removeAttribute("hidden", "hidden");
        document.getElementById("overall_language_selection_div").removeAttribute("hidden", "hidden");
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
    
    for(var i=0; i < manifests.length; i++)
    {
        for(var j=0; j < manifests[i].concepts.length; j++)
        {
            var sentences = manifests[i].concepts[j].concept_value;
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
                        p.innerHTML = manifests[i].name + " - " + manifests[i].concepts[j].concept_name + ":";
                        p.style = concept_title_style;
                    }
                    
                    //Format the text by adding highlights on every finding:
                    var concept_words = sentences[k].trim().split(">")
                    
                    //var pattern = new RegExp(String(searchBox_value[word_index]), 'gi');
                    //p.innerHTML = p.innerHTML.replaceAll(pattern, "<searchHighlight>" + String(searchBox_value[word_index]) + "</searchHighlight>") // works for finding the case-insesitive item but does not work for replacing it
                        
                    //Put case-insesitive findings between <searchHighlight> tags. This will allow us to highlight the findings word for word
                    for (var counter = 0; counter < concept_words.length; counter++)
                    {
                        //if some word includes the one of the value within the searchBox
                        var buffer_value = concept_words[counter];
                        for(var word_index = 0; word_index < searchBox_value.length; word_index++)
                        {
                            var indexOfLessThan = String(concept_words[counter]).indexOf("<");
                            var indexOfSearchValue = String(concept_words[counter]).toLowerCase().indexOf(String(searchBox_value[word_index]).toLowerCase());
                            
                            if(String(concept_words[counter]).toLowerCase().includes(String(searchBox_value[word_index]).toLowerCase())
                                    && (String(concept_words[counter]).includes("<") == false || indexOfLessThan
                                    > indexOfSearchValue)
                            )
                            {
                                //get the index of the searchBox substring value within the word
                                var index = String(buffer_value).toLowerCase().indexOf(String(searchBox_value[word_index]).toLowerCase());
                                
                                //Slicing the word to pieces to add the searchHeighlight to the finding within it.
                                //This way we will maintain the case sensitiveness intact.
                                var replacement = buffer_value.slice(0, index);
                                replacement += "<searchHighlight>" + buffer_value.slice(index, index + searchBox_value[word_index].length) + "</searchHighlight>";
                                replacement += buffer_value.slice(index + searchBox_value[word_index].length);
                                buffer_value = replacement;
                                
                            }
                        
                        }
                        concept_words[counter] = buffer_value;
                    }
                    
                    //inserting the sentence
                    cell.appendChild(p);
                    p = document.createElement("p");
                    p.innerHTML = concept_words.join(">");
                    
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

    for(var i=0; i < manifests.length; i++)
    {
        for(var j=0; j < manifests[i].concepts.length; j++)
        {
            var sentences = manifests[i].concepts[j].concept_value;
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
                        p.innerHTML = manifests[i].name + " - " + manifests[i].concepts[j].concept_name + ":";
                        p.style = concept_title_style;
                    }
                    //inserting the sentence
                    cell.appendChild(p);
                    
                    /*We will insert the name of the concept only once*/
                    if(concept_result_counter==0)
                    {
                        /*Insert the concept name within the cell*/
                        var p = document.createElement("p");
                        p.innerHTML = manifests[i].name + " - " + manifests[i].concepts[j].concept_name + ":";
                        p.style = concept_title_style;
                    }
                    
                    
                    //Format the text by adding highlights on every finding:
                    var concept_words = sentences[k].trim().split(">")
                    
                    //var pattern = new RegExp(String(searchBox_value[word_index]), 'gi');
                    //p.innerHTML = p.innerHTML.replaceAll(pattern, "<searchHighlight>" + String(searchBox_value[word_index]) + "</searchHighlight>") // works for finding the case-insesitive item but does not work for replacing it
                    
                    //HIGHLIGHTING CODE
                    searchBox_value = searchBox.value.trim().split(" "); //trim() will remove whitespaces from the beggining and end of the string
                    //Getting the unique findings to optimize the upcoming loops
                    searchBox_value = [...new Set(searchBox_value)];
                    //Put case-insesitive findings between <searchHighlight> tags. This will allow us to highlight the findings word for word
                    for (var counter = 0; counter < concept_words.length; counter++)
                    {
                        //if some word includes the one of the value within the searchBox
                        var buffer_value = concept_words[counter];
                        for(var word_index = 0; word_index < searchBox_value.length; word_index++)
                        {
                            var indexOfLessThan = String(concept_words[counter]).indexOf("<");
                            var indexOfSearchValue = String(concept_words[counter]).toLowerCase().indexOf(String(searchBox_value[word_index]).toLowerCase());
                            
                            if(String(concept_words[counter]).toLowerCase().includes(String(searchBox_value[word_index]).toLowerCase())
                                    && (String(concept_words[counter]).includes("<") == false || indexOfLessThan
                                    > indexOfSearchValue)
                            )
                            {
                                //get the index of the searchBox substring value within the word
                                var index = String(buffer_value).toLowerCase().indexOf(String(searchBox_value[word_index]).toLowerCase());
                                
                                //Slicing the word to pieces to add the searchHeighlight to the finding within it.
                                //This way we will maintain the case sensitiveness intact.
                                var replacement = buffer_value.slice(0, index);
                                replacement += "<searchHighlight>" + buffer_value.slice(index, index + searchBox_value[word_index].length) + "</searchHighlight>";
                                replacement += buffer_value.slice(index + searchBox_value[word_index].length);
                                buffer_value = replacement;
                                
                            }
                        
                        }
                        concept_words[counter] = buffer_value;
                    }
                    
                    //inserting the sentence
                    row = table_content.insertRow();
                    cell = row.insertCell(); //empty cell
                    p = document.createElement("p");
                    p.innerHTML = concept_words.join(">");

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

function getObjectSize(obj) 
{
    return new Blob([JSON.stringify(obj)]).size;
}

function memoryUsageMonitor()
{
    console.log("Object:         Size (bytes): ")
    console.log("Document:       Size: " + getObjectSize(window.document))
    console.log("Manifests:      Size: " + getObjectSize(manifests))
    console.log("Script:         Size: " + getObjectSize(window.document.scripts))
    console.log("Scripts content: " + window.document.scripts)
}

function saveWebPage() 
{
    // Get the current HTML content
    const textToWrite = document.documentElement.outerHTML;
    
    // Fetch CSS and JavaScript to inline them into the HTML
    const fetchAssets = async () => 
    {
        // Fetch CSS content
        var cssResponse = await fetch(domain + 'website_resources/local/css/portal_page.css');
        
        var cssText = await cssResponse.text();
        
        cssResponse = await fetch(domain + 'website_resources/global/css/global.css');
        
        cssText += await cssResponse.text();
        
        //Fetch JavaScript content
        //const jsResponse = await fetch(domain + 'website_resources/local/scripts/portal_script.js');
        
        //const jsText = await jsResponse.text();

        var finalHtml = textToWrite.replace('</head>', "<style>" + cssText + "</style>\n</head>");
        
        //Removing external resources from page's source, so no errors will popup
        finalHtml = finalHtml.replaceAll('<link rel="stylesheet" href="./website_resources/global/css/global.css">', "");
        finalHtml = finalHtml.replaceAll('<link rel="stylesheet" href="./website_resources/local/css/portal_page.css">', "");
        finalHtml = finalHtml.replaceAll('<link rel="icon" type="image/x-icon" href="./website_resources/global/images/favicon.ico">', "");
        finalHtml = finalHtml.replaceAll('<script src="./website_resources/global/scripts/global_script.js"></script>', "");
        finalHtml = finalHtml.replaceAll('<script src="./website_resources/local/scripts/portal_script.js"></script>', "");
        finalHtml = finalHtml.replaceAll('<script src="./website_resources/global/scripts/page_selection_styling.js"></script>', "");
        finalHtml = finalHtml.replaceAll('<script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.6.9/angular.min.js"></script>', "");
        
        /*This will ensure we will still access the same fonts and background images.*/
        finalHtml = finalHtml.replaceAll('src: url("../../global/fonts/ZenDots-Regular.ttf");', 'src: url("https://dragos-vacariu.github.io/website_resources//global/fonts/ZenDots-Regular.ttf");');
        finalHtml = finalHtml.replaceAll('src: url("../../global/fonts/FjallaOne-Regular.ttf");', 'src: url("https://dragos-vacariu.github.io/website_resources/global/fonts/FjallaOne-Regular.ttf");');
        finalHtml = finalHtml.replaceAll('src: url("../../global/fonts/ZenTokyoZoo-Regular.ttf");', 'src: url("https://dragos-vacariu.github.io/website_resources/global/fonts/ZenTokyoZoo-Regular.ttf");');
        finalHtml = finalHtml.replaceAll('--header-footer-background-image: url("../images/header_footer_texture.jpg");', '--header-footer-background-image: url("https://dragos-vacariu.github.io/website_resources/global/images/header_footer_texture.jpg");');
        finalHtml = finalHtml.replaceAll('<img id="logo" src="file:///C:/Users/black/Documents/GitHub/dragos-vacariu.github.io/website_resources/global/images/logo.png" alt="logo image">', '<img id="logo" src="https://dragos-vacariu.github.io/website_resources/global/images/logo.png" alt="logo image">');
        finalHtml = finalHtml.replaceAll('<img id="logo" src="file:///C:/Users/black/Documents/GitHub/dragos-vacariu.github.io/website_resources/global/images/logo.png" alt="logo image">', '<img id="logo" src="https://dragos-vacariu.github.io/website_resources/global/images/logo.png" alt="logo image">');
        
        /*Removing the hovering effect, as now the page is not interactable, it's just a screenshot*/
        finalHtml = finalHtml.replaceAll(':hover', '::hover');
        
        /*This will ensure we will still be able to see the pictures*/
        finalHtml = finalHtml.replaceAll('<img class="database_image" src="./website_resources/local/database/pictures/', '<img class="database_image" src="https://dragos-vacariu.github.io/website_resources/local/database/pictures/');
        
        //finalHtml = finalHtml.replace('</body>', "<script>" + jsText + "</script></body>");

        // Trigger download of the HTML file
        const textFileAsBlob = new Blob([finalHtml], { type: 'text/html' });
        const downloadLink = document.createElement('a');

        downloadLink.download = document.title + ".html";
        downloadLink.innerHTML = "Download File";
        
        if (window.webkitURL != null) 
        {
            // Chrome allows the link to be clicked without actually adding it to the DOM.
            downloadLink.href = window.webkitURL.createObjectURL(textFileAsBlob);
        } 
        else 
        {
            // Firefox requires the link to be added to the DOM before it can be clicked.
            downloadLink.href = window.URL.createObjectURL(textFileAsBlob);
            downloadLink.onclick = destroyClickedElement;
            downloadLink.style.display = "none";
            document.body.appendChild(downloadLink);
        }
        
        downloadLink.click();
    };

    fetchAssets();
}

//Triggered event when key is pressed down
searchBox.onkeydown = function(e) { SearchFunction(e); } 

//Triggered event when clicking on searchButton
document.getElementById("searchButton").addEventListener("click", function (e) {
    e.key = "Enter";  
    SearchFunction(e);
});

function updateSidebarOffset() 
{
    const navbar = document.getElementById("page_header");
    const sideMenu = document.getElementById("menu_div");

    const navbarHeight = navbar.offsetHeight;

    // Set dynamic top and height
    sideMenu.style.top = navbarHeight + "px";
    sideMenu.style.height = "calc(100vh - " + navbarHeight + "px)";
}

//Call on load and on resize (if navbar might change height)
window.addEventListener("DOMContentLoaded", updateSidebarOffset);
window.addEventListener("resize", updateSidebarOffset);

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
