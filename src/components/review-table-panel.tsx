"use client";

import { motion } from "framer-motion";
import { UserPlus, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import ReviewTableToolbar from "@/components/review-table-toolbar";
import ShareArtifactDialog from "@/components/share-artifact-dialog";
import ExportReviewDialog from "@/components/export-review-dialog";
import ReviewTable from "@/components/review-table";

interface ReviewTablePanelProps {
  selectedArtifact: { title: string; subtitle: string } | null;
  isEditingArtifactTitle: boolean;
  editedArtifactTitle: string;
  onEditedArtifactTitleChange: (value: string) => void;
  onStartEditingTitle: () => void;
  onSaveTitle: () => void;
  onClose: () => void;
  chatOpen: boolean;
  onToggleChat: (open: boolean) => void;
  shareArtifactDialogOpen: boolean;
  onShareArtifactDialogOpenChange: (open: boolean) => void;
  exportReviewDialogOpen: boolean;
  onExportReviewDialogOpenChange: (open: boolean) => void;
  artifactTitleInputRef: React.RefObject<HTMLInputElement | null>;
  sourcesDrawerOpen?: boolean;
  onSourcesDrawerOpenChange?: (open: boolean) => void;
}

const PANEL_ANIMATION = {
  duration: 0.8,
  ease: [0.4, 0.0, 0.2, 1] as const // Custom cubic-bezier for smooth acceleration
};

export default function ReviewTablePanel({
  selectedArtifact,
  isEditingArtifactTitle,
  editedArtifactTitle,
  onEditedArtifactTitleChange,
  onStartEditingTitle,
  onSaveTitle,
  onClose,
  chatOpen,
  onToggleChat,
  shareArtifactDialogOpen,
  onShareArtifactDialogOpenChange,
  exportReviewDialogOpen,
  onExportReviewDialogOpenChange,
  artifactTitleInputRef,
  sourcesDrawerOpen,
  onSourcesDrawerOpenChange
}: ReviewTablePanelProps) {
  // Placeholder for tanstack table state and logic
  return (
    <>
      <motion.div 
        initial={{ width: 0, opacity: 0 }}
        animate={{ width: '100%', opacity: 1 }}
        exit={{ width: 0, opacity: 0 }}
        transition={{
          width: PANEL_ANIMATION,
          opacity: { duration: 0.5, ease: [0.4, 0.0, 0.2, 1] }
        }}
        className="flex-1 flex flex-col bg-neutral-50 overflow-hidden"
      >
        {/* Header */}
        <div className="px-3 py-4 border-b border-neutral-200 bg-neutral-0 flex items-center justify-between" style={{ height: '52px' }}>
          <div className="flex items-center">
            {/* Editable Artifact Title */}
            {isEditingArtifactTitle ? (
              <input
                ref={artifactTitleInputRef}
                type="text"
                value={editedArtifactTitle}
                onChange={(e) => onEditedArtifactTitleChange(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    onSaveTitle();
                  }
                }}
                onFocus={(e) => {
                  // Move cursor to start and scroll to beginning
                  setTimeout(() => {
                    e.target.setSelectionRange(0, 0);
                    e.target.scrollLeft = 0;
                  }, 0);
                }}
                className="text-neutral-900 font-medium bg-neutral-100 border border-neutral-400 outline-none px-2 py-1.5 -ml-1 rounded-md text-sm"
                style={{ 
                  width: `${Math.min(Math.max(editedArtifactTitle.length * 8 + 40, 120), 600)}px`,
                  height: '32px'
                }}
                autoFocus
              />
            ) : (
              <button
                onClick={onStartEditingTitle}
                className="text-neutral-900 font-medium px-2 py-1.5 -ml-1 rounded-md hover:bg-neutral-100 transition-colors cursor-pointer text-sm"
                style={{ height: '32px' }}
              >
                {selectedArtifact?.title || 'Review Table'}
              </button>
            )}
          </div>
          
          <div className="flex gap-2 items-center">
            {/* Sources Button */}
            <Button 
              variant="secondary"
              onClick={() => onSourcesDrawerOpenChange?.(!sourcesDrawerOpen)}
              className={cn("gap-2", sourcesDrawerOpen && "bg-neutral-100")}
              style={{ height: '32px' }}
            >
              {sourcesDrawerOpen ? (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" clipRule="evenodd" d="M7 2C5.34315 2 4 3.34315 4 5V19C4 20.6569 5.34315 22 7 22H19C19.5523 22 20 21.5523 20 21V3C20 2.44772 19.5523 2 19 2H7ZM6 19C6 19.5523 6.44772 20 7 20H18V18H7C6.44772 18 6 18.4477 6 19Z" fill="currentColor"/>
                </svg>
              ) : (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 19C4 20.6569 5.34315 22 7 22H19C19.5523 22 20 21.5523 20 21V3C20 2.44772 19.5523 2 19 2H7C5.34315 2 4 3.34315 4 5V19Z" />
                  <path d="M20 17H7C5.89543 17 5 17.8954 5 19" />
                </svg>
              )}
              <span>Sources</span>
            </Button>
            {/* Share Button */}
            <button 
              onClick={() => onShareArtifactDialogOpenChange(true)}
              className="flex items-center gap-2 px-3 py-1.5 border border-neutral-200 rounded-md bg-white hover:bg-neutral-100 transition-colors text-neutral-900 text-sm font-normal" 
              style={{ height: '32px' }}
            >
              <UserPlus size={16} className="text-neutral-900" />
              <span className="text-sm font-normal">Share</span>
            </button>
            {/* Export Button */}
            <button 
              className="flex items-center gap-2 px-3 py-1.5 border border-neutral-200 rounded-md bg-white hover:bg-neutral-100 transition-colors text-neutral-900 text-sm font-normal" 
              style={{ height: '32px' }}
              onClick={() => onExportReviewDialogOpenChange(true)}
            >
              <Download size={16} className="text-neutral-900" />
              <span className="text-sm font-normal">Export</span>
            </button>
          </div>
        </div>

        {/* Toolbar */}
        <ReviewTableToolbar
          chatOpen={chatOpen}
          onToggleChat={() => {
            console.log('Toggle button clicked, current state:', chatOpen);
            onToggleChat(!chatOpen);
          }}
          onCloseArtifact={onClose}
        />
        
        {/* Content Area - Review Table */}
        <div className="flex-1 overflow-y-auto bg-neutral-0">
          <ReviewTable 
            selectedCompanies={[
              { id: 'crowdstrike', name: 'Crowdstrike' },
              { id: 'okta', name: 'Okta' },
              { id: 'sentinelone', name: 'Sentinel One' },
              { id: 'snowflake', name: 'Snowflake' },
              { id: 'cloudflare', name: 'Cloudflare' }
            ]}
          />
        </div>
      </motion.div>

      {/* Dialogs */}
      <ShareArtifactDialog
        isOpen={shareArtifactDialogOpen}
        onClose={() => onShareArtifactDialogOpenChange(false)}
        artifactTitle={selectedArtifact?.title || 'Review Table'}
      />
      <ExportReviewDialog
        isOpen={exportReviewDialogOpen}
        onClose={() => onExportReviewDialogOpenChange(false)}
        artifactTitle={selectedArtifact?.title || 'Review Table'}
      />
    </>
  );
}
