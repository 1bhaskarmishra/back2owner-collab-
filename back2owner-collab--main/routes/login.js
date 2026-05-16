import express from "express";
import flash from "connect-flash";
import passport from "passport";
import bcrypt from "bcrypt";
import db from "../db.js";

const router = express.Router();
const saltRound = 10;


function isNotAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return res.redirect('/dashboard');
    }
    next();
}


/* GET Route */
router.get('/login',isNotAuthenticated, function(req, res, next) {
    let returnUrl = req.header('Referer') || '/dashboard';

    if (returnUrl.includes('/login') || returnUrl.includes('/signup')) {
        returnUrl = '/dashboard';
    }
    res.render('login.ejs', {
        messages: req.flash(),
        returnUrl: returnUrl
    });
});

router.get("/signup", isNotAuthenticated, (req, res) => {
    const message = req.flash("message");
    res.render("signup.ejs", { message });
});

router.get('/logout', function (req, res, next) {
    req.logout(function (err) {
        if (err) { return next(err); }
        req.session.destroy((err) => {
            if (err) { return next(err); }
            res.clearCookie('connect.sid');
            res.redirect('/login');
        });
    });
});

// POST route
router.post("/register", async (req, res) => {
    const { name: inputName, login_id, login_pass, confirm_login_pass } = req.body;
    const inputRegisterUsername = login_id?.toLowerCase();
    console.log(inputName, login_id, login_pass, confirm_login_pass);
    if (!inputName || !inputRegisterUsername || !login_pass) {
        req.flash("message", "Please fill in all fields!");
        return res.redirect("/signup");
    }

    if (login_pass.length < 8) {
        req.flash("message", "Password must be at least 8 characters");
        return res.redirect("/signup");
    }

    if (login_pass !== confirm_login_pass) {
        req.flash("message", "Passwords do not match!");
        return res.redirect("/signup");
    }

    try {
        const checkResult = await db.query("SELECT * FROM users WHERE username = $1", [inputRegisterUsername]);

        if (checkResult.rows.length > 0) {
            req.flash("message", "Email already exists. Try logging in.");
            return res.redirect("/signup");
        }

        const hash = await bcrypt.hash(login_pass, saltRound);

        await db.query(
            "INSERT INTO users (username, password, name) VALUES ($1, $2, $3)",
            [inputRegisterUsername, hash, inputName]
        );

        req.flash("success", "Account created successfully.");
        res.redirect("/login");

    } catch (err) {
        console.error("Registration Error:", err);
        req.flash("message", "An internal error occurred. Please try again later.");
        res.redirect("/signup");
    }
});

router.post('/login', passport.authenticate('local', {
    failureRedirect: '/login',
    failureFlash: true
}), (req, res) => {
    const returnTo = req.body.returnTo;
    res.redirect(returnTo || '/dashboard');
});
export default router;