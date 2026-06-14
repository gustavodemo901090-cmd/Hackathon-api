import crypto from 'crypto';

export interface TokenPayload {
  id: number;
  login: string;
  nome: string;
  perfil: string;
  entityId?: number;
  entityType?: string;
  exp: number;
}

const SECRET = process.env.AUTH_SECRET || 'portal-estagios-secret';

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
  const fullPayload: TokenPayload = {
    ...payload,
    exp: Math.floor(Date.now() / 1000) + expiresInSeconds,
  };

  const encodedPayload = Buffer.from(JSON.stringify(fullPayload)).toString('base64url');
  const signature = crypto.createHmac('sha256', SECRET).update(encodedPayload).digest('base64url');
  return `${encodedPayload}.${signature}`;
}

export function verifyToken(token: string): TokenPayload | null {
  const [encodedPayload, signature] = token.split('.');
  if (!encodedPayload || !signature) return null;

  const expected = crypto.createHmac('sha256', SECRET).update(encodedPayload).digest('base64url');
  if (signature.length !== expected.length) return null;
  if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) {
    return null;
  }

  try {
    const payload = JSON.parse(Buffer.from(encodedPayload, 'base64url').toString('utf8')) as TokenPayload;
    if (!payload.exp || payload.exp < Math.floor(Date.now() / 1000)) return null;
    return payload;
  } catch {
    return null;
  }
}
