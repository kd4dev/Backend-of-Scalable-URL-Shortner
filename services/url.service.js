import db from "../db/index.js";
import { urlTable } from "../models/url.model.js";
import { usersTable } from "../models/user.model.js";
import { and, eq } from "drizzle-orm";

export async function createUrl(shortCode, targetUrl, userId) {
  const [result] = await db
    .insert(urlTable)
    .values({
      shortCode,
      targetUrl,
      userId,
    })
    .returning({
      id: usersTable.id,
      shortCode: urlTable.shortCode,
      targetUrl: urlTable.targetUrl,
    });
  return result;
}

export async function matchCode(code) {
  const [result] = await db
    .select({
      targetUrl: urlTable.targetUrl,
      shortCode: urlTable.shortCode,
      id: urlTable.id,
    })
    .from(urlTable)
    .where(eq(urlTable.shortCode, code));

  return result;
}
export async function getCodes(userId) {
  const codes = await db
    .select()
    .from(urlTable)
    .where(eq(urlTable.userId, userId));
  return codes;
}

export async function deleteCode(userId, urlShortCode) {
  const[result]=await db
    .delete(urlTable)
    .where(
      and(eq(urlTable.userId, userId), eq(urlTable.shortCode, urlShortCode))
    )
    .returning({urlShortCode:urlTable.shortCode});

    return result;
}

export async function updateCode(oldCode, newCode,userId) {
  const [result]=await db
    .update(urlTable)
    .set({ shortCode: newCode })
    .where(and(eq(urlTable.shortCode, oldCode), eq(urlTable.userId, userId)))
    .returning({id:urlTable.id,
      newCode:urlTable.shortCode
    })
    return result;
}
