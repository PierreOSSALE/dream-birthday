// src/components/invite/qr-pass-section.tsx
import { useEffect, useState } from "react";
import { Download } from "lucide-react";
import QRCode from "qrcode";
import { formatFrenchDate } from "@/lib/format";
import SlideReveal from "../animations/SlideReveal";

interface Props {
  guestName: string;
  inviteSlug: string;
  qrCode: string | null | undefined;
  status: "PENDING" | "CONFIRMED" | "DECLINED";
  birthdayDate: string;
}

export function QrPassSection({ guestName, inviteSlug, qrCode, status, birthdayDate }: Props) {
  const [currentQrCode, setCurrentQrCode] = useState(qrCode);
  const canShowQrCode = status === "CONFIRMED";

  useEffect(() => {
    if (!canShowQrCode) {
      setCurrentQrCode(null);
      return;
    }

    let cancelled = false;

    async function generateCurrentInviteQrCode() {
      const inviteUrl = `${window.location.origin}/invite/${inviteSlug}`;
      const dataUrl = await QRCode.toDataURL(inviteUrl, {
        margin: 1,
        width: 600,
        color: { dark: "#0B3FCB", light: "#F8FBFF" },
      });

      if (!cancelled) setCurrentQrCode(dataUrl);
    }

    generateCurrentInviteQrCode().catch(() => {
      if (!cancelled) setCurrentQrCode(qrCode);
    });

    return () => {
      cancelled = true;
    };
  }, [canShowQrCode, inviteSlug, qrCode]);

  return (
    <section className="px-6 py-12">
      <SlideReveal direction="down" distance={50} duration={2} delay={0.1}>
        <div className="max-w-sm mx-auto card-glass rounded-3xl p-8 text-center">
          <p className="label-caps text-gold">Pass convive personnel</p>
          {canShowQrCode && currentQrCode ? (
            <img
              src={currentQrCode}
              alt="QR code"
              className="w-48 h-48 mx-auto mt-6 rounded-2xl bg-white p-3"
            />
          ) : (
            <div className="w-48 h-48 mx-auto mt-6 bg-muted rounded-2xl flex items-center justify-center text-muted-foreground text-sm">
              Disponible apres confirmation
            </div>
          )}
          <p className="font-serif italic text-2xl mt-6">{guestName}</p>
          <p className="text-muted-foreground text-sm mt-1">{formatFrenchDate(birthdayDate)}</p>
          {canShowQrCode && currentQrCode && (
            <a
              href={currentQrCode}
              download={`pass-${guestName}.png`}
              className="pill pill-outline inline-flex items-center gap-2 mt-6"
            >
              <Download className="w-4 h-4" /> Telecharger
            </a>
          )}
        </div>
      </SlideReveal>
    </section>
  );
}
