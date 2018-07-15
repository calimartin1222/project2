/*document.addEventListener('DOMContentLoaded', () => {

    document.querySelector('#submit').disabled = true;

    if (window.localStorage.getItem('displayName') === null){
        document.querySelector('#submit').disabled = false;
    }
    else{
        document.querySelector('#submit').disabled = true;
        const name = window.localStorage.getItem('displayName');
    };
    document.querySelector('#submit').onsubmit = () => {
        const request = new XMLHttpRequest();
        const name = document.querySelector('#displayName').value;
        request.open('POST', '/hello');
        request.onload = () => {
            document.querySelector('#greeting').innerHTML = name;
        //window.localStorage.setItem('displayName', name);
        };
        const data = new FormData();
        data.append('disName', name);
        request.send(data);
        return false;
    };
});*/

document.addEventListener('DOMContentLoaded', () => {

    document.querySelector('#nameInput').onsubmit = () => {
        const request = new XMLHttpRequest();
        const name = document.querySelector('#name').value;
        window.localStorage.setItem("displayName", name);
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

});
