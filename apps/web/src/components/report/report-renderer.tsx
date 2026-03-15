"use client";

import { useState } from "react";

/* ─── Types ─── */
interface UiBlock {
  type:
    | "heading"
    | "paragraph"
    | "list"
    | "numbered_list"
    | "table"
    | "score_bar"
    | "color_swatch"
    | "checklist"
    | "math"
    | "quote"
    | "card"
    | "divider"
    | "chart";
  content?: string;
  level?: number;
  items?: string[];
  headers?: string[];
  rows?: string[][];
  label?: string;
  value?: number;
  max?: number;
  color?: string;
  colorName?: string;
  checked?: boolean[];
  expression?: string;
  author?: string;
  title?: string;
  body?: string;
  chartType?: string;
  data?: any;
}

interface SectionOutput {
  sectionKey: string;
  title: string;
  ui_blocks: UiBlock[];
}

interface ReportRendererProps {
  sections: SectionOutput[];
}

/* ─── Block Renderers ─── */
function renderBlock(block: UiBlock, index: number) {
  switch (block.type) {
    case "heading":
      if (block.level === 1) return <h2 key={index} className="mb-3 mt-6 text-2xl font-bold text-surface-900 first:mt-0">{block.content}</h2>;
      if (block.level === 2) return <h3 key={index} className="mb-2 mt-5 text-xl font-semibold text-surface-900">{block.content}</h3>;
      return <h4 key={index} className="mb-2 mt-4 text-lg font-semibold text-surface-800">{block.content}</h4>;

    case "paragraph":
      return <p key={index} className="mb-3 leading-relaxed text-surface-700">{block.content}</p>;

    case "list":
      return (
        <ul key={index} className="mb-4 space-y-1.5 pl-5">
          {block.items?.map((item, i) => (
            <li key={i} className="list-disc text-surface-700 leading-relaxed marker:text-brand-400">{item}</li>
          ))}
        </ul>
      );

    case "numbered_list":
      return (
        <ol key={index} className="mb-4 space-y-1.5 pl-5">
          {block.items?.map((item, i) => (
            <li key={i} className="list-decimal text-surface-700 leading-relaxed marker:text-brand-500 marker:font-semibold">{item}</li>
          ))}
        </ol>
      );

    case "table":
      return (
        <div key={index} className="mb-4 overflow-x-auto rounded-xl border border-surface-200">
          <table className="w-full text-sm">
            {block.headers && (
              <thead className="bg-surface-50">
                <tr>
                  {block.headers.map((h, i) => (
                    <th key={i} className="px-4 py-3 text-left font-semibold text-surface-900">{h}</th>
                  ))}
                </tr>
              </thead>
            )}
            <tbody className="divide-y divide-surface-200">
              {block.rows?.map((row, i) => (
                <tr key={i} className="hover:bg-surface-50 transition-colors">
                  {row.map((cell, j) => (
                    <td key={j} className="px-4 py-3 text-surface-700">{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );

    case "score_bar": {
      const pct = ((block.value || 0) / (block.max || 100)) * 100;
      return (
        <div key={index} className="mb-4">
          <div className="mb-1 flex items-center justify-between">
            <span className="text-sm font-medium text-surface-900">{block.label}</span>
            <span className="text-sm font-semibold text-brand-600">{block.value}/{block.max || 100}</span>
          </div>
          <div className="h-2.5 w-full overflow-hidden rounded-full bg-surface-200">
            <div
              className="h-full rounded-full bg-gradient-to-r from-brand-500 to-cosmic-500 transition-all duration-700"
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>
      );
    }

    case "color_swatch":
      return (
        <div key={index} className="mb-4 inline-flex items-center gap-3 rounded-xl border border-surface-200 px-4 py-3">
          <div
            className="h-10 w-10 rounded-lg shadow-inner"
            style={{ backgroundColor: block.color }}
          />
          <div>
            <p className="text-sm font-semibold text-surface-900">{block.colorName}</p>
            <p className="text-xs text-surface-700 font-mono">{block.color}</p>
          </div>
        </div>
      );

    case "checklist":
      return (
        <div key={index} className="mb-4 space-y-2">
          {block.items?.map((item, i) => {
            const isChecked = block.checked?.[i] ?? false;
            return (
              <div key={i} className="flex items-center gap-3">
                <div className={`flex h-5 w-5 shrink-0 items-center justify-center rounded border ${
                  isChecked
                    ? "border-brand-500 bg-brand-500"
                    : "border-surface-300 bg-white"
                }`}>
                  {isChecked && (
                    <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                    </svg>
                  )}
                </div>
                <span className={`text-sm ${isChecked ? "text-surface-700 line-through" : "text-surface-900"}`}>
                  {item}
                </span>
              </div>
            );
          })}
        </div>
      );

    case "math":
      return (
        <div key={index} className="mb-4 rounded-xl bg-surface-50 px-5 py-3 font-mono text-sm text-surface-800">
          {block.expression}
        </div>
      );

    case "quote":
      return (
        <blockquote key={index} className="mb-4 border-l-4 border-brand-400 bg-brand-50/50 px-5 py-4 rounded-r-xl">
          <p className="text-surface-800 italic leading-relaxed">&ldquo;{block.content}&rdquo;</p>
          {block.author && (
            <p className="mt-2 text-sm font-medium text-brand-600">-- {block.author}</p>
          )}
        </blockquote>
      );

    case "card":
      return (
        <div key={index} className="mb-4 rounded-xl border border-surface-200 bg-gradient-to-br from-white to-surface-50 p-5 shadow-sm">
          {block.title && <h4 className="mb-2 text-base font-semibold text-surface-900">{block.title}</h4>}
          {block.body && <p className="text-sm text-surface-700 leading-relaxed">{block.body}</p>}
        </div>
      );

    case "divider":
      return <hr key={index} className="my-6 border-surface-200" />;

    case "chart":
      return (
        <div key={index} className="mb-4 flex h-48 items-center justify-center rounded-xl border border-dashed border-surface-300 bg-surface-50">
          <div className="text-center">
            <svg className="mx-auto mb-2 h-8 w-8 text-surface-300" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />
            </svg>
            <p className="text-sm text-surface-700">Chart: {block.chartType || "bar"}</p>
            <p className="text-xs text-surface-300">Visualization will render with chart library</p>
          </div>
        </div>
      );

    default:
      return null;
  }
}

/* ─── Section Card ─── */
function SectionCard({ section }: { section: SectionOutput }) {
  const [collapsed, setCollapsed] = useState(false);

  const handleExport = () => {
    const text = section.ui_blocks
      .map((b) => {
        switch (b.type) {
          case "heading": return `\n${"#".repeat(b.level || 2)} ${b.content}\n`;
          case "paragraph": return b.content;
          case "list": return b.items?.map((i) => `  - ${i}`).join("\n");
          case "numbered_list": return b.items?.map((i, idx) => `  ${idx + 1}. ${i}`).join("\n");
          case "quote": return `> ${b.content}${b.author ? ` -- ${b.author}` : ""}`;
          case "score_bar": return `${b.label}: ${b.value}/${b.max}`;
          case "divider": return "---";
          default: return b.content || "";
        }
      })
      .join("\n\n");

    const blob = new Blob([`# ${section.title}\n\n${text}`], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${section.sectionKey}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="rounded-2xl border border-surface-200 bg-white shadow-sm overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-surface-200 px-6 py-4">
        <button
          type="button"
          onClick={() => setCollapsed(!collapsed)}
          className="flex flex-1 items-center gap-3 text-left"
        >
          <svg
            className={`h-5 w-5 text-surface-700 transition-transform duration-200 ${collapsed ? "" : "rotate-90"}`}
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
          </svg>
          <h2 className="text-lg font-semibold text-surface-900">{section.title}</h2>
        </button>
        <button
          type="button"
          onClick={handleExport}
          className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium text-surface-700 transition-colors hover:bg-surface-50"
          title="Export section"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
          </svg>
          Export
        </button>
      </div>

      {/* Content */}
      {!collapsed && (
        <div className="px-6 py-5 animate-fade-in">
          {section.ui_blocks.map((block, i) => renderBlock(block, i))}
        </div>
      )}
    </div>
  );
}

/* ─── Main Component ─── */
export default function ReportRenderer({ sections }: ReportRendererProps) {
  if (sections.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-surface-200 py-20">
        <svg className="mb-4 h-12 w-12 text-surface-300" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
        </svg>
        <p className="text-lg font-medium text-surface-700">No report sections to display</p>
        <p className="mt-1 text-sm text-surface-300">Generate a report to see your insights here.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {sections.map((section) => (
        <SectionCard key={section.sectionKey} section={section} />
      ))}
    </div>
  );
}
