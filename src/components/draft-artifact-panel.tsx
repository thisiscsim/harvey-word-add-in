"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef, useCallback, useEffect } from "react";
import { 
  Plus, 
  ListPlus, 
  Settings2, 
  Wand, 
  Orbit,
  X,
  Clock,
  Briefcase,
  ArrowLeft
} from "lucide-react";
import Image from "next/image";
import { Spinner } from "@/components/ui/spinner";
import DraftDocumentToolbar from "@/components/draft-document-toolbar";
import ThinkingState from "@/components/thinking-state";
import ArtifactCard from "@/components/artifact-card";
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Highlight from '@tiptap/extension-highlight';
import Link from '@tiptap/extension-link';
import TextAlign from '@tiptap/extension-text-align';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  type: 'text' | 'artifact';
  thinkingContent?: { summary: string; bullets: string[]; additionalText?: string };
  loadingState?: { showSummary: boolean; visibleBullets: number; showAdditionalText: boolean };
  isLoading?: boolean;
  artifactData?: {
    title: string;
    subtitle: string;
    variant: 'draft' | 'table';
  };
}

interface DraftArtifactPanelProps {
  selectedArtifact: { title: string; subtitle: string } | null;
  chatOpen: boolean;
  onToggleChat: (open: boolean) => void;
  // Chat props
  messages: Message[];
  inputValue: string;
  onInputValueChange: (value: string) => void;
  isLoading: boolean;
  onSendMessage: (messageOverride?: string) => void;
  onBackToHome: () => void;
  chatWidth: number;
  onChatWidthChange: (width: number) => void;
  isResizing: boolean;
  onResizingChange: (resizing: boolean) => void;
  onShareThreadDialogOpenChange: (open: boolean) => void;
  onFileManagementOpenChange: (open: boolean) => void;
  isDeepResearchActive: boolean;
  onDeepResearchActiveChange: (active: boolean) => void;
  scrollToBottom: () => void;
  messagesEndRef: React.RefObject<HTMLDivElement | null>;
  chatContainerRef: React.RefObject<HTMLDivElement | null>;
}

const PANEL_ANIMATION = {
  duration: 0.8,
  ease: [0.4, 0.0, 0.2, 1] as const // Custom cubic-bezier for smooth acceleration
};

export default function DraftArtifactPanel({
  selectedArtifact,
  chatOpen,
  onToggleChat,
  messages,
  inputValue,
  onInputValueChange,
  isLoading,
  onSendMessage,
  onBackToHome,
  chatWidth,
  onChatWidthChange,
  isResizing,
  onResizingChange,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onShareThreadDialogOpenChange,
  onFileManagementOpenChange,
  isDeepResearchActive,
  onDeepResearchActiveChange,
  scrollToBottom,
  messagesEndRef,
  chatContainerRef
}: DraftArtifactPanelProps) {
  // State to force re-renders on selection change
  const [, forceUpdate] = useState({});
  const [isHoveringResizer, setIsHoveringResizer] = useState(false);
  const [autoApplySuggestions, setAutoApplySuggestions] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Generate conversation title from first user message
  const getConversationTitle = () => {
    const firstUserMessage = messages.find(m => m.role === 'user');
    if (!firstUserMessage) return 'New Conversation';
    
    const maxLength = 50;
    const content = firstUserMessage.content;
    
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + '...';
  };

  // Handle mouse move for resizing
  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isResizing || !containerRef.current) return;
    
    const containerRect = containerRef.current.getBoundingClientRect();
    // Calculate chat width from the mouse position
    let newChatWidth = containerRect.right - e.clientX;
    
    // Enforce min/max constraints
    const MIN_CHAT_WIDTH = 400;
    const MAX_CHAT_WIDTH = 800;
    newChatWidth = Math.max(MIN_CHAT_WIDTH, Math.min(newChatWidth, MAX_CHAT_WIDTH));
    onChatWidthChange(newChatWidth);
  }, [isResizing, onChatWidthChange]);

  const handleMouseUp = useCallback(() => {
    onResizingChange(false);
  }, [onResizingChange]);

  // Mouse event listeners
  useEffect(() => {
    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isResizing, handleMouseMove, handleMouseUp]);

  // Determine content based on artifact type
  const getInitialContent = () => {
    if (selectedArtifact?.title?.toLowerCase().includes('risk factors')) {
      return `
      <h1>RISK FACTORS</h1>
      <p>An investment in our common stock involves a high degree of risk. You should carefully consider the risks and uncertainties described below, together with all of the other information in this prospectus, including our consolidated financial statements and related notes, before making an investment decision. If any of the following risks actually occurs, our business, financial condition, results of operations and prospects could be materially and adversely affected. In that event, the market price of our common stock could decline and you could lose part or all of your investment.</p>
      
      <h2>Risks Related to Our Business and Industry</h2>
      
      <h3>We have a history of losses, and we may not achieve or maintain profitability in the future.</h3>
      <p>We have incurred significant net losses in each period since inception. We incurred net losses of $XX million, $XX million and $XX million for the years ended December 31, 2021, 2022 and 2023, respectively. As of September 30, 2024, we had an accumulated deficit of $XX million. These losses and accumulated deficit reflect the substantial investments we made to develop our products and services, build our engineering and sales teams, and establish our market presence.</p>
      
      <h3>Our limited operating history makes it difficult to evaluate our current business and future prospects.</h3>
      <p>We were incorporated in 2018 and launched our first commercial product in 2020. Our limited operating history makes it difficult to evaluate our current business and future prospects. We have encountered and will continue to encounter risks and difficulties frequently experienced by growing companies in rapidly changing industries.</p>
      
      <h3>We operate in a highly competitive market and face competition from established competitors and new market entrants.</h3>
      <p>The market for AI-powered solutions is intensely competitive and characterized by rapid technological change. We compete with large technology companies such as Google, Microsoft, and Amazon, as well as numerous startups and emerging companies. Many of our competitors have greater financial, technical, and other resources than we do.</p>
      
      <h2>Risks Related to Our Financial Condition and Capital Requirements</h2>
      
      <h3>We will require additional capital to support business growth, and this capital might not be available on acceptable terms.</h3>
      <p>We expect our expenses to increase substantially in connection with our ongoing activities, particularly as we continue to expand our operations, develop new products, and operate as a public company. Our future capital requirements will depend on many factors.</p>
      `;
    }
    
    // Default content - Master Motor Vehicle Operating Lease Agreement
    return `
      <h3 style="text-align: center;">Master Motor Vehicle Operating Lease Agreement</h3>
      <p>This Master Motor Vehicle Operating Lease Agreement (this "Agreement"), dated as of October 15, 2024, is made by and among PREMIER FLEET FUNDING, LLC ("PFF"), a Delaware limited liability company (the "Lessor"), CITYWIDE DELIVERY SERVICES, LLC, a California limited liability company ("CDS"), as lessee (the "Lessee") and as administrator (the "Administrator"), and AMERICAN VEHICLE GUARANTEE CORP., a Delaware limited liability company ("AVGC"), as guarantor (the "Guarantor").</p>
      
      <h3>Witnesseth:</h3>
      <p>WHEREAS, the Lessor intends to purchase vehicles (the "Vehicles") that are manufactured by Eligible Vehicle Manufacturers with the proceeds obtained by the issuance of the Series 2024-A Notes pursuant to the Base Indenture (referred to below) and the Series 2024-A Supplement thereto and any additional Series of Notes issued from time to time under the Base Indenture and related Series Supplements thereto.</p>
      <p>WHEREAS, the Lessor desires to lease to the Lessee and the Lessee desires to lease from the Lessor the PFF Vehicles set forth on Attachments A hereto for use in the daily rental business of the Lessee; and</p>
      <p>WHEREAS, the Guarantor has, pursuant to Section 22 hereof, guaranteed the obligations of the Lessee under this Agreement;</p>
      <p>NOW, THEREFORE, in consideration of the foregoing premises, and other good and valuable consideration, the receipt and sufficiency of which are hereby acknowledged, the parties hereby agree as follows:</p>
      
      <h4>1. Definitions</h4>
      <p>Unless otherwise specified herein, capitalized terms used herein (including the preamble and recitals hereto) shall have the meanings ascribed to such terms in the Definitions List attached as Annex I to the Base Indenture, dated as of October 15, 2024 (the "Base Indenture"), between the Lessor, as issuer, and The Bank of New York Trust Company, N.A., as Trustee, as such Definitions List may from time to time be amended in accordance with the Base Indenture.</p>
      
      <h4>2. General Agreement</h4>
      <p>(a) The Lessee and the Lessor intend that this Agreement is an operating lease and that the relationship between the Lessor and the Lessee pursuant hereto shall always be only that of lessor and lessee, and the Lessee hereby declares, acknowledges and agrees that the Lessor is the owner of, and the Lessor holds legal title to, the PFF Vehicles. The Lessee shall not acquire by virtue of this Agreement any right, equity, title or interest in or to any PFF Vehicles, except the right to use the same under the terms hereof.</p>
      <p>The parties agree that this Agreement is a "true lease" and agree to treat this Agreement as a lease for all purposes, including tax, accounting and otherwise and each party hereto will take no position on its tax returns and filings contrary to the position that the Lessor is the owner of the PFF Vehicles for federal and state income tax purposes.</p>
      <p>(b) If, notwithstanding the intent of the parties to this Agreement, this Agreement is characterized by any third party as a financing arrangement or as otherwise not constituting a "true lease," then it is the intention of the parties that this Agreement shall constitute a security agreement under applicable law, and, to secure all of its obligations hereunder, the Lessee hereby grants to the Lessor a first priority security interest in and to all of the Lessee's right, title and interest in and to the PFF Vehicles and all proceeds thereof.</p>
    `;
  };

  // Initialize Tiptap editor
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3, 4, 5, 6],
        },
      }),
      Underline,
      Highlight.configure({
        multicolor: true,
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-blue-600 underline',
        },
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
    ],
    content: getInitialContent(),
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: 'focus:outline-none min-h-full text-neutral-900',
        'data-placeholder': 'Start writing your document...',
      },
    },
    onUpdate: () => {
      // Force re-render to update toolbar button states
      forceUpdate({});
    },
    onSelectionUpdate: () => {
      // Force re-render when selection changes to update active states
      forceUpdate({});
    },
  });


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
        <div className="px-3 py-4 border-b border-neutral-200" style={{ 
          height: '52px',
          background: 'linear-gradient(to right, #3A63A1, #2D589B)'
        }}>
        </div>

        {/* Toolbar */}
        <DraftDocumentToolbar
          editor={editor}
          onToggleChat={() => onToggleChat(!chatOpen)}
        />
        
        {/* Content Area with Editor and Chat Side by Side */}
        <div ref={containerRef} className="flex-1 flex overflow-hidden">
          {/* Editor Section */}
          <div 
            className="flex-1 overflow-y-auto cursor-text"
            style={{ backgroundColor: '#ECECEC' }}
            onClick={(e) => {
              // Focus the editor when clicking anywhere in the content area
              // Only if the click target is the container itself or its direct children
              const target = e.target as HTMLElement;
              if (editor && !editor.isFocused && !target.closest('.ProseMirror')) {
                editor.chain().focus('end').run();
              }
            }}
          >
            <div className="min-h-full flex justify-center">
              <div className="w-full max-w-[846px] min-h-full bg-white my-8 px-24 py-24">
                <EditorContent editor={editor} />
              </div>
            </div>
          </div>

          {/* Resizable Separator */}
          {chatOpen && (
            <div 
              className="relative group"
              onMouseEnter={() => !isResizing && setIsHoveringResizer(true)}
              onMouseLeave={() => !isResizing && setIsHoveringResizer(false)}
              onMouseDown={(e) => {
                e.preventDefault();
                onResizingChange(true);
              }}
              style={{
                width: (isHoveringResizer || isResizing) ? '2px' : '1px',
                backgroundColor: (isHoveringResizer || isResizing) ? '#d4d4d4' : '#e5e5e5',
                cursor: 'col-resize',
                transition: isResizing ? 'none' : 'all 0.15s ease',
                flexShrink: 0,
              }}
            >
              {/* Invisible wider hit area for easier grabbing */}
              <div 
                className="absolute inset-y-0"
                style={{
                  left: '-4px',
                  right: '-4px',
                  cursor: 'col-resize',
                }}
              />
            </div>
          )}

          {/* Chat Panel */}
          {chatOpen && (
            <AnimatePresence mode="wait">
              <motion.div 
                key="chat-panel"
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: chatWidth, opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                transition={{
                  width: { duration: 0.3, ease: "easeOut" },
                  opacity: { duration: 0.15, ease: "easeOut" }
                }}
                className="flex relative overflow-hidden bg-white"
                style={{ 
                  flexShrink: 0,
                  width: chatWidth
                }}
              >
                <div className="flex flex-col bg-white relative w-full">
                  {/* Harvey for Word Header - Always visible */}
                  <div className="px-4 border-b border-neutral-200 flex items-center justify-between" style={{ height: '40px', backgroundColor: '#F2F1F0' }}>
                    <div className="flex items-center">
                      <h2 className="text-sm font-medium text-neutral-900">Harvey for Word</h2>
                    </div>
                    <button
                      onClick={() => onToggleChat(false)}
                      className="p-0.5 text-white hover:opacity-80 rounded-full transition-opacity"
                      style={{ backgroundColor: '#ADAAA5' }}
                    >
                      <X size={16} />
                    </button>
                  </div>

                  {/* Conditional Second Header - Home vs Messages */}
                  {messages.length === 0 ? (
                    /* Home Screen Header */
                    <div className="px-4 border-b border-neutral-200 flex items-center justify-between" style={{ height: '48px', backgroundColor: '#F2F1F0' }}>
                      <button
                        className="p-2 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-200/50 rounded-md transition-colors"
                      >
                        <Clock size={18} />
                      </button>
                      <button
                        className="flex items-center gap-2 px-3 py-1.5 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-200/50 rounded-md transition-colors"
                      >
                        <Briefcase size={16} />
                        <span className="text-sm font-normal">Client matter</span>
                      </button>
                      <button
                        className="p-2 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-200/50 rounded-md transition-colors"
                      >
                        <Settings2 size={18} />
                      </button>
                    </div>
                  ) : (
                    /* Chat Header - Messages View */
                    <div className="px-4 py-3 border-b border-neutral-200 flex items-center justify-between gap-3" style={{ height: '52px' }}>
                      <button
                        onClick={onBackToHome}
                        className="p-1.5 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-md transition-colors flex-shrink-0"
                      >
                        <ArrowLeft size={20} />
                      </button>
                      <h2 className="text-sm font-medium text-neutral-900 truncate flex-1 text-center px-2">
                        {getConversationTitle()}
                      </h2>
                      <button
                        className="p-1.5 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-md transition-colors flex-shrink-0"
                      >
                        <Plus size={20} />
                      </button>
                    </div>
                  )}

                  {/* Content Area - Home Screen or Messages */}
                  <div className="flex-1 relative overflow-hidden">
                    {messages.length === 0 ? (
                      /* Home Screen - Harvey Logo */
                      <div className="h-full flex items-center justify-center">
                        <Image 
                          src="/Harvey_Logo.svg" 
                          alt="Harvey" 
                          width={106} 
                          height={32}
                          style={{ 
                            height: '32px', 
                            width: 'auto',
                            opacity: 0.15
                          }}
                        />
                      </div>
                    ) : (
                      /* Messages View */
                      <>
                        {/* Top gradient */}
                        <div className="absolute top-0 left-0 right-0 h-6 bg-gradient-to-b from-white to-transparent pointer-events-none z-10" />
                        
                        {/* Scrollable messages */}
                        <div 
                          ref={chatContainerRef}
                          className="h-full overflow-y-auto px-6 py-6"
                        >
                          <div className="mx-auto" style={{ maxWidth: '740px' }}>
                          {messages.map((message, index) => (
                      <div key={index} className={`flex items-start space-x-1 ${index !== messages.length - 1 ? 'mb-6' : ''}`}>
                        {/* Avatar/Icon */}
                        <div className="flex-shrink-0">
                          {message.role === 'user' ? (
                            <div className="w-6 h-6 bg-white border border-neutral-200 rounded-full flex items-center justify-center">
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-neutral-600">
                                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                                <circle cx="12" cy="7" r="4"/>
                              </svg>
                            </div>
                          ) : (
                            <div className="w-6 h-6 flex items-center justify-center">
                              <Image src="/harvey-avatar.svg" alt="Harvey" width={24} height={24} className="w-6 h-6" />
                            </div>
                          )}
                        </div>
                        
                        {/* Message Content */}
                        <div className="flex-1 min-w-0 pt-0.5">
                          {message.role === 'user' && (
                            <AnimatePresence>
                              <motion.div
                                key="user-message"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4, ease: "easeOut" }}
                              >
                                <div className="text-sm text-neutral-900 leading-relaxed pl-2">
                                  {message.content}
                                </div>
                              </motion.div>
                            </AnimatePresence>
                          )}
                          
                          {message.role === 'assistant' && (
                            <>
                              {/* Show thinking states */}
                              {message.isLoading && message.thinkingContent && message.loadingState ? (
                                <ThinkingState
                                  variant="draft"
                                  title="Thinking..."
                                  durationSeconds={undefined}
                                  summary={message.loadingState.showSummary ? message.thinkingContent.summary : undefined}
                                  bullets={message.thinkingContent.bullets?.slice(0, message.loadingState.visibleBullets)}
                                  additionalText={message.loadingState.showAdditionalText ? message.thinkingContent.additionalText : undefined}
                                  isLoading={true}
                                />
                              ) : message.thinkingContent ? (
                                <ThinkingState
                                  variant="draft"
                                  title="Thought"
                                  durationSeconds={6}
                                  summary={message.thinkingContent.summary}
                                  bullets={message.thinkingContent.bullets}
                                  additionalText={message.thinkingContent.additionalText}
                                  defaultOpen={false}
                                />
                              ) : null}
                              
                              {/* Show content only if not loading */}
                              {!message.isLoading && message.content && (
                                <AnimatePresence>
                                  <motion.div
                                    key="message-content"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.4, ease: "easeOut" }}
                                  >
                                    {message.type === 'artifact' ? (
                                      <div className="space-y-3">
                                        <div className="text-sm text-neutral-900 leading-relaxed pl-2">
                                          {message.content}
                                        </div>
                                        <div className="pl-2">
                                          <ArtifactCard
                                            title={message.artifactData?.title || 'Artifact'}
                                            subtitle={message.artifactData?.subtitle || ''}
                                            variant="small"
                                            isSelected={selectedArtifact?.title === message.artifactData?.title}
                                            showSources={true}
                                            onClick={() => {
                                              // Artifact already open, just scroll
                                              scrollToBottom();
                                            }}
                                          />
                                        </div>
                                      </div>
                                    ) : (
                                      <div className="text-sm text-neutral-900 leading-relaxed pl-2">
                                        {message.content}
                                      </div>
                                    )}
                                  </motion.div>
                                </AnimatePresence>
                              )}
                            </>
                          )}
                        </div>
                      </div>
                          ))}
                          <div ref={messagesEndRef} />
                          </div>
                        </div>
                        
                        {/* Bottom gradient */}
                        <div className="absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-t from-white to-transparent pointer-events-none z-10" />
                      </>
                    )}
                  </div>

                  {/* Suggestion Cards - Only shown when no messages */}
                  {messages.length === 0 && (
                    <div className="px-6 pb-4 overflow-x-hidden bg-white">
                      <div className="mx-auto space-y-3" style={{ maxWidth: '832px' }}>
                        <button 
                          onClick={() => onSendMessage("Run playbooks to review this contract")}
                          className="w-full text-left px-4 py-3 bg-white border border-neutral-200 rounded-lg hover:border-neutral-300 hover:bg-neutral-50 transition-colors"
                        >
                          <div className="font-medium text-sm text-neutral-900">Run playbooks</div>
                          <div className="text-xs text-neutral-500 mt-0.5">Review contracts with standard playbooks</div>
                        </button>
                        <button 
                          onClick={() => onSendMessage("Translate this document")}
                          className="w-full text-left px-4 py-3 bg-white border border-neutral-200 rounded-lg hover:border-neutral-300 hover:bg-neutral-50 transition-colors"
                        >
                          <div className="font-medium text-sm text-neutral-900">Translate</div>
                          <div className="text-xs text-neutral-500 mt-0.5">Translate document into a different language</div>
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Input Area */}
                  <div className="px-6 pb-6 overflow-x-hidden relative z-20 bg-white">
                    <div className="mx-auto" style={{ maxWidth: '832px' }}>
                      <div className="pl-2.5 pr-2.5 pt-4 pb-3 transition-all duration-200 border border-transparent focus-within:border-neutral-300 bg-neutral-100 flex flex-col" style={{ borderRadius: '12px', minHeight: '130px' }}>
                      <textarea
                        value={inputValue}
                        onChange={(e) => {
                          onInputValueChange(e.target.value);
                          e.target.style.height = 'auto';
                          e.target.style.height = e.target.scrollHeight + 'px';
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            onSendMessage();
                          }
                        }}
                        placeholder="Ask Harvey anything..."
                        className="w-full bg-transparent focus:outline-none text-neutral-900 placeholder-neutral-500 resize-none overflow-hidden flex-1 px-2"
                        style={{ 
                          fontSize: '14px', 
                          lineHeight: '20px',
                          minHeight: '40px',
                          maxHeight: '200px'
                        }}
                      />
                      
                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center">
                          <button 
                            onClick={() => onFileManagementOpenChange(true)}
                            className={`flex items-center gap-1.5 h-8 px-2 text-neutral-600 hover:text-neutral-800 hover:bg-neutral-200 rounded-md transition-colors`}
                          >
                            <Plus size={16} />
                          </button>
                          
                          <button className={`flex items-center gap-1.5 h-8 px-2 text-neutral-600 hover:text-neutral-800 hover:bg-neutral-200 rounded-md transition-colors`}>
                            <ListPlus size={16} />
                          </button>
                          
                          <div className="w-px bg-neutral-200" style={{ height: '20px', marginLeft: '4px', marginRight: '4px' }}></div>
                          
                          <button className={`flex items-center gap-1.5 h-8 px-2 text-neutral-600 hover:text-neutral-800 hover:bg-neutral-200 rounded-md transition-colors`}>
                            <Settings2 size={16} />
                          </button>
                          
                          <button className={`flex items-center gap-1.5 h-8 px-2 text-neutral-600 hover:text-neutral-800 hover:bg-neutral-200 rounded-md transition-colors`}>
                            <Wand size={16} />
                          </button>
                        </div>
                        
                        <div className="flex items-center space-x-1">
                          <button 
                            onClick={() => onDeepResearchActiveChange(!isDeepResearchActive)}
                            className={`flex items-center gap-1.5 h-8 px-2 transition-colors rounded-md ${
                              isDeepResearchActive 
                                ? 'text-[#5F3BA5] bg-[#E7E6EA]' 
                                : 'text-neutral-600 hover:text-neutral-800 hover:bg-neutral-200'
                            }`}
                          >
                            <Orbit size={16} />
                          </button>
                          
                          <button
                            onClick={() => onSendMessage()}
                            disabled={!inputValue.trim() || isLoading}
                            className={`focus:outline-none flex items-center justify-center transition-all bg-neutral-900 text-white hover:bg-neutral-800 ${
                              !inputValue.trim() || isLoading ? 'cursor-not-allowed' : ''
                            } p-2`}
                            style={{ 
                              minWidth: '32px',
                              width: '32px',
                              height: '32px',
                              borderRadius: '6px',
                              opacity: !inputValue.trim() || isLoading ? 0.3 : 1
                            }}
                          >
                            {isLoading ? (
                              <div className="w-4 h-4 flex items-center justify-center">
                                <Spinner size="sm" />
                              </div>
                            ) : (
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M5 12h14M12 5l7 7-7 7"/>
                              </svg>
                            )}
                          </button>
                        </div>
                      </div>
                      
                      <div className="mt-2 p-1.5 bg-white rounded-md flex items-center justify-between">
                        <p className="text-xs text-neutral-500 ml-0.5">Auto apply suggestions</p>
                        <button
                          className="relative inline-flex items-center rounded-full transition-colors"
                          style={{ 
                            width: '26px', 
                            height: '16px',
                            backgroundColor: autoApplySuggestions ? '#1a1a1a' : '#e5e5e5'
                          }}
                          onClick={() => setAutoApplySuggestions(!autoApplySuggestions)}
                        >
                          <span 
                            className="absolute rounded-full bg-white transition-transform"
                            style={{ 
                              width: '12px', 
                              height: '12px',
                              transform: autoApplySuggestions ? 'translateX(12px)' : 'translateX(2px)',
                              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
                            }} 
                          />
                        </button>
                      </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          )}
        </div>
      </motion.div>

    </>
  );
}