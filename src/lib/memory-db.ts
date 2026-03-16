// In-memory fallback when Prisma/SQLite fails (for Vercel serverless)

interface MemoryUser {
  id: string;
  nickname: string;
  pin: string;
  department: string;
  grade: number;
  points: number;
  interests: string;
  createdAt: Date;
  updatedAt: Date;
}

interface MemorySession {
  sessionToken: string;
  userId: string;
  expires: Date;
}

class MemoryDB {
  private users: Map<string, MemoryUser> = new Map();
  private sessions: Map<string, MemorySession> = new Map();
  private usersByNickname: Map<string, string> = new Map(); // nickname -> userId

  createUser(nickname: string, pin: string, department: string, grade: number) {
    if (this.usersByNickname.has(nickname)) {
      throw new Error('이미 사용 중인 닉네임입니다');
    }

    const id = `user_${Date.now()}_${Math.random().toString(36).slice(2)}`;
    const user: MemoryUser = {
      id,
      nickname,
      pin,
      department,
      grade,
      points: 1000,
      interests: '[]',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.users.set(id, user);
    this.usersByNickname.set(nickname, id);
    return user;
  }

  findUserByNickname(nickname: string) {
    const userId = this.usersByNickname.get(nickname);
    if (!userId) return null;
    return this.users.get(userId);
  }

  findUserById(userId: string) {
    return this.users.get(userId);
  }

  createSession(userId: string) {
    const sessionToken = `session_${Date.now()}_${Math.random().toString(36).slice(2)}`;
    const expires = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

    this.sessions.set(sessionToken, {
      sessionToken,
      userId,
      expires,
    });

    return { sessionToken, expires };
  }

  findSession(sessionToken: string) {
    const session = this.sessions.get(sessionToken);
    if (!session) return null;
    if (new Date() > session.expires) {
      this.sessions.delete(sessionToken);
      return null;
    }
    return session;
  }

  deleteSession(sessionToken: string) {
    this.sessions.delete(sessionToken);
  }
}

export const memoryDB = new MemoryDB();
