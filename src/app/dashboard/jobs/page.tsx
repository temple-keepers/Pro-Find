"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Plus,
  CheckCircle,
  Circle,
  Camera,
  MessageCircle,
  ChevronDown,
  ChevronUp,
  DollarSign,
  Clock,
  Package,
  Wrench,
  ClipboardCheck,
  PartyPopper,
} from "lucide-react";
import { formatGYD } from "@/lib/utils/pricing";

type MilestoneKey =
  | "deposit_paid"
  | "materials_purchased"
  | "work_started"
  | "half_complete"
  | "final_inspection"
  | "complete";

const MILESTONE_STEPS: {
  key: MilestoneKey;
  label: string;
  icon: React.ElementType;
  description: string;
}[] = [
  {
    key: "deposit_paid",
    label: "Deposit Paid",
    icon: DollarSign,
    description: "Customer paid initial deposit",
  },
  {
    key: "materials_purchased",
    label: "Materials Purchased",
    icon: Package,
    description: "Bought all materials needed for the job",
  },
  {
    key: "work_started",
    label: "Work Started",
    icon: Wrench,
    description: "On-site and work is underway",
  },
  {
    key: "half_complete",
    label: "50% Complete",
    icon: Clock,
    description: "Job is halfway done",
  },
  {
    key: "final_inspection",
    label: "Final Inspection",
    icon: ClipboardCheck,
    description: "Customer reviewing the finished work",
  },
  {
    key: "complete",
    label: "Complete",
    icon: PartyPopper,
    description: "Job done, payment received",
  },
];

interface DemoJob {
  id: string;
  customerName: string;
  customerPhone: string;
  jobDescription: string;
  totalAgreed: number;
  currentStep: number; // 0-5 index into MILESTONE_STEPS
  milestones: {
    step: number;
    note: string;
    date: string;
  }[];
  createdAt: string;
}

const DEMO_JOBS: DemoJob[] = [
  {
    id: "j-001",
    customerName: "Sandra Gonsalves",
    customerPhone: "6001234",
    jobDescription: "Fix leaking pipe + replace corroded section under kitchen sink",
    totalAgreed: 18000,
    currentStep: 3,
    milestones: [
      { step: 0, note: "$5,000 deposit received", date: "2025-02-10" },
      { step: 1, note: "PVC pipe and fittings from Gafoors — $4,200", date: "2025-02-11" },
      { step: 2, note: "Started work, removed old pipe section", date: "2025-02-11" },
      { step: 3, note: "New pipe installed, testing for leaks", date: "2025-02-12" },
    ],
    createdAt: "2025-02-10",
  },
  {
    id: "j-002",
    customerName: "Ravi Doobay",
    customerPhone: "6112345",
    jobDescription: "Bathroom renovation — new toilet, sink, and tiling",
    totalAgreed: 85000,
    currentStep: 1,
    milestones: [
      { step: 0, note: "$25,000 deposit received", date: "2025-02-13" },
      { step: 1, note: "Materials ordered from Gafoors, delivery tomorrow", date: "2025-02-14" },
    ],
    createdAt: "2025-02-13",
  },
];

function JobCard({ job, onAdvance }: { job: DemoJob; onAdvance: (id: string) => void }) {
  const [expanded, setExpanded] = useState(false);
  const currentMilestone = MILESTONE_STEPS[job.currentStep];
  const progress = ((job.currentStep + 1) / MILESTONE_STEPS.length) * 100;
  const isComplete = job.currentStep >= MILESTONE_STEPS.length - 1;

  return (
    <div className="card border border-gray-100">
      {/* Header */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full p-4 flex items-start gap-3 text-left"
      >
        <div
          className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
            isComplete
              ? "bg-brand-green-100"
              : "bg-blue-50"
          }`}
        >
          {isComplete ? (
            <CheckCircle className="w-5 h-5 text-brand-green-600" />
          ) : (
            <currentMilestone.icon className="w-5 h-5 text-blue-600" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-sm">{job.customerName}</p>
          <p className="text-xs text-text-secondary line-clamp-1">
            {job.jobDescription}
          </p>
          <div className="flex items-center gap-3 mt-2">
            <span className="text-xs text-text-muted">
              {formatGYD(job.totalAgreed)} GYD
            </span>
            <span
              className={`text-xs font-medium ${
                isComplete ? "text-brand-green-600" : "text-blue-600"
              }`}
            >
              {currentMilestone.label}
            </span>
          </div>
          {/* Progress bar */}
          <div className="w-full bg-gray-100 rounded-full h-1.5 mt-2">
            <div
              className={`h-1.5 rounded-full transition-all duration-500 ${
                isComplete ? "bg-brand-green-500" : "bg-blue-500"
              }`}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
        {expanded ? (
          <ChevronUp className="w-4 h-4 text-text-muted flex-shrink-0" />
        ) : (
          <ChevronDown className="w-4 h-4 text-text-muted flex-shrink-0" />
        )}
      </button>

      {/* Expanded Timeline */}
      {expanded && (
        <div className="px-4 pb-4 border-t border-gray-50 pt-3">
          <div className="ml-1 space-y-0">
            {MILESTONE_STEPS.map((step, index) => {
              const milestone = job.milestones.find((m) => m.step === index);
              const isReached = index <= job.currentStep;
              const isCurrent = index === job.currentStep;
              const StepIcon = step.icon;

              return (
                <div key={step.key} className="flex gap-3">
                  {/* Timeline line + dot */}
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${
                        isReached
                          ? isCurrent
                            ? "bg-blue-500 text-white"
                            : "bg-brand-green-500 text-white"
                          : "bg-gray-100 text-gray-400"
                      }`}
                    >
                      {isReached && !isCurrent ? (
                        <CheckCircle className="w-4 h-4" />
                      ) : (
                        <StepIcon className="w-3.5 h-3.5" />
                      )}
                    </div>
                    {index < MILESTONE_STEPS.length - 1 && (
                      <div
                        className={`w-0.5 h-8 ${
                          index < job.currentStep
                            ? "bg-brand-green-300"
                            : "bg-gray-100"
                        }`}
                      />
                    )}
                  </div>

                  {/* Content */}
                  <div className="pb-4 min-w-0">
                    <p
                      className={`text-sm font-medium ${
                        isReached ? "text-text-primary" : "text-text-muted"
                      }`}
                    >
                      {step.label}
                    </p>
                    {milestone ? (
                      <>
                        <p className="text-xs text-text-secondary mt-0.5">
                          {milestone.note}
                        </p>
                        <p className="text-xs text-text-muted mt-0.5">
                          {new Date(milestone.date).toLocaleDateString(
                            "en-GB",
                            { day: "numeric", month: "short" }
                          )}
                        </p>
                      </>
                    ) : isReached ? null : (
                      <p className="text-xs text-text-muted mt-0.5">
                        {step.description}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Actions */}
          <div className="flex gap-2 mt-2 pt-3 border-t border-gray-50">
            {!isComplete && (
              <button
                onClick={() => onAdvance(job.id)}
                className="btn-primary text-xs flex-1 flex items-center justify-center gap-1.5 !py-2"
              >
                <CheckCircle className="w-3.5 h-3.5" />
                Mark {MILESTONE_STEPS[job.currentStep + 1]?.label || "Complete"}
              </button>
            )}
            <a
              href={`https://wa.me/592${job.customerPhone}?text=${encodeURIComponent(
                `Hi ${job.customerName}, update on your job (${job.jobDescription}): Currently at "${currentMilestone.label}". — ${DEMO_JOBS[0].customerName === job.customerName ? "Marcus" : "Marcus"}, ProFind Guyana`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-whatsapp text-xs !py-2 flex items-center gap-1.5"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              Update
            </a>
          </div>
        </div>
      )}
    </div>
  );
}

export default function JobsPage() {
  const [jobs, setJobs] = useState<DemoJob[]>(DEMO_JOBS);
  const [showNewJob, setShowNewJob] = useState(false);
  const [newCustomerName, setNewCustomerName] = useState("");
  const [newCustomerPhone, setNewCustomerPhone] = useState("");
  const [newJobDescription, setNewJobDescription] = useState("");
  const [newTotalAgreed, setNewTotalAgreed] = useState("");

  const advanceJob = (jobId: string) => {
    setJobs(
      jobs.map((j) => {
        if (j.id === jobId && j.currentStep < MILESTONE_STEPS.length - 1) {
          const nextStep = j.currentStep + 1;
          return {
            ...j,
            currentStep: nextStep,
            milestones: [
              ...j.milestones,
              {
                step: nextStep,
                note: `Marked as ${MILESTONE_STEPS[nextStep].label}`,
                date: new Date().toISOString().split("T")[0],
              },
            ],
          };
        }
        return j;
      })
    );
  };

  const handleCreateJob = () => {
    if (!newCustomerName.trim() || !newJobDescription.trim()) return;

    const newJob: DemoJob = {
      id: `j-${Date.now()}`,
      customerName: newCustomerName,
      customerPhone: newCustomerPhone,
      jobDescription: newJobDescription,
      totalAgreed: parseInt(newTotalAgreed) || 0,
      currentStep: 0,
      milestones: [
        {
          step: 0,
          note: "Job created",
          date: new Date().toISOString().split("T")[0],
        },
      ],
      createdAt: new Date().toISOString(),
    };

    setJobs([newJob, ...jobs]);
    setShowNewJob(false);
    setNewCustomerName("");
    setNewCustomerPhone("");
    setNewJobDescription("");
    setNewTotalAgreed("");
  };

  const activeJobs = jobs.filter(
    (j) => j.currentStep < MILESTONE_STEPS.length - 1
  );
  const completedJobs = jobs.filter(
    (j) => j.currentStep >= MILESTONE_STEPS.length - 1
  );

  return (
    <div className="min-h-screen bg-surface-warm">
      {/* Header */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/dashboard"
              className="p-1 -ml-1 text-text-muted hover:text-text-primary"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="font-semibold text-sm">My Jobs</h1>
              <p className="text-xs text-text-muted">
                {activeJobs.length} active · {completedJobs.length} completed
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowNewJob(!showNewJob)}
            className="btn-primary text-xs !py-1.5 !px-3 flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" />
            New Job
          </button>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 py-5 space-y-4">
        {/* New Job Form */}
        {showNewJob && (
          <div className="card p-5 border-2 border-brand-green-200 bg-brand-green-50">
            <h3 className="font-semibold text-sm mb-3">New Job</h3>
            <div className="space-y-3">
              <input
                type="text"
                value={newCustomerName}
                onChange={(e) => setNewCustomerName(e.target.value)}
                placeholder="Customer name *"
                className="input-field text-sm"
              />
              <div className="flex">
                <span className="inline-flex items-center px-3 bg-white border border-r-0 border-gray-200 rounded-l-xl text-sm text-text-muted">
                  +592
                </span>
                <input
                  type="tel"
                  value={newCustomerPhone}
                  onChange={(e) => setNewCustomerPhone(e.target.value)}
                  placeholder="Customer phone"
                  className="input-field text-sm !rounded-l-none flex-1"
                />
              </div>
              <textarea
                value={newJobDescription}
                onChange={(e) => setNewJobDescription(e.target.value)}
                placeholder="Job description *"
                rows={2}
                className="input-field text-sm resize-none"
              />
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                <input
                  type="number"
                  value={newTotalAgreed}
                  onChange={(e) => setNewTotalAgreed(e.target.value)}
                  placeholder="Agreed total (GYD)"
                  className="input-field text-sm !pl-9"
                />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleCreateJob}
                  disabled={!newCustomerName.trim() || !newJobDescription.trim()}
                  className="btn-primary text-sm flex-1 disabled:opacity-50"
                >
                  Create Job
                </button>
                <button
                  onClick={() => setShowNewJob(false)}
                  className="btn-secondary text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Active Jobs */}
        {activeJobs.length > 0 && (
          <div>
            <h2 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-3">
              Active ({activeJobs.length})
            </h2>
            <div className="space-y-3">
              {activeJobs.map((job) => (
                <JobCard key={job.id} job={job} onAdvance={advanceJob} />
              ))}
            </div>
          </div>
        )}

        {/* Completed */}
        {completedJobs.length > 0 && (
          <div>
            <h2 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-3">
              Completed ({completedJobs.length})
            </h2>
            <div className="space-y-3">
              {completedJobs.map((job) => (
                <JobCard key={job.id} job={job} onAdvance={advanceJob} />
              ))}
            </div>
          </div>
        )}

        {/* Empty state */}
        {jobs.length === 0 && (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-surface-muted rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Wrench className="w-8 h-8 text-text-muted" />
            </div>
            <h2 className="font-display text-xl mb-2">No jobs yet</h2>
            <p className="text-sm text-text-secondary mb-6">
              Start tracking your jobs to show customers your progress.
            </p>
            <button
              onClick={() => setShowNewJob(true)}
              className="btn-primary inline-flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Create First Job
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
