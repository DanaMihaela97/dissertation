import { useSession, signIn, signOut } from "next-auth/react"

export default function LoginIIIIn() {
  const { data: session } = useSession()
  if (session) {
    localStorage.setItem("jwt", session.accessToken);
    console.log(localStorage.getItem("jwt"));
    return (
      <>
        Signed in as {session.user.email} <br />
        <button onClick={() => signOut()}>Sign out</button>
      </>
    )
  }
  return (
    <>
      Not signed in <br />
      <button onClick={() => signIn()}>Sign in</button>
    </>
  )
}