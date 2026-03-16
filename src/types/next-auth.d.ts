import 'next-auth';
import 'next-auth/jwt';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      nickname: string;
      department: string;
      grade: number;
      role: string;
    };
  }

  interface User {
    id: string;
    nickname: string;
    department: string;
    grade: number;
    role: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    nickname: string;
    department: string;
    grade: number;
    role: string;
  }
}
