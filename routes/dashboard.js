import express from "express";
import db from "../db.js";

const router = express.Router();

function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }

    req.session.redirectTo = req.originalUrl;

    res.redirect('/login');
}
// PROTECTED ROUTE
// 'checkAuthenticated' MUST be here!
router.get('/dashboard', checkAuthenticated, async (req, res) => {
    try {
        const userId = req.user.id;
        const result = await db.query("SELECT * FROM reported_items WHERE user_id = $1", [userId]);
        const notifData = await db.query(
            "SELECT * FROM notifications WHERE recipient_id = $1 ORDER BY created_at DESC",
            [userId]
        );
        const items = result.rows;
        res.render('dashboard.ejs',
            { name: req.user.name,
                email: req.user.username,
                items: items,
                messages: req.flash(),
                isLoggedIn: req.isAuthenticated(),
                notifications: notifData.rows,
                user: req.user || null});
    } catch (err) {
        console.error(err);
        res.status(500).send("Server Error");
    }

});


export default router;