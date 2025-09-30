import { useState, useEffect } from "react";
import { Search, ChevronDown } from "lucide-react";
import { AnimatedBackground } from "@/components/motion-primitives/animated-background";
import PlaybookLoadingScreen from "./playbook-loading-screen";
import { useChatRouter } from "./router";

interface PlaybookReviewPageProps {
  playbookTitle: string;
  showLoading?: boolean;
}

const SAMPLE_RULES = [
  {
    id: 1,
    category: 'acceptable',
    title: 'Creation and Ownership of Derivatives',
    description: 'The contract is acceptable and meets all required standards...',
  },
  {
    id: 2,
    category: 'acceptable',
    title: 'Creation and Ownership of Derivatives',
    description: 'The contract is acceptable and meets all required standards...',
  },
  {
    id: 3,
    category: 'needs-review',
    title: 'Creation and Ownership of Derivatives',
    description: 'The contract is unacceptable because it lacks any clause addressin...',
  },
  {
    id: 4,
    category: 'needs-review',
    title: 'Creation and Ownership of Derivatives',
    description: 'The contract is unacceptable because it lacks any clause addressin...',
  },
  {
    id: 5,
    category: 'needs-review',
    title: 'Creation and Ownership of Derivatives',
    description: 'The contract is unacceptable because it lacks any clause addressin...',
  },
  {
    id: 6,
    category: 'needs-review',
    title: 'Creation and Ownership of Derivatives',
    description: 'The contract is unacceptable because it lacks any clause addressin...',
  },
  {
    id: 7,
    category: 'not-acceptable',
    title: 'Creation and Ownership of Derivatives',
    description: 'The contract is unacceptable because it lacks any clause addressin...',
  },
  {
    id: 8,
    category: 'not-acceptable',
    title: 'Creation and Ownership of Derivatives',
    description: 'The contract is unacceptable because it lacks any clause addressin...',
  },
  {
    id: 9,
    category: 'not-acceptable',
    title: 'Creation and Ownership of Derivatives',
    description: 'The contract is unacceptable because it lacks any clause addressin...',
  },
  {
    id: 10,
    category: 'not-acceptable',
    title: 'Creation and Ownership of Derivatives',
    description: 'The contract is unacceptable because it lacks any clause addressin...',
  },
];

export default function PlaybookReviewPage({ 
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  playbookTitle, 
  showLoading = false 
}: PlaybookReviewPageProps) {
  const { goBack, navigate, updateCurrentRoute, currentRoute } = useChatRouter();
  const [activeTab, setActiveTab] = useState<'all' | 'redlines' | 'unreviewed'>('all');
  const [search, setSearch] = useState('');
  const [expandedSections, setExpandedSections] = useState<string[]>(['acceptable', 'needs-review', 'not-acceptable']);
  
  // Loading state - only show loading screen when coming from playbooks list
  const [isLoading, setIsLoading] = useState(showLoading);

  const TABS = [
    { id: 'all', label: 'All' },
    { id: 'redlines', label: 'Redlines only' },
    { id: 'unreviewed', label: 'Unreviewed rules' }
  ] as const;

  const toggleSection = (section: string) => {
    setExpandedSections(prev => 
      prev.includes(section) 
        ? prev.filter(s => s !== section)
        : [...prev, section]
    );
  };

  const acceptableRules = SAMPLE_RULES.filter(r => r.category === 'acceptable');
  const needsReviewRules = SAMPLE_RULES.filter(r => r.category === 'needs-review');
  const notAcceptableRules = SAMPLE_RULES.filter(r => r.category === 'not-acceptable');

  // Simulate loading for 12 seconds - only if showLoading is true
  useEffect(() => {
    if (showLoading) {
      setIsLoading(true);
      
      const loadingTimer = setTimeout(() => {
        setIsLoading(false);
        // Clear the showLoading flag from the route to prevent re-showing on back navigation
        if (currentRoute.name === 'playbook-review') {
          updateCurrentRoute({
            name: 'playbook-review',
            params: {
              ...currentRoute.params,
              showLoading: false
            }
          });
        }
      }, 12000); // 12 seconds loading time

      return () => clearTimeout(loadingTimer);
    }
  }, [showLoading, currentRoute, updateCurrentRoute]);

  // Show loading screen
  if (isLoading) {
    return <PlaybookLoadingScreen onCancel={goBack} />;
  }

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Progress Bar Section */}
      <div className="px-4 py-3 border-b border-neutral-200">
        <p className="text-sm text-neutral-500 mb-2">Review completed</p>
        <div className="h-1.5 bg-neutral-200 rounded-full overflow-hidden flex">
          <div 
            className="transition-all duration-300 ease-out" 
            style={{ 
              backgroundColor: '#008100',
              width: `${(acceptableRules.length / (acceptableRules.length + needsReviewRules.length + notAcceptableRules.length)) * 100}%`
            }} 
          />
          <div 
            className="bg-yellow-400 transition-all duration-300 ease-out"
            style={{
              width: `${(needsReviewRules.length / (acceptableRules.length + needsReviewRules.length + notAcceptableRules.length)) * 100}%`
            }}
          />
          <div 
            className="bg-red-500 transition-all duration-300 ease-out"
            style={{
              width: `${(notAcceptableRules.length / (acceptableRules.length + needsReviewRules.length + notAcceptableRules.length)) * 100}%`
            }}
          />
        </div>
      </div>

      {/* Tabs and Search */}
      <div className="p-4 border-b border-neutral-200 space-y-4">
        {/* Segmented Control */}
        <div className="flex flex-row">
          <AnimatedBackground
            defaultValue={activeTab}
            className="rounded-md bg-zinc-100"
            transition={{
              type: "spring",
              bounce: 0.2,
              duration: 0.3
            }}
            onValueChange={(value) => {
              if (value) setActiveTab(value as 'all' | 'redlines' | 'unreviewed');
            }}
          >
            {TABS.map((tab) => (
              <button
                key={tab.id}
                data-id={tab.id}
                type="button"
                className="px-3 py-1.5 text-sm font-medium text-zinc-600 transition-colors duration-300 hover:text-zinc-950"
              >
                {tab.label}
              </button>
            ))}
          </AnimatedBackground>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={18} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search rules"
            className="w-full pl-10 pr-4 py-2 bg-neutral-100 border-none rounded-md text-sm text-neutral-900 placeholder-neutral-500 focus:outline-none focus:ring-1 focus:ring-neutral-300"
          />
        </div>
      </div>

      {/* Rules List */}
      <div className="flex-1 overflow-y-auto relative">
        {/* Needs Review Section */}
        <div className="border-b border-neutral-200">
          <button
            onClick={() => toggleSection('needs-review')}
            className="sticky top-0 z-10 w-full flex items-center justify-between px-4 py-3 bg-neutral-50 hover:bg-neutral-100 transition-colors border-b border-neutral-200"
          >
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-yellow-500" />
              <span className="text-sm font-medium text-neutral-900 leading-5">Needs review</span>
            </div>
            <ChevronDown 
              className={`text-neutral-400 transition-transform ${
                expandedSections.includes('needs-review') ? 'rotate-180' : ''
              }`} 
              size={14} 
            />
          </button>
          
          {expandedSections.includes('needs-review') && (
            <div>
              {needsReviewRules.map((rule) => (
                <div key={rule.id} className="p-1">
                  <button 
                    onClick={() => navigate({ 
                      name: 'playbook-rule-detail', 
                      params: { ruleId: rule.id, ruleTitle: rule.title } 
                    })}
                    className="w-full text-left px-3 py-2 hover:bg-neutral-100 rounded-md transition-colors"
                  >
                    <h4 className="text-sm font-medium text-neutral-900 mb-1">
                      {rule.title}
                    </h4>
                    <p className="text-xs text-neutral-500">
                      {rule.description}
                    </p>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Not Acceptable Section */}
        <div className="border-b border-neutral-200">
          <button
            onClick={() => toggleSection('not-acceptable')}
            className="sticky top-0 z-10 w-full flex items-center justify-between px-4 py-3 bg-neutral-50 hover:bg-neutral-100 transition-colors border-b border-neutral-200"
          >
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-red-500" />
              <span className="text-sm font-medium text-neutral-900 leading-5">Not acceptable</span>
            </div>
            <ChevronDown 
              className={`text-neutral-400 transition-transform ${
                expandedSections.includes('not-acceptable') ? 'rotate-180' : ''
              }`} 
              size={14} 
            />
          </button>
          
          {expandedSections.includes('not-acceptable') && (
            <div>
              {notAcceptableRules.map((rule) => (
                <div key={rule.id} className="p-1">
                  <button 
                    onClick={() => navigate({ 
                      name: 'playbook-rule-detail', 
                      params: { ruleId: rule.id, ruleTitle: rule.title } 
                    })}
                    className="w-full text-left px-3 py-2 hover:bg-neutral-100 rounded-md transition-colors"
                  >
                    <h4 className="text-sm font-medium text-neutral-900 mb-1">
                      {rule.title}
                    </h4>
                    <p className="text-xs text-neutral-500">
                      {rule.description}
                    </p>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Acceptable Section */}
        <div className="border-b border-neutral-200">
          <button
            onClick={() => toggleSection('acceptable')}
            className="sticky top-0 z-10 w-full flex items-center justify-between px-4 py-3 bg-neutral-50 hover:bg-neutral-100 transition-colors border-b border-neutral-200"
          >
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#008100' }} />
              <span className="text-sm font-medium text-neutral-900 leading-5">Acceptable</span>
            </div>
            <ChevronDown 
              className={`text-neutral-400 transition-transform ${
                expandedSections.includes('acceptable') ? 'rotate-180' : ''
              }`} 
              size={14} 
            />
          </button>
          
          {expandedSections.includes('acceptable') && (
            <div>
              {acceptableRules.map((rule) => (
                <div key={rule.id} className="p-1">
                  <button 
                    onClick={() => navigate({ 
                      name: 'playbook-rule-detail', 
                      params: { ruleId: rule.id, ruleTitle: rule.title } 
                    })}
                    className="w-full text-left px-3 py-2 hover:bg-neutral-100 rounded-md transition-colors"
                  >
                    <h4 className="text-sm font-medium text-neutral-900 mb-1">
                      {rule.title}
                    </h4>
                    <p className="text-xs text-neutral-500">
                      {rule.description}
                    </p>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
