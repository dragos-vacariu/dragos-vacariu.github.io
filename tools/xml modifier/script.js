//Words and expressions associated with classes objects, exceptions, functions, and programming languages and programming paradigms & tools:

const red_colored_substr = {keyword: [
    
    /*Multiple words should be first section*/
    "initialization expression", "test expression", "update expression", "error handle", "vanilla javascript", "react native", "non-generic",
    "exception handle", "parametric polymorph", "ad hoc polymorph", "type checking", "pre-defined", "command-line", "Electronic Control Unit",
    "software component", "real-time"], color: "red"};
    
const red_colored_words = {keyword: [
    /*Single words should be second section*/ 
    "generic", "template", "procedure", "function", "class", "subclass", "malloc", "calloc", "object", "orient", "system", "contruct",
    "instance", "instantiate", "macro", "commandline", "construct", "destruct", "partial", "virtual", "recurse", "parent", "child", "children", 
    "argument", "parameter", "preprocess", "directive", "module", "interface", "setter", "getter", "encapsulate", "oop", "concrete", "implement",
    "recurrent", "polymorphic", "exception", "random", "prototype", "variadic", "overload", "override", "method", "decor", "scope", "pure", 
    "base", "programming", "concurrent", "compute", "language", "reflect", "polymorph", "seal", "pseudo",
    "inherit", "c", "c++", "c#", "js", "javascript", "python", "html", "css", "java", "nodejs", "php", "compile", "ajax", "react", "reactjs", "angular", 
    "angularjs", "opengl", "typescript", "bootstrap", "vanilla", "vuejs", "jquerry", "jquery", "xml", "json", "redux", "jre", "jdk", "gil", 
    "git", "re", "RTE", "bus"], color: "red"};

//Words and expressions associated with variables, collections, data types, operations, values, programming keywords: 
const purple_colored_substr = {keyword: [
    
    /*Multiple words should be first section*/
    "wide character", "long long int", "short int", "long int", "left-shift", "right-shift", "macro constant", 
    "implicit conversion", "explicit conversion", "format specifier", "file handle", "non-mutat", "heap space", "heap memory",
    "stack memory", "stack space", "global access", "global interpreter lock", "Runtime Environment", "Basic Software", 
    "Application Layer", "SWC A"], color: "purple"};
    
const purple_colored_words = {keyword: [
    /*Single words*/
    "static", "byte", "string", "constant", "collect", "data", "type", "list", "identifier", "mutat", "immutat", "decorat", "metadata", "minificate",
    "point", "address", "array", "enum", "enumerate", "char", "union", "struct", "structure", "bool", "boolean", "heap", "stack", "void", "return", 
     "shift", "bitwise", "bit", "null", "nullptr",  "namespace", "true", "false", "typecast", "attribute", "mathematic", "relation", "unary", 
    "break", "cast", "binary", "sign", "unsign", "operate", "assign", "integer", "float", "double", "ternary", "operand", "register", "newline",
    "dereference", "reference", "field", "member", "typedef", "character", "vector", "iter", "valueless", "int", "logic", "meta",
    "protect", "public", "private", "file", "variable", "value", "property", "api", "library", "increment", "decrement", "remove", "arithmetic",
    "size", "arraylist", "abstractlist", "dictionary", "obsolete", "global", "garbage", "key", "set", "tuple", "cursor", "subtype",
    "architecture", "AUTOSAR", "Layer"], color: "purple"};

//Words and expressions associated with various concepts or special terms:
const azure_colored_substr = {keyword: [
    
    /*Multiple words should be first section*/
    "for loop", "do while loop", "while loop", "foreach loop", "for each loop", "for-each loop", "single-thread", "multi-thread", "critical section",
     "single-core", "multi-core", "dual-core", "quad-core", "non-determinism",  "race condition", "last in first out", "low level", "high level",
    "first in last out", "memory leak", "not allow", "access modifier", "regular expression", "back-end", "front-end",
    "Services Layer", "ECU Abstraction Layer", "Microcontroller Abstraction Layer", "Complex Drivers", "SWC B"], color: "azure"};

const azure_colored_words = {keyword: [
    /*Single words should be second section*/
    "overflow", "underflow", "thread", "multiprocess", "loop", "lifo", "fifo", "allow", "script", "quantity", "primitive",
    "serializ", "deserializ", "multithread", "hyperthread", "asynchronous", "synchronous", "sequential", "simultaneous", 
    "asynchrony", "parallel", "synchronization", "overhead", "responsive",  "efficient", "backend", "frontend",
    "statement", "maintain",  "memory",  "dynamic", "abstract", "block", "compliment", "independent", "plugin", "default", 
    "efficiency", "server", "condition", "count", "delete", "add", "share", "save", "store", "retrieve", "match", "lambda",
    "code", "manipulate", "comment", "sequence", "create", "open", "read", "write", "close", "start", "run", "task", "cpu", "core", "stream", "signal", 
    "process", "reuse", "port", "repo", "header", "source", "ram", "insert", "append", "ui", "replace", "concatenate", 
    "compare", "allocat", "search", "update", "slice", "derive", "VFB",  "ECU", "Abstraction"], color: "azure"};

//const test = {keyword: ["command-line"], color: "azure"};

const keyword_color_set = {keyword: ["\nint ", " int ", "int/n"], color: "cyan"}

function saveTextAsFile() 
{   
    /*this function will create a blob and save it as file*/
    var textToWrite = '<?xml version="1.0" encoding="UTF-8"?>\n\n' + document.getElementById("modified_textArea").textContent;
    var textFileAsBlob = new Blob([ textToWrite ], { type: "application/xml" });
    var fileNameToSaveAs = "programming_languages_database_processed.xml"; //filename.extension

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
    xml_Document = format_XML_Document_CODE_Content(xml_Document);
    xml_Document = add_color_to_XML_Content(xml_Document);
    
    
    //xml_Document = add_different_color_to_code_keywords(xml_Document, keyword_color_set);
    //xml_Document = addEmptyLines(xml_Document);
    
    //Displaying the output
    var result = new XMLSerializer().serializeToString(xml_Document.documentElement);
    document.getElementById("modified_textArea").textContent = result;
}

function changeFile() 
{
    var file = document.getElementById("file_button").files[0];
    var reader = new FileReader();
    reader.addEventListener('load', readFile);
    reader.readAsText(file);
}

function add_color_to_XML_Content(xml_Document_Content)
{
    var programming_languages =  xml_Document_Content.getElementsByTagName("programming_language");    
    for(var i=0; i < programming_languages.length; i++)
    {
        for(var j=0; j < programming_languages[i].children.length; j++)
        {
            /*If this is not the name element*/
            if(programming_languages[i].children[j].tagName != "name")
            {
                //workaround for elements that should not be modified:
                programming_languages[i].children[j].innerHTML = programming_languages[i].children[j].innerHTML.replaceAll("General-Programming-Knowledge", "<green>General-Programming-Knowledge</green>")
                
                //Workaround for the <br> tags so that they will not force writing content within other formated elements
                programming_languages[i].children[j].innerHTML = programming_languages[i].children[j].innerHTML.replaceAll("<br>", "{[(_br_)]}")
                programming_languages[i].children[j].innerHTML = programming_languages[i].children[j].innerHTML.replaceAll("</br>", "{[(_#br_)]}")
                programming_languages[i].children[j].innerHTML = programming_languages[i].children[j].innerHTML.replaceAll("<br/>", "{[(_br#_)]}")
                
                //Format the text by adding color tags on every finding:
                
                /*Add color to words and sustrings stored in singletons*/
                programming_languages[i].children[j].innerHTML = addColorTags(programming_languages[i].children[j].innerHTML, red_colored_substr);
                programming_languages[i].children[j].innerHTML = addColorTags(programming_languages[i].children[j].innerHTML, purple_colored_substr);
                programming_languages[i].children[j].innerHTML = addColorTags(programming_languages[i].children[j].innerHTML, azure_colored_substr);
                programming_languages[i].children[j].innerHTML = addColorTags(programming_languages[i].children[j].innerHTML, red_colored_words);
                programming_languages[i].children[j].innerHTML = addColorTags(programming_languages[i].children[j].innerHTML, purple_colored_words);
                programming_languages[i].children[j].innerHTML = addColorTags(programming_languages[i].children[j].innerHTML, azure_colored_words);
                //programming_languages[i].children[j].innerHTML = addColorTags(programming_languages[i].children[j].innerHTML, test);
                
                
                //Undoing the workarounds:
                programming_languages[i].children[j].innerHTML = programming_languages[i].children[j].innerHTML.replaceAll("{[(_br_)]}", "<br>")
                programming_languages[i].children[j].innerHTML = programming_languages[i].children[j].innerHTML.replaceAll("{[(_#br_)]}", "</br>")
                programming_languages[i].children[j].innerHTML = programming_languages[i].children[j].innerHTML.replaceAll("{[(_br#_)]}", "<br/>")
                
                programming_languages[i].children[j].innerHTML = programming_languages[i].children[j].innerHTML.replaceAll("<green>General-Programming-Knowledge</green>", "General-Programming-Knowledge")
                //console.log(programming_languages[i].children[j].innerHTML)
            }
        }
    }
    return xml_Document_Content
}

function addColorTags(XML_Element_InnerHTML_Content, list_of_words)
{
    //Splitting the content aroung any other XML tags
    var items = XML_Element_InnerHTML_Content.trim().split(">")
    
    //Put case-insesitive findings between <searchHighlight> tags. This will allow us to highlight the findings word for word
    for (var counter = 0; counter < items.length; counter++)
    {
        //if some word includes the one of the value within the searchBox
        bufferOfItem = items[counter]; /*items[counter] should not be modified directly because it's used for checking and validation*/
        for(var word_index = 0; word_index < list_of_words.keyword.length; word_index++)
        {
            var indexOfLessThan = String(items[counter]).indexOf("<");
            var indexOfSearchValue = String(items[counter]).toLowerCase().indexOf(String(list_of_words.keyword[word_index]).toLowerCase());
            
            //If this element is not part of the content of the following elements
            if (String(items[counter]).toLowerCase().includes("</green") == false  &&
                String(items[counter]).toLowerCase().includes("</brown") == false &&
                String(items[counter]).toLowerCase().includes("</indigo") == false &&
                String(items[counter]).toLowerCase().includes("</red") == false &&
                String(items[counter]).toLowerCase().includes("</purple") == false &&
                String(items[counter]).toLowerCase().includes("</azure") == false &&
                String(items[counter]).toLowerCase().includes("</code") == false &&
                String(items[counter]).toLowerCase().includes("</linenumber") == false &&
                String(items[counter]).toLowerCase().includes("</td") == false &&
                String(items[counter]).toLowerCase().includes("</tr") == false &&
                String(items[counter]).toLowerCase().includes("</comment") == false &&
                String(items[counter]).toLowerCase().includes("<comment") == false )
            {
                //If this element is not withing a XML tag
                
                //console.log("Validating: " + list_of_words.keyword[word_index] + " in " + items[counter])
                
                if( (String(items[counter]).toLowerCase().replaceAll("-", " ").includes(String(list_of_words.keyword[word_index]).toLowerCase()) ||
                     String(items[counter]).toLowerCase().replaceAll("/", " ").includes(String(list_of_words.keyword[word_index]).toLowerCase()) ||
                            (String(items[counter]).toLowerCase().includes(String(list_of_words.keyword[word_index]).toLowerCase().slice(0, list_of_words.keyword[word_index].length-1))) 
                            && String(list_of_words.keyword[word_index]).length > 2 )
                    && (String(items[counter]).includes("<") == false || indexOfLessThan
                    > indexOfSearchValue)
                )
                {              
                    //console.log("Check goes on");
                    
                    /*Adding special tokens and splitting up the string into list of words*/
                    var values = String(bufferOfItem).replaceAll("/", "#/ "); //this make words separated by / become processable
                    values = values.replaceAll("-", "#- "); //this make words separated by - become processable
                    values = values.split(" ")
                    
                    /*Adding special tokens and splitting up the string into list of words*/
                    var substring_words = String(list_of_words.keyword[word_index]).replaceAll("/", " ");
                    substring_words = substring_words.replaceAll("-", " ");
                    substring_words = substring_words.split(" ");
                    //substring_words = [...new Set(substring_words)] /*ensuring we have only unique words*/
                    
                    for(var value_index = 0; value_index < values.length; value_index++)
                    {
                        var string_val = []
                        
                        //For each word in the substring check if it matches
                        for(var substr_word_index = 0; substr_word_index < substring_words.length; substr_word_index++)
                        {
                            //Ignore some of the punctuation signs and newline character
                            
                            if(value_index+substr_word_index < values.length)
                            {
                                //Ignore some of the punctuation signs and newline character
                                
                                //order of the statements is important as the bigger strings with punctuation marks should be first otherwise webkitURL
                                //risk removing single punctuation signs before matching the bigger pairs
                                
                                string_val.push(String(values[value_index+substr_word_index]).replaceAll("{[(_br_)]}", ""));
                                string_val[string_val.length-1] = string_val[string_val.length-1].replaceAll("{[(_#br_)]}", "");
                                string_val[string_val.length-1] = string_val[string_val.length-1].replaceAll("{[(_br#_)]}", "");
                                string_val[string_val.length-1] = string_val[string_val.length-1].replaceAll(",", "");
                                string_val[string_val.length-1] = string_val[string_val.length-1].replaceAll(".", "");
                                string_val[string_val.length-1] = string_val[string_val.length-1].replaceAll("!", "");
                                string_val[string_val.length-1] = string_val[string_val.length-1].replaceAll("?", "");
                                string_val[string_val.length-1] = string_val[string_val.length-1].replaceAll(":", "");
                                string_val[string_val.length-1] = string_val[string_val.length-1].replaceAll(";", "");
                                string_val[string_val.length-1] = string_val[string_val.length-1].replaceAll('"', "");
                                string_val[string_val.length-1] = string_val[string_val.length-1].replaceAll("(", "");
                                string_val[string_val.length-1] = string_val[string_val.length-1].replaceAll(")", "");
                                
                                string_val[string_val.length-1] = string_val[string_val.length-1].replaceAll("\n", "");
                                
                                /*Removing special tokens*/
                                string_val[string_val.length-1] = string_val[string_val.length-1].replaceAll("#/", "");
                                string_val[string_val.length-1] = string_val[string_val.length-1].replaceAll("#-", "");
                                
                                /*If a tag is following it, get only the part outside of the tag*/
                                string_val[string_val.length-1] = string_val[string_val.length-1].split("<")[0];
                                
                                
                                //console.log("Checking word: " + string_val[string_val.length-1] + " == " + substring_words[substr_word_index])
                                
                                //if found exactly the same word or its plural form, or past tense verb form or noun derivated form
                                if(string_val[string_val.length-1].toLowerCase() == String(substring_words[substr_word_index]).toLowerCase() || 
                                        string_val[string_val.length-1].toLowerCase() == String(substring_words[substr_word_index]).toLowerCase() + "s" || 
                                        string_val[string_val.length-1].toLowerCase() == String(substring_words[substr_word_index]).toLowerCase() + "'s" || 
                                        string_val[string_val.length-1].toLowerCase() == String(substring_words[substr_word_index]).toLowerCase() + "r" || 
                                        string_val[string_val.length-1].toLowerCase() == String(substring_words[substr_word_index]).toLowerCase() + "es" ||
                                        string_val[string_val.length-1].toLowerCase() == String(substring_words[substr_word_index]).toLowerCase() + "er" ||
                                        string_val[string_val.length-1].toLowerCase() == String(substring_words[substr_word_index]).toLowerCase() + "ers" ||
                                        string_val[string_val.length-1].toLowerCase() == String(substring_words[substr_word_index]).toLowerCase() + "d" ||
                                        string_val[string_val.length-1].toLowerCase() == String(substring_words[substr_word_index]).toLowerCase() + "ed" ||
                                        string_val[string_val.length-1].toLowerCase() == String(substring_words[substr_word_index]).toLowerCase() + "ly" || 
                                        string_val[string_val.length-1].toLowerCase() == String(substring_words[substr_word_index]).toLowerCase() + "ally" ||
                                        string_val[string_val.length-1].toLowerCase() == String(substring_words[substr_word_index]).toLowerCase() + "able" ||
                                        string_val[string_val.length-1].toLowerCase() == String(substring_words[substr_word_index]).toLowerCase() + "ness" ||
                                        string_val[string_val.length-1].toLowerCase() == String(substring_words[substr_word_index]).toLowerCase() + "al" ||
                                        string_val[string_val.length-1].toLowerCase() == String(substring_words[substr_word_index]).toLowerCase() + "ing" ||
                                        string_val[string_val.length-1].toLowerCase() == String(substring_words[substr_word_index]).toLowerCase() + "ion" ||
                                        string_val[string_val.length-1].toLowerCase() == String(substring_words[substr_word_index]).toLowerCase() + "ions" ||
                                        string_val[string_val.length-1].toLowerCase() == String(substring_words[substr_word_index]).toLowerCase() + "ison" ||
                                        string_val[string_val.length-1].toLowerCase() == String(substring_words[substr_word_index]).toLowerCase() + "ation" ||
                                        string_val[string_val.length-1].toLowerCase() == String(substring_words[substr_word_index]).toLowerCase() + "ations" ||
                                        string_val[string_val.length-1].toLowerCase() == String(substring_words[substr_word_index]).toLowerCase() + "ability" ||
                                        string_val[string_val.length-1].toLowerCase() == String(substring_words[substr_word_index]).toLowerCase() + "abilities" ||
                                        string_val[string_val.length-1].toLowerCase() == String(substring_words[substr_word_index]).toLowerCase() + "ance" ||
                                        string_val[string_val.length-1].toLowerCase() == String(substring_words[substr_word_index]).toLowerCase() + "ism" ||
                                        string_val[string_val.length-1].toLowerCase() == String(substring_words[substr_word_index]).toLowerCase() + "or" ||
                                        string_val[string_val.length-1].toLowerCase() == String(substring_words[substr_word_index]).toLowerCase() + "ors" ||
                                        string_val[string_val.length-1].toLowerCase() == String(substring_words[substr_word_index]).toLowerCase() + "ar" ||
                                        string_val[string_val.length-1].toLowerCase() == String(substring_words[substr_word_index]).toLowerCase() + "ive" ||
                                        
                                        (String(substring_words[substr_word_index]).toLowerCase().length > 2 && ( 
                                        /*if length of searched word is bigger than 2 we will look for derivatives*/
                                        string_val[string_val.length-1].toLowerCase() == String(substring_words[substr_word_index]).toLowerCase().slice(0, substring_words[substr_word_index].length-1) + "ies" ||
                                        string_val[string_val.length-1].toLowerCase() == String(substring_words[substr_word_index]).toLowerCase().slice(0, substring_words[substr_word_index].length-1) + "ied" ||
                                        string_val[string_val.length-1].toLowerCase() == String(substring_words[substr_word_index]).toLowerCase().slice(0, substring_words[substr_word_index].length-1) + "al" ||
                                        string_val[string_val.length-1].toLowerCase() == String(substring_words[substr_word_index]).toLowerCase().slice(0, substring_words[substr_word_index].length-1) + "ing" ||
                                        string_val[string_val.length-1].toLowerCase() == String(substring_words[substr_word_index]).toLowerCase().slice(0, substring_words[substr_word_index].length-1) + "able" ||
                                        string_val[string_val.length-1].toLowerCase() == String(substring_words[substr_word_index]).toLowerCase().slice(0, substring_words[substr_word_index].length-1) + "ion" ||
                                        string_val[string_val.length-1].toLowerCase() == String(substring_words[substr_word_index]).toLowerCase().slice(0, substring_words[substr_word_index].length-1) + "ions" ||
                                        string_val[string_val.length-1].toLowerCase() == String(substring_words[substr_word_index]).toLowerCase().slice(0, substring_words[substr_word_index].length-1) + "ison" ||
                                        string_val[string_val.length-1].toLowerCase() == String(substring_words[substr_word_index]).toLowerCase().slice(0, substring_words[substr_word_index].length-1) + "ation" ||
                                        string_val[string_val.length-1].toLowerCase() == String(substring_words[substr_word_index]).toLowerCase().slice(0, substring_words[substr_word_index].length-1) + "ations" ||
                                        string_val[string_val.length-1].toLowerCase() == String(substring_words[substr_word_index]).toLowerCase().slice(0, substring_words[substr_word_index].length-1) + "ability" ||
                                        string_val[string_val.length-1].toLowerCase() == String(substring_words[substr_word_index]).toLowerCase().slice(0, substring_words[substr_word_index].length-1) + "abilities" ||
                                        string_val[string_val.length-1].toLowerCase() == String(substring_words[substr_word_index]).toLowerCase().slice(0, substring_words[substr_word_index].length-1) + "ance" ||
                                        string_val[string_val.length-1].toLowerCase() == String(substring_words[substr_word_index]).toLowerCase().slice(0, substring_words[substr_word_index].length-1) + "ism" ||
                                        string_val[string_val.length-1].toLowerCase() == String(substring_words[substr_word_index]).toLowerCase().slice(0, substring_words[substr_word_index].length-1) + "or" ||
                                        string_val[string_val.length-1].toLowerCase() == String(substring_words[substr_word_index]).toLowerCase().slice(0, substring_words[substr_word_index].length-1) + "ors" ||
                                        string_val[string_val.length-1].toLowerCase() == String(substring_words[substr_word_index]).toLowerCase().slice(0, substring_words[substr_word_index].length-1) + "ar" ||
                                        string_val[string_val.length-1].toLowerCase() == String(substring_words[substr_word_index]).toLowerCase().slice(0, substring_words[substr_word_index].length-1) + "ive" 
                                            ) 
                                        )
                                    )
                                {
                                    //Nothing to do, check goes on
                                }
                                else
                                {
                                    //will break out on first mismatch
                                    break;
                                }
                                if(substr_word_index+1 == substring_words.length)
                                {
                                    //console.log("Found : " + substring_words.join(" "))
                                    
                                    /*will enter here at the end of last iteration if the validation was successful*/
                                    for(var i=0; i<string_val.length; i++)
                                    {
                                        
                                        values[i+value_index] = values[i+value_index].replace(string_val[i], "<" + list_of_words.color + ">" + string_val[i] + "</" + list_of_words.color + ">");
                                    }
                                    
                                }
                                
                            }
                            else
                            {
                                //will break out when the number of the remaining words is less than number of words we need to check
                                break;
                            }
                        }
                        
                    }
                    values.join(" ");
                    bufferOfItem = values.join(" ");
                    
                    //Replace back the special tokens to their initial values.
                    bufferOfItem = bufferOfItem.replaceAll("#/ ", "/");
                    bufferOfItem = bufferOfItem.replaceAll("#- ", "-");
                }
            }
        }
        items[counter] = bufferOfItem;
    }
    XML_Element_InnerHTML_Content = items.join(">")
    return XML_Element_InnerHTML_Content;
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

function format_XML_Document_CODE_Content(xml_Document_Content)
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
                content = lines[i]
                
                //This will ensure that we are able to copy newlines / empty lines within the code
                if (content == "")
                {
                    content = "\n"
                }
                
                //Insert lineNumber and content in different table columns
                lines[i] = "<tr>" + "<td style='width:46px; text-align:left; padding:0px;" +
                "margin:0px; border: solid 1px rgba(0,0,0,0.1);'>" +
                "<lineNumber>" + i + spaces + "</lineNumber>" + "</td>" + 
                "<td style='text-align:left; padding:0px; margin:0px;'>" + content + 
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

function addStyleCodeBoxes(contentToPutInBox)
{
    //This function will draw a box around the code elements
    contentToPutInBox = "<box>" + contentToPutInBox + "</box>"
    return contentToPutInBox;
}