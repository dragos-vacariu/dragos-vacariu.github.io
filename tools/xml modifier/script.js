const red_highlighted = {keyword: ["data", "type", "code", "variable", "function", "class", "object"], color: "red"};
const blue_highlighted = {keyword: ["generic", "template", "programming", "memory", "static", "byte", "string"], color: "blue"};
const cyan_highlighted = {keyword: ["instance", "dynamic", "field", "member", "function"], color: "cyan"};
const pink_highlighted = {keyword: ["return", "value", "size", "free", "thread", "process"], color: "pink"};

const keyword_color_set = {keyword: ["\nint ", " int ", "int/n"], color: "cyan"}

function saveTextAsFile() 
{   
    /*this function will create a blob and save it as file*/
    var textToWrite = '<?xml version="1.0" encoding="UTF-8"?>\n\n' + document.getElementById("modified_textArea").textContent;
    var textFileAsBlob = new Blob([ textToWrite ], { type: "application/xml" });
    var fileNameToSaveAs = "programming_languages_database.xml"; //filename.extension

    var downloadLink = document.createElement("a");
    downloadLink.download = fileNameToSaveAs;
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
}

function readFile(event) 
{
    document.getElementById("initial_textArea").textContent = event.target.result;
    var text = event.target.result;
    
    //Parsing content as xml
    var parser = new DOMParser();
    var xml_Document = parser.parseFromString(text, "application/xml");
            
    /*formatting the xml_Document content*/
    xml_Document = format_XML_Document_Content(xml_Document);
    xml_Document = add_color_to_words(xml_Document, red_highlighted);
    xml_Document = add_color_to_words(xml_Document, blue_highlighted);
    xml_Document = add_color_to_words(xml_Document, cyan_highlighted);
    xml_Document = add_color_to_words(xml_Document, pink_highlighted);
    //xml_Document = add_different_color_to_code_keywords(xml_Document, keyword_color_set);
    //xml_Document = addEmptyLines(xml_Document);
    
    //Displaying the output
    var result = new XMLSerializer().serializeToString(xml_Document.documentElement);
    document.getElementById("modified_textArea").textContent = result;
}

function addStyleCodeBoxes(contentToPutInBox)
{
    //This function will draw a box around the code elements
    contentToPutInBox = "<box>" + contentToPutInBox + "</box>"
    return contentToPutInBox;
}

function changeFile() 
{
    var file = document.getElementById("file_button").files[0];
    var reader = new FileReader();
    reader.addEventListener('load', readFile);
    reader.readAsText(file);
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

function add_color_to_words(xml_Document_Content, list_of_words)
{
    var programming_languages =  xml_Document_Content.getElementsByTagName("programming_language");    
    for(var i=0; i < programming_languages.length; i++)
    {
        for(var j=0; j < programming_languages[i].children.length; j++)
        {
            //workaround for elements that should not be modified:
            programming_languages[i].children[j].innerHTML = programming_languages[i].children[j].innerHTML.replaceAll("General-Programming-Knowledge", "<green>General-Programming-Knowledge</green>")
            
            //Format the text by adding highlights on every finding:
            var items = programming_languages[i].children[j].innerHTML.trim().split(">")
            
            //Put case-insesitive findings between <searchHighlight> tags. This will allow us to highlight the findings word for word
            for (var counter = 0; counter < items.length; counter++)
            {
                //if some word includes the one of the value within the searchBox
                bufferOfItem = items[counter] /*items should not be modified directly because it's used for checking and validation*/
                for(var word_index = 0; word_index < list_of_words.keyword.length; word_index++)
                {
                    var indexOfLessThan = String(items[counter]).indexOf("<");
                    var indexOfSearchValue = String(items[counter]).toLowerCase().indexOf(String(list_of_words.keyword[word_index]).toLowerCase());
                    
                    //If this element is not part of the content of the following elements
                    if (String(items[counter]).toLowerCase().includes("</green") == false  &&
                        String(items[counter]).toLowerCase().includes("</brown") == false &&
                        String(items[counter]).toLowerCase().includes("</code") == false &&
                        String(items[counter]).toLowerCase().includes("</linenumber") == false &&
                        String(items[counter]).toLowerCase().includes("</td") == false &&
                        String(items[counter]).toLowerCase().includes("</tr") == false &&
                        String(items[counter]).toLowerCase().includes("</comment") == false )
                    {
                        //If this element is not withing a XML tag
                        console.log("Validating: " + list_of_words.keyword[word_index] + " in " + items[counter])
                        if(String(items[counter]).toLowerCase().includes(String(list_of_words.keyword[word_index]).toLowerCase())
                                && (String(items[counter]).includes("<") == false || indexOfLessThan
                                > indexOfSearchValue)
                        )
                        {
                            
                            values = String(bufferOfItem).split(" ")
                            
                            for(var value_index = 0; value_index < values.length; value_index++)
                            {
                                //Ignore some of the punctuation signs and newline character
                                var string_val = String(values[value_index]).replaceAll(",", "");
                                string_val = string_val.replaceAll(".", "");
                                string_val = string_val.replaceAll("!", "");
                                string_val = string_val.replaceAll("?", "");
                                string_val = string_val.replaceAll(":", "");
                                string_val = string_val.replaceAll("\n", "");
                                //console.log("Checking word: " + values[value_index] + " as " + string_val + " == " + list_of_words.keyword[word_index])
                                //if found exactly the same word or its plural form
                                if(string_val.toLowerCase() == String(list_of_words.keyword[word_index]) || 
                                    string_val.toLowerCase() == String(list_of_words.keyword[word_index]) + "s" || 
                                    string_val.toLowerCase() == String(list_of_words.keyword[word_index]) + "es"
                                    )
                                {
                                    //console.log("Entered at " + string_val)
                                    values[value_index] = values[value_index].replaceAll(string_val, "<" + list_of_words.color + ">" + string_val + "</" + list_of_words.color + ">"); 
                                }
                            }
                            bufferOfItem = values.join(" ")
                        }
                    }

                }
                items[counter] = bufferOfItem
            }
            programming_languages[i].children[j].innerHTML = items.join(">")
            //Undoing the workaround:
            programming_languages[i].children[j].innerHTML = programming_languages[i].children[j].innerHTML.replaceAll("<green>General-Programming-Knowledge</green>", "General-Programming-Knowledge")
            //console.log(programming_languages[i].children[j].innerHTML)
        }
    }
    return xml_Document_Content
}

function addEmptyLines(xml_Document_Content)
{
    var programming_languages =  xml_Document_Content.getElementsByTagName("programming_language");    
    for(var i=0; i < programming_languages.length; i++)
    {
        for(var j=0; j < programming_languages[i].children.length; j++)
        {
            //workaround for elements that should not be modified:
            programming_languages[i].children[j].innerHTML = programming_languages[i].children[j].innerHTML.replaceAll("General-Programming-Knowledge", "<green>General-Programming-Knowledge</green>")
            
            //Format the text by adding highlights on every finding:
            var items = programming_languages[i].children[j].innerHTML.trim().split(">")
            
            //Put case-insesitive findings between <searchHighlight> tags. This will allow us to highlight the findings word for word
            for (var counter = 0; counter < items.length; counter++)
            {
                var indexOfLessThan = String(items[counter]).indexOf("<");
                var searchValue = "\n".trim() + "\n";
                var indexOfSearchValue = String(items[counter]).toLowerCase().indexOf(searchValue);
                
                //If this is not one of the elements used as header
                if (String(items[counter]).toLowerCase().includes("</green") == false  &&
                    String(items[counter]).toLowerCase().includes("</brown") == false &&
                    String(items[counter]).toLowerCase().includes("</code") == false &&
                    String(items[counter]).toLowerCase().includes("</linenumber") == false &&
                    String(items[counter]).toLowerCase().includes("</td") == false &&
                    String(items[counter]).toLowerCase().includes("</tr") == false &&
                    String(items[counter]).toLowerCase().includes("</comment") == false )
                {
                    //console.log(items[counter])
                    //If this is not within a tag
                    if(String(items[counter]).toLowerCase().includes(searchValue)
                            && (String(items[counter]).includes("<") == false || indexOfLessThan
                            > indexOfSearchValue)
                    )
                    
                    {
                        var lines = items[counter].split("\n");
                        for(var line_index = 0; line_index < lines.length; line_index++)
                        {
                            if (lines[line_index].trim() == "")
                            {
                                /*It means we are between 2 consecutive \n's*/
                                lines[line_index] = "<br></br>" + lines[line_index];
                            }
                            
                        }
                        items[counter] = lines.join("\n");
                        //console.log(items[counter])
                    }
                }
            }
            programming_languages[i].children[j].innerHTML = items.join(">")
            //Undoing the workaround:
            programming_languages[i].children[j].innerHTML = programming_languages[i].children[j].innerHTML.replaceAll("<green>General-Programming-Knowledge</green>", "General-Programming-Knowledge")
            //console.log(programming_languages[i].children[j].innerHTML)
        }
    }
    return xml_Document_Content
}

function add_different_color_to_code_keywords(xml_Document_Content, keyword_color_set)
{
    var programming_languages =  xml_Document_Content.getElementsByTagName("programming_language");    
    for(var i=0; i < programming_languages.length; i++)
    {
        for(var j=0; j < programming_languages[i].children.length; j++)
        {
            //Format the text by adding highlights on every finding:
            var items = programming_languages[i].children[j].innerHTML.trim().split(">")
            
            //Put case-insesitive findings between <searchHighlight> tags. This will allow us to highlight the findings word for word
            for (var counter = 0; counter < items.length; counter++)
            {
                //if some word includes the one of the value within the searchBox
                for(var word_index = 0; word_index < keyword_color_set.keyword.length; word_index++)
                {
                    var indexOfLessThan = String(items[counter]).indexOf("<");
                    var indexOfSearchValue = String(items[counter]).toLowerCase().indexOf(String(keyword_color_set.keyword[word_index]).toLowerCase());
                    
                    //If this is not one of the elements used as header
                    if (String(items[counter]).toLowerCase().includes("<code") == true || String(items[counter]).toLowerCase().includes("</code") == true ||
                        String(items[counter]).toLowerCase().includes("<td") == true || String(items[counter]).toLowerCase().includes("</td") == true ||
                        String(items[counter]).toLowerCase().includes("<linenumber") == true || String(items[counter]).toLowerCase().includes("</linenumber") == true &&
                        (String(items[counter]).toLowerCase().includes("<comment") == false && String(items[counter]).toLowerCase().includes("</comment") == false ) )
                    {
                        console.log(items[counter])
                        //If this is not within a tag
                        if(String(items[counter]).toLowerCase().includes(String(keyword_color_set.keyword[word_index]).toLowerCase())
                                && (String(items[counter]).includes("<") == false || indexOfLessThan
                                > indexOfSearchValue)
                        )
                        {
                            //get the index of the substring value within the word
                            var index = String(items[counter]).toLowerCase().indexOf(String(keyword_color_set.keyword[word_index]).toLowerCase());
                            
                            //Slicing the word to pieces to add the highlight to the finding within it.
                            //This way we will maintain the case sensitiveness intact.
                            var replacement = items[counter].slice(0, index);
                            replacement += "<" + keyword_color_set.color + ">" + items[counter].slice(index, index + keyword_color_set.keyword[word_index].length) + "</" +keyword_color_set.color + ">";
                            replacement += items[counter].slice(index + keyword_color_set.keyword[word_index].length);
                            items[counter] = replacement;
                        }
                    }
                }
            }
            programming_languages[i].children[j].innerHTML = items.join(">")
        }
    }
    return xml_Document_Content
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