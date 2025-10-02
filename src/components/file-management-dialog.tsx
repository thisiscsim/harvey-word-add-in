"use client";

import { X, Search, CloudUpload } from "lucide-react";
import { useState } from "react";
import { Drawer } from "vaul";

interface FileManagementDialogProps {
  isOpen: boolean;
  onClose: () => void;
  containerRef?: React.RefObject<HTMLDivElement | null>;
}

export default function FileManagementDialog({ isOpen, onClose, containerRef }: FileManagementDialogProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const options = [
    { id: 'upload', label: 'Upload files', icon: CloudUpload },
    { id: 'imanage', label: 'Add from iManage', icon: '/imanage.svg' },
    { id: 'sharepoint', label: 'Add from Sharepoint', icon: '/sharepoint.svg' },
    { id: 'google-drive', label: 'Add from Google Drive', icon: '/google-drive.svg' },
    { id: 'vault', label: 'Add from Vault', icon: CloudUpload },
  ];

  return (
    <Drawer.Root open={isOpen} onOpenChange={onClose}>
      <Drawer.Portal container={containerRef?.current}>
        <Drawer.Overlay className="absolute inset-0 bg-black/40 z-40" />
        <Drawer.Content className="bg-white flex flex-col rounded-t-[10px] h-auto max-h-[80%] absolute bottom-0 left-0 right-0 z-50">
          {/* Header */}
          <div className="relative flex items-center justify-center px-2 py-4 pb-3 border-b border-neutral-200">
            <Drawer.Title className="text-base font-medium text-neutral-900">
              Add files
            </Drawer.Title>
            <button
              onClick={() => onClose()}
              className="absolute right-2 w-8 h-8 flex items-center justify-center text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-md transition-colors"
            >
              <X size={16} />
            </button>
          </div>

          {/* Search Bar */}
          <div className="px-4 pt-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-neutral-400" />
              <input
                type="text"
                placeholder="Search files and sources"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-neutral-100 rounded-sm text-sm text-neutral-900 placeholder:text-neutral-400 border-0 focus:outline-none focus:ring-2 focus:ring-neutral-300"
                style={{ paddingLeft: '38px', paddingRight: '10px', paddingTop: '6px', paddingBottom: '6px' }}
              />
            </div>
          </div>

          {/* Options List */}
          <div className="px-4 pt-4 pb-4">
            <div className="space-y-0.5">
              {options.map((option) => (
                <button
                  key={option.id}
                  onClick={() => {
                    console.log(`Selected: ${option.label}`);
                    // Handle option selection here
                  }}
                  className="w-full flex items-center gap-3 p-2 text-left hover:bg-neutral-100 rounded-lg transition-colors"
                >
                  {typeof option.icon === 'string' ? (
                    <img src={option.icon} alt={option.label} className="w-5 h-5" />
                  ) : (
                    <option.icon size={20} className="text-neutral-600" />
                  )}
                  <span className="text-sm text-neutral-900">{option.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="px-4 pb-6 pt-2">
            <p className="text-xs text-neutral-500 ml-2">Supported files types: Word, PDF</p>
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}