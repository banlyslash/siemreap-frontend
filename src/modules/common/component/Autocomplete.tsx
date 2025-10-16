"use client";

import * as React from "react";
import { Check, Search } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../../../components/ui/command";
import { cn } from "../../../lib/cn";

export type AutocompleteOption = {
  label: string;
  value: string;
};

export type AutocompleteProps = {
  value: string | null;
  options: AutocompleteOption[];
  className?: string;
  onChange: (value: string | null) => void;
  placeholder?: string;
  emptyLabel?: string;
};

export function Autocomplete({
  value,
  options,
  className,
  onChange,
  placeholder = "Search...",
  emptyLabel = "No results found",
}: AutocompleteProps) {
  const [open, setOpen] = React.useState(false);

  // Keep a stable map for quick lookup
  const byValue = React.useMemo(() => {
    const m = new Map<string, AutocompleteOption>();
    for (const o of options) m.set(o.value, o);
    return m;
  }, [options]);

  const selected = value ? byValue.get(value) ?? null : null;

  return (
    <div className={cn("relative w-full", className)}>
      <Command
        shouldFilter
        onKeyDown={(e) => {
          // Close on Escape
          if (e.key === "Escape") setOpen(false);
        }}
        className={cn("w-full", open ? "ring-1 ring-black/10 dark:ring-white/15" : "")}
      >
        <div className="flex items-center gap-2 px-3 py-2">
          <Search className="h-4 w-4 text-gray-500" />
          <CommandInput
            placeholder={placeholder}
            onFocus={() => setOpen(true)}
            onBlur={() => setOpen(false)}
          />
        </div>
        <CommandList>
          <CommandEmpty>{emptyLabel}</CommandEmpty>
          <CommandGroup>
            {options.map((opt) => {
              const isSelected = value === opt.value;
              return (
                <CommandItem
                  key={opt.value}
                  value={opt.label}
                  onSelect={() => onChange(opt.value)}
                >
                  <span className="flex-1 truncate">{opt.label}</span>
                  {isSelected ? (
                    <Check className="h-4 w-4 text-foreground" />
                  ) : null}
                </CommandItem>
              );
            })}
          </CommandGroup>
        </CommandList>
      </Command>

      {selected ? (
        <div className="mt-2 text-xs text-gray-600 dark:text-gray-400">
          Selected: <span className="font-medium">{selected.label}</span>
        </div>
      ) : null}
    </div>
  );
}

export default Autocomplete;
