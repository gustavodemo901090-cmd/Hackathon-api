import crypto from 'crypto';
import jwt from 'jsonwebtoken';

export interface TokenPayload {
  id: number;
  login: string;
  nome: string;
  perfil: string;
  entityId?: number;
  entityType?: string;
  exp: number;
}

const AUTH_SECRET = crypto.randomBytes(64).toString('hex');

export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.createHash('sha256').update(`${salt}:${password}`).digest('hex');
  return `${salt}:${hash}`;
}

export function buildLoginFromEmail(email: string): string {
  if (email.length <= 50) {
    return email;
  }

  const localPart = (email.split('@')[0] || 'usuario').replace(/[^a-zA-Z0-9]/g, '').slice(0, 41);
  const hash = crypto.createHash('sha1').update(email).digest('hex').slice(0, 8);
  return `${localPart || 'usuario'}-${hash}`.slice(0, 50);
}

export function verifyPassword(password: string, stored: string): boolean {
  if (!stored) return false;

  if (stored.includes(':')) {
    // Formato Node.js: salt:SHA256(salt:password)
    const [salt, hash] = stored.split(':');
    const derived = crypto.createHash('sha256').update(`${salt}:${password}`).digest('hex');
    if (hash.length !== derived.length) return false;
    return crypto.timingSafeEqual(Buffer.from(hash), Buffer.from(derived));
  }

  if (stored.length === 64 && /^[0-9a-f]{64}$/.test(stored)) {
    // Formato Java: SHA-256 puro sem salt (compatibilidade com back office)
    const derived = crypto.createHash('sha256').update(password).digest('hex');
    return crypto.timingSafeEqual(Buffer.from(derived), Buffer.from(stored));
  }

  // Fallback: senha em texto puro (dados de migration legados)
  return password === stored;
}

export function signToken(payload: Omit<TokenPayload, 'exp'>, expiresInSeconds = 60 * 60 * 8): string {
  return jwt.sign(payload, AUTH_SECRET, { expiresIn: expiresInSeconds });
}

export function verifyToken(token: string): TokenPayload | null {
  try {
    return jwt.verify(token, AUTH_SECRET) as TokenPayload;
  } catch {
    return null;
  }
}
