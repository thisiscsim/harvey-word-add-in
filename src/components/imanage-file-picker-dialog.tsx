"use client";

import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X, Search, FolderOpen, FileText, ChevronRight, Clock, Star } from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  flexRender,
  ColumnDef,
} from "@tanstack/react-table";

interface iManageFile {
  id: string;
  name: string;
  type: 'folder' | 'file';
  modifiedDate: string;
  size?: string;
  path: string;
}

interface iManageFilePickerDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onFilesSelected?: (files: iManageFile[]) => void;
}

// Define columns once, outside of component
const columns: ColumnDef<iManageFile>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <input
        type="checkbox"
        checked={table.getIsAllPageRowsSelected()}
        onChange={(e) => table.toggleAllPageRowsSelected(!!e.target.checked)}
        className="h-4 w-4 text-blue-600 rounded border-neutral-300 focus:ring-blue-500"
      />
    ),
    cell: ({ row }) => (
      <input
        type="checkbox"
        checked={row.getIsSelected()}
        onChange={(e) => row.toggleSelected(!!e.target.checked)}
        disabled={!row.getCanSelect()}
        className="h-4 w-4 text-blue-600 rounded border-neutral-300 focus:ring-blue-500"
      />
    ),
    size: 40,
  },
  {
    accessorKey: 'name',
    header: 'Name',
    cell: ({ row }) => (
      <div className="flex items-center gap-3">
        {row.original.type === 'folder' ? (
          <FolderOpen className="h-5 w-5 text-blue-600 flex-shrink-0" />
        ) : (
          <FileText className="h-5 w-5 text-neutral-400 flex-shrink-0" />
        )}
        <div className="min-w-0">
          <p className="text-sm font-medium text-neutral-900 truncate">{row.original.name}</p>
        </div>
      </div>
    ),
  },
  {
    accessorKey: 'modifiedDate',
    header: 'Modified',
    cell: ({ getValue }) => (
      <span className="text-sm text-neutral-600">{getValue() as string}</span>
    ),
  },
  {
    accessorKey: 'size',
    header: 'Size',
    cell: ({ getValue }) => (
      <span className="text-sm text-neutral-600">{(getValue() as string) || '-'}</span>
    ),
  },
  {
    id: 'actions',
    cell: ({ row }) => (
      row.original.type === 'folder' ? (
        <ChevronRight className="h-4 w-4 text-neutral-400" />
      ) : null
    ),
    size: 40,
  },
];

// Mock data - define once
const mockFiles: iManageFile[] = [
  { id: '1', name: 'Acme Corporation', type: 'folder', modifiedDate: '2024-01-15', path: 'My Matters/Acme Corporation' },
  { id: '2', name: 'GlobalTech Inc', type: 'folder', modifiedDate: '2024-01-10', path: 'My Matters/GlobalTech Inc' },
  { id: '3', name: 'Contract_Draft_v3.docx', type: 'file', modifiedDate: '2024-01-14', size: '2.3 MB', path: 'My Matters/Acme Corporation/Contracts' },
  { id: '4', name: 'Due_Diligence_Report.pdf', type: 'file', modifiedDate: '2024-01-12', size: '5.1 MB', path: 'My Matters/GlobalTech Inc/Due Diligence' },
  { id: '5', name: 'Meeting_Notes_Jan.docx', type: 'file', modifiedDate: '2024-01-08', size: '345 KB', path: 'My Matters/Acme Corporation/Notes' },
];

export default function IManageFilePickerDialog({ 
  isOpen, 
  onClose, 
  onFilesSelected 
}: iManageFilePickerDialogProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [rowSelection, setRowSelection] = useState({});
  const [activeTab, setActiveTab] = useState<'browse' | 'recent' | 'favorites'>('browse');
  const [isLoading, setIsLoading] = useState(true);
  const [showProgressBar, setShowProgressBar] = useState(false);
  const [showIManage, setShowIManage] = useState(false);

  // Reset state when dialog opens
  useEffect(() => {
    if (isOpen) {
      setIsLoading(true);
      setShowProgressBar(false);
      setShowIManage(false);
      setRowSelection({});
      setSearchQuery("");
    }
  }, [isOpen]);

  // Layout constants
  const HARVEY_SIZE = 40;
  const IMANAGE_SIZE = 40;
  const PROGRESS_BAR_WIDTH = 64;
  const GAP_PX = 8;
  const LEFT_OFFSET = PROGRESS_BAR_WIDTH / 2 + GAP_PX + HARVEY_SIZE / 2;
  const RIGHT_OFFSET = PROGRESS_BAR_WIDTH / 2 + GAP_PX + IMANAGE_SIZE / 2;
  const PROGRESS_SEGMENT_MIN = 16;
  const PROGRESS_SEGMENT_MAX = 32;
  const PROGRESS_TRAVEL = PROGRESS_BAR_WIDTH - PROGRESS_SEGMENT_MIN;

  useEffect(() => {
    if (!showIManage) return;

    const progressBarTimeout = setTimeout(() => setShowProgressBar(true), 150);
    const closeTimeout = setTimeout(() => setIsLoading(false), 2600);

    return () => {
      clearTimeout(progressBarTimeout);
      clearTimeout(closeTimeout);
    };
  }, [showIManage]);

  const table = useReactTable({
    data: mockFiles,
    columns,
    state: {
      rowSelection,
      globalFilter: searchQuery,
    },
    enableRowSelection: (row) => row.original.type !== 'folder',
    onRowSelectionChange: setRowSelection,
    onGlobalFilterChange: setSearchQuery,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  const handleAdd = () => {
    const selectedRows = table.getSelectedRowModel().rows;
    const files = selectedRows.map(row => row.original);
    onFilesSelected?.(files);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[800px] max-w-[800px] h-[600px] p-0 gap-0 overflow-hidden flex flex-col">
        {/* Loading Splash Screen */}
        <AnimatePresence>
          {isLoading && (
            <motion.div 
              className="absolute inset-0 bg-white z-50 flex items-center justify-center"
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="relative w-full h-full flex items-center justify-center">
                <motion.div 
                  className="absolute z-20"
                  initial={{ scale: 0, x: 0 }}
                  animate={{ 
                    scale: [0, 1.2, 1],
                    x: -LEFT_OFFSET
                  }}
                  transition={{ 
                    scale: { duration: 0.6, ease: "easeOut", times: [0, 0.6, 1] },
                    x: { delay: 0.4, duration: 0.5, ease: [0.4, 0, 0.2, 1] }
                  }}
                  onUpdate={(latest: { x?: number }) => {
                    const xVal = latest.x;
                    if (!showIManage && typeof xVal === 'number' && xVal <= -LEFT_OFFSET + 0.5) {
                      setShowIManage(true);
                    }
                  }}
                >
                  <Image 
                    src="/Harvey_Glyph_Circle.svg" 
                    alt="Harvey" 
                    width={HARVEY_SIZE} 
                    height={HARVEY_SIZE}
                  />
                </motion.div>
                
                <AnimatePresence>
                  {showIManage && (
                    <motion.div 
                      className="absolute z-10"
                      initial={{ scale: 0, opacity: 0, x: RIGHT_OFFSET }}
                      animate={{ scale: [0, 1.1, 1], opacity: 1, x: RIGHT_OFFSET }}
                      transition={{ duration: 0.3, ease: "easeOut" }}
                    >
                      <Image 
                        src="/imanage_circle_blue.svg" 
                        alt="iManage" 
                        width={IMANAGE_SIZE} 
                        height={IMANAGE_SIZE}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
                
                <AnimatePresence>
                  {showProgressBar && (
                    <motion.div 
                      className="absolute z-0"
                      initial={{ opacity: 0, y: 12, scale: 0.9 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ type: "spring", stiffness: 360, damping: 26 }}
                      style={{ willChange: "transform, opacity" }}
                    >
                      <div className="w-[64px] h-1 bg-neutral-200 rounded-full overflow-hidden relative">
                        <motion.div
                          className="absolute left-0 top-0 h-full bg-black rounded-full"
                          initial={{ x: 0, width: PROGRESS_SEGMENT_MIN }}
                          animate={{ 
                            x: [0, PROGRESS_TRAVEL],
                            width: [PROGRESS_SEGMENT_MIN, PROGRESS_SEGMENT_MAX, PROGRESS_SEGMENT_MIN]
                          }}
                          transition={{ 
                            x: { duration: 0.42, ease: "easeInOut", repeat: Infinity, repeatType: "reverse", delay: 0.06 },
                            width: { duration: 0.42, ease: "easeInOut", times: [0, 0.5, 1], repeat: Infinity, repeatType: "reverse", delay: 0.06 }
                          }}
                        />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
                
                <motion.div 
                  className="absolute bottom-16 left-0 right-0 text-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.9, duration: 0.3 }}
                >
                  <p className="text-sm text-neutral-500">Connecting to iManage...</p>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Header */}
        <div className="flex items-center justify-between px-2 py-2 border-b border-neutral-200">
          <div className="flex items-center gap-2">
            <div className="h-[38px] w-[38px] rounded-md bg-neutral-100 flex items-center justify-center">
              <Image src="/imanage.svg" alt="iManage" width={24} height={24} />
            </div>
            <span className="text-md font-medium text-neutral-900">Select files from iManage</span>
          </div>
          <button
            onClick={onClose}
            className="h-8 w-8 flex items-center justify-center rounded hover:bg-neutral-100 transition-colors text-neutral-500 hover:text-neutral-700 self-start"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </button>
        </div>

        {/* Search Bar */}
        <div className="px-4 py-3 border-b border-neutral-200">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <Input
              type="text"
              placeholder="Search files and folders..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-3 border-neutral-200 focus:ring-1 focus:ring-neutral-300 font-normal text-neutral-900 placeholder:text-neutral-500"
              style={{ height: '36px', fontSize: '14px' }}
            />
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-neutral-200">
          <button
            onClick={() => setActiveTab('browse')}
            className={cn(
              "px-4 py-2 text-sm font-medium border-b-2 transition-colors",
              activeTab === 'browse' 
                ? "text-neutral-900 border-neutral-900" 
                : "text-neutral-500 border-transparent hover:text-neutral-700"
            )}
          >
            Browse
          </button>
          <button
            onClick={() => setActiveTab('recent')}
            className={cn(
              "px-4 py-2 text-sm font-medium border-b-2 transition-colors",
              activeTab === 'recent' 
                ? "text-neutral-900 border-neutral-900" 
                : "text-neutral-500 border-transparent hover:text-neutral-700"
            )}
          >
            <div className="flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5" />
              Recent
            </div>
          </button>
          <button
            onClick={() => setActiveTab('favorites')}
            className={cn(
              "px-4 py-2 text-sm font-medium border-b-2 transition-colors",
              activeTab === 'favorites' 
                ? "text-neutral-900 border-neutral-900" 
                : "text-neutral-500 border-transparent hover:text-neutral-700"
            )}
          >
            <div className="flex items-center gap-1.5">
              <Star className="h-3.5 w-3.5" />
              Favorites
            </div>
          </button>
        </div>

        {/* File Table */}
        <div className="flex-1 overflow-auto">
          {!isLoading && (
            <table className="w-full">
              <thead className="sticky top-0 bg-neutral-50 border-b border-neutral-200">
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <th
                        key={header.id}
                        className="px-4 py-3 text-left text-xs font-medium text-neutral-600 uppercase tracking-wider"
                        style={{ width: header.getSize() }}
                      >
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody className="bg-white divide-y divide-neutral-200">
                {table.getRowModel().rows.length === 0 ? (
                  <tr>
                    <td colSpan={columns.length} className="text-center py-12">
                      <p className="text-sm text-neutral-500">No files found</p>
                    </td>
                  </tr>
                ) : (
                  table.getRowModel().rows.map((row) => (
                    <tr
                      key={row.id}
                      className={cn(
                        "hover:bg-neutral-50 transition-colors",
                        row.getIsSelected() && "bg-blue-50 hover:bg-blue-100",
                        row.original.type !== 'folder' && "cursor-pointer"
                      )}
                      onClick={() => {
                        if (row.original.type !== 'folder') {
                          row.toggleSelected();
                        }
                      }}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <td
                          key={cell.id}
                          className="px-4 py-3 text-sm text-neutral-900"
                          style={{ width: cell.column.getSize() }}
                          onClick={(e) => {
                            // Prevent row click when clicking checkbox
                            if ((e.target as HTMLElement).tagName === 'INPUT') {
                              e.stopPropagation();
                            }
                          }}
                        >
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </td>
                      ))}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>

        {/* Footer */}
        {!isLoading && (
          <div className="flex items-center justify-between px-3 py-3 border-t border-neutral-200">
            <p className="text-sm text-neutral-600">
              {table.getSelectedRowModel().rows.length} {table.getSelectedRowModel().rows.length === 1 ? 'file' : 'files'} selected
            </p>
            <div className="flex gap-2">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button 
                onClick={handleAdd} 
                disabled={table.getSelectedRowModel().rows.length === 0}
              >
                Add selected files
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
