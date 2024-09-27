import { Clipboard, LayoutDashboard, Settings } from "lucide-react";
import Link from "next/link";
import SideNav from "./side-nav";

export default function DashboardLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="flex gap-12 container mx-auto pt-12">
            <SideNav />
            <div className="flex-1">
                {children}
            </div>
        </div>
    );
}
