"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Briefcase, Users, Calendar, BarChart2, Settings, Home, ChevronLeft, ChevronRight } from "lucide-react";

export default function Sidebar() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const pathname = usePathname();

  const navigation = [
    { name: "Dashboard", href: "/", icon: <LayoutDashboard className="w-5 h-5" /> },
    { name: "Jobs", href: "/addjobs", icon: <Briefcase className="w-5 h-5" /> },
    { name: "Applicants", href: "/dashboard/applicants", icon: <Users className="w-5 h-5" /> },
    { name: "Interviews", href: "/dashboard/interviews", icon: <Calendar className="w-5 h-5" /> },
    { name: "Analytics", href: "/dashboard/analytics", icon: <BarChart2 className="w-5 h-5" /> },
    { name: "Settings", href: "/dashboard/settings", icon: <Settings className="w-5 h-5" /> }
  ];

  return (
    <aside
      className={`bg-white shadow-xl transition-all duration-300 ${
        sidebarOpen ? "w-64" : "w-20"
      } border-r border-[#E0E2E8] h-screen sticky top-0`}
    >
      {/* Logo */}
      <div className="flex items-center justify-between p-6 border-b border-[#E0E2E8]">
        {sidebarOpen && (
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-[#0A2540] rounded-lg flex items-center justify-center">
              <span className="text-[#F7F8FA] font-bold text-sm font-[Montserrat]">P</span>
            </div>
            <h2 className="text-xl font-bold text-[#0A2540] font-[Montserrat]">Proferge</h2>
          </div>
        )}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 rounded-lg hover:bg-[#E0E2E8] transition-colors"
          aria-label={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
        >
          {sidebarOpen ? <ChevronLeft className="w-5 h-5 text-[#0A2540]" /> : <ChevronRight className="w-5 h-5 text-[#0A2540]" />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="mt-6 flex flex-col space-y-2 px-3">
        {navigation.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className={`flex items-center px-4 py-3 rounded-xl font-semibold transition-all duration-200 group ${
              pathname === item.href
                ? 'text-[#00A7A7] bg-[#00A7A7]/10 font-bold'
                : 'text-[#0A2540] hover:text-[#00A7A7] hover:bg-[#00A7A7]/10'
            }`}
            title={sidebarOpen ? undefined : item.name}
          >
            <span className={`mr-4 opacity-70 group-hover:opacity-100 transition-opacity ${
              pathname === item.href ? 'opacity-100' : ''
            }`}>
              {item.icon}
            </span>
            {sidebarOpen && (
              <span className="font-[Open Sans]">{item.name}</span>
            )}
          </Link>
        ))}
      </nav>

      {/* Back to Site */}
      <div className="absolute bottom-6 left-0 right-0 px-3">
        <Link
          href="/home"
          className={`flex items-center px-4 py-3 rounded-xl font-semibold transition-all duration-200 group border-t border-[#E0E2E8] ${
            pathname === '/home'
              ? 'text-[#00A7A7] bg-[#00A7A7]/10 font-bold'
              : 'text-[#0A2540] hover:text-[#00A7A7] hover:bg-[#00A7A7]/10'
          }`}
          title={sidebarOpen ? undefined : "Back to Site"}
        >
          <span className={`mr-4 opacity-70 group-hover:opacity-100 transition-opacity ${
            pathname === '/home' ? 'opacity-100' : ''
          }`}>
            <Home className="w-5 h-5" />
          </span>
          {sidebarOpen && (
            <span className="font-[Open Sans]">Back to Site</span>
          )}
        </Link>
      </div>
    </aside>
  );
}