import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  id?: string;
  children: React.ReactNode;
  className?: string;
  as?: "h1" | "h2" | "h3";
}

export function SectionHeading({
  id,
  children,
  className,
  as: Tag = "h2",
}: SectionHeadingProps) {
  return (
    <Tag
      id={id}
      className={cn(
        "font-display text-2xl font-bold leading-tight text-[#101214] sm:text-3xl lg:text-4xl",
        className
      )}
    >
      {children}
    </Tag>
  );
}
