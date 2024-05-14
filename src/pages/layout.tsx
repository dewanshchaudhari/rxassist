import useMediaQuery from "@/hooks/mediaQuery";
import { useRouter } from "next/router";
import React, { type PropsWithChildren } from "react";
import Nav from "@/components/Nav";
const Layout = ({ children }: PropsWithChildren) => {
  const isMobile = useMediaQuery("(max-width: 640px)");
  const router = useRouter();
  if (
    router.pathname === "/price" ||
    router.pathname === "/terms-and-conditions" ||
    router.pathname === "/privacy-policy" ||
    router.pathname === "/about" ||
    router.pathname === "/contact" ||
    router.pathname === "/login"
  ) {
    return <>{children}</>;
  }
  if (!isMobile) {
    return (
      <>
        <div className="flex h-screen w-screen flex-row items-center justify-between">
          <div className="h-full w-1/4 overflow-auto">
            <Nav className="sticky top-0 z-50 bg-white px-4" />
            <div className="overflow-auto">{children}</div>
          </div>
          <div className="h-full w-3/4">
            <div className="h-full w-full bg-[url('/bg.jpg')] bg-cover"></div>
          </div>
        </div>
      </>
    );
  }
  return (
    <div className="h-screen w-screen">
      <Nav className="sticky top-0 z-50 bg-white px-4" />
      <div className="h-full overflow-auto">{children}</div>
    </div>
  );
};
export default Layout;
