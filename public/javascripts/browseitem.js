
document.addEventListener("DOMContentLoaded", function() {
    // 1. Read Authentication state from injected HTML data
    const userData = document.getElementById("user-data");
    const isLoggedIn = userData.dataset.loggedIn === "true";
    const userName = userData.dataset.username;

    // 2. Handle Navbar UI
    if (isLoggedIn) {
        document.getElementById("nav-right-logged-out").style.display = "none";
        document.getElementById("nav-right-login").style.display = "flex";
        document.getElementById("nav-username").innerText = "Hi, " + userName;
    }

    // 3. Navigation Buttons
    const loginBtn = document.getElementById("login-btn");
    if(loginBtn) loginBtn.addEventListener("click", () => window.location.href = "/login");

    const signupBtn = document.getElementById("signup-btn");
    if(signupBtn) signupBtn.addEventListener("click", () => window.location.href = "/signup");

    const dashBtn = document.getElementById("dashboard-btn");
    if(dashBtn) dashBtn.addEventListener("click", () => window.location.href = "/dashboard");

    // 4. Logout Logic
    const logoutBtn = document.getElementById("logout-btn");
    if(logoutBtn) {
        logoutBtn.addEventListener("click", () => {
            document.getElementById("logout-modal").style.display = "flex";
        });
    }

    // Instead of clearing local storage, we hit the server's logout route
    document.getElementById("confirm-logout-btn").onclick = function(){
        window.location.href = "/logout";
    };

    document.getElementById("cancel-logout-btn").onclick = function(){
        document.getElementById("logout-modal").style.display = "none";
    };

    document.getElementById("logout-modal").onclick = function(e){
        if(e.target == document.getElementById("logout-modal")){
            document.getElementById("logout-modal").style.display = "none";
        }
    };

    // --- FILTER LOGIC (Kept as is) ---
    var allCards = document.querySelectorAll(".item-card");
    var activeType = "all";
    var activeCategory = "all";
    var activeLocation = "all";
    var activeDate = "all";
    var searchValue = "";

    var toggleBtns = document.querySelectorAll(".toggle-btn");
    toggleBtns.forEach(function(btn){
        btn.addEventListener("click", function(){
            toggleBtns.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            activeType = btn.getAttribute("data-type");
            applyFilters();
        });
    });

    document.getElementById("category-filter").addEventListener("change", (e) => { activeCategory = e.target.value; applyFilters(); });
    document.getElementById("location-filter").addEventListener("change", (e) => { activeLocation = e.target.value; applyFilters(); });
    document.getElementById("date-filter").addEventListener("change", (e) => { activeDate = e.target.value; applyFilters(); });

    const searchInput = document.getElementById("search-input");
    const searchBtn = document.getElementById("search-btn");

    searchBtn.addEventListener("click", () => {
        searchValue = searchInput.value.toLowerCase().trim();
        applyFilters();
    });

    searchInput.addEventListener("keypress", (e) => {
        if(e.key == "Enter"){
            searchValue = searchInput.value.toLowerCase().trim();
            applyFilters();
        }
    });

    function resetAllFilters(){
        activeType = "all"; activeCategory = "all"; activeLocation = "all"; activeDate = "all"; searchValue = "";
        searchInput.value = "";
        document.getElementById("category-filter").value = "all";
        document.getElementById("location-filter").value = "all";
        document.getElementById("date-filter").value = "all";
        toggleBtns.forEach(b => b.classList.remove("active"));
        document.querySelector(".toggle-btn[data-type='all']").classList.add("active");
        applyFilters();
    }

    document.getElementById("clear-filters-btn").addEventListener("click", resetAllFilters);
    document.getElementById("reset-btn").addEventListener("click", resetAllFilters);

    function applyFilters(){
        var visibleCount = 0;
        allCards.forEach(function(card){
            var cardType = card.getAttribute("data-type");
            var cardCategory = card.getAttribute("data-category");
            var cardLocation = card.getAttribute("data-location");
            var cardDate = card.getAttribute("data-date");
            var cardTitle = card.querySelector(".card-title").textContent.toLowerCase();
            var cardBody = card.querySelector(".card-body").textContent.toLowerCase();

            var typeOk = (activeType == "all") || (cardType == activeType);
            var categoryOk = (activeCategory == "all") || (cardCategory == activeCategory);
            var locationOk = (activeLocation == "all") || (cardLocation == activeLocation);

            var dateOk = true;
            if(activeDate == "today") dateOk = (cardDate == "today");
            else if(activeDate == "week") dateOk = (cardDate == "today" || cardDate == "week");
            else if(activeDate == "month") dateOk = (cardDate == "today" || cardDate == "week" || cardDate == "month");

            var searchOk = (searchValue == "") || (cardTitle.includes(searchValue) || cardBody.includes(searchValue));

            if(typeOk && categoryOk && locationOk && dateOk && searchOk){
                card.style.display = "block";
                visibleCount++;
            } else {
                card.style.display = "none";
            }
        });

        var countText = document.getElementById("results-count");
        countText.textContent = (visibleCount == 1) ? "Showing 1 item" : "Showing " + visibleCount + " items";

        document.getElementById("no-results").style.display = (visibleCount == 0) ? "block" : "none";
        document.getElementById("items-grid").style.display = (visibleCount == 0) ? "none" : "flex";
    }

    // allCards.forEach(function(card){
    //     card.addEventListener("click", () => window.location.href = "item-detail.html?id=" + card.getAttribute("data-id"));
    //     card.querySelector(".view-btn").addEventListener("click", (e) => {
    //         e.stopPropagation();
    //         window.location.href = "/item-detail";
    //     });
    // });
});