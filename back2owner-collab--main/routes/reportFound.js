import express from "express";

// database
import db from "../db.js";

const router = express.Router();

function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }

    req.session.redirectTo = req.originalUrl;

    res.redirect('/login');
}

router.get('/report-found', checkAuthenticated, (req, res) => {
    res.render('report-found.ejs', {user: req.user});
});


router.post("/report-found", checkAuthenticated, async (req, res) => {
    console.log(req.body);
    try {
        if (!req.files || !req.files.img) {
            return res.status(400).json({ error: "No image uploaded" });
        }
        const { item_name, item_category, item_desc, found_location, date_found } = req.body;
        const itemPicture = req.files.img.data;
        const type = req.files.img.mimetype;
        const userId = req.user.id;
        const item_status = "found";

        await db.query("INSERT INTO reported_items (user_id, item_name, category, description, location, incident_date, status, img, mimetype) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)",
            [userId, item_name, item_category, item_desc, found_location, date_found, item_status, itemPicture, type]);

        res.send("success");
    } catch (err) {
        console.log("Error report find Items: ", err);
        res.status(500).json({ error: "Failed to submit report" });
    }
});

export default router;