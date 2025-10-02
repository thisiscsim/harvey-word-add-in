"use client";

import { useState, useRef, useCallback } from "react";
import DraftArtifactPanel from "@/components/draft-artifact-panel";
import ShareThreadDialog from "@/components/share-thread-dialog";
import SourcesDrawer from "@/components/sources-drawer";
import { detectArtifactType } from "@/lib/artifact-detection";

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

// Thinking content for draft artifacts
const getThinkingContent = (variant: 'draft' | 'analysis' = 'draft') => {
  if (variant === 'draft') {
    return {
      summary: "I'll help you draft a document.",
      bullets: [
        "Analyzing the document type and requirements",
        "Structuring the content with appropriate sections",
        "Applying legal formatting and conventions",
        "Including standard clauses and provisions"
      ],
      additionalText: "Generating your draft document..."
    };
  }
  return {
    summary: "I'll analyze this for you.",
    bullets: [
      "Understanding your query",
      "Searching relevant information",
      "Analyzing the context",
      "Preparing a comprehensive response"
    ],
    additionalText: "Processing your request..."
  };
};


export default function WordAddInPage() {
  // Start with empty messages to show home screen
  const initialMessages: Message[] = [];

  // State management
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [chatOpen, setChatOpen] = useState(true);
  const [chatWidth, setChatWidth] = useState(401);
  const [isResizing, setIsResizing] = useState(false);
  const [sourcesDrawerOpen, setSourcesDrawerOpen] = useState(false);
  const [shareThreadDialogOpen, setShareThreadDialogOpen] = useState(false);
  const [draftArtifactPanelOpen, setDraftArtifactPanelOpen] = useState(true);
  const [selectedArtifact, setSelectedArtifact] = useState<{ title: string; subtitle: string } | null>({
    title: 'Draft Document',
    subtitle: 'Version 1'
  });
  const [isDeepResearchActive, setIsDeepResearchActive] = useState(false);

  // Refs
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom helper
  const scrollToBottom = useCallback(() => {
    if (messagesEndRef.current && chatContainerRef.current) {
      const container = chatContainerRef.current;
      const scrollHeight = container.scrollHeight;
      const containerHeight = container.clientHeight;
      
      if (scrollHeight > containerHeight) {
        container.scrollTo({
          top: scrollHeight,
          behavior: 'smooth'
        });
      }
    }
  }, []);

  // Handle going back to home screen
  const handleBackToHome = useCallback(() => {
    setMessages([]);
    setInputValue('');
  }, []);

  // Handle sending messages
  const sendMessage = useCallback((messageOverride?: string) => {
    const messageToSend = messageOverride || inputValue;
    if (messageToSend.trim() && !isLoading) {
      const userMessage = messageToSend;
      setInputValue('');
      setIsLoading(true);
      
      // Reset textarea height
      const textarea = document.querySelector('textarea');
      if (textarea) {
        textarea.style.height = 'auto';
        textarea.style.height = '60px';
      }
      
      // Determine artifact type
      const artifactType = detectArtifactType(userMessage);
      const isDraftArtifact = artifactType === 'draft';
      
      // Get thinking content
      const variant = isDraftArtifact ? 'draft' : 'analysis';
      const thinkingContent = getThinkingContent(variant);
      
      // Create assistant message
      const assistantMessage: Message = {
        role: 'assistant',
        content: '',
        type: isDraftArtifact ? 'artifact' : 'text',
        thinkingContent,
        loadingState: {
          showSummary: false,
          visibleBullets: 0,
          showAdditionalText: false
        },
        isLoading: true,
        ...(isDraftArtifact ? {
          artifactData: {
            title: 'New Draft Document',
            subtitle: 'Version 1',
            variant: 'draft'
          }
        } : {})
      };
      
      // Add messages
      setMessages(prev => [
        ...prev,
        { role: 'user' as const, content: userMessage, type: 'text' as const },
        assistantMessage
      ]);
      
      // Scroll to bottom
      setTimeout(() => scrollToBottom(), 50);
      
      // Simulate loading states
      const currentState = { ...assistantMessage.loadingState! };
      
      // Show summary after delay
      setTimeout(() => {
        currentState.showSummary = true;
        setMessages(prev => {
          if (prev.length === 0) return prev; // Safety check
          const newMessages = [...prev];
          const lastMessage = newMessages[newMessages.length - 1];
          if (lastMessage && lastMessage.role === 'assistant' && lastMessage.isLoading) {
            lastMessage.loadingState = { ...currentState };
          }
          return newMessages;
        });
      }, 500);
      
      // Show bullets progressively
      const bulletIntervals = [800, 1100, 1400, 1700];
      bulletIntervals.forEach((delay, index) => {
        setTimeout(() => {
          currentState.visibleBullets = index + 1;
          setMessages(prev => {
            if (prev.length === 0) return prev; // Safety check
            const newMessages = [...prev];
            const lastMessage = newMessages[newMessages.length - 1];
            if (lastMessage && lastMessage.role === 'assistant' && lastMessage.isLoading) {
              lastMessage.loadingState = { ...currentState };
            }
            return newMessages;
          });
        }, delay);
      });
      
      // Show additional text
      setTimeout(() => {
        currentState.showAdditionalText = true;
        setMessages(prev => {
          if (prev.length === 0) return prev; // Safety check
          const newMessages = [...prev];
          const lastMessage = newMessages[newMessages.length - 1];
          if (lastMessage && lastMessage.role === 'assistant' && lastMessage.isLoading) {
            lastMessage.loadingState = { ...currentState };
          }
          return newMessages;
        });
      }, 2000);
      
      // Complete loading
      setTimeout(() => {
        setMessages(prev => {
          if (prev.length === 0) return prev; // Safety check
          const newMessages = [...prev];
          const lastMessage = newMessages[newMessages.length - 1];
          if (lastMessage && lastMessage.role === 'assistant' && lastMessage.isLoading) {
            lastMessage.isLoading = false;
            lastMessage.content = isDraftArtifact 
              ? "I've created a new draft document for you. You can edit and customize it in the editor."
              : "Here's my analysis of your request...";
          }
          return newMessages;
        });
        
        if (isDraftArtifact) {
          setDraftArtifactPanelOpen(true);
          setSelectedArtifact({
            title: 'New Draft Document',
            subtitle: 'Version 1'
          });
        }
        
        setIsLoading(false);
        scrollToBottom();
      }, 2500);
    }
  }, [inputValue, isLoading, scrollToBottom]);








  return (
    <>
      <div className="flex h-screen w-full overflow-hidden">
        {/* Main Content Container */}
        <div ref={containerRef} className="h-screen flex text-sm w-full" style={{ fontSize: '14px', lineHeight: '20px' }}>
          {/* Main Content Area - Draft Panel (Left) */}
        {draftArtifactPanelOpen && (
          <DraftArtifactPanel
            selectedArtifact={selectedArtifact}
            chatOpen={chatOpen}
            onToggleChat={setChatOpen}
            messages={messages}
            inputValue={inputValue}
            onInputValueChange={setInputValue}
            isLoading={isLoading}
            onSendMessage={sendMessage}
            onBackToHome={handleBackToHome}
            chatWidth={chatWidth}
            onChatWidthChange={setChatWidth}
            isResizing={isResizing}
            onResizingChange={setIsResizing}
            onShareThreadDialogOpenChange={setShareThreadDialogOpen}
            isDeepResearchActive={isDeepResearchActive}
            onDeepResearchActiveChange={setIsDeepResearchActive}
            scrollToBottom={scrollToBottom}
            messagesEndRef={messagesEndRef}
            chatContainerRef={chatContainerRef}
          />
        )}

        </div>
      </div>

      {/* Dialogs */}
    <ShareThreadDialog 
      isOpen={shareThreadDialogOpen} 
      onClose={() => setShareThreadDialogOpen(false)} 
    />
    
    <SourcesDrawer 
      isOpen={sourcesDrawerOpen} 
      onClose={() => setSourcesDrawerOpen(false)} 
    />
    </>
  );
}
