import nodemailer from 'nodemailer';

export const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.EMAIL_PORT || '587'),
  secure: process.env.EMAIL_SECURE === 'true', // true for 465, false for 587
  auth: {
    user: process.env.EMAIL_USER, // e.g., your gmail address
    pass: process.env.EMAIL_PASS, // e.g., your Google App Password
  },
});

export const sendVerificationEmail = async (email: string, token: string) => {
  const verifyUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/verify?token=${token}`;
  
  const mailOptions = {
    from: `"منصة ماذا (Maza)" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "تفعيل حسابك في منصة ماذا",
    html: `
      <div style="font-family: Arial, sans-serif; text-align: center; direction: rtl; padding: 30px; background-color: #f8fafc; color: #0f172a; border-radius: 12px; border: 1px solid #e2e8f0; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #6366f1;">مرحباً بك في منصة ماذا</h1>
        <p style="font-size: 16px; margin-top: 20px;">لقد قمت بإنشاء حساب جديد بنجاح. لتفعيل الحساب والبدء في استخدام المنصة، يرجى النقر على الزر أدناه:</p>
        <a href="${verifyUrl}" style="display: inline-block; padding: 14px 28px; margin: 30px 0; background: linear-gradient(135deg, #6366f1, #a855f7); color: white; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px;">تفعيل الحساب الآن</a>
        <p style="font-size: 14px; color: #64748b; margin-top: 10px;">أو انسخ الرابط التالي في متصفحك:</p>
        <p style="font-size: 12px; color: #94a3b8; word-break: break-all;">${verifyUrl}</p>
        <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 30px 0;" />
        <p style="font-size: 12px; color: #94a3b8;">إذا لم تقم بالتسجيل، يرجى تجاهل هذا البريد.</p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};
