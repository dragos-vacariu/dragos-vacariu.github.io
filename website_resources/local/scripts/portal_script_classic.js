const online_xml_file = "https://raw.githubusercontent.com/dragos-vacariu/portfolio/main/programming_languages_database.xml";
//const online_xml_file = "http://localhost:8003/dragos-vacariu.github.io/programming_languages_database.xml"; //local resource can be ran using local server with cors
var programming_languages = [];
const concept_selection = document.getElementById("concept_selection");
var concept_collection = [];
const programming_language_selection = document.getElementById("programming_language_selection");
const overall_concept_selection = document.getElementById("overall_concept_selection");
const overall_language_selection = document.getElementById("overall_language_selection");
const page_selection = document.getElementById("page_selection");
const cookie_element_separator = "<br>"; 

const paragraph_view_value = "paragraph view";
const table_view_value = "table view";

//different styles for list tag selection:
const tag_selection_on = "background-image: linear-gradient(to right, #aa7700, #995500); color: white; border-color: white; max-width: 100%; word-wrap: break-word;";
const tag_selection_off = "background-image: linear-gradient(to right, white, #ffeecc); color: #995500; border-color: black;  max-width: 100%; word-wrap: break-word;";

const copy_GeneralKnowledge_token = "*General-Programming-Knowledge*";

const programming_language_div_style = [
    "background-image: linear-gradient(to bottom, rgba(255,255,255,0.1), rgba(255,255,255,0.4)); padding: 1vw; margin: 1vw;", /*This is for General-Programming-Knowledge which is not visible nor available for selection*/
    "background-image: linear-gradient(to bottom, rgba(0,0,255,0.1), rgba(255,255,255,0.4)); padding: 1vw; margin: 1vw;", 
    "background-image: linear-gradient(to bottom, rgba(255,0,0,0.1), rgba(255,255,255,0.4));  padding: 1vw; margin: 1vw;", 
    "background-image: linear-gradient(to bottom, rgba(0,255,0,0.1), rgba(255,255,255,0.4)); padding: 1vw; margin: 1vw;",
    "background-image: linear-gradient(to bottom, rgba(0,255,255,0.1), rgba(255,255,255,0.4));  padding: 1vw; margin: 1vw;", 
    "background-image: linear-gradient(to bottom, rgba(255,0,255,0.1), rgba(255,255,255,0.4)); padding: 1vw; margin: 1vw;", 
    "background-image: linear-gradient(to bottom, rgba(255,255,0,0.1), rgba(255,255,255,0.4));  padding: 1vw; margin: 1vw;"
];

const  view_selection = document.getElementById("view_selection");

view_selection.appendChild(createLiElement(table_view_value, false, switchToTableView));
view_selection.appendChild(createLiElement(paragraph_view_value, true, switchToParagraphView));

const paragraph_content = document.getElementById("paragraph_content");
const table_content = document.getElementById("table_content");

const defaultTableHeaderStyleBackground = "rgba(255,255,255, 0.6)"

const language_title_style = "color: #663300; font-size: 17px; font-weight: bold; text-transform: uppercase; border: double 1px white; background-image: radial-gradient(circle, rgba(255,255,255,0.3), rgba(0,0,0,0.1));";
const concept_title_style = "vertical-align: top; color: darkred; font-size: 16px; text-transform: capitalize; letter-spacing: 1px; text-align: left; border: double 1px white; background-image: linear-gradient(to right, rgba(255,255,255,0.4), rgba(255,255,255,0.1));";
const concept_value_style = "vertical-align: top; color: black; font-family: Tahoma; font-size: 15px; text-align: left; border: solid 1px white; ";

function cookieHandling()
{
    //reading from the cookie file:
    if(document.cookie.length > 0)
    {
        /*If cookie -> setCookie will also set the view.*/
        setCookie();
    }
    else
    {
        /*set the view with default values*/
        setView();
    }
}

function setCookie()
{
    var cookie_elements = document.cookie.split(cookie_element_separator);
    for(var i=0; i<cookie_elements.length; i++)
    {
        var pairs = cookie_elements[i].split("=");
        
        //Process and restore the values stored in the cookie
        
        //Checking if pairs[0] is a VIEW:
        if(pairs[0] == "view")
        {
            if(pairs[1] == "paragraph")
            {
                //Set paragraph view to true
                switchToParagraphView();
            }
            else
            {
                //Set table view to true
                switchToTableView();
            }
        }
        else
        {
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
                if(pairs[1]=="1")
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
    }
    setView();
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
            /*Adding page selection buttons*/
            page_selection.appendChild( createLiElement("Modern", false, changeToModernPage) );
            page_selection.appendChild( createLiElement("Classic", true, changeToClassicPage) );
            
            /*Adding the overall language selection functions*/
            overall_language_selection.appendChild( createLiElement("deselect all", true, deselectionOfAllLanguageElements) );
            overall_language_selection.appendChild( createLiElement("select all", true, selectionOfAllLanguageElements) );
            
            /*Adding the overall concept selection functions*/
            overall_concept_selection.appendChild( createLiElement("deselect all", true, deselectionOfAllConceptElements) );
            overall_concept_selection.appendChild( createLiElement("select all", true, selectionOfAllConceptElements) );
                        
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
                        programming_language_selection.appendChild(createLiElement(programming_languages[index].name, true));
                    }
                    else
                    {
                        programming_language_selection.appendChild(createLiElement(programming_languages[index].name, false));
                    }
                }
            }
            
            /*Adding the concept collection to selection*/
            for(var i=0; i< concept_collection.length; i++)
            {
                concept_selection.appendChild(createLiElement(concept_collection[i], true));
            }
            /*read cookie and/or hanndle the display of the elements*/
            cookieHandling();
        }
    };
    
    //open a GET request to get the item
    xml_http_request.open("GET", xml_file, true);
    
    //send the request to the server
    xml_http_request.send();
}

function showTable()
{
    
    var hidden = table_content.getAttribute("hidden");
    if (hidden) 
    {
        removeTable();
        fillTable();
        table_content.removeAttribute("hidden");
    }
    else
    {
        removeTable();
        fillTable();
    }
}

function removeTable()
{
    var tableHeaderRowCount = 0;
    var rowCount = table_content.rows.length;
    for (var i = tableHeaderRowCount; i < rowCount; i++) {
        table_content.deleteRow(tableHeaderRowCount);
    }
}

function fillTable()
{    
    //Calculate the number of columns to be displayed
    var active_columns = 1; 
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
    var cell = row.insertCell(); //empty cell
    var firstColumnWidth = 16; // start from (16 + active_columns) % for the first column
    cell.style.backgroundColor = defaultTableHeaderStyleBackground;
    cell.style.border = "none 0px white";
    cell.style.width = String(firstColumnWidth + (active_columns*2) ) + "%";
    
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
                var composed_style = programming_language_div_style[index].replace("linear-gradient(to bottom,", "linear-gradient(to right,");
                cell.style = language_title_style + composed_style;
                cell.style.width = String(100 - firstColumnWidth / active_columns + "%");
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
            cell = row.insertCell(); //empty cell
            
            /*Insert the concept name in the first column*/
            cell.innerHTML = concept_collection[concept_index];
            cell.style = concept_title_style;
            
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
                        cell.style = concept_value_style + programming_language_div_style[index];
                                                
                        /*If the concept exists for this language*/
                        if(found_element_index >= 0) 
                        {
                            cell.innerHTML = programming_languages[index].concepts[found_element_index].concept_value;
                            checkCopyConceptFromGeneralKnowledge(cell, programming_languages[index].concepts[found_element_index]);
                        }
                        else
                        {
                            cell.innerHTML = "NA";
                        }
                    }
                }
            }
        }
    }
}

function createLiElement(string_value, enablingStatus, function_behaviour)
{
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
    if(function_behaviour == undefined)
    {
        li.onclick = function () 
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
            setView();
        }
    }
    else
    {
        li.onclick = function_behaviour;
    }
    return li;
}

function deselectionOfAllConceptElements() 
{
    for(var i = 0; i < concept_selection.children.length; i++)
    {
        if (concept_selection.children[i] != this)
        {
            concept_selection.children[i].value = false;
            concept_selection.children[i].style = tag_selection_off;
            updateCookie(concept_selection.children[i].innerHTML, concept_selection.children[i].value);
        }
    }
    setView();
}

function selectionOfAllConceptElements() 
{
    for(var i = 0; i < concept_selection.children.length; i++)
    {
        if (concept_selection.children[i] != this)
        {
            concept_selection.children[i].value = true;
            concept_selection.children[i].style = tag_selection_on;
            updateCookie(concept_selection.children[i].innerHTML, concept_selection.children[i].value);
        }
    }
    setView();
}

function deselectionOfAllLanguageElements() 
{
    for(var i = 0; i < programming_language_selection.children.length; i++)
    {
        if (programming_language_selection.children[i] != this)
        {
            programming_language_selection.children[i].value = false;
            programming_language_selection.children[i].style = tag_selection_off;
            updateCookie(programming_language_selection.children[i].innerHTML, programming_language_selection.children[i].value);
        }
    }
    setView();
}

function selectionOfAllLanguageElements() 
{
    for(var i = 0; i < programming_language_selection.children.length; i++)
    {
        if (programming_language_selection.children[i] != this)
        {
            programming_language_selection.children[i].value = true;
            programming_language_selection.children[i].style = tag_selection_on;
            updateCookie(programming_language_selection.children[i].innerHTML, programming_language_selection.children[i].value);
        }
    }
    setView();
}

function switchToTableView()
{
    //Check if paragraph view is true
    if(view_selection.children[1].value == true)
    {
        for(var i = 0; i < view_selection.children.length; i++)
        {
            if (view_selection.children[i].innerHTML != table_view_value)
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
        updateCookie("view", "table");
        var hidden = paragraph_content.getAttribute("hidden");
        if (!hidden) 
        {
            paragraph_content.setAttribute("hidden", "hidden");
        }
    }
}

function switchToParagraphView()
{
    //Check if table view is true
    if(view_selection.children[0].value == true)
    {
        for(var i = 0; i < view_selection.children.length; i++)
        {
            if (view_selection.children[i].innerHTML != paragraph_view_value)
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
        showParagraph();
        updateCookie("view", "paragraph");
        var hidden = table_content.getAttribute("hidden");
        if (!hidden) 
        {
            table_content.setAttribute("hidden", "hidden");
        }
    }
}

function showParagraph()
{
    var hidden = paragraph_content.getAttribute("hidden");
    if (hidden) 
    {
        removeParagraph();
        fillParagraph();
        paragraph_content.removeAttribute("hidden");
    }
    else
    {
        removeParagraph();
        fillParagraph();
    }
}

function removeParagraph()
{
    while (paragraph_content.children[0] != null) {
        paragraph_content.removeChild(paragraph_content.children[0]); // always remove the first element in the collection
        //removing element at index 0 will make the next one index 0
    }

}

function setView()
{
    for(var i=0; i< view_selection.children.length; i++)
    {
        if(view_selection.children[i].value == true)
        {
            if(view_selection.children[i].innerHTML == paragraph_view_value)
            {
                showParagraph();
            }
            else if (view_selection.children[i].innerHTML == table_view_value)
            {
                showTable();
            }
            break;
        }
    }
}

function fillParagraph()
{
    var index = 0;
    programming_languages.forEach(async (language) => {
        for(var lang_selection_index=0; lang_selection_index < programming_language_selection.children.length; lang_selection_index++)
        {
            /*if language is selected to be displayed*/
            if(programming_language_selection.children[lang_selection_index].innerHTML == language.name && programming_language_selection.children[lang_selection_index].value==true)
            {
                var div = document.createElement("div");
                div.style = programming_language_div_style[index];
                var p = document.createElement("p");
                p.innerHTML = language.name;
                p.style = language_title_style;
                div.appendChild(p);
                for(var concept_index=0; concept_index < language.concepts.length; concept_index++)
                {
                    var found_element_index = concept_collection.findIndex(element => element == language.concepts[concept_index].concept_name);
                    /*
                    The findIndex() method of Array instances returns the index of the first element in an 
                    array that satisfies the provided testing function. If no elements satisfy the testing 
                    function, -1 is returned.
                    */
                    if(found_element_index >= 0  && concept_selection.children[found_element_index].value == true)
                    {
                        if(programming_language_selection.children[lang_selection_index].innerHTML == language.name && programming_language_selection.children[lang_selection_index].value==true)
                        {    
                            var p = document.createElement("p")
                            p.innerHTML = language.concepts[concept_index].concept_name + ":"
                            p.style = concept_title_style;
                            div.appendChild(p);
                            
                            
                            p = document.createElement("p")
                            p.innerHTML += language.concepts[concept_index].concept_value;
                            checkCopyConceptFromGeneralKnowledge(p, language.concepts[concept_index]);
                            
                            p.style = concept_value_style;
                            div.appendChild(p);
                        }
                    }
                }
                paragraph_content.appendChild(div);
            }
        }
        index++;
    });
}

function checkCopyConceptFromGeneralKnowledge(html_element, concept)
{
    //Enter here if this is paragraph or table cell
    if(String(html_element.tagName).toLowerCase() == "p" ||
        String(html_element.tagName).toLowerCase() == "td")
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
                p.innerHTML = String(p.innerHTML).replace(copy_GeneralKnowledge_token, "");
            }
            
        }
    }
}

function changeToModernPage()
{
    if(this.value == false)
    {
        updateCookie("page", "modern");
        window.location.href = "./portal.html";
    }
}

function changeToClassicPage()
{
    if(this.value == false)
    {
        updateCookie("page", "classic");
        window.location.href = "./portal_classic.html";
    }
}

loadXMLDoc(online_xml_file);