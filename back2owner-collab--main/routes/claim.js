import express from 'express';
import db from "../db.js";
const router = express.Router();

function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }

    req.session.redirectTo = req.originalUrl;

    res.redirect('/login');
}

router.post('/claim-item', checkAuthenticated, async (req, res) => {
    const { itemId, name, contact, message } = req.body;
    const senderId = req.user.id; // The logged-in person claiming it

    try {
        // 1. Find who posted the item
        const itemData = await db.query("SELECT user_id, item_name FROM reported_items WHERE id = $1", [itemId]);
        const item = itemData.rows[0];

        // 2. Format the message with the finder's details
        const formattedMessage = `
            <strong>New Claim Request!</strong><br>
            <strong>Claimer:</strong> ${name}<br>
            <strong>Contact:</strong> ${contact}<br>
            <strong>Message:</strong> ${message}
        `;

        // 3. Save to database
        await db.query(
            `INSERT INTO notifications (recipient_id, sender_id, item_id, message) 
             VALUES ($1, $2, $3, $4)`,
            [item.user_id, senderId, itemId, formattedMessage]
        );

        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ success: false });
    }
});

export default router;