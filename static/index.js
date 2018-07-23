if (!localStorage.getItem('name'))
    localStorage.setItem('name', 'guest');
if (!localStorage.getItem('localChannel'))
    localStorage.setItem('localChannel', 'General');

document.addEventListener('DOMContentLoaded', () => {

    //---working----------------------------------------------
    //document.getElementById('greeting').style.color = "red";
    //document.querySelector('#greeting').style.color = "red";

    renderChannels("channels");

    var localChannelName = trimStr(localStorage.getItem('localChannel'));

    var name = localStorage.getItem("name");

    var channelRaw = '';

    removeEL("nameDiv");

    if(name === "guest"){
        displayEL("nameDiv");
    }

    var socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port);

    socket.on('connect', () => {

        document.querySelector(`#${localChannelName}Submit`).onclick = () => {

            const message = document.querySelector(`#${localChannelName}Input`).value;

            if(!message){

                alert("Please enter a message");

                return;
            }

            socket.emit('submit message', message);
        };
    });

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
            return
        }

        const channel = trimStr(channelRaw);

        request.open('POST', '/newChannel');

        request.onload = () => {

            renderChannel(channel);

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

        localStorage.setItem('localChannel', channel);

        localChannelName = channel;

        request.open('POST', `/${channel}`);

        request.onload = () => {

            displayEL(channel);

        };

        const data = new FormData();

        data.append('channel', channel);

        request.send(data);

        return false;

    };
    socket.on('display messages', message => {

        const li = document.createElement('li');

        li.innerHTML = message;

        document.querySelector(`#${localChannelName}List`).add(li);

        document.querySelector(`#${localChannelName}Input`).value = "";

    });

    function trimStr(str){
        return str.replace(/\s/g,'');
    }
    function removeEL(element_id){
        document.querySelector(`#${element_id}`).style.display = "none";
    }
    function displayEL(element_id){
        document.querySelector(`#${element_id}`).style.display = "block";
    }

    function renderChannels(channels){

        channelList = document.getElementById(`${channels}`);

        var i;

        for(i = 0; i < channelList.length; i++){

            if (channelList.options[i].value === "Select a Channel"){
                continue;
            }
            alert('foor loop got passed through');
            renderChannel(trimStr(channelList.options[i].value));
        }
    }
    function renderChannel(channel){
        if(!channel){
            alert("Error: null channel name");
            return;
        }
        alert(channel);
        const h1 = document.createElement('h1');
        h1.innerHTML = `${channel} Channel`;

        var channelName = trimStr(channel);

        h1.id = `${channelName}Title`;

        const div = document.createElement('div');
        div.id = `${channelName}`;

        const ul = document.createElement('ul');
        ul.id = `${channelName}List`;

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

        removeEL(channel);

        document.querySelector('#messageColumn').appendChild(div);
    }
});