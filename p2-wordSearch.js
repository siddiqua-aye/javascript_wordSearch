"use strict";

/*
   
   Word Search Game Script
   
   Global Variables
   
   allCells
      References all of the cells in the word search table
      
   found
      Stores a Boolean value indicating whether the currently
      selected letters represents a word in the word search list.
     
   Function List
   
   function drawWordSearch(letters, words)
      Returns the HTML code for a word search table based on the entries
      in the letters array and the location of the words
      in the words array
      
   showList(list)
      Returns the HTML for code for an unordered list of words based
      on the items in the list array

*/

var allCells;
var found = false;

window.onload = init;

function init() {
   document.querySelectorAll("aside h1")[0].innerHTML = wordSearchTitle;
   document.getElementById("wordTable").innerHTML = drawWordSearch(letterGrid, wordGrid);
   document.getElementById("wordList").innerHTML = showList(wordArray);

   allCells = document.querySelectorAll("table#wordSearchTable td");
   
   //Add event listener for click for Show Solution button
   let showSolutionButton = document.getElementById("showSolution");
   showSolutionButton.addEventListener("click", showCompletedWordSearch); 
   
   //Add event listener for all cells for mousedown event
	for (var i = 0; i < allCells.length; i++) {
	   allCells[i].style.cursor = "pointer";
	   allCells[i].addEventListener("mousedown", changePink); 
	}   

} // end init function

function changePink(e) {
	
	//Make 1 cell pink IF it is not already green
	if( e.target.style.backgroundColor != "rgb(101, 191, 101)" ) {
		e.target.style.backgroundColor = "pink";
	}

	//Add target's text to input box
	addToInputBox(e.target.innerHTML);
	
	//ADD event listener for MOUSEOVER for all cells - more than 1 word
	//ADD event listener for MOUSEUP for all cells - 1 word
	for (var i = 0; i < allCells.length; i++) {
		allCells[i].addEventListener("mouseover", hoverPink);
		//**added to account for 1 letter mousedown & mouseup
		allCells[i].addEventListener("mouseup", stopHoverPink);		
	}
} // end changePink

function hoverPink(e) {
	
	//make hovered cell pink
	//Make 1 cell pink IF it is not already green
	if( e.target.style.backgroundColor != "rgb(101, 191, 101)" ) {
		e.target.style.backgroundColor = "pink";
	}
	
	//Add target's text to input box
	addToInputBox(e.target.innerHTML);
	
	//ADD event listener for MOUSEUP for all cells - to stop color
	for (var i = 0; i < allCells.length; i++) {
		allCells[i].addEventListener("mouseup", stopHoverPink);	
	}
	
} // end hoverPink

function stopHoverPink(e) {
	
	//REMOVE event listener for MOUSEOVER for all cells -- to stop color
	for (var i = 0; i < allCells.length; i++) {
		allCells[i].removeEventListener("mouseover", hoverPink);	
	}
	
	//check if input Box text match any of words in word list
	var inputBox = document.getElementById("pickedLetters");
	
	//IF string in input box matches element in wordlist (not -1)
	if(wordArray.indexOf(inputBox.value) !== -1){
		
		var list = document.getElementById("wordSearchList");
		var indexOfList = wordArray.indexOf(inputBox.value);
		
		//strike out & gray out from word list
		list.childNodes[indexOfList].style.textDecoration = "line-through";
		list.childNodes[indexOfList].style.color = "gray";
		
		//If pink make green since correct
		for(let i = 0; i < allCells.length; i++) {
			
			if(allCells[i].style.backgroundColor == "pink") {
				allCells[i].style.setProperty("background-color", "rgb(101, 191, 101)", "important");
			}
		}
		
		//get the number of correct words so far
		var numberWon = countOfWordsCompleted();
		//alert(numberWon + "/" + wordArray.length);
		
		//if number is equal to all the words (25 in this case), then alert user with msg
		if(numberWon == wordArray.length) {
			alert("You guessed all " + wordArray.length + " words in this word search! Congratulations!")
		}
		
				
    } else{
	//ELSE string in input box NOT match element in wordlist (-1)
		
		//If pink make white since incorrect
		for(let i = 0; i < allCells.length; i++) {
			
			if(allCells[i].style.backgroundColor == "pink") {
				allCells[i].style.backgroundColor = "white";
			}
		}
		
    } // end else
	
	//clear input box before new mousedown
	clearInputBox();
	
} // end stopHoverPink

/// INPUT BOX FUNCTIONS:

//Add letter to input box via value
function addToInputBox(elementValue) {
	var inputBox = document.getElementById("pickedLetters");	
	inputBox.value = inputBox.value + elementValue;
}

//Clear input box contents by setting empty string
function clearInputBox() {
	var inputBox = document.getElementById("pickedLetters");	
	inputBox.value = "";
}

/*============================================================*/
function showCompletedWordSearch() {
	
	//Go through each of 25 array elements
	for(let i = 0; i < wordGrid.length; i++) {
		//For each 25 arrays, go through their 25 elements
		for(let j = 0; j < wordGrid[i].length; j++) {
			// If contents is a '#' then cell should be green
			if (wordGrid[i][j] == "#") {
				//wordGrid is not an array of (25)^2 or 625 elements
				//since 25 arrays each with 25 elements, we need to do below calculation
				allCells[(i*25)+j].style.backgroundColor = "#BE90D4";
			} //rgb(101, 191, 101) green color not used
		}
	}
} // end showCompletedWordSearch

/////

//Check if all words striked out to see if user won
function countOfWordsCompleted() {
	
	//our word list
	var list = document.getElementById("wordSearchList");
	//count of how many words user gotten correct
	var countFinished = 0;
	
	//go through all children of the ul & increment count if striked through
	for(var i = 0; i < list.childNodes.length; i++) {
		if (list.childNodes[i].style.textDecoration == "line-through") {
			countFinished = countFinished + 1;
		}
	}
	
	//return count guessed correctly
	return countFinished;
}


function drawWordSearch(letters, words) {
   var rowSize = letters.length;
   var colSize = letters[0].length;

   var htmlCode = "<table id='wordSearchTable'>";
   htmlCode += "<caption>Word Search</caption>";

   for (var i = 0; i < rowSize; i++) {
      htmlCode += "<tr>";

      for (var j = 0; j < colSize; j++) {
         if (words[i][j] == " ") {
            htmlCode += "<td>";
         } else {
            htmlCode += "<td class='wordCell'>";
         }
         htmlCode += letters[i][j];
         htmlCode += "</td>";
      }

      htmlCode += "</tr>";
   }
   htmlCode += "</table>";

   return htmlCode;
}

function showList(list) {
   var htmlCode = "<ul id='wordSearchList'>";

   for (var i = 0; i < list.length; i++) {
      htmlCode += "<li>" + list[i] + "</li>";
   }

   htmlCode += "</ul>";

   return htmlCode;
}


