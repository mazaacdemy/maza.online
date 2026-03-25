import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import AdminContentClient from "@/components/AdminContentClient";

export default async function AdminContentPage() {
  const session = await getServerSession(authOptions);
  
  if (!session || !['ADMIN', 'SUPER_ADMIN'].includes((session.user as any).role)) {
    redirect('/login');
  }

  return <AdminContentClient />;
}
