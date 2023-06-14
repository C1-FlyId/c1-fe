import NextAuth from 'next-auth';
import axios from 'axios';
import CredentialsProvider from 'next-auth/providers/credentials';
// const NextAuthURL = process.env.NEXTAUTH_URL;
const handler = NextAuth({
    providers: [
        CredentialsProvider({
            // The name to display on the sign in form (e.g. 'Sign in with...')
            name: 'Credentials',
            // The credentials is used to generate a suitable form on the sign in page.
            // You can specify whatever fields you are expecting to be submitted.
            // e.g. domain, username, password, 2FA token, etc.
            // You can pass any HTML attribute to the <input> tag through the object.
            credentials: {
                email: { label: 'Email', type: 'text', placeholder: 'arief@gmail.com' },
                password: { label: 'Password', type: 'password' },
            },
            async authorize(credentials, req) {
                // You need to provide your own logic here that takes the credentials
                // submitted and returns either a object representing a user or value
                // that is false/null if the credentials are invalid.
                // e.g. return { id: 1, name: 'J Smith', email: 'jsmith@example.com' }
                // You can also use the `req` object to obtain additional parameters
                // (i.e., the request IP address)
                // const res = await fetch('https://airplaneapikel1-production.up.railway.app/api/v1/user/login', {
                //     method: 'POST',
                //     body: JSON.stringify({
                //         email: credentials.email,
                //         password: credentials.password,
                //     }),
                //     headers: { 'Content-Type': 'application/json' },
                // });
                // const user = await res.json();

                // console.log('this data', user);

                // // If no error and we have user data, return it
                // if (res.ok && user) {
                //     return user;
                // }
                // // Return null if user data could not be retrieved
                // // return null;
                // // return user;
                // throw new Error(user.message);
                try {
                    const res = await axios.post('https://airplaneapikel1-production.up.railway.app/api/v1/user/login', {
                        email: credentials.email,
                        password: credentials.password,
                    });
                    return res.data;
                } catch (error) {
                    throw new Error(error.response.data.message);
                }
            },
        }),
    ],
    session: {
        strategy: 'jwt',
    },
    callbacks: {
        async jwt({ token, user }) {
            return { ...token, ...user };
        },
        async session({ session, token, user }) {
            session.user = token;
            return session;
        },
    },
    secret: process.env.NEXTAUTH_SECRET,
    pages: {
        signIn: '/login',
        // error: '/',
    },
});

export { handler as GET, handler as POST };