import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "./src/db/models/user.model.js";
import Post from "./src/db/models/post.model.js";
import Comment from "./src/db/models/comments.model.js";

const MONGO_URL = process.env.MONGO_URL || "mongodb://127.0.0.1:27017/socialmedia";

const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const hashPwd = (pwd) => bcrypt.hashSync(pwd, 8);

const postContents = [
    "Just had the best coffee of my life ☕",
    "Working on a new project — excited to share soon!",
    "Beautiful sunset today 🌅",
    "Anyone else think GraphQL is just superior? 🚀",
    "Throwback to last summer's road trip 🚗",
    "Finally finished reading that book. 10/10 recommend.",
    "Monday motivation: keep pushing 💪",
    "Just deployed my first Node.js app to production!",
    "Hot take: tabs > spaces. Fight me.",
    "Weekend vibes only 🎶",
    "New blog post is live — link in bio",
    "Learning something new every single day",
    "Grateful for the small things 🙏",
    "Who else is staying up way too late coding?",
    "Open source contribution done for the day ✅",
];

const commentContents = [
    "Totally agree! 🔥",
    "This is amazing, thanks for sharing.",
    "Could not have said it better myself.",
    "Love this content, keep it up!",
    "Interesting perspective 🤔",
    "First! 🎉",
    "This made my day 😄",
    "Where did you find this?",
    "Saving this for later.",
    "Underrated post right here.",
    "100% facts.",
    "This is so relatable 😂",
    "Great work, well done!",
    "I had the same experience last week.",
    "Sharing this with my friends.",
];

async function seed() {
    await mongoose.connect(MONGO_URL);
    console.log("✅ Connected to DB");

    await Promise.all([
        User.deleteMany({}),
        Post.deleteMany({}),
        Comment.deleteMany({}),
    ]);
    console.log("🗑️  Cleared existing data");

    // ── 20 users ──────────────────────────────────────────────────────────────
    const hashedPwd = hashPwd("Password@123");
    const userDocs = Array.from({ length: 20 }, (_, i) => ({
        userName: `user_${i + 1}`,
        email: `user${i + 1}@test.com`,
        password: hashedPwd,
        ConfirmPassword: hashedPwd,
        phoneNumber: `+1${String(5550001000 + i)}`,
        gender: pick(["male", "female"]),
        role: i === 0 ? "admin" : "user",
        isConfirmed: true,
        isDeleted: false,
    }));

    const users = await User.insertMany(userDocs);
    console.log(`👤 Created ${users.length} users`);
    const userIds = users.map((u) => u._id);

    // ── 40 posts (2 per user) ─────────────────────────────────────────────────
    const postDocs = users.flatMap((user) =>
        Array.from({ length: 2 }, () => ({
            content: pick(postContents),
            createdBy: user._id,
            likes: userIds.slice(0, rand(0, 10)),
            comments: [],
            isDeleted: false,
        }))
    );

    const posts = await Post.insertMany(postDocs);
    console.log(`📝 Created ${posts.length} posts`);

    // ── comments + replies ────────────────────────────────────────────────────
    const allComments = [];

    for (const post of posts) {
        const postCommentDocs = Array.from({ length: rand(3, 6) }, () => ({
            content: pick(commentContents),
            createdBy: pick(userIds),
            likes: userIds.slice(0, rand(0, 5)),
            refId: post._id,
            onModel: "post",
            isDeleted: false,
        }));

        const postComments = await Comment.insertMany(postCommentDocs);
        await Post.findByIdAndUpdate(post._id, {
            $push: { comments: { $each: postComments.map((c) => c._id) } },
        });

        for (const parent of postComments) {
            const replyDocs = Array.from({ length: rand(1, 2) }, () => ({
                content: pick(commentContents),
                createdBy: pick(userIds),
                likes: userIds.slice(0, rand(0, 3)),
                refId: parent._id,
                onModel: "comment",
                isDeleted: false,
            }));
            allComments.push(...(await Comment.insertMany(replyDocs)));
        }

        allComments.push(...postComments);
    }

    console.log(`💬 Created ${allComments.length} comments (including replies)`);

    // ── viewer history ────────────────────────────────────────────────────────
    for (const user of users) {
        const viewers = userIds
            .filter((id) => !id.equals(user._id))
            .slice(0, rand(2, 6))
            .map((id) => ({ _id: id, time: [new Date()] }));
        await User.findByIdAndUpdate(user._id, { $set: { viwers: viewers } });
    }

    console.log("👁️  Added viewer history to users");
    console.log("\n✅ Seed complete!");
    console.log("   Users: user1@test.com … user20@test.com");
    console.log("   Password: Password@123");

    await mongoose.disconnect();
}

seed().catch((err) => {
    console.error("❌ Seed failed:", err);
    mongoose.disconnect();
    process.exit(1);
});