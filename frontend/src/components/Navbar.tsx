import { LogoutBtn } from "./LogoutBtn.tsx";
type Props = {
  header?: string;
};
export function Navbar({ header }: Props) {
  return (
    <header className="flex h-14 justify-between items-center px-6 py-2 bg-zinc-800 border-b border-zinc-700">
      <h1 className="text-lg font-bold text-zinc-100">
        {header ?? "Twitch"}
      </h1>
      <LogoutBtn />
    </header>
  );
}
