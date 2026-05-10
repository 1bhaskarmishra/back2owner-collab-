import express from 'express';
import db from "../db.js";
const router = express.Router();

/* GET item-details page. */
router.get('/item-detail/:id', async function (req, res, next) {
    const itemId = req.params.id;

    try {
        const sql = `
            SELECT users.name,
                   reported_items.id,
                   reported_items.user_id,
                   reported_items.item_name,
                   reported_items.category,
                   reported_items.description,
                   reported_items.location,
                   reported_items.incident_date,
                   reported_items.status,
                   reported_items.img,
                   reported_items.mimetype 
            FROM users 
            INNER JOIN reported_items ON users.id = reported_items.user_id 
            WHERE reported_items.id = $1;
        `;

        const result = await db.query(sql, [itemId]);

        if (result.rows.length === 0) {
            return res.status(404).send("Item not found");
        }

        res.render('item-detail.ejs', {
            item: result.rows[0],
            isLoggedIn: req.isAuthenticated(),
            user: req.user || null
        });

    } catch (err) {
        console.error("Database query failed:", err);
        res.status(500).send("Error loading item details");
    }
});

export default router;
