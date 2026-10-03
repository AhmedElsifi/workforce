import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import MobileTopBar from "./MobileTopBar";
import MobileBottomNav from "./MobileBottomNav";

export default function AppLayout({ role }) {
  return (
    <div
      className={`flex h-screen w-full overflow-hidden max-md:block app-${role}`}
    >
      <MobileTopBar role={role} />
      <Sidebar role={role} />
      <main className="flex-1 overflow-y-auto bg-slate-50 px-10 py-8 max-lg:px-6 max-lg:py-7 max-md:px-5 max-md:pb-24 max-md:pt-5">
        <Outlet />
      </main>
      <MobileBottomNav role={role} />
    </div>
  );
}
