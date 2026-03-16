import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { prisma } from './db';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        nickname: { label: '닉네임', type: 'text' },
        pin: { label: 'PIN', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.nickname || !credentials?.pin) {
          throw new Error('닉네임과 PIN을 입력하세요');
        }

        const user = await prisma.user.findUnique({
          where: { nickname: credentials.nickname },
        });

        if (!user || user.pin !== credentials.pin) {
          throw new Error('닉네임 또는 PIN이 잘못되었습니다');
        }

        return {
          id: user.id,
          nickname: user.nickname,
          department: user.department,
          grade: user.grade,
          role: user.role,
        };
      },
    }),
  ],
  session: { strategy: 'jwt' },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.nickname = user.nickname;
        token.department = user.department;
        token.grade = user.grade;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.nickname = token.nickname as string;
        session.user.department = token.department as string;
        session.user.grade = token.grade as number;
        session.user.role = token.role as string;
      }
      return session;
    },
  },
  pages: {
    signIn: '/login',
  },
};
