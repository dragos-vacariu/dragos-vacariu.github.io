function EncodeButtonPressed()
{
	document.getElementById("message_log").innerHTML = "";
	if(document.getElementById("text_box").value == "")
	{
		document.getElementById("message_log").innerHTML = "Text box is empty.";
	}
	var Text_To_Convert = document.getElementById("text_box").value;
	if(Text_To_Convert[Text_To_Convert.length-1] =="c" && Text_To_Convert[Text_To_Convert.length-2] =="n"
					&& Text_To_Convert[Text_To_Convert.length-3] =="e")
	{
		document.getElementById("message_log").innerHTML = "This message is already encoded.";
		document.getElementById("message_log").style.borderColor = "red";
	}
	else if(Text_To_Convert == "")
	{
		document.getElementById("message_log").innerHTML = "Text box is empty.";
		document.getElementById("message_log").style.borderColor = "red";
	}
	else
	{
		var list_items = []; //making an empty array
		for(var i=0; i < Text_To_Convert.length; i++)
		{
			if(Text_To_Convert[i]==" ")
			{
				list_items.push(i + "_");
			}
			else if( (Text_To_Convert[i]>=0 && Text_To_Convert[i]<10) || Text_To_Convert[i] == "_")
			{
				list_items.push(i + "<<" + Text_To_Convert[i] + ">>");
			}
			else
			{
				list_items.push(i + Text_To_Convert[i]);
			}
		}
		//Let it randomize;
		var result="";
		while (list_items.length)
		{
			var choice = Math.floor((Math.random() * list_items.length)); //Return a random number between 0 and size of array:
			result += list_items[choice];
			var aux = list_items;
			list_items=[]; //initializing the array with first null element;
			for(var j=0; j<aux.length; j++)
			{
				if(j!=choice)
				{
					list_items.push(aux[j]);
				}
			}
		}
		result += "enc";
		document.getElementById("text_box").value = "Initial Message: " + Text_To_Convert;
		document.getElementById("text_box").value += "\n" + "\n" + "Encoded Message: " + result;
		document.getElementById("message_log").innerHTML = "Message has been successfully encoded.";
		document.getElementById("message_log").style.borderColor = "black";
	}
}

function NumberOfCharsEncode()
{
	document.getElementById("message_log").innerHTML = "Number of Characters: " + document.getElementById("text_to_encode").value.length;
}

function DecodeButtonPressed()
{
	document.getElementById("message_log").innerHTML = "";
	if(document.getElementById("text_box").value == "")
	{
		document.getElementById("message_log").innerHTML = "Text box is empty.";
		document.getElementById("message_log").style.borderColor = "red";
	}
	var Text_To_Decode = document.getElementById("text_box").value;
	if(Text_To_Decode[Text_To_Decode.length-1] =="c" && Text_To_Decode[Text_To_Decode.length-2] =="n"
					&& Text_To_Decode[Text_To_Decode.length-3] =="e")
	{
		/*Decoding starts here*/
		var list_items = []; //making an empty array
		var list_index = [];
		var index = 0;
		for(var i=0; i < Text_To_Decode.length-3; i++) //going to the Text_To_Decode.length-3 to avoid 'e' 'n' 'c'
		{
			if(Text_To_Decode[i]>=0 && Text_To_Decode[i]<10)
			{
				index += parseInt(Text_To_Decode[i]);
				index *= 10;
			}
			else if( (i+2 < Text_To_Decode.length) && Text_To_Decode[i] == "<" && Text_To_Decode[i+1] == "<" && Text_To_Decode[i+3] == ">" 
												&& Text_To_Decode[i+4] == ">" )
			{
				i+=2;
				index /= 10;
				
				list_index.push(index);
				list_items.push(Text_To_Decode[i]);
				index=0;
				i+=2;
			}
			else
			{
				index /= 10;
				list_index.push(index);
				if(Text_To_Decode[i] == "_")
				{
					list_items.push(" ");
				}
				else
				{
					list_items.push(Text_To_Decode[i]);
				}
				index=0;
			}
		}
		var msg = "";
		for(var i=0; i < list_items.length; i++)
		{
			var letter = list_index.indexOf(i);
			msg += list_items[letter];
		}
		document.getElementById("text_box").value = "Initial Message: " + Text_To_Decode;
		document.getElementById("text_box").value += "\n" + "\n" + "Decoded Message: " + msg;
		document.getElementById("message_log").innerHTML = "Message has been successfully decoded.";
		document.getElementById("message_log").style.borderColor = "black";
	}
	else
	{
		document.getElementById("message_log").innerHTML = "Message is not encoded.";
		document.getElementById("message_log").style.borderColor = "red";
	}
}

function NumberOfCharsDecode()
{
	document.getElementById("message_log").innerHTML = "Number of Characters: " + document.getElementById("text_box").value.length;
}