export type AdvisoryRule =
  | "socket_match"
  | "memory_type"
  | "psu_wattage"
  | "gpu_clearance";

export interface CompatibilityAdvisory {
  id: string;
  rule: AdvisoryRule;
  severity: "warning" | "critical";
  title: string;
  message: string;
  affectedSlotIds: string[];
}

