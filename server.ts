import express from "express";
import { createServer as createViteServer } from "vite";
import { WebSocketServer, WebSocket } from "ws";
import { createServer } from "http";
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());
const server = createServer(app);
const wss = new WebSocketServer({ server });
const PORT = 3000;

// Supabase Setup
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("-------------------------------------------------------------------");
  console.error("❌ CRITICAL ERROR: Supabase configuration is missing!");
  console.error("Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in AI Studio.");
  console.error("Refer to the setup instructions in the chat for details.");
  console.error("-------------------------------------------------------------------");
}

const supabase = createClient(
  supabaseUrl || "https://placeholder-url.supabase.co", 
  supabaseKey || "placeholder-key"
);

const ADMIN_TOKEN = process.env.ADMIN_SIGNUP_TOKEN || "nexus-admin-2024";

// WebSocket handling
wss.on("connection", async (ws) => {
  console.log("Client connected");

  // Fetch initial state from Supabase
  const { data: tickets } = await supabase.from('tickets').select('*').order('created_at', { ascending: false });
  const { data: technicians } = await supabase.from('technicians').select('*');

  ws.send(JSON.stringify({ 
    type: "init", 
    data: { 
      tickets: tickets || [], 
      technicians: technicians || [] 
    } 
  }));

  ws.on("message", async (message) => {
    try {
      const { type, data } = JSON.parse(message.toString());

      switch (type) {
        case "ticket:create":
          const { data: newTicket, error: createError } = await supabase
            .from('tickets')
            .insert([{
              customer: data.customer,
              service: data.service,
              description: data.description,
              priority: data.priority,
              status: 'Pending',
              date: data.date
            }])
            .select()
            .single();
          
          if (newTicket) broadcast({ type: "ticket:created", data: newTicket });
          break;

        case "ticket:update":
          const { data: updatedTicket } = await supabase
            .from('tickets')
            .update(data)
            .eq('id', data.id)
            .select()
            .single();
          
          if (updatedTicket) broadcast({ type: "ticket:updated", data: updatedTicket });
          break;

        case "technician:status":
          const { data: updatedTech } = await supabase
            .from('technicians')
            .update(data)
            .eq('id', data.id)
            .select()
            .single();
          
          if (updatedTech) broadcast({ type: "technician:updated", data: updatedTech });
          break;

        case "technician:create":
          const { data: newTech } = await supabase
            .from('technicians')
            .insert([{
              name: data.name,
              specialty: data.specialty,
              status: 'Idle',
              load: 0
            }])
            .select()
            .single();
          
          if (newTech) broadcast({ type: "technician:created", data: newTech });
          break;

        case "technician:delete":
          const { error: deleteError } = await supabase
            .from('technicians')
            .delete()
            .eq('id', data.id);
          
          if (!deleteError) broadcast({ type: "technician:deleted", data: { id: data.id } });
          break;
      }
    } catch (err) {
      console.error("Failed to process message", err);
    }
  });
});

function broadcast(message: any) {
  const payload = JSON.stringify(message);
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(payload);
    }
  });
}

// API routes
app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

app.post("/api/auth/signup", async (req, res) => {
  const { email, password, role, adminToken, fullName } = req.body;

  if (role === 'admin' && adminToken !== ADMIN_TOKEN) {
    return res.status(403).json({ error: "Invalid admin signup token" });
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
        role: role
      }
    }
  });

  if (error) return res.status(400).json({ error: error.message });
  
  // Create profile in public.profiles table
  if (data.user) {
    await supabase.from('profiles').insert([
      { id: data.user.id, full_name: fullName, role: role }
    ]);
  }

  res.json({ user: data.user });
});

async function startServer() {
  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static("dist"));
  }

  server.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
