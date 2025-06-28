import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import twilio from 'twilio';

export async function POST(req: NextRequest) {
    const { name, email, message, mode } = await req.json();

    // --- ENVOI EMAIL ---
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.MAIL_USER,
            pass: process.env.MAIL_PASS,
        },
    });

    const mailOptions = {
        from: process.env.MAIL_USER,
        to: process.env.MAIL_TO,
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
        if (mode === 'mail') {
            await transporter.sendMail(mailOptions);
        } else if (mode === 'whatsapp') {
            await twilioClient.messages.create({
                from: `whatsapp:${process.env.TWILIO_WHATSAPP_FROM}`,
                to: `whatsapp:${process.env.WHATSAPP_TO}`,
                body: whatsappMessage,
            });
        } else {
            // Si mode inconnu, on peut retourner une erreur
            return NextResponse.json({ success: false, error: "Mode d'envoi inconnu." }, { status: 400 });
        }

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