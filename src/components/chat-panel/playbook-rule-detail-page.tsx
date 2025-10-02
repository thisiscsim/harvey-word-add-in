import { useRef, useState } from "react";
import { CornerDownRight, MessageSquare, X, ChevronDown, CircleCheck, Undo2 } from "lucide-react";
import { useChatRouter } from "./router";
import { Drawer } from "vaul";

interface PlaybookRuleDetailPageProps {
  ruleId: number;
  ruleTitle: string;
}

// Sample data for the rule issues
const SAMPLE_ISSUES = [
  {
    id: 1,
    quotedText: "after obtaining such knowledge, then the Lessee shall promptly, but in no event later than seven (7) three (3) Business Days thereafter, sell or purchase.",
    standardPosition: "Change 7 days to 3 days.",
    fallback: "Keep payment terms as 7 days, but add 50% due upon signing and the remaining 50% due upon completion of the project.",
  },
  {
    id: 2,
    quotedText: "Unless otherwise specified herein, capitalized terms used herein (including the preamble and recitals hereto) shall have the meanings ascribed to such terms in the Definitions List attached as Annex I to the Base Indenture, dated as of...",
    standardPosition: "Clarify that scope, deliverables, and performance standards are defined by the Definitions List.",
    fallback: "Clarify that external documents are incorporated by reference per the rule.",
  },
];

export default function PlaybookRuleDetailPage({ 
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  ruleId,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  ruleTitle 
}: PlaybookRuleDetailPageProps) {
  const { goBack } = useChatRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPlaybookRuleExpanded, setIsPlaybookRuleExpanded] = useState(true);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedSections, setSelectedSections] = useState<Record<number, 'standard' | 'fallback' | undefined>>({});
  const [appliedSections, setAppliedSections] = useState<Record<number, 'standard' | 'fallback' | undefined>>({});
  const [editingIssue, setEditingIssue] = useState<number | null>(null);
  const [editedText, setEditedText] = useState<Record<number, string>>({});
  const [originalText, setOriginalText] = useState<Record<number, string>>({});

  const summaryText = "The contract states payment terms are over 7 days, which does not match the standard position that payment should be completed within 3 business days. This creates a timing discrepancy that needs to be addressed.";

  // Handle apply button click
  const handleApply = (index: number) => {
    const selected = selectedSections[index];
    if (selected) {
      setAppliedSections(prev => ({
        ...prev,
        [index]: selected
      }));
    }
  };

  // Handle undo button click
  const handleUndo = (index: number) => {
    setAppliedSections(prev => ({
      ...prev,
      [index]: undefined
    }));
  };

  // Get the text content from JSX (for editing)
  const getTextFromPreview = (issue: typeof SAMPLE_ISSUES[0], index: number) => {
    const selected = selectedSections[index];
    
    // First card transformations
    if (index === 0) {
      if (selected === 'standard') {
        return "after obtaining such knowledge, then the Lessee shall promptly, but in no event later than three (3) days thereafter, sell or purchase.";
      } else if (selected === 'fallback') {
        return "after obtaining such knowledge, then the Lessee shall pay 50% upon signing and 50% upon completion, then sell or purchase.";
      }
    }

    // Second card transformations
    if (index === 1) {
      if (selected === 'standard') {
        return "Unless otherwise specified herein, capitalized terms used herein (including the preamble and recitals hereto) shall have the meanings ascribed to such terms in the scope, deliverables, and performance standards defined by the Definitions List attached as Annex I to the Base Indenture, dated as of...";
      } else if (selected === 'fallback') {
        return "Unless otherwise specified herein, capitalized terms used herein (including the preamble and recitals hereto) shall have meanings from external documents incorporated by reference per the rule, including the Definitions List attached as Annex I to the Base Indenture, dated as of...";
      }
    }

    return issue.quotedText;
  };

  // Handle starting edit mode
  const handleStartEdit = (index: number) => {
    // Only allow editing if a selection has been made and not yet applied
    if (appliedSections[index] === undefined && selectedSections[index] !== undefined) {
      const currentText = editedText[index] || getTextFromPreview(SAMPLE_ISSUES[index], index);
      setOriginalText(prev => ({
        ...prev,
        [index]: currentText
      }));
      setEditedText(prev => ({
        ...prev,
        [index]: currentText
      }));
      setEditingIssue(index);
    }
  };

  // Handle saving edited text
  const handleSaveEdit = (index: number) => {
    // Only persist the edited text if it was actually changed
    if (editedText[index] === originalText[index]) {
      // No changes made, remove the edited text to show the styled preview
      setEditedText(prev => {
        const updated = { ...prev };
        delete updated[index];
        return updated;
      });
    }
    setEditingIssue(null);
  };

  // Function to render the preview text with redline effect
  const renderPreviewText = (issue: typeof SAMPLE_ISSUES[0], index: number) => {
    // If there's custom edited text, show that instead
    if (editedText[index]) {
      return editedText[index];
    }

    const selected = selectedSections[index];

    // First card transformations
    if (index === 0) {
      if (selected === 'standard') {
        // Show strikethrough on "seven (7) Business D" and red text on "three (3)"
        return (
          <>
            after obtaining such knowledge, then the Lessee shall promptly, but in no event later than{' '}
            <span className="line-through text-red-500">seven (7)</span>{' '}
            <span className="text-red-500">three (3)</span>{' '}
            <span className="line-through text-red-500">Business D</span>days thereafter, sell or purchase.
          </>
        );
      } else if (selected === 'fallback') {
        // For fallback, strike through different text and add payment terms
        return (
          <>
            after obtaining such knowledge, then the Lessee shall{' '}
            <span className="line-through text-red-500">promptly, but in no event later than seven (7) three (3) Business Days thereafter,</span>{' '}
            <span className="text-red-500">pay 50% upon signing and 50% upon completion, then</span>{' '}
            sell or purchase.
          </>
        );
      }
    }

    // Second card transformations
    if (index === 1) {
      if (selected === 'standard') {
        // Strike through and add clarification
        return (
          <>
            Unless otherwise specified herein, capitalized terms used herein (including the preamble and recitals hereto) shall have the meanings ascribed to such terms in{' '}
            <span className="text-red-500">the scope, deliverables, and performance standards defined by</span>{' '}
            the Definitions List attached as Annex I to the Base Indenture, dated as of...
          </>
        );
      } else if (selected === 'fallback') {
        return (
          <>
            Unless otherwise specified herein, capitalized terms used herein (including the preamble and recitals hereto) shall have{' '}
            <span className="line-through text-red-500">the meanings ascribed to such terms in</span>{' '}
            <span className="text-red-500">meanings from external documents incorporated by reference per the rule, including</span>{' '}
            the Definitions List attached as Annex I to the Base Indenture, dated as of...
          </>
        );
      }
    }

    // Default: show original text
    return issue.quotedText;
  };

  return (
    <div ref={containerRef} className="h-full flex flex-col bg-white relative">
      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Reasoning Section */}
        <div className="px-4 py-4 border-b border-neutral-200">
          <h2 className="text-sm font-medium text-neutral-900">
            Reasoning
          </h2>
          <p className="text-sm text-neutral-700 leading-relaxed mb-3 line-clamp-2">
            {summaryText}
          </p>
          <Drawer.Root open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
            <Drawer.Trigger asChild>
              <button className="w-full px-3 py-1.5 text-sm font-normal text-neutral-900 bg-white border border-neutral-200 rounded-md hover:bg-neutral-100 transition-colors">
                View more
              </button>
            </Drawer.Trigger>
            <Drawer.Portal container={containerRef.current}>
              <Drawer.Overlay className="absolute inset-0 bg-black/40 z-40" />
              <Drawer.Content className="bg-white flex flex-col rounded-t-[10px] h-[96%] absolute bottom-0 left-0 right-0 z-50">
                {/* Drawer Header */}
                <div className="relative flex items-center justify-center px-2 py-4 pb-3 border-b border-neutral-200">
                  <Drawer.Title className="text-base font-medium text-neutral-900">
                    Playbook details
                  </Drawer.Title>
                  <button 
                    onClick={() => setIsDrawerOpen(false)}
                    className="absolute right-2 w-8 h-8 flex items-center justify-center text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-md transition-colors"
                  >
                    <X size={16} />
                  </button>
                </div>

                {/* Drawer Content */}
                <div className="flex-1 overflow-y-auto p-4 space-y-6">
                  {/* Harvey Summary */}
                  <div>
                    <h4 className="text-sm font-semibold text-neutral-900 mb-2">Harvey summary</h4>
                    <p className="text-sm text-neutral-600 leading-relaxed">
                      The contract states payment terms are over 7 days, which does not match the standard position that confidential Information is limited to information that: (a) is or becomes publicly
                    </p>
                  </div>

                  {/* Playbook Rule */}
                  <div>
                    <button
                      onClick={() => setIsPlaybookRuleExpanded(!isPlaybookRuleExpanded)}
                      className="flex items-center justify-between w-full mb-3"
                    >
                      <h4 className="text-sm font-semibold text-neutral-900">Playbook rule</h4>
                      <ChevronDown 
                        size={16} 
                        className={`text-neutral-600 transition-transform ${isPlaybookRuleExpanded ? 'rotate-180' : ''}`}
                      />
                    </button>
                    
                    {isPlaybookRuleExpanded && (
                      <div className="space-y-4">
                        {/* Standard Position */}
                        <div>
                          <h5 className="text-sm font-semibold text-neutral-900 mb-2">Standard position</h5>
                          <p className="text-sm text-neutral-600 leading-relaxed">
                            Exclusions to Confidential Information is limited to information that: (a) is or becomes publicly available through no fault of the Recipient; (b) was already lawfully in the Recipient&apos;s possession without restriction; (c) is received from a third party without breach of any obligation.
                          </p>
                        </div>

                        {/* Fallback Positions */}
                        <div>
                          <h5 className="text-sm font-semibold text-neutral-900 mb-2">Fallback positions</h5>
                          <p className="text-sm text-neutral-600 leading-relaxed">
                            Exclusions to Confidential Information is limited to information that: (a) is or becomes publicly available through no fault of the Recipient; (b) was already lawfully in the Recipient&apos;s possession without restriction; (c) is received from a third party without breach of any obligation; (d) is independently developed by the Recipient without reference to the Discloser&apos;s information.
                          </p>
                        </div>

                        {/* Unacceptable Positions */}
                        <div>
                          <h5 className="text-sm font-semibold text-neutral-900 mb-2">Unacceptable positions</h5>
                          <p className="text-sm text-neutral-500 leading-relaxed">None</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Acceptable Guidance */}
                  <div>
                    <h4 className="text-sm font-semibold text-neutral-900 mb-2">Acceptable guidance</h4>
                    <p className="text-sm text-neutral-600 leading-relaxed">
                      The contract states payment terms are over 7 days, which does not match the standard position that.
                    </p>
                  </div>
                </div>
              </Drawer.Content>
            </Drawer.Portal>
          </Drawer.Root>
        </div>

        {/* Issues List */}
        <div className="px-4 py-4 space-y-4">
          {SAMPLE_ISSUES.map((issue, index) => {
            const isApplied = appliedSections[index] !== undefined;
            const appliedOption = appliedSections[index];
            
            return (
              <div key={issue.id}>
                {/* Container with quoted text, standard position, and fallback */}
                <div className="bg-white rounded-lg border border-neutral-200 overflow-hidden">
                  {/* Quoted Text */}
                  {editingIssue === index ? (
                    <div className="m-1 p-3 relative min-h-[72px] bg-neutral-50">
                      <div className="flex gap-2">
                        <CornerDownRight size={14} className="text-neutral-400 flex-shrink-0 mt-0.5" />
                        <textarea
                          className="flex-1 text-xs text-neutral-700 leading-relaxed bg-transparent border-none focus:outline-none resize-none min-h-[60px]"
                          value={editedText[index] || ''}
                          onChange={(e) => {
                            setEditedText(prev => ({
                              ...prev,
                              [index]: e.target.value
                            }));
                          }}
                          onBlur={() => {
                            handleSaveEdit(index);
                          }}
                          autoFocus
                          onClick={(e) => e.stopPropagation()}
                        />
                      </div>
                    </div>
                  ) : (
                    <div 
                      className={`m-1 p-3 relative overflow-hidden ${isApplied ? 'bg-white' : 'bg-neutral-50'} ${!isApplied && selectedSections[index] !== undefined && editingIssue !== index ? 'cursor-pointer hover:bg-neutral-100 hover:outline-1 hover:outline-neutral-200' : ''} transition-all rounded`}
                      onClick={() => {
                        if (!isApplied && editingIssue !== index && selectedSections[index] !== undefined) {
                          handleStartEdit(index);
                        }
                      }}
                    >
                      <div className="flex gap-2">
                        <CornerDownRight size={14} className="text-neutral-400 flex-shrink-0 mt-0.5" />
                        <p className="text-xs text-neutral-700 leading-relaxed">
                          {renderPreviewText(issue, index)}
                        </p>
                      </div>
                      {/* Gradient fade overlay */}
                      <div className={`absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t ${isApplied ? 'from-white' : 'from-neutral-50'} to-transparent pointer-events-none`} />
                    </div>
                  )}

                  {/* Selection Container */}
                  <div className="p-1 border-t border-neutral-200">
                    {/* Standard Position */}
                    {(!isApplied || appliedOption === 'standard') && (
                      <div 
                        className={`p-2 transition-colors rounded ${!isApplied ? 'cursor-pointer hover:bg-neutral-50' : 'cursor-default'}`}
                        onClick={() => {
                          if (!isApplied) {
                            setSelectedSections(prev => ({
                              ...prev,
                              [index]: prev[index] === 'standard' ? undefined : 'standard'
                            }));
                          }
                        }}
                      >
                        <div className="flex items-center justify-between gap-4">
                          {/* Content */}
                          <div className="flex-1">
                            <h3 className="text-xs font-semibold text-neutral-900">
                              Standard position
                            </h3>
                            <p className="text-xs text-neutral-600 leading-relaxed">
                              {issue.standardPosition}
                            </p>
                          </div>
                          {/* Radio Button */}
                          <div className="flex-shrink-0">
                            <div className={`w-4 h-4 rounded-full border flex items-center justify-center transition-colors ${
                              selectedSections[index] === 'standard' 
                                ? 'border-neutral-900 bg-neutral-900' 
                                : 'border-neutral-300'
                            } ${isApplied ? 'opacity-50' : ''}`}>
                              {selectedSections[index] === 'standard' && (
                                <div className="w-1.5 h-1.5 rounded-full bg-white" />
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Fallback */}
                    {(!isApplied || appliedOption === 'fallback') && (
                      <div 
                        className={`p-2 transition-colors rounded ${!isApplied ? 'cursor-pointer hover:bg-neutral-50' : 'cursor-default'}`}
                        onClick={() => {
                          if (!isApplied) {
                            setSelectedSections(prev => ({
                              ...prev,
                              [index]: prev[index] === 'fallback' ? undefined : 'fallback'
                            }));
                          }
                        }}
                      >
                        <div className="flex items-center justify-between gap-4">
                          {/* Content */}
                          <div className="flex-1">
                            <h3 className="text-xs font-semibold text-neutral-900">
                              Fallback
                            </h3>
                            <p className="text-xs text-neutral-600 leading-relaxed">
                              {issue.fallback}
                            </p>
                          </div>
                          {/* Radio Button */}
                          <div className="flex-shrink-0">
                            <div className={`w-4 h-4 rounded-full border flex items-center justify-center transition-colors ${
                              selectedSections[index] === 'fallback' 
                                ? 'border-neutral-900 bg-neutral-900' 
                                : 'border-neutral-300'
                            } ${isApplied ? 'opacity-50' : ''}`}>
                              {selectedSections[index] === 'fallback' && (
                                <div className="w-1.5 h-1.5 rounded-full bg-white" />
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Global Action Buttons */}
                  <div className="p-2 border-t border-neutral-200 bg-white">
                    <div className="flex gap-2">
                      <button 
                        disabled={!selectedSections[index] && !isApplied}
                        className="flex-1 inline-flex items-center justify-center gap-1 px-2 py-1 text-xs leading-4 font-normal text-neutral-900 bg-white border border-neutral-200 rounded-sm hover:bg-neutral-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white"
                      >
                        <MessageSquare size={12} />
                        Comment
                      </button>
                      {!isApplied ? (
                        <button 
                          disabled={!selectedSections[index]}
                          onClick={() => handleApply(index)}
                          className="flex-1 inline-flex items-center justify-center gap-1 px-2 py-1 text-xs leading-4 font-normal text-white bg-neutral-900 rounded-sm hover:bg-neutral-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-neutral-900"
                        >
                          <CircleCheck size={12} />
                          Apply
                        </button>
                      ) : (
                        <button 
                          onClick={() => handleUndo(index)}
                          className="flex-1 inline-flex items-center justify-center gap-1 px-2 py-1 text-xs leading-4 font-normal text-neutral-900 bg-white border border-neutral-200 rounded-sm hover:bg-neutral-100 transition-colors"
                        >
                          <Undo2 size={12} />
                          Undo
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Padding */}
        <div className="h-20" />
      </div>

      {/* Bottom Navigation */}
      <div className="sticky bottom-0 bg-white border-t border-neutral-200 px-4 py-3">
        <div className="flex items-center justify-between gap-3">
          <button
            onClick={goBack}
            className="px-3 py-1.5 text-sm font-normal text-neutral-900 bg-white border border-neutral-200 rounded-md hover:bg-neutral-100 transition-colors"
          >
            Back
          </button>
          <button className="px-3 py-1.5 text-sm font-normal text-neutral-900 bg-white border border-neutral-200 rounded-md hover:bg-neutral-100 transition-colors">
            Mark reviewed
          </button>
          <button className="px-3 py-1.5 text-sm font-normal text-neutral-900 bg-white border border-neutral-200 rounded-md hover:bg-neutral-100 transition-colors">
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
