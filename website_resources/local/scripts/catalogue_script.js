let active_Index = 0;

document.addEventListener('DOMContentLoaded', () => {
    
    /*Displaying catalogue links*/
    displayCatalogueLinks();
    
    processRouteCookie();
    
    /*Show catalogue content*/
    showContent();
    
    /*Adding video hovering handler - only if video is available*/
    videoHoveringHandler();
});

function displayCatalogueLinks()
{
    const sidebar = document.getElementById("sidebar");
    
    if (sidebar != null)
    {
        const content_list = document.createElement("ul");
        content_list.id = "content_list";
        
        for(let index = 0; index < pageObject.project_catalogue_dropdown.length; index++)
        {
            const li = document.createElement("li");
                const buttonElem = document.createElement("button");
                buttonElem.className = "project_catalogue";
                
                buttonElem.onclick = function () {
                    active_Index = index;
                    
                    /*Setting the cookie*/
                    document.cookie = String(index);
                    
                    /*Show catalogue content*/
                    showContent();
                    
                    /*Adding video hovering handler - only if video is available*/
                    videoHoveringHandler();
                };
                buttonElem.innerText = pageObject.project_catalogue_dropdown[index].name
                buttonElem.title = "Click to see " + pageObject.project_catalogue_dropdown[index].name;
            li.appendChild(buttonElem);
            
            content_list.appendChild(li);
        }
        sidebar.appendChild(content_list);
            
    }
}

function processRouteCookie()
{
    var routeProvided = window.location.href.split("/catalogue.html#")[1];
    
    //Replacing '%20' with ' '
    if(routeProvided)
    {
        const route = routeProvided.replaceAll("%20", " ");
        var routeProcessingFailed = false;
        
        /*if route provided - load the route*/
        if (route)
        {
            const links = document.getElementById("content_list");
            const button_elements = links.querySelectorAll(".project_catalogue");

            if(button_elements.length > 0)
            {
              // Convert NodeList to Array
                const buttonArray = Array.from(button_elements);

                const match = buttonArray.findIndex(element => element.innerText == route);
                
                if(match >= 0)
                {
                    active_Index = match;
                }
                else
                {
                    routeProcessingFailed = true;
                }
            }
            else
            {
                routeProcessingFailed = true;
            }
        }
        
        /*if route is incorrect - attempt to load the cookie*/
        else if(route && routeProcessingFailed)
        {
            if(document.cookie != "")
            {
                active_Index = parseInt(document.cookie);
            }
        }
        /*Loading the cookie if available.*/
        else  if(document.cookie != "")
        {
            active_Index = parseInt(document.cookie);
        }
    }
    else  if(document.cookie != "")
    {
        active_Index = parseInt(document.cookie);
    }
}

function videoHoveringHandler()
{
  document.querySelectorAll('.project_div').forEach(div => {
        const video = div.querySelector('.preview_video');
        const thumbnail = div.querySelector('.preview_img');
        if(video)
        {
            div.addEventListener('mouseenter', () => {
                    video.style.opacity = 1;
                    thumbnail.style.opacity = 0;
                    video.play().catch(err => console.log('Video play error:', err));
            });
            
            div.addEventListener('mouseleave', () => {
                video.pause();
                video.style.opacity = 0;
                thumbnail.style.opacity = 1;
            });
        }

    });
}

function showContent()
{
    const catalogue_content = document.getElementById("catalogue_content");
    const fading_paragraph = catalogue_content.querySelector(".paragraph");
    const catalogue_title = fading_paragraph.querySelector(".catalogue_title");
    catalogue_title.innerText = pageObject.project_catalogue_dropdown[active_Index].name + ":";
    
    const catalogue_description = fading_paragraph.querySelector(".catalogue_description");
    catalogue_description.innerText = pageObject.project_catalogue_dropdown[active_Index].description;
    
    const project_container = document.getElementById("projects_container");
    eraseChildrenInElement(project_container);
    
    const links = document.getElementById("content_list");
    
    if(links)
    {
        var active_element = links.querySelectorAll(".active");
        for(item of active_element)
        {
            item.classList.remove("active");
        }
        const active_button = links.children[active_Index].querySelector(".project_catalogue");
        active_button.classList.add("active");
    }
    
    for(let index = 0; 
            index < pageObject.project_catalogue_dropdown[active_Index].catalogue.length; index++)
    {
        const item = pageObject.project_catalogue_dropdown[active_Index].catalogue[index];
        const projectDiv = document.createElement("div");
        
        projectDiv.className = "project_div";
            
            const media_container = document.createElement("div");
            media_container.className = "media_container";
                
                const img = document.createElement("img");
                img.className = "preview_img";
                if(item.thumbnail)
                {
                    const imgSrc = "./catalogue/" + item.thumbnail;
                    
                    checkImageValid(imgSrc, (isValid) => {
                        if (isValid)
                        {
                            // You can assign src to your actual img element here
                            img.src = imgSrc;
                        }
                        else
                        {
                            console.log("Image: " + imgSrc + " is not accessible");
                            img.src = "./website_resources/local/images/laptop2.png";
                            // Handle invalid image case
                        }
                    });
                }
                else
                {
                    img.src = "/website_resources/local/images/laptop2.png";
                }
                img.alt = item.name + " Preview";
                
                media_container.appendChild(img);
                
                if(item.video)
                {
                    // Create the video element
                    const video = document.createElement("video");
                    video.className = "preview_video";
                    
                    //Setting video attributes
                    video.muted = true;
                    video.setAttribute('playsinline', '');
                    video.setAttribute('loop', '');
                    video.setAttribute('preload', 'metadata');
                    
                    // Create the source element
                    const source = document.createElement('source');
                    source.src = "./catalogue/" + item.video;
                    source.type = 'video/mp4';

                    // Append source to video
                    video.appendChild(source);
                    media_container.appendChild(video);
                }

            
            const project_info = document.createElement("div");
            project_info.className = "project_info";
                const project_title = document.createElement("div");
                project_title.className = "project_title";
                project_title.innerText = item.name;
            project_info.appendChild(project_title);
        
        if(item.description)
        {
            const tooltip = document.createElement("div");
            tooltip.className = "tooltip";
            tooltip.innerText = item.description;
            projectDiv.appendChild(tooltip);
        }
        projectDiv.onclick = function(){
            window.location.href = "./catalogue/"  + item.value;
        
        }
        
        projectDiv.appendChild(media_container);
        projectDiv.appendChild(project_info);
        
        project_container.appendChild(projectDiv);
    }
}

function checkImageValid(src, callback)
{
    const testImage = new Image();

    testImage.onload = () => {
        // Image loaded successfully
        callback(true);
    };

    testImage.onerror = () => {
        // Error loading image
        callback(false);
    };

    testImage.src = src;
}

function eraseChildrenInElement(element)
{    
    while (element.firstChild)
    {
        element.removeChild(element.firstChild);
    }
}
