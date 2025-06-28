import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import twilio from 'twilio';

export async function POST(req: NextRequest) {
    const { name, email, message } = await req.json();

    // --- ENVOI EMAIL ---
    const transporter = nodemailer.createTransport({
        service: 'gmail', // ou autre service
        auth: {
            user: process.env.MAIL_USER, // votre email
            pass: process.env.MAIL_PASS, // mot de passe ou app password
        },
    });

    const mailOptions = {
        from: process.env.MAIL_USER,
        to: process.env.MAIL_TO, // votre email de réception
        subject: `Nouveau message de ${name}`,
        text: `Nom: ${name}\nEmail: ${email}\nMessage:\n${message}`,
    };

    // --- ENVOI WHATSAPP ---
    const twilioClient = twilio(
        process.env.TWILIO_ACCOUNT_SID,
        process.env.TWILIO_AUTH_TOKEN
    );

    const whatsappMessage = `Nouveau message via le site:\nNom: ${name}\nEmail: ${email}\nMessage:\n${message}`;

    try {
        // Envoi email
        await transporter.sendMail(mailOptions);

        // Envoi WhatsApp
        await twilioClient.messages.create({
            from: `whatsapp:${process.env.TWILIO_WHATSAPP_FROM}`, // ex: whatsapp:+14155238886
            to: `whatsapp:${process.env.WHATSAPP_TO}`, // votre numéro WhatsApp
            body: whatsappMessage,
        });

        return NextResponse.json({ success: true });
    } catch (error: unknown) {
        let errorMessage = "Une erreur est survenue";
        if (error instanceof Error) {
            errorMessage = error.message;
        } else {
            errorMessage = String(error);
        }
        return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
    }
}