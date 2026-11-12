import { ComponentItem } from "@/lib/types/build";
import { CompatibilityAdvisory } from "./types";

function normalizeSocket(s: string): string {
  return s.toUpperCase().replace(/\s+/g, "");
}

function normalizeMemoryType(m: string): string {
  return m.toUpperCase().replace(/\s+/g, "");
}

/**
 * Pure compatibility rule evaluation engine.
 * STRICT RULE: Only evaluates rules when genuine extracted data exists on both sides.
 * Never guesses or fabricates missing specifications.
 */
export function checkBuildCompatibility(
  components: Record<string, ComponentItem>
): CompatibilityAdvisory[] {
  const advisories: CompatibilityAdvisory[] = [];

  const cpu = components["cpu"];
  const motherboard = components["motherboard"];
  const memory = components["memory"];
  const gpu = components["gpu"];
  const psu = components["psu"];
  const pcCase = components["case"];

  // -------------------------------------------------------------
  // Rule 1: CPU and Motherboard Socket Match
  // -------------------------------------------------------------
  if (cpu?.specs?.socket && motherboard?.specs?.socket) {
    const cpuSocket = normalizeSocket(cpu.specs.socket);
    const mbSocket = normalizeSocket(motherboard.specs.socket);

    if (cpuSocket !== mbSocket) {
      advisories.push({
        id: "advisory-socket-mismatch",
        rule: "socket_match",
        severity: "critical",
        title: "Socket Incompatibility",
        message: `Processor socket (${cpuSocket}) does not match Motherboard socket (${mbSocket}).`,
        affectedSlotIds: ["cpu", "motherboard"],
      });
    }
  }

  // -------------------------------------------------------------
  // Rule 2: Memory Generation Match (DDR4 vs DDR5)
  // -------------------------------------------------------------
  if (motherboard?.specs?.memoryType && memory?.specs?.memoryType) {
    const mbMem = normalizeMemoryType(motherboard.specs.memoryType);
    const ramMem = normalizeMemoryType(memory.specs.memoryType);

    if (
      (mbMem.includes("DDR5") && ramMem.includes("DDR4")) ||
      (mbMem.includes("DDR4") && ramMem.includes("DDR5"))
    ) {
      advisories.push({
        id: "advisory-memory-mismatch",
        rule: "memory_type",
        severity: "critical",
        title: "Memory Type Incompatibility",
        message: `Motherboard requires ${mbMem}, but selected RAM is ${ramMem}.`,
        affectedSlotIds: ["memory", "motherboard"],
      });
    }
  }

  // -------------------------------------------------------------
  // Rule 3: GPU Physical Length vs Case Clearance
  // -------------------------------------------------------------
  if (gpu?.specs?.lengthMm && pcCase?.specs?.maxGpuLengthMm) {
    const gpuLen = gpu.specs.lengthMm;
    const caseMax = pcCase.specs.maxGpuLengthMm;

    if (gpuLen > caseMax) {
      advisories.push({
        id: "advisory-gpu-clearance",
        rule: "gpu_clearance",
        severity: "warning",
        title: "GPU Clearance Warning",
        message: `GPU length (${gpuLen} mm) exceeds case maximum clearance (${caseMax} mm).`,
        affectedSlotIds: ["gpu", "case"],
      });
    }
  }

  // -------------------------------------------------------------
  // Rule 4: Power Supply Wattage vs Estimated System Draw
  // -------------------------------------------------------------
  if (psu?.specs?.psuWattage) {
    const psuWattage = psu.specs.psuWattage;
    const cpuTdp = cpu?.specs?.tdp || 0;
    const gpuTdp = gpu?.specs?.tdp || 0;

    // Only compute if at least CPU or GPU has real TDP extracted
    if (cpuTdp > 0 || gpuTdp > 0) {
      const estimatedDraw = cpuTdp + gpuTdp + 50; // 50W motherboard/fan baseline
      const recommendedPsu = Math.ceil((estimatedDraw * 1.3) / 50) * 50;

      if (psuWattage < estimatedDraw) {
        advisories.push({
          id: "advisory-psu-underpowered",
          rule: "psu_wattage",
          severity: "critical",
          title: "Power Supply Insufficient",
          message: `PSU (${psuWattage}W) is underpowered for estimated system draw (${estimatedDraw}W).`,
          affectedSlotIds: ["psu"],
        });
      } else if (psuWattage < recommendedPsu) {
        advisories.push({
          id: "advisory-psu-headroom",
          rule: "psu_wattage",
          severity: "warning",
          title: "PSU Wattage Advisory",
          message: `PSU ${psuWattage}W may be tight for this configuration (recommended: ${recommendedPsu}W).`,
          affectedSlotIds: ["psu"],
        });
      }
    }
  }

  return advisories;
}

