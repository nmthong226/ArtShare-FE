import { Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTheme } from "@/hooks/useTheme";

interface ThemeToggleProps {
  className?: string;
}

export function ThemeToggle({ className }: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme();

  // next-themes
  // const { resolvedTheme, setTheme } = useTheme()
  // const theme = resolvedTheme === "dark"
  // onClick={() => setTheme(theme ? "light" : "dark")}

  return (
    <div
      className={cn(
        "flex w-16 h-8 p-1 rounded-full cursor-pointer transition-all duration-300",
        theme === "dark"
          ? "bg-mountain-950 border border-mountain-800"
          : "bg-white border border-mountain-200",
        className,
      )}
      onClick={toggleTheme}
      role="button"
      tabIndex={0}
    >
      <div className="flex justify-between items-center w-full">
        <div
          className={cn(
            "flex justify-center items-center w-6 h-6 rounded-full transition-transform duration-300",
            theme === "dark"
              ? "transform translate-x-0 bg-mountain-800"
              : "transform translate-x-8 bg-mountain-100",
          )}
        >
          {theme === "dark" ? (
            <Moon className="w-4 h-4 text-white" strokeWidth={1.5} />
          ) : (
            <Sun className="w-4 h-4 text-mountain-700" strokeWidth={1.5} />
          )}
        </div>
        <div
          className={cn(
            "flex justify-center items-center w-6 h-6 rounded-full transition-transform duration-300",
            theme === "dark" ? "bg-transparent" : "transform -translate-x-8",
          )}
        >
          {theme === "dark" ? (
            <Sun className="w-4 h-4 text-mountain-500" strokeWidth={1.5} />
          ) : (
            <Moon className="w-4 h-4 text-black" strokeWidth={1.5} />
          )}
        </div>
      </div>
    </div>
  );
}
