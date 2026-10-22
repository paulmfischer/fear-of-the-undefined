import type { ReactNode } from "react";

export function Metadata({ values, icon, className = "" }: { values?: string[]; icon: ReactNode; className?: string }) {
  return values?.length ? <div className={`flex items-center lg:mr-5 ${className}`}>{icon}{values.join(", ")}</div> : null;
}
