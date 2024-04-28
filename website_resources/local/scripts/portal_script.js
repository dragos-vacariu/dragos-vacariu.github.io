const online_xml_file = "https://raw.githubusercontent.com/dragos-vacariu/portfolio/main/programming_languages_database.xml";
var programming_languages = [];
const concept_selection = document.getElementById("concept_selection");
var concept_collection = [];
const programming_language_selection = document.getElementById("programming_language_selection");
const overall_concept_selection = document.getElementById("overall_concept_selection");
const overall_language_selection = document.getElementById("overall_language_selection");
const cookie_element_separator = "<br>"; 

const paragraph_view_value = "paragraph view";
const table_view_value = "table view";

const programming_language_div_style = [
	"background-color: rgba(0,0,255,0.1); padding: 1vw; margin: 1vw;", 
	"background-color: rgba(255,0,0,0.1);  padding: 1vw; margin: 1vw;", 
	"background-color: rgba(0,255,0,0.1);  padding: 1vw; margin: 1vw;",
	"background-color: rgba(0,255,255,0.1);  padding: 1vw; margin: 1vw;", 
	"background-color: rgba(255,0,255,0.1);  padding: 1vw; margin: 1vw;", 
	"background-color: rgba(255,255,0,0.1);  padding: 1vw; margin: 1vw;"
]

const  view_selection = document.getElementById("view_selection");

view_selection.appendChild(createLiElement(table_view_value, false, switchToTableView));
view_selection.appendChild(createLiElement(paragraph_view_value, true, switchToParagraphView));

const paragraph_content = document.getElementById("paragraph_content");
const table_content = document.getElementById("table_content");

const defaultTableHeaderStyleBackground = "rgba(255,255,255, 0.6)"

const language_title_style = "color: darkgreen; text-shadow: 1px 1px 1px lightgreen; font-size: 16px; text-transform: uppercase; border: double 2px white; background-color: " + defaultTableHeaderStyleBackground + ";";
const concept_title_style = "color: darkred; font-size: 14px; text-transform: capitalize; letter-spacing: 1px; text-align: left; border: dotted 1px white; background-color: rgba(255,255,255,0.2)";
const concept_value_style = "font-size: 12px; text-align: left; border: solid 1px white;";

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
		
		var concept_index = concept_collection.findIndex(element => element == pairs[0]);
		var language_index = programming_languages.findIndex(element => element.name == pairs[0]);
		/*
		The findIndex() method of Array instances returns the index of the first element in an 
		array that satisfies the provided testing function. If no elements satisfy the testing 
		function, -1 is returned.
		*/
		alert("pairs: " + pairs[0] + " = " + pairs[1]);
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
		else if(concept_index >= 0)
		{
			/*The concept_selection.children were added based on concept_collection array. 
			So they wear same index.
			*/
			if(pairs[1]=="1")
			{
				alert("enabling " + pairs[0]);
				concept_selection.children[concept_index].value = true;
				concept_selection.children[concept_index].style.opacity = 1.0;
			}
			else
			{
				alert("disabling " + pairs[0]);
				concept_selection.children[concept_index].value = false;
				concept_selection.children[concept_index].style.opacity = 0.3;
			}
		}
		else if( language_index >= 0 )
		{
			if(pairs[1]=="1")
			{
				programming_language_selection.children[language_index].value = true;
				programming_language_selection.children[language_index].style.opacity = 1.0;
			}
			else
			{
				programming_language_selection.children[language_index].value = false;
				programming_language_selection.children[language_index].style.opacity = 0.3;
			}				
		}
	}
	setView();
}

function updateCookie(property, value)
{
	var cookie_elements = document.cookie.split(cookie_element_separator);
	var matchIndex = cookie_elements.findIndex(String(property+"="+value) );
	if(matchIndex >= 0)
	{
		var cookies = "";
		document.cookie = "";
		for(var i=0; i<cookie_elements.length; i++)
		{
			var pairs = cookie_elements[i].split("=");
			
			if(pairs[0] == property)
			{
				pairs[1] = value;
			}
			var element = pairs[0] + "=" + pairs[1];
			cookies += element;
			if(i < cookie_elements.length-1)
			{
				/*cookie_element_separator = <br> is used as separator. There is no need adding separator after the last item*/
				cookies+= cookie_element_separator;
			}
				
		}
		document.cookie = cookies;
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
			/*get the content of the specified xml tag*/
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
						
			for(var index=0; index< programming_languages.length; index++)
			{
				/*Grabbing all concepts available*/
				for(var concept_index=0; concept_index< programming_languages[index].concepts.length; concept_index++)
				{
					if(concept_collection.includes(programming_languages[index].concepts[concept_index].concept_name) == false)
					{
						concept_collection.push(programming_languages[index].concepts[concept_index].concept_name);
					}
				}
				/*Adding the programming language selection*/
				if(index<3) //display only 3 columns in the table by default
				{
					programming_language_selection.appendChild(createLiElement(programming_languages[index].name, true));
				}
				else
				{
					programming_language_selection.appendChild(createLiElement(programming_languages[index].name, false));
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
	var row = table_content.insertRow();
	var cell = row.insertCell(); //empty cell
	var firstColumnWidth = 30;
	cell.style.backgroundColor = defaultTableHeaderStyleBackground;
	cell.style.border = "none 0px white";
	cell.style.width = String(firstColumnWidth) + "%";
	var active_columns = 0; 
	for(var j=0; j<programming_language_selection.children.length; j++)
	{
		if(programming_language_selection.children[j].value == true)
		{
			active_columns++;
		}
	}
	//draw the first raw in the table (also known as table header)
	
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
				cell.style = language_title_style + programming_language_div_style[index];
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
				/*check if the language is selected to be displayed*/ 
				if(programming_language_selection.children[index].innerHTML == programming_languages[index].name && programming_language_selection.children[index].value==true)
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
						cell.innerHTML = programming_languages[index].concepts[concept_index].concept_value;
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

function createLiElement(string_value, enablingStatus, function_behaviour)
{
	var li = document.createElement("li");
	li.appendChild(document.createTextNode(string_value));
	li.value = enablingStatus;
	if (li.value == true)
	{
		li.style.opacity = 1;
	}
	else
	{
		li.style.opacity = 0.3;
	}
	if(function_behaviour == undefined)
	{
		li.onclick = function () 
		{
			if(this.value == true)
			{
				this.value = false;
				this.style.opacity = 0.3;
			}
			else
			{
				this.value = true;
				this.style.opacity = 1;
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
			concept_selection.children[i].style.opacity = 0.3;
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
			concept_selection.children[i].style.opacity = 1;
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
			programming_language_selection.children[i].style.opacity = 0.3;
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
			programming_language_selection.children[i].style.opacity = 1;
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
				view_selection.children[i].style.opacity = 0.3;
			}
			else
			{
				view_selection.children[i].value = true;
				view_selection.children[i].style.opacity = 1;
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
				view_selection.children[i].style.opacity = 0.3;
			}
			else
			{
				view_selection.children[i].value = true;
				view_selection.children[i].style.opacity = 1;
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
		for(var lang_selection_index=0; lang_selection_index<programming_language_selection.children.length; lang_selection_index++)
		{
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

loadXMLDoc(online_xml_file);