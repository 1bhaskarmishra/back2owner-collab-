document.addEventListener("DOMContentLoaded", () => {
    // 1. Read authentication state directly injected from the server
    const authElement = document.getElementById("auth-data");
    const isLoggedIn = authElement.getAttribute("data-logged-in") === "true";
    const userName = authElement.getAttribute("data-username");

    // 2. Update Navbar UI based on Server State
    if (isLoggedIn) {
        document.getElementById("nav-right-logout").style.display = "none";
        document.getElementById("nav-right-login").style.display = "flex";
        document.getElementById("nav-username").innerText = "Hi, " + userName;
    } else {
        document.getElementById("nav-right-logout").style.display = "flex";
        document.getElementById("nav-right-login").style.display = "none";
    }

    // 3. Navigation Listeners
    const setupNavigation = (id, url) => {
        const element = document.getElementById(id);
        if (element) {
            element.addEventListener("click", () => window.location.href = url);
        }
    };

    setupNavigation("login-btn", "/login");
    setupNavigation("signup-btn", "/signup");
    setupNavigation("dashboard-btn", "/dashboard");
    setupNavigation("browse", "/browseitem");
    setupNavigation("browse-all-btn", "/browseitem");

    // 4. Protected Actions (Report Lost / Found)
    // If the server says they aren't logged in, send them straight to the login page
    const handleProtectedRoute = (id, destinationUrl) => {
        const btn = document.getElementById(id);
        if (btn) {
            btn.addEventListener("click", () => {
                if (isLoggedIn) {
                    window.location.href = destinationUrl;
                } else {
                    window.location.href = "/login";
                }
            });
        }
    };

    handleProtectedRoute("lost", "/report-lost");
    handleProtectedRoute("found", "/report-found");

    // 5. Logout Handling
    const logoutBtn = document.getElementById("logout-btn");
    if (logoutBtn) {
        logoutBtn.addEventListener("click", () => {
            document.getElementById("logout-modal").style.display = "flex";
        });
    }

    document.getElementById("confirm-logout-btn").onclick = function() {
        // Redirect directly to your server's logout route to clear the session cookie
        window.location.href = "/logout";
    };

    document.getElementById("cancel-logout-btn").onclick = function() {
        document.getElementById("logout-modal").style.display = "none";
    };
});

// login button - only runs if user is not logged in
var loginButton = document.getElementById("login-btn");
if(loginButton){
    loginButton.addEventListener("click", function(){
        window.location.href = "/login";
    });
}

// signup button
var signupButton = document.getElementById("signup-btn");
if(signupButton){
    signupButton.addEventListener("click", function(){
        window.location.href = "/signup";
    });
}

// dashboard button - for logged in users
var dashBtn = document.getElementById("dashboard-btn");
if(dashBtn){
    dashBtn.addEventListener("click", function(){
        window.location.href = "/dashboard";
    });
}

// logout button - opens the popup
var logoutBtn = document.getElementById("logout-btn");
if(logoutBtn){
    logoutBtn.addEventListener("click", function(){
        document.getElementById("logout-modal").style.display = "flex";
    });
}

// yes logout button inside popup
document.getElementById("confirm-logout-btn").onclick = function(){
    window.location.href = "/";
}

// cancel button inside popup
document.getElementById("cancel-logout-btn").onclick = function(){
    document.getElementById("logout-modal").style.display = "none";
}

// click outside the box to close popup
document.getElementById("logout-modal").onclick = function(e){
    if(e.target == document.getElementById("logout-modal")){
        document.getElementById("logout-modal").style.display = "none";
    }
}

// browse items button
let browseButton = document.getElementById("browse");
browseButton.addEventListener("click", function(){
    window.location.href = "/browseitem";
});


// search bar
// when user searches it goes to browse page with the search word in the url
// on the browse page we can read that url and filter items

let searchInput = document.getElementById("searchInput");
let searchBtn = document.getElementById("searchBtn");

searchBtn.addEventListener("click", function(){
    let value = searchInput.value.trim();
    if(value == ""){
        alert("Please type something to search!");
    } else {
        // CHECK IF ANY ISSUES WITH SEARCH ON HOME PAGE
        window.location.href = "/browseitem?search=" + value;
    }
});

// also search when user presses enter key
searchInput.addEventListener("keydown", function(event){
    if(event.key == "Enter"){
        let value = searchInput.value.trim();
        if(value == ""){
            alert("Please type something to search!");
        } else {
            window.location.href = "/browseitem?search=" + value;
        }
    }
});

// quick search tags
function quickSearch(term){
    searchInput.value = term;
    window.location.href = "/browseitem?search=" + term;
}

// browse all button
let browseAllBtn = document.getElementById("browse-all-btn");
browseAllBtn.addEventListener("click", function(){
    window.location.href = "browseitem.html";
});


// step hover effects

let step1 = document.getElementById("step-1");
step1.addEventListener("mouseover", function(){
    step1.style.transform = "scale(1.05)";
});
step1.addEventListener("mouseout", function(){
    step1.style.transform = "scale(1)";
});

let step2 = document.getElementById("step-2");
step2.addEventListener("mouseover", function(){
    step2.style.transform = "scale(1.05)";
});
step2.addEventListener("mouseout", function(){
    step2.style.transform = "scale(1)";
});

let step3 = document.getElementById("step-3");
step3.addEventListener("mouseover", function(){
    step3.style.transform = "scale(1.05)";
});
step3.addEventListener("mouseout", function(){
    step3.style.transform = "scale(1)";
});


// navbar shadow on scroll

let navbar = document.getElementById("navbar");
window.addEventListener("scroll", function(){
    if(window.scrollY > 10){
        navbar.style.boxShadow = "0 4px 24px rgba(0,0,0,0.35)";
    } else {
        navbar.style.boxShadow = "0 2px 20px rgba(0,0,0,0.25)";
    }
});