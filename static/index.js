// initialize global lists used later on for storage purposes
var list = ['Select a Channel'];
var list2 = ["Select a Channel", "placeholder"];

//check all the local storage variables - if they are null, set them to a default so they
//aren't empty and don't trhow an error later
if (!localStorage.getItem('name'))
    localStorage.setItem('name', 'guest');

if (!localStorage.getItem('localChannel'))
    localStorage.setItem('localChannel', 'General');

if (!localStorage.getItem('channelsRendered'))
    localStorage.setItem('channelsRendered', JSON.stringify(list));

if (!localStorage.getItem('allMessages'))
    localStorage.setItem('allMessages', JSON.stringify(list2));

//when the page loads
document.addEventListener('DOMContentLoaded', () => {

    //initializes and sets the current channel as a global variable that can be used later
    var localChannelName = trimStr(localStorage.getItem('localChannel'));

    //resets div column when page loads
    document.querySelector('#messageColumn').innerHTML = '';

    //renders selected channel
    renderChannel(localChannelName);

    //sets the global list "channelsRendered" to either channels that
    //have already been renderedthe default if the local storage variable was null
    channelsRendered = JSON.parse(localStorage.getItem('channelsRendered'));

    //renders the current channel, either the default "General" or what the user was last on
    renderChannel(trimStr(localStorage.getItem('localChannel')));



    //initializes and sets the current user name as a global variable that can be used later
    // whether it be the default "guest" or what the user entered as their display name earlier
    var name = localStorage.getItem("name");

    //initializes an empty global variable that is used for the user's new channel input
    //ie when they enter a channel name with a space (or multiple spaces) it saves that and uses
    //that for the channel title, but it is stored and used in the program without the spaces to avoid errors
    var channelRaw = '';

    //makes the nameDiv (description, input and button for new display name)"invisible" by default
    removeEL("nameDiv");

    //if the name is guest, which means the user hasn't entered a display name yet,
    //it makes the nameDiv visible, allowing the user to enter their display name
    if(name === "guest"){
        displayEL("nameDiv");
    }

    //just a header that greets the user, says "Hello, guest!" which prompts
    //the user to enter their name if they don't already have one
    document.querySelector('#greeting').innerHTML = `Hello, ${name}!`;


    //when the form with the id nameInput is submitted
    document.querySelector('#nameInput').onsubmit = () => {

        const request = new XMLHttpRequest();

        //gets the user input
        const name = document.querySelector('#name').value;

        //error checking if they didn't type something
        if(!name){
            alert("Please enter a name");
            return;
        }

        //changes local storage variable to the user input instead of 'guest'
        localStorage.setItem("name", name);

        request.open('POST', '/hello');

        request.onload = () => {

            //sets the variable to what the new header should say
            const greeting = `Hello, ${name}!`;

            //sets the inner HTML of the heading to the new greeting
            document.querySelector('#greeting').innerHTML = greeting;

            //removes the form now that the user wont need to use it
            removeEL("nameDiv");
        };

        //makes and sends a form 'POST' request with the greeting so
        //it can change, but doesn't refresh the page
        const data = new FormData();

        data.append('greeting', greeting);

        request.send(data);

        return false;
    };

    //when the form with the id newChannel is submitted
    document.querySelector('#newChannel').onsubmit = function() {

        const request = new XMLHttpRequest();

        //channelRaw is set to the raw input the user provides
        channelRaw = document.querySelector('#channelName').value;

        //if what the user submitted is empty, throw this error
        if(!channelRaw){
            alert("Please enter a valid channel name");
            return;
        }

        //sets a constant variable channel that is "trimmed" (spaces are taken out)
        //this is so the channel name can be used programmatically later on
        const channel = trimStr(channelRaw);

        request.open('POST', '/newChannel');

        request.onload = () => {

            //makes a new "option" element and has it say what the user input was
            const option = document.createElement("option");

            //sets the text of the option to what the user submitted
            option.innerHTML = channelRaw;

            //sets the value of the option to the trimmed channel name
            option.value = channel;

            //adds the option to the already existing select list element with id channels
            document.querySelector('#channels').add(option);

            //makes the text field empty after, just an aesthetics choice
            document.querySelector('#channelName').value = "";
        };

        //makes and sends a form 'POST' request with the channel so
        //it can be added to the dropdown, but doesn't refresh the page
        const data = new FormData();

        data.append('channel', channel);

        request.send(data);

        return false;

    };

    //when the dropdown menu with id 'channels' is changed by the user
     document.querySelector('#channels').onchange = function() {

        const request = new XMLHttpRequest();

        //stores the user's selection value
        channelSelect = this.value;

        //catches if the user selects the first null selection that
        //just tells the user what the dropdown is
        if(channelSelect === "Select a Channel"){
            alert("please select a channel");
            return;
        }

        //again just error catching just in case the selection is null
        if(channelSelect === null){
            alert("error");
            return;
        }

        //trims the user's selection just in case
        const channel = trimStr(channelSelect);

        //sets global variable localChannelName to the trimmed selection
        localChannelName = channel;
        localStorage.setItem('localChannel', channel);

        //opens a request for the url that is whatever the channel the user selected is
        request.open('POST', `/${channel}`);

        request.onload = () => {

            //gets rid of anything already inside the div (ie the user was just at another channel)
            //just resets the area
            document.querySelector('#messageColumn').innerHTML = '';

            //renders selected channel
            renderChannel(channel);

            //sets the local storage variable localChannel to the channel the user selected

        };

        //makes and sends a form 'POST' request with the channel so
        //it can be added to the messages column, but doesn't refresh the page

        const data = new FormData();

        data.append('channel', channel);

        request.send(data);

        return false;

    };

    //just a function that takes away the spaces in the given string
    function trimStr(str){
        return str.replace(/\s/g,'');
    }

    //takes the given element id and makes the element "invisible"
    function removeEL(element_id){
        document.querySelector(`#${element_id}`).style.display = "none";
    }

    //takes the given element id and makes the element "visible"
    function displayEL(element_id){
        document.querySelector(`#${element_id}`).style.display = "block";
    }

    //defines the renderChannel function called when the
    //user selects a channel from the drop down
    function renderChannel(channelIn){

        allMessages = JSON.parse(localStorage.getItem('allMessages'));

        channelsRendered = JSON.parse(localStorage.getItem('channelsRendered'));

        //sets a constant variable equal to the parameter passed
        const channel = trimStr(channelIn);

        //error catching
        if(!channel){
            alert("Error: null channel name");
            return;
        }

        //if somehow the user manages to select the first option in the dropdown
        if(channel === trimStr("Select a Channel")){
            alert("please select a channel");
            return;
        }

        //sets up a for loop to check if the channel has already
        //been rendered, checking the channelsRendered list
        var i;
        for(i = 0; i < channelsRendered.length; i++){
            if (trimStr(channelsRendered[i]) === channel){
                return 'already rendered';
            }
        }

        //creates h1 element and has it say the channel's name as title and sets its id
        const h1 = document.createElement('h1');
        h1.innerHTML = `${channel} Channel`;
        h1.id = `${channel}Title`;

        //creates div element and sets its id
        const div = document.createElement('div');
        div.id = `${channel}`;

        //creates ul element sets its id
        const ul = document.createElement('ul');
        ul.id = `${channel}List`;

        //checks if there are any messages in the channel already
        //if there isnt, add a default message to the users to initialize the chat
        if(!(allMessages.includes(channel))){
            allMessages.push(`${channel}`,`You can send messages to ${channel} now!`);
            localStorage.setItem("allMessages", JSON.stringify(allMessages));
        }

        //creates text input element sets its id and other properties
        const input = document.createElement('input');
        input.id = `${channel}Input`;
        input.setAttribute("type", "text");
        input.setAttribute("placeholder", "Type Your Message");

        //creates button element sets its id and other properties
        const button = document.createElement('button');
        button.id = `${channel}Submit`;
        button.innerHTML = "Send";

        //adds all the elements created to be part of the div
        div.appendChild(h1);
        div.appendChild(ul);
        div.appendChild(input);
        div.appendChild(button);

        //adds the div to the messageColumn div
        document.querySelector('#messageColumn').appendChild(div);

        renderMessages(channelName);

        //adds rendered channel to the channelsRendered list and updates local storage
        channelsRendered.push(channel);
        localStorage.setItem("channelsRendered", JSON.stringify(channelsRendered));
    }

    //defines the renderMessages function
    function renderMessages(channelName){

        allMessages = JSON.parse(localStorage.getItem('allMessages'));

        //for loop that cycles through each element of allMessages and if
        //the element is equal to the current channel, it puts the next element
        //into a list item element and adds it to the specific channel's list
        for(i = 0; i < allMessages.length; i++){
            if( allMessages[i] === channelName){
                alert(`printing out ${allMessages[i+1]} in list should be workin`);
                const li = document.createElement('li');
                li.innerHTML = allMessages[i+1];
                document.getElementById(`${channelName}List`).append(li);
            }
        }
    }

    var socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port);

    socket.on('connect', () => {
        //when the button that has the local channel name id is clicked on
        document.getElementById(`${localChannelName}Submit`).onclick = () => {

            //makes a variable called message equal to the text field's value
            const message = document.querySelector(`#${localChannelName}Input`).value;

            //error checking if field is empty
            if(!message){

                alert("Please enter a message");

                return;
            }

            //variables and set up for getting current time
            var d = new Date();
            var hour = d.getHours();
            var mins = d.getMinutes();

            if(hour<10){
                hour = "0"+hour;
            }
            if(hour>12){
                hour = hour - 12;
            }
            if(mins<10){
                mins = "0"+mins;
            }

            //gets local storage user name
            name = localStorage.getItem('name');

            //plugs the message, time and user name into one string to 'send'
            messageSend = `${hour}:${mins} ${name} says: ${message}`;

            //adds message to list and local variable
            allMessages.push(localChannelName, messageSend);

            localStorage.setItem("allMessages", JSON.stringify(allMessages));

            //goes to python @socketio.on("submit message")
            socket.emit('submit message', messageSend);
        };
    });

    socket.on('display messages', message => {

        //creates list item element and adds to channel specific message list

        const li = document.createElement('li');

        li.innerHTML = message;

        document.querySelector(`#${localChannelName}List`).append(li);

        document.querySelector(`#${localChannelName}Input`).value = '';

    });
});