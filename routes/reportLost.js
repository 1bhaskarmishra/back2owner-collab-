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


router.get('/report-lost', checkAuthenticated, (req, res) => {
    res.render('report-lost.ejs', {user: req.user});
});

router.post("/report-lost", async (req, res) => {
    try {
        if (!req.files || !req.files.img) {
            return res.status(400).json({ error: "No image uploaded" });
        }
        const { item_name, item_category, item_desc, lost_location, lost_date } = req.body;
        const itemPicture = req.files.img.data;
        const imageType = req.files.img.mimetype;
        const userId = req.user.id;
        const item_status = "lost"

        await db.query("INSERT INTO reported_items (user_id, item_name, category, description, location, incident_date, img, mimetype, status) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)",
            [userId, item_name, item_category, item_desc, lost_location, lost_date, itemPicture, imageType, item_status]);

        res.send("success");
    } catch (err) {
        console.log("Error report find Items: ", err);
        res.status(500).json({ error: "Failed to submit report" });
    }
});

export default router;