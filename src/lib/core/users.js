import { getDb } from "../db";

export async function getFreelancers() {
  const db = await getDb();
  const users = await db.collection("user")
    .find({ role: "freelancer", isBlocked: { $ne: true } })
    .project({ password: 0 })
    .toArray();
    
  return users.map(u => ({ ...u, _id: u._id.toString() }));
}

export async function getFreelancerByEmail(email) {
  const db = await getDb();
  const user = await db.collection("user").findOne({ email, role: "freelancer" }, { projection: { password: 0 } });
  return user ? { ...user, _id: user._id.toString() } : null;
}

export async function updateFreelancerProfile(email, data) {
  const db = await getDb();
  await db.collection("user").updateOne({ email }, { $set: data });
}

export async function getAllUsers() {
  const db = await getDb();
  const users = await db.collection("user").find({}).project({ password: 0 }).toArray();
  return users.map(u => ({ ...u, _id: u._id.toString() }));
}

export async function toggleUserBlock(email, isBlocked) {
  const db = await getDb();
  await db.collection("user").updateOne({ email }, { $set: { isBlocked } });
}
