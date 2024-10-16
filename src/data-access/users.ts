import { database } from "@/db";
import { accounts, User, users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { UserId } from "lucia";
import crypto from "crypto";
import { getAccountByUserId } from "./accounts";

const ITERATIONS = 10000;

export async function deleteUser(userId: UserId) {
  await database.delete(users).where(eq(users.id, userId));
}

export async function getUser(userId: UserId) {
  const user = await database.query.users.findFirst({
    where: eq(users.id, userId),
  });
  return user;
}

async function hashPassword(plainTextPassword: string, salt: string) {
  return new Promise<string>((resolve, reject) => {
    crypto.pbkdf2(
      plainTextPassword,
      salt,
      ITERATIONS,
      64,
      "sha512",
      (err, derivedKey) => {
        if (err) reject(err);
        resolve(derivedKey.toString("hex"));
      }
    );
  });
}

export async function createUser(email: string) {
  const [user] = await database
    .insert(users)
    .values({
      email,
    })
    .returning();
  return user;
}

export async function createMagicUser(email: string) {
  const [user] = await database
    .insert(users)
    .values({
      email,
      emailVerified: new Date(),
    })
    .returning();

  await database
    .insert(accounts)
    .values({
      userId: user.id,
      accountType: "email",
    })
    .returning();

  return user;
}

export async function verifyPassword(email: string, plainTextPassword: string) {
  const user = await getUserByEmail(email);

  if (!user) {
    return false;
  }

  const account = await getAccountByUserId(user.id);

  if (!account) {
    return false;
  }

  const salt = account.salt;
  const savedPassword = account.password;

  if (!salt || !savedPassword) {
    return false;
  }

  const expectedHash = await hashPassword(plainTextPassword, salt);

  return expectedHash === savedPassword;
}

export async function getUserByEmail(email: string) {
  const user = database.query.users.findFirst({
    where: eq(users.email, email),
  });

  return user;
}

export async function setEmailVerified(userId: UserId) {
  await database
    .update(users)
    .set({
      emailVerified: new Date(),
    })
    .where(eq(users.id, userId));
}

export async function updateUser(userId: UserId, updatedUser: Partial<User>) {
  await database.update(users).set(updatedUser).where(eq(users.id, userId));
}
