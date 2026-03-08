import express from "express";
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(
  supabaseUrl || "", 
  supabaseKey || ""
);

const ADMIN_TOKEN = process.env.ADMIN_SIGNUP_TOKEN || "nexus-admin-2024";

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

// Auth Signup
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
  
  if (data.user) {
    await supabase.from('profiles').insert([
      { id: data.user.id, full_name: fullName, role: role }
    ]);
  }

  res.json({ user: data.user });
});

// Ticket Actions (Migrated from WebSockets)
app.post("/api/tickets", async (req, res) => {
  const { data } = req.body;
  const { data: newTicket, error } = await supabase
    .from('tickets')
    .insert([{
      customer_name: data.customer_name || data.customer,
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

  if (data.paymentRef) {
    await supabase
      .from('transactions')
      .insert([{
        ticket_id: newTicket.id,
        amount: newTicket.amount,
        status: 'escrow',
        type: 'payment',
        reference: data.paymentRef
      }]);
  }

  res.json(newTicket);
});

app.patch("/api/tickets/:id", async (req, res) => {
  const { id } = req.params;
  const { data: updatedTicket, error } = await supabase
    .from('tickets')
    .update(req.body)
    .eq('id', id)
    .select()
    .single();
  
  if (error) return res.status(400).json({ error: error.message });
  res.json(updatedTicket);
});

// Technician Actions
app.post("/api/technicians", async (req, res) => {
  const { data: newTech, error } = await supabase
    .from('technicians')
    .insert([req.body])
    .select()
    .single();
  
  if (error) return res.status(400).json({ error: error.message });
  res.json(newTech);
});

app.patch("/api/technicians/:id", async (req, res) => {
  const { id } = req.params;
  const { data: updatedTech, error } = await supabase
    .from('technicians')
    .update(req.body)
    .eq('id', id)
    .select()
    .single();
  
  if (error) return res.status(400).json({ error: error.message });
  res.json(updatedTech);
});

app.delete("/api/technicians/:id", async (req, res) => {
  const { id } = req.params;
  const { error } = await supabase
    .from('technicians')
    .delete()
    .eq('id', id);
  
  if (error) return res.status(400).json({ error: error.message });
  res.json({ success: true });
});

// Chat Actions
app.post("/api/messages", async (req, res) => {
  const { data: newMessage, error } = await supabase
    .from('messages')
    .insert([req.body])
    .select()
    .single();
  
  if (error) return res.status(400).json({ error: error.message });
  res.json(newMessage);
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

export default app;
