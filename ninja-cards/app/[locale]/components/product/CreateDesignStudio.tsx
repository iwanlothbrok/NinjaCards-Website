"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import html2canvas from "html2canvas";
import QRCode from "react-qr-code";
import {
  Eraser,
  Download,
  ImagePlus,
  Palette,
  RefreshCcw,
  Sparkles,
  Upload,
} from "lucide-react";

type UploadedImage = {
  name: string;
  src: string;
};

type RangeFieldProps = {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (value: number) => void;
};

const CARD_RATIO = "85 / 55";
const NFC_WAVES = [1, 2, 3];
const FONT_OPTIONS = [
  { label: "Modern", value: "Inter, system-ui, sans-serif" },
  { label: "Elegant", value: "Georgia, serif" },
  { label: "Sharp", value: "'Trebuchet MS', sans-serif" },
];

const defaultState = {
  personName: "Martin Hristov",
  qrUrl: "https://www.ninjacardsnfc.com",
  frontBackground: "#20262d",
  backBackground: "#20262d",
  textColor: "#f8fafc",
  frontLogoScale: 48,
  backLogoScale: 24,
  qrScale: 132,
  nameSize: 30,
  poweredBySize: 14,
  frontLogoOffsetY: 0,
  backTilt: 11,
  backOffsetY: -6,
  overlayStrength: 48,
  logoRemoveBgTolerance: 236,
  fontFamily: FONT_OPTIONS[0].value,
};

function readFileAsDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function buildDownloadName(baseName: string, side: "front" | "back") {
  const safe = baseName
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/gi, "-")
    .replace(/^-+|-+$/g, "");

  return `${safe || "ninja-card"}-${side}.png`;
}

function InputLabel({
  label,
  description,
  children,
}: {
  label: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block space-y-2">
      <div className="flex items-center justify-between gap-4">
        <span className="text-sm font-semibold text-slate-100">{label}</span>
        {description ? (
          <span className="text-xs text-slate-400">{description}</span>
        ) : null}
      </div>
      {children}
    </label>
  );
}

function RangeField({
  label,
  value,
  min,
  max,
  step = 1,
  onChange,
}: RangeFieldProps) {
  return (
    <label className="block space-y-2">
      <div className="flex items-center justify-between gap-4">
        <span className="text-sm font-semibold text-slate-100">{label}</span>
        <span className="text-xs text-slate-400">{value}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="h-2 w-full cursor-pointer appearance-none rounded-full bg-white/10 accent-orange-400"
      />
    </label>
  );
}

function StudioInput(
  props: React.InputHTMLAttributes<HTMLInputElement> & { className?: string }
) {
  return (
    <input
      {...props}
      className={`w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-orange-400/70 focus:bg-white/10 ${props.className ?? ""}`}
    />
  );
}

export default function CreateDesignStudio() {
  const [personName, setPersonName] = useState(defaultState.personName);
  const [qrUrl, setQrUrl] = useState(defaultState.qrUrl);
  const [frontBackground, setFrontBackground] = useState(defaultState.frontBackground);
  const [backBackground, setBackBackground] = useState(defaultState.backBackground);
  const [textColor, setTextColor] = useState(defaultState.textColor);
  const [logoImage, setLogoImage] = useState<UploadedImage | null>(null);
  const [backgroundImage, setBackgroundImage] = useState<UploadedImage | null>(null);
  const [frontLogoScale, setFrontLogoScale] = useState(defaultState.frontLogoScale);
  const [backLogoScale, setBackLogoScale] = useState(defaultState.backLogoScale);
  const [qrScale, setQrScale] = useState(defaultState.qrScale);
  const [nameSize, setNameSize] = useState(defaultState.nameSize);
  const [poweredBySize, setPoweredBySize] = useState(defaultState.poweredBySize);
  const [frontLogoOffsetY, setFrontLogoOffsetY] = useState(defaultState.frontLogoOffsetY);
  const [backTilt, setBackTilt] = useState(defaultState.backTilt);
  const [backOffsetY, setBackOffsetY] = useState(defaultState.backOffsetY);
  const [overlayStrength, setOverlayStrength] = useState(defaultState.overlayStrength);
  const [logoRemoveBackground, setLogoRemoveBackground] = useState(false);
  const [logoRemoveBgTolerance, setLogoRemoveBgTolerance] = useState(defaultState.logoRemoveBgTolerance);
  const [fontFamily, setFontFamily] = useState(defaultState.fontFamily);
  const [downloadingSide, setDownloadingSide] = useState<"front" | "back" | null>(null);

  const frontRef = useRef<HTMLDivElement>(null);
  const backRef = useRef<HTMLDivElement>(null);

  const [resolvedLogoSrc, setResolvedLogoSrc] = useState<string | null>(null);

  useEffect(() => {
    if (!logoImage?.src) {
      setResolvedLogoSrc(null);
      return;
    }

    if (!logoRemoveBackground) {
      setResolvedLogoSrc(logoImage.src);
      return;
    }

    let cancelled = false;
    const canvas = document.createElement("canvas");
    const image = document.createElement("img");
    image.src = logoImage.src;

    image.onload = () => {
      canvas.width = image.naturalWidth;
      canvas.height = image.naturalHeight;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        if (!cancelled) setResolvedLogoSrc(logoImage.src);
        return;
      }

      ctx.drawImage(image, 0, 0);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;

      for (let i = 0; i < data.length; i += 4) {
        const red = data[i];
        const green = data[i + 1];
        const blue = data[i + 2];
        if (
          red >= logoRemoveBgTolerance &&
          green >= logoRemoveBgTolerance &&
          blue >= logoRemoveBgTolerance
        ) {
          data[i + 3] = 0;
        }
      }

      ctx.putImageData(imageData, 0, 0);
      if (!cancelled) {
        setResolvedLogoSrc(canvas.toDataURL("image/png"));
      }
    };

    image.onerror = () => {
      if (!cancelled) setResolvedLogoSrc(logoImage.src);
    };

    return () => {
      cancelled = true;
    };
  }, [logoImage, logoRemoveBackground, logoRemoveBgTolerance]);

  const frontStyle = useMemo(
    () => ({
      backgroundColor: frontBackground,
      backgroundImage: backgroundImage
        ? `linear-gradient(180deg, rgba(6,10,18,${overlayStrength / 200}), rgba(6,10,18,${overlayStrength / 100})), url(${backgroundImage.src})`
        : `linear-gradient(135deg, ${frontBackground}, #141a22)`,
      backgroundSize: "cover",
      backgroundPosition: "center",
      color: textColor,
    }),
    [backgroundImage, frontBackground, overlayStrength, textColor]
  );

  const backStyle = useMemo(
    () => ({
      backgroundColor: backBackground,
      backgroundImage: backgroundImage
        ? `linear-gradient(180deg, rgba(4,8,15,${overlayStrength / 220}), rgba(4,8,15,${overlayStrength / 90})), url(${backgroundImage.src})`
        : `linear-gradient(135deg, ${backBackground}, #141a22)`,
      backgroundSize: "cover",
      backgroundPosition: "center",
      color: textColor,
    }),
    [backBackground, backgroundImage, overlayStrength, textColor]
  );

  const handleUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
    setter: (image: UploadedImage | null) => void
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const src = await readFileAsDataUrl(file);
    setter({ name: file.name, src });
    event.target.value = "";
  };

  const handleDownload = async (side: "front" | "back") => {
    const node = side === "front" ? frontRef.current : backRef.current;
    if (!node) return;

    setDownloadingSide(side);
    try {
      const canvas = await html2canvas(node, {
        scale: 3,
        backgroundColor: null,
        useCORS: true,
      });

      const link = document.createElement("a");
      link.href = canvas.toDataURL("image/png");
      link.download = buildDownloadName(personName, side);
      link.click();
    } finally {
      setDownloadingSide(null);
    }
  };

  const handleReset = () => {
    setPersonName(defaultState.personName);
    setQrUrl(defaultState.qrUrl);
    setFrontBackground(defaultState.frontBackground);
    setBackBackground(defaultState.backBackground);
    setTextColor(defaultState.textColor);
    setFrontLogoScale(defaultState.frontLogoScale);
    setBackLogoScale(defaultState.backLogoScale);
    setQrScale(defaultState.qrScale);
    setNameSize(defaultState.nameSize);
    setPoweredBySize(defaultState.poweredBySize);
    setFrontLogoOffsetY(defaultState.frontLogoOffsetY);
    setBackTilt(defaultState.backTilt);
    setBackOffsetY(defaultState.backOffsetY);
    setOverlayStrength(defaultState.overlayStrength);
    setLogoRemoveBackground(false);
    setLogoRemoveBgTolerance(defaultState.logoRemoveBgTolerance);
    setFontFamily(defaultState.fontFamily);
    setLogoImage(null);
    setBackgroundImage(null);
  };

  return (
    <section className="min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top,_rgba(245,158,11,0.12),_transparent_24%),linear-gradient(180deg,#050505_0%,#080808_42%,#020202_100%)]">
      <div className="mx-auto max-w-[1600px] px-4 py-8 sm:px-6 lg:px-10 lg:py-12">
        <div className="mb-8 rounded-[28px] border border-amber-400/10 bg-white/[0.03] p-6 shadow-[0_30px_120px_rgba(2,6,23,0.45)] backdrop-blur md:p-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-orange-400/30 bg-orange-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.28em] text-orange-200">
                <Sparkles className="h-3.5 w-3.5" />
                CreateDesign Studio
              </div>
              <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl">
                Build a card that looks like the real product.
              </h1>
              <p className="mt-4 max-w-xl text-sm leading-6 text-slate-300 sm:text-base">
                Simple layout, bigger previews, and the exact front and back
                structure you described for an 85 x 55 mm NFC card.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-sm text-slate-200">
                Final print size: <span className="font-semibold text-white">85 x 55 mm</span>
              </div>
              <button
                type="button"
                onClick={handleReset}
                className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-slate-100 transition hover:bg-white/10"
              >
                <RefreshCcw className="h-4 w-4" />
                Reset
              </button>
            </div>
          </div>
        </div>

        <div className="grid gap-8 xl:grid-cols-[360px_minmax(0,1fr)]">
          <aside className="rounded-[28px] border border-white/10 bg-slate-950/70 p-5 shadow-2xl backdrop-blur md:p-6">
            <div className="mb-6 flex items-center gap-3">
              <div className="rounded-2xl bg-orange-500/15 p-3 text-orange-200">
                <Palette className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-white">Design Controls</h2>
                <p className="text-sm text-slate-400">
                  Keep the clean layout, but fine-tune the details.
                </p>
              </div>
            </div>

            <div className="space-y-5">
              <InputLabel label="Name">
                <StudioInput
                  value={personName}
                  onChange={(event) => setPersonName(event.target.value)}
                  placeholder="Martin Hristov"
                />
              </InputLabel>

              <InputLabel label="QR destination URL">
                <StudioInput
                  value={qrUrl}
                  onChange={(event) => setQrUrl(event.target.value)}
                  placeholder="https://www.ninjacardsnfc.com"
                />
              </InputLabel>

              <div className="grid gap-5 sm:grid-cols-2">
                <InputLabel label="Front color">
                  <StudioInput
                    type="color"
                    value={frontBackground}
                    onChange={(event) => setFrontBackground(event.target.value)}
                    className="h-12 cursor-pointer p-2"
                  />
                </InputLabel>

                <InputLabel label="Back color">
                  <StudioInput
                    type="color"
                    value={backBackground}
                    onChange={(event) => setBackBackground(event.target.value)}
                    className="h-12 cursor-pointer p-2"
                  />
                </InputLabel>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <InputLabel label="Text color">
                  <StudioInput
                    type="color"
                    value={textColor}
                    onChange={(event) => setTextColor(event.target.value)}
                    className="h-12 cursor-pointer p-2"
                  />
                </InputLabel>
              </div>

              <div className="space-y-4 rounded-[24px] border border-white/10 bg-white/[0.03] p-4">
                <div className="text-sm font-semibold text-white">Sizing</div>
                <RangeField
                  label="Front logo size"
                  value={frontLogoScale}
                  min={24}
                  max={72}
                  onChange={setFrontLogoScale}
                />
                <RangeField
                  label="Back logo size"
                  value={backLogoScale}
                  min={14}
                  max={42}
                  onChange={setBackLogoScale}
                />
                <RangeField
                  label="QR size"
                  value={qrScale}
                  min={84}
                  max={180}
                  onChange={setQrScale}
                />
                <RangeField
                  label="Name size"
                  value={nameSize}
                  min={18}
                  max={42}
                  onChange={setNameSize}
                />
                <RangeField
                  label="Powered by size"
                  value={poweredBySize}
                  min={10}
                  max={22}
                  onChange={setPoweredBySize}
                />
              </div>

              <div className="space-y-4 rounded-[24px] border border-white/10 bg-white/[0.03] p-4">
                <div className="text-sm font-semibold text-white">Placement</div>
                <RangeField
                  label="Front logo vertical offset"
                  value={frontLogoOffsetY}
                  min={-20}
                  max={20}
                  onChange={setFrontLogoOffsetY}
                />
                <RangeField
                  label="Back card angle"
                  value={backTilt}
                  min={-2}
                  max={18}
                  onChange={setBackTilt}
                />
                <RangeField
                  label="Back card vertical offset"
                  value={backOffsetY}
                  min={-18}
                  max={12}
                  onChange={setBackOffsetY}
                />
                <RangeField
                  label="Background overlay"
                  value={overlayStrength}
                  min={10}
                  max={85}
                  onChange={setOverlayStrength}
                />
              </div>

              <div className="space-y-4 rounded-[24px] border border-white/10 bg-white/[0.03] p-4">
                <div className="text-sm font-semibold text-white">Typography</div>
                <label className="block space-y-2">
                  <span className="text-sm font-semibold text-slate-100">Font style</span>
                  <select
                    value={fontFamily}
                    onChange={(event) => setFontFamily(event.target.value)}
                    className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition focus:border-orange-400/70 focus:bg-white/10"
                  >
                    {FONT_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value} className="bg-slate-900">
                        {option.label}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <div className="space-y-4 rounded-[24px] border border-white/10 bg-white/[0.03] p-4">
                <div className="flex items-center gap-2 text-sm font-semibold text-white">
                  <Upload className="h-4 w-4 text-orange-300" />
                  Upload assets
                </div>

                <div className="grid gap-4">
                  <InputLabel
                    label="Company logo"
                    description={logoImage?.name ?? "SVG, PNG, or JPG"}
                  >
                    <StudioInput
                      type="file"
                      accept="image/*"
                      onChange={(event) => handleUpload(event, setLogoImage)}
                      className="cursor-pointer file:mr-4 file:rounded-full file:border-0 file:bg-orange-400/15 file:px-3 file:py-2 file:text-xs file:font-semibold file:text-orange-200"
                    />
                  </InputLabel>
                  <label className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-slate-200">
                    <input
                      type="checkbox"
                      checked={logoRemoveBackground}
                      onChange={(event) => setLogoRemoveBackground(event.target.checked)}
                      className="h-4 w-4 rounded border-white/20 bg-transparent accent-orange-400"
                    />
                    <span className="inline-flex items-center gap-2">
                      <Eraser className="h-4 w-4 text-orange-300" />
                      Remove white logo background
                    </span>
                  </label>
                  {logoRemoveBackground ? (
                    <RangeField
                      label="Background remover tolerance"
                      value={logoRemoveBgTolerance}
                      min={180}
                      max={250}
                      onChange={setLogoRemoveBgTolerance}
                    />
                  ) : null}
                  <InputLabel
                    label="Background image"
                    description={backgroundImage?.name ?? "Optional full-card image"}
                  >
                    <StudioInput
                      type="file"
                      accept="image/*"
                      onChange={(event) => handleUpload(event, setBackgroundImage)}
                      className="cursor-pointer file:mr-4 file:rounded-full file:border-0 file:bg-orange-400/15 file:px-3 file:py-2 file:text-xs file:font-semibold file:text-orange-200"
                    />
                  </InputLabel>
                </div>
              </div>
            </div>
          </aside>

          <div className="space-y-6">
            <div className="rounded-[32px] border border-amber-400/10 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.08),_transparent_32%),linear-gradient(180deg,#0a0a0a_0%,#080808_100%)] p-5 shadow-[0_35px_120px_rgba(0,0,0,0.45)] md:p-8">
              <div className="mb-8 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.32em] text-slate-500">
                    Live mockup
                  </p>
                  <h3 className="text-2xl font-semibold text-white">Full-size card preview</h3>
                </div>
                <div className="flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={() => handleDownload("front")}
                    disabled={downloadingSide !== null}
                    className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-900 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <Download className="h-4 w-4" />
                    {downloadingSide === "front" ? "Rendering..." : "Export front"}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDownload("back")}
                    disabled={downloadingSide !== null}
                    className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-900 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <Download className="h-4 w-4" />
                    {downloadingSide === "back" ? "Rendering..." : "Export back"}
                  </button>
                </div>
              </div>

              <div className="relative min-h-[760px] overflow-hidden rounded-[28px] bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.08),_transparent_42%),linear-gradient(180deg,#111111_0%,#050505_100%)] px-6 py-12 sm:px-10">
                <div className="absolute left-1/2 top-1/2 h-[540px] w-[540px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/5 blur-3xl" />
                <div
                  ref={frontRef}
                  className="relative isolate ml-[2%] mt-[24%] aspect-[85/55] w-full max-w-[760px] overflow-hidden rounded-[36px] border border-white/18 p-[5.4%] shadow-[0_30px_90px_rgba(0,0,0,0.45)] sm:mt-[18%]"
                  style={frontStyle}
                >
                  <div className="absolute inset-[5.5%] rounded-[24px] border border-white/25" />
                  <div
                    className="relative z-10 flex h-full items-center justify-center"
                    style={{ transform: `translateY(${frontLogoOffsetY}%)` }}
                  >
                    <div className="flex w-full max-w-[52%] items-center justify-center text-center">
                      {resolvedLogoSrc ? (
                        <img
                          src={resolvedLogoSrc}
                          alt="Uploaded logo"
                          className="max-w-full object-contain"
                          style={{ maxHeight: `${frontLogoScale}%` }}
                        />
                      ) : (
                        <div
                          className="inline-flex items-center gap-2 rounded-full border px-4 py-2 text-[clamp(11px,1.1vw,16px)] font-semibold"
                          style={{ borderColor: `${textColor}66`, color: textColor }}
                        >
                          <ImagePlus className="h-4 w-4" />
                          Add logo
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div
                  ref={backRef}
                  className="relative isolate ml-auto mr-[3%] aspect-[85/55] w-full max-w-[760px] overflow-hidden rounded-[36px] border border-white/18 p-[5.4%] shadow-[0_34px_110px_rgba(0,0,0,0.5)]"
                  style={{
                    ...backStyle,
                    transform: `translateY(${backOffsetY}%) rotate(${backTilt}deg)`,
                    transformOrigin: "center center",
                  }}
                >
                  <div className="absolute inset-[5.5%] rounded-[24px] border border-white/25" />
                  <div className="relative z-10 flex h-full flex-col justify-between">
                    <div className="flex items-start justify-between gap-4">
                      {resolvedLogoSrc ? (
                        <img
                          src={resolvedLogoSrc}
                          alt="Uploaded logo"
                          className="max-w-[36%] object-contain"
                          style={{ maxHeight: `${backLogoScale}%` }}
                        />
                      ) : (
                        <div className="rounded-full border border-white/20 px-3 py-2 text-[clamp(10px,1.1vw,14px)] text-white/70">
                          Brand mark
                        </div>
                      )}

                      <div className="rounded-[18px] bg-white p-[4.5%] shadow-xl">
                        <QRCode
                          value={qrUrl || "https://www.ninjacardsnfc.com"}
                          size={qrScale}
                          fgColor="#111827"
                          bgColor="#ffffff"
                          className="h-auto w-auto"
                          style={{ height: `${qrScale}px`, width: `${qrScale}px`, maxHeight: "32vw", maxWidth: "32vw" }}
                        />
                      </div>
                    </div>

                    <div className="flex items-end justify-between gap-4">
                      <div>
                        <p
                          className="font-semibold"
                          style={{ fontSize: `clamp(18px, ${nameSize / 10}vw, ${nameSize + 8}px)`, fontFamily }}
                        >
                          {personName}
                        </p>
                        <p
                          className="mt-2 text-white/85"
                          style={{ fontSize: `clamp(11px, ${poweredBySize / 14}vw, ${poweredBySize + 2}px)`, fontFamily }}
                        >
                          Powered by Ninja Card
                        </p>
                      </div>

                      <div className="flex h-[clamp(52px,5vw,78px)] w-[clamp(52px,5vw,78px)] items-center justify-center">
                        <div className="relative h-full w-full">
                          {NFC_WAVES.map((wave) => (
                            <div
                              key={wave}
                              className="absolute right-0 top-1/2 -translate-y-1/2 rounded-full border-2 border-l-0"
                              style={{
                                width: `${wave * 24}%`,
                                height: `${wave * 28}%`,
                                borderColor: textColor,
                                opacity: 0.95 - wave * 0.18,
                              }}
                            />
                          ))}
                          <div
                            className="absolute bottom-[24%] right-[4%] h-[16%] w-[16%] rounded-full"
                            style={{ backgroundColor: textColor }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-[28px] border border-white/10 bg-slate-950/65 p-5 backdrop-blur md:p-6">
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-white">Ready for production handoff</h2>
                  <p className="mt-1 text-sm text-slate-400">
                    Front is centered-logo only. Back keeps the clean print
                    structure: logo, QR, name, Ninja Card line, and NFC icon,
                    but now you can tune the sizes and spacing much more deeply.
                  </p>
                </div>
                <div className="flex flex-wrap gap-3 text-sm text-slate-300">
                  <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                    Ratio: <span className="font-semibold text-white">{CARD_RATIO}</span>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                    Assets: <span className="font-semibold text-white">Logo, QR, background</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
