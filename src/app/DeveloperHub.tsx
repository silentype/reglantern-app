import { useState, memo, useCallback } from 'react';
import { ArrowLeft, BookOpen, Palette } from 'lucide-react';
import DeveloperManual from './DeveloperManual';
import AccurateComponentShowcase from './AccurateComponentShowcase';

const TabButton = memo(({ active, icon: Icon, label, onClick }: {
  active: boolean;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  onClick: () => void;
}) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all ${
      active
        ? 'bg-[#fc6] text-[#18181b] font-medium shadow-sm'
        : 'text-[#a1a1aa] hover:text-white'
    }`}
  >
    <Icon className="w-4 h-4" />
    <span className="text-sm">{label}</span>
  </button>
));
TabButton.displayName = 'TabButton';

export default function DeveloperHub({ onClose }: { onClose: () => void }) {
  const [activeTab, setActiveTab] = useState<'components' | 'manual'>('components');
  
  // Track active sections for each tab
  const [componentsActiveSection, setComponentsActiveSection] = useState('buttons');
  const [manualActiveSection, setManualActiveSection] = useState('getting-started');
  const [manualActiveSub, setManualActiveSub] = useState('overview');

  const handleTabChange = useCallback((tab: 'components' | 'manual') => {
    setActiveTab(tab);
  }, []);

  return (
    <div className="fixed inset-0 bg-white z-50 flex flex-col">
      {/* Header */}
      <div className="h-16 bg-[#32383e] flex items-center justify-between px-6 shrink-0">
        <div className="flex items-center gap-4">
          <button
            onClick={onClose}
            className="flex items-center gap-2 text-[#fc6] hover:text-[#ffcc88] transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Back to App</span>
          </button>
          <div className="h-8 w-px bg-[#47515B]" />
          <span className="text-white font-semibold">Developer Hub</span>
        </div>

        {/* Tab Buttons */}
        <div className="flex items-center gap-2 bg-[#404950] rounded-lg p-1">
          <TabButton
            active={activeTab === 'components'}
            icon={Palette}
            label="Components"
            onClick={() => handleTabChange('components')}
          />
          <TabButton
            active={activeTab === 'manual'}
            icon={BookOpen}
            label="Dev Manual"
            onClick={() => handleTabChange('manual')}
          />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        {activeTab === 'components' ? (
          <div className="h-full">
            <AccurateComponentShowcase 
              onBack={onClose} 
              hideHeader 
              initialActiveSection={componentsActiveSection}
              onSectionChange={setComponentsActiveSection}
            />
          </div>
        ) : (
          <div className="h-full">
            <DeveloperManual 
              onClose={onClose} 
              hideHeader 
              initialActiveSection={manualActiveSection}
              initialActiveSub={manualActiveSub}
              onSectionChange={setManualActiveSection}
              onSubChange={setManualActiveSub}
            />
          </div>
        )}
      </div>
    </div>
  );
}