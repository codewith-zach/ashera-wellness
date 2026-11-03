import { z } from 'zod';

/**
 * Shared size bounds so no route accepts unbounded payloads. The limits are
 * deliberately generous — they exist to reject abuse, not to constrain real
 * journal entries.
 */

export const shortText = z.string().max(200);
export const text = z.string().max(1000);
export const longText = z.string().max(5000);

export const tags = z.array(z.string().max(100)).max(40);
