import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";
import fs from "fs";

// Load environment variables
dotenv.config();

const app = express();
const PORT = 3000;

// Set up server-side Gemini client
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      "User-Agent": "aistudio-build",
    },
  },
});

// Configure JSON payload limit (APKs could send listing metadata)
app.use(express.json({ limit: "15mb" }));

// 1. WhatsApp-style Chat Assistant Proxy
app.post("/api/gemini/chat", async (req, res) => {
  try {
    const { contactName, chatHistory, message } = req.body;
    
    const context = `You are simulated contact named "${contactName}" inside an Android WhatsApp/Messages app emulator. 
The user is sending you a message. Keep your response realistic, lively, human-like, and typical of a messaging conversation.
Keep your response short (under 2-3 sentences max) to fit standard phone panels. Do not use AI jargon or speak as a robot helper unless the contact is explicitly specified as a "Bot".
Here is the chat history:
${(chatHistory || []).map((h: any) => `${h.sender === "me" ? "User" : contactName}: ${h.text}`).join("\n")}
User says: "${message}"`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: context,
    });

    res.json({ reply: response.text?.trim() || "Received!" });
  } catch (error: any) {
    console.error("Gemini Chat Error:", error);
    res.status(500).json({ error: error.message });
  }
});

// 2. Simulated Web Browser Proxy
app.post("/api/gemini/browser", async (req, res) => {
  try {
    const { url } = req.body;
    
    const prompt = `You are a web proxy translator inside an Android emulator. The user typed the following URL in browser: "${url}".
Generate an aesthetically pleasing, simulated mockup of what this web address would render inside a mobile browser screen.
Provide the output as a beautiful, clean, structured webpage. Do not write full HTML tags like <head> or <body>, but render clean styled HTML tags with Tailwind utility classes inside. Write a header bar, a search bar or navigation container, and interesting read-worthy articles, images (use placeholder Unsplash links if needed), lists, cards or inputs. Make sure it matches the theme of ${url}!
For example:
- If it's wikipedia.org, show a beautiful mobile encyclopedic article with references and side panels.
- If it's a news site, show recent breaking stories, tags, and headlines.
- If it's a social feed, show profile pictures, posts with likes, comments, and action buttons.
Provide ONLY the HTML code wrapped inside a parent <div>. Keep it fully self-contained and ready to render directly inside a div.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
    });

    res.json({ content: response.text?.trim() || "<div>Webpage loading error</div>" });
  } catch (error: any) {
    console.error("Gemini Browser Error:", error);
    res.status(500).json({ error: error.message });
  }
});

// 3. AI-Powered APK Emulator Synthesis Engine
app.post("/api/gemini/app-generator", async (req, res) => {
  try {
    const { apkName, fileList, size } = req.body;

    const fileListShortened = (fileList || []).slice(0, 50).join("\n");
    const prompt = `You are the core emulator compiler for an Android web simulator.
A user has uploaded/installed an APK named "${apkName}" (Size: ${(size / 1024 / 1024).toFixed(1)} MB).
Since we cannot execute native compilation of Dalvik or ARM bytecode in a web sandbox, we will "synthesize" a high-fidelity dynamic simulated React/HTML interface matching the purpose of this APK.

Look at the APK's name: "${apkName}" and study its probable purpose (e.g. calculator, task planner, custom game, messaging, fitness tracker, photo editor, music system).
Study this sample of internal files embedded inside the ZIP container:
${fileListShortened}

Now, synthesize a complete customized app schema that explains how we can interactively run this app in our widget container.

Your output must be a single valid JSON object following this exact schema. Do not output markdown decorators. Output ONLY JSON:
{
  "name": "Human-readable App Name",
  "packageName": "com.example.app",
  "themeColor": "#hex-color (a premium theme color fitting this app's vibe)",
  "iconName": "A valid Lucide icon name (e.g. Activity, Flame, Swords, MessageSquare, Compass, ShieldAlert, Sparkles, BookOpen, Music, Play, ShoppingCart, Target, Camera, Database, Eye)",
  "initialState": {
    "key": "initial_value",
    "score": "0",
    "logs": "System booted."
  },
  "screens": [
    {
      "title": "Main Screen Title",
      "elements": [
        {
          "type": "text | header | button | input | list | chart | image_placeholder_search",
          "id": "element_id",
          "label": "Human readable Text, button label or header title",
          "className": "Tailwind utility CSS classes for stunning, professional styling (e.g. text-white, px-4, rounded-xl etc)",
          "placeholder": "For inputs",
          "valueParam": "Which state key to bind this text's text/value (e.g. 'score' or 'logs')",
          "action": "setState | increment | appendLog | triggerAIAnswer",
          "actionTarget": "State key to update (e.g. 'score' or 'logs')",
          "actionValue": "Value to set or add",
          "items": [
             { "label": "List Option Label", "value": "some_val" }
          ]
        }
      ]
    }
  ]
}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      }
    });

    const parsedData = JSON.parse(response.text?.trim() || "{}");
    res.json(parsedData);
  } catch (error: any) {
    console.error("Gemini App-Generator Error:", error);
    res.status(500).json({ error: error.message });
  }
});

// Configure Vite integration
async function startServer() {
  console.log(`[SYS] Starting server. Current NODE_ENV: "${process.env.NODE_ENV}"`);
  
  const distPath = path.join(process.cwd(), "dist");
  const hasDist = fs.existsSync(path.join(distPath, "index.html"));
  
  // Launch Vite if we explicitly request development, or if physical static outputs are absent
  if (process.env.NODE_ENV !== "production" || !hasDist) {
    console.log(`[SYS] Booting Dynamic Vite Express Middleware. (Missing static build or in DEV mode)`);
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    console.log(`[SYS] Serving production compiled web bundles from directory: "${distPath}"`);
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
