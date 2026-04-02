import { db } from "@/lib/db";
import Anthropic from "@anthropic-ai/sdk";

const anthropic = process.env.ANTHROPIC_API_KEY
  ? new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
  : null;

export async function POST(req: Request) {
  try {
    const { customerId, transcript, callDuration } = await req.json();

    if (!customerId || !transcript) {
      return Response.json({ error: "Customer ID and transcript required" }, { status: 400 });
    }

    let summary = "";
    let actionItems: string[] = [];
    let sentiment = "neutral";

    if (anthropic) {
      const response = await anthropic.messages.create({
        model: "claude-sonnet-4-20250514",
        max_tokens: 400,
        system: "You are analyzing a car buying advocacy call transcript. Provide: 1) A 3-sentence summary, 2) Action items as a JSON array of strings, 3) Customer sentiment (positive/neutral/negative/frustrated). Respond in JSON: {summary, actionItems, sentiment}",
        messages: [{ role: "user", content: `Call transcript (${callDuration || "unknown"} duration):\n\n${transcript}` }],
      });

      const text = response.content[0].type === "text" ? response.content[0].text : "{}";
      try {
        const parsed = JSON.parse(text);
        summary = parsed.summary || "";
        actionItems = parsed.actionItems || [];
        sentiment = parsed.sentiment || "neutral";
      } catch {
        summary = text;
      }
    } else {
      summary = `Call with customer lasted ${callDuration || "several minutes"}. Key topics discussed. Follow-up needed.`;
      actionItems = ["Follow up on discussed items", "Update deal status if needed"];
      sentiment = "neutral";
    }

    // Save call note
    await db.note.create({
      data: {
        customerId,
        content: `📞 CALL SUMMARY (${callDuration || "?"}):\n${summary}\n\nACTION ITEMS:\n${actionItems.map(a => `• ${a}`).join("\n")}\n\nSentiment: ${sentiment}`,
        author: "ai",
      },
    });

    // Create tasks from action items
    for (const item of actionItems) {
      await db.cRMTask.create({
        data: {
          userId: "system",
          title: item,
          customerId,
          priority: sentiment === "frustrated" ? "urgent" : "normal",
        },
      });
    }

    // Log sentiment alert if negative
    if (sentiment === "frustrated" || sentiment === "negative") {
      await db.aIAlert.create({
        data: {
          customerId,
          type: `call_sentiment_${sentiment}`,
          message: `📞 Call flagged: ${sentiment} sentiment detected. Summary: ${summary.slice(0, 100)}...`,
          triggered: true,
          triggeredAt: new Date(),
        },
      });
    }

    // Log to AI learning
    await db.aILearning.create({
      data: {
        category: "call_transcription",
        dataPoint: JSON.stringify({ customerId, callDuration, transcriptLength: transcript.length }),
        outcome: JSON.stringify({ summary, actionItems: actionItems.length, sentiment }),
      },
    });

    return Response.json({ success: true, summary, actionItems, sentiment });
  } catch (err: any) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}
