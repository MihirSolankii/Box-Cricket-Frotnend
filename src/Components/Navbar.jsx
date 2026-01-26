import ThemeToggle from "./ThemeToggle";

export default function Navbar() {
  return (
    <nav className="w-full flex items-center justify-between px-6 py-4
                    bg-background text-foreground border-b border-border">
      <h1 className="text-xl font-bold">Cricket Box</h1>
      <ThemeToggle />
    </nav>
  );
}
