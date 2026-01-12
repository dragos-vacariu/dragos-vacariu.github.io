const API_URL = "https://dragos-vacariu-github-io-backend.vercel.app"

function startTime() 
{
    /*The difference between let and var is in the scope of the variables they create: 
    Variables declared by let are only available inside the block where they're defined. 
    Variables declared by var are available throughout the function in which they're declared.*/
    
    //Getting current system clock 
    //const today = new Date();
    //let hours = today.getHours();
    //let minutes = today.getMinutes();
    //let seconds = today.getSeconds();
    //minutes = checkTime(minutes);
    //seconds = checkTime(seconds);
    //document.getElementById('clock').innerHTML =  hours + ":" + minutes + ":" + seconds;

    //Getting clock of given time zone 
    let options = 
    {
        timeZone: 'Europe/Bucharest',
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
    };
    formatter = new Intl.DateTimeFormat([], options);
    document.getElementById('clock').innerHTML =  formatter.format(new Date()) + ", Romania";
    setTimeout(startTime, 1000);
    /*The setTimeout() method calls a function after a number of milliseconds.*/
}

function checkTime(i)
{
    if (i < 10) 
    {
      i = "0" + i; // add zero in front of numbers < 10
    }

    return i;
}

async function sendUserEmail(e)
{
    alert("Called");
    e.preventDefault(); // Prevent form from reloading the page

    // Collect form data
    const data = {
        method_name: "sendEmail",
        method_params: {
            user_email: form.email.value,
            user_topic: form.topic.value,
            user_message: form.message.value
        }
    };

    // Optional: show a "sending..." message
    log.textContent = "Sending...";
    log.style.color = "black";

    try
    {
        const response = await fetch(API_URL + "/api/api_manager", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        });

        const result = await response.json();

        // Display result message
        log.textContent = result.message;
        log.style.color = result.success ? "green" : "red";

        // Clear form if success
        if (result.success)
        {
            document.getElementById("contact_form").reset();
        }
    }
    catch (err)
    {
        console.error(err);
        log.textContent = "Error sending message. Please try again.";
        log.style.color = "red";
    }
}

startTime();

/*The submit event only fires on <form> elements, not on buttons.*/
document.getElementById("contact_form").addEventListener("submit", async (e) => sendUserEmail(e));