/*Adding fading-out transition to the homepage first paragraph*/
window.addEventListener("scroll", function () 
{
    const paragraph = document.getElementById("catalogue_description");
    const scrollY = window.scrollY;
    
    // you can tweak this value
    if (scrollY > 5) 
    { 
      paragraph.classList.add("fade-out");
    }
    else 
    {
      paragraph.classList.remove("fade-out");
    }
});