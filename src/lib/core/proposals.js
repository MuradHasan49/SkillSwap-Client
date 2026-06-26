import { getDb } from "../db";
import { ObjectId } from "mongodb";

export async function createProposal(data) {
  const db = await getDb();
  // Check if freelancer already proposed
  const existing = await db.collection("proposals").findOne({ task_id: data.task_id, freelancer_email: data.freelancer_email });
  if (existing) throw new Error("You have already submitted a proposal for this task.");

  const result = await db.collection("proposals").insertOne({
    ...data,
    status: "pending",
    submitted_at: new Date()
  });
  return result.insertedId.toString();
}

export async function getProposalsForTask(taskId) {
  const db = await getDb();
  const proposals = await db.collection("proposals").find({ task_id: taskId }).toArray();
  return proposals.map(p => ({ ...p, _id: p._id.toString() }));
}

export async function getProposalsByFreelancer(email) {
  const db = await getDb();
  const proposals = await db.collection("proposals").find({ freelancer_email: email }).toArray();
  return proposals.map(p => ({ ...p, _id: p._id.toString() }));
}

export async function updateProposalStatus(id, status) {
  const db = await getDb();
  await db.collection("proposals").updateOne(
    { _id: new ObjectId(id) },
    { $set: { status } }
  );
}

export async function rejectOtherProposals(taskId, acceptedProposalId) {
  const db = await getDb();
  await db.collection("proposals").updateMany(
    { task_id: taskId, _id: { $ne: new ObjectId(acceptedProposalId) } },
    { $set: { status: "rejected" } }
  );
}
