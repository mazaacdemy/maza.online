import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import AdminLeadsClient from "@/components/AdminLeadsClient";

export default async function AdminLeadsPage() {
  const session = await getServerSession(authOptions);

  if (!session || !['ADMIN', 'SUPER_ADMIN'].includes((session.user as any).role)) {
    redirect('/login');
  }

  return <AdminLeadsClient />;
}