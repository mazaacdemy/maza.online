import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import ClientNavbar from "./ClientNavbar";

export default async function Navbar() {
  const session = await getServerSession(authOptions);
  
  // Fetch settings for contact info
  const settingsArray = await prisma.setting.findMany({
    where: { key: { in: ['phone_number', 'facebook_link'] } }
  });
  
  const settings: any = {};
  settingsArray.forEach(s => { settings[s.key] = s.value; });

  return <ClientNavbar user={session?.user} settings={settings} />;
}
