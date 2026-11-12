import { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';
import { v4 as uuidv4 } from 'uuid';
import prisma from '../config/prisma.js';
import { env } from '../config/env.js';

const COOKIE_NAME = 'morrow_session_id';
const COOKIE_MAX_AGE = 30 * 24 * 60 * 60 * 1000; // 30 days

declare global {
  namespace Express {
    interface Request {
      demoUserId: string;
      sessionToken: string;
      rawBody?: Buffer;
    }
  }
}

function hashToken(token: string): string {
  return crypto.createHmac('sha256', env.MORROW_SESSION_SECRET).update(token).digest('hex');
}

export async function authSessionMiddleware(req: Request, res: Response, next: NextFunction) {
  try {
    let rawCookieToken = req.signedCookies?.[COOKIE_NAME] || req.cookies?.[COOKIE_NAME];
    let sessionToken: string;
    let demoUserId: string;

    if (rawCookieToken && typeof rawCookieToken === 'string') {
      const hashed = hashToken(rawCookieToken);
      const existingSession = await prisma.demoSession.findUnique({
        where: { sessionTokenHash: hashed },
      });

      if (existingSession && existingSession.expiresAt > new Date()) {
        sessionToken = rawCookieToken;
        demoUserId = existingSession.demoUserId;
      } else {
        // Expired or invalid, create new
        sessionToken = uuidv4();
        demoUserId = `morrow_demo_${uuidv4().replace(/-/g, '').slice(0, 12)}`;
        await prisma.demoSession.create({
          data: {
            sessionTokenHash: hashToken(sessionToken),
            demoUserId,
            expiresAt: new Date(Date.now() + COOKIE_MAX_AGE),
          },
        });
      }
    } else {
      sessionToken = uuidv4();
      demoUserId = `morrow_demo_${uuidv4().replace(/-/g, '').slice(0, 12)}`;
      await prisma.demoSession.create({
        data: {
          sessionTokenHash: hashToken(sessionToken),
          demoUserId,
          expiresAt: new Date(Date.now() + COOKIE_MAX_AGE),
        },
      });
    }

    // Set HTTP-only cookie
    res.cookie(COOKIE_NAME, sessionToken, {
      httpOnly: true,
      secure: env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: COOKIE_MAX_AGE,
      signed: true,
    });

    req.demoUserId = demoUserId;
    req.sessionToken = sessionToken;

    // Ensure financial profile exists for this demo user
    await prisma.financialProfile.upsert({
      where: { demoUserId },
      update: {},
      create: {
        demoUserId,
        currency: 'USD',
        monthlyIncome: 6500,
        availableFunds: 6500,
        essentialExpenses: 3200,
        savingsCommitment: 1000,
        safetyReserve: 500,
      },
    });

    next();
  } catch (error) {
    console.error('Session middleware error:', error);
    next(error);
  }
}
