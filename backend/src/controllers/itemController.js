const pool = require("../db");

// Get all items
const getItems = async (req, res, next) => {
    try {
        const result = await pool.query("SELECT * FROM items");
        res.status(200).json({
            success: true,
            count: result.rows.length,
            data: result.rows,
        });
    } catch (error) {
        next(error);
    }
};

const createItems = async (req, res, next) => {
    try {
        const name = typeof req.body?.name === "string" ? req.body.name.trim() : req.body?.name;
        const result = await pool.query("INSERT INTO items (name) VALUES ($1) RETURNING *", [name]);
        res.status(201).json({
            success: true,
            data: result.rows[0],
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getItems,
    createItems
};
