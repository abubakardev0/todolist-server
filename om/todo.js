import { Entity, Schema } from "redis-om";
import client from "./client.js";

class Todo extends Entity {}

const todoSchema = new Schema(
  Todo,
  {
    task: { type: "string" },
    completed: { type: "boolean" },
    completed_at: { type: "date" },
    created_at: { type: "date" },
  },
  {
    dataStructure: "JSON",
  }
);

export const todoRepository = client.fetchRepository(todoSchema);
await todoRepository.createIndex();
