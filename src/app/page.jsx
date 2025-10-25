"use client";

import React from "react";
import Link from "next/link";
import Head from "next/head";
// import Header from "../component/Header";
// import Footer from "../component/Footer";
import Sidebar from "../app/component/sidebar";
import { Building2, MapPin, Users, Briefcase, FileText, Calendar, LogOut, Plus, BarChart2, Mail  } from "lucide-react";

export default function Dashboard() {
  const stats = [
    { title: "Total Jobs", value: "12", icon: <Briefcase className="w-6 h-6" />, color: "#0A2540" },
    { title: "Applicants", value: "48", icon: <Users className="w-6 h-6" />, color: "#00A7A7" },
    { title: "Open Positions", value: "5", icon: <FileText className="w-6 h-6" />, color: "#0A2540" },
    { title: "Interviews", value: "8", icon: <Calendar className="w-6 h-6" />, color: "#00A7A7" }
  ];

  const recentJobs = [
    { title: "Frontend Developer", company: "Proferge", location: "Hyderabad", applications: 10, status: "Open" },
    { title: "Backend Developer", company: "Proferge", location: "Dubai", applications: 8, status: "Closed" },
    { title: "UI/UX Designer", company: "Proferge", location: "Remote", applications: 5, status: "Open" },
    { title: "Product Manager", company: "Proferge", location: "Hyderabad", applications: 12, status: "Open" }
  ];

  const getStatusColor = (status) => {
    return status === "Open" ? "bg-[#00A7A7]/20 text-[#00A7A7]" : "bg-[#E0E2E8] text-[#0A2540]";
  };

  return (
    <>
      <Head>
        <title>Dashboard - Proferge Talent Partners</title>
        <meta name="description" content="Manage your recruitment process with Proferge Talent Partners' admin dashboard." />
      </Head>
      {/* <Header /> */}
      <div className="flex min-h-screen bg-[#F7F8FA]">
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content */}
        <div className="flex-1 p-8">
          {/* Top Nav */}
          <header className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-[#0A2540] font-[Montserrat] mb-2">
                Welcome back, Admin!
              </h1>
              <p className="text-[#0A2540]/80 font-[Open Sans]">
                Here's what's happening with your recruitment today.
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-[#0A2540] rounded-full flex items-center justify-center text-[#F7F8FA] font-semibold font-[Montserrat]">
                A
              </div>
              <button className="px-6 py-2 bg-[#00A7A7] text-[#F7F8FA] rounded-xl hover:bg-[#008080] transition-colors font-[Open Sans] font-medium">
                <LogOut className="w-4 h-4 inline mr-2" />
                Logout
              </button>
            </div>
          </header>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-[#E0E2E8]"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className={`w-12 h-12 bg-${stat.color} rounded-xl flex items-center justify-center text-[#F7F8FA]`}>
                    {stat.icon}
                  </div>
                </div>
                <h3 className="text-[#0A2540]/80 font-[Open Sans] mb-2">{stat.title}</h3>
                <p className="text-3xl font-bold text-[#0A2540] font-[Montserrat]">{stat.value}</p>
              </div>
            ))}
          </div>

          {/* Recent Activity & Jobs */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Recent Jobs Table */}
            <div className="bg-white rounded-2xl shadow-lg border border-[#E0E2E8] overflow-hidden">
              <div className="bg-[#0A2540] p-6 text-[#F7F8FA]">
                <h2 className="text-xl font-bold font-[Montserrat] flex items-center">
                  <FileText className="w-5 h-5 mr-3" />
                  Recent Job Postings
                </h2>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {recentJobs.map((job, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 border border-[#E0E2E8] rounded-xl hover:border-[#00A7A7] transition-colors duration-200"
                    >
                      <div className="flex-1">
                        <h3 className="font-semibold text-[#0A2540] font-[Montserrat] mb-1">
                          {job.title}
                        </h3>
                        <div className="flex items-center space-x-4 text-sm text-[#0A2540]/80 font-[Open Sans]">
                          <span><Building2 className="w-4 h-4 inline mr-1" /> {job.company}</span>
                          <span><MapPin className="w-4 h-4 inline mr-1" /> {job.location}</span>
                          <span><Users className="w-4 h-4 inline mr-1" /> {job.applications} apps</span>
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold font-[Open Sans] ${getStatusColor(job.status)}`}>
                        {job.status}
                      </span>
                    </div>
                  ))}
                </div>
                <Link
                  href="/addjobs"
                  className="w-full mt-6 py-3 text-[#00A7A7] font-semibold rounded-xl border-2 border-[#00A7A7] hover:bg-[#00A7A7] hover:text-[#F7F8FA] transition-colors duration-200 font-[Open Sans] block text-center"
                >
                  View All Jobs
                </Link>
              </div>
            </div>

            {/* Quick Actions & Activity */}
            <div className="space-y-8">
              {/* Quick Actions */}
              <div className="bg-white rounded-2xl shadow-lg border border-[#E0E2E8] p-6">
                <h2 className="text-xl font-bold text-[#0A2540] font-[Montserrat] mb-6 flex items-center">
                  <Plus className="w-5 h-5 mr-3" />
                  Quick Actions
                </h2>
                <div className="grid grid-cols-2 gap-4">
                  <Link
                    href="/addjobs"
                    className="p-4 bg-[#0A2540] text-[#F7F8FA] rounded-xl hover:bg-[#1a365d] transition-colors duration-200 font-[Open Sans] text-center"
                  >
                    <Plus className="w-6 h-6 mb-2 mx-auto" />
                    <span>Add Job</span>
                  </Link>
                  <Link
                    href="/dashboard/applicants"
                    className="p-4 bg-[#00A7A7] text-[#F7F8FA] rounded-xl hover:bg-[#008080] transition-colors duration-200 font-[Open Sans] text-center"
                  >
                    <Users className="w-6 h-6 mb-2 mx-auto" />
                    <span>View Applicants</span>
                  </Link>
                  <Link
                    href="/dashboard/analytics"
                    className="p-4 bg-white border-2 border-[#0A2540] text-[#0A2540] rounded-xl hover:bg-[#0A2540] hover:text-[#F7F8FA] transition-colors duration-200 font-[Open Sans] text-center"
                  >
                    <BarChart2 className="w-6 h-6 mb-2 mx-auto" />
                    <span>Analytics</span>
                  </Link>
                  <button className="p-4 bg-white border-2 border-[#00A7A7] text-[#00A7A7] rounded-xl hover:bg-[#00A7A7] hover:text-[#F7F8FA] transition-colors duration-200 font-[Open Sans] text-center">
                    <Mail className="w-6 h-6 mb-2 mx-auto" />
                    <span>Send Email</span>
                  </button>
                </div>
              </div>

              {/* Recent Applicants */}
              <div className="bg-white rounded-2xl shadow-lg border border-[#E0E2E8] p-6">
                <h2 className="text-xl font-bold text-[#0A2540] font-[Montserrat] mb-6 flex items-center">
                  <Users className="w-5 h-5 mr-3" />
                  Recent Applicants
                </h2>
                <div className="space-y-4">
                  {[
                    { name: "Sarah Johnson", role: "Frontend Developer", time: "2 hours ago" },
                    { name: "Mike Chen", role: "Backend Developer", time: "4 hours ago" },
                    { name: "Priya Sharma", role: "UI/UX Designer", time: "1 day ago" }
                  ].map((applicant, index) => (
                    <div key={index} className="flex items-center space-x-4 p-3 border border-[#E0E2E8] rounded-xl hover:border-[#00A7A7] transition-colors duration-200">
                      <div className="w-10 h-10 bg-[#0A2540] rounded-full flex items-center justify-center text-[#F7F8FA] font-semibold font-[Montserrat]">
                        {applicant.name.charAt(0)}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-[#0A2540] font-[Montserrat]">{applicant.name}</h4>
                        <p className="text-sm text-[#0A2540]/80 font-[Open Sans]">{applicant.role}</p>
                      </div>
                      <span className="text-xs text-[#0A2540]/80 font-[Open Sans]">{applicant.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* <Footer /> */}
    </>
  );
}