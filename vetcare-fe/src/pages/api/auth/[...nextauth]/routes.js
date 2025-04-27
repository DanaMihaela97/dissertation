import NextAuth from "next-auth"
import KeycloakProvider from "next-auth/providers/keycloak";
export const authOptions = {
  providers: [
    KeycloakProvider({
      clientId: `${process.env.KEYCLOAK_CLIENT_ID}`,
      clientSecret: `${process.env.KEYCLOAK_CLIENT_SECRET}`,
      issuer: `${process.env.KEYCLOAK_ISSUER}`
      
    }),
  ],
  callbacks: {
    async jwt({token, account}){
      if(account){
        token.userProp = account.userProp;
        token.accessToken = account.access_token;
      }
      return token;
    },
    async session({session, token}){
      session.userProp = token.userProp;
      return session;
    }
  }
}

const handler = NextAuth(authOptions);
export {handler as get, handler as post};