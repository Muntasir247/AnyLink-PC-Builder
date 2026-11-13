"use client";

import * as React from "react";
import Link from "next/link";
import { useBuildStore, calculateBuildTotals, calculateEstimatedWattage } from "@/lib/store/build-store";
import { formatCurrency, convertPrice } from "@/lib/currency/converter";
import { AnyLinkMark } from "@/components/ui/logo";
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
        className="w-full max-w-[820px] bg-white text-black p-8 sm:p-12 shadow-[0_20px_60px_rgba(0,0,0,0.12)] print:shadow-none print:p-0 print:max-w-none font-sans select-text relative rounded-xl print:rounded-none"
      >
        {/* Header Block */}
        <header className="pb-6 border-b border-black/10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-black text-white flex items-center justify-center shadow-sm">
                <AnyLinkMark size={22} className="text-white" />
              </div>
              <div>
                <div className="font-bold text-xl tracking-tight text-black leading-none">
                  AnyLink
                </div>
                <div className="text-xs text-black/60 pt-1 font-medium">
                  PC Build Specification
                </div>
              </div>
            </div>

            <div className="sm:text-right font-mono text-xs text-black/70 space-y-1">
              <div>Date: <span className="text-black font-semibold">{currentDate}</span></div>
              <div>Currency: <span className="text-black font-semibold">{currency}</span></div>
            </div>
          </div>

          {/* Project Title Card */}
          <div className="mt-5 bg-[#F8F8FA] p-4 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 border border-black/5">
            <div>
              <div className="text-xs font-mono uppercase text-black/50 tracking-wider">
                Build Name
              </div>
              <h1 className="text-xl font-bold text-black tracking-tight mt-0.5">
                {store.name || "Custom PC Build"}
              </h1>
            </div>

            {wattage.hasData && (
              <div className="inline-flex items-center gap-2 text-xs font-semibold text-black bg-white px-3 py-1.5 rounded-lg border border-black/10 shadow-xs">
                <span className="w-2 h-2 rounded-full bg-black inline-block" />
                <span>Estimated Power: {wattage.estimatedTdp}W TDP</span>
              </div>
            )}
          </div>
        </header>

        {/* Components Table */}
        <section className="mt-6">
          <table className="w-full text-left font-sans text-xs border-collapse">
            <thead>
              <tr className="bg-black text-white font-mono text-[11px] tracking-wider uppercase">
                <th className="py-2.5 px-3 font-semibold w-12 text-center" scope="col">#</th>
                <th className="py-2.5 px-3 font-semibold w-28" scope="col">Category</th>
                <th className="py-2.5 px-3 font-semibold" scope="col">Component Name & Specs</th>
                <th className="py-2.5 px-3 font-semibold w-36" scope="col">Store</th>
                <th className="py-2.5 px-3 font-semibold text-right w-28" scope="col">Price</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/10">
              {items.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-black/50 font-mono text-xs">
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
                      <td className="py-3 px-3 font-mono text-xs text-center text-black/50">
                        {String(idx + 1).padStart(2, "0")}
                      </td>
                      <td className="py-3 px-3 font-mono text-xs uppercase font-semibold text-black/80">
                        {item.category}
                      </td>
                      <td className="py-3 px-3 space-y-0.5">
                        <div className="font-semibold text-black text-sm">{item.name}</div>
                        <div className="font-mono text-xs text-black/70 flex flex-wrap gap-2 pt-0.5">
                          {item.specs.socket && <span>Socket: {item.specs.socket}</span>}
                          {item.specs.tdp && <span>TDP: {item.specs.tdp}W</span>}
                          {item.specs.capacity && <span>Cap: {item.specs.capacity}</span>}
                          {item.specs.memoryType && <span>RAM: {item.specs.memoryType}</span>}
                          {item.specs.lengthMm && <span>Length: {item.specs.lengthMm}mm</span>}
                          {item.specs.psuWattage && <span>Wattage: {item.specs.psuWattage}W</span>}
                        </div>
                      </td>
                      <td className="py-3 px-3 font-mono text-xs text-black/80">
                        {item.url ? (
                          <a
                            href={item.url}
                            target="_blank"
                            rel="noreferrer noopener"
                            className="inline-flex items-center gap-1 hover:underline text-black font-medium"
                          >
                            <span>{item.sourceDomain}</span>
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        ) : (
                          <span>{item.sourceDomain}</span>
                        )}
                      </td>
                      <td className="py-3 px-3 font-mono text-xs font-bold text-right text-black">
                        {formatCurrency(converted.amount, currency)}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
            <tfoot>
              <tr className="border-t-2 border-black bg-[#FAFAFA]">
                <td colSpan={3} className="py-3.5 px-3 font-mono text-sm uppercase font-bold text-black">
                  Total Estimated Build Cost
                </td>
                <td className="py-3.5 px-3 font-mono text-xs text-black/70 font-medium">
                  {totals.itemCount} of {totals.totalSlots} parts
                </td>
                <td className="py-3.5 px-3 font-mono text-base font-extrabold text-right text-black">
                  {formatCurrency(totals.total, currency)}
                </td>
              </tr>
            </tfoot>
          </table>
        </section>

        {/* Clean Minimal Footer */}
        <footer className="mt-12 pt-4 border-t border-black/10 flex flex-col sm:flex-row items-center justify-between text-xs text-black/60 gap-2">
          <div>Prices extracted from linked stores · Converted via real-time market rates.</div>
          <div className="font-semibold text-black">AnyLink PC Builder</div>
        </footer>
      </article>
    </div>
  );
}
