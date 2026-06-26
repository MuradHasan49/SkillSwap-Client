import { getDb } from "../db";
import { ObjectId } from "mongodb";

export async function getTasks(query = {}, page = 1, limit = 9) {
  const db = await getDb();
  const skip = (page - 1) * limit;
  
  const tasks = await db.collection("tasks")
    .find(query)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .toArray();
    
  const total = await db.collection("tasks").countDocuments(query);
  
  return {
    tasks: tasks.map(t => ({ ...t, _id: t._id.toString() })),
    total,
    page,
    totalPages: Math.ceil(total / limit)
  };
}

export async function getTaskById(id) {
  const db = await getDb();
  try {
    const task = await db.collection("tasks").findOne({ _id: new ObjectId(id) });
    return task ? { ...task, _id: task._id.toString() } : null;
  } catch (e) {
    return null;
  }
}

export async function createTask(taskData) {
  const db = await getDb();
  const result = await db.collection("tasks").insertOne({
    ...taskData,
    status: "open",
    createdAt: new Date()
  });
  return result.insertedId.toString();
}

export async function updateTaskStatus(id, status, extraFields = {}) {
  const db = await getDb();
  await db.collection("tasks").updateOne(
    { _id: new ObjectId(id) },
    { $set: { status, ...extraFields } }
  );
}

export async function deleteTask(id, clientEmail) {
  const db = await getDb();
  // Check if proposal accepted, if not allow deletion
  const query = { _id: new ObjectId(id) };
  if (clientEmail) query.client_email = clientEmail;
  
  const proposals = await db.collection("proposals").findOne({ task_id: id, status: "accepted" });
  if (proposals) throw new Error("Cannot delete task with accepted proposals.");
  
  await db.collection("tasks").deleteOne(query);
}
