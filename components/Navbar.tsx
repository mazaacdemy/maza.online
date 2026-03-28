import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import ClientNavbar from "./ClientNavbar";

export default async function Navbar() {
  const session = await getServerSession(authOptions);
  
  // Fetch settings for contact info with error handling
  let settings: any = {};
  try {
    const settingsArray = await prisma.setting.findMany({
      where: { key: { in: ['phone_number', 'facebook_link'] } }
    });
    settingsArray.forEach(s => { settings[s.key] = s.value; });
  } catch (error) {
    console.warn("Navbar: Failed to fetch settings", error);
    // Fallback avoids crashing the full layout
  }

  return <ClientNavbar user={session?.user} settings={settings} />;
}
