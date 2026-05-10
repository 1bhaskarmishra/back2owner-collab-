
// if user is already logged in just send them to dashboard
// var checkLogin = localStorage.getItem("isLoggedIn");
// if(checkLogin == "true"){
//     window.location.href = "dashboard.html";
// }


 
 // signup button logic
let signupBtn = document.getElementById("signup-button");
signupBtn.addEventListener("click", function(e){
    let name = document.getElementById("signup-name").value;
    let email = document.getElementById("signup-email").value;
    let password = document.getElementById("signup-password").value;
    // get the value from the new confirm box
    let confirmPass = document.getElementById("signup-confirm").value;

    if(name === "" || email ==="" || password===""){
        e.preventDefault();
        alert("Please fill in all fields!");
    } else if(password !== confirmPass) {
        e.preventDefault();
        // check if passwords match
        alert("Passwords do not match! Please check again.");

    } else if(password .length < 8){
            e.preventDefault();
            // check if passwords match
            alert("Password must be at least 8 characters.");
    } else {
        document.getElementById("register-form").submit();
    }
});

