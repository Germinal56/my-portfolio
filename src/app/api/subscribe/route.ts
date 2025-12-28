import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { corsMiddleware } from "@/lib/cors";
import { dbConnect } from "@/lib/mongoose";
import { Subscriber } from "@/models/Subscriber";
import { buildWelcomeEmail } from "@/lib/eBookMailTemplate";

function isValidEmail(email: string) {
  return /^[A-Za-z0-9._+\-']+@[A-Za-z0-9.\-]+\.[A-Za-z]{2,}$/.test(email);
}

export async function POST(request: Request) {
  // --- 1. DEBUG LOGGING ---
  const origin = request.headers.get("origin");
  console.log("--- INCOMING REQUEST ---");
  console.log("Origin Header:", origin);
  console.log("Method:", request.method);

  // --- 2. CORS CHECK ---
  const corsResponse = corsMiddleware(request);
  if (corsResponse.status !== 200) {
    console.error("❌ CORS BLOCKED REQUEST");
    console.error("Allowed Origins likely missing:", origin);
    // Return the 403 response from middleware
    return corsResponse;
  }
  console.log("✅ CORS Check Passed");

  try {
    // --- 3. PARSE BODY ---
    const body = await request.json(); 
    console.log("📦 Request Body:", body);

    const { name, email } = body;

    // --- 4. VALIDATION ---
    if (!name || !email) {
      console.warn("⚠️ Missing name or email");
      return NextResponse.json(
        { error: "Name and email are required" },
        { status: 400, headers: corsResponse.headers }
      );
    }

    if (!isValidEmail(email)) {
      console.warn("⚠️ Invalid email format");
      return NextResponse.json(
        { error: "Invalid email address" },
        { status: 400, headers: corsResponse.headers }
      );
    }

    // --- 5. DB UPSERT ---
    console.log("🔌 Connecting to DB...");
    await dbConnect();
    
    const normalizedEmail = email.trim().toLowerCase();
    const normalizedName = String(name).trim();

    console.log(`💾 Upserting subscriber: ${normalizedEmail}`);
    await Subscriber.findOneAndUpdate(
      { email: normalizedEmail },
      { $set: { name: normalizedName, status: "subscribed", source: "ebook-landing" } },
      { new: true, upsert: true }
    );
    console.log("✅ DB Update Successful");

    // --- 6. SEND EMAIL (AWS SES) ---
    console.log("📧 Preparing email...");
    const smtpUser = process.env.SES_SMTP_USERNAME;
    const smtpPass = process.env.SES_SMTP_PASSWORD;
    const from = process.env.SENDER_EMAIL;
    const bcc = process.env.ADMIN_BCC_EMAIL; 

    if (!smtpUser || !smtpPass || !from) {
      console.error("❌ SMTP Config Missing");
      return NextResponse.json(
        { error: "SMTP configuration missing" },
        { status: 500, headers: corsResponse.headers }
      );
    }

    const transporter = nodemailer.createTransport({
      host: "email-smtp.eu-west-1.amazonaws.com",
      port: 587,
      secure: false, 
      auth: { user: smtpUser, pass: smtpPass },
    });

    const { subject, text, html } = buildWelcomeEmail(normalizedName);

    await transporter.sendMail({
      from: `Gianluca Fornaciari <${from}>`,
      to: normalizedEmail,
      bcc: bcc || undefined,
      subject,
      text,
      html,
    });
    console.log("✅ Email Sent Successfully");

    // --- 7. SUCCESS RESPONSE ---
    return NextResponse.json(
      { message: "Subscribed and email sent" },
      { status: 200, headers: corsResponse.headers }
    );

  } catch (err) {
    console.error("❌ FATAL API ERROR:", err);
    return NextResponse.json(
      { error: "Subscription flow failed" },
      { status: 500, headers: corsResponse.headers }
    );
  }
}

export function OPTIONS(request: Request) {
  return corsMiddleware(request);
}