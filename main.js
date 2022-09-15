let buttonLogin = document.getElementById("buttonLogin");
let buttonRegistro = document.getElementById("buttonRegistro");



buttonLogin.onclick = function (e) {
    e.preventDefault();

    window.location.href = ("./login.html")

}
buttonRegistro.onclick = function (e) {
    e.preventDefault();

    window.location.href = ("./register.html")

}

