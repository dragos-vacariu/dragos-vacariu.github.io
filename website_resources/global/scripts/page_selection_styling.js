//This will be executed only after the Angular finishes loading
document.addEventListener('DOMContentLoaded', () => {
    
    /*Add the styling for the page selection, based on the element in which the page is indexed*/
    /*This script is supposed to be included only within the pages listed in the navbar*/
    var menu_items = document.getElementsByClassName("menu_page_item");

    for(var index = 0; index < menu_items.length; index++)
    {
        /*
        if (document.location.href == menu_items[index].children[0].href)
        {
           menu_items[index].style = "background-color: #aa4400; border-style: solid; border-color: #442200; border-width: 2px; border-radius: 5vw";
           break;
        }
        */
        
        if (document.title.split(" - ")[0] == menu_items[index].children[0].text)
        {
           menu_items[index].style = "border-bottom:solid 2px black; font-weight: bold";
           break;
        }
    }
});