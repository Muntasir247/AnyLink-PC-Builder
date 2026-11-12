import { ComponentCategory } from "@/lib/types/build";

/**
 * Determines component category based on product title, specs, or breadcrumbs.
 */
export function detectCategory(text: string): ComponentCategory {
  const lower = text.toLowerCase();

  // GPU
  if (
    lower.includes("geforce") ||
    lower.includes("rtx ") ||
    lower.includes("gtx ") ||
    lower.includes("radeon") ||
    lower.includes("graphics card") ||
    lower.includes("video card") ||
    lower.includes("gpu")
  ) {
    return "gpu";
  }

  // CPU
  if (
    (lower.includes("processor") || lower.includes("core i") || lower.includes("ryzen") || lower.includes("cpu")) &&
    !lower.includes("cooler") &&
    !lower.includes("fan")
  ) {
    return "cpu";
  }

  // Cooler
  if (
    lower.includes("cooler") ||
    lower.includes("aio") ||
    lower.includes("liquid cooling") ||
    lower.includes("air cooler") ||
    lower.includes("heatsink")
  ) {
    return "cooler";
  }

  // Motherboard
  if (
    lower.includes("motherboard") ||
    lower.includes("mainboard") ||
    lower.includes("b650") ||
    lower.includes("x670") ||
    lower.includes("z790") ||
    lower.includes("b760")
  ) {
    return "motherboard";
  }

  // Memory (RAM)
  if (
    lower.includes("ddr4") ||
    lower.includes("ddr5") ||
    lower.includes("ram") ||
    (lower.includes("memory") && !lower.includes("storage"))
  ) {
    return "memory";
  }

  // Storage
  if (
    lower.includes("nvme") ||
    lower.includes("ssd") ||
    lower.includes("m.2") ||
    lower.includes("solid state drive") ||
    lower.includes("hard drive") ||
    lower.includes("hdd")
  ) {
    return "storage";
  }

  // Power Supply (PSU)
  if (
    lower.includes("power supply") ||
    lower.includes("psu") ||
    lower.includes("80 plus") ||
    lower.includes("80+ gold") ||
    lower.includes("80+ bronze")
  ) {
    return "psu";
  }

  // Case
  if (
    lower.includes("casing") ||
    lower.includes("chassis") ||
    lower.includes("tower case") ||
    lower.includes("mid tower") ||
    lower.includes("atx case") ||
    lower.includes("pc case")
  ) {
    return "case";
  }

  // Fans
  if (
    lower.includes("case fan") ||
    lower.includes("rgb fan") ||
    lower.includes("cooling fan") ||
    lower.includes("120mm fan") ||
    lower.includes("140mm fan")
  ) {
    return "fans";
  }

  return "gpu"; // Default fallback
}

