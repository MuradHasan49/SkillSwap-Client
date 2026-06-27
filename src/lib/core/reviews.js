import { getDb } from "../db";
import { ObjectId } from "mongodb";

export async function createReview(data) {
  const db = await getDb();
  
  // Prevent duplicate reviews for the same task by the same client
  const existing = await db.collection("reviews").findOne({ 
    task_id: data.task_id, 
    client_email: data.client_email 
  });
  
  if (existing) {
    throw new Error("You have already submitted a review for this task.");
  }

  const result = await db.collection("reviews").insertOne({
    ...data,
    createdAt: new Date()
  });
  
  return result.insertedId.toString();
}

export async function getFreelancerReviews(freelancerEmail) {
  const db = await getDb();
  const reviews = await db.collection("reviews")
    .find({ freelancer_email: freelancerEmail })
    .sort({ createdAt: -1 })
    .toArray();
    
  return reviews.map(r => ({ ...r, _id: r._id.toString() }));
}

export async function getClientTaskReviews(clientEmail) {
  const db = await getDb();
  const reviews = await db.collection("reviews")
    .find({ client_email: clientEmail })
    .project({ task_id: 1, rating: 1 })
    .toArray();
    
  return reviews.map(r => ({ ...r, _id: r._id.toString() }));
}

export async function getFreelancerRatings() {
  const db = await getDb();
  
  const pipeline = [
    {
      $group: {
        _id: "$freelancer_email",
        averageRating: { $avg: "$rating" },
        reviewCount: { $sum: 1 }
      }
    }
  ];
  
  const ratings = await db.collection("reviews").aggregate(pipeline).toArray();
  
  const ratingsMap = {};
  ratings.forEach(r => {
    ratingsMap[r._id] = {
      averageRating: parseFloat(r.averageRating.toFixed(1)),
      reviewCount: r.reviewCount
    };
  });
  
  return ratingsMap;
}
