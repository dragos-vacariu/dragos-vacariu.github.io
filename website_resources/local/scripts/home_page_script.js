/*Adding fading-out transition to the homepage first paragraph*/
window.addEventListener("scroll", function () 
{
    const paragraph = document.getElementById("intro_paragraph");
    const scrollY = window.scrollY;

    if (scrollY > 30) 
    {
      paragraph.classList.add("fade-out");
    }
    else 
    {
      paragraph.classList.remove("fade-out");
    }
});