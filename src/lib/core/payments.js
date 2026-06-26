import { getDb } from "../db";

export async function createPayment(data) {
  const db = await getDb();
  const result = await db.collection("payments").insertOne({
    ...data,
    paid_at: new Date()
  });
  return result.insertedId.toString();
}

export async function getAllPayments() {
  const db = await getDb();
  const payments = await db.collection("payments").find({}).sort({ paid_at: -1 }).toArray();
  return payments.map(p => ({ ...p, _id: p._id.toString() }));
}

export async function getPaymentsByFreelancer(email) {
  const db = await getDb();
  const payments = await db.collection("payments").find({ freelancer_email: email }).sort({ paid_at: -1 }).toArray();
  return payments.map(p => ({ ...p, _id: p._id.toString() }));
}
