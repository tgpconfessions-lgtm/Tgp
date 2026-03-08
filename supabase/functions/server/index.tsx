import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import * as kv from "./kv_store.tsx";
const app = new Hono();

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Health check endpoint
app.get("/make-server-521197c9/health", (c) => {
  return c.json({ status: "ok" });
});

// Get statistics (total confessions and visitors)
app.get("/make-server-521197c9/api/stats", async (c) => {
  try {
    const confessions = await kv.getByPrefix("confession_");
    const stats = await kv.get("site_stats");
    
    const totalConfessions = confessions.length;
    const totalVisitors = stats?.visitors || 0;

    return c.json({
      success: true,
      totalConfessions,
      totalVisitors,
    });
  } catch (error) {
    console.error("Error fetching stats:", error);
    return c.json({ error: "Failed to fetch stats" }, 500);
  }
});

// Track visitor
app.post("/make-server-521197c9/api/track-visitor", async (c) => {
  try {
    const stats = await kv.get("site_stats") || { visitors: 0 };
    stats.visitors = (stats.visitors || 0) + 1;
    await kv.set("site_stats", stats);

    return c.json({ success: true, visitors: stats.visitors });
  } catch (error) {
    console.error("Error tracking visitor:", error);
    return c.json({ error: "Failed to track visitor" }, 500);
  }
});

// Submit confession endpoint
app.post("/make-server-521197c9/api/confess", async (c) => {
  try {
    const body = await c.req.json();
    const { name, confession } = body;

    if (!confession || confession.trim() === "") {
      return c.json({ error: "Confession is required" }, 400);
    }

    // Generate unique ID for the confession
    const confessionId = `confession_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    
    // Store the confession with name and timestamp
    const confessionData = {
      id: confessionId,
      name: name || "Anonymous",
      confession: confession.trim(),
      timestamp: new Date().toISOString(),
      reviewed: false,
    };

    await kv.set(confessionId, confessionData);

    console.log(`New confession submitted: ${confessionId}`);
    
    return c.json({ 
      success: true,
      message: "✅ Thank you for your confession. Your message has been sent anonymously." 
    });
  } catch (error) {
    console.error("Error submitting confession:", error);
    return c.json({ error: "Failed to submit confession" }, 500);
  }
});

// Admin login endpoint
app.post("/make-server-521197c9/api/admin/login", async (c) => {
  try {
    const body = await c.req.json();
    const { username, password } = body;

    // Simple authentication - in production, use proper password hashing
    const ADMIN_USERNAME = "admin";
    const ADMIN_PASSWORD = "tgpconfessions2026"; // Change this to a secure password

    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      // Generate a simple session token
      const sessionToken = `session_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
      
      // Store session
      await kv.set(`session_${sessionToken}`, {
        username,
        createdAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours
      });

      return c.json({
        success: true,
        token: sessionToken,
        message: "Login successful",
      });
    } else {
      return c.json({ error: "Invalid username or password" }, 401);
    }
  } catch (error) {
    console.error("Error during login:", error);
    return c.json({ error: "Login failed" }, 500);
  }
});

// Verify admin session middleware
const verifyAdminSession = async (token: string) => {
  if (!token) return false;
  
  const session = await kv.get(`session_${token}`);
  if (!session) return false;
  
  // Check if session is expired
  const expiresAt = new Date(session.expiresAt).getTime();
  if (Date.now() > expiresAt) {
    await kv.del(`session_${token}`);
    return false;
  }
  
  return true;
};

// Admin endpoint to get all confessions
app.get("/make-server-521197c9/api/admin/confessions", async (c) => {
  try {
    const token = c.req.header("X-Admin-Token");
    const isValid = await verifyAdminSession(token || "");
    
    if (!isValid) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    // Get all confessions from the key-value store
    const confessions = await kv.getByPrefix("confession_");
    
    // Sort by timestamp (newest first)
    const sortedConfessions = confessions.sort((a, b) => {
      const timeA = new Date(a.timestamp || 0).getTime();
      const timeB = new Date(b.timestamp || 0).getTime();
      return timeB - timeA;
    });

    return c.json({ 
      success: true,
      confessions: sortedConfessions,
      count: sortedConfessions.length
    });
  } catch (error) {
    console.error("Error fetching confessions:", error);
    return c.json({ error: "Failed to fetch confessions" }, 500);
  }
});

// Admin endpoint to delete a confession
app.delete("/make-server-521197c9/api/admin/confessions/:id", async (c) => {
  try {
    const token = c.req.header("X-Admin-Token");
    const isValid = await verifyAdminSession(token || "");
    
    if (!isValid) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const confessionId = c.req.param("id");
    await kv.del(confessionId);

    console.log(`Confession deleted: ${confessionId}`);
    
    return c.json({ 
      success: true,
      message: "Confession deleted successfully"
    });
  } catch (error) {
    console.error("Error deleting confession:", error);
    return c.json({ error: "Failed to delete confession" }, 500);
  }
});

// Admin endpoint to mark confession as reviewed
app.put("/make-server-521197c9/api/admin/confessions/:id/review", async (c) => {
  try {
    const token = c.req.header("X-Admin-Token");
    const isValid = await verifyAdminSession(token || "");
    
    if (!isValid) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const confessionId = c.req.param("id");
    const confession = await kv.get(confessionId);
    
    if (!confession) {
      return c.json({ error: "Confession not found" }, 404);
    }

    confession.reviewed = !confession.reviewed;
    await kv.set(confessionId, confession);

    console.log(`Confession review status updated: ${confessionId} - ${confession.reviewed}`);
    
    return c.json({ 
      success: true,
      reviewed: confession.reviewed,
      message: "Confession review status updated"
    });
  } catch (error) {
    console.error("Error updating confession review status:", error);
    return c.json({ error: "Failed to update confession" }, 500);
  }
});

Deno.serve(app.fetch);