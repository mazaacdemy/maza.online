import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import AdminUsersClient from "@/components/AdminUsersClient";

export default async function AdminUsersPage() {
  const session = await getServerSession(authOptions);
  
  if (!session || !['ADMIN', 'SUPER_ADMIN'].includes((session.user as any).role)) {
    redirect('/login');
  }

  return <AdminUsersClient />;
}
