// Lightweight in-memory mock of Prisma for the QA-only experience.
// Avoids @prisma/client initialization since we are not using a real database here.

type QAUser = { id: string; email: string; passwordHash?: string; createdAt: Date };
type QAProfile = { 
  id: string; 
  userId: string; 
  nickname: string;
  email: string;
  age: number; 
  heightCm: number;
  weightKg: number; 
  gender: "MALE" | "FEMALE";
  goalType?: "LOSE_FAT" | "GAIN_MUSCLE"; 
  updatedAt: Date;
};
type QASession = { id: string; userId: string; createdAt: Date; expiresAt: Date };
type QALog = { id: string; userId: string; date: Date; calories: number; createdAt: Date; updatedAt: Date };

const qaUser: QAUser = {
  id: "qa",
  email: "qa",
  createdAt: new Date(),
};

let qaProfile: QAProfile | null = null;

const qaSessions: Record<string, QASession> = {};
let qaLogs: QALog[] = [];

function futureDate(days: number) {
  return new Date(Date.now() + days * 24 * 60 * 60 * 1000);
}

export const prisma = {
  user: {
    findUnique: async ({ where }: { where: { email?: string; id?: string } }) => {
      if (where.email && where.email !== "qa") return null;
      if (where.id && where.id !== "qa") return null;
      return qaUser;
    },
    create: async ({ data }: { data: { email: string; passwordHash?: string } }) => {
      qaUser.passwordHash = data.passwordHash;
      return qaUser;
    },
    update: async ({ data }: { data: { passwordHash?: string } }) => {
      if (data.passwordHash) qaUser.passwordHash = data.passwordHash;
      return qaUser;
    },
  },
  profile: {
    findUnique: async ({ where }: { where: { userId: string } }) => {
      if (where.userId !== "qa") return null;
      return qaProfile;
    },
    create: async ({ data }: { data: Partial<QAProfile> & { userId: string } }) => {
      qaProfile = {
        id: "qa-profile",
        userId: data.userId,
        nickname: data.nickname ?? "QA User",
        email: data.email ?? "qa@example.com",
        age: data.age ?? 30,
        heightCm: data.heightCm ?? 170,
        weightKg: data.weightKg ?? 70,
        gender: data.gender ?? "MALE",
        goalType: data.goalType,
        updatedAt: new Date(),
      };
      return qaProfile;
    },
    upsert: async ({ where, create, update }: { where: { userId: string }; create: Partial<QAProfile> & { userId: string }; update: Partial<QAProfile> }) => {
      if (where.userId !== "qa") return null;
      if (qaProfile && qaProfile.userId === "qa") {
        qaProfile = { ...qaProfile, ...update, updatedAt: new Date() };
        return qaProfile;
      }
      qaProfile = {
        id: "qa-profile",
        userId: create.userId,
        nickname: create.nickname ?? "QA User",
        email: create.email ?? "qa@example.com",
        age: create.age ?? 30,
        heightCm: create.heightCm ?? 170,
        weightKg: create.weightKg ?? 70,
        gender: create.gender ?? "MALE",
        goalType: create.goalType,
        updatedAt: new Date(),
      };
      return qaProfile;
    },
  },
  session: {
    create: async ({ data }: { data: { userId: string; expiresAt?: Date } }) => {
      const id = `qa-session-${Date.now()}`;
      const session: QASession = {
        id,
        userId: data.userId,
        createdAt: new Date(),
        expiresAt: data.expiresAt ?? futureDate(7),
      };
      qaSessions[id] = session;
      return session;
    },
    findFirst: async ({ where, include }: { where: { id: string; expiresAt: { gt: Date } }; include?: { user: boolean } }) => {
      const session = qaSessions[where.id];
      if (!session) return null;
      if (session.expiresAt <= where.expiresAt.gt) return null;
      return { ...session, user: qaUser };
    },
    deleteMany: async ({ where }: { where: { id: string } }) => {
      delete qaSessions[where.id];
      return { count: 1 };
    },
  },
  calorieLog: {
    findMany: async ({ where, orderBy }: { where: { userId: string; date?: { gte?: Date; lte?: Date } }; orderBy?: { date: "asc" | "desc" } }) => {
      let filtered = qaLogs.filter((l) => l.userId === where.userId);
      if (where.date?.gte) {
        filtered = filtered.filter((l) => l.date >= where.date!.gte!);
      }
      if (where.date?.lte) {
        filtered = filtered.filter((l) => l.date <= where.date!.lte!);
      }
      if (orderBy?.date === "desc") {
        filtered = filtered.sort((a, b) => b.date.getTime() - a.date.getTime());
      } else if (orderBy?.date === "asc") {
        filtered = filtered.sort((a, b) => a.date.getTime() - b.date.getTime());
      }
      return filtered;
    },
    upsert: async ({ where, update, create }: { where: { userId_date: { userId: string; date: Date } }; update: { calories: number }; create: { userId: string; date: Date; calories: number } }) => {
      const { userId, date } = where.userId_date;
      const existingIndex = qaLogs.findIndex((l) => l.userId === userId && l.date.getTime() === date.getTime());
      if (existingIndex >= 0) {
        qaLogs[existingIndex] = { ...qaLogs[existingIndex], calories: update.calories, updatedAt: new Date() };
        return qaLogs[existingIndex];
      }
      const newLog: QALog = {
        id: `log-${Date.now()}`,
        userId,
        date,
        calories: create.calories,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      qaLogs.push(newLog);
      return newLog;
    },
  },
};
