// responsive.js
// adds hamburger menu for small screens on all pages
// dashboard is skipped — it already has its own hamburger

document.addEventListener("DOMContentLoaded", function () {
    const authElement = document.getElementById("auth-data");
    const isLoggedIn = authElement.getAttribute("data-logged-in") === "true";
    const userName = authElement.getAttribute("data-username");

    var nav = document.getElementById("navbar");
    if (!nav) return;

    // grab nav links container (middle of navbar)
    var navLinks = document.getElementById("nav-links") || document.getElementById("nav-middle") || null;

    // grab right side blocks — different pages use different ids
    var navRightLoggedOut = document.getElementById("nav-right-logout")
                         || document.getElementById("nav-right-logged-out")
                         || null;

    var navRightLoggedIn = document.getElementById("nav-right-login") || null;

    // fallback for pages that use a single #nav-right
    var navRightGeneral = document.getElementById("nav-right") || null;

    // collect all blocks that need to be hidden on mobile
    var blocksToHide = [];
    if (navLinks) blocksToHide.push(navLinks);
    if (navRightLoggedOut) blocksToHide.push(navRightLoggedOut);
    if (navRightLoggedIn) blocksToHide.push(navRightLoggedIn);
    if (navRightGeneral) blocksToHide.push(navRightGeneral);

    // --- inject hamburger button and mobile menu CSS ---
    var style = document.createElement("style");
    style.innerHTML =
        // hamburger button — position:fixed so it doesn't need relative parent
        // navbar is already position:fixed, absolute child works inside it too
        "#ham-toggle { display: none; position: absolute; right: 16px; top: 50%; transform: translateY(-50%); background: transparent; border: none; color: white; font-size: 24px; cursor: pointer; z-index: 3000; padding: 4px 8px; }" +

        // full width mobile dropdown
        "#mob-menu { display: none; position: fixed; left: 0; right: 0; background: white; z-index: 2999; box-shadow: 0 6px 24px rgba(0,0,0,0.15); padding: 6px 0 12px 0; max-height: 75vh; overflow-y: auto; }" +

        // each nav link inside mobile menu
        "#mob-menu a { display: block !important; padding: 12px 22px; font-size: 15px; font-weight: 600; color: #0f1f4b; text-decoration: none; font-family: Manrope, sans-serif; border-bottom: 1px solid #f0f4ff; }" +
        "#mob-menu a:hover { background: #f0f4ff; }" +

        // buttons row inside mobile menu
        "#mob-menu .mob-btn-row { display: flex; gap: 10px; flex-wrap: wrap; padding: 10px 22px; }" +
        "#mob-menu .mob-btn-row button { font-size: 13px; padding: 8px 14px; border-radius: 8px; cursor: pointer; font-family: Manrope, sans-serif; font-weight: 700; }" +

        // divider line
        "#mob-menu hr { border: none; border-top: 1px solid #e5e7eb; margin: 4px 0; }";

    document.head.appendChild(style);

    // --- create hamburger button and add it inside navbar ---
    var hamBtn = document.createElement("button");
    hamBtn.id = "ham-toggle";
    hamBtn.type = "button";
    hamBtn.innerHTML = "&#9776;"; // 3 lines icon
    // NOTE: no nav.style.position change here — navbar is already position:fixed
    // which acts as positioning context for absolute children
    nav.appendChild(hamBtn);

    // --- create the mobile menu container ---
    var mobMenu = document.createElement("div");
    mobMenu.id = "mob-menu";
    document.body.appendChild(mobMenu);

    // --- build menu content freshly every time it opens ---
    function buildMenu() {
        mobMenu.innerHTML = ""; // clear old content

        // add nav links as fresh anchor tags (no cloning — avoids inheriting display:none)
        if (navLinks) {
            var links = navLinks.querySelectorAll("a");
            links.forEach(function (a) {
                var newA = document.createElement("a");
                newA.href = a.href;
                newA.innerText = a.innerText.trim();
                mobMenu.appendChild(newA);
            });
        }

        // divider before buttons
        var hr = document.createElement("hr");
        mobMenu.appendChild(hr);



        var btnRow = document.createElement("div");
        btnRow.className = "mob-btn-row";

        if (isLoggedIn) {

            // greeting
            if (userName) {
                var greet = document.createElement("span");
                greet.innerText = "Hi, " + userName;
                greet.style.cssText = "color:#0f1f4b; font-weight:700; font-size:14px; align-self:center; font-family:Manrope,sans-serif; width:100%;";
                btnRow.appendChild(greet);
            }

            // dashboard button
            var dashBtn = document.createElement("button");
            dashBtn.innerText = "My Dashboard";
            dashBtn.style.cssText = "background:#facc15; color:#0f1f4b; border:none;";
            dashBtn.onclick = function () { window.location.href = "/dashboard"; };
            btnRow.appendChild(dashBtn);

            // logout button — triggers the real logout btn so existing JS handles it
            var logBtn = document.createElement("button");
            logBtn.innerText = "Logout";
            logBtn.style.cssText = "background:transparent; color:#0f1f4b; border:2px solid #0f1f4b;";
            logBtn.onclick = function () {
                var realLogout = document.getElementById("logout-btn");
                if (realLogout) realLogout.click();
                closeMenu();
            };
            btnRow.appendChild(logBtn);

        } else {

            // login button
            var loginBtn = document.createElement("button");
            loginBtn.innerText = "Login";
            loginBtn.style.cssText = "background:transparent; color:#0f1f4b; border:2px solid #0f1f4b;";
            loginBtn.onclick = function () { window.location.href = "/login"; };
            btnRow.appendChild(loginBtn);

            // signup button
            var signupBtn = document.createElement("button");
            signupBtn.innerText = "Sign Up";
            signupBtn.style.cssText = "background:#facc15; color:#0f1f4b; border:none;";
            signupBtn.onclick = function () { window.location.href = "/signup"; };
            btnRow.appendChild(signupBtn);
        }

        mobMenu.appendChild(btnRow);
    }

    // --- open menu ---
    function openMenu() {
        var navHeight = nav.offsetHeight || 64;
        mobMenu.style.top = navHeight + "px";
        buildMenu();
        mobMenu.style.display = "block";
        hamBtn.innerHTML = "&#10005;"; // X icon when open
    }

    // --- close menu ---
    function closeMenu() {
        mobMenu.style.display = "none";
        hamBtn.innerHTML = "&#9776;"; // back to 3 lines
    }

    // toggle menu on hamburger click
    hamBtn.addEventListener("click", function (e) {
        e.stopPropagation();
        if (mobMenu.style.display === "block") {
            closeMenu();
        } else {
            openMenu();
        }
    });

    // close menu when clicking outside
    document.addEventListener("click", function (e) {
        if (mobMenu.style.display === "block") {
            if (!mobMenu.contains(e.target) && e.target !== hamBtn) {
                closeMenu();
            }
        }
    });

    // close menu when a link inside is clicked
    mobMenu.addEventListener("click", function (e) {
        var a = e.target.closest("a");
        if (a) closeMenu();
    });

    // --- show or hide things based on screen size ---
    function handleResize() {
        var w = window.innerWidth;

        if (w <= 768) {
            // mobile — hide desktop nav blocks, show hamburger
            blocksToHide.forEach(function (el) {
                el.style.display = "none";
            });
            hamBtn.style.display = "inline-block";

        } else {
            // desktop — restore blocks, hide hamburger
            if (navLinks) navLinks.style.display = "flex";
            if (navRightGeneral) navRightGeneral.style.display = "flex";

            // restore correct logged-in/out state on desktop
            var loggedIn = localStorage.getItem("isLoggedIn") === "true";
            if (navRightLoggedIn) navRightLoggedIn.style.display = loggedIn ? "flex" : "none";
            if (navRightLoggedOut) navRightLoggedOut.style.display = loggedIn ? "none" : "flex";

            hamBtn.style.display = "none";
            closeMenu();
        }
    }

    // run once on page load
    handleResize();

    // run on window resize with small delay
    var resizeTimer = null;
    window.addEventListener("resize", function () {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(handleResize, 100);
    });

});







// // responsive.js
// // beginner-friendly but more robust hamburger + mobile menu
// // fixes: removed hint message, supports dashboard nav ids, uses real navbar height

// document.addEventListener("DOMContentLoaded", function() {

//     // main navbar wrapper
//     var nav = document.getElementById("navbar");
//     if(!nav) return;

//     // try to find several possible link containers used across pages
//     var navLinks = document.getElementById("nav-links") || document.getElementById("nav-middle") || null;

//     // right-side blocks (many pages use different ids)
//     var rightLoggedOut = document.getElementById("nav-right-logged-out") 
//                         || document.getElementById("nav-right-logout") 
//                         || document.getElementById("nav-right"); // fallback where nav-right used as logged-out in some pages

//     // some pages use a separate logged-in block id
//     var rightLoggedIn = document.getElementById("nav-right-login") 
//                        || document.getElementById("nav-right"); // dashboard uses nav-right

//     // also collect other elements that may need hiding on small screens
//     var maybeBlocks = [];
//     if(navLinks) maybeBlocks.push(navLinks);
//     var navMiddle = document.getElementById("nav-middle");
//     if(navMiddle && maybeBlocks.indexOf(navMiddle) === -1) maybeBlocks.push(navMiddle);

//     // possible right side ids
//     var navRight = document.getElementById("nav-right");
//     var navRightLogin = document.getElementById("nav-right-login");
//     var navRightLoggedOut = document.getElementById("nav-right-logged-out") || document.getElementById("nav-right-logout");
//     if(navRight && maybeBlocks.indexOf(navRight) === -1) maybeBlocks.push(navRight);
//     if(navRightLogin && maybeBlocks.indexOf(navRightLogin) === -1) maybeBlocks.push(navRightLogin);
//     if(navRightLoggedOut && maybeBlocks.indexOf(navRightLoggedOut) === -1) maybeBlocks.push(navRightLoggedOut);

//     // always have at least something to clone; if none, we'll still create hamburger but keep behavior simple
//     // inject small CSS (hamburger absolutely placed so desktop flow stays same)
//     var style = document.createElement("style");
//     style.innerHTML = "\
//     #hamburger-toggle { position: absolute; right: 12px; top: 50%; transform: translateY(-50%); background: transparent; border: none; font-size: 22px; color: white; cursor: pointer; padding: 6px 8px; display: none; z-index: 3000; } \
//     #mobile-menu { position: fixed; left: 0; right: 0; background: white; z-index: 2999; box-shadow: 0 8px 30px rgba(0,0,0,0.15); display: none; padding: 8px 8px; max-height: 72vh; overflow-y: auto; } \
//     #mobile-menu .nav-link, #mobile-menu .mobile-row { display: block; padding: 12px 10px; color: #062460; text-decoration: none; border-bottom: 1px solid rgba(6,36,96,0.06); font-weight:700; } \
//     #mobile-menu .mobile-row { display:flex; gap:10px; align-items:center; flex-wrap:wrap; } \
//     @media (max-width: 380px) { #mobile-menu .nav-link { font-size: 15px; } }";
//     document.head.appendChild(style);

//     // create hamburger button if missing
//     var ham = document.getElementById("hamburger-toggle");
//     if(!ham){
//         ham = document.createElement("button");
//         ham.id = "hamburger-toggle";
//         ham.type = "button";
//         ham.setAttribute("aria-expanded","false");
//         ham.title = "Menu";
//         ham.innerHTML = "☰";
//         nav.appendChild(ham); // absolutely positioned so won't change layout
//     }
//     var hamBtn = ham;

//     // create mobile menu container (single)
//     var mobileMenu = document.getElementById("mobile-menu");
//     if(!mobileMenu){
//         mobileMenu = document.createElement("div");
//         mobileMenu.id = "mobile-menu";
//         document.body.appendChild(mobileMenu);
//     }

//     // helper to remove IDs inside clone and preserve link back reference
//     function sanitizeClone(root){
//         var elems = root.querySelectorAll("[id]");
//         elems.forEach(function(el){
//             var orig = el.getAttribute("id");
//             el.setAttribute("data-clone-for", orig);
//             el.removeAttribute("id");
//         });
//     }

//     // build mobile menu content based on current login state
//     function buildMobileMenu(){
//         mobileMenu.innerHTML = ""; // clear
//         // clone main nav links if available
//         if(navLinks){
//             var cloneLinks = navLinks.cloneNode(true);
//             sanitizeClone(cloneLinks);
//             cloneLinks.id = "mobile-nav-links";
//             // ensure anchors get nav-link class if not
//             var as = cloneLinks.querySelectorAll("a");
//             as.forEach(function(a){ a.classList.add("nav-link"); });
//             mobileMenu.appendChild(cloneLinks);
//         }
//         // read login state
//         var loggedIn = (localStorage.getItem("isLoggedIn") === "true");

//         // determine which right-block to clone and show inside menu
//         var cloned = null;
//         if(loggedIn){
//             // prefer explicit logged-in block, fallback to nav-right
//             var orig = document.getElementById("nav-right-login") || document.getElementById("nav-right");
//             if(orig){
//                 cloned = orig.cloneNode(true);
//             }
//         } else {
//             var origOut = document.getElementById("nav-right-logged-out") || document.getElementById("nav-right-logout") || document.getElementById("nav-right");
//             if(origOut){
//                 cloned = origOut.cloneNode(true);
//             }
//         }
//         if(cloned){
//             sanitizeClone(cloned);
//             cloned.id = loggedIn ? "mobile-loggedin" : "mobile-loggedout";
//             var wrap = document.createElement("div");
//             wrap.className = "mobile-row";
//             wrap.appendChild(cloned);
//             mobileMenu.appendChild(wrap);
//         }
//         // no hint message now (removed as requested)
//     }

//     // open/close functions using actual navbar height
//     function openMenu(){
//         var navH = nav.offsetHeight || 64;
//         mobileMenu.style.top = navH + "px";
//         mobileMenu.style.display = "block";
//         hamBtn.setAttribute("aria-expanded","true");
//         document.body.style.overflow = "hidden";
//     }
//     function closeMenu(){
//         mobileMenu.style.display = "none";
//         hamBtn.setAttribute("aria-expanded","false");
//         document.body.style.overflow = "";
//     }

//     // toggle on click
//     hamBtn.addEventListener("click", function(e){
//         e.stopPropagation();
//         buildMobileMenu(); // rebuild to reflect login state
//         if(mobileMenu.style.display === "block") closeMenu(); else openMenu();
//     });

//     // click outside closes
//     document.addEventListener("click", function(e){
//         if(mobileMenu.style.display === "block"){
//             if(!mobileMenu.contains(e.target) && e.target !== hamBtn) closeMenu();
//         }
//     });

//     // clicking anchors (with href) will navigate — just close menu (delegation)
//     mobileMenu.addEventListener("click", function(e){
//         var a = e.target.closest("a");
//         if(a && a.getAttribute("href")){
//             closeMenu();
//             return;
//         }
//         // if clicked a cloned node with data-clone-for, trigger original click
//         var node = e.target;
//         while(node && node !== mobileMenu){
//             if(node.getAttribute && node.getAttribute("data-clone-for")){
//                 var origId = node.getAttribute("data-clone-for");
//                 var orig = document.getElementById(origId);
//                 if(orig){
//                     orig.click();
//                     closeMenu();
//                     e.preventDefault();
//                     return;
//                 }
//                 break;
//             }
//             node = node.parentNode;
//         }
//         // fallback by button text (very beginner)
//         var btn = e.target.closest("button");
//         if(btn){
//             var txt = (btn.textContent || "").toLowerCase();
//             if(txt.indexOf("login") !== -1){ window.location.href = "login-signup.html"; closeMenu(); return; }
//             if(txt.indexOf("sign") !== -1){ window.location.href = "login-signup.html#signup"; closeMenu(); return; }
//             if(txt.indexOf("dashboard") !== -1){ window.location.href = "dashboard.html"; closeMenu(); return; }
//             if(txt.indexOf("logout") !== -1){ var origLogout = document.getElementById("logout-btn"); if(origLogout) origLogout.click(); closeMenu(); return; }
//         }
//     });

//     // sync desktop visibility so only appropriate right block shows
//     function syncDesktopState(){
//         var loggedIn = (localStorage.getItem("isLoggedIn") === "true");
//         // explicit control for all known right blocks
//         var blocksToControl = [
//             document.getElementById("nav-right-login"),
//             document.getElementById("nav-right-logged-out"),
//             document.getElementById("nav-right-logout"),
//             document.getElementById("nav-right"),
//         ];
//         blocksToControl.forEach(function(b){
//             if(!b) return;
//             // show or hide depending on role and login state
//             var id = b.id || "";
//             if(id === "nav-right-login" || id === "nav-right"){
//                 // treat nav-right as logged-in on pages where it's used that way (dashboard)
//                 if(loggedIn) b.style.display = ""; else b.style.display = "none";
//             } else {
//                 // logged-out blocks
//                 if(!loggedIn) b.style.display = ""; else b.style.display = "none";
//             }
//         });
//     }

//     // show/hide nav for small screens
//     function updateNavForSize(){
//         var w = window.innerWidth;
//         var navH = nav.offsetHeight || 64;
//         // position hamburger vertical center of current navbar
//         hamBtn.style.top = (navH/2) + "px";
//         if(w <= 768){
//             // hide desktop nav areas we've collected
//             maybeBlocks.forEach(function(bl){
//                 if(bl) bl.style.display = "none";
//             });
//             hamBtn.style.display = "inline-block";
//         } else {
//             // restore desktop layout and sync login state
//             maybeBlocks.forEach(function(bl){
//                 if(bl) bl.style.display = "";
//             });
//             hamBtn.style.display = "none";
//             closeMenu();
//             syncDesktopState();
//         }
//     }

//     // initial run
//     updateNavForSize();

//     // resize handler debounce
//     var rtimer = null;
//     window.addEventListener("resize", function(){
//         if(rtimer) clearTimeout(rtimer);
//         rtimer = setTimeout(function(){ updateNavForSize(); }, 120);
//     });

//     // if login state changes in another tab, update nav and mobile menu
//     window.addEventListener("storage", function(e){
//         if(e.key === "isLoggedIn"){
//             syncDesktopState();
//             if(mobileMenu.style.display === "block") buildMobileMenu();
//         }
//     });

// });