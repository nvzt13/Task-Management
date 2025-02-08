import { fetchUsers } from "@/actions/users/fetch-users";
import { User } from "@prisma/client"; // User tipi

const UsersList = async () => {
  // Kullanıcıları sunucudan çekiyoruz
  const response = await fetchUsers();

  if (!response.success) {
    return <p>{response.message}</p>;
  }

  return (
    <div className="w-full">
      <h2 className="text-xl font-semibold mb-4">Kullanıcılar</h2>
      <ul>
        {response.users?.map((user: User) => (
          <li key={user.id} className="flex justify-between p-3 border-b">
            <div>
              <p className="font-semibold">{user.name ?? "Name not provided"}</p>
              <p className="text-sm text-muted-foreground">{user.email}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UsersList;
