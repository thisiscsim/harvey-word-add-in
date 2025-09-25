"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef, useCallback, useEffect } from "react";
import { 
  ChevronRight, 
  Share, 
  Plus, 
  ListPlus, 
  Settings2, 
  Wand, 
  Orbit
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
  chatWidth: number;
  onChatWidthChange: (width: number) => void;
  isResizing: boolean;
  onResizingChange: (resizing: boolean) => void;
  onShareThreadDialogOpenChange: (open: boolean) => void;
  onFileManagementOpenChange: (open: boolean) => void;
  isDeepResearchActive: boolean;
  onDeepResearchActiveChange: (active: boolean) => void;
  scrollToBottom: () => void;
  messagesEndRef: React.RefObject<HTMLDivElement>;
  chatContainerRef: React.RefObject<HTMLDivElement>;
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
  chatWidth,
  onChatWidthChange,
  isResizing,
  onResizingChange,
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
  const containerRef = useRef<HTMLDivElement>(null);

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
    
    // Default S-1 Shell content
    return `
      <h2>United States</h2>
      <h3>Securities and Exchange Commission</h3>
      <h3>Washington, D.C. 20549</h3>
      <hr/>
      <h3>Form S-1</h3>
      <h3>Registration Statement under the Securities Act of 1933</h3>
      <hr/>
      
      <table>
        <tr>
          <td><strong>Valar AI, Inc.</strong><br/>
          <td><strong>Delaware Corporation</strong><br/>
          <td><strong>9872398729</strong>
        </tr>
      </table>
      
      <p><strong>1234 Main Street, Suite 2900</strong><br/>
      <strong>San Francisco, CA 94105</strong><br/>
      <strong>123-456-7890</strong><br/>
      
      <p><strong>Latham & Watkins LLP</strong><br/>
      <strong>535 Mission St</strong><br/>
      <strong>San Francisco, CA 94105</strong><br/>
      <strong>628-432-5100</strong><br/>
      
      <hr/>
      
      <p><strong>Approximate date of commencement of proposed sale of the securities to the public:</strong> As soon as practicable after the effective date of this registration statement.</p>
      
      <p>If any of the securities being registered on this Form are to be offered on a delayed or continuous basis pursuant to Rule 415 under the Securities Act of 1933, check the following box</p>
      
      <p>If this Form is filed to register additional securities for an offering pursuant to Rule 462(b) under the Securities Act, please check the following box and list the Securities Act registration statement number of the earlier effective registration statement for the same offering.</p>
      
      <p>If this Form is a post-effective amendment filed pursuant to Rule 462(c) under the Securities Act, check the following box and list the Securities Act registration statement number of the earlier effective registration statement for the same offering.</p>
      
      <p>If this Form is a post-effective amendment filed pursuant to Rule 462(d) under the Securities Act, check the following box and list the Securities Act registration statement number of the earlier effective registration statement for the same offering.</p>
      
      <p>Indicate by check mark whether the registrant is a large accelerated filer, an accelerated filer, a non-accelerated filer, smaller reporting company, or an emerging growth company. See the definitions of "large accelerated filer," "accelerated filer," "smaller reporting company," and "emerging growth company" in Rule 12b-2 of the Exchange Act.</p>
      
      <table>
        <tr>
          <td><strong>Large accelerated filer</strong> ☐</td>
          <td><strong>Accelerated filer</strong> ☐</td>
        </tr>
        <tr>
          <td><strong>Non-accelerated filer</strong> ☐</td>
          <td><strong>Smaller reporting company</strong> ☐</td>
        </tr>
        <tr>
          <td><strong>Emerging growth company</strong> ☐</td>
          <td></td>
        </tr>
      </table>
      
      <p>If an emerging growth company, indicate by check mark if the registrant has elected not to use the extended transition period for complying with any new or revised financial accounting standards provided pursuant to Section 7(a)(2)(B) of the Securities Act. ☐</p>
      
      <hr/>
      
      <h3>CALCULATION OF REGISTRATION FEE</h3>
      
      <table>
        <thead>
          <tr>
            <th><strong>Title of Each Class of Securities to be Registered</strong></th>
            <th><strong>Amount to be Registered</strong></th>
            <th><strong>Proposed Maximum Offering Price Per Share</strong></th>
            <th><strong>Proposed Maximum Aggregate Offering Price</strong></th>
            <th><strong>Amount of Registration Fee</strong></th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Common Stock, $[Par Value] par value per share</td>
            <td>[Number] shares</td>
            <td>$[Price]</td>
            <td>$[Total]</td>
            <td>$[Fee]</td>
          </tr>
          <tr>
            <td><strong>Total</strong></td>
            <td></td>
            <td></td>
            <td>$[Total]</td>
            <td>$[Total Fee]</td>
          </tr>
        </tbody>
      </table>
      
      <p><em>(1) Estimated solely for the purpose of calculating the registration fee pursuant to Rule 457(o) under the Securities Act of 1933.</em><br/>
      <em>(2) Calculated pursuant to Rule 457(o) based on an estimate of the proposed maximum aggregate offering price.</em></p>
      
      <hr/>
      
      <h3>SUBJECT TO COMPLETION, DATED [DATE]</h3>
      
      <h3>PRELIMINARY PROSPECTUS</h3>
      
      <p><strong>[NUMBER] Shares</strong></p>
      
      <h3>[COMPANY NAME], INC.</h3>
      <h3>Common Stock</h3>
      
      <hr/>
      
      <p>This is [Company Name], Inc.'s initial public offering. Prior to this offering, there has been no public market for our common stock.</p>
      
      <p>The initial public offering price is expected to be between $[Low] and $[High] per share. We have applied to list our common stock on the [Exchange] under the symbol "[SYMBOL]."</p>
      
      <p><strong>We are an "emerging growth company" as defined under the federal securities laws and will be subject to reduced public company reporting requirements.</strong></p>
      
      <p>Investing in our common stock involves risks. See "Risk Factors" beginning on page [X].</p>
      
      <hr/>
      
      <table>
        <thead>
          <tr>
            <th></th>
            <th><strong>Per Share</strong></th>
            <th><strong>Total</strong></th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>Public offering price</strong></td>
            <td>$[Price]</td>
            <td>$[Total]</td>
          </tr>
          <tr>
            <td><strong>Underwriting discounts and commissions</strong></td>
            <td>$[Discount]</td>
            <td>$[Total Discount]</td>
          </tr>
          <tr>
            <td><strong>Proceeds to [Company Name], before expenses</strong></td>
            <td>$[Net]</td>
            <td>$[Total Net]</td>
          </tr>
        </tbody>
      </table>
      
      <p><em>(1) See "Underwriting" for a description of the compensation payable to the underwriters.</em></p>
      
      <p>We have granted the underwriters an option to purchase up to an additional [number] shares of common stock at the public offering price, less underwriting discounts and commissions, to cover over-allotments.</p>
      
      <p>The Securities and Exchange Commission and state securities regulators have not approved or disapproved these securities, or determined if this prospectus is truthful or complete. Any representation to the contrary is a criminal offense.</p>
      
      <p>The shares will be ready for delivery on or about [Date].</p>
      
      <hr/>
      
      <p><strong>Lead Book-Running Manager</strong><br/>
      <strong>[UNDERWRITER NAME]</strong></p>
      
      <p><strong>Book-Running Managers</strong><br/>
      <strong>[UNDERWRITER 2]</strong> | <strong>[UNDERWRITER 3]</strong></p>
      
      <p><strong>Co-Managers</strong><br/>
      <strong>[CO-MANAGER 1]</strong> | <strong>[CO-MANAGER 2]</strong> | <strong>[CO-MANAGER 3]</strong></p>
      
      <hr/>
      
      <p>The date of this prospectus is [Date].</p>
      
      <hr/>
      
      <h3>TABLE OF CONTENTS</h3>
      
      <table>
        <tbody>
          <tr><td><strong>PROSPECTUS SUMMARY</strong></td><td>1</td></tr>
          <tr><td><strong>RISK FACTORS</strong></td><td>[X]</td></tr>
          <tr><td><strong>SPECIAL NOTE REGARDING FORWARD-LOOKING STATEMENTS</strong></td><td>[X]</td></tr>
          <tr><td><strong>USE OF PROCEEDS</strong></td><td>[X]</td></tr>
          <tr><td><strong>DIVIDEND POLICY</strong></td><td>[X]</td></tr>
          <tr><td><strong>CAPITALIZATION</strong></td><td>[X]</td></tr>
          <tr><td><strong>DILUTION</strong></td><td>[X]</td></tr>
          <tr><td><strong>SELECTED CONSOLIDATED FINANCIAL DATA</strong></td><td>[X]</td></tr>
          <tr><td><strong>MANAGEMENT'S DISCUSSION AND ANALYSIS OF FINANCIAL CONDITION AND RESULTS OF OPERATIONS</strong></td><td>[X]</td></tr>
          <tr><td><strong>BUSINESS</strong></td><td>[X]</td></tr>
          <tr><td><strong>MANAGEMENT</strong></td><td>[X]</td></tr>
          <tr><td><strong>EXECUTIVE COMPENSATION</strong></td><td>[X]</td></tr>
          <tr><td><strong>CERTAIN RELATIONSHIPS AND RELATED PARTY TRANSACTIONS</strong></td><td>[X]</td></tr>
          <tr><td><strong>PRINCIPAL STOCKHOLDERS</strong></td><td>[X]</td></tr>
          <tr><td><strong>DESCRIPTION OF CAPITAL STOCK</strong></td><td>[X]</td></tr>
          <tr><td><strong>SHARES ELIGIBLE FOR FUTURE SALE</strong></td><td>[X]</td></tr>
          <tr><td><strong>MATERIAL U.S. FEDERAL INCOME TAX CONSEQUENCES TO NON-U.S. HOLDERS</strong></td><td>[X]</td></tr>
          <tr><td><strong>UNDERWRITING</strong></td><td>[X]</td></tr>
          <tr><td><strong>LEGAL MATTERS</strong></td><td>[X]</td></tr>
          <tr><td><strong>EXPERTS</strong></td><td>[X]</td></tr>
          <tr><td><strong>WHERE YOU CAN FIND MORE INFORMATION</strong></td><td>[X]</td></tr>
          <tr><td><strong>INDEX TO CONSOLIDATED FINANCIAL STATEMENTS</strong></td><td>F-1</td></tr>
        </tbody>
      </table>
      
      <hr/>
      
      <h3>PROSPECTUS SUMMARY</h3>
      
      <p>This summary highlights information contained elsewhere in this prospectus. This summary does not contain all of the information you should consider before investing in our common stock. You should read the entire prospectus carefully, including "Risk Factors" and our consolidated financial statements and related notes included elsewhere in this prospectus, before making an investment decision.</p>
      
      <h3>Our Company</h3>
      
      <p><strong>[Provide 2-3 paragraph overview of the company, its business model, key products/services, target markets, competitive advantages, and growth strategy]</strong></p>
      
      <h3>Our Market Opportunity</h3>
      
      <p><strong>[Describe the market size, growth trends, and company's addressable market opportunity]</strong></p>
      
      <h3>Our Competitive Strengths</h3>
      
      <p><strong>[List 4-6 key competitive advantages with brief explanations]</strong></p>
      
      <h3>Our Growth Strategy</h3>
      
      <p><strong>[Outline 3-5 key elements of growth strategy]</strong></p>
      
      <h3>Summary Risk Factors</h3>
      
      <p><strong>[List 8-12 primary risk factors that could materially affect the business]</strong></p>
      
      <h3>Corporate Information</h3>
      
      <p>We were incorporated in [State] in [Year]. Our principal executive offices are located at [Address]. Our telephone number is [Phone]. Our website address is [Website]. Information contained on, or accessible through, our website is not incorporated by reference into this prospectus, and you should not consider information on our website to be part of this prospectus.</p>
      
      <h3>The Offering</h3>
      
      <table>
        <tbody>
          <tr><td><strong>Common stock offered by us</strong></td><td>[Number] shares</td></tr>
          <tr><td><strong>Common stock to be outstanding after this offering</strong></td><td>[Number] shares</td></tr>
          <tr><td><strong>Over-allotment option</strong></td><td>[Number] shares</td></tr>
          <tr><td><strong>Use of proceeds</strong></td><td>[Brief description]</td></tr>
          <tr><td><strong>Risk factors</strong></td><td>See "Risk Factors" and other information in this prospectus</td></tr>
          <tr><td><strong>Proposed [Exchange] symbol</strong></td><td>"[SYMBOL]"</td></tr>
        </tbody>
      </table>
      
      <p><em>(The number of shares of common stock to be outstanding after this offering is based on [number] shares of common stock outstanding as of [Date] and excludes [details of excluded securities])</em></p>
      
      <hr/>
      
      <h3>RISK FACTORS</h3>
      
      <p>Investing in our common stock involves a high degree of risk. You should carefully consider the risks and uncertainties described below, together with all of the other information in this prospectus, including our consolidated financial statements and related notes, before deciding to invest in our common stock. If any of the following risks actually occurs, our business, financial condition, results of operations, and prospects could be materially and adversely affected. In that event, the market price of our common stock could decline, and you could lose part or all of your investment.</p>
      
      <h3>Risks Related to Our Business and Industry</h3>
      
      <p><strong>[Include 15-25 specific risk factors relevant to the company and industry]</strong></p>
      
      <h3>Risks Related to Our Organizational Structure</h3>
      
      <p><strong>[Include relevant risks related to corporate structure, governance, etc.]</strong></p>
      
      <h3>Risks Related to This Offering and Ownership of Our Common Stock</h3>
      
      <p><strong>[Include risks related to public company status, stock price volatility, etc.]</strong></p>
      
      <hr/>
      
      <h3>SPECIAL NOTE REGARDING FORWARD-LOOKING STATEMENTS</h3>
      
      <p><strong>[Standard forward-looking statements disclaimer]</strong></p>
      
      <hr/>
      
      <h3>USE OF PROCEEDS</h3>
      
      <p>We estimate that the net proceeds to us from this offering will be approximately $[Amount] (or approximately $[Amount] if the underwriters exercise their over-allotment option in full), based on an assumed initial public offering price of $[Price] per share, after deducting estimated underwriting discounts and commissions and estimated offering expenses payable by us.</p>
      
      <p><strong>[Provide detailed breakdown of use of proceeds with specific percentages and amounts]</strong></p>
      
      <hr/>
      
      <h3>DIVIDEND POLICY</h3>
      
      <p><strong>[Describe current dividend policy and any restrictions on paying dividends]</strong></p>
      
      <hr/>
      
      <h3>CAPITALIZATION</h3>
      
      <p><strong>[Include capitalization table showing before and after the offering]</strong></p>
      
      <hr/>
      
      <h3>DILUTION</h3>
      
      <p><strong>[Calculate and present dilution analysis for new investors]</strong></p>
      
      <hr/>
      
      <h3>SELECTED CONSOLIDATED FINANCIAL DATA</h3>
      
      <p><strong>[Present 5-year selected financial data in tabular format]</strong></p>
      
      <hr/>
      
      <h3>MANAGEMENT'S DISCUSSION AND ANALYSIS OF FINANCIAL CONDITION AND RESULTS OF OPERATIONS</h3>
      
      <p><strong>[Comprehensive MD&A section covering:]</strong></p>
      <ul>
        <li>Overview</li>
        <li>Key Factors Affecting Our Performance</li>
        <li>Components of Our Results of Operations</li>
        <li>Results of Operations (by period)</li>
        <li>Liquidity and Capital Resources</li>
        <li>Contractual Obligations</li>
        <li>Off-Balance Sheet Arrangements</li>
      </ul>
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
            className="flex-1 overflow-y-auto bg-neutral-0 cursor-text"
            onClick={(e) => {
              // Focus the editor when clicking anywhere in the content area
              // Only if the click target is the container itself or its direct children
              const target = e.target as HTMLElement;
              if (editor && !editor.isFocused && !target.closest('.ProseMirror')) {
                editor.chain().focus('end').run();
              }
            }}
          >
            <div className="h-full flex justify-center">
              <div className="w-full max-w-[1000px] px-8 py-10">
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
                  {/* Chat Header */}
                  <div className="px-3 py-4 border-b border-neutral-200 flex items-center justify-between" style={{ height: '52px' }}>
                    <div className="flex items-center gap-3">
                      <h2 className="text-sm font-medium text-neutral-900">Word Add-In Assistant</h2>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => onShareThreadDialogOpenChange(true)}
                        className="p-1.5 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-md transition-colors"
                      >
                        <Share size={16} />
                      </button>
                      <button
                        onClick={() => onToggleChat(false)}
                        className="p-1.5 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-md transition-colors"
                      >
                        <ChevronRight size={16} />
                      </button>
                    </div>
                  </div>

                  {/* Messages */}
                  <div 
                    ref={chatContainerRef}
                    className="flex-1 overflow-y-auto px-6 py-6"
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

                  {/* Input Area */}
                  <div className="px-6 pb-6 overflow-x-hidden relative z-20 bg-white">
                    <div className="mx-auto" style={{ maxWidth: '832px' }}>
                      <div className="pl-2 pr-3 pt-4 pb-3 transition-all duration-200 border border-transparent focus-within:border-neutral-300 bg-neutral-100 flex flex-col" style={{ borderRadius: '12px', minHeight: '160px' }}>
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
                          minHeight: '60px',
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