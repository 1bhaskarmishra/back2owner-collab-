document.getElementById("footer-contact-link").onclick = function(e){
    e.preventDefault();
    document.getElementById("contact-modal").style.display = "flex";
}

document.getElementById("contact-cancel-btn").onclick = function(){
    document.getElementById("contact-modal").style.display = "none";
}

document.getElementById("contact-modal").onclick = function(e){
    if(e.target == document.getElementById("contact-modal")){
        document.getElementById("contact-modal").style.display = "none";
    }
}

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