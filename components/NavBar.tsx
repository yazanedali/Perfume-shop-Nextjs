import LocaleSwitcher from "./LocaleSwitcher";
import { ModeToggle } from "./TogleMode";

export default function NavBar() {
  return (
    <div className="flex justify-between items-center p-4">
      <LocaleSwitcher />
      <ModeToggle />
    </div>
  );
}
