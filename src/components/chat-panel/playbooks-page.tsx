import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { useChatRouter } from "./router";
import { AnimatedBackground } from "@/components/motion-primitives/animated-background";

const SAMPLE_PLAYBOOKS = [
  {
    id: 1,
    title: 'MSA Playbook (Harvey Example)',
    rulesCount: 7,
    modifiedTime: '2 hours ago',
    type: 'harvey' as const
  },
  {
    id: 2,
    title: 'NDA Playbook (Harvey Example)',
    rulesCount: 18,
    modifiedTime: '2 hours ago',
    type: 'harvey' as const
  },
  {
    id: 3,
    title: 'Sample Playbook (Harvey Example)',
    rulesCount: 16,
    modifiedTime: '2 hours ago',
    type: 'harvey' as const
  },
  {
    id: 4,
    title: 'Commercial Contracts Playbook',
    rulesCount: 20,
    modifiedTime: '2 hours ago',
    type: 'private' as const
  }
];

interface PlaybooksPageProps {
  onSendMessage: (message: string) => void;
}

export default function PlaybooksPage({ onSendMessage }: PlaybooksPageProps) {
  const router = useChatRouter();
  const [activeTab, setActiveTab] = useState<'all' | 'private' | 'shared' | 'harvey'>('all');
  const [search, setSearch] = useState('');

  // Initialize tab from route params
  useEffect(() => {
    if (router.currentRoute.name === 'playbooks' && router.currentRoute.params?.tab) {
      setActiveTab(router.currentRoute.params.tab);
    }
  }, [router.currentRoute]);

  const handlePlaybookSelect = (playbook: typeof SAMPLE_PLAYBOOKS[0]) => {
    router.navigate({ 
      name: 'playbook-review', 
      params: { 
        playbookId: playbook.id, 
        playbookTitle: playbook.title,
        showLoading: true
      } 
    });
  };

  const filteredPlaybooks = SAMPLE_PLAYBOOKS
    .filter(playbook => 
      (activeTab === 'all' || playbook.type === activeTab) &&
      playbook.title.toLowerCase().includes(search.toLowerCase())
    );

  const TABS = [
    { id: 'all', label: 'All' },
    { id: 'private', label: 'Private' },
    { id: 'shared', label: 'Shared' },
    { id: 'harvey', label: 'Harvey' }
  ] as const;

  return (
    <div className="h-full flex flex-col bg-white">
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
              if (value) setActiveTab(value as 'all' | 'private' | 'shared' | 'harvey');
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
            placeholder="Search"
            className="w-full pl-10 pr-4 py-2 bg-neutral-100 border-none rounded-md text-sm text-neutral-900 placeholder-neutral-500 focus:outline-none focus:ring-1 focus:ring-neutral-300"
          />
        </div>
      </div>

      {/* Playbooks List */}
      <div className="flex-1 overflow-y-auto">
        {filteredPlaybooks.map((playbook) => (
          <div key={playbook.id} className="p-1">
            <button
              className="w-full text-left px-3 py-2 hover:bg-neutral-100 rounded-md transition-colors"
              onClick={() => handlePlaybookSelect(playbook)}
            >
              <h3 className="text-sm font-medium text-neutral-900 mb-1">
                {playbook.title}
              </h3>
              <p className="text-xs text-neutral-500">
                {playbook.rulesCount} rules · Modified {playbook.modifiedTime}
              </p>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
