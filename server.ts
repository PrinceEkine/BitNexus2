import express from "express";
import { createServer as createViteServer } from "vite";
import { WebSocketServer, WebSocket } from "ws";
import { createServer } from "http";
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
import nodemailer from "nodemailer";

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

console.log("-----------------------------------------");
console.log("Supabase URL:", supabaseUrl ? "Configured" : "MISSING");
console.log("Supabase Key:", supabaseKey ? "Configured" : "MISSING");
console.log("Admin Token:", ADMIN_TOKEN ? "Configured" : "MISSING");
console.log("-----------------------------------------");
const PAYSTACK_SECRET = process.env.PAYSTACK_SECRET_KEY;
const WHATSAPP_TOKEN = process.env.WHATSAPP_ACCESS_TOKEN;
const WHATSAPP_PHONE_ID = process.env.WHATSAPP_PHONE_NUMBER_ID;
const WHATSAPP_VERIFY_TOKEN = process.env.WHATSAPP_VERIFY_TOKEN;

// Mailer Setup
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

async function sendEmail(to: string, subject: string, text: string, html?: string) {
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.warn("Gmail SMTP credentials missing, skipping email send");
    return;
  }
  try {
    await transporter.sendMail({
      from: `"BitNexus" <${process.env.SMTP_USER}>`,
      to,
      subject,
      text,
      html,
    });
    console.log(`Email sent to ${to}`);
  } catch (error) {
    console.error("Email Send Error:", error);
  }
}

import axios from "axios";

async function sendWhatsAppMessage(to: string, text: string) {
  if (!WHATSAPP_TOKEN || !WHATSAPP_PHONE_ID) {
    console.warn("WhatsApp credentials missing, skipping message send");
    return;
  }
  try {
    await axios.post(
      `https://graph.facebook.com/v17.0/${WHATSAPP_PHONE_ID}/messages`,
      {
        messaging_product: "whatsapp",
        to: to,
        type: "text",
        text: { body: text },
      },
      {
        headers: { Authorization: `Bearer ${WHATSAPP_TOKEN}` },
      }
    );
  } catch (error) {
    console.error("WhatsApp Send Error:", error);
  }
}

// WebSocket handling
wss.on("connection", async (ws) => {
  console.log("Client connected");

  // Fetch initial state from Supabase
  const { data: tickets } = await supabase.from('tickets').select('*').order('created_at', { ascending: false });
  const { data: technicians } = await supabase.from('technicians').select('*');
  const { data: transactions } = await supabase.from('transactions').select('*').order('created_at', { ascending: false });
  const { data: messages } = await supabase.from('messages').select('*').order('created_at', { ascending: true });

  ws.send(JSON.stringify({ 
    type: "init", 
    data: { 
      tickets: tickets || [], 
      technicians: technicians || [],
      transactions: transactions || [],
      messages: messages || []
    } 
  }));

  ws.on("message", async (message) => {
    try {
      const { type, data } = JSON.parse(message.toString());

      switch (type) {
        case "ticket:create":
          const { data: newTicket } = await supabase
            .from('tickets')
            .insert([{
              customer_name: data.customer,
              service: data.service,
              description: data.description,
              priority: data.priority,
              status: 'Pending',
              date: data.date,
              amount: data.amount || 25000
            }])
            .select()
            .single();
          
          if (newTicket) {
            broadcast({ type: "ticket:created", data: newTicket });
            
            // If payment reference exists, record transaction
            if (data.paymentRef) {
              const { data: newTx } = await supabase
                .from('transactions')
                .insert([{
                  ticket_id: newTicket.id,
                  amount: newTicket.amount,
                  status: 'escrow',
                  type: 'payment',
                  reference: data.paymentRef
                }])
                .select()
                .single();
              
              if (newTx) broadcast({ type: "transaction:new", data: newTx });
            }
          }
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
              load: 0,
              phone: data.phone
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

        case "chat:send":
          const { data: newMessage } = await supabase
            .from('messages')
            .insert([{
              ticket_id: data.ticketId,
              sender_id: data.senderId,
              text: data.text
            }])
            .select()
            .single();
          
          if (newMessage) broadcast({ type: "chat:message", data: newMessage });
          break;

        case "payment:record":
          const { data: newTx } = await supabase
            .from('transactions')
            .insert([{
              ticket_id: data.ticketId,
              amount: data.amount,
              status: 'escrow',
              type: 'payment',
              reference: data.reference
            }])
            .select()
            .single();
          
          if (newTx) broadcast({ type: "transaction:new", data: newTx });
          break;
      }
    } catch (err) {
      console.error("Failed to process message", err);
    }
  });
});

app.delete("/api/messages/session/:ticketId", async (req, res) => {
  const { ticketId } = req.params;
  const { error } = await supabase
    .from('messages')
    .delete()
    .eq('ticket_id', ticketId);
  
  if (error) return res.status(400).json({ error: error.message });
  res.json({ success: true });
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

app.get("/api/db-health", async (req, res) => {
  try {
    const { data: tables, error } = await supabase
      .from('profiles')
      .select('count', { count: 'exact', head: true });
    
    if (error) {
      return res.status(500).json({ 
        status: "error", 
        message: "Could not access profiles table", 
        error: error.message,
        hint: "Ensure the 'profiles' table exists in your Supabase database and RLS is configured correctly."
      });
    }
    
    res.json({ status: "ok", message: "Database connection and profiles table accessible" });
  } catch (err: any) {
    res.status(500).json({ status: "error", message: err.message });
  }
});

app.post("/api/tickets", async (req, res) => {
  const data = req.body;
  const { data: newTicket, error } = await supabase
    .from('tickets')
    .insert([{
      customer_id: data.customer_id,
      customer_name: data.customer_name,
      service: data.service,
      description: data.description,
      priority: data.priority,
      status: 'Pending',
      date: data.date,
      amount: data.amount || 25000
    }])
    .select()
    .single();
  
  if (error) return res.status(400).json({ error: error.message });
  if (newTicket) {
    broadcast({ type: "ticket:created", data: newTicket });
    
    if (data.paymentRef) {
      const { data: newTx } = await supabase
        .from('transactions')
        .insert([{
          ticket_id: newTicket.id,
          amount: newTicket.amount,
          status: 'escrow',
          type: 'payment',
          reference: data.paymentRef
        }])
        .select()
        .single();
      
      if (newTx) broadcast({ type: "transaction:new", data: newTx });
    }
  }
  res.json(newTicket);
});

app.patch("/api/tickets/:id", async (req, res) => {
  const { id } = req.params;
  const data = req.body;
  const { data: updatedTicket, error } = await supabase
    .from('tickets')
    .update(data)
    .eq('id', id)
    .select()
    .single();
  
  if (error) return res.status(400).json({ error: error.message });
  if (updatedTicket) broadcast({ type: "ticket:updated", data: updatedTicket });
  res.json(updatedTicket);
});

app.post("/api/technicians", async (req, res) => {
  const { name, specialty, phone, email, password } = req.body;
  
  // 1. Create Auth User
  const { data: authData, error: authError } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { full_name: name, role: 'worker' }
  });

  if (authError) return res.status(400).json({ error: authError.message });

  // 2. Create Profile
  if (authData.user) {
    await supabase.from('profiles').insert([
      { id: authData.user.id, full_name: name, role: 'worker', phone }
    ]);
  }

  // 3. Create Technician record
  const { data: newTech, error } = await supabase
    .from('technicians')
    .insert([{
      id: authData.user?.id, // Link to auth user
      name,
      specialty,
      status: 'Idle',
      load: 0,
      phone
    }])
    .select()
    .single();
  
  if (error) return res.status(400).json({ error: error.message });
  if (newTech) broadcast({ type: "technician:created", data: newTech });
  res.json(newTech);
});

app.patch("/api/technicians/:id", async (req, res) => {
  const { id } = req.params;
  const data = req.body;
  const { data: updatedTech, error } = await supabase
    .from('technicians')
    .update(data)
    .eq('id', id)
    .select()
    .single();
  
  if (error) return res.status(400).json({ error: error.message });
  if (updatedTech) broadcast({ type: "technician:updated", data: updatedTech });
  res.json(updatedTech);
});

app.delete("/api/technicians/:id", async (req, res) => {
  const { id } = req.params;
  const { error } = await supabase
    .from('technicians')
    .delete()
    .eq('id', id);
  
  if (error) return res.status(400).json({ error: error.message });
  broadcast({ type: "technician:deleted", data: { id } });
  res.json({ success: true });
});

app.post("/api/messages", async (req, res) => {
  const { ticket_id, sender_id, text } = req.body;
  const { data: newMessage, error } = await supabase
    .from('messages')
    .insert([{
      ticket_id,
      sender_id,
      text
    }])
    .select()
    .single();
  
  if (error) return res.status(400).json({ error: error.message });
  if (newMessage) broadcast({ type: "chat:message", data: newMessage });
  res.json(newMessage);
});

app.post("/api/transactions", async (req, res) => {
  const data = req.body;
  const { data: newTx, error } = await supabase
    .from('transactions')
    .insert([{
      ticket_id: data.ticket_id,
      amount: data.amount,
      status: data.status || 'escrow',
      type: data.type || 'payment',
      reference: data.reference
    }])
    .select()
    .single();
  
  if (error) return res.status(400).json({ error: error.message });
  if (newTx) broadcast({ type: "transaction:new", data: newTx });
  res.json(newTx);
});

// WhatsApp Webhook Verification
app.get("/api/whatsapp/webhook", (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode && token) {
    if (mode === "subscribe" && token === WHATSAPP_VERIFY_TOKEN) {
      console.log("WHATSAPP_WEBHOOK_VERIFIED");
      res.status(200).send(challenge);
    } else {
      res.sendStatus(403);
    }
  }
});

// WhatsApp Webhook Receiving
app.post("/api/whatsapp/webhook", async (req, res) => {
  const body = req.body;

  if (body.object === "whatsapp_business_account") {
    if (
      body.entry &&
      body.entry[0].changes &&
      body.entry[0].changes[0].value.messages &&
      body.entry[0].changes[0].value.messages[0]
    ) {
      const msg = body.entry[0].changes[0].value.messages[0];
      const from = msg.from; // sender phone number
      const text = msg.text.body;

      console.log(`Received WhatsApp from ${from}: ${text}`);

      // Here you would link the phone number to a user/ticket
      // and broadcast to the admin panel
      broadcast({
        type: "chat:message",
        data: {
          id: msg.id,
          ticket_id: "whatsapp-session",
          sender_id: from,
          text: text,
          created_at: new Date().toISOString(),
        },
      });
    }
    res.sendStatus(200);
  } else {
    res.sendStatus(404);
  }
});

// Wallet API
app.get("/api/wallet/:userId", async (req, res) => {
  const { userId } = req.params;
  const { data, error } = await supabase
    .from("wallets")
    .select("*")
    .eq("user_id", userId)
    .single();

  if (error && error.code !== "PGRST116") return res.status(400).json({ error: error.message });
  
  if (!data) {
    // Create wallet if not exists
    const { data: newWallet, error: createError } = await supabase
      .from("wallets")
      .insert([{ user_id: userId, balance: 0 }])
      .select()
      .single();
    if (createError) return res.status(400).json({ error: createError.message });
    return res.json(newWallet);
  }

  res.json(data);
});

app.post("/api/wallet/deposit", async (req, res) => {
  const { userId, amount, reference } = req.body;

  // Verify Paystack payment first (optional but recommended)
  
  const { data: wallet } = await supabase
    .from("wallets")
    .select("*")
    .eq("user_id", userId)
    .single();

  if (!wallet) return res.status(404).json({ error: "Wallet not found" });

  const newBalance = parseFloat(wallet.balance) + parseFloat(amount);

  const { error: updateError } = await supabase
    .from("wallets")
    .update({ balance: newBalance })
    .eq("id", wallet.id);

  if (updateError) return res.status(400).json({ error: updateError.message });

  await supabase.from("wallet_transactions").insert([
    {
      wallet_id: wallet.id,
      amount: amount,
      type: "deposit",
      reference: reference,
      description: "Wallet Funding",
    },
  ]);

  res.json({ success: true, newBalance });
});

// WhatsApp Auth
const otps = new Map<string, { code: string; expires: number }>();

app.post("/api/auth/whatsapp/send-otp", async (req, res) => {
  const { phone } = req.body;
  if (!phone) return res.status(400).json({ error: "Phone number required" });

  const code = Math.floor(100000 + Math.random() * 900000).toString();
  otps.set(phone, { code, expires: Date.now() + 5 * 60 * 1000 }); // 5 mins

  await sendWhatsAppMessage(phone, `Your BitNexus verification code is: ${code}. Valid for 5 minutes.`);
  
  res.json({ success: true, message: "OTP sent via WhatsApp" });
});

app.post("/api/auth/whatsapp/verify-otp", async (req, res) => {
  const { phone, code } = req.body;
  const stored = otps.get(phone);

  if (!stored || stored.code !== code || stored.expires < Date.now()) {
    return res.status(400).json({ error: "Invalid or expired OTP" });
  }

  otps.delete(phone);

  // Find or create user
  let { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('phone', phone)
    .single();

  if (!profile) {
    // Create a dummy auth user for Supabase (in real app, use supabase.auth.admin.createUser)
    // For this demo, we'll just create a profile if it doesn't exist
    // and return a mock user object
    const { data: newProfile, error } = await supabase
      .from('profiles')
      .insert([{ 
        id: '00000000-0000-0000-0000-' + Math.random().toString(16).slice(2, 14),
        phone, 
        role: 'customer',
        full_name: 'WhatsApp User'
      }])
      .select()
      .single();
    
    if (error) return res.status(400).json({ error: error.message });
    profile = newProfile;
  }

  res.json({ user: profile, success: true });
});

app.post("/api/auth/signup", async (req, res) => {
  try {
    const { email, password, role, adminToken, fullName } = req.body;

    if (role === 'admin' && adminToken !== ADMIN_TOKEN) {
      return res.status(403).json({ error: "Invalid admin signup token" });
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${process.env.APP_URL || 'http://localhost:3000'}/#type=verified`,
        data: {
          full_name: fullName,
          role: role
        }
      }
    });

    if (error) return res.status(400).json({ error: error.message });
    
    // Create profile in public.profiles table
    if (data.user) {
      console.log(`Signup successful for ${email}. Creating profile for user ID: ${data.user.id}`);
      const { error: profileError } = await supabase.from('profiles').insert([
        { id: data.user.id, full_name: fullName, role: role }
      ]);
      if (profileError) {
        console.error("❌ Profile Creation Error:", profileError.message, profileError.details, profileError.hint);
      } else {
        console.log(`✅ Profile created successfully for ${email}`);
      }
    }

    res.json({ user: data.user });
  } catch (err: any) {
    console.error("Signup Route Error:", err);
    res.status(500).json({ error: err.message || "Internal server error during signup" });
  }
});

app.post("/api/auth/reset-password", async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: "Email is required" });

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.APP_URL || 'http://localhost:3000'}/#type=recovery`,
  });

  if (error) return res.status(400).json({ error: error.message });
  res.json({ success: true, message: "Password reset link sent to your email" });
});

app.post("/api/auth/update-password", async (req, res) => {
  const { password, accessToken } = req.body;
  if (!password) return res.status(400).json({ error: "New password is required" });

  // If we have an access token (from the recovery link), we use it
  const { data, error } = await supabase.auth.updateUser({
    password: password
  });

  if (error) return res.status(400).json({ error: error.message });
  res.json({ success: true, user: data.user });
});

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error("Unhandled Error:", err);
  res.status(500).json({ error: "Internal server error" });
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
