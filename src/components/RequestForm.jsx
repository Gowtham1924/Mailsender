import React, { useState } from "react";
import axios from "axios";
import bgImage from "../assets/image.png";
import { Calendar } from "./ui/new-calendar";
import { format, parseISO } from "date-fns";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

export const RequestForm = () => {
  const [formData, setFormData] = useState({
    projectName: "",
    serviceName: "",
    resourceName: "",
    region: "",
    cicd: "",
    specification: "",
    developer: "",
    owner: "",
    approveName: "",
    approvalStatus: "",
    currentStatus: "",
    startDate: "",
    endDate: "",
    costEstimation: "",
  });

  const [status, setStatus] = useState({
    loading: false,
    message: "",
    type: "",
  });

  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };


  const [openCalendar, setOpenCalendar] = useState(null); // 'start' | 'end' | null

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setStatus({
      loading: true,
      message: "",
      type: "",
    });

    try {
      const apiUrl = import.meta.env.VITE_API_URL || "";

      await axios.post(`${apiUrl}/api/requests`, formData);

      setStatus({
        loading: false,
        message: "Request submitted successfully!",
        type: "success",
      });

      setFormData({
        projectName: "",
        serviceName: "",
        resourceName: "",
        region: "",
        cicd: "",
        specification: "",
        developer: "",
        owner: "",
        approveName: "",
        approvalStatus: "",
        currentStatus: "",
        startDate: "",
        endDate: "",
        costEstimation: "",
      });
    } catch (error) {
      console.error(error);

      setStatus({
        loading: false,
        message: "Failed to submit request. Please check backend.",
        type: "error",
      });
    }
  };

  /* -----------------------------
     Reusable Styles
  ----------------------------- */

  const labelClass =
    "block text-[13px] font-semibold text-slate-600 mb-2";

  const inputClass =
    "w-full h-[48px] px-4 rounded-xl border border-slate-200 " +
    "bg-white/80 text-[14px] text-slate-700 " +
    "placeholder:text-slate-400 " +
    "outline-none transition-all duration-200 " +
    "hover:border-slate-300 " +
    "focus:border-blue-400 focus:ring-4 focus:ring-blue-100/70 " +
    "focus:bg-white";

  const textareaClass =
    "w-full min-h-[150px] px-4 py-4 rounded-xl border border-slate-200 " +
    "bg-white/80 text-[14px] text-slate-700 " +
    "placeholder:text-slate-400 resize-none outline-none " +
    "transition-all duration-200 " +
    "hover:border-slate-300 " +
    "focus:border-blue-400 focus:ring-4 focus:ring-blue-100/70 " +
    "focus:bg-white";

  /* -----------------------------
     Section Icon
  ----------------------------- */

  const SectionIcon = ({ type }) => {
    const icons = {
      project: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.8"
            d="M9 12h6m-6 4h6M8 4h8l4 4v12H4V4h4z"
          />
        </svg>
      ),

      technical: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.8"
            d="M12 3v3m0 12v3M3 12h3m12 0h3M5.6 5.6l2.1 2.1m8.6 8.6l2.1 2.1m0-12.8l-2.1 2.1m-8.6 8.6l-2.1 2.1"
          />
          <circle cx="12" cy="12" r="4" strokeWidth="1.8" />
        </svg>
      ),

      people: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.8"
            d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2"
          />
          <circle cx="9" cy="7" r="4" strokeWidth="1.8" />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.8"
            d="M22 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"
          />
        </svg>
      ),

      timeline: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <rect
            x="3"
            y="4"
            width="18"
            height="17"
            rx="2"
            strokeWidth="1.8"
          />
          <path
            strokeLinecap="round"
            strokeWidth="1.8"
            d="M16 2v4M8 2v4M3 10h18"
          />
        </svg>
      ),
    };

    return icons[type];
  };

  /* -----------------------------
     Section Header
  ----------------------------- */

  const SectionHeader = ({ icon, title, description }) => {
    let colorClasses = "";
    switch (icon) {
      case "project":
        colorClasses = "from-indigo-50 to-purple-100 border-indigo-100 text-indigo-600";
        break;
      case "technical":
        colorClasses = "from-emerald-50 to-teal-100 border-emerald-100 text-emerald-600";
        break;
      case "people":
        colorClasses = "from-amber-50 to-orange-100 border-amber-100 text-amber-600";
        break;
      case "timeline":
        colorClasses = "from-rose-50 to-pink-100 border-rose-100 text-rose-600";
        break;
      default:
        colorClasses = "from-blue-50 to-indigo-100 border-blue-100 text-blue-500";
    }

    return (
      <div className="flex items-start gap-4 mb-7">
        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br border flex items-center justify-center shadow-sm ${colorClasses}`}>
          <SectionIcon type={icon} />
        </div>

      <div>
        <h3 className="text-[17px] font-bold text-slate-800">
          {title}
        </h3>

        {description && (
          <p className="text-[12px] text-slate-400 mt-1">
            {description}
          </p>
        )}
      </div>
    </div>
  );
  };

  return (
    <div 
      className="min-h-screen w-full bg-[#f8faff] px-4 py-6 sm:px-6 lg:px-10 bg-cover bg-center bg-no-repeat bg-fixed"
      style={{ backgroundImage: `url(${bgImage})` }}
    >

      {/* Main Container */}
      <div className="max-w-[1500px] mx-auto">

        {/* --------------------------------
            Header
        -------------------------------- */}
        <div className="relative overflow-hidden px-6 sm:px-8 py-7 mb-6 ">

          {/* Decorative circles */}
          <div className="absolute -right-10 -top-16 w-48 h-48 rounded-full bg-blue-100/30 blur-2xl" />
          <div className="absolute right-32 -bottom-20 w-44 h-44 rounded-full bg-purple-100/30 blur-2xl" />

          <div className="relative z-10">

            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-00">
              Project Request Form
            </h1>

            <p className="mt-2 text-[14px] text-slate-900">
              Submit a new project request with all the required details.
            </p>

          </div>
        </div>

        {/* --------------------------------
            Status Message
        -------------------------------- */}
        {status.message && (
          <div
            className={`mb-6 px-5 py-4 rounded-2xl flex items-center gap-3 text-[14px] font-semibold ${
              status.type === "success"
                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                : "bg-red-50 text-red-700 border border-red-200"
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                status.type === "success"
                  ? "bg-emerald-500"
                  : "bg-red-500"
              }`}
            />

            {status.message}
          </div>
        )}

        <form onSubmit={handleSubmit}>

          {/* =================================
              PROJECT DETAILS
          ================================= */}
          <section className="bg-white/90 backdrop-blur-sm border border-slate-200/80 rounded-3xl p-6 sm:p-8 mb-6 shadow-[0_6px_25px_rgba(80,100,140,0.05)]">

            <SectionHeader
              icon="project"
              title="Project Details"
              description="Basic information about the project"
            />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-7 gap-y-6">

              <div>
                <label className={labelClass}>
                  Project Name <span className="text-red-400">*</span>
                </label>

                <input
                  type="text"
                  name="projectName"
                  value={formData.projectName}
                  onChange={handleChange}
                  className={inputClass}
                  placeholder="Enter project name"
                  required
                />
              </div>

              <div>
                <label className={labelClass}>
                  Service Name <span className="text-red-400">*</span>
                </label>

                <input
                  type="text"
                  name="serviceName"
                  value={formData.serviceName}
                  onChange={handleChange}
                  className={inputClass}
                  placeholder="Enter service name"
                  required
                />
              </div>

              <div>
                <label className={labelClass}>
                  Resource Name <span className="text-red-400">*</span>
                </label>

                <input
                  type="text"
                  name="resourceName"
                  value={formData.resourceName}
                  onChange={handleChange}
                  className={inputClass}
                  placeholder="Enter resource name"
                  required
                />
              </div>

              <div>
                <label className={labelClass}>
                  Region <span className="text-red-400">*</span>
                </label>

                <input
                  type="text"
                  name="region"
                  value={formData.region}
                  onChange={handleChange}
                  className={inputClass}
                  placeholder="Enter region"
                  required
                />
              </div>

            </div>
          </section>


          {/* =================================
              TECHNICAL SPECIFICATIONS
          ================================= */}
          <section className="bg-white/90 backdrop-blur-sm border border-slate-200/80 rounded-3xl p-6 sm:p-8 mb-6 shadow-[0_6px_25px_rgba(80,100,140,0.05)]">

            <SectionHeader
              icon="technical"
              title="Technical Specifications"
              description="Define the technical requirements and estimated cost"
            />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-7 gap-y-6 mb-6">

              <div>
                <label className={labelClass}>
                  CI/CD Requirement{" "}
                  <span className="text-red-400">*</span>
                </label>

                <Select
                  value={formData.cicd}
                  onValueChange={(val) => handleSelectChange("cicd", val)}
                  required
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select CI/CD requirement" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="GitHub Actions">GitHub Actions</SelectItem>
                    <SelectItem value="Jenkins">Jenkins</SelectItem>
                    <SelectItem value="GitLab CI">GitLab CI</SelectItem>
                    <SelectItem value="None">None required</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className={labelClass}>
                  Cost Estimation ($){" "}
                  <span className="text-red-400">*</span>
                </label>

                <input
                  type="number"
                  name="costEstimation"
                  value={formData.costEstimation}
                  onChange={handleChange}
                  className={inputClass}
                  placeholder="Enter estimated cost"
                  required
                />
              </div>

            </div>

            <div>
              <label className={labelClass}>
                Detailed Specification{" "}
                <span className="text-red-400">*</span>
              </label>

              <textarea
                name="specification"
                value={formData.specification}
                onChange={handleChange}
                className={textareaClass}
                placeholder="Describe technical stack, goals, core features, integrations, and other requirements..."
                maxLength={1000}
                required
              />

              <div className="flex justify-end mt-2">
                <span className="text-[11px] text-slate-400">
                  {formData.specification.length}/1000
                </span>
              </div>
            </div>

          </section>


          {/* =================================
              PERSONNEL + STATUS
          ================================= */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-6">

            {/* Personnel */}
            <section className="bg-gradient-to-br from-white to-[#faf9ff] border border-slate-200/80 rounded-3xl p-6 sm:p-7 shadow-[0_6px_25px_rgba(80,100,140,0.05)]">

              <SectionHeader
                icon="people"
                title="Personnel & Approvals"
                description="Assign responsible people and approval details"
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">

                <div>
                  <label className={labelClass}>
                    Developer <span className="text-red-400">*</span>
                  </label>

                  <input
                    type="text"
                    name="developer"
                    value={formData.developer}
                    onChange={handleChange}
                    className={inputClass}
                    placeholder="Enter developer"
                    required
                  />
                </div>

                <div>
                  <label className={labelClass}>
                    Owner <span className="text-red-400">*</span>
                  </label>

                  <input
                    type="text"
                    name="owner"
                    value={formData.owner}
                    onChange={handleChange}
                    className={inputClass}
                    placeholder="Enter owner"
                    required
                  />
                </div>

                <div>
                  <label className={labelClass}>
                    Approve Name{" "}
                    <span className="text-red-400">*</span>
                  </label>

                  <input
                    type="text"
                    name="approveName"
                    value={formData.approveName}
                    onChange={handleChange}
                    className={inputClass}
                    placeholder="Enter approver"
                    required
                  />
                </div>

                <div>
                  <label className={labelClass}>
                    Approval Status{" "}
                    <span className="text-red-400">*</span>
                  </label>

                <Select
                  value={formData.approvalStatus}
                  onValueChange={(val) => handleSelectChange("approvalStatus", val)}
                  required
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Approved">Approved</SelectItem>
                    <SelectItem value="Denied">Denied</SelectItem>
                    <SelectItem value="Pending">Pending</SelectItem>
                  </SelectContent>
                </Select>
                </div>

              </div>

            </section>


            {/* Status */}
            <section className="bg-gradient-to-br from-white to-[#f8fffd] border border-slate-200/80 rounded-3xl p-6 sm:p-7 shadow-[0_6px_25px_rgba(80,100,140,0.05)]">

              <SectionHeader
                icon="timeline"
                title="Status & Timeline"
                description="Set project status and planned timeline"
              />

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">

                <div>
                  <label className={labelClass}>
                    Current Status{" "}
                    <span className="text-red-400">*</span>
                  </label>

                <Select
                  value={formData.currentStatus}
                  onValueChange={(val) => handleSelectChange("currentStatus", val)}
                  required
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
                </div>

                <div className="relative">
                  <label className={labelClass}>
                    Start Date{" "}
                    <span className="text-red-400">*</span>
                  </label>

                  <div 
                    className={`${inputClass} flex items-center cursor-pointer justify-between`}
                    onClick={() => setOpenCalendar(openCalendar === 'start' ? null : 'start')}
                  >
                    {formData.startDate ? format(parseISO(formData.startDate), "MMM d, yyyy") : <span className="text-slate-400">Select start date</span>}
                    <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                  </div>

                  {openCalendar === 'start' && (
                    <div className="absolute bottom-full left-0 mb-2 z-[60]">
                      <Calendar 
                        selected={formData.startDate ? parseISO(formData.startDate) : undefined}
                        onSelect={(date) => {
                          setFormData({ ...formData, startDate: format(date, "yyyy-MM-dd") });
                          setOpenCalendar(null);
                        }}
                        size="sm"
                      />
                    </div>
                  )}
                </div>

                <div className="relative">
                  <label className={labelClass}>
                    End Date{" "}
                    <span className="text-red-400">*</span>
                  </label>

                  <div 
                    className={`${inputClass} flex items-center cursor-pointer justify-between`}
                    onClick={() => setOpenCalendar(openCalendar === 'end' ? null : 'end')}
                  >
                    {formData.endDate ? format(parseISO(formData.endDate), "MMM d, yyyy") : <span className="text-slate-400">Select end date</span>}
                    <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                  </div>

                  {openCalendar === 'end' && (
                    <div className="absolute bottom-full left-0 mb-2 z-[60] lg:right-0 lg:left-auto">
                      <Calendar 
                        selected={formData.endDate ? parseISO(formData.endDate) : undefined}
                        onSelect={(date) => {
                          setFormData({ ...formData, endDate: format(date, "yyyy-MM-dd") });
                          setOpenCalendar(null);
                        }}
                        size="sm"
                      />
                    </div>
                  )}
                </div>

              </div>

            </section>

          </div>


          {/* =================================
              BOTTOM ACTION AREA
          ================================= */}

          <div className="flex justify-end items-center pt-2 pb-8">

            <button
              type="submit"
              disabled={status.loading}
              className="
                min-w-[220px]
                h-[52px]
                px-7
                rounded-2xl
                bg-gradient-to-r
                from-blue-500
                to-indigo-500
                hover:from-blue-600
                hover:to-indigo-600
                text-white
                text-[14px]
                font-bold
                shadow-[0_8px_24px_rgba(79,120,240,0.22)]
                hover:shadow-[0_10px_28px_rgba(79,120,240,0.30)]
                hover:-translate-y-[2px]
                active:translate-y-0
                transition-all
                duration-200
                disabled:opacity-60
                disabled:cursor-not-allowed
                flex
                items-center
                justify-center
                gap-2
              "
            >

              {status.loading ? (
                <>
                  <svg
                    className="animate-spin h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />

                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>

                  Processing...
                </>
              ) : (
                <>
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"
                    />
                  </svg>

                  Submit Project Request
                </>
              )}

            </button>

          </div>

        </form>

      </div>
    </div>
  );
};
 