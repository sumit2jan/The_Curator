require("dotenv").config();

const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(
    process.env.GEMINI_API_KEY
);

const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash-lite",
});

module.exports = model;

//"gemini-2.0-flash
// 🔥 RECOMMENDED for tera blog project
// model: "gemini-2.5-flash"       // Best balance — fast + smart ✅
// model: "gemini-2.5-flash-lite"  // Fastest, cheapest, high volume ke liye
// model: "gemini-2.5-pro"         // Most powerful (complex tasks)

// // Older but still work
// model: "gemini-2.0-flash"   



// // 🥇 BEST — Gemini 3 Flash (latest, smartest free model)
// model: "gemini-3-flash-preview"

// // 🥈 Budget — Gemini 3.1 Flash Lite (sabse fast, high volume)
// model: "gemini-3.1-flash-lite-preview"

// // 🥉 Stable — Gemini 2.5 Flash (reliable, production ready)
// model: "gemini-2.5-flash"

// // Gemini 2.5 Flash Lite (lightest stable)
// model: "gemini-2.5-flash-lite"