"use client";

import { useState, useRef } from "react";

export function VoiceRecorder({ onSave }: { onSave: (blob: Blob, transcript: string) => void }) {
  const [recording, setRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const start = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mr = new MediaRecorder(stream);
      chunksRef.current = [];
      mr.ondataavailable = (e) => { if (e.data.size > 0) chunksRef.current.push(e.data); };
      mr.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        setAudioUrl(URL.createObjectURL(blob));
        // Simulated AI transcription
        const mockTranscript = "Customer wants white color, budget flexible up to $45K, needs delivery by April. Prefers leather interior.";
        onSave(blob, mockTranscript);
        stream.getTracks().forEach(t => t.stop());
      };
      mr.start();
      mediaRecorderRef.current = mr;
      setRecording(true);
    } catch { alert("Microphone access denied"); }
  };

  const stop = () => { mediaRecorderRef.current?.stop(); setRecording(false); };

  return (
    <div className="flex items-center gap-2">
      {!recording ? (
        <button onClick={start} className="p-2 rounded-lg bg-white/5 text-white/40 hover:text-white hover:bg-white/10 transition" title="Record voice note">
          🎙️
        </button>
      ) : (
        <button onClick={stop} className="p-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition animate-pulse" title="Stop recording">
          ⏹️
        </button>
      )}
      {audioUrl && <audio src={audioUrl} controls className="h-8" />}
    </div>
  );
}
