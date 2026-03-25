import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import AdminSettingsClient from "@/components/AdminSettingsClient";

export default async function AdminSettingsPage() {
  const session = await getServerSession(authOptions);
  
  if (!session || !['ADMIN', 'SUPER_ADMIN'].includes((session.user as any).role)) {
    redirect('/login');
  }

  return <AdminSettingsClient />;
}
