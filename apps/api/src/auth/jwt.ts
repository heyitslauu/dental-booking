import { createHmac, timingSafeEqual } from "crypto";
import { UnauthorizedException } from "@nestjs/common";
import { UserRole } from "@prisma/client";

export type AuthTokenPayload = {
  email: string;
  role: UserRole;
  sub: string;
  exp: number;
};

const jwtAlgorithm = "HS256";

function getJwtSecret() {
  return process.env.JWT_SECRET || "local-development-admin-secret";
}

function base64UrlEncode(value: Buffer | string) {
  return Buffer.from(value)
    .toString("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
}

function base64UrlDecode(value: string) {
  const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
  const padded = normalized.padEnd(
    normalized.length + ((4 - (normalized.length % 4)) % 4),
    "="
  );

  return Buffer.from(padded, "base64").toString("utf8");
}

function signData(data: string) {
  return base64UrlEncode(
    createHmac("sha256", getJwtSecret()).update(data).digest()
  );
}

export function signAccessToken(
  payload: Omit<AuthTokenPayload, "exp">,
  expiresInSeconds = 60 * 60 * 8
) {
  const header = {
    alg: jwtAlgorithm,
    typ: "JWT"
  };
  const tokenPayload: AuthTokenPayload = {
    ...payload,
    exp: Math.floor(Date.now() / 1000) + expiresInSeconds
  };
  const encodedHeader = base64UrlEncode(JSON.stringify(header));
  const encodedPayload = base64UrlEncode(JSON.stringify(tokenPayload));
  const data = `${encodedHeader}.${encodedPayload}`;

  return `${data}.${signData(data)}`;
}

export function verifyAccessToken(token: string): AuthTokenPayload {
  try {
    const [encodedHeader, encodedPayload, signature] = token.split(".");

    if (!encodedHeader || !encodedPayload || !signature) {
      throw new UnauthorizedException("Invalid access token.");
    }

    const data = `${encodedHeader}.${encodedPayload}`;
    const expectedSignature = signData(data);
    const signatureBuffer = Buffer.from(signature);
    const expectedSignatureBuffer = Buffer.from(expectedSignature);

    if (
      signatureBuffer.length !== expectedSignatureBuffer.length ||
      !timingSafeEqual(signatureBuffer, expectedSignatureBuffer)
    ) {
      throw new UnauthorizedException("Invalid access token.");
    }

    const header = JSON.parse(base64UrlDecode(encodedHeader)) as { alg?: string };

    if (header.alg !== jwtAlgorithm) {
      throw new UnauthorizedException("Invalid access token.");
    }

    const payload = JSON.parse(
      base64UrlDecode(encodedPayload)
    ) as AuthTokenPayload;

    const hasAdminRole =
      payload.role === UserRole.SUPER_ADMIN ||
      payload.role === UserRole.ORG_ADMIN ||
      payload.role === UserRole.STAFF;

    if (!payload.sub || !hasAdminRole) {
      throw new UnauthorizedException("Admin access is required.");
    }

    if (!payload.exp || payload.exp <= Math.floor(Date.now() / 1000)) {
      throw new UnauthorizedException("Access token has expired.");
    }

    return payload;
  } catch (error) {
    if (error instanceof UnauthorizedException) {
      throw error;
    }

    throw new UnauthorizedException("Invalid access token.");
  }
}
