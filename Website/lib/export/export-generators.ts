import { ComponentItem } from "@/lib/types/build";
import { convertPrice, formatCurrency } from "@/lib/currency/converter";
import { calculateBuildTotals, calculateEstimatedWattage } from "@/lib/store/build-store";

/**
 * Generates an RFC 4180 compliant CSV string of the PC build.
 */
export function generateCSV(
  buildName: string,
  components: Record<string, ComponentItem>,
  currency: string,
  rates: Record<string, number>
): string {
  const items = Object.values(components);
  const totals = calculateBuildTotals(components, currency, rates);

  const escapeCSV = (field: string | number | undefined): string => {
    if (field === undefined || field === null) return '""';
    const str = String(field).replace(/"/g, '""');
    return `"${str}"`;
  };

  const headers = [
    "Slot",
    "Category",
    "Component Name",
    "Store / Domain",
    `Original Price`,
    `Original Currency`,
    `Converted Price (${currency})`,
    "Store URL",
    "Key Specifications",
  ];

  const rows = items.map((item) => {
    const converted = convertPrice(
      item.originalPrice,
      item.originalCurrency,
      currency,
      rates
    );

    const specsList: string[] = [];
    if (item.specs.socket) specsList.push(`Socket: ${item.specs.socket}`);
    if (item.specs.tdp) specsList.push(`TDP: ${item.specs.tdp}W`);
    if (item.specs.memoryType) specsList.push(`Memory: ${item.specs.memoryType}`);
    if (item.specs.capacity) specsList.push(`Capacity: ${item.specs.capacity}`);
    if (item.specs.lengthMm) specsList.push(`Length: ${item.specs.lengthMm}mm`);
    if (item.specs.psuWattage) specsList.push(`Wattage: ${item.specs.psuWattage}W`);

    return [
      escapeCSV(item.slotId),
      escapeCSV(item.category.toUpperCase()),
      escapeCSV(item.name),
      escapeCSV(item.sourceDomain),
      escapeCSV(item.originalPrice),
      escapeCSV(item.originalCurrency),
      escapeCSV(converted.amount),
      escapeCSV(item.url),
      escapeCSV(specsList.join("; ")),
    ].join(",");
  });

  const summaryRows = [
    "",
    `"TOTAL ESTIMATE",,,,,,"${totals.total}"`,
    `"CURRENCY","${currency}"`,
    `"TOTAL PARTS","${items.length}"`,
    `"DATE GENERATED","${new Date().toISOString()}"`,
  ];

  return [headers.map(escapeCSV).join(","), ...rows, ...summaryRows].join("\n");
}

/**
 * Generates a clean Markdown table representation of the PC build.
 */
export function generateMarkdownText(
  buildName: string,
  components: Record<string, ComponentItem>,
  currency: string,
  rates: Record<string, number>
): string {
  const items = Object.values(components);
  const totals = calculateBuildTotals(components, currency, rates);
  const wattage = calculateEstimatedWattage(components);

  let md = `# ${buildName}\n\n`;
  md += `**Date:** ${new Date().toLocaleDateString()}  \n`;
  md += `**Total Estimate:** ${formatCurrency(totals.total, currency)}  \n`;
  if (wattage.hasData) {
    md += `**Estimated System Draw:** ${wattage.estimatedTdp}W TDP (Recommended PSU: ${wattage.recommendedPsu}W)  \n`;
  }
  md += `\n| Category | Component | Store | Price (${currency}) |\n`;
  md += `| :--- | :--- | :--- | :--- |\n`;

  for (const item of items) {
    const converted = convertPrice(item.originalPrice, item.originalCurrency, currency, rates);
    const link = item.url ? `[${item.sourceDomain}](${item.url})` : item.sourceDomain;
    md += `| ${item.category.toUpperCase()} | ${item.name} | ${link} | ${formatCurrency(converted.amount, currency)} |\n`;
  }

  md += `| **TOTAL** | | | **${formatCurrency(totals.total, currency)}** |\n\n`;
  md += `*Generated via AnyLink PC Builder*\n`;

  return md;
}

/**
 * Triggers a file download in the browser.
 */
export function downloadFile(content: string, filename: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
