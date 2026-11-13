"use client";

import * as React from "react";
import Link from "next/link";
import { useBuildStore, calculateBuildTotals, calculateEstimatedWattage } from "@/lib/store/build-store";
import { formatCurrency, convertPrice } from "@/lib/currency/converter";
import { Printer, ArrowLeft, ExternalLink } from "lucide-react";

export default function PrintableA4Page() {
  const store = useBuildStore();
  const [currency, setCurrency] = React.useState<string>(store.currency || "BDT");

  React.useEffect(() => {
    setCurrency(store.currency || "BDT");
  }, [store.currency]);

  const items = Object.values(store.components);
  const totals = calculateBuildTotals(store.components, currency, store.rates, store.dynamicSlots.length);
  const wattage = calculateEstimatedWattage(store.components);

  const docId = `BLD-${Date.now().toString(36).toUpperCase().substring(0, 8)}`;
  const currentDate = new Date().toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="min-h-screen bg-[#E5E5E5] text-black py-6 px-4 print:p-0 print:bg-white flex flex-col items-center">
      {/* Print Control Toolbar (Hidden in Print) */}
      <div className="w-full max-w-[820px] mb-4 flex items-center justify-between print:hidden">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-mono uppercase text-black/70 hover:text-black transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to Builder</span>
        </Link>

        <button
          onClick={() => window.print()}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-black text-white hover:bg-black/85 font-mono text-xs font-medium cursor-pointer shadow-md transition-all active:scale-[0.98]"
        >
          <Printer className="h-4 w-4" />
          <span>Print / Save as PDF</span>
        </button>
      </div>

      {/* A4 Printable Paper Container */}
      <article
        id="a4-manifest"
        className="w-full max-w-[820px] bg-white text-black p-8 sm:p-12 shadow-[0_20px_60px_rgba(0,0,0,0.12)] print:shadow-none print:p-0 print:max-w-none font-sans select-text relative"
      >
        {/* Top Registration Line */}
        <div className="flex items-center justify-between text-[9px] font-mono uppercase tracking-[0.18em] text-black/40 border-b border-black/10 pb-2 mb-4">
          <div className="flex items-center gap-2">
            <span>ANYLINK PC BUILDER // HARDWARE SPECIFICATION REPORT</span>
            <span>•</span>
            <span>REF: {docId}</span>
          </div>
          <div className="font-mono">PAGE 01 / 01</div>
        </div>

        {/* Header Block */}
        <header className="pb-6 border-b border-black/10">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="w-4 h-4 bg-black inline-block" />
                <span className="font-mono text-xl font-bold tracking-tight text-black leading-none">
                  ANYLINK
                </span>
                <span className="font-mono text-xs tracking-widest text-black/50 ml-1">
                  SYSTEM MANIFEST
                </span>
              </div>
              <h1 className="font-mono text-xs uppercase text-black/70 tracking-widest pt-1">
                SYSTEM SPECIFICATION MANIFEST & BILL OF MATERIALS
              </h1>
            </div>

            <div className="sm:text-right font-mono text-[11px] text-black/70 space-y-0.5">
              <div>DOC-ID: <span className="text-black font-semibold">{docId}</span></div>
              <div>DATE: <span className="text-black font-semibold">{currentDate}</span></div>
              <div>CURRENCY: <span className="text-black font-semibold">{currency}</span></div>
            </div>
          </div>

          {/* Project Banner */}
          <div className="mt-5 bg-[#F5F5F5] p-4 rounded-lg flex flex-col sm:flex-row sm:items-end justify-between gap-3">
            <div>
              <div className="font-mono text-[10px] uppercase text-black/50 tracking-wider">
                PROJECT DESIGNATION
              </div>
              <div className="font-mono text-xl font-bold text-black tracking-tight">
                {store.name || "Untitled Build"}
              </div>
            </div>

            <div className="flex items-center gap-3 font-mono text-xs text-black/80">
              <span className="inline-block w-2 h-2 rounded-full bg-black" />
              <span>
                {wattage.hasData ? `SYSTEM DRAW: ${wattage.estimatedTdp}W TDP (EST.)` : "ESTIMATED DRAW: N/A"}
              </span>
            </div>
          </div>
        </header>

        {/* Bill of Materials Table */}
        <section className="mt-6">
          <table className="w-full text-left font-sans text-xs border-collapse">
            <thead>
              <tr className="bg-black text-white font-mono text-[10px] tracking-wider uppercase">
                <th className="py-2.5 px-3 font-medium w-12 text-center" scope="col">#</th>
                <th className="py-2.5 px-3 font-medium w-32" scope="col">Category</th>
                <th className="py-2.5 px-3 font-medium" scope="col">Component Name & Specifications</th>
                <th className="py-2.5 px-3 font-medium w-40" scope="col">Store / Merchant</th>
                <th className="py-2.5 px-3 font-medium text-right w-28" scope="col">Unit Price</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/10">
              {items.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-black/40 font-mono text-xs">
                    No components added to this specification yet.
                  </td>
                </tr>
              ) : (
                items.map((item, idx) => {
                  const converted = convertPrice(
                    item.originalPrice,
                    item.originalCurrency,
                    currency,
                    store.rates
                  );

                  return (
                    <tr key={item.id} className="hover:bg-black/[0.02]">
                      <td className="py-2.5 px-3 font-mono text-[11px] text-center text-black/50">
                        {String(idx + 1).padStart(2, "0")}
                      </td>
                      <td className="py-2.5 px-3 font-mono text-[10px] uppercase font-semibold text-black/80">
                        {item.category}
                      </td>
                      <td className="py-2.5 px-3 space-y-0.5">
                        <div className="font-medium text-black text-xs">{item.name}</div>
                        <div className="font-mono text-[10px] text-black/60 flex flex-wrap gap-2">
                          {item.specs.socket && <span>Socket: {item.specs.socket}</span>}
                          {item.specs.tdp && <span>TDP: {item.specs.tdp}W</span>}
                          {item.specs.capacity && <span>Cap: {item.specs.capacity}</span>}
                          {item.specs.memoryType && <span>RAM: {item.specs.memoryType}</span>}
                        </div>
                      </td>
                      <td className="py-2.5 px-3 font-mono text-[11px] text-black/70">
                        {item.url ? (
                          <a
                            href={item.url}
                            target="_blank"
                            rel="noreferrer noopener"
                            className="inline-flex items-center gap-1 hover:underline text-black"
                          >
                            <span>{item.sourceDomain}</span>
                            <ExternalLink className="h-2.5 w-2.5" />
                          </a>
                        ) : (
                          <span>{item.sourceDomain}</span>
                        )}
                      </td>
                      <td className="py-2.5 px-3 font-mono text-xs font-semibold text-right text-black">
                        {formatCurrency(converted.amount, currency)}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
            <tfoot>
              <tr className="border-t-2 border-black bg-[#FAFAFA]">
                <td colSpan={3} className="py-3 px-3 font-mono text-xs uppercase font-bold">
                  Total Estimated Build Cost
                </td>
                <td className="py-3 px-3 font-mono text-[11px] text-black/60">
                  {totals.itemCount} of {totals.totalSlots} parts
                </td>
                <td className="py-3 px-3 font-mono text-sm font-bold text-right">
                  {formatCurrency(totals.total, currency)}
                </td>
              </tr>
            </tfoot>
          </table>
        </section>

        {/* Footer Audit Notice */}
        <footer className="mt-12 pt-4 border-t border-black/10 flex flex-col sm:flex-row items-center justify-between text-[10px] font-mono text-black/50 gap-2">
          <div>Prices captured from linked stores. Converted to {currency} via real-time market rates.</div>
          <div>ANYLINK PC BUILDER // CERTIFIED EXPORT</div>
        </footer>
      </article>
    </div>
  );
}

