import { useCredentialsActions } from "../context/credentials.tsx";

export function LogoutBtn() {
  const { logout } = useCredentialsActions();

  return (
    <button
      type="button"
      onClick={logout}
      className="bg-transparent text-zinc-400 px-4 py-2 border border-zinc-700 rounded-md text-sm font-medium cursor-pointer transition-colors duration-200 hover:bg-zinc-700 hover:text-zinc-100"
    >
      Logout
    </button>
  );
}
