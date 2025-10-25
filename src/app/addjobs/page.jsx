"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Head from 'next/head';
import Sidebar from '../component/sidebar';
import { Briefcase, MapPin, DollarSign, FileText, Trash2, ToggleLeft, ToggleRight, Download, BarChart2, Users, LogOut } from 'lucide-react';

const JobsPage = () => {
  const [jobs, setJobs] = useState([]);
  const [jobTitle, setJobTitle] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [jobType, setJobType] = useState('full-time');
  const [location, setLocation] = useState('');
  const [salary, setSalary] = useState('');
  const [recommendedSkills, setRecommendedSkills] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

  // Check authentication and fetch jobs on mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('Please log in to manage jobs');
      router.push('/login');
      return;
    }

    const fetchJobs = async () => {
      setIsLoading(true);
      try {
        console.log('Fetching jobs from:', `${API_URL}/api/jobs`);
        const res = await fetch(`${API_URL}/api/jobs`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const responseData = await res.json();
        console.log('Jobs Response:', responseData);
        if (!res.ok) {
          if (res.status === 403) {
            setError('You do not have permission to view jobs. Please log in as an admin.');
            localStorage.removeItem('token');
            router.push('/login');
            return;
          }
          throw new Error(responseData.error || 'Failed to fetch jobs');
        }
        setJobs(responseData);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchJobs();
  }, [router]);

  // Add a new job
  const handleAddJob = async (e) => {
    e.preventDefault();
    if (!jobTitle || !jobDescription) {
      setError('Job title and description are required');
      return;
    }

    setIsSubmitting(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Please log in to add a job');
        router.push('/login');
        return;
      }
      console.log('Posting job to:', `${API_URL}/api/jobs`);
      const res = await fetch(`${API_URL}/api/jobs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: jobTitle,
          description: jobDescription,
          type: jobType,
          location,
          salary,
          recommended_skills: recommendedSkills,
        }),
      });
      const responseData = await res.json();
      console.log('Add Job Response:', responseData);
      if (!res.ok) {
        if (res.status === 403) {
          setError('Only admins can add jobs. Please log in as an admin.');
          localStorage.removeItem('token');
          router.push('/login');
          return;
        }
        throw new Error(responseData.error || 'Failed to add job');
      }
      setJobs([...jobs, {
        id: responseData.id,
        title: jobTitle,
        description: jobDescription,
        type: jobType,
        location,
        salary,
        recommended_skills: recommendedSkills,
        status: 'active',
        created_at: new Date().toISOString(),
      }]);
      setJobTitle('');
      setJobDescription('');
      setJobType('full-time');
      setLocation('');
      setSalary('');
      setRecommendedSkills('');
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete a job
  const handleDeleteJob = async (id) => {
    setError(null);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Please log in to delete jobs');
        router.push('/login');
        return;
      }
      console.log('Deleting job at:', `${API_URL}/api/jobs/${id}`);
      const res = await fetch(`${API_URL}/api/jobs/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      const responseData = await res.json();
      console.log('Delete Job Response:', responseData);
      if (!res.ok) {
        if (res.status === 403) {
          setError('Only admins can delete jobs. Please log in as an admin.');
          localStorage.removeItem('token');
          router.push('/login');
          return;
        }
        throw new Error(responseData.error || 'Failed to delete job');
      }
      setJobs(jobs.filter(job => job.id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  // Toggle job status
  const handleToggleStatus = async (id) => {
    setError(null);
    const job = jobs.find(job => job.id === id);
    const newStatus = job.status === 'active' ? 'inactive' : 'active';
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Please log in to update job status');
        router.push('/login');
        return;
      }
      console.log('Updating status at:', `${API_URL}/api/jobs/${id}/status`);
      const res = await fetch(`${API_URL}/api/jobs/${id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });
      const responseData = await res.json();
      console.log('Toggle Status Response:', responseData);
      if (!res.ok) {
        if (res.status === 403) {
          setError('Only admins can update job status. Please log in as an admin.');
          localStorage.removeItem('token');
          router.push('/login');
          return;
        }
        throw new Error(responseData.error || 'Failed to update status');
      }
      setJobs(jobs.map(job =>
        job.id === id ? { ...job, status: newStatus } : job
      ));
    } catch (err) {
      setError(err.message);
    }
  };

  // Logout
  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/login');
  };

  const getStatusColor = (status) => {
    return status === 'active' ? 'bg-[#00A7A7]/20 text-[#00A7A7]' : 'bg-[#E0E2E8] text-[#0A2540]';
  };

  const getTypeColor = (type) => {
    const colors = {
      'full-time': 'bg-[#00A7A7]/20 text-[#00A7A7]',
      'part-time': 'bg-[#008080]/20 text-[#008080]',
      'contract': 'bg-[#0A2540]/20 text-[#0A2540]',
      'remote': 'bg-[#F7F8FA] text-[#00A7A7]',
    };
    return colors[type] || 'bg-[#E0E2E8] text-[#0A2540]';
  };

  return (
    <>
      <Head>
        <title>Job Management - Proferge Talent Partners</title>
        <meta name="description" content="Manage job postings, track applications, and find top talent with Proferge Talent Partners." />
      </Head>
      <div className="flex min-h-screen bg-[#F7F8FA]">
        <Sidebar />
        <div className="flex-1 p-8 ml-[64px] lg:ml-64">
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-end mb-4">
              <button
                onClick={handleLogout}
                className="bg-[#F7F8FA] text-[#0A2540] p-2 rounded-xl hover:bg-[#E0E2E8] transition-colors duration-200 flex items-center space-x-2 font-[Open Sans]"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
            {error && (
              <div className="bg-red-100 text-red-700 p-4 rounded-xl mb-6 font-[Open Sans]">
                {error}
              </div>
            )}
            {isLoading ? (
              <div className="text-center py-12">
                <div className="w-12 h-12 border-4 border-[#00A7A7] border-t-transparent rounded-full animate-spin mx-auto"></div>
                <p className="text-[#0A2540] mt-4 font-[Open Sans]">Loading jobs...</p>
              </div>
            ) : (
              <>
                <div className="text-center mb-12">
                  <div className="inline-block mb-4">
                    <span className="text-sm font-semibold text-[#0A2540] bg-[#00A7A7]/20 px-4 py-2 rounded-full font-[Open Sans]">
                      JOB MANAGEMENT
                    </span>
                  </div>
                  <h1 className="text-4xl md:text-5xl font-bold text-[#0A2540] mb-4 font-[Montserrat]">
                    Job Management Portal
                  </h1>
                  <p className="text-xl text-[#0A2540]/80 max-w-2xl mx-auto font-[Open Sans]">
                    Manage job postings, track applications, and find the perfect candidates for your organization.
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
                  <div className="bg-white rounded-2xl p-6 shadow-lg border border-[#E0E2E8] text-center">
                    <div className="text-2xl font-bold text-[#00A7A7] mb-2 font-[Montserrat]">{jobs.length}</div>
                    <div className="text-[#0A2540]/80 font-medium font-[Open Sans]">Total Jobs</div>
                  </div>
                  <div className="bg-white rounded-2xl p-6 shadow-lg border border-[#E0E2E8] text-center">
                    <div className="text-2xl font-bold text-[#00A7A7] mb-2 font-[Montserrat]">
                      {jobs.filter(job => job.status === 'active').length}
                    </div>
                    <div className="text-[#0A2540]/80 font-medium font-[Open Sans]">Active Jobs</div>
                  </div>
                  <div className="bg-white rounded-2xl p-6 shadow-lg border border-[#E0E2E8] text-center">
                    <div className="text-2xl font-bold text-[#00A7A7] mb-2 font-[Montserrat]">
                      {jobs.filter(job => job.type === 'full-time').length}
                    </div>
                    <div className="text-[#0A2540]/80 font-medium font-[Open Sans]">Full-time</div>
                  </div>
                  <div className="bg-white rounded-2xl p-6 shadow-lg border border-[#E0E2E8] text-center">
                    <div className="text-2xl font-bold text-[#00A7A7] mb-2 font-[Montserrat]">
                      {jobs.filter(job => job.type === 'remote').length}
                    </div>
                    <div className="text-[#0A2540]/80 font-medium font-[Open Sans]">Remote</div>
                  </div>
                </div>
                <div className="grid lg:grid-cols-2 gap-12">
                  <section className="bg-white rounded-3xl shadow-2xl border border-[#E0E2E8] overflow-hidden">
                    <div className="bg-[#0A2540] p-6 text-[#F7F8FA]">
                      <h2 className="text-2xl font-bold flex items-center font-[Montserrat]">
                        <FileText className="w-6 h-6 mr-3" />
                        Add New Job
                      </h2>
                      <p className="text-[#F7F8FA]/80 mt-1 font-[Open Sans]">Create a new job posting to attract top talent</p>
                    </div>
                    <form onSubmit={handleAddJob} className="p-6 space-y-6">
                      <div>
                        <label className="block text-[#0A2540] font-semibold mb-2 font-[Open Sans]">
                          Job Title *
                        </label>
                        <input
                          type="text"
                          value={jobTitle}
                          onChange={(e) => setJobTitle(e.target.value)}
                          className="w-full px-4 py-3 border border-[#E0E2E8] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00A7A7] focus:border-transparent transition-all duration-300 font-[Open Sans]"
                          placeholder="e.g., Senior Frontend Developer"
                          required
                        />
                      </div>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[#0A2540] font-semibold mb-2 font-[Open Sans]">
                            Job Type
                          </label>
                          <select
                            value={jobType}
                            onChange={(e) => setJobType(e.target.value)}
                            className="w-full px-4 py-3 border border-[#E0E2E8] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00A7A7] focus:border-transparent transition-all duration-300 font-[Open Sans]"
                          >
                            <option value="full-time">Full Time</option>
                            <option value="part-time">Part Time</option>
                            <option value="contract">Contract</option>
                            <option value="remote">Remote</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-[#0A2540] font-semibold mb-2 font-[Open Sans]">
                            Location
                          </label>
                          <input
                            type="text"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            className="w-full px-4 py-3 border border-[#E0E2E8] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00A7A7] focus:border-transparent transition-all duration-300 font-[Open Sans]"
                            placeholder="e.g., Hyderabad, India"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-[#0A2540] font-semibold mb-2 font-[Open Sans]">
                          Salary Range
                        </label>
                        <input
                          type="text"
                          value={salary}
                          onChange={(e) => setSalary(e.target.value)}
                          className="w-full px-4 py-3 border border-[#E0E2E8] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00A7A7] focus:border-transparent transition-all duration-300 font-[Open Sans]"
                          placeholder="e.g., ₹8L - ₹15L PA"
                        />
                      </div>
                      <div>
                        <label className="block text-[#0A2540] font-semibold mb-2 font-[Open Sans]">
                          Job Description *
                        </label>
                        <textarea
                          value={jobDescription}
                          onChange={(e) => setJobDescription(e.target.value)}
                          rows={4}
                          className="w-full px-4 py-3 border border-[#E0E2E8] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00A7A7] focus:border-transparent transition-all duration-300 font-[Open Sans]"
                          placeholder="Describe the role, responsibilities, and requirements..."
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-[#0A2540] font-semibold mb-2 font-[Open Sans]">
                          Recommended Skills
                        </label>
                        <textarea
                          value={recommendedSkills}
                          onChange={(e) => setRecommendedSkills(e.target.value)}
                          rows={3}
                          className="w-full px-4 py-3 border border-[#E0E2E8] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00A7A7] focus:border-transparent transition-all duration-300 font-[Open Sans]"
                          placeholder="e.g., JavaScript, React, Node.js"
                        />
                      </div>
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className={`w-full bg-[#00A7A7] text-[#F7F8FA] font-semibold py-4 px-6 rounded-xl shadow-lg transition-all duration-300 flex items-center justify-center space-x-2 font-[Open Sans] ${
                          isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[#008080] transform hover:scale-105'
                        }`}
                      >
                        {isSubmitting ? (
                          <>
                            <div className="w-5 h-5 border-2 border-[#F7F8FA] border-t-transparent rounded-full animate-spin"></div>
                            <span>Adding Job...</span>
                          </>
                        ) : (
                          <>
                            <span>Add Job Posting</span>
                            <FileText className="w-5 h-5" />
                          </>
                        )}
                      </button>
                    </form>
                  </section>
                  <section className="bg-white rounded-3xl shadow-2xl border border-[#E0E2E8] overflow-hidden">
                    <div className="bg-[#0A2540] p-6 text-[#F7F8FA]">
                      <h2 className="text-2xl font-bold flex items-center font-[Montserrat]">
                        <BarChart2 className="w-6 h-6 mr-3" />
                        Manage Jobs ({jobs.length})
                      </h2>
                      <p className="text-[#F7F8FA]/80 mt-1 font-[Open Sans]">View and manage all your job postings</p>
                    </div>
                    <div className="p-6">
                      {jobs.length === 0 ? (
                        <div className="text-center py-12">
                          <FileText className="w-12 h-12 mx-auto mb-4 text-[#00A7A7]" />
                          <h3 className="text-xl font-semibold text-[#0A2540] mb-2 font-[Montserrat]">No Jobs Posted Yet</h3>
                          <p className="text-[#0A2540]/80 font-[Open Sans]">Create your first job posting to get started!</p>
                        </div>
                      ) : (
                        <div className="space-y-4 max-h-96 overflow-y-auto">
                          {jobs.map((job) => (
                            <div
                              key={job.id}
                              className="border border-[#E0E2E8] rounded-2xl p-4 hover:shadow-lg transition-all duration-300 bg-[#F7F8FA] hover:bg-white"
                            >
                              <div className="flex justify-between items-start mb-3">
                                <h3 className="font-bold text-lg text-[#0A2540] font-[Montserrat]">{job.title}</h3>
                                <div className="flex space-x-2">
                                  <button
                                    onClick={() => handleToggleStatus(job.id)}
                                    className={`px-3 py-1 rounded-full text-xs font-semibold font-[Open Sans] ${getStatusColor(job.status)}`}
                                  >
                                    {job.status === 'active' ? <ToggleRight className="w-4 h-4 inline mr-1" /> : <ToggleLeft className="w-4 h-4 inline mr-1" />}
                                    {job.status === 'active' ? 'Active' : 'Inactive'}
                                  </button>
                                  <button
                                    onClick={() => handleDeleteJob(job.id)}
                                    className="bg-[#F7F8FA] text-[#0A2540] p-2 rounded-xl hover:bg-[#E0E2E8] transition-colors duration-200"
                                    title="Delete Job"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              </div>
                              <p className="text-[#0A2540]/80 text-sm mb-3 line-clamp-2 font-[Open Sans]">{job.description}</p>
                              {job.recommended_skills && (
                                <p className="text-[#0A2540]/80 text-sm mb-3 font-[Open Sans]"><span className="font-semibold">Skills:</span> {job.recommended_skills}</p>
                              )}
                              <div className="flex flex-wrap gap-2 mb-3">
                                <span className={`px-3 py-1 rounded-full text-xs font-semibold font-[Open Sans] ${getTypeColor(job.type)}`}>
                                  <Briefcase className="w-3 h-3 inline mr-1" />
                                  {job.type.charAt(0).toUpperCase() + job.type.slice(1)}
                                </span>
                                {job.location && (
                                  <span className="bg-[#F7F8FA] text-[#0A2540] px-3 py-1 rounded-full text-xs font-semibold font-[Open Sans]">
                                    <MapPin className="w-3 h-3 inline mr-1" />
                                    {job.location}
                                  </span>
                                )}
                                {job.salary && (
                                  <span className="bg-[#F7F8FA] text-[#0A2540] px-3 py-1 rounded-full text-xs font-semibold font-[Open Sans]">
                                    <DollarSign className="w-3 h-3 inline mr-1" />
                                    {job.salary}
                                  </span>
                                )}
                              </div>
                              <div className="text-xs text-[#0A2540]/80 flex justify-between items-center font-[Open Sans]">
                                <span>Posted: {new Date(job.created_at).toLocaleDateString()}</span>
                                <span>ID: {job.id}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </section>
                </div>
                <div className="mt-12 bg-white rounded-3xl p-8 shadow-lg border border-[#E0E2E8]">
                  <h3 className="text-2xl font-bold text-[#0A2540] mb-6 text-center font-[Montserrat]">Quick Actions</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <button className="bg-[#F7F8FA] text-[#00A7A7] p-4 rounded-2xl font-semibold hover:bg-[#00A7A7]/20 transition-colors duration-300 flex items-center justify-center space-x-2 font-[Open Sans]">
                      <Download className="w-5 h-5" />
                      <span>Export Jobs</span>
                    </button>
                    <Link href="/dashboard/analytics" className="bg-[#F7F8FA] text-[#00A7A7] p-4 rounded-2xl font-semibold hover:bg-[#00A7A7]/20 transition-colors duration-300 flex items-center justify-center space-x-2 font-[Open Sans]">
                      <BarChart2 className="w-5 h-5" />
                      <span>View Analytics</span>
                    </Link>
                    <Link href="/dashboard/applicants" className="bg-[#F7F8FA] text-[#00A7A7] p-4 rounded-2xl font-semibold hover:bg-[#00A7A7]/20 transition-colors duration-300 flex items-center justify-center space-x-2 font-[Open Sans]">
                      <Users className="w-5 h-5" />
                      <span>Manage Candidates</span>
                    </Link>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default JobsPage;