import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { admin, jwt } from "better-auth/plugins";
import { MongoClient } from "mongodb";

const client = new MongoClient(process.env.MONGODB_URI);
// await client.connect();
const db = client.db("SkillSwap");

export const auth = betterAuth({
  database: mongodbAdapter(db, {
    // Optional: if you don't provide a client, database transactions won't be enabled.
    client,
  }),
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    },
  },
  // baseURL: process.env.BETTER_AUTH_URL,
  secret: process.env.BETTER_AUTH_SECRET,
  baseURL: process.env.BETTER_AUTH_URL,
  trustedOrigins: ["http://localhost:3000"],

  user: {
    additionalFields: {
      initialRole: {
        type: "string",
        required: false,
      },
      isBlocked: {
        type: "boolean",
        required: false,
        default: false,
      },
      skills: {
        type: "string", // store as JSON string or comma-separated
        required: false,
      },
      bio: {
        type: "string",
        required: false,
      },
      hourlyRate: {
        type: "number",
        required: false,
      }
    },
  },
  databaseHooks: {
    user: {
      create: {
        before: async (user) => {
          if (user.initialRole) {
            user.role = user.initialRole;
          } else {
            user.role = "client";
          }
          return { data: user };
        },
      },
    },
  },
  session: {
    cookieCache: {
      enabled: true,
      strategy: "jwt",
      maxAge: 60 * 24 * 30, // 30 days
    },
  },
  plugins: [admin(), jwt()],
});
