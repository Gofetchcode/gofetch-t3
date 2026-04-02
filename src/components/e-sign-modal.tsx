"use client";

import { useRef, useState, useEffect } from "react";

const CONTRACT_TERMS = [
  "EXCLUSIVE REPRESENTATION: I grant GoFetch Auto LLC the exclusive right to act as my authorized representative for locating, negotiating, and facilitating the purchase of a motor vehicle. This representation is effective for 180 days from signing.",
  "SCOPE OF SERVICES: GoFetch will research vehicles, contact dealerships on my behalf using GoFetch's identity, negotiate pricing and fees, present offers, and coordinate paperwork and delivery upon acceptance and payment.",
  "SERVICE FEES: Standard $99, Premium $199, Exotic $1,299. Fees are due BEFORE dealer identity is revealed. Fees are NON-REFUNDABLE once paid, as services will have been substantially performed.",
  "NO CANCELLATION: I acknowledge GoFetch begins services immediately. There is NO cooling-off period, cancellation window, or right of rescission. I expressly waive any right to cancel after signing.",
  "EXCLUSIVITY: During this Agreement, I will NOT contact, negotiate with, or purchase from any dealership GoFetch has contacted. I will not use GoFetch's pricing or deal information to negotiate independently. Violation results in full fee plus 2x penalty as liquidated damages.",
  "NON-CIRCUMVENTION: All pricing and dealer information is proprietary and confidential. I will not contact any dealer identified by GoFetch for 12 months after termination. Circumvention penalty: full fee + $2,500.",
  "INFORMATION PROTECTION: GoFetch will not share my personal information with any dealership without my consent. All outreach uses GoFetch's identity. My info is released to the selected dealer only AFTER I pay the service fee.",
  "LIMITATION OF LIABILITY: GoFetch acts as a negotiation advocate, NOT a seller or dealer. GoFetch does not guarantee specific savings. Total liability shall not exceed the service fee paid.",
  "DISPUTE RESOLUTION: Disputes shall be resolved through binding arbitration in Hillsborough County, Florida, per the American Arbitration Association rules. Prevailing party recovers attorneys' fees.",
  "ELECTRONIC SIGNATURE: My electronic signature has the same legal force as a handwritten signature under the E-SIGN Act (15 U.S.C. § 7001) and Florida's UETA.",
  "GOVERNING LAW: This Agreement is governed by the laws of the State of Florida.",
  "ENTIRE AGREEMENT: This constitutes the entire agreement. No modification is effective unless in writing signed by both parties.",
];

interface ESignModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSign: (signatureData: string, signatureName: string) => void;
  customerName: string;
}

export function ESignModal({ isOpen, onClose, onSign, customerName }: ESignModalProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasSigned, setHasSigned] = useState(false);
  const [agreedTerms, setAgreedTerms] = useState<boolean[]>(new Array(CONTRACT_TERMS.length).fill(false));
  const [typedName, setTypedName] = useState("");

  useEffect(() => {
    if (!isOpen) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    canvas.width = canvas.offsetWidth * 2;
    canvas.height = canvas.offsetHeight * 2;
    ctx.scale(2, 2);
    ctx.strokeStyle = "#0A1628";
    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
  }, [isOpen]);

  const getPos = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
    return { x: clientX - rect.left, y: clientY - rect.top };
  };

  const startDraw = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;
    const pos = getPos(e);
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
    setIsDrawing(true);
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing) return;
    e.preventDefault();
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;
    const pos = getPos(e);
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
    setHasSigned(true);
  };

  const stopDraw = () => setIsDrawing(false);

  const clearSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasSigned(false);
  };

  const allAgreed = agreedTerms.every(Boolean);
  const canSubmit = allAgreed && hasSigned && typedName.trim().length > 0;

  const handleSign = () => {
    if (!canSubmit) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const signatureData = canvas.toDataURL("image/png");
    onSign(signatureData, typedName);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div
        className="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-navy">Exclusive Buyer Representation Agreement</h2>
              <p className="text-sm text-muted mt-1">GoFetch Auto LLC — Electronic Signature</p>
            </div>
            <button onClick={onClose} className="text-muted hover:text-navy text-2xl leading-none">&times;</button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Contract Terms */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-navy uppercase tracking-wider">Agreement Terms</h3>
            {CONTRACT_TERMS.map((term, i) => (
              <label key={i} className="flex items-start gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={agreedTerms[i]}
                  onChange={() => {
                    const next = [...agreedTerms];
                    next[i] = !next[i];
                    setAgreedTerms(next);
                  }}
                  className="mt-1 w-4 h-4 accent-amber flex-shrink-0"
                />
                <span className="text-sm text-warm-600 leading-relaxed group-hover:text-navy transition">
                  {i + 1}. {term}
                </span>
              </label>
            ))}
          </div>

          {/* Typed Name */}
          <div>
            <label className="text-sm font-bold text-navy uppercase tracking-wider block mb-2">Full Legal Name</label>
            <input
              type="text"
              value={typedName}
              onChange={(e) => setTypedName(e.target.value)}
              placeholder={customerName || "Type your full name"}
              className="w-full border border-gray-200 rounded-lg px-4 py-3 text-navy focus:border-amber outline-none"
            />
          </div>

          {/* Signature Pad */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-bold text-navy uppercase tracking-wider">Your Signature</label>
              <button onClick={clearSignature} className="text-xs text-amber hover:text-amber-dark font-medium">Clear</button>
            </div>
            <div className="border-2 border-dashed border-gray-200 rounded-xl overflow-hidden bg-gray-50">
              <canvas
                ref={canvasRef}
                className="w-full h-32 cursor-crosshair touch-none"
                onMouseDown={startDraw}
                onMouseMove={draw}
                onMouseUp={stopDraw}
                onMouseLeave={stopDraw}
                onTouchStart={startDraw}
                onTouchMove={draw}
                onTouchEnd={stopDraw}
              />
            </div>
            {!hasSigned && <p className="text-xs text-muted mt-1">Draw your signature above</p>}
          </div>

          {/* Submit */}
          <div className="flex gap-3">
            <button
              onClick={handleSign}
              disabled={!canSubmit}
              className="flex-1 bg-amber text-navy font-bold py-4 rounded-lg hover:bg-amber-light transition disabled:opacity-40 disabled:cursor-not-allowed text-lg"
            >
              Sign & Submit
            </button>
            <button onClick={onClose} className="px-6 py-4 border border-gray-200 rounded-lg text-muted hover:text-navy transition">
              Cancel
            </button>
          </div>

          <p className="text-xs text-muted text-center">
            By signing, you agree to the terms above. This electronic signature is legally binding under the E-SIGN Act (15 U.S.C. &sect; 7001).
          </p>
        </div>
      </div>
    </div>
  );
}
