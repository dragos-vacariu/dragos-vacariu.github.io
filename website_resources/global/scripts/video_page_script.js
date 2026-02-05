/*Adding fading-out transition to the homepage first paragraph*/

document.addEventListener('DOMContentLoaded', () => {
    const video_page_navigation = document.getElementById("video_page_nav");
    
    if(video_page_navigation)
    {
        const back_url = document.createElement("button");
        back_url.onclick = function(){
            window.location.href = "../../catalogue.html";
        }
        back_url.innerText = "< Catalogue";
        back_url.id = "back_button";
        
        video_page_navigation.appendChild(back_url);
        
        const span = document.createElement("span");
        var title = document.title;
        title = title.replace("Catalogue -", "");
        title = title.replace("- GitHub Portfolio", "");
        
        span.innerText = " -> " + title;
        
        video_page_navigation.appendChild(span);
    }
    
    /*Displaying catalogue links*/
    displayCatalogueLinks();
});
let active_Index = 0;

function displayCatalogueLinks()
{
    const sidebar = document.getElementById("sidebar");
    
    if (sidebar != null)
    {
        const content_list = document.createElement("ul");
        content_list.id = "content_list";
        
        let currentApp = window.location.href.split("/");
        
        /*Get the second last element*/
        currentApp = currentApp[currentApp.length-1];
        currentApp = currentApp.replaceAll("%20", " ");
                
        let appFound = null;
        for(let index = 0; index < pageObject.project_catalogue_dropdown.length; index++)
        {
            
            const li = document.createElement("li");
                
                const buttonDiv = document.createElement("div");
                buttonDiv.className = "catalogue_buttons_container";
                    const buttonElem = document.createElement("button");
                    buttonElem.className = "project_catalogue";
                    

                    let domain = window.location.href.split("dragos-vacariu.github.io");
                    let href = domain[0] + "dragos-vacariu.github.io/";
                    
                    buttonElem.onclick = function ()
                    {
                        
                        window.location.href = href + "catalogue.html#" + 
                                                pageObject.project_catalogue_dropdown[index].name;
                    };
                    buttonElem.innerText = pageObject.project_catalogue_dropdown[index].name;
                    buttonElem.title = "Click to see " + pageObject.project_catalogue_dropdown[index].name;
                
                buttonDiv.appendChild(buttonElem);
                
                if(appFound == null)
                {
                    //Extracting all value elements into an array
                    const valuesArray = pageObject.project_catalogue_dropdown[index].catalogue.map(item => item.value);
                    for (let index = 0; index < valuesArray.length; index++)
                    {
                        const parts = valuesArray[index].split("/");
                        const lastPart = parts[parts.length - 1];
                        //console.log(lastPart + " == " + currentApp)
                        if(lastPart == currentApp)
                        {
                            appFound = valuesArray[index];
                            break;
                                                
                        }
                    }
                    if (appFound != null)
                    {
                        const app_button_div = document.createElement("div");
                        app_button_div.className = "app_nav_buttons_div";

                        for(element of pageObject.project_catalogue_dropdown[index].catalogue)
                        {
                            
                            const app_nav_button = document.createElement("button");
                            app_nav_button.className = "project_catalogue_app_button";
                            
                            var href_parts = window.location.href.split("/catalogue/");
                            const link = href_parts[0] + "/catalogue/" + element.value;
                            
                            app_nav_button.onclick = function ()
                            {
                                
                                window.location.href = link;
                            };
                            app_nav_button.innerText = element.name;
                            app_nav_button.title = "Click to see " + element.name;
                            
                            
                            if(element.value == appFound)
                            {
                                app_nav_button.classList.add("selected");
                            }
                            
                            app_button_div.appendChild(app_nav_button);
                        }
                        buttonDiv.appendChild(app_button_div);
                        buttonDiv.classList.add("highlighted");
                    }
                }
            li.appendChild(buttonDiv);
            content_list.appendChild(li);
        }
        sidebar.appendChild(content_list);
            
    }
}
