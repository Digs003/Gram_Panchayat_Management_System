import { getUser } from "@/lib/actions/getUser";

async function getDetails() {
  const user = await getUser();

  return {
    name: user.rows[0].name,
    email: user.rows[0].email,
  };
}

export default async function Appbar() {
  const user = await getDetails();
  return (
    <>
      <div>
        {user ? <p>Welcome, {user.name}!</p> : <p>You are not signed in.</p>}
      </div>
    </>
  );
}
