"use client";

import { ConsentGate } from "@/components/legal/ConsentGate";
import { AppFooter } from "@/components/legal/AppFooter";

interface SiteShellProps {
  children: React.ReactNode;
  /** ルーム画面など、フッター余白を少し詰める */
  dense?: boolean;
}

export function SiteShell({ children, dense = false }: SiteShellProps) {
  return (
    <>
      <ConsentGate />
      <div
        className={
          dense
            ? "mx-auto flex min-h-dvh w-full max-w-lg flex-col px-5 pb-10 pt-8"
            : "relative mx-auto flex min-h-dvh w-full max-w-lg flex-col px-5 pb-16 pt-10 sm:pt-16"
        }
      >
        {children}
        <div className={dense ? "mt-12" : "mt-16"}>
          <AppFooter />
        </div>
      </div>
    </>
  );
}
