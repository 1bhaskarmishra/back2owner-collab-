document.addEventListener("DOMContentLoaded", function() {

    // 1. Authenticated State Check
    const authData = document.getElementById("auth-data");
    const isLoggedIn = authData ? authData.dataset.loggedIn === "true" : false;
    const userName = authData ? authData.dataset.username : "";

    // Toggle Nav visibility
    if (isLoggedIn) {
        const navLogout = document.getElementById("nav-right-logout");
        const navLogin = document.getElementById("nav-right-login");
        if(navLogout) navLogout.style.display = "none";
        if(navLogin) {
            navLogin.style.display = "flex";
            document.getElementById("nav-username").innerText = "Hi, " + userName;
        }
    }

    // 2. Navigation & Auth Buttons
    const loginBtn = document.getElementById("login-btn");
    if(loginBtn) loginBtn.addEventListener("click", () => window.location.href = "/login");

    const signupBtn = document.getElementById("signup-btn");
    if(signupBtn) signupBtn.addEventListener("click", () => window.location.href = "/signup");

    const dashBtn = document.getElementById("dashboard-btn");
    if(dashBtn) dashBtn.addEventListener("click", () => window.location.href = "/dashboard");

    // 3. Logout Modal Logic
    const logoutBtn = document.getElementById("logout-btn");
    const logoutModal = document.getElementById("logout-modal");

    if(logoutBtn) {
        logoutBtn.addEventListener("click", () => {
            logoutModal.style.display = "flex";
        });
    }

    document.getElementById("confirm-logout-btn").onclick = function(){
        window.location.href = "/logout"; // Server-side logout
    };

    document.getElementById("cancel-logout-btn").onclick = function(){
        logoutModal.style.display = "none";
    };

    // Close logout modal on outside click
    logoutModal.onclick = function(e){
        if(e.target == logoutModal) logoutModal.style.display = "none";
    };

    // 4. Action Button Logic (Found/Lost)
    const detailBadge = document.getElementById("detail-badge");
    const mainBtn = document.getElementById("main-action-btn");
    const chatBtn = document.getElementById("chat-btn");

    if(detailBadge && mainBtn) {
        if(detailBadge.textContent.trim() == "LOST"){
            mainBtn.innerHTML = '<i class="fa-solid fa-handshake"></i> I Found This Item!';
            chatBtn.innerHTML = '<i class="fa-solid fa-comments"></i> Chat with Owner';
        } else {
            mainBtn.innerHTML = '<i class="fa-solid fa-flag"></i> This is My Item!';
            chatBtn.innerHTML = '<i class="fa-solid fa-comments"></i> Chat with Finder';
        }
    }

    // 5. Contact Modal (Found/Lost Action)
    const modalOverlay = document.getElementById("modal-overlay");
    if(mainBtn) {
        mainBtn.onclick = () => modalOverlay.style.display = "flex";
    }

    document.getElementById("modal-cancel-btn").onclick = () => {
        modalOverlay.style.display = "none";
        // Reset inputs
        document.getElementById("modal-name").value = "";
        document.getElementById("modal-contact").value = "";
        document.getElementById("modal-message").value = "";
    };

    // submit button inside modal

    // document.getElementById("modal-submit-btn").onclick = function(){
    //     if (!isLoggedIn){
    //         alert("Please Log In!");
    //         window.location.href = "/login";
    //     } else{
    //             var name = document.getElementById("modal-name").value;
    //             var contact = document.getElementById("modal-contact").value;
    //
    //         if(name == ""){
    //             alert("Please enter your name!");
    //         } else if(contact == ""){
    //             alert("Please enter your email or phone number!");
    //         } else {
    //             document.getElementById("modal-overlay").style.display = "none";
    //             alert("Notification sent! The reporter will contact you soon.");
    //             document.getElementById("modal-name").value = "";
    //             document.getElementById("modal-contact").value = "";
    //             document.getElementById("modal-message").value = "";
    //         }
    //     }
    // }

    // 6. Share & Chat
    document.getElementById("share-btn").onclick = function(){
        navigator.clipboard.writeText(window.location.href).then(() => {
            alert("Link copied to clipboard!");
        });
    };

    document.getElementById("chat-btn").onclick = function(){
        alert("Chat feature coming soon!");
    };
});

document.getElementById("modal-submit-btn").onclick = async function() {

    const authData = document.getElementById("auth-data");
    const isLoggedIn = authData.getAttribute("data-logged-in") === 'true';

    const pathSegments = window.location.pathname.split('/');
    const itemId = pathSegments[pathSegments.length - 1];

    const name = document.getElementById("modal-name").value.trim();
    const contact = document.getElementById("modal-contact").value.trim();
    const message = document.getElementById("modal-message").value.trim();

    if (!name || !contact) {
        alert("Please provide your name and contact info so the owner can reach you.");
        return;
    }

    const payload = {
        itemId: itemId,
        name: name,
        contact: contact,
        message: message
    };


    if (isLoggedIn) {
        try {
            const response = await fetch('/claim-item', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                alert("Notification sent! The responder will contact you shortly.");
                document.getElementById("modal-overlay").style.display = "none";

                // Optional: Change the button on the main page so they don't click again
                const mainBtn = document.getElementById("main-action-btn");
                if(mainBtn) {
                    mainBtn.innerText = "Notification Sent";
                    mainBtn.disabled = true;
                    mainBtn.style.backgroundColor = "#ccc";
                }
            } else {
                const errorData = await response.json();
                alert(errorData.message || "Something went wrong. Please try again.");
            }
        } catch (err) {
            console.error("Fetch error:", err);
            alert("Network error. Please check your connection.");
        }
    } else {
        alert("Kindly log in to send a notification!");
        window.location.href = "/login";
    }
};
