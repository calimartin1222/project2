if (!localStorage.getItem('name'))
    localStorage.setItem('name', 'guest');
if (!localStorage.getItem('localChannel'))
    localStorage.setItem('localChannel', 'General');

document.addEventListener('DOMContentLoaded', () => {

    var socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port);

    var name = localStorage.getItem('name');

    var globalChannelName = localStorage.getItem('localChannel');

    renderChannel(globalChannelName);

    document.getElementById("nameDiv").style.display = "none";

    if(name === "guest"){
        document.getElementById("nameDiv").style.display = "block";
    }

    document.querySelector('#greeting').innerHTML = `Hello, ${name}!`;

    document.querySelector('#nameInput').onsubmit = () => {

        const request = new XMLHttpRequest();

        const name = document.querySelector('#name').value;

        if(!name){
            alert("Please enter a name");
            return
        }

        localStorage.setItem("name", name);

        request.open('POST', '/hello');

        request.onload = () => {

            const greeting = `Hello, ${name}!`;

            document.querySelector('#greeting').innerHTML = greeting;
        };

        const data = new FormData();

        data.append('greeting', greeting);

        request.send(data);

        return false;
    };

    document.querySelector('#newChannel').onsubmit = function() {

        const request = new XMLHttpRequest();

        const channelName = document.querySelector('#channelName').value;

        if(!channelName){
            alert("Please enter a valid channel name");
            return
        }

        renderChannel(channelName);

        request.open('POST', '/newChannel');

        request.onload = () => {

            const option = document.createElement("option");

            option.innerHTML = channelName;

            document.querySelector('#channels').add(option);

            document.querySelector('#channelName').value = "";

        };

        const data = new FormData();

        data.append('channelName', channelName);

        request.send(data);

        return false;

    };

 document.querySelector('#channels').onchange = function() {

        const request = new XMLHttpRequest();

        const channel = this.value;

        if(channel === "Select a Channel"){
            alert("please select a channel");
            return;
        }

        document.getElementById(`#${channel}`).style.display = "none";

        localStorage.setItem('localChannel', channel);

        globalChannelName = channel;

        request.open('POST', `/${channel}`);

        request.onload = () => {

            document.getElementById(`#${channel}`).style.display = "block";

        };

        const data = new FormData();

        data.append('channel', channel);

        request.send(data);

        return false;

    };

    function renderChannel(channel){

        const channelName = channel;

        if(!channelName){
            alert("invalid put in renderChannel funct");
            return;
        }

        const div = document.createElement('div');
        div.id = `#${channelName}`;

        const h1 = document.createElement('h1');
        h1.id = `#${channelName}Title`;
        h1.innerHTML = `${channelName} Channel`;

        const ul = document.createElement('ul');
        ul.id = `#${channelName}List`;

        const input = document.createElement('input');
        input.id = `#${channelName}Input`;
        input.setAttribute("type", "text");
        input.setAttribute("placeholder", "Type Your Message");

        const button = document.createElement('button');
        button.id = `#${channelName}Submit`;
        button.innerHTML = "Send";

        div.appendChild(h1);
        div.appendChild(ul);
        div.appendChild(input);
        div.appendChild(button);

        document.querySelector('#messageColumn').appendChild(div);

        document.getElementById(`#${channelName}`).style.display = "none";
    }

    socket.on('connect', () => {
        document.querySelector(`#${globalChannelName}Submit`).onclick = () => {

            const message = document.querySelector(`#${globalChannelName}Input`).value;

            if(!message){
                alert("Please enter a message");
                return;
            }

            socket.emit('submit message', message);
        };
    });

    socket.on('display messages', message => {

        const li = document.createElement('li');

        li.innerHTML = message;

        document.getElementById(`#${globalChannelName}List`).add(li);

        document.querySelector(`#${globalChannelName}Input`).value = "";

    });
});