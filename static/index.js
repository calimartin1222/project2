if (!localStorage.getItem('name'))
                localStorage.setItem('name', 'guest');
document.addEventListener('DOMContentLoaded', () => {
    var socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port);
    document.getElementById("submit").disabled = true;
    var name = localStorage.getItem('name');
    if(name === "guest"){
        document.getElementById("submit").disabled = false;
    }
    const greeting = `Hello, ${name}!`;
    document.querySelector('#greeting').innerHTML = greeting;
    document.querySelector('#nameInput').onsubmit = () => {
        const request = new XMLHttpRequest();
        const name = document.querySelector('#name').value;
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
    document.querySelector('#newChannel').onsubmit = () => {
        const request = new XMLHttpRequest();
        const channelName = document.querySelector('#channelName').value;
        request.open('POST', '/newChannel');
        request.onload = () => {
            const li = document.createElement('li');
            li.innerHTML = channelName;
            document.querySelector('#channels').append(li);
        };
        const data = new FormData();
        data.append('channelName', channelName);
        request.send(data);
        return false;
    };

    socket.on('connect', () => {

        // Each button should emit a "submit vote" event
        document.querySelectorAll('button').forEach(button => {
            button.onclick = () => {
                const selection = document.querySelector('#chatInput').value;
                socket.emit('submit vote', {'selection': selection});
            };
        });
    });

    // When a new vote is announced, increase the count
    socket.on('vote totals', data => {
        document.querySelector('#yes').innerHTML = data.yes;
        document.querySelector('#no').innerHTML = data.no;
        document.querySelector('#maybe').innerHTML = data.maybe;
    });

});
