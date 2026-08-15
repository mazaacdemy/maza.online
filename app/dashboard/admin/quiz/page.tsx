import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import AdminQuizClient from "@/components/AdminQuizClient";

export default async function AdminQuizPage() {
  const session = await getServerSession(authOptions);

  if (!session || !['ADMIN', 'SUPER_ADMIN'].includes((session.user as any).role)) {
    redirect('/login');
  }

  return <AdminQuizClient />;
}