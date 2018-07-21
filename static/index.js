if (!localStorage.getItem('name'))

                localStorage.setItem('name', 'guest');

document.addEventListener('DOMContentLoaded', () => {
    var socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port);
    document.getElementById("submit").disabled = true;
    document.getElementById("messagesDiv").style.visibility = "hidden";

    var name = localStorage.getItem('name');

    if(name === "guest"){
        document.getElementById("submit").disabled = false;
    }

    const greeting = `Hello, ${name}!`;

    document.querySelector('#greeting').innerHTML = greeting;

    if (!localStorage.getItem('name'))
        localStorage.setItem('name', 'guest');

    document.querySelector('#nameInput').onsubmit = () => {

        const request = new XMLHttpRequest();

        const name = document.querySelector('#name').value;

        localStorage.setItem("name", name);

        request.open('POST', '/hello');

        request.onload = () => {

            const greeting = `Hello, ${name}!`;

            document.querySelector('#greeting').innerHTML = greeting;

            document.querySelector('#name').value = "";
        };
        name = localStorage.getItem('name');

        const data = new FormData();

        data.append('greeting', greeting);

        request.send(data);

        return false;
    };

    document.querySelector('#newChannel').onsubmit = function() {

        const request = new XMLHttpRequest();

        const channelName = document.querySelector('#channelName').value;


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

        const channel = this.value;

        if(channel === "Select a Channel"){
            alert("please select a channel");
            return
        }

        const request = new XMLHttpRequest();

        request.open('POST', `/${channel}`);

        const channelName = channel.charAt(0).toUpperCase() + channel.slice(1);

        request.onload = () => {
            document.querySelector('#channelTitle').innerHTML = `${channelName} Channel`;

            document.getElementById("messagesDiv").style.visibility = "visible";
        };

        const data = new FormData();

        data.append('channel', channel);

        request.send(data);

        return false;

    };
    socket.on('connect', () => {
        document.querySelector('#messageSubmit').onclick = () => {
            const message = document.querySelector('#messageInput').value;
            socket.emit('submit message', message);
        };
    });
    socket.on('display messages', message => {
        const li = document.createElement('li');
        li.innerHTML = `${name} says: ${message}`;
        document.querySelector('#messages').append(li);
    });
});