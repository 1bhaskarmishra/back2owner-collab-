import express from 'express';
import db from "../db.js";
const router = express.Router();

/* delete report */
// router.post("/delete-item/:id", async (req, res) => {
//     if (!req.isAuthenticated()) return res.redirect('/login');
//
//     const itemId = req.params.id;
//     const userId = req.user.id;
//
//     try {
//         // Start a Transaction
//         await db.query('BEGIN');
//
//         // 1. Copy the item to the archived_items table
//         const archiveQuery = `
//             INSERT INTO archived_items (id, user_id, item_name, category, description, location, incident_date, status, created_at, img, mimetype )
//             SELECT id, user_id, item_name, category, description, location, incident_date, status, created_at, img, mimetype
//             FROM reported_items
//             WHERE id = $1 AND user_id = $2
//         `;
//         const archiveResult = await db.query(archiveQuery, [itemId, userId]);
//
//         // Check if the item actually existed and belonged to the user
//         if (archiveResult.rowCount === 0) {
//             await db.query('ROLLBACK'); // Cancel everything
//             req.flash("error", "Item not found or unauthorized.");
//             return res.redirect("/dashboard");
//         }
//
//         // 2. Now delete it from the main items table
//         await db.query("DELETE FROM reported_items WHERE id = $1", [itemId]);
//
//         // Commit the Transaction
//         await db.query('COMMIT');
//
//         req.flash("success", "Item deleted successfully.");
//         res.redirect("/dashboard");
//
//     } catch (err) {
//         await db.query('ROLLBACK'); // Cancel on error
//         console.error("Delete Error:", err);
//         res.status(500).send("Internal Server Error");
//     }
// });

router.post("/resolve-item/:id", async (req, res) => {
    if (!req.isAuthenticated()) return res.redirect('/login');

    const itemId = req.params.id;
    const userId = req.user.id;

    try {
        await db.query('BEGIN');

        // 1. Copy the current state to archived_items
        // We add 'resolved' as a note or use the current status
        const archiveQuery = `
            INSERT INTO archived_items (id, user_id, item_name, category, description, location, incident_date, status, created_at, img, mimetype)
            SELECT id, user_id, item_name, category, description, location, incident_date, status, created_at, img, mimetype
            FROM reported_items
            WHERE id = $1 AND user_id = $2
        `;
        const archiveResult = await db.query(archiveQuery, [itemId, userId]);

        if (archiveResult.rowCount === 0) {
            await db.query('ROLLBACK');
            req.flash("error", "Item not found.");
            return res.redirect("/dashboard");
        }

        // 2. Update the status in the main items table
        await db.query(
            "UPDATE reported_items SET status = 'RESOLVED' WHERE id = $1",
            [itemId]
        );

        await db.query('COMMIT');
        req.flash("success", "Item marked as Resolved and archived!");
        res.redirect("/dashboard");

    } catch (err) {
        await db.query('ROLLBACK');
        console.error("Resolve Error:", err);
        res.status(500).send("Internal Server Error");
    }
});

export default router;
