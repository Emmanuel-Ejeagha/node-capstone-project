export type User = {
  id: string;
  email: string;
  role: string;
  isEmailVerified: boolean;
  created_at: Date;
};

export type DbUserRow = {
  id: string;
  email: string;
  role: string;
  isEmailVerified: boolean;
  created_at: Date;
};

export type DbUserWithPasswordRow = DbUserRow & {
  password_hash: string | null;
};

export type TokenPayload = {
  userId: string;
  email: string;
  role: string;
  purpose?: string;
};
