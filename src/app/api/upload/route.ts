import { db } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const customerId = formData.get("customerId") as string;
    const docType = formData.get("docType") as string;

    if (!file || !customerId) {
      return Response.json({ error: "File and customer ID required" }, { status: 400 });
    }

    // Validate file
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      return Response.json({ error: "File too large. Max 10MB." }, { status: 400 });
    }

    const allowedTypes = ["application/pdf", "image/jpeg", "image/png"];
    if (!allowedTypes.includes(file.type)) {
      return Response.json({ error: "Only PDF, JPEG, PNG allowed." }, { status: 400 });
    }

    // Convert to base64 for storage (replace with Supabase Storage later)
    const bytes = await file.arrayBuffer();
    const base64 = Buffer.from(bytes).toString("base64");
    const storagePath = `documents/${customerId}/${Date.now()}-${file.name}`;

    const doc = await db.document.create({
      data: {
        customerId,
        docType: docType || "Other",
        fileName: file.name,
        originalName: file.name,
        mimeType: file.type,
        size: file.size,
        storagePath,
        status: "received",
      },
    });

    // Create message
    await db.message.create({
      data: {
        customerId,
        sender: "system",
        content: `Document uploaded: ${file.name} (${docType || "Other"})`,
      },
    });

    return Response.json({ success: true, document: doc });
  } catch (err: any) {
    console.error("Upload error:", err);
    return Response.json({ error: err.message }, { status: 500 });
  }
}
