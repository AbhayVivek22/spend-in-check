import React, { useRef, useState } from "react";
import type { Expense } from "../types";
import { Download, Upload, Key, Sparkles, AlertCircle } from "lucide-react";
import { generateInsights } from "../services/ai";

interface SettingsProps {
  apiKey: string;
  onApiKeyChange: (key: string) => void;
  expenses: Expense[];
  onImport: (expenses: Expense[]) => void;
}

export default function Settings({ apiKey, onApiKeyChange, expenses, onImport }: SettingsProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [insights, setInsights] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleExport = () => {
    const dataStr = JSON.stringify(expenses, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.download = `spendtrace_export_${new Date().toISOString().split('T')[0]}.json`;
    link.href = url;
    link.click();
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        if (Array.isArray(json)) {
          // Additional validation could be added here
          const confirmed = window.confirm("This will merge imported expenses with your current data. Continue?");
          if (confirmed) {
            onImport(json);
            alert("Data imported successfully!");
          }
        } else {
          alert("Invalid file format. Please upload a valid JSON array.");
        }
      } catch (err) {
        alert("Failed to parse file. Ensure it's a valid JSON.");
      }
    };
    reader.readAsText(file);
    // reset input
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleGenerateInsights = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await generateInsights(expenses, apiKey);
      setInsights(res);
    } catch (err: any) {
      setError(err.message || "Failed to generate insights.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 w-full max-w-lg mx-auto p-4 pb-24 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="py-6">
        <h1 className="text-2xl font-light tracking-tight text-white">Settings & AI</h1>
        <p className="text-zinc-500 text-xs mt-1 uppercase tracking-widest font-bold">Manage data and get insights</p>
      </header>

      {/* AI Insights Section */}
      <div className="bg-gradient-to-br from-indigo-900/20 to-purple-900/10 border border-indigo-500/20 p-6 rounded-3xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <Sparkles className="w-32 h-32 text-indigo-400" />
        </div>
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-indigo-300 flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              AI Insight Engine
            </h3>
            <span className="text-[10px] bg-indigo-500/20 text-indigo-400 px-2 py-1 rounded font-bold uppercase tracking-widest">Gemini</span>
          </div>
          <p className="text-xs text-zinc-400 leading-relaxed mb-4">
            Get personalized, intelligent insights about your spending habits.
          </p>
          
          <button 
            onClick={handleGenerateInsights}
            disabled={loading}
            className="w-full py-3 text-xs bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/30 text-indigo-300 rounded-xl font-bold uppercase tracking-widest transition-colors flex justify-center items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
               <div className="w-4 h-4 border-2 border-indigo-300/20 border-t-indigo-300 rounded-full animate-spin" />
            ) : (
               "Generate Insights"
            )}
          </button>

          {error && (
            <div className="mt-4 p-3 bg-red-900/20 text-red-400 text-xs rounded-xl flex gap-2 items-start border border-red-500/20">
               <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
               <p>{error}</p>
            </div>
          )}

          {insights && !loading && (
            <div className="mt-4 p-4 bg-black/40 rounded-xl border border-indigo-500/20">
              <h3 className="text-[10px] font-bold text-indigo-400 mb-2 uppercase tracking-widest border-b border-indigo-500/20 pb-2">Analysis Complete</h3>
              <div className="text-xs text-zinc-300 space-y-2 whitespace-pre-wrap leading-relaxed">
                {insights}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="bg-zinc-900/50 border border-zinc-800 rounded-3xl p-6">
        <h2 className="text-sm font-bold text-zinc-100 mb-4 flex items-center gap-2">
          <Key className="w-4 h-4 text-zinc-500" />
          API Key (Optional)
        </h2>
        <p className="text-xs text-zinc-500 mb-4">
          Enter your own Gemini API key for AI features. Stored locally.
        </p>
        <div>
          <input
            type="password"
            value={apiKey}
            onChange={(e) => onApiKeyChange(e.target.value)}
            className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-3 text-sm text-zinc-300 focus:outline-none focus:border-emerald-500 transition-colors"
            placeholder="AIzaSy..."
          />
        </div>
      </div>

      <div className="bg-zinc-900/50 border border-zinc-800 rounded-3xl p-6">
        <h2 className="text-sm font-bold text-zinc-100 mb-4">Data Management</h2>
        
        <div className="space-y-3">
          <button
            onClick={handleExport}
            className="w-full flex items-center justify-between p-4 rounded-xl bg-zinc-800/30 border border-zinc-800 hover:bg-zinc-800 transition-colors group"
          >
            <div className="flex items-center gap-4">
              <div className="p-2 bg-zinc-900 border border-zinc-800 rounded-lg group-hover:bg-zinc-800 group-hover:border-zinc-700 transition-colors">
                <Download className="w-4 h-4 text-zinc-400 group-hover:text-zinc-300" />
              </div>
              <div className="text-left">
                <div className="text-sm font-medium text-white">Export Data</div>
                <div className="text-[10px] text-zinc-500 uppercase tracking-widest mt-1">Save as JSON</div>
              </div>
            </div>
          </button>

          <button
            onClick={handleImportClick}
            className="w-full flex items-center justify-between p-4 rounded-xl bg-zinc-800/30 border border-zinc-800 hover:bg-zinc-800 transition-colors group"
          >
            <div className="flex items-center gap-4">
              <div className="p-2 bg-zinc-900 border border-zinc-800 rounded-lg group-hover:bg-zinc-800 group-hover:border-zinc-700 transition-colors">
                <Upload className="w-4 h-4 text-zinc-400 group-hover:text-zinc-300" />
              </div>
              <div className="text-left">
                <div className="text-sm font-medium text-white">Import Data</div>
                <div className="text-[10px] text-zinc-500 uppercase tracking-widest mt-1">Load from JSON</div>
              </div>
            </div>
          </button>
          <input 
            type="file" 
            accept="application/json" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            className="hidden" 
          />
        </div>
      </div>
    </div>
  );
}
