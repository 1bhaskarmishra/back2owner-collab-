// dashboard button
var dashBtn = document.getElementById("dashboard-btn");
if(dashBtn){
    dashBtn.addEventListener("click", function(){
        window.location.href = "/dashboard";
    });
}


// logout popup
var logoutBtn = document.getElementById("logout-btn");
if(logoutBtn){
    logoutBtn.addEventListener("click", function(){
        document.getElementById("logout-modal").style.display = "flex";
    });
}

document.getElementById("confirm-logout-btn").onclick = function(){
    window.location.href = "logout";
};

document.getElementById("cancel-logout-btn").onclick = function(){
    document.getElementById("logout-modal").style.display = "none";
};

document.getElementById("logout-modal").onclick = function(e){
    if(e.target == document.getElementById("logout-modal")){
        document.getElementById("logout-modal").style.display = "none";
    }
};

// navbar scroll shadow
var navbar = document.getElementById("navbar");
window.addEventListener("scroll", function(){
    if(window.scrollY > 10){
        navbar.style.boxShadow = "0 4px 24px rgba(0,0,0,0.35)";
    } else {
        navbar.style.boxShadow = "0 2px 20px rgba(0,0,0,0.25)";
    }
});

// ---- image upload for found form ----

var uploadArea = document.getElementById("upload-area-found");
var fileInput = document.getElementById("photo-upload-found");
var uploadTrigger = document.getElementById("upload-trigger-found");
var placeholder = document.getElementById("upload-placeholder-found");
var previewWrap = document.getElementById("image-preview-found");
var previewImg = document.getElementById("preview-img-found");
var removeBtn = document.getElementById("remove-img-found");

uploadTrigger.addEventListener("click", function(){
    fileInput.click();
});

uploadArea.addEventListener("click", function(){
    if(previewWrap.style.display == "none"){
        fileInput.click();
    }
});

fileInput.addEventListener("change", function(){
    var file = fileInput.files[0];
    if(file){
        showImagePreview(file);
    }
});

// drag and drop
uploadArea.addEventListener("dragover", function(e){
    e.preventDefault();
    uploadArea.classList.add("drag-over");
});

uploadArea.addEventListener("dragleave", function(){
    uploadArea.classList.remove("drag-over");
});

uploadArea.addEventListener("drop", function(e){
    e.preventDefault();
    uploadArea.classList.remove("drag-over");
    var file = e.dataTransfer.files[0];
    if(file && file.type.startsWith("image/")){
        showImagePreview(file);
    } else {
        alert("Please drop an image file.");
    }
});

function showImagePreview(file){
    if(file.size > 5 * 1024 * 1024){
        alert("Image is too large. Please upload something under 5MB.");
        return;
    }
    var reader = new FileReader();
    reader.onload = function(e){
        previewImg.src = e.target.result;
        placeholder.style.display = "none";
        previewWrap.style.display = "flex";
    };
    reader.readAsDataURL(file);
}

removeBtn.addEventListener("click", function(e){
    e.stopPropagation();
    fileInput.value = "";
    previewImg.src = "";
    previewWrap.style.display = "none";
    placeholder.style.display = "flex";
});

// ---- radio card selection highlight ----
// the CSS handles most of it but we also add/remove a class for styling flexibility

var radioOptions = document.querySelectorAll(".radio-option input[type='radio']");
radioOptions.forEach(function(radio){
    radio.addEventListener("change", function(){
        // remove selected state from all cards first
        document.querySelectorAll(".radio-card").forEach(function(card){
            card.classList.remove("selected-card");
        });
        // add to the one that was just clicked
        radio.nextElementSibling.classList.add("selected-card");
    });
});

// ---- form validation and submit ----

document.getElementById("submit-found-btn").addEventListener("click", async function() {
    var itemName = document.getElementById("item-name").value.trim();
    var category = document.getElementById("item-category").value;
    var description = document.getElementById("item-desc").value.trim();
    var location = document.getElementById("found-location").value;
    var dateFound = document.getElementById("date-found").value;
    var fileInput = document.getElementById("photo-upload-found"); // The hidden file input

    var itemStatus = "";
    var radioChecked = document.querySelector("input[name='item-status']:checked");
    if(radioChecked){ itemStatus = radioChecked.value; }

    if(itemName == ""){ alert("Please enter the item name."); return; }
    if(category == ""){ alert("Please select a category."); return; }
    if(description == "" || description.length < 15){
        alert("Please provide a detailed description (at least 15 chars).");
        return;
    }

    const formData = new FormData();
    formData.append("item_name", itemName);
    formData.append("item_category", category);
    formData.append("item_desc", description);
    formData.append("found_location", location);
    formData.append("date_found", dateFound);
    formData.append("item_status", itemStatus);

    if (fileInput.files.length > 0) {
        formData.append("img", fileInput.files[0]);
    }
    try {
        const response = await fetch("/report-found", {
            method: "POST",
            body: formData
        });
        console.log(response);

        if (response.ok) {
            document.getElementById("success-modal").style.display = "flex";
        } else {
            const errorData = await response.json();
            alert("Submission failed: " + (errorData.error || "Server error"));
        }
    } catch (err) {
        console.error("Fetch error:", err);
        alert("Connection failed. Please check your internet or server status.");
    }
});

// success popup buttons
document.getElementById("go-dashboard-btn").onclick = function(){
    window.location.href = "dashboard";
};

document.getElementById("go-browse-btn").onclick = function(){
    window.location.href = "browseitem";
};

// document.getElementById("submit-found-btn").addEventListener("click", async () => {
//     const formData = new FormData();
//
//     // Append text fields
//     formData.append("itemName", document.getElementById("item-name").value);
//     formData.append("category", document.getElementById("item-category").value);
//     formData.append("description", document.getElementById("item-desc").value);
//     formData.append("location", document.getElementById("found-location").value);
//     formData.append("date", document.getElementById("date-found").value);
//
//     // Append radio button value
//     const status = document.querySelector('input[name="item-status"]:checked')?.value;
//     formData.append("status", status);
//
//     // Append file
//     const fileInput = document.getElementById("photo-upload-found");
//     if (fileInput.files.length > 0) {
//         formData.append("itemImage", fileInput.files[0]);
//     }
//     console.log(formData);
//     // try {
//     //     const response = await fetch("/report-found", {
//     //         method: "POST",
//     //         body: formData // Note: Do NOT set Content-Type header here; browser does it automatically for FormData
//     //     });
//     //     console.log(response);
//     //     if (response.ok) {
//     //         // Show your success modal
//     //         document.getElementById("success-modal").style.display = "flex";
//     //     } else {
//     //         alert("Submission failed. Please check your inputs.");
//     //     }
//     // } catch (err) {
//     //     console.error("Error:", err);
//     // }
//     // Inside your fetch block...
//     try {
//         const response = await fetch("/report-found", {
//             method: "POST",
//             body: formData
//         });
//
//         // Capture the result body, even if it's an error
//         const result = await response.json();
//
//         if (response.ok) {
//             document.getElementById("success-modal").style.display = "flex";
//         } else {
//             // This will print the actual error from your Express app to the console
//             console.error("Server Error:", result);
//             alert("Submission failed: " + (result.error || "Unknown error"));
//         }
//     } catch (err) {
//         console.error("Fetch Error:", err);
//         alert("Network or Server error. Check the console.");
//     }
// });