export type Plan = "free" | "basic" | "premium";
export type Role = "owner" | "admin" | "member";

export type UserProfile = {
  id: UserId;
  name: string | null;
  image: string | null;
};

export type UserId = number;

export type UserSession = {
  id: UserId;
};

export type MemberInfo = {
  userId: UserId;
  role: Role;
  name: string | null;
  image: string | null;
};
