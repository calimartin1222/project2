document.addEventListener('DOMContentLoaded', () => {

    document.querySelector('#nameButton').disabled = true;

    if (window.localStorage.getItem('displayName') === null)
        document.querySelector('#nameButton').disabled = false;
    else
        document.querySelector('#nameButton').disabled = true;

    document.querySelector('#nameInput').onsubmit = () => {
        const request = new XMLHttpRequest();
        const name = document.querySelector('#displayName').value;
        request.open('POST', '/hello');
        document.querySelector('#greeting').innerHTML = name;
        window.localStorage.setItem('displayName', name);
    };
    const data = new FormData();
    data.append('disName', name);
    request.send(data);
    return false;
});