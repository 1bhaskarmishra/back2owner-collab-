const name = document.getElementById("get-name").innerText;

document.getElementById("matches-btn").onclick = function(){
    document.getElementById("match-alert").scrollIntoView({ behavior: "smooth" });
}
// filter tabs

const cards = document.querySelectorAll(".report-card");

document.getElementById("tab-all").onclick = function(){
    document.getElementById("tab-all").classList.add("active-tab");
    document.getElementById("tab-lost").classList.remove("active-tab");
    document.getElementById("tab-found").classList.remove("active-tab");

    for(var i = 0; i < cards.length; i++){
        cards[i].style.display = "flex";
    }
}

document.getElementById("tab-lost").onclick = function(){
    document.getElementById("tab-lost").classList.add("active-tab");
    document.getElementById("tab-all").classList.remove("active-tab");
    document.getElementById("tab-found").classList.remove("active-tab");

    for(var i = 0; i < cards.length; i++){
        if(cards[i].getAttribute("data-type") == "lost"){
            cards[i].style.display = "flex";
        } else {
            cards[i].style.display = "none";
        }
    }
}

document.getElementById("tab-found").onclick = function(){
    document.getElementById("tab-found").classList.add("active-tab");
    document.getElementById("tab-all").classList.remove("active-tab");
    document.getElementById("tab-lost").classList.remove("active-tab");

    for(var i = 0; i < cards.length; i++){
        if(cards[i].getAttribute("data-type") == "found"){
            cards[i].style.display = "flex";
        } else {
            cards[i].style.display = "none";
        }
    }
}

document.getElementById("tab-resolved").onclick = function(){
    document.getElementById("tab-resolved").classList.add("active-tab");
    document.getElementById("tab-all").classList.remove("active-tab");
    document.getElementById("tab-lost").classList.remove("active-tab");

    for(var i = 0; i < cards.length; i++){
        if(cards[i].getAttribute("data-type") == "RESOLVED"){
            cards[i].style.display = "flex";
        } else {
            cards[i].style.display = "none";
        }
    }
}


// delete button



function openDeleteModal(itemId, itemName) {
    // Standard browser confirmation
    const confirmDelete = confirm(`Are you sure you want to delete "${itemName}"?`);

    if (confirmDelete) {
        const form = document.getElementById("delete-form");
        // Point the form to the correct ID
        form.action = `/delete-item/${itemId}`;
        form.submit();
    }
}

async function handleResolve(itemId, event) {
    if (confirm("Has this item been returned to its owner? This will archive the record.")) {
        // 1. Get the button and the card element
        const btn = event.currentTarget;
        const card = btn.closest(".report-card");

        try {
            // 2. Send the request to the server in the background
            const response = await fetch(`/resolve-item/${itemId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                // 3. UI Update (Since the server succeeded)
                const badge = card.querySelector(".status-badge");
                if (badge) {
                    badge.textContent = "RESOLVED";
                    badge.className = "status-badge resolved-status";
                }

                card.classList.add("resolved-card");

                // Remove the button so they can't resolve it twice
                btn.remove();

                console.log("Item resolved successfully");
            } else {
                alert("Failed to resolve item. Please try again.");
            }
        } catch (error) {
            console.error("Error:", error);
            alert("A network error occurred.");
        }
    }
}


// mark all notifications as read

// document.getElementById("mark-read-btn").onclick = function(){
//     let i;
//     const dots = document.querySelectorAll(".notif-dot");
//     for(i = 0; i < dots.length; i++){
//         dots[i].classList.add("read-dot");
//     }
//     var unreads = document.querySelectorAll(".unread");
//     for(i = 0; i < unreads.length; i++){
//         unreads[i].classList.remove("unread");
//     }
//     document.getElementById("bell-badge").style.display = "none";
// }

document.getElementById("confirm-logout-btn").onclick = function(){
    window.location.href = "/logout";
}

document.getElementById("cancel-logout-btn").onclick = function(){
    document.getElementById("logout-modal").style.display = "none";
}

document.getElementById("logout-modal").onclick = function(e){
    if(e.target == document.getElementById("logout-modal")){
        document.getElementById("logout-modal").style.display = "none";
    }
}
// hamburger toggle
document.getElementById("hamburger-btn").onclick = function(e){
    e.stopPropagation();
    var menu = document.getElementById("hamburger-menu");
    if(menu.style.display == "none"){
        menu.style.display = "block";
        document.getElementById("profile-dropdown").style.display = "none";
    } else {
        menu.style.display = "none";
    }
}

// profile dropdown toggle
document.getElementById("profile-trigger").onclick = function(e){
    e.stopPropagation();
    const drop = document.getElementById("profile-dropdown");
    if(drop.style.display == "none"){
        drop.style.display = "block";
        document.getElementById("hamburger-menu").style.display = "none";
    } else {
        drop.style.display = "none";
    }
}

// clicking anywhere outside closes both menus
document.onclick = function(){
    document.getElementById("hamburger-menu").style.display = "none";
    document.getElementById("profile-dropdown").style.display = "none";
}

// bell button scrolls to notifications section
document.getElementById("bell-btn").onclick = function(){
    document.getElementById("notifications-box").scrollIntoView({ behavior: "smooth" });
}

// contact us trigger from both hamburger and profile dropdown
document.getElementById("contact-trigger").onclick = function(e){
    e.preventDefault();
    document.getElementById("contact-modal").style.display = "flex";
    document.getElementById("profile-dropdown").style.display = "none";
}
document.getElementById("contact-trigger-ham").onclick = function(e){
    e.preventDefault();
    document.getElementById("contact-modal").style.display = "flex";
    document.getElementById("hamburger-menu").style.display = "none";
}

// logout is now inside profile dropdown
document.getElementById("logout-btn").addEventListener("click", function(e) {
    e.preventDefault();
    document.getElementById("profile-dropdown").style.display = "none";
    document.getElementById("logout-modal").style.display = "flex";
});

// contact modal cancel
document.getElementById("contact-cancel-btn").onclick = function(){
    document.getElementById("contact-modal").style.display = "none";
}

// close if clicking outside
document.getElementById("contact-modal").onclick = function(e){
    if(e.target == document.getElementById("contact-modal")){
        document.getElementById("contact-modal").style.display = "none";
    }
}

// contact submit
document.getElementById("contact-submit-btn").onclick = function(){
    var name = document.getElementById("contact-name").value;
    var email = document.getElementById("contact-email").value;
    var subject = document.getElementById("contact-subject").value;
    var msg = document.getElementById("contact-message").value;

    if(subject == ""){
        alert("Please select a subject!");
    } else if(name == ""){
        alert("Please enter your name!");
    } else if(email == ""){
        alert("Please enter your email!");
    } else if(msg == ""){
        alert("Please write your message!");
    } else {
        document.getElementById("contact-modal").style.display = "none";
        alert("Message sent! Admin will respond within 24 hours.");
        document.getElementById("contact-name").value = "";
        document.getElementById("contact-email").value = "";
        document.getElementById("contact-message").value = "";
        document.getElementById("contact-subject").value = "";
    }
}

var unreadCount = document.querySelectorAll(".unread").length;
document.getElementById("bell-badge").innerText = unreadCount;

if(unreadCount == 0){
    document.getElementById("bell-badge").style.display = "none";
}
function markResolved(btn){
    var ans = confirm("Mark this item as resolved?");
    if(ans == true){
        var card = btn.closest(".report-card");
        var badge = card.querySelector(".status-badge");
        badge.className = "status-badge resolved-status";
        badge.innerText = "RESOLVED";
        card.classList.add("resolved-card");
        btn.remove();
    }
}

// document.getElementById("tab-resolved").onclick = function(){
//     document.getElementById("tab-resolved").classList.add("active-tab");
//     document.getElementById("tab-all").classList.remove("active-tab");
//     document.getElementById("tab-lost").classList.remove("active-tab");
//     document.getElementById("tab-found").classList.remove("active-tab");
//
//     for(var i = 0; i < cards.length; i++){
//         var badge = cards[i].querySelector(".status-badge");
//         if(badge.classList.contains("resolved-status")){
//             cards[i].style.display = "flex";
//         } else {
//             cards[i].style.display = "none";
//         }
//     }
// }