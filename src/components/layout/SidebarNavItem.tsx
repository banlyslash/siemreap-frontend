import Link from "next/link";
import * as Tooltip from "@radix-ui/react-tooltip";

interface SidebarNavItemProps {
  name: string;
  href: string;
  icon: React.ElementType;
  isActive: boolean;
  isCollapsed: boolean;
}

export function SidebarNavItem({
  name,
  href,
  icon: Icon,
  isActive,
  isCollapsed,
}: SidebarNavItemProps) {
  const linkContent = (
    <Link
      href={href}
      className={`group flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors ${
        isActive
          ? "bg-blue-50 text-[#0070f3]"
          : "text-gray-700 hover:bg-gray-50 hover:text-[#0070f3]"
      } ${isCollapsed ? "justify-center" : ""}`}
      aria-label={isCollapsed ? name : undefined}
    >
      <Icon
        className={`${isCollapsed ? "" : "mr-3"} h-5 w-5 ${
          isActive
            ? "text-[#0070f3]"
            : "text-gray-500 group-hover:text-[#0070f3]"
        }`}
      />
      {!isCollapsed && name}
    </Link>
  );

  // Only show tooltip when collapsed on desktop
  if (isCollapsed) {
    return (
      <Tooltip.Provider delayDuration={200}>
        <Tooltip.Root>
          <Tooltip.Trigger asChild>{linkContent}</Tooltip.Trigger>
          <Tooltip.Portal>
            <Tooltip.Content
              side="right"
              sideOffset={8}
              className="bg-gray-900 text-white px-3 py-2 rounded-md text-sm shadow-lg z-50"
            >
              {name}
              <Tooltip.Arrow className="fill-gray-900" />
            </Tooltip.Content>
          </Tooltip.Portal>
        </Tooltip.Root>
      </Tooltip.Provider>
    );
  }

  return linkContent;
}
