import { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "@/lib/supabaseClient";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "Método não permitido" });

  const { link_id } = req.body;

  if (!link_id) return res.status(400).json({ error: "link_id é obrigatório" });

  await supabase.from("link_clicks").insert([{
    link_id,
    user_agent: req.headers["user-agent"] || "",
    ip: req.headers["x-forwarded-for"] || req.socket.remoteAddress || ""
  }]);

  res.status(200).json({ success: true });
}
