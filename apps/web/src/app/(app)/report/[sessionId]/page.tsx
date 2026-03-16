"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import ReportRenderer from "@/components/report/report-renderer";

interface ReportData {
  sessionId: string;
  sections: Record<string, unknown>;
  preset?: string;
  createdAt: string;
  [key: string]: unknown;
}

export default function ReportViewPage() {
  const params = useParams();
  const sessionId = params.sessionId as string;

  const [report, setReport] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchReport = async () => {
      setLoading(true);
      setError("");
      try {
        const token = localStorage.getItem("df_token");
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000"}/api/report/${sessionId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        const data = await res.json();
        if (!res.ok) throw new Error(data.error?.message || "Failed to load report");
        setReport(data);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Failed to load report");
      } finally {
        setLoading(false);
      }
    };

    if (sessionId) fetchReport();
  }, [sessionId]);

  const handleExport = useCallback(() => {
    if (!report) return;
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `df-report-${sessionId}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [report, sessionId]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-brand-200 border-t-brand-600 mb-4" />
        <p className="text-sm text-surface-700">Loading report...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-24">
        <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center max-w-md">
          <svg className="mx-auto mb-3 h-10 w-10 text-red-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
          </svg>
          <h2 className="text-lg font-semibold text-red-700 mb-2">Failed to Load Report</h2>
          <p className="text-sm text-red-600 mb-4">{error}</p>
          <Link
            href="/report"
            className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 transition-colors"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
            </svg>
            Back to Reports
          </Link>
        </div>
      </div>
    );
  }

  if (!report) return null;

  return (
    <div className="mx-auto max-w-5xl">
      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Link
            href="/report"
            className="mb-2 inline-flex items-center gap-1.5 text-sm font-medium text-brand-600 hover:text-brand-700 transition-colors"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
            </svg>
            Back to Reports
          </Link>
          <h1 className="text-2xl font-bold text-surface-900">
            {report.preset ? `${report.preset} Report` : "Custom Report"}
          </h1>
          <p className="mt-1 text-sm text-surface-700">
            Session: {sessionId}
            {report.createdAt && (
              <span className="ml-2 text-surface-300">
                {new Date(report.createdAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                  hour: "numeric",
                  minute: "2-digit",
                })}
              </span>
            )}
          </p>
        </div>
        <button
          type="button"
          onClick={handleExport}
          className="inline-flex items-center gap-2 rounded-xl border border-surface-200 bg-white px-5 py-2.5 text-sm font-medium text-surface-900 shadow-sm transition-all hover:bg-surface-50 hover:shadow-md"
        >
          <svg className="h-4 w-4 text-surface-700" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
          </svg>
          Export Full Report
        </button>
      </div>

      {/* Report Content */}
      <ReportRenderer sections={Array.isArray(report.sections) ? report.sections : []} />
    </div>
  );
}
