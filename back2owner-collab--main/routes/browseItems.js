import express from 'express';
import db from "../db.js";

const router = express.Router();

/* GET browse-item page. */
router.get('/browseitem', async (req, res) => {
    try {

        const result = await db.query("SELECT * FROM reported_items");
        const items = result.rows;

        res.render('browseitem.ejs', {
            items: items,
            isLoggedIn: req.isAuthenticated(),
            user: req.user || null
        });
    } catch (err) {
        console.error(err);
        res.status(500).send("Server Error");
    }
});

export default router;