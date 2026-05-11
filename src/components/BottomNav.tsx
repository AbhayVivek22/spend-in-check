import React from "react";
import { LayoutDashboard, List, PlusCircle, Settings as SettingsIcon } from "lucide-react";
import { cn } from "../lib/utils";

interface BottomNavProps {
  currentTab: "dashboard" | "add" | "history" | "settings";
  onChangeTab: (tab: "dashboard" | "add" | "history" | "settings") => void;
}

export default function BottomNav({ currentTab, onChangeTab }: BottomNavProps) {
  const tabs: Array<{
    id: "dashboard" | "add" | "history" | "settings";
    icon: React.ElementType;
    label: string;
    isFab?: boolean;
  }> = [
    { id: "dashboard", icon: LayoutDashboard, label: "Home" },
    { id: "history", icon: List, label: "History" },
    { id: "add", icon: PlusCircle, label: "Add", isFab: true },
    { id: "settings", icon: SettingsIcon, label: "Settings" },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-black/90 backdrop-blur-md border-t border-zinc-800 pb-safe z-50 shadow-[0_-4px_20px_rgba(0,0,0,0.5)]">
      <div className="w-full max-w-md mx-auto flex justify-between items-center px-6 h-16 relative">
        {tabs.map((tab) => {
          const isActive = currentTab === tab.id;
          const Icon = tab.icon;

          if (tab.isFab) {
            return (
              <button
                key={tab.id}
                onClick={() => onChangeTab(tab.id)}
                className="relative -top-5 flex flex-col items-center justify-center tap-highlight-transparent"
              >
                <div className={cn(
                  "w-12 h-12 rounded-full flex items-center justify-center text-white shadow-lg transition-transform active:scale-95 duration-200", 
                  isActive ? "bg-emerald-500 shadow-emerald-500/20 text-black" : "bg-zinc-800 border border-zinc-700 hover:bg-zinc-700 text-emerald-500"
                )}>
                  <Icon className="w-6 h-6" strokeWidth={isActive ? 2.5 : 2} />
                </div>
              </button>
            );
          }

          return (
            <button
              key={tab.id}
              onClick={() => onChangeTab(tab.id as any)}
              className="flex flex-col items-center justify-center w-16 h-full gap-1 tap-highlight-transparent"
            >
              <Icon 
                className={cn(
                  "w-6 h-6 transition-colors duration-200",
                  isActive ? "text-emerald-500" : "text-zinc-500 group-hover:text-zinc-300"
                )} 
                strokeWidth={isActive ? 2.5 : 2}
              />
              <span 
                className={cn(
                  "text-[10px] font-medium transition-colors duration-200 mt-1",
                  isActive ? "text-emerald-500" : "text-zinc-500"
                )}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
