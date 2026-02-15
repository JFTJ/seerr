export function hasRequiredRoleClaims(
  accessToken: string,
  requiredRoles: string[],
  roleClaimPath: string
): boolean {
  // If no roles are required, allow access by default
  if (!requiredRoles || requiredRoles.length === 0) {
    return true;
  }

  // Check for root level role claim path
  if (!roleClaimPath) {
    return false;
  }

  const payload = decodeJwtPayload(accessToken);
  if (!payload || typeof payload !== 'object') {
    return false;
  }

  const claimValue = getClaimByPath(payload, roleClaimPath);
  const roles = normalizeRoles(claimValue);

  if (roles.length === 0) {
    return false;
  }

  const roleSet = new Set(roles);
  return requiredRoles.every((role) => roleSet.has(role));
}

type JwtPayload = Record<string, unknown>;

function decodeJwtPayload(token: string): JwtPayload | null {
  const parts = token.split('.');
  if (parts.length < 2) {
    return null;
  }

  try {
    const json = base64UrlDecode(parts[1]);
    return JSON.parse(json) as JwtPayload;
  } catch {
    return null;
  }
}

function base64UrlDecode(input: string): string {
  const normalized = input.replace(/-/g, '+').replace(/_/g, '/');
  const padding = normalized.length % 4;
  const padded =
    padding === 0 ? normalized : normalized + '='.repeat(4 - padding);
  return Buffer.from(padded, 'base64').toString('utf-8');
}

function getClaimByPath(payload: JwtPayload, path: string): unknown {
  const segments = path
    .split(/[./]/)
    .map((segment) => segment.trim())
    .filter(Boolean);

  let current: unknown = payload;
  for (const segment of segments) {
    if (!current || typeof current !== 'object') {
      return undefined;
    }

    const record = current as Record<string, unknown>;
    current = record[segment];
  }

  return current;
}

function normalizeRoles(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.filter((item): item is string => typeof item === 'string');
  }

  if (typeof value === 'string') {
    return value
      .split(/[\s,]+/)
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return [];
}
