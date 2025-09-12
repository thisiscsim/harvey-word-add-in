"use client";

import { 
  ChevronsLeft, 
  ChevronsRight,
  ListFilter,
  Cog,
  MoveHorizontal,
  Rows3
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useState } from "react";
import Image from "next/image";

interface ReviewTableToolbarProps {
  chatOpen: boolean;
  onToggleChat: () => void;
  onCloseArtifact?: () => void;
}

export default function ReviewTableToolbar({ chatOpen, onToggleChat, onCloseArtifact }: ReviewTableToolbarProps) {
  const [activeView, setActiveView] = useState<'compact' | 'standard' | 'comfortable'>('standard');
  return (
    <TooltipProvider>
      <div className="px-3 py-2 border-b border-neutral-200 bg-white flex items-center justify-between overflow-x-auto" style={{ minHeight: '52px' }}>
        <div className="flex items-center gap-1">
          {/* Toggle Chat Button */}
          <Tooltip>
            <TooltipTrigger asChild>
              <button 
                onClick={onToggleChat}
                className="p-2 rounded-md transition-colors hover:bg-neutral-100 text-neutral-600"
              >
                {chatOpen ? (
                  <ChevronsLeft size={16} />
                ) : (
                  <ChevronsRight size={16} />
                )}
              </button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{chatOpen ? "Hide assistant" : "Show assistant"}</p>
            </TooltipContent>
          </Tooltip>
          
          {/* Separator */}
          <div className="w-px bg-neutral-200" style={{ height: '20px' }}></div>
          
          {/* Table-specific buttons */}
          <div className="flex items-center gap-1">
            {/* Filter */}
            <Tooltip>
              <TooltipTrigger asChild>
                <button 
                  className="px-3 py-1.5 rounded-md transition-colors hover:bg-neutral-100 text-neutral-600 flex items-center gap-2"
                >
                  <ListFilter size={14} />
                  <span className="text-sm">Filter</span>
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Filter table data</p>
              </TooltipContent>
            </Tooltip>

            {/* Manage columns */}
            <Tooltip>
              <TooltipTrigger asChild>
                <button 
                  className="px-3 py-1.5 rounded-md transition-colors hover:bg-neutral-100 text-neutral-600 flex items-center gap-2"
                >
                  <Cog size={14} />
                  <span className="text-sm">Manage columns</span>
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Show/hide columns</p>
              </TooltipContent>
            </Tooltip>
          </div>

          {/* Separator */}
          <div className="w-px bg-neutral-200" style={{ height: '20px' }}></div>

          {/* Table view options */}
          <div className="flex items-center gap-1">
            {/* Compact view */}
            <Tooltip>
              <TooltipTrigger asChild>
                <button 
                  onClick={() => setActiveView('compact')}
                  className={`p-2 rounded-md transition-colors ${
                    activeView === 'compact' 
                      ? 'bg-neutral-200 text-neutral-900 hover:bg-neutral-300' 
                      : 'text-neutral-600 hover:bg-neutral-100'
                  }`}
                >
                  <Image 
                    src={activeView === 'compact' ? "/top-align-filled.svg" : "/top-align-outline.svg"} 
                    alt="Compact view" 
                    width={16} 
                    height={16}
                  />
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Compact view</p>
              </TooltipContent>
            </Tooltip>

            {/* Standard view */}
            <Tooltip>
              <TooltipTrigger asChild>
                <button 
                  onClick={() => setActiveView('standard')}
                  className={`p-2 rounded-md transition-colors ${
                    activeView === 'standard' 
                      ? 'bg-neutral-200 text-neutral-900 hover:bg-neutral-300' 
                      : 'text-neutral-600 hover:bg-neutral-100'
                  }`}
                >
                  <Image 
                    src={activeView === 'standard' ? "/center-align-filled.svg" : "/center-align-outline.svg"} 
                    alt="Standard view" 
                    width={16} 
                    height={16}
                  />
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Standard view</p>
              </TooltipContent>
            </Tooltip>

            {/* Comfortable view */}
            <Tooltip>
              <TooltipTrigger asChild>
                <button 
                  onClick={() => setActiveView('comfortable')}
                  className={`p-2 rounded-md transition-colors ${
                    activeView === 'comfortable' 
                      ? 'bg-neutral-200 text-neutral-900 hover:bg-neutral-300' 
                      : 'text-neutral-600 hover:bg-neutral-100'
                  }`}
                >
                  <Image 
                    src={activeView === 'comfortable' ? "/bottom-align-filled.svg" : "/bottom-align-outline.svg"} 
                    alt="Comfortable view" 
                    width={16} 
                    height={16}
                  />
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Comfortable view</p>
              </TooltipContent>
            </Tooltip>
          </div>

          {/* Separator */}
          <div className="w-px bg-neutral-200" style={{ height: '20px' }}></div>

          {/* Column actions */}
          <div className="flex items-center gap-1">
            {/* Resize columns */}
            <Tooltip>
              <TooltipTrigger asChild>
                <button 
                  className="p-2 rounded-md transition-colors hover:bg-neutral-100 text-neutral-600"
                >
                  <MoveHorizontal size={16} />
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Resize columns</p>
              </TooltipContent>
            </Tooltip>

            {/* Row height */}
            <Tooltip>
              <TooltipTrigger asChild>
                <button 
                  className="p-2 rounded-md transition-colors hover:bg-neutral-100 text-neutral-600"
                >
                  <Rows3 size={16} />
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Adjust row height</p>
              </TooltipContent>
            </Tooltip>

            {/* Pin columns */}
            <Tooltip>
              <TooltipTrigger asChild>
                <button 
                  className="p-2 rounded-md transition-colors hover:bg-neutral-100 text-neutral-600"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 2v6m0 0L9 5m3 3l3-3" />
                    <path d="M12 8v14" />
                    <rect x="8" y="14" width="8" height="8" fill="none" />
                  </svg>
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Pin/unpin columns</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {/* Close button */}
          <Tooltip>
            <TooltipTrigger asChild>
              <button 
                onClick={chatOpen ? onCloseArtifact : undefined}
                disabled={!chatOpen}
                className={`p-2 rounded-md transition-colors ${
                  chatOpen 
                    ? 'hover:bg-neutral-100 text-neutral-600' 
                    : 'text-neutral-300 cursor-not-allowed'
                }`}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 6L6 18"/>
                  <path d="M6 6l12 12"/>
                </svg>
              </button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{chatOpen ? "Close" : "Open assistant to close artifact"}</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </div>
    </TooltipProvider>
  );
}
