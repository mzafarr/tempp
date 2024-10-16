import {
  MAX_UPLOAD_IMAGE_SIZE,
  MAX_UPLOAD_IMAGE_SIZE_IN_MB,
  applicationName,
} from "@/app-config";
import {
  createUser,
  deleteUser,
  getUserByEmail,
  updateUser,
  verifyPassword,
} from "@/data-access/users";
import { UserId, UserSession } from "@/use-cases/types";
import { createUUID } from "@/utils/uuid";
import { env } from "@/env";
import {
  createAccount,
  createAccountViaGoogle,
  updatePassword,
} from "@/data-access/accounts";
import {
  uniqueNamesGenerator,
  Config,
  colors,
  animals,
} from "unique-names-generator";
import {
  createProfile,
  getProfile,
  updateProfile,
} from "@/data-access/profiles";
import { GoogleUser } from "@/app/api/login/google/callback/route";
// import { GitHubUser } from "@/app/api/login/github/callback/route";
import { sendEmail } from "@/lib/send-email";
import {
  createPasswordResetToken,
  deletePasswordResetToken,
  getPasswordResetToken,
} from "@/data-access/reset-tokens";
import { ResetPasswordEmail } from "@/emails/reset-password";
import {
  createVerifyEmailToken,
  deleteVerifyEmailToken,
  getVerifyEmailToken,
} from "@/data-access/verify-email";
import { VerifyEmail } from "@/emails/verify-email";
import { createTransaction } from "@/data-access/utils";
import { LoginError, PublicError } from "./errors";
import { deleteSessionForUser } from "@/data-access/sessions";

export async function deleteUserUseCase(
  authenticatedUser: UserSession,
  userToDeleteId: UserId
): Promise<void> {
  if (authenticatedUser.id !== userToDeleteId) {
    throw new PublicError("You can only delete your own account");
  }

  await deleteUser(userToDeleteId);
}

export async function getUserProfileUseCase(userId: UserId) {
  const profile = await getProfile(userId);

  if (!profile) {
    throw new PublicError("User not found");
  }

  return profile;
}

export async function registerUserUseCase(email: string, password: string, fullName: string) {
  const existingUser = await getUserByEmail(email);
  if (existingUser) {
    throw new PublicError("An user with that email already exists.");
  }
  const user = await createUser(email);
  await createAccount(user.id, password);

  const displayName = fullName
  await createProfile(user.id, displayName);

  const token = await createVerifyEmailToken(user.id);
  await sendEmail(
    email,
    `Verify your email for ${applicationName}`,
    // <VerifyEmail token={token} />
    VerifyEmail({ token })
  );

  return { id: user.id };
}

export async function signInUseCase(email: string, password: string) {
  const user = await getUserByEmail(email);

  if (!user) {
    throw new LoginError();
  }

  const isPasswordCorrect = await verifyPassword(email, password);

  if (!isPasswordCorrect) {
    throw new LoginError();
  }

  return { id: user.id };
}

export async function createGoogleUserUseCase(googleUser: GoogleUser) {
  let existingUser = await getUserByEmail(googleUser.email);

  if (!existingUser) {
    existingUser = await createUser(googleUser.email);
  }

  await createAccountViaGoogle(existingUser.id, googleUser.sub);

  await createProfile(existingUser.id, googleUser.name, googleUser.picture);

  return existingUser.id;
}

export async function resetPasswordUseCase(email: string) {
  const user = await getUserByEmail(email);

  if (!user) {
    return null;
  }

  const token = await createPasswordResetToken(user.id);

  await sendEmail(
    email,
    `Your password reset link for ${applicationName}`,
    // <ResetPasswordEmail token={token} />
    ResetPasswordEmail({ token })
  );
}

export async function changePasswordUseCase(token: string, password: string) {
  const tokenEntry = await getPasswordResetToken(token);

  if (!tokenEntry) {
    throw new PublicError("Invalid token");
  }

  const userId = tokenEntry.userId;

  await createTransaction(async (trx) => {
    await deletePasswordResetToken(token, trx);
    await updatePassword(userId, password, trx);
    await deleteSessionForUser(userId, trx);
  });
}

export async function verifyEmailUseCase(token: string) {
  const tokenEntry = await getVerifyEmailToken(token);

  if (!tokenEntry) {
    throw new PublicError("Invalid token");
  }

  const userId = tokenEntry.userId;

  await updateUser(userId, { emailVerified: new Date() });
  await deleteVerifyEmailToken(token);
  return userId;
}
