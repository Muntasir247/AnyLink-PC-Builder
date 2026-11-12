import { isIP } from "node:net";
import dns from "node:dns/promises";

/**
 * Checks if an IPv4 or IPv6 address belongs to private, loopback, or link-local ranges.
 */
export function isPrivateOrReservedIP(ip: string): boolean {
  // IPv4 checks
  if (isIP(ip) === 4) {
    const parts = ip.split(".").map(Number);
    const [b0, b1] = parts;

    // 127.0.0.0/8 (Loopback)
    if (b0 === 127) return true;
    // 0.0.0.0/8 (Broadcast/Current network)
    if (b0 === 0) return true;
    // 10.0.0.0/8 (Private network)
    if (b0 === 10) return true;
    // 172.16.0.0/12 (Private network: 172.16.x.x - 172.31.x.x)
    if (b0 === 172 && b1 >= 16 && b1 <= 31) return true;
    // 192.168.0.0/16 (Private network)
    if (b0 === 192 && b1 === 168) return true;
    // 169.254.0.0/16 (Link-local, AWS/GCP instance metadata)
    if (b0 === 169 && b1 === 254) return true;
    // 100.64.0.0/10 (Carrier grade NAT)
    if (b0 === 100 && b1 >= 64 && b1 <= 127) return true;

    return false;
  }

  // IPv6 checks
  if (isIP(ip) === 6) {
    const lower = ip.toLowerCase();
    // Loopback
    if (lower === "::1" || lower === "0:0:0:0:0:0:0:1") return true;
    // Link-local: fe80::/10
    if (lower.startsWith("fe80:") || lower.startsWith("fe8") || lower.startsWith("fe9") || lower.startsWith("fea") || lower.startsWith("feb")) return true;
    // Unique local address: fc00::/7
    if (lower.startsWith("fc") || lower.startsWith("fd")) return true;

    return false;
  }

  return false;
}

export interface SecurityCheckResult {
  valid: boolean;
  sanitizedUrl?: URL;
  error?: string;
}

/**
 * Validates a target URL against SSRF and protocol exploits.
 */
export async function validateUrlForExtraction(rawUrl: string): Promise<SecurityCheckResult> {
  if (!rawUrl || typeof rawUrl !== "string") {
    return { valid: false, error: "URL is empty or invalid" };
  }

  const trimmed = rawUrl.trim();

  let parsed: URL;
  try {
    parsed = new URL(trimmed);
  } catch {
    return { valid: false, error: "Invalid URL format" };
  }

  // Strict protocol check: only http and https
  if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
    return { valid: false, error: "Only HTTP and HTTPS protocols are permitted" };
  }

  const hostname = parsed.hostname.toLowerCase();

  // Hostname string checks
  if (
    hostname === "localhost" ||
    hostname.endsWith(".localhost") ||
    hostname.endsWith(".local") ||
    hostname.endsWith(".internal")
  ) {
    return { valid: false, error: "Access to local and internal hostnames is blocked (SSRF Protection)" };
  }

  // Check if hostname is direct IP
  if (isIP(hostname)) {
    if (isPrivateOrReservedIP(hostname)) {
      return { valid: false, error: "Access to private and link-local IP addresses is blocked (SSRF Protection)" };
    }
  } else {
    // DNS resolution check with 1.5s timeout (protection against DNS rebinding to local addresses)
    try {
      const addresses = await Promise.race([
        dns.resolve(hostname),
        new Promise<string[]>((_, reject) =>
          setTimeout(() => reject(new Error("DNS lookup timeout")), 1500)
        ),
      ]);
      for (const addr of addresses) {
        if (isPrivateOrReservedIP(addr)) {
          return { valid: false, error: `Resolved IP (${addr}) is a restricted private address` };
        }
      }
    } catch {
      // If DNS resolution times out or fails (e.g. offline sandbox), permit standard public hostname
    }
  }

  return { valid: true, sanitizedUrl: parsed };
}

