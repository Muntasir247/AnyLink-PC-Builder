"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ComponentItem } from "@/lib/types/build";
import { calculateBuildTotals, calculateEstimatedWattage } from "@/lib/store/build-store";
import { formatCurrency, convertPrice } from "@/lib/currency/converter";
import {
  generateCSV,
  generateMarkdownText,
  downloadFile,
} from "@/lib/export/export-generators";
import { generateShareCode } from "@/lib/builds/build-service";
import {
  Link2,
  FileText,
  Table,
  Image as ImageIcon,
  Copy,
  Lock,
  Check,
  Download,
  ArrowRight,
  ExternalLink,
} from "lucide-react";

export type ExportFormat = "share-link" | "pdf" | "csv" | "image" | "text";

export interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  buildName: string;
  onBuildNameChange: (name: string) => void;
  components: Record<string, ComponentItem>;
  currency: string;
  rates: Record<string, number>;
  isGuest: boolean;
  onRequireAccount?: () => void;
}

export function ExportModal({
  isOpen,
  onClose,
  buildName,
  onBuildNameChange,
  components,
  currency,
  rates,
  isGuest,
  onRequireAccount,
}: ExportModalProps) {
  const router = useRouter();

  const [selectedFormat, setSelectedFormat] = React.useState<ExportFormat>("pdf");
  const [isSuccessState, setIsSuccessState] = React.useState(false);
  const [generatedFile, setGeneratedFile] = React.useState<{ name: string; size: string } | null>(null);
  const [shareUrl, setShareUrl] = React.useState("");
  const [copiedLink, setCopiedLink] = React.useState(false);

  const items = Object.values(components);
  const totals = calculateBuildTotals(components, currency, rates);
  const wattage = calculateEstimatedWattage(components);

  React.useEffect(() => {
    if (isOpen) {
      setIsSuccessState(false);
      setCopiedLink(false);
    }
  }, [isOpen]);

  const handleExport = async () => {
    const slug = buildName.trim().replace(/\s+/g, "-") || "My-Build";

    if (selectedFormat === "share-link") {
      if (isGuest) {
        onClose();
        onRequireAccount?.();
        return;
      }
      // Logged in user: generate or fetch share code
      const code = generateShareCode();
      const fullUrl = `${window.location.origin}/b/${code}`;
      setShareUrl(fullUrl);
      setIsSuccessState(true);
      return;
    }

    if (selectedFormat === "pdf") {
      // Open clean A4 printable view
      window.open("/export/pdf", "_blank");
      setGeneratedFile({ name: `${slug}-spec-sheet.pdf`, size: "A4 Printable" });
      const code = generateShareCode();
      setShareUrl(`${window.location.origin}/b/${code}`);
      setIsSuccessState(true);
      return;
    }

    if (selectedFormat === "csv") {
      const csvContent = generateCSV(buildName, components, currency, rates);
      const filename = `${slug}.csv`;
      downloadFile(csvContent, filename, "text/csv;charset=utf-8;");
      setGeneratedFile({ name: filename, size: `${(csvContent.length / 1024).toFixed(1)} KB` });
      const code = generateShareCode();
      setShareUrl(`${window.location.origin}/b/${code}`);
      setIsSuccessState(true);
      return;
    }

    if (selectedFormat === "text") {
      const mdContent = generateMarkdownText(buildName, components, currency, rates);
      await navigator.clipboard.writeText(mdContent);
      setGeneratedFile({ name: `${slug}.md`, size: "Copied to Clipboard" });
      const code = generateShareCode();
      setShareUrl(`${window.location.origin}/b/${code}`);
      setIsSuccessState(true);
      return;
    }

    if (selectedFormat === "image") {
      // For social image, open PDF or text
      window.open("/export/pdf", "_blank");
      setGeneratedFile({ name: `${slug}-social.png`, size: "1200 x 630 px" });
      const code = generateShareCode();
      setShareUrl(`${window.location.origin}/b/${code}`);
      setIsSuccessState(true);
    }
  };

  const handleCopyShareLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    } catch {
      prompt("Copy link:", shareUrl);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isSuccessState ? undefined : "Export Specification"}
      description={
        isSuccessState
          ? undefined
          : "Generate public share links, clean A4 printable sheets, or tabular spreadsheets."
      }
      maxWidth="2xl"
    >
      {isSuccessState ? (
        /* Flow 12: Success Confirmation State */
        <div className="space-y-6 text-center py-2 animate-in fade-in">
          {/* Success Checkmark Glyph */}
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-foreground text-background shadow-md">
            <Check className="h-7 w-7 stroke-[2.5]" />
          </div>

          <div className="space-y-1">
            <h2 className="text-xl font-bold text-foreground tracking-tight">
              Your build is ready
            </h2>
            {generatedFile && (
              <p className="text-xs font-mono text-on-surface-variant">
                {generatedFile.name} • {generatedFile.size}
              </p>
            )}
          </div>

          {/* Share Link Input */}
          <div className="max-w-md mx-auto p-4 rounded-control bg-surface-highest/40 border border-outline space-y-2 text-left">
            <label className="text-[10px] font-mono uppercase tracking-wider text-on-surface-variant block">
              Public Share URL
            </label>
            <div className="flex items-center gap-2">
              <input
                readOnly
                value={shareUrl}
                className="h-9 flex-1 rounded-lg bg-surface px-3 font-mono text-xs text-foreground border border-outline focus:outline-none select-all"
              />
              <Button
                variant="solid"
                size="sm"
                onClick={handleCopyShareLink}
                className="h-9 px-3 text-xs"
              >
                {copiedLink ? "Copied ✓" : "Copy link"}
              </Button>
            </div>
          </div>

          {/* Secondary Actions */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Button
              variant="glass"
              size="sm"
              onClick={() => setIsSuccessState(false)}
            >
              Export another format
            </Button>
            <Button variant="solid" size="sm" onClick={onClose}>
              Back to build
            </Button>
          </div>
        </div>
      ) : (
        /* Flow 11: Export Configuration & Live Summary Preview */
        <div className="space-y-6">
          {/* Build Name Inline Input */}
          <div className="space-y-1">
            <label className="text-xs font-mono uppercase tracking-wider text-on-surface-variant font-semibold">
              Build Name
            </label>
            <Input
              value={buildName}
              onChange={(e) => onBuildNameChange(e.target.value)}
              placeholder="e.g. Gaming Rig AM5"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-start">
            {/* Left: Live Document Glass Preview */}
            <div className="md:col-span-5 rounded-2xl bg-surface-highest/40 border border-outline p-4 space-y-3 font-mono text-xs">
              <div className="flex items-center justify-between text-xs text-on-surface-variant font-semibold border-b border-outline/30 pb-2">
                <span>ANYLINK BUILD SUMMARY</span>
                <span>{currency}</span>
              </div>

              <div className="font-semibold text-foreground truncate">
                {buildName}
              </div>

              {/* Compact parts list preview */}
              <div className="space-y-1.5 max-h-48 overflow-y-auto no-scrollbar py-1">
                {items.length === 0 ? (
                  <div className="text-on-surface-muted text-[11px]">No parts added</div>
                ) : (
                  items.map((item) => {
                    const conv = convertPrice(item.originalPrice, item.originalCurrency, currency, rates);
                    return (
                      <div key={item.id} className="flex items-center justify-between text-[11px] gap-2">
                        <span className="truncate text-on-surface-variant">{item.name}</span>
                        <span className="font-semibold text-foreground shrink-0">
                          {formatCurrency(conv.amount, currency)}
                        </span>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Preview Footer */}
              <div className="pt-2 border-t border-outline/30 flex items-center justify-between font-semibold">
                <span className="text-xs uppercase text-on-surface-variant font-semibold">Estimated Total</span>
                <span className="text-foreground">{formatCurrency(totals.total, currency)}</span>
              </div>
            </div>

            {/* Right: 5 Export Output Destinations */}
            <div className="md:col-span-7 space-y-2">
              <span className="text-xs font-mono uppercase tracking-wider text-on-surface-variant font-semibold block mb-1">
                Select Format
              </span>

              {/* Option 1: Share Link */}
              <div
                onClick={() => setSelectedFormat("share-link")}
                className={`p-3 rounded-control border transition-all cursor-pointer flex items-center justify-between ${
                  selectedFormat === "share-link"
                    ? "bg-surface-highest border-foreground shadow-sm"
                    : "bg-surface/40 hover:bg-surface/70 border-outline"
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="h-8 w-8 rounded-lg bg-surface-highest border border-outline flex items-center justify-center shrink-0">
                    <Link2 className="h-4 w-4 text-foreground" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium text-foreground">Share link</span>
                      {isGuest && (
                        <span className="inline-flex items-center gap-0.5 px-1.5 py-0.2 rounded-full bg-surface-highest border border-outline font-mono text-[9px] text-on-surface-muted uppercase">
                          <Lock className="h-2.5 w-2.5" />
                          <span>Account required</span>
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-on-surface-variant truncate">
                      Generate public read-only link (/b/...)
                    </p>
                  </div>
                </div>
                {selectedFormat === "share-link" && <Check className="h-4 w-4 text-foreground" />}
              </div>

              {/* Option 2: PDF Document */}
              <div
                onClick={() => setSelectedFormat("pdf")}
                className={`p-3 rounded-control border transition-all cursor-pointer flex items-center justify-between ${
                  selectedFormat === "pdf"
                    ? "bg-surface-highest border-foreground shadow-sm"
                    : "bg-surface/40 hover:bg-surface/70 border-outline"
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="h-8 w-8 rounded-lg bg-surface-highest border border-outline flex items-center justify-center shrink-0">
                    <FileText className="h-4 w-4 text-foreground" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-xs font-medium text-foreground">PDF Document</span>
                    <p className="text-[11px] text-on-surface-variant truncate">
                      High-resolution printable A4 specification sheet
                    </p>
                  </div>
                </div>
                {selectedFormat === "pdf" && <Check className="h-4 w-4 text-foreground" />}
              </div>

              {/* Option 3: Spreadsheet (CSV) */}
              <div
                onClick={() => setSelectedFormat("csv")}
                className={`p-3 rounded-control border transition-all cursor-pointer flex items-center justify-between ${
                  selectedFormat === "csv"
                    ? "bg-surface-highest border-foreground shadow-sm"
                    : "bg-surface/40 hover:bg-surface/70 border-outline"
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="h-8 w-8 rounded-lg bg-surface-highest border border-outline flex items-center justify-center shrink-0">
                    <Table className="h-4 w-4 text-foreground" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-xs font-medium text-foreground">Spreadsheet (CSV)</span>
                    <p className="text-[11px] text-on-surface-variant truncate">
                      Structured tabular data with store URLs & SKUs
                    </p>
                  </div>
                </div>
                {selectedFormat === "csv" && <Check className="h-4 w-4 text-foreground" />}
              </div>

              {/* Option 4: Image for Social */}
              <div
                onClick={() => setSelectedFormat("image")}
                className={`p-3 rounded-control border transition-all cursor-pointer flex items-center justify-between ${
                  selectedFormat === "image"
                    ? "bg-surface-highest border-foreground shadow-sm"
                    : "bg-surface/40 hover:bg-surface/70 border-outline"
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="h-8 w-8 rounded-lg bg-surface-highest border border-outline flex items-center justify-center shrink-0">
                    <ImageIcon className="h-4 w-4 text-foreground" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-xs font-medium text-foreground">Image for social</span>
                    <p className="text-[11px] text-on-surface-variant truncate">
                      High-contrast clean summary card image
                    </p>
                  </div>
                </div>
                {selectedFormat === "image" && <Check className="h-4 w-4 text-foreground" />}
              </div>

              {/* Option 5: Copy as Text */}
              <div
                onClick={() => setSelectedFormat("text")}
                className={`p-3 rounded-control border transition-all cursor-pointer flex items-center justify-between ${
                  selectedFormat === "text"
                    ? "bg-surface-highest border-foreground shadow-sm"
                    : "bg-surface/40 hover:bg-surface/70 border-outline"
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="h-8 w-8 rounded-lg bg-surface-highest border border-outline flex items-center justify-center shrink-0">
                    <Copy className="h-4 w-4 text-foreground" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-xs font-medium text-foreground">Copy as Markdown</span>
                    <p className="text-[11px] text-on-surface-variant truncate">
                      Formatted markdown table copied to clipboard
                    </p>
                  </div>
                </div>
                {selectedFormat === "text" && <Check className="h-4 w-4 text-foreground" />}
              </div>
            </div>
          </div>

          {/* Modal Footer */}
          <div className="flex justify-end gap-2.5 pt-4 border-t border-outline/30">
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button variant="solid" onClick={handleExport}>
              <span>Export</span>
              <ArrowRight className="h-4 w-4 ml-1.5" />
            </Button>
          </div>
        </div>
      )}
    </Modal>
  );
}

