if (!localStorage.getItem('name'))
                localStorage.setItem('name', 'guest');
document.addEventListener('DOMContentLoaded', () => {
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
        const newChannel = document.querySelector('#channelName').value;
        request.open('POST', '/newChannel');
        request.onload = () => {
            const li = document.createElement('li');
            li.innerHTML = newChannel;
            document.querySelector('#channelName').append(li);
        };
        const data = new FormData();
        data.append('newChannel', newChannel);
        request.send(data);
        return false;
    };
});
