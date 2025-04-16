//This will be executed only after the Angular finishes loading
document.addEventListener('DOMContentLoaded', () => {
    
    /*Add the styling for the page selection, based on the element in which the page is indexed*/
    /*This script is supposed to be included only within the pages listed in the navbar*/
    var menu_items = document.getElementsByClassName("menu_page_item");

    for(var index = 0; index < menu_items.length; index++)
    {
        if ("Catalogue" == menu_items[index].children[0].innerText)
        {
           menu_items[index].style = "background-color: #aa4400; border-style: solid; border-color: #442200; border-width: 2px; border-radius: 5vw";
           break;
        }
    }
});