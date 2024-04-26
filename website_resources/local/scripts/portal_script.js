var online_xml_file = "https://raw.githubusercontent.com/dragos-vacariu/portfolio/main/programming_languages_database.xml";
var programming_languages = [];
var concept_selection = document.getElementById("concept_selection");
var programming_language_selection = document.getElementById("programming_language_selection");
var overall_concept_selection = document.getElementById("overall_concept_selection");
var overall_language_selection = document.getElementById("overall_language_selection");

var view_selection = document.getElementById("view_selection");

view_selection.appendChild(createLiElement("table view", true, switchToTableView));
view_selection.appendChild(createLiElement("paragraph view", true, switchToParagraphView));
view_selection.children[0].value = false;
view_selection.children[1].value = true;


var paragraph_content = document.getElementById("paragraph_content");
var table_content = document.getElementById("table_content");

var defaultTableHeaderStyleBackground = "rgba(255,255,255, 0.6)"


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
			
			/*Adding the concept selection*/
			for(var i=0; i< programming_languages[0].concepts.length; i++)
			{
				concept_selection.appendChild(createLiElement(programming_languages[0].concepts[i].concept_name, true));
			}
			
			/*Adding the programming language selection*/
			for(var i=0; i< programming_languages.length; i++)
			{
				if(i<3)
				{
					programming_language_selection.appendChild(createLiElement(programming_languages[i].name, true));
				}
				else
				{
					programming_language_selection.appendChild(createLiElement(programming_languages[i].name, false));
				}
			}
			setView();
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
	cell.style.backgroundColor = defaultTableHeaderStyleBackground;
	var active_columns = 0; 
	for(var j=0; j<programming_language_selection.children.length; j++)
	{
		if(programming_language_selection.children[j].value == true)
		{
			active_columns++;
		}
	}
	//draw the first raw in the table (also known as table header)
	programming_languages.forEach(async (language) => {
		for(var i=0; i<programming_language_selection.children.length; i++)
		{
			if(programming_language_selection.children[i].innerHTML == language.name && programming_language_selection.children[i].value==true)
			{
				cell = row.insertCell();
				cell.innerHTML = language.name;
				cell.style.fontSize = "150%";
				cell.style.textTransform = "uppercase";
				cell.style.backgroundColor = defaultTableHeaderStyleBackground;
				cell.width = String(100 / active_columns) + "%";
			}
		}
	});
	
	//draw the rest of the table
	for(var j=0; j < programming_languages[0].concepts.length; j++)
	{
		if(programming_languages[0].concepts[j].concept_name == concept_selection.children[j].innerHTML &&
			concept_selection.children[j].value == true)
		{
			row = table_content.insertRow();
			cell = row.insertCell(); //empty cell
			cell.innerHTML = programming_languages[0].concepts[j].concept_name;
			cell.style.backgroundColor = defaultTableHeaderStyleBackground;
			cell.style.textTransform = "uppercase";
			cell.style.fontSize = "150%";
			for(var i=0; i < programming_languages.length; i++)
			{

				if(programming_language_selection.children[i].innerHTML == programming_languages[i].name && programming_language_selection.children[i].value==true)
				{
					cell = row.insertCell(); //empty cell
					cell.innerHTML = programming_languages[i].concepts[j].concept_value;
					cell.style.textAlign = "left";
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
			showTable();
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
		}
	}
	setView();
}

function switchToTableView()
{
	if(view_selection.children[1].value == true)
	{
		for(var i = 0; i < view_selection.children.length; i++)
		{
			if (view_selection.children[i] != this)
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
		var hidden = paragraph_content.getAttribute("hidden");
		if (!hidden) 
		{
			paragraph_content.setAttribute("hidden", "hidden");
		}
	}
}

function switchToParagraphView()
{
	if(view_selection.children[0].value == true)
	{
		for(var i = 0; i < view_selection.children.length; i++)
		{
			if (view_selection.children[i] != this)
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
		var hidden = table_content.getAttribute("hidden");
		if (!hidden) 
		{
			table_content.setAttribute("hidden", "hidden");
		}
	}
}

loadXMLDoc(online_xml_file);

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
	for (var i = 0; i < paragraph_content.children.length; i++) {
		paragraph_content.removeChild(i);
	}
}

function setView()
{
	for(var i=0; i< view_selection.children.length; i++)
	{
		if(view_selection.children[i].value == true)
		{
			view_selection.children[i].style.opacity = 1;
		}
		else
		{
			view_selection.children[i].style.opacity = 0.3;
		}
	}
	if(view_selection.children[1].value == true)
	{
		showParagraph();
	}
	else
	{
		showTable();
	}
}

function fillParagraph()
{
	programming_languages.forEach(async (language) => {
		for(var i=0; i<programming_language_selection.children.length; i++)
		{
			if(programming_language_selection.children[i].innerHTML == language.name && programming_language_selection.children[i].value==true)
			{
				var p = document.createElement("p")
				p.innerHTML = language.name
				p.style.fontSize = "150%";
				p.style.textTransform = "uppercase";
				p.style.backgroundColor = defaultTableHeaderStyleBackground;
				paragraph_content.appendChild(p);
				for(var j=0; j < programming_languages[0].concepts.length; j++)
				{
					if(programming_languages[0].concepts[j].concept_name == concept_selection.children[j].innerHTML &&
						concept_selection.children[j].value == true)
					{
						if(programming_language_selection.children[i].innerHTML == programming_languages[i].name && programming_language_selection.children[i].value==true)
						{	
							var p = document.createElement("p")
							p.innerHTML = programming_languages[0].concepts[j].concept_name +"<br><br>"
							p.style.fontSize = "90%";
							p.style.textAlign = "left";
							p.style.textTransform = "uppercase";
							p.style.backgroundColor = defaultTableHeaderStyleBackground;
							paragraph_content.appendChild(p);
							
							
							p = document.createElement("p")
							p.innerHTML += programming_languages[i].concepts[j].concept_value;
							p.style.fontSize = "79%";
							p.style.textAlign = "left";
							paragraph_content.appendChild(p);
						}
					}
				}
			}
		}
	});
}