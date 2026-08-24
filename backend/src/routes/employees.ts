import { Router, Request, Response } from "express";
import { pool } from "../db";
import { requireAuth } from "../auth/middleware";

const router = Router();

// GET /api/employees — list all employees for the logged-in user
router.get("/", requireAuth, async (req: Request, res: Response) => {
  const result = await pool.query(
    "SELECT id, name, wage_amount, wage_type FROM employees WHERE user_id = $1 ORDER BY name ASC",
    [req.userId],
  );
  res.json(result.rows);
});

// POST /api/employees — add a new employee
router.post("/", requireAuth, async (req: Request, res: Response) => {
  const { name, wageAmount, wageType } = req.body;

  if (!name || !wageAmount || !wageType) {
    return res
      .status(400)
      .json({ error: "Name, wage amount, and wage type are required" });
  }

  if (wageType !== "hourly" && wageType !== "yearly") {
    return res
      .status(400)
      .json({ error: "Wage type must be hourly or yearly" });
  }

  const result = await pool.query(
    `INSERT INTO employees (user_id, name, wage_amount, wage_type)
     VALUES ($1, $2, $3, $4)
     RETURNING id, name, wage_amount, wage_type`,
    [req.userId, name, wageAmount, wageType],
  );

  res.status(201).json(result.rows[0]);
});

// PUT /api/employees/:id — edit an existing employee
router.put("/:id", requireAuth, async (req: Request, res: Response) => {
  const { name, wageAmount, wageType } = req.body;
  const employeeId = req.params.id;

  if (!name || !wageAmount || !wageType) {
    return res
      .status(400)
      .json({ error: "Name, wage amount, and wage type are required" });
  }

  const result = await pool.query(
    `UPDATE employees SET name = $1, wage_amount = $2, wage_type = $3
     WHERE id = $4 AND user_id = $5
     RETURNING id, name, wage_amount, wage_type`,
    [name, wageAmount, wageType, employeeId, req.userId],
  );

  if (result.rows.length === 0) {
    return res.status(404).json({ error: "Employee not found" });
  }

  res.json(result.rows[0]);
});

// DELETE /api/employees/:id — remove an employee
router.delete("/:id", requireAuth, async (req: Request, res: Response) => {
  const employeeId = req.params.id;

  const result = await pool.query(
    "DELETE FROM employees WHERE id = $1 AND user_id = $2 RETURNING id",
    [employeeId, req.userId],
  );

  if (result.rows.length === 0) {
    return res.status(404).json({ error: "Employee not found" });
  }

  res.status(200).json({ message: "Employee deleted" });
});

export default router;
