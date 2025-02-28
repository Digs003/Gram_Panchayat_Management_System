import { getUser } from "@/lib/actions/getUser";

async function getDetails() {
  const user = await getUser();
  if (!user) return null;
  return user.user;
}

export default async function Appbar() {
  const user = await getDetails();
  console.log(user);
  return (
    <>
      <div>
        {user ? <p>Welcome, {user.name}!</p> : <p>You are not signed in.</p>}
      </div>
    </>
  );
}
