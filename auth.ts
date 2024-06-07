import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { authConfig } from './auth.config';
import { z } from 'zod';
import { sql } from '@vercel/postgres';
import bcrypt from 'bcrypt';
import { redirect } from 'next/navigation';
import { User } from 'next-auth';  // Import the extended User type

async function getUser(email: string): Promise<User | undefined> {
  try {
    const user = await sql<User>`SELECT * FROM users WHERE email=${email}`;
    return user.rows[0];
  } catch (error) {
    console.error('Failed to fetch user:', error);
    throw new Error('Failed to fetch user.');
  }
}

export default NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      async authorize(credentials) {
        const parsedCredentials = z
          .object({ email: z.string().email(), password: z.string().min(6) })
          .safeParse(credentials);

        if (parsedCredentials.success) {
          const { email, password } = parsedCredentials.data;
          const user = await getUser(email);
          if (!user) return null;
          const passwordsMatch = await bcrypt.compare(password, user.password);
        
          if (passwordsMatch) {
            return user;
          }
        }
        
        console.log('Invalid credentials');
        return null;
      },
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      if (token?.user) {
        session.user.role = (token.user as User).role;  // Explicitly type-cast to User
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.user = {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,  // Ensure role is included
        };
      }
      return token;
    },
    async signIn({ user }) {
      if (user.role === 'ADMIN') {
        redirect('/dashboard');
      } else {
        redirect('/home');
      }
      return true;
    },
  },
});
