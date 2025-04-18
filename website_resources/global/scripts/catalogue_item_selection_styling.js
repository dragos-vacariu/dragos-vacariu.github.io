//This will be executed only after the Angular finishes loading
document.addEventListener('DOMContentLoaded', () => {
    
    /*Add the styling for the page selection, based on the element in which the page is indexed*/
    /*This script is supposed to be included only within the pages listed in the navbar*/
    var menu_items = document.getElementsByClassName("menu_page_item");

    for(var index = 0; index < menu_items.length; index++)
    {
        if ("Project Catalogue▼" == menu_items[index].children[0].innerText)
        {
           menu_items[index].style = "border-bottom:solid 2px black; font-weight: bold";
           break;
        }
    }
});