'use client';

import React, { useEffect, useState, useRef } from 'react';
import { TextShimmer } from '@/components/motion-primitives/text-shimmer';
import { Button } from '@/components/ui/button';

type DocumentLine = {
  id: string;
  type: 'text' | 'redline' | 'space' | 'blue';
  width: number;
  segments: [number, number][] | null;
};

// Generate a pattern of document lines with redlines and segments
const generateDocumentLines = (): DocumentLine[] => {
  const lines: DocumentLine[] = [];
  const patterns = [
    // Pattern 1: Regular paragraph
    { type: 'text', widths: [85, 90, 88, 75] },
    // Pattern 2: Line with small segments
    { type: 'text', segments: [[0, 15], [18, 25], [30, 45]] },
    // Pattern 3: Short paragraph with redline
    { type: 'text', widths: [80, 45] },
    { type: 'redline', widths: [65] },
    // Pattern 4: Mixed content with many small segments
    { type: 'text', segments: [[0, 12], [15, 28], [32, 55], [58, 68], [72, 85]] },
    { type: 'redline', widths: [70, 75] },
    // Pattern 5: Blue highlight (minimal)
    { type: 'blue', segments: [[0, 8], [12, 18]] },
    { type: 'text', widths: [88, 82] },
    // Pattern 6: Multi-segment line with tiny pieces
    { type: 'text', segments: [[0, 10], [14, 22], [26, 35], [40, 50], [55, 90]] },
    // Pattern 7: Heavy redlines
    { type: 'redline', widths: [80, 85, 78] },
    { type: 'text', segments: [[0, 25], [28, 35], [38, 65]] },
    { type: 'redline', segments: [[0, 18], [22, 40], [45, 55]] },
    // Pattern 8: Small segments with blue
    { type: 'text', segments: [[0, 20], [25, 32], [36, 50]] },
    { type: 'blue', segments: [[0, 10]] },
    // Pattern 9: More redline segments
    { type: 'redline', segments: [[0, 15], [20, 35], [40, 60]] },
    { type: 'text', widths: [88, 92, 85, 78, 50] },
    // Pattern 10: Tiny segmented pieces
    { type: 'text', segments: [[0, 8], [12, 20], [24, 30], [35, 42], [46, 55], [60, 70]] },
    { type: 'redline', segments: [[0, 20], [25, 40]] },
    { type: 'text', widths: [85, 80, 70] },
  ];

  // Repeat the pattern multiple times to create a long document
  for (let i = 0; i < 5; i++) {
    patterns.forEach((pattern, patternIndex) => {
      if (pattern.widths) {
        // Single continuous line
        pattern.widths.forEach((width, lineIndex) => {
          lines.push({
            id: `${i}-${patternIndex}-${lineIndex}`,
            type: pattern.type as 'text' | 'redline',
            width: width + (Math.random() * 10 - 5), // Add some variation
            segments: null,
          });
        });
      } else if (pattern.segments) {
        // Line with multiple segments
        lines.push({
          id: `${i}-${patternIndex}`,
          type: pattern.type as 'text' | 'redline',
          width: 0,
          segments: pattern.segments as [number, number][],
        });
      }
    });
    // Add spacing between sections
    lines.push({ id: `space-${i}`, type: 'space', width: 0, segments: null });
  }

  return lines;
};

interface PlaybookLoadingScreenProps {
  onCancel?: () => void;
}

export default function PlaybookLoadingScreen({ onCancel }: PlaybookLoadingScreenProps) {
  const [scrollPosition, setScrollPosition] = useState(0);
  const [documentLines] = useState(generateDocumentLines());
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [rulesProcessed, setRulesProcessed] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const lineHeight = 28; // Height between lines (increased for thicker lines)
  const visibleHeight = 320; // Height of visible area (reduced from 400)
  const triggerPoint = visibleHeight * 0.66; // 2/3rds of container
  const initialDelay = 300; // Start scrolling after first 2-3 lines appear (300ms)
  const totalRules = 10; // Matches SAMPLE_RULES count in playbook-review-page

  // Calculate total document height
  const totalHeight = documentLines.length * lineHeight;

  // Handle time progression and scrolling
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeElapsed(prev => prev + 16);
      
      // Start scrolling after initial delay
      if (timeElapsed > initialDelay) {
        setScrollPosition(prevPosition => {
          const maxScroll = totalHeight - visibleHeight;
          // Scroll continuously and loop back (increased speed)
          return (prevPosition + 1) % (maxScroll);
        });
      }
    }, 16); // Smooth 60fps

    return () => clearInterval(timer);
  }, [totalHeight, visibleHeight, timeElapsed]);

  // Handle rule counter progression with randomization
  useEffect(() => {
    // Total loading time is 12 seconds (from playbook-review-page)
    const totalLoadingTime = 12000;
    const averageInterval = totalLoadingTime / totalRules;
    
    let currentCount = 0;
    
    const incrementRule = () => {
      if (currentCount >= totalRules) return;
      
      currentCount++;
      setRulesProcessed(currentCount);
      
      if (currentCount < totalRules) {
        // Add randomization: ±30% of average interval
        const randomFactor = 0.7 + Math.random() * 0.6;
        const nextInterval = averageInterval * randomFactor;
        
        setTimeout(incrementRule, nextInterval);
      }
    };
    
    // Start with a small delay
    setTimeout(incrementRule, 500);

    return () => {
      // Cleanup if component unmounts
      currentCount = totalRules;
    };
  }, [totalRules]);

  return (
    <div
      className='flex flex-col items-center justify-center py-8 bg-white h-full'
      style={{ paddingLeft: '40px', paddingRight: '40px' }}
    >
      {/* Status text with shimmer and rule counter */}
      <div className='flex flex-col items-center space-y-2 mb-3'>
        <TextShimmer
          as="span"
          className="font-medium text-sm"
          duration={2}
          spread={4}
        >
          Running playbook against this document...
        </TextShimmer>
        <p className="text-neutral-500 text-sm">
          {rulesProcessed} of {totalRules} rules
        </p>
      </div>

      {/* Document container */}
      <div className='relative w-full max-w-[280px] space-y-2'>
        <div
          ref={containerRef}
          className='relative overflow-hidden bg-white rounded-md border border-neutral-100'
          style={{
            height: `${visibleHeight}px`,
          }}
        >
          {/* Document title - fixed at top */}
          <div className='absolute top-0 left-0 right-0 bg-white z-30'>
            <h3 className='text-[10px] font-medium text-neutral-500 text-center py-2'>
              Motor Vehicle Lease Agreement
            </h3>
          </div>
          
          {/* Document content */}
          <div
            className="pt-12 px-8 pb-8"
            style={{
              transform: `translateY(${-scrollPosition}px)`,
            }}
          >
            {documentLines.map((line, index) => {
              if (line.type === 'space') {
                return <div key={line.id} style={{ height: lineHeight }} />;
              }
              
              // Calculate line position and visibility
              const linePosition = index * (lineHeight + 4) - scrollPosition;
              
              // Lines appear sequentially from top during initial phase
              const lineAppearTime = index * 50; // Each line appears 50ms after the previous
              const hasAppeared = timeElapsed > lineAppearTime;
              
              // During initial delay, show lines based on time; after delay, use scroll position
              // Once a line has passed the trigger point, it stays visible
              const hasEverBeenTriggered = timeElapsed <= initialDelay 
                ? hasAppeared && linePosition <= visibleHeight
                : hasAppeared && (linePosition <= triggerPoint || scrollPosition > index * (lineHeight + 4) - triggerPoint);
              
              return (
                <div
                  key={line.id}
                  className="relative"
                  style={{ 
                    height: lineHeight,
                    marginBottom: '4px',
                  }}
                >
                  {line.segments ? (
                    // Render multiple segments with gaps
                    line.segments.map((segment: [number, number], segIndex: number) => (
                      <div
                        key={`${line.id}-seg-${segIndex}`}
                        className={`absolute top-1/2 rounded-full origin-left transition-transform duration-700 ease-out ${
                          line.type === 'redline' 
                            ? 'bg-red-300' 
                            : line.type === 'blue'
                            ? '' 
                            : 'bg-neutral-300'
                        }`}
                        style={{
                          height: '10px',
                          left: `${segment[0]}%`,
                          width: `${segment[1] - segment[0]}%`,
                          transform: `translateY(-50%) scaleX(${hasEverBeenTriggered ? 1 : 0})`,
                          backgroundColor: line.type === 'blue' ? '#65A3C7' : undefined,
                        }}
                      />
                    ))
                  ) : (
                    // Render single continuous line
                    <div
                      className={`absolute top-1/2 left-0 rounded-full origin-left transition-transform duration-700 ease-out ${
                        line.type === 'redline' 
                          ? 'bg-red-300' 
                          : line.type === 'blue'
                          ? '' 
                          : 'bg-neutral-300'
                      }`}
                      style={{
                        height: '10px',
                        width: `${line.width}%`,
                        transform: `translateY(-50%) scaleX(${hasEverBeenTriggered ? 1 : 0})`,
                        backgroundColor: line.type === 'blue' ? '#65A3C7' : undefined,
                      }}
                    />
                  )}
                </div>
              );
            })}
          </div>
          
          {/* Top gradient overlay - positioned to fade content, not title */}
          <div
            className='absolute left-0 right-0 pointer-events-none'
            style={{
              top: '32px', // Adjusted for smaller title
              height: '60px',
              background: 'linear-gradient(to bottom, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.7) 30%, rgba(255, 255, 255, 0) 100%)',
              zIndex: 25,
            }}
          />

          {/* Bottom gradient overlay - inside container */}
          <div
            className='absolute bottom-0 left-0 right-0 pointer-events-none'
            style={{
              height: '60px',
              background: 'linear-gradient(to top, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.7) 30%, rgba(255, 255, 255, 0) 100%)',
              zIndex: 20,
            }}
          />
        </div>
        
        {/* Cancel button */}
        <div className='flex justify-center'>
          <Button
            variant="ghost"
            onClick={onCancel}
          >
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
}
