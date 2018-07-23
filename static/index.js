var channelsRendered = [];
var allMessages = [];

if (!localStorage.getItem('name'))
    localStorage.setItem('name', 'guest');

if (!localStorage.getItem('localChannel'))
    localStorage.setItem('localChannel', 'General');

if (!localStorage.getItem('channelsRendered'))
    channelsRendered = ['Select a Channel'];
    localStorage.setItem('channelsRendered', JSON.stringify(channelsRendered));

if (!localStorage.getItem('allMessages'))
    allMessages.push("Select a Channel", "placeholder");
    localStorage.setItem('allMessages', JSON.stringify(allMessages));

document.addEventListener('DOMContentLoaded', () => {

    channelsRendered = JSON.parse(localStorage.getItem('channelsRendered'));
    //localStorage.setItem("channelsRendered", JSON.stringify(channelsRendered));

    //---working----------------------------------------------
    //document.getElementById('greeting').style.color = "red";
    //document.querySelector('#greeting').style.color = "red";

    //code to cycle through existing list of messages
    /*
        fruits = ["Banana", "Orange", "Apple", "Mango"];
        fLen = fruits.length;
        text = "<ul>";
        for (i = 0; i < fLen; i++) {
            text += "<li>" + fruits[i] + "</li>";
        }
    */

    renderChannel(trimStr(localStorage.getItem('localChannel')));

    var localChannelName = trimStr(localStorage.getItem('localChannel'));

    var name = localStorage.getItem("name");

    var channelRaw = '';

    removeEL("nameDiv");

    if(name === "guest"){
        displayEL("nameDiv");
    }



    document.querySelector('#greeting').innerHTML = `Hello, ${name}!`;

    document.querySelector('#nameInput').onsubmit = () => {

        const request = new XMLHttpRequest();

        const name = document.querySelector('#name').value;

        if(!name){
            alert("Please enter a name");
            return;
        }

        localStorage.setItem("name", name);

        request.open('POST', '/hello');

        request.onload = () => {

            const greeting = `Hello, ${name}!`;

            document.querySelector('#greeting').innerHTML = greeting;

            removeEL("nameDiv");
        };

        const data = new FormData();

        data.append('greeting', greeting);

        request.send(data);

        return false;
    };

    document.querySelector('#newChannel').onsubmit = function() {

        const request = new XMLHttpRequest();

        channelRaw = document.querySelector('#channelName').value;

        if(!channelRaw){
            alert("Please enter a valid channel name");
            return;
        }

        const channel = trimStr(channelRaw);

        request.open('POST', '/newChannel');

        request.onload = () => {

            const option = document.createElement("option");

            option.innerHTML = channelRaw;

            option.value = channel;

            document.querySelector('#channels').add(option);

            document.querySelector('#channelName').value = "";
        };

        const data = new FormData();

        data.append('channel', channel);

        request.send(data);

        return false;

    };

 document.querySelector('#channels').onchange = function() {

        const request = new XMLHttpRequest();

        channelRaw = this.value;

        if(channelRaw === "Select a Channel"){
            alert("please select a channel");
            return;
        }

        if(channelRaw === null){
            alert("error");
            return;
        }

        const channel = trimStr(channelRaw);

        localChannelName = channel;

        request.open('POST', `/${channel}`);

        request.onload = () => {

            if(localStorage.getItem('localChannel') !== channel){
                document.querySelector('#messageColumn').innerHTML = '';
                renderChannel(channel);
            }

            renderMessages(channel);

            alert(channel);

            localStorage.setItem('localChannel', channel);
        };

        const data = new FormData();

        data.append('channel', channel);

        request.send(data);

        return false;

    };

    function trimStr(str){
        return str.replace(/\s/g,'');
    }

    function removeEL(element_id){
        document.querySelector(`#${element_id}`).style.display = "none";
    }

    function displayEL(element_id){
        document.querySelector(`#${element_id}`).style.display = "block";
    }

    function renderChannel(channelIn){

        const channel = channelIn;

        if(!channel){
            alert("Error: null channel name");
            return;
        }

        if(channel === "Select a Channel"){
            alert("please select a channel");
            return;
        }

        var i;
        if(channelsRendered){
            for(i = 0; i < channelsRendered.length; i++){
                if (channelsRendered[i] === channel){
                    return;
                }
            }
        }

        const h1 = document.createElement('h1');
        h1.innerHTML = `${channel} Channel`;

        var channelName = trimStr(channel);

        if(!(`${channel}` in allMessages)){
            allMessages.push(`${channel}`,`You can send messages to ${channel} now!`);
        }

        localStorage.setItem("allMessages", JSON.stringify(allMessages));

        h1.id = `${channelName}Title`;

        const div = document.createElement('div');
        div.id = `${channelName}`;

        const ul = document.createElement('ul');
        ul.id = `${channelName}List`;


        for(i = 0; i < allMessages.length; i++){
            if( allMessages[i]=== channelName){
                alert(`printing out ${allMessages[i+1]} in list should be workin`);
                const li = document.createElement('li');
                li.innerHTML = allMessages[i+1];
                ul.append(li);
            }
        }

        const input = document.createElement('input');
        input.id = `${channelName}Input`;
        input.setAttribute("type", "text");
        input.setAttribute("placeholder", "Type Your Message");

        const button = document.createElement('button');
        button.id = `${channelName}Submit`;
        button.innerHTML = "Send";

        div.appendChild(h1);
        div.appendChild(ul);
        div.appendChild(input);
        div.appendChild(button);

        document.querySelector('#messageColumn').appendChild(div);
        alert(`this is whats being put in array channelsRendered : ${channelName}`);
        channelsRendered.push(channelName);
        localStorage.setItem("channelsRendered", JSON.stringify(channelsRendered));
    }

    function renderMessages(channelName){
        for(i = 0; i < allMessages.length; i++){
            if( allMessages[i]=== channelName){
                alert(`printing out ${allMessages[i+1]} in list should be workin`);
                const li = document.createElement('li');
                li.innerHTML = allMessages[i+1];
                document.getElementById(`${channelName}List`).append(li);
            }
        }

    }

    var socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port);

    socket.on('connect', () => {

        document.querySelector(`#${localChannelName}Submit`).onclick = () => {

            const message = document.querySelector(`#${localChannelName}Input`).value;

            if(!message){

                alert("Please enter a message");

                return;
            }

            allMessages.push(`${localChannelName}`,`${name} says: ${message}`);

            localStorage.setItem("allMessages", JSON.stringify(allMessages));

            socket.emit('submit message', message);
        };
    });

    socket.on('display messages', message => {

        const li = document.createElement('li');

        li.innerHTML = message;

        document.querySelector(`#${localChannelName}List`).append(li);

        document.querySelector(`#${localChannelName}Input`).value = '';

    });
});