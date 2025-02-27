import { getUser } from "@/lib/actions/getUser";

async function getDetails() {
  const user = await getUser();
  if (!user) return null;

  return {
    name: user?.rows[0]?.name,
    aadhar: user?.rows[0]?.aadhar_id,
  };
}

export default async function Appbar() {
  const user = await getDetails();
  return (
    <>
      <div>
        {user?.name ? (
          <p>Welcome, {user.name}!</p>
        ) : (
          <p>You are not signed in.</p>
        )}
      </div>
    </>
  );
}
