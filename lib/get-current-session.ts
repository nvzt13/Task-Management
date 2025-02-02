import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options"; // Yeni oluşturulan authOptions dosyasını import edin

const getCurrentSession = async () => {
  const session = await getServerSession(authOptions);
  return session;
};

export default getCurrentSession;
