import { Command, CommandInput } from "@/components/ui/command";
import Link from "next/link";

export function Search() {
  return (
    <Link href={"/search"}>
      <Command className="rounded-lg">
        <CommandInput placeholder="Enter a medication" />
      </Command>
    </Link>
  );
}
