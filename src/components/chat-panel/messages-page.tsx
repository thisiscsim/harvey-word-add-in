import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import ThinkingState from "@/components/thinking-state";
import ArtifactCard from "@/components/artifact-card";

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

interface MessagesPageProps {
  messages: Message[];
  selectedArtifact: { title: string; subtitle: string } | null;
  scrollToBottom: () => void;
  messagesEndRef: React.RefObject<HTMLDivElement | null>;
  chatContainerRef: React.RefObject<HTMLDivElement | null>;
}

export default function MessagesPage({
  messages,
  selectedArtifact,
  scrollToBottom,
  messagesEndRef,
  chatContainerRef
}: MessagesPageProps) {
  return (
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
  );
}
