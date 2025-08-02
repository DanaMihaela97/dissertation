// // pages/api/set-cookie.ts
// import { NextApiRequest, NextApiResponse } from 'next';
// import { getToken } from 'next-auth/jwt';
// import { serialize } from 'cookie';
//
// const secret = process.env.NEXTAUTH_SECRET;
//
// export default async function handler(req: NextApiRequest, res: NextApiResponse) {
//   console.log("TEST!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!")
//   const token = await getToken({ req, secret });
//
//   if (!token || !token.accessToken) {
//     return res.status(401).json({ message: 'Unauthorized' });
//   }
//
//   const cookie = serialize('jwt', token.accessToken as string, {
//     httpOnly: true,
//     secure: process.env.NODE_ENV === 'production',
//     path: '/',
//     sameSite: 'lax',
//     maxAge: 60 * 60 * 24, // 1 day
//   });
//
//   res.setHeader('Set-Cookie', cookie);
//   res.status(200).json({ message: 'Cookie set' });
// }
