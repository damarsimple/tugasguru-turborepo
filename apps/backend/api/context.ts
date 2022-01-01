import { PrismaClient, User } from "@prisma/client";

export const prisma = new PrismaClient({
  log: ["info", "warn", "error"],
});

export interface Context {
  prisma: PrismaClient;
  user?: Partial<User>;
  isLogged: boolean;
  isAdmin: boolean;
}

export const context = {
  prisma,
};
