import Image from "next/image";
import { useChatRouter } from "./router";

interface HomePageProps {
  onSendMessage: (message: string) => void;
}

export default function HomePage({ onSendMessage }: HomePageProps) {
  const router = useChatRouter();

  return (
    <div className="h-full flex flex-col">
      {/* Home Screen - Harvey Logo (centered, takes remaining space) */}
      <div className="flex-1 flex items-center justify-center">
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

      {/* Suggestion Cards */}
      <div className="px-4 pb-4 overflow-x-hidden bg-white">
        <div className="mx-auto space-y-3" style={{ maxWidth: '832px' }}>
          <button 
            onClick={() => router.navigate({ name: 'playbooks', params: { tab: 'all' } })}
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
    </div>
  );
}
