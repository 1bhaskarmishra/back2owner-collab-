// login button
let loginBtn = document.getElementById("login-button");
loginBtn.addEventListener("click", function(e) {

    let email = document.getElementById("login-email").value;
    let password = document.getElementById("login-password").value;

    if (email === "" && password === "") {
        e.preventDefault();
        alert("please enter your details!");
    } else if (email === "") {
        e.preventDefault();
        alert("please enter your email!");
    } else if (password === "") {
        e.preventDefault();
        alert("please enter your password!");
    } else {
        document.getElementById("login-form").submit();
        // localStorage.setItem("isLoggedIn", "true");
    }
});

// forgot password part
let forgotLink = document.getElementById("forgot-password");

forgotLink.addEventListener("click", function(e) {
    e.preventDefault(); // stop page from jumping

    let emailBox = prompt("Enter email for reset:");

    // simple beginner check
    if (emailBox === "") {
        alert("You didn't type anything!");
    }
    else if (emailBox) {
        alert("Reset link sent to " + emailBox);
    }
    // if they hit cancel, nothing happens (very beginner style)
});