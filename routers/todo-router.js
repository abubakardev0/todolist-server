import { Router } from "express";
import { todoRepository } from "../om/todo.js";

export const router = Router();

router.get("/", async (req, res) => {
  try {
    const todos = await todoRepository
      .search()
      .sortBy("completed", "DESC")
      .returnAll();
    if (todos.length === 0) {
      res.sendStatus(204);
    } else {
      res.status(200).json(todos);
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/", async (req, res) => {
  const { task, completed, created_at, completed_at } = req.body;
  const trimmedTask = task.trim();
  if (!trimmedTask) {
    res.status(400).json({ message: "Make sure your todo task is valid!" });
  } else {
    try {
      await todoRepository.createAndSave({
        task: trimmedTask,
        completed: completed ?? false,
        created_at: created_at ?? new Date(),
        completed_at: completed_at ?? null,
      });
      res.sendStatus(201);
    } catch (err) {
      res.status(500).json({ message: "Error while creating a todo task!" });
    }
  }
});

router.delete("/:id", async (req, res) => {
  const entityId = req.params.id;
  if (!entityId) {
    res.status(400).json({ message: "Todo task id not found!" });
  } else {
    try {
      await todoRepository.remove(entityId);
      res.sendStatus(204);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
});

router.patch("/:id", async (req, res) => {
  const entityId = req.params.id;
  const status = req.body.status;
  if (!entityId) {
    res.status(400).json({ message: "Todo task id not found!" });
  } else if (
    typeof status !== "boolean" ||
    status === null ||
    status === undefined
  ) {
    res.status(400).json({ message: "Unable to find your todo task status!" });
  } else {
    try {
      const todo = await todoRepository.fetch(entityId);
      todo.completed = status;
      if (status === true) {
        todo.completed_at = new Date();
      } else {
        todo.completed_at = null;
      }
      await todoRepository.save(todo);
      res.sendStatus(200);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
});
