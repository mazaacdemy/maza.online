import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import ClientNavbar from "./ClientNavbar";

export default async function Navbar() {
  const session = await getServerSession(authOptions);
  return <ClientNavbar user={session?.user} />;
}
