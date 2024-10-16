import { relations } from "drizzle-orm";
import {
  timestamp,
  text,
  pgEnum,
  serial,
  pgTable,
  integer,
  customType,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

const bytea = customType({
  dataType() {
    return "bytea";
  },
});

export const roleEnum = pgEnum("role", ["member", "admin"]);
export const accountTypeEnum = pgEnum("type", ["email", "google"]);
export const messageTypeEnum = pgEnum("messageType", ["user", "bot"]);
export const contentTypeEnum = pgEnum("contentType", ["text", "voice"]);

export const users = pgTable("user", {
  id: serial("id").primaryKey(),
  email: text("email").unique(),
  emailVerified: timestamp("emailVerified", { mode: "date" }),
  freeUsesLeft: integer("freeUsesLeft").notNull().default(5),
});

export const accounts = pgTable("accounts", {
  id: serial("id").primaryKey(),
  userId: integer("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  accountType: accountTypeEnum("accountType").notNull(),
  googleId: text("googleId").unique(),
  password: text("password"),
  salt: text("salt"),
});

export const magicLinks = pgTable("magic_links", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  token: text("token"),
  tokenExpiresAt: timestamp("tokenExpiresAt", { mode: "date" }),
});

export const resetTokens = pgTable("reset_tokens", {
  id: serial("id").primaryKey(),
  userId: integer("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" })
    .unique(),
  token: text("token"),
  tokenExpiresAt: timestamp("tokenExpiresAt", { mode: "date" }),
});

export const verifyEmailTokens = pgTable("verify_email_tokens", {
  id: serial("id").primaryKey(),
  userId: integer("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" })
    .unique(),
  token: text("token"),
  tokenExpiresAt: timestamp("tokenExpiresAt", { mode: "date" }),
});

export const profiles = pgTable("profile", {
  id: serial("id").primaryKey(),
  userId: integer("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" })
    .unique(),
  displayName: text("displayName"),
  imageId: text("imageId"),
  image: text("image"),
  bio: text("bio").notNull().default(""),
});

export const sessions = pgTable("session", {
  id: text("id").primaryKey(),
  userId: integer("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expiresAt: timestamp("expires_at", {
    withTimezone: true,
    mode: "date",
  }).notNull(),
});

export const subscriptions = pgTable("subscriptions", {
  id: serial("id").primaryKey(),
  userId: integer("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" })
    .unique(),
  stripeSubscriptionId: text("stripeSubscriptionId").notNull(),
  stripeCustomerId: text("stripeCustomerId").notNull(),
  stripePriceId: text("stripePriceId").notNull(),
  stripeCurrentPeriodEnd: timestamp("expires", { mode: "date" }).notNull(),
});

export const chats = pgTable("chats", {
  id: serial("id").primaryKey(),
  userId: integer("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  createdAt: timestamp("createdAt", { mode: "date" })
    .defaultNow()
    .notNull(),
  title: text("title"),
});

export const messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  chatId: integer("chatId")
    .notNull()
    .references(() => chats.id, { onDelete: "cascade" }),
  content: text("content"), // For text messages
  voiceMessage: bytea("voiceMessage"), // For storing voice message binary data
  contentType: contentTypeEnum("contentType").notNull(), // Whether it's text or voice
  messageType: messageTypeEnum("messageType").notNull(),
  createdAt: timestamp("createdAt", { mode: "date" })
    .defaultNow()
    .notNull(),
});

/**
 * RELATIONS
 */
export const usersRelations = relations(users, ({ many }) => ({
  accounts: many(accounts),
  chats: many(chats),
  profiles: many(profiles),
  sessions: many(sessions),
  subscriptions: many(subscriptions),
}));

export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, {
    fields: [accounts.userId],
    references: [users.id],
  }),
}));

export const chatsRelations = relations(chats, ({ one, many }) => ({
  user: one(users, {
    fields: [chats.userId],
    references: [users.id],
  }),
  messages: many(messages),
}));

export const messagesRelations = relations(messages, ({ one }) => ({
  chat: one(chats, {
    fields: [messages.chatId],
    references: [chats.id],
  }),
}));

/**
 * TYPES
 */
export type Subscription = typeof subscriptions.$inferSelect;
export type User = typeof users.$inferSelect;
export type Profile = typeof profiles.$inferSelect;
export type Chat = typeof chats.$inferSelect;
export type Message = typeof messages.$inferSelect;
