"use client";

import { useState, useRef } from "react";

export function VideoRecorder({ onSend }: { onSend: (blob: Blob) => void }) {
  const [recording, setRecording] = useState(false);
  const [recorded, setRecorded] = useState<Blob | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const start = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      if (videoRef.current) { videoRef.current.srcObject = stream; videoRef.current.play(); }
      const mr = new MediaRecorder(stream);
      chunksRef.current = [];
      mr.ondataavailable = (e) => { if (e.data.size > 0) chunksRef.current.push(e.data); };
      mr.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "video/webm" });
        setRecorded(blob);
        setPreviewUrl(URL.createObjectURL(blob));
        stream.getTracks().forEach(t => t.stop());
      };
      mr.start();
      mediaRecorderRef.current = mr;
      setRecording(true);
    } catch { alert("Camera access denied"); }
  };

  const stop = () => { mediaRecorderRef.current?.stop(); setRecording(false); };

  return (
    <div className="bg-white/[0.03] border border-white/5 rounded-xl p-4">
      <h4 className="text-sm font-bold text-white/60 mb-3">🎥 Video Message</h4>
      <div className="aspect-video bg-black rounded-lg overflow-hidden mb-3 relative">
        <video ref={videoRef} className="w-full h-full object-cover" muted={recording} playsInline />
        {!recording && !recorded && <div className="absolute inset-0 flex items-center justify-center text-white/20 text-sm">Camera preview</div>}
        {recording && <div className="absolute top-3 left-3 flex items-center gap-1.5"><span className="w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse" /><span className="text-xs text-white font-medium">Recording</span></div>}
      </div>
      {previewUrl && <video src={previewUrl} controls className="w-full rounded-lg mb-3" />}
      <div className="flex gap-2">
        {!recording && !recorded && <button onClick={start} className="flex-1 bg-red-500 text-white font-semibold py-2.5 rounded-lg hover:bg-red-600 transition">Start Recording</button>}
        {recording && <button onClick={stop} className="flex-1 bg-white/10 text-white font-semibold py-2.5 rounded-lg hover:bg-white/20 transition">Stop</button>}
        {recorded && (
          <>
            <button onClick={() => { onSend(recorded); setRecorded(null); setPreviewUrl(null); }} className="flex-1 bg-amber text-navy font-semibold py-2.5 rounded-lg hover:bg-amber-light transition">Send Video</button>
            <button onClick={() => { setRecorded(null); setPreviewUrl(null); }} className="px-4 py-2.5 border border-white/10 rounded-lg text-white/40 text-sm hover:text-white transition">Retake</button>
          </>
        )}
      </div>
    </div>
  );
}
