import express from 'express';
import db from "../db.js";
const router = express.Router();

/* GET home page. */
router.get('/', async function (req, res, next) {
  try {
    const result = await db.query(`
      SELECT *
      FROM reported_items
      ORDER BY created_at DESC
      LIMIT 5
    `);
    console.log(result.rows);
    res.render('index.ejs', { items:result.rows, isLoggedIn: req.isAuthenticated(), user: req.user || null})
  } catch (err) {
    console.error("Database query failed:", err);
    res.render("index.ejs", {
      items: [],
      isLoggedIn: req.isAuthenticated(),
      user: req.user || null,
      dbError: true
    });
  }
});

export default router;
