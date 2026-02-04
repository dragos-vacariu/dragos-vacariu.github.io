function RandomizeItems()
{
	var msg = document.getElementById("text_box").value;
	document.getElementById("message_log").innerHTML = "";
	if(msg.length>0){
		var lst_of_msg = [];
		var aux = "";
		for (var i =0; i<msg.length; i++)
		{
			if(msg[i] == "\n")
			{
				lst_of_msg.push(aux);
				aux="";
			}
			else if(i==msg.length-1)
			{
				aux+=msg[i];
				lst_of_msg.push(aux);
				aux="";
			}
			else 
			{
				aux+=msg[i];
			}
		}
		msg="";
		lst_length = lst_of_msg.length;
		while(lst_length)
		{
			aux = Math.floor(Math.random()*lst_length);
			msg += lst_of_msg[aux] + "\n";
			if(aux==lst_length-1) //making sure the element which was added to msg will not be added again.
			{
				lst_length--;
			}
			else
			{
				lst_of_msg[aux] = lst_of_msg[lst_length-1];
				lst_length--;
			}
		}
		document.getElementById("text_box").value = msg;
		document.getElementById("message_log").innerHTML = "Items successfully randomized." +"\n" 
		+ "No of items: " + lst_of_msg.length;
	}
	else
	{
		document.getElementById("message_log").innerHTML = "No list was entered.";
	}
}