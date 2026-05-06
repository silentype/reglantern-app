import { useState, useEffect } from 'react';
import { Button } from './components/ui/button';
import { CodeBlock } from './components/CodeBlock';
import { accurateCodeSnippets } from './constants/accurateCodeSnippets';
import { SaveIndicator } from './components/SaveIndicator';
import { Card, CardContent } from './components/ui/card';
import { toast } from 'sonner';
import { 
  X, 
  Upload,
  User, 
  Building2,
  Calendar as CalendarIcon, 
  AlertCircle,
  ChevronDown,
  MoreHorizontal,
  ChevronsUpDown,
  Check,
  ChevronUp,
  ArrowLeft,
  Menu,
  ChevronRight,
  Mouse,
  Layers,
  CheckCircle,
  Palette as PaletteIcon
} from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from './components/ui/popover';
import { Command, CommandGroup, CommandItem, CommandList } from './components/ui/command';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './components/ui/dropdown-menu';
import svgPaths from '../imports/svg-xpk29wrq0q';

interface ComponentShowcaseProps {
  onBack?: () => void;
  hideHeader?: boolean;
  initialActiveSection?: string;
  onSectionChange?: (section: string) => void;
}

interface Section {
  id: string;
  title: string;
  icon: any;
  subsections: string[];
}

export default function ComponentShowcase({ 
  onBack, 
  hideHeader = false, 
  initialActiveSection = 'buttons',
  onSectionChange 
}: ComponentShowcaseProps) {
  // State management
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
  const [activeSection, setActiveSection] = useState(initialActiveSection);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [statusOpen, setStatusOpen] = useState(false);
  const [currentStatus, setCurrentStatus] = useState('In Progress');
  const [progress, setProgress] = useState(65);
  const [isUploading, setIsUploading] = useState(false);
  
  // Filter chips state
  const [activeFilter, setActiveFilter] = useState('all');
  const [selectedUsers, setSelectedUsers] = useState<string[]>(['tim']);
  const [selectedCenters, setSelectedCenters] = useState<string[]>([]);
  
  // Multi-select filter dropdown state
  const [multiSelectOpen, setMultiSelectOpen] = useState(false);
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>(['In Progress', 'Not Started']);
  const statusOptions = ['In Progress', 'Complete', 'Blocked', 'Not Started'];
  
  // Checkbox states
  const [checkbox1, setCheckbox1] = useState(false);
  const [checkbox2, setCheckbox2] = useState(true);
  const [checkbox3, setCheckbox3] = useState(false);
  
  // Tab state
  const [activeTab, setActiveTab] = useState('details');
  
  // Dropdown state
  const [dropdownExpanded, setDropdownExpanded] = useState(false);

  const triggerSaveSequence = () => {
    setSaveStatus('saving');
    setTimeout(() => {
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 2000);
    }, 1000);
  };

  const simulateUpload = () => {
    setIsUploading(true);
    setProgress(0);
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          toast.success('Upload complete!');
          return 100;
        }
        return prev + 10;
      });
    }, 300);
  };

  const sections: Section[] = [
    {
      id: 'form-controls',
      title: 'Interactive Elements',
      icon: Mouse,
      subsections: ['buttons', 'filter-chips', 'status-selects', 'checkboxes']
    },
    {
      id: 'data-display',
      title: 'Data Display',
      icon: Layers,
      subsections: ['avatars', 'badges', 'save-indicator', 'progress-bars']
    },
    {
      id: 'layout',
      title: 'Layout Components',
      icon: CheckCircle,
      subsections: ['tabs', 'dropdowns', 'menus']
    },
    {
      id: 'task-components',
      title: 'Task Row Components',
      icon: CheckCircle,
      subsections: ['task-atoms', 'task-row', 'column-header']
    }
  ];

  const scrollToSection = (sectionId: string) => {
    setActiveSection(sectionId);
    if (onSectionChange) {
      onSectionChange(sectionId);
    }
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const getSectionName = (id: string): string => {
    const names: Record<string, string> = {
      'buttons': 'Buttons',
      'filter-chips': 'Filter Chips & Tags',
      'status-selects': 'Status Selects',
      'checkboxes': 'Checkboxes',
      'avatars': 'Avatars',
      'badges': 'Badges & Alerts',
      'save-indicator': 'Save Indicator',
      'progress-bars': 'Progress Bars',
      'tabs': 'Tabs',
      'dropdowns': 'Dropdowns',
      'menus': 'Context Menus',
      'task-atoms': 'Task Atoms',
      'task-row': 'Task Row (Molecule)',
      'column-header': 'Column Header Sort'
    };
    return names[id] || id;
  };

  return (
    <div className="h-full flex flex-col bg-[#f9fafb]">
      {/* Header (hidden when in DeveloperHub) */}
      {!hideHeader && (
        <header className="bg-[#32383e] h-[80px] flex items-center justify-between px-8 shrink-0">
          <div>
            <h1 className="text-2xl font-semibold text-white">Reglantern Component Library</h1>
            <p className="text-sm text-[#9ca3af]">Accurate components from your application</p>
          </div>
          <div className="flex gap-3">
            <Button 
              variant="outline" 
              className="bg-white hover:bg-[#f5f5f5]"
              onClick={onBack}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to App
            </Button>
          </div>
        </header>
      )}

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <div
          className={`${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          } lg:translate-x-0 fixed lg:relative inset-y-0 left-0 w-72 bg-white border-r border-[#e4e4e7] flex flex-col z-40 transition-transform duration-300`}
          style={hideHeader ? {} : { top: '80px' }}
        >
          {/* Mobile Toggle */}
          <div className="lg:hidden flex items-center justify-between p-4 border-b border-[#e4e4e7]">
            <span className="font-semibold text-[#18181b]">Components</span>
            <button
              onClick={() => setSidebarOpen(false)}
              className="p-2 hover:bg-[#f4f4f5] rounded"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation */}
          <div className="flex-1 overflow-y-auto px-4 py-6">
            {sections.map((section) => (
              <div key={section.id} className="mb-6">
                <div className="flex items-center gap-2 mb-2 px-2">
                  <section.icon className="w-4 h-4 text-[#71717a]" />
                  <h3 className="font-semibold text-[#18181b] text-xs uppercase tracking-wide">
                    {section.title}
                  </h3>
                </div>
                <div className="space-y-1">
                  {section.subsections.map((sub) => (
                    <button
                      key={sub}
                      onClick={() => {
                        scrollToSection(sub);
                        if (window.innerWidth < 1024) {
                          setSidebarOpen(false);
                        }
                      }}
                      className={`w-full text-left px-3 py-2 rounded-lg transition-colors flex items-center gap-2 text-sm ${
                        activeSection === sub
                          ? 'bg-[#fc6] text-[#18181b] font-medium'
                          : 'text-[#71717a] hover:bg-[#f9fafb] hover:text-[#18181b]'
                      }`}
                    >
                      <ChevronRight
                        className={`w-4 h-4 shrink-0 ${
                          activeSection === sub ? 'opacity-100' : 'opacity-0'
                        }`}
                      />
                      <span>{getSectionName(sub)}</span>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Mobile menu toggle button */}
        <button
          onClick={() => setSidebarOpen(true)}
          className={`${
            sidebarOpen ? 'hidden' : 'flex'
          } lg:hidden fixed bottom-6 right-6 z-30 items-center gap-2 px-4 py-3 bg-[#fc6] text-[#18181b] rounded-full shadow-lg font-medium`}
        >
          <Menu className="w-5 h-5" />
          Menu
        </button>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-[1200px] mx-auto p-8">
            
            {/* Introduction Banner */}
            <div className="mb-8 p-6 bg-gradient-to-r from-[#fc6]/10 to-[#fc6]/5 border-l-4 border-[#fc6] rounded-r-lg">
              <h2 className="text-xl font-bold text-[#18181b] mb-2">Components</h2>
              <p className="text-[#71717a] mb-3">These are the exact components and patterns used in the Reglantern application. All components are fully interactive - click, hover, and interact to see different states.</p>
              
            </div>

            {/* Buttons Section */}
            <section id="buttons" className="mb-12 scroll-mt-8">
              <h2 className="text-2xl font-bold text-[#18181b] mb-6">Buttons</h2>
              <Card>
                <CardContent className="p-6">
                  <div className="space-y-6">
                    {/* Primary Button */}
                    <div>
                      <h3 className="text-sm font-medium text-[#71717a] mb-3">Primary Action Button (Yellow Brand)</h3>
                      <p className="text-xs text-[#71717a] mb-3">Click to see toast notification</p>
                      <div className="flex flex-wrap gap-3 mb-4">
                        <button 
                          onClick={() => toast.success('Button clicked!')}
                          className="bg-[#fc6] flex gap-2 h-10 items-center px-4 py-2 rounded-md shadow-[0px_1px_3px_0px_rgba(0,0,0,0.05)] hover:bg-[#ffcc77] transition-colors active:scale-95"
                        >
                          <span className="font-medium text-[#18181b] text-sm">Add a Task</span>
                        </button>
                        <button 
                          onClick={() => toast.info('Upload clicked!')}
                          className="bg-[#fc6] flex gap-2 h-10 items-center px-4 py-2 rounded-md shadow-[0px_1px_3px_0px_rgba(0,0,0,0.05)] hover:bg-[#ffcc77] transition-colors active:scale-95"
                        >
                          <span className="font-medium text-[#18181b] text-sm">Upload</span>
                          <Upload className="w-4 h-4 text-[#18181b]" />
                        </button>
                        <button 
                          disabled
                          className="bg-[#fc6] flex gap-2 h-10 items-center px-4 py-2 rounded-md shadow-[0px_1px_3px_0px_rgba(0,0,0,0.05)] opacity-50 cursor-not-allowed"
                        >
                          <span className="font-medium text-[#18181b] text-sm">Disabled</span>
                        </button>
                      </div>
                      <CodeBlock code={accurateCodeSnippets.primaryButton} />
                    </div>

                    {/* Secondary Button */}
                    <div>
                      <h3 className="text-sm font-medium text-[#71717a] mb-3">Secondary Button (White/Border)</h3>
                      <div className="flex flex-wrap gap-3 mb-4">
                        <button 
                          onClick={() => toast.info('Browse Files clicked')}
                          className="bg-white border border-[#cdd7e1] px-4 py-2 rounded-md text-sm font-medium text-[#18181b] hover:bg-[#f9fafb] transition-colors active:scale-95"
                        >
                          Browse Files
                        </button>
                        <button 
                          onClick={() => toast.info('Cancel clicked')}
                          className="bg-white border border-[#cdd7e1] px-4 py-2 rounded-md text-sm font-medium text-[#18181b] hover:bg-[#f9fafb] transition-colors active:scale-95"
                        >
                          Cancel
                        </button>
                        <button 
                          disabled
                          className="bg-white border border-[#cdd7e1] px-4 py-2 rounded-md text-sm font-medium text-[#18181b] opacity-50 cursor-not-allowed"
                        >
                          Disabled
                        </button>
                      </div>
                      <CodeBlock code={accurateCodeSnippets.secondaryButton} />
                    </div>

                    {/* UI Component Buttons */}
                    <div>
                      <h3 className="text-sm font-medium text-[#71717a] mb-3">Button Component (from UI library)</h3>
                      <div className="flex flex-wrap gap-3 mb-4">
                        <Button onClick={() => toast.info('Default clicked')}>Default</Button>
                        <Button variant="outline" onClick={() => toast.info('Outline clicked')}>Outline</Button>
                        <Button variant="ghost" onClick={() => toast.info('Ghost clicked')}>Ghost</Button>
                        <Button variant="destructive" onClick={() => toast.error('Delete clicked')}>Delete</Button>
                        <Button disabled>Disabled</Button>
                      </div>
                      <CodeBlock code={accurateCodeSnippets.uiButton} />
                    </div>

                    {/* Navigation Buttons */}
                    <div>
                      <h3 className="text-sm font-medium text-[#71717a] mb-3">Navigation Buttons (Back/Next)</h3>
                      <p className="text-xs text-[#71717a] mb-3">Interactive navigation pattern</p>
                      <div className="flex items-center justify-between mb-4 max-w-md">
                        <Button 
                          variant="outline"
                          onClick={() => toast.info('Back clicked')}
                        >
                          Back
                        </Button>
                        <span className="text-sm text-[#71717a]">1 of 5</span>
                        <Button
                          onClick={() => toast.info('Next clicked')}
                        >
                          Next
                        </Button>
                      </div>
                      <CodeBlock code={accurateCodeSnippets.navigationButtons} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* Filter Chips Section */}
            <section id="filter-chips" className="mb-12 scroll-mt-8">
              <h2 className="text-2xl font-bold text-[#18181b] mb-6">Filter Chips & Tags</h2>
              <Card>
                <CardContent className="p-6">
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-sm font-medium text-[#71717a] mb-3">Filter Chips (Click to toggle)</h3>
                      <div className="flex flex-wrap gap-2 mb-4">
                        <button 
                          onClick={() => setActiveFilter('all')}
                          className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                            activeFilter === 'all' 
                              ? 'bg-[#fc6] text-[#18181b]' 
                              : 'bg-[#f5f5f5] text-[#18181b] hover:bg-[#e5e5e5]'
                          }`}
                        >
                          All Tasks
                        </button>
                        <button 
                          onClick={() => setActiveFilter('incomplete')}
                          className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                            activeFilter === 'incomplete' 
                              ? 'bg-[#fc6] text-[#18181b]' 
                              : 'bg-[#f5f5f5] text-[#18181b] hover:bg-[#e5e5e5]'
                          }`}
                        >
                          Incomplete
                        </button>
                        <button 
                          onClick={() => setActiveFilter('complete')}
                          className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                            activeFilter === 'complete' 
                              ? 'bg-[#fc6] text-[#18181b]' 
                              : 'bg-[#f5f5f5] text-[#18181b] hover:bg-[#e5e5e5]'
                          }`}
                        >
                          Complete
                        </button>
                      </div>
                      <div className="text-xs text-[#71717a] mb-4">
                        Active filter: <span className="font-medium text-[#18181b]">{activeFilter}</span>
                      </div>
                      <CodeBlock code={accurateCodeSnippets.filterChipActive} />
                    </div>

                    <div>
                      <h3 className="text-sm font-medium text-[#71717a] mb-3">With Icons (Click to toggle)</h3>
                      <div className="flex flex-wrap gap-2 mb-4">
                        <button 
                          onClick={() => {
                            setSelectedUsers(prev => 
                              prev.includes('tim') 
                                ? prev.filter(u => u !== 'tim')
                                : [...prev, 'tim']
                            );
                          }}
                          className={`px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1.5 transition-colors ${
                            selectedUsers.includes('tim')
                              ? 'bg-[#fc6] text-[#18181b]'
                              : 'bg-[#f5f5f5] text-[#18181b] hover:bg-[#e5e5e5]'
                          }`}
                        >
                          <User className="w-3 h-3" />
                          Tim Freeman
                        </button>
                        <button 
                          onClick={() => {
                            setSelectedCenters(prev => 
                              prev.includes('mv') 
                                ? prev.filter(c => c !== 'mv')
                                : [...prev, 'mv']
                            );
                          }}
                          className={`px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1.5 transition-colors ${
                            selectedCenters.includes('mv')
                              ? 'bg-[#fc6] text-[#18181b]'
                              : 'bg-[#f5f5f5] text-[#18181b] hover:bg-[#e5e5e5]'
                          }`}
                        >
                          <Building2 className="w-3 h-3" />
                          Mountain View
                        </button>
                      </div>
                      <div className="text-xs text-[#71717a] mb-4">
                        Selected: {[
                          ...(selectedUsers.includes('tim') ? ['Tim Freeman'] : []),
                          ...(selectedCenters.includes('mv') ? ['Mountain View'] : [])
                        ].join(', ') || 'None'}
                      </div>
                      <CodeBlock code={accurateCodeSnippets.filterChipWithIcon} />
                    </div>

                    <div>
                      <h3 className="text-sm font-medium text-[#71717a] mb-3">Removable Tags (Click X to remove)</h3>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {selectedUsers.includes('tim') && (
                          <div className="bg-[#f5f5f5] px-3 py-1.5 rounded-full text-sm flex items-center gap-1.5">
                            <div className="bg-[#fc6] w-5 h-5 rounded-full flex items-center justify-center">
                              <span className="text-xs font-medium text-[#18181b]">TF</span>
                            </div>
                            <span className="text-sm text-[#18181b]">Tim Freeman</span>
                            <button 
                              onClick={() => setSelectedUsers(prev => prev.filter(u => u !== 'tim'))}
                              className="ml-1 hover:bg-[#e5e5e5] rounded-full p-0.5 transition-colors"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        )}
                        {selectedCenters.includes('mv') && (
                          <div className="bg-[#f5f5f5] px-3 py-1.5 rounded-full text-sm flex items-center gap-1.5">
                            <div className="bg-blue-100 w-5 h-5 rounded-full flex items-center justify-center">
                              <span className="text-xs font-medium text-blue-700">MV</span>
                            </div>
                            <span className="text-sm text-[#18181b]">Mountain View</span>
                            <button 
                              onClick={() => setSelectedCenters(prev => prev.filter(c => c !== 'mv'))}
                              className="ml-1 hover:bg-[#e5e5e5] rounded-full p-0.5 transition-colors"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        )}
                        {selectedUsers.length === 0 && selectedCenters.length === 0 && (
                          <p className="text-xs text-[#71717a] italic">Click filters above to add tags</p>
                        )}
                      </div>
                      <CodeBlock code={accurateCodeSnippets.removableTag} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* Status Selects */}
            <section id="status-selects" className="mb-12 scroll-mt-8">
              <h2 className="text-2xl font-bold text-[#18181b] mb-6">Status Selects</h2>
              <Card>
                <CardContent className="p-6">
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-sm font-medium text-[#71717a] mb-3">Command-based Select (Click to open)</h3>
                      <div className="mb-4">
                        <Popover open={statusOpen} onOpenChange={setStatusOpen}>
                          <PopoverTrigger asChild>
                            <button className="bg-white border border-[#e4e4e7] rounded-md px-3 py-2 text-sm focus:outline-none focus:border-[#fc6] w-[200px] flex items-center justify-between hover:bg-[#f9fafb] transition-colors">
                              <span className="text-[#18181b]">{currentStatus}</span>
                              <ChevronsUpDown className="h-4 w-4 opacity-50" />
                            </button>
                          </PopoverTrigger>
                          <PopoverContent className="w-[200px] p-0" align="start">
                            <Command>
                              <CommandList>
                                <CommandGroup>
                                  {['In Progress', 'Complete', 'Blocked', 'Not Started'].map((status) => (
                                    <CommandItem
                                      key={status}
                                      value={status}
                                      onSelect={() => {
                                        setCurrentStatus(status);
                                        setStatusOpen(false);
                                        toast.success(`Status changed to: ${status}`);
                                      }}
                                    >
                                      <Check
                                        className={`mr-2 h-4 w-4 ${
                                          currentStatus === status ? 'opacity-100' : 'opacity-0'
                                        }`}
                                      />
                                      {status}
                                    </CommandItem>
                                  ))}
                                </CommandGroup>
                              </CommandList>
                            </Command>
                          </PopoverContent>
                        </Popover>
                      </div>
                      <div className="text-xs text-[#71717a] mb-4">
                        Current status: <span className="font-medium text-[#18181b]">{currentStatus}</span>
                      </div>
                      <CodeBlock code={accurateCodeSnippets.statusSelect} />
                    </div>

                    <div>
                      <h3 className="text-sm font-medium text-[#71717a] mb-3">Multi-select Filter Dropdown (Click to open)</h3>
                      <p className="text-xs text-[#71717a] mb-3">Filter chip with count badge - shows number of selected items</p>
                      <div className="mb-4">
                        <Popover open={multiSelectOpen} onOpenChange={setMultiSelectOpen}>
                          <PopoverTrigger asChild>
                            <button className="bg-white border border-[#e4e4e7] rounded-md px-3 py-2 h-10 flex items-center gap-2 hover:bg-[#f9fafb] transition-colors focus:outline-none focus:border-[#fc6]">
                              <span className="text-sm text-[#18181b]">Status</span>
                              {selectedStatuses.length > 0 && (
                                <div className="bg-[#18181b] rounded-full w-5 h-5 flex items-center justify-center">
                                  <span className="text-white text-xs font-medium">{selectedStatuses.length}</span>
                                </div>
                              )}
                              <ChevronDown className="w-4 h-4 text-[#71717a]" />
                            </button>
                          </PopoverTrigger>
                          <PopoverContent className="w-[240px] p-0" align="start">
                            <Command>
                              <CommandList>
                                <CommandGroup>
                                  {statusOptions.map((status) => (
                                    <CommandItem
                                      key={status}
                                      value={status}
                                      onSelect={() => {
                                        if (selectedStatuses.includes(status)) {
                                          setSelectedStatuses(prev => prev.filter(s => s !== status));
                                          toast.success(`Removed: ${status}`);
                                        } else {
                                          setSelectedStatuses(prev => [...prev, status]);
                                          toast.success(`Added: ${status}`);
                                        }
                                      }}
                                    >
                                      <Check
                                        className={`mr-2 h-4 w-4 ${
                                          selectedStatuses.includes(status) ? 'opacity-100' : 'opacity-0'
                                        }`}
                                      />
                                      {status}
                                    </CommandItem>
                                  ))}
                                </CommandGroup>
                              </CommandList>
                            </Command>
                          </PopoverContent>
                        </Popover>
                      </div>
                      <div className="text-xs text-[#71717a] mb-4">
                        Selected ({selectedStatuses.length}): <span className="font-medium text-[#18181b]">{selectedStatuses.join(', ') || 'None'}</span>
                      </div>
                      <CodeBlock code={accurateCodeSnippets.multiSelectStatus} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* Checkboxes */}
            <section id="checkboxes" className="mb-12 scroll-mt-8">
              <h2 className="text-2xl font-bold text-[#18181b] mb-6">Checkboxes</h2>
              <Card>
                <CardContent className="p-6">
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-sm font-medium text-[#71717a] mb-3">Custom Task Checkboxes (Click to toggle)</h3>
                      <div className="space-y-4 mb-4">
                        <div className="flex items-center gap-4">
                          <div 
                            className="size-5 shrink-0 cursor-pointer"
                            onClick={() => {
                              setCheckbox1(!checkbox1);
                              toast.success(checkbox1 ? 'Task marked incomplete' : 'Task marked complete');
                            }}
                          >
                            {checkbox1 ? (
                              <svg className="block size-full" fill="none" viewBox="0 0 20 20">
                                <g clipPath="url(#clip0)">
                                  <path 
                                    clipRule="evenodd" 
                                    d={svgPaths.p372a9b00}
                                    fill="#4CB92E" 
                                    fillRule="evenodd" 
                                  />
                                </g>
                                <defs>
                                  <clipPath id="clip0"><rect width="20" height="20" fill="white" /></clipPath>
                                </defs>
                              </svg>
                            ) : (
                              <svg className="block size-full" fill="none" viewBox="0 0 20 20">
                                <circle cx="10" cy="10" r="9.5" stroke="#71717A" />
                              </svg>
                            )}
                          </div>
                          <span className="text-sm text-[#18181b]">Upload patient documents</span>
                        </div>

                        <div className="flex items-center gap-4">
                          <div 
                            className="size-5 shrink-0 cursor-pointer"
                            onClick={() => {
                              setCheckbox2(!checkbox2);
                              toast.success(checkbox2 ? 'Task marked incomplete' : 'Task marked complete');
                            }}
                          >
                            {checkbox2 ? (
                              <svg className="block size-full" fill="none" viewBox="0 0 20 20">
                                <g clipPath="url(#clip1)">
                                  <path 
                                    clipRule="evenodd" 
                                    d={svgPaths.p372a9b00}
                                    fill="#4CB92E" 
                                    fillRule="evenodd" 
                                  />
                                </g>
                                <defs>
                                  <clipPath id="clip1"><rect width="20" height="20" fill="white" /></clipPath>
                                </defs>
                              </svg>
                            ) : (
                              <svg className="block size-full" fill="none" viewBox="0 0 20 20">
                                <circle cx="10" cy="10" r="9.5" stroke="#71717A" />
                              </svg>
                            )}
                          </div>
                          <span className="text-sm text-[#18181b]">Review site visit checklist</span>
                        </div>

                        <div className="flex items-center gap-4">
                          <div 
                            className="size-5 shrink-0 cursor-pointer"
                            onClick={() => {
                              setCheckbox3(!checkbox3);
                              toast.success(checkbox3 ? 'Task marked incomplete' : 'Task marked complete');
                            }}
                          >
                            {checkbox3 ? (
                              <svg className="block size-full" fill="none" viewBox="0 0 20 20">
                                <g clipPath="url(#clip2)">
                                  <path 
                                    clipRule="evenodd" 
                                    d={svgPaths.p372a9b00}
                                    fill="#4CB92E" 
                                    fillRule="evenodd" 
                                  />
                                </g>
                                <defs>
                                  <clipPath id="clip2"><rect width="20" height="20" fill="white" /></clipPath>
                                </defs>
                              </svg>
                            ) : (
                              <svg className="block size-full" fill="none" viewBox="0 0 20 20">
                                <circle cx="10" cy="10" r="9.5" stroke="#71717A" />
                              </svg>
                            )}
                          </div>
                          <span className="text-sm text-[#18181b]">Send follow-up email</span>
                        </div>
                      </div>
                      <div className="text-xs text-[#71717a] mb-4">
                        Completed: {[checkbox1, checkbox2, checkbox3].filter(Boolean).length} of 3
                      </div>
                      <CodeBlock code={accurateCodeSnippets.checkboxCompleted} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* Avatars */}
            <section id="avatars" className="mb-12 scroll-mt-8">
              <h2 className="text-2xl font-bold text-[#18181b] mb-6">Avatars</h2>
              <Card>
                <CardContent className="p-6">
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-sm font-medium text-[#71717a] mb-3">Avatar with Initials (Different sizes)</h3>
                      <div className="flex items-center gap-4 mb-4">
                        <div className="bg-[#fc6] w-8 h-8 rounded-full flex items-center justify-center hover:scale-110 transition-transform cursor-pointer">
                          <span className="text-sm font-medium text-[#18181b]">TF</span>
                        </div>
                        <div className="bg-[#fc6] w-10 h-10 rounded-full flex items-center justify-center hover:scale-110 transition-transform cursor-pointer">
                          <span className="text-base font-medium text-[#18181b]">SM</span>
                        </div>
                        <div className="bg-[#fc6] w-12 h-12 rounded-full flex items-center justify-center hover:scale-110 transition-transform cursor-pointer">
                          <span className="text-lg font-medium text-[#18181b]">JD</span>
                        </div>
                      </div>
                      <p className="text-xs text-[#71717a] mb-4">Hover to scale • Sizes: 32px, 40px, 48px</p>
                      <CodeBlock code={accurateCodeSnippets.avatar} />
                    </div>

                    <div>
                      <h3 className="text-sm font-medium text-[#71717a] mb-3">Different Color Variants</h3>
                      <div className="flex items-center gap-4 mb-4">
                        <div className="bg-[#fc6] w-10 h-10 rounded-full flex items-center justify-center hover:scale-110 transition-transform cursor-pointer">
                          <span className="text-base font-medium text-[#18181b]">TF</span>
                        </div>
                        <div className="bg-blue-100 w-10 h-10 rounded-full flex items-center justify-center hover:scale-110 transition-transform cursor-pointer">
                          <span className="text-base font-medium text-blue-700">SM</span>
                        </div>
                        <div className="bg-green-100 w-10 h-10 rounded-full flex items-center justify-center hover:scale-110 transition-transform cursor-pointer">
                          <span className="text-base font-medium text-green-700">JD</span>
                        </div>
                        <div className="bg-purple-100 w-10 h-10 rounded-full flex items-center justify-center hover:scale-110 transition-transform cursor-pointer">
                          <span className="text-base font-medium text-purple-700">KL</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* Badges */}
            <section id="badges" className="mb-12 scroll-mt-8">
              <h2 className="text-2xl font-bold text-[#18181b] mb-6">Badges & Alerts</h2>
              <Card>
                <CardContent className="p-6">
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-sm font-medium text-[#71717a] mb-3">Date Badges (Hover to see states)</h3>
                      <div className="flex flex-wrap gap-3 mb-4">
                        <div className="inline-flex items-center gap-1.5 px-2 py-1 bg-red-100 border border-red-200 rounded text-xs hover:shadow-md transition-shadow cursor-pointer">
                          <CalendarIcon className="w-3 h-3 text-red-600" />
                          <span className="text-red-600">Overdue by 2 days</span>
                        </div>
                        <div className="inline-flex items-center gap-1.5 px-2 py-1 bg-orange-100 border border-orange-200 rounded text-xs hover:shadow-md transition-shadow cursor-pointer">
                          <CalendarIcon className="w-3 h-3 text-orange-600" />
                          <span className="text-orange-600">Due today</span>
                        </div>
                        <div className="inline-flex items-center gap-1.5 px-2 py-1 bg-amber-50 border border-amber-100 rounded text-xs hover:shadow-md transition-shadow cursor-pointer">
                          <CalendarIcon className="w-3 h-3 text-amber-600" />
                          <span className="text-amber-600">Due in 3 days</span>
                        </div>
                        <div className="inline-flex items-center gap-1.5 px-2 py-1 bg-gray-50 border border-gray-200 rounded text-xs hover:shadow-md transition-shadow cursor-pointer">
                          <CalendarIcon className="w-3 h-3 text-gray-600" />
                          <span className="text-gray-600">Due in 2 weeks</span>
                        </div>
                      </div>
                      <CodeBlock code={accurateCodeSnippets.dateBadgeOverdue} />
                    </div>

                    <div>
                      <h3 className="text-sm font-medium text-[#71717a] mb-3">Alert Badges</h3>
                      <div className="flex flex-wrap gap-3 mb-4">
                        <div className="inline-flex items-center gap-1.5 px-2 py-1 bg-orange-50 border border-orange-200 rounded text-xs hover:shadow-md transition-shadow cursor-pointer">
                          <AlertCircle className="w-3 h-3 text-orange-600" />
                          <span className="text-orange-600">Needs 3 documents</span>
                        </div>
                        <div className="inline-flex items-center gap-1.5 px-2 py-1 bg-red-50 border border-red-200 rounded text-xs hover:shadow-md transition-shadow cursor-pointer">
                          <AlertCircle className="w-3 h-3 text-red-600" />
                          <span className="text-red-600">Missing file</span>
                        </div>
                        <div className="inline-flex items-center gap-1.5 px-2 py-1 bg-yellow-50 border border-yellow-200 rounded text-xs hover:shadow-md transition-shadow cursor-pointer">
                          <AlertCircle className="w-3 h-3 text-yellow-600" />
                          <span className="text-yellow-600">Review required</span>
                        </div>
                      </div>
                      <CodeBlock code={accurateCodeSnippets.alertBadge} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* Save Indicator */}
            <section id="save-indicator" className="mb-12 scroll-mt-8">
              <h2 className="text-2xl font-bold text-[#18181b] mb-6">Save Indicator</h2>
              <Card>
                <CardContent className="p-6">
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-sm font-medium text-[#71717a] mb-3">Autosave States</h3>
                      <div className="flex items-center gap-6 mb-4">
                        <div className="flex flex-col items-center gap-2">
                          <SaveIndicator status="idle" />
                          <span className="text-xs text-[#71717a]">Idle</span>
                        </div>
                        <div className="flex flex-col items-center gap-2">
                          <SaveIndicator status="saving" />
                          <span className="text-xs text-[#71717a]">Saving...</span>
                        </div>
                        <div className="flex flex-col items-center gap-2">
                          <SaveIndicator status="saved" />
                          <span className="text-xs text-[#71717a]">Saved</span>
                        </div>
                      </div>
                      <button 
                        onClick={triggerSaveSequence}
                        className="bg-[#fc6] px-4 py-2 rounded-md text-sm font-medium text-[#18181b] hover:bg-[#ffcc77] mb-4 transition-colors active:scale-95"
                      >
                        Test Save Sequence (Saving → Saved → Idle)
                      </button>
                      <div className="text-xs text-[#71717a] mb-4">
                        Current state: <span className="font-medium text-[#18181b]">{saveStatus}</span>
                      </div>
                      <CodeBlock code={accurateCodeSnippets.saveIndicator} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* Progress Bars */}
            <section id="progress-bars" className="mb-12 scroll-mt-8">
              <h2 className="text-2xl font-bold text-[#18181b] mb-6">Progress Bars</h2>
              <Card>
                <CardContent className="p-6">
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-sm font-medium text-[#71717a] mb-3">File Upload Progress</h3>
                      <div className="max-w-md mb-4">
                        <div className="bg-white border rounded-lg p-4 flex items-center gap-3 relative overflow-hidden border-[#3b82f6]">
                          <div 
                            className="absolute inset-0 bg-[#dbeafe] transition-all duration-300" 
                            style={{ width: `${progress}%`, opacity: 0.5 }}
                          />
                          <Upload className={`size-8 text-[#3b82f6] z-10 shrink-0 ${isUploading ? 'animate-pulse' : ''}`} />
                          <div className="flex-1 min-w-0 z-10">
                            <p className="text-sm text-[#212121] truncate">Document.pdf</p>
                            <p className="text-xs text-[#8c8c8c]">Category • 2.5MB</p>
                          </div>
                          <span className="text-xs font-medium text-[#3b82f6] z-10">{progress}%</span>
                        </div>
                        <div className="mt-4 flex gap-2">
                          <button 
                            onClick={() => setProgress(Math.max(0, progress - 10))}
                            className="px-3 py-1 bg-gray-200 rounded text-sm hover:bg-gray-300 transition-colors"
                            disabled={isUploading}
                          >
                            -10%
                          </button>
                          <button 
                            onClick={() => setProgress(Math.min(100, progress + 10))}
                            className="px-3 py-1 bg-gray-200 rounded text-sm hover:bg-gray-300 transition-colors"
                            disabled={isUploading}
                          >
                            +10%
                          </button>
                          <button 
                            onClick={simulateUpload}
                            className="px-3 py-1 bg-[#fc6] rounded text-sm hover:bg-[#ffcc77] transition-colors text-[#18181b]"
                            disabled={isUploading}
                          >
                            {isUploading ? 'Uploading...' : 'Simulate Upload'}
                          </button>
                        </div>
                      </div>
                      <CodeBlock code={accurateCodeSnippets.uploadProgress} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* Tabs */}
            <section id="tabs" className="mb-12 scroll-mt-8">
              <h2 className="text-2xl font-bold text-[#18181b] mb-6">Tabs</h2>
              <Card>
                <CardContent className="p-6">
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-sm font-medium text-[#71717a] mb-3">Tab Group (Click to switch)</h3>
                      <div className="mb-4 max-w-md">
                        <div className="bg-[#f4f4f5] p-1 rounded-md flex gap-0">
                          <button 
                            onClick={() => {
                              setActiveTab('details');
                              toast.info('Details tab selected');
                            }}
                            className={`flex-1 px-3 py-1.5 text-sm font-medium rounded transition-all ${
                              activeTab === 'details'
                                ? 'bg-white text-[#18181b] shadow-sm'
                                : 'bg-transparent text-[#6b7280] hover:text-[#18181b]'
                            }`}
                          >
                            Details
                          </button>
                          <button 
                            onClick={() => {
                              setActiveTab('comments');
                              toast.info('Comments tab selected');
                            }}
                            className={`flex-1 px-3 py-1.5 text-sm font-medium rounded transition-all ${
                              activeTab === 'comments'
                                ? 'bg-white text-[#18181b] shadow-sm'
                                : 'bg-transparent text-[#6b7280] hover:text-[#18181b]'
                            }`}
                          >
                            Comments
                          </button>
                          <button 
                            onClick={() => {
                              setActiveTab('activity');
                              toast.info('Activity tab selected');
                            }}
                            className={`flex-1 px-3 py-1.5 text-sm font-medium rounded transition-all ${
                              activeTab === 'activity'
                                ? 'bg-white text-[#18181b] shadow-sm'
                                : 'bg-transparent text-[#6b7280] hover:text-[#18181b]'
                            }`}
                          >
                            Activity
                          </button>
                        </div>
                        <div className="mt-4 p-4 bg-white border border-[#e4e4e7] rounded-md">
                          <p className="text-sm text-[#71717a]">
                            {activeTab === 'details' && 'Task details and information...'}
                            {activeTab === 'comments' && 'Comments and discussions...'}
                            {activeTab === 'activity' && 'Activity log and history...'}
                          </p>
                        </div>
                      </div>
                      <div className="text-xs text-[#71717a] mb-4">
                        Active tab: <span className="font-medium text-[#18181b]">{activeTab}</span>
                      </div>
                      <CodeBlock code={accurateCodeSnippets.tabButtons} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* Dropdowns */}
            <section id="dropdowns" className="mb-12 scroll-mt-8">
              <h2 className="text-2xl font-bold text-[#18181b] mb-6">Dropdowns</h2>
              <Card>
                <CardContent className="p-6">
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-sm font-medium text-[#71717a] mb-3">Expandable Dropdown (Click to expand)</h3>
                      <div className="mb-4 max-w-md">
                        <button 
                          onClick={() => {
                            setDropdownExpanded(!dropdownExpanded);
                            toast.info(dropdownExpanded ? 'Collapsed' : 'Expanded');
                          }}
                          className="w-full bg-white border border-[#e4e4e7] rounded-md cursor-pointer focus:border-[#fc6] focus:outline-none transition-all text-left hover:bg-[#f9fafb]"
                        >
                          <div className="flex items-center justify-between px-3 py-2.5">
                            <span className="text-sm text-[#18181b]">Uploads overview</span>
                            <div className="flex items-center gap-3 text-sm text-[#18181b]">
                              <span>3 of 5 files uploaded</span>
                              <ChevronDown className={`w-4 h-4 transition-transform ${dropdownExpanded ? 'rotate-180' : ''}`} />
                            </div>
                          </div>
                        </button>
                        {dropdownExpanded && (
                          <div className="mt-2 p-4 bg-white border border-[#e4e4e7] rounded-md space-y-2 animate-in fade-in slide-in-from-top-2 duration-200">
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-[#71717a]">Patient 1 - John Doe</span>
                              <span className="text-green-600 font-medium">✓ Complete</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-[#71717a]">Patient 2 - Jane Smith</span>
                              <span className="text-green-600 font-medium">✓ Complete</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-[#71717a]">Patient 3 - Bob Johnson</span>
                              <span className="text-green-600 font-medium">✓ Complete</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-[#71717a]">Patient 4 - Alice Brown</span>
                              <span className="text-orange-600 font-medium">⊗ Pending</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-[#71717a]">Patient 5 - Charlie Wilson</span>
                              <span className="text-orange-600 font-medium">⊗ Pending</span>
                            </div>
                          </div>
                        )}
                      </div>
                      <CodeBlock code={accurateCodeSnippets.dropdownExpandable} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* Menus */}
            <section id="menus" className="mb-12 scroll-mt-8">
              <h2 className="text-2xl font-bold text-[#18181b] mb-6">Context Menus</h2>
              <Card>
                <CardContent className="p-6">
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-sm font-medium text-[#71717a] mb-3">More Menu (Click three dots)</h3>
                      <div className="mb-4">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <button className="p-2 hover:bg-[#f4f4f5] rounded transition-colors">
                              <MoreHorizontal className="w-5 h-5 text-[#71717a]" />
                            </button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => toast.info('Edit clicked')}>
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => toast.info('Duplicate clicked')}>
                              Duplicate
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => toast.info('Share clicked')}>
                              Share
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              className="text-red-600"
                              onClick={() => toast.error('Delete clicked')}
                            >
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                      <CodeBlock code={accurateCodeSnippets.moreMenu} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* Task Atoms */}
            <section id="task-atoms" className="mb-12 scroll-mt-8">
              <h2 className="text-2xl font-bold text-[#18181b] mb-6">Task Atoms</h2>
              <p className="text-sm text-[#71717a] mb-6">Individual atomic components that make up a task row</p>
              <Card>
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    
                    {/* Task Checkbox - Completed */}
                    <div>
                      <h3 className="text-sm font-medium text-[#71717a] mb-3">Task Checkbox (Completed)</h3>
                      <div className="mb-4 p-4 bg-[#f9fafb] rounded-lg flex items-center justify-center">
                        <div className="size-5 shrink-0 cursor-pointer">
                          <svg className="block size-full" fill="none" viewBox="0 0 20 20">
                            <g clipPath="url(#clip0)">
                              <path 
                                clipRule="evenodd" 
                                d="M10 20C15.5228 20 20 15.5228 20 10C20 4.47715 15.5228 0 10 0C4.47715 0 0 4.47715 0 10C0 15.5228 4.47715 20 10 20ZM14.7682 7.63327C15.1218 7.21709 15.0645 6.5861 14.6483 6.23251C14.2321 5.87892 13.6011 5.93622 13.2476 6.3524L8.89443 11.4935L6.70711 9.30616C6.31658 8.91564 5.68342 8.91564 5.29289 9.30616C4.90237 9.69669 4.90237 10.3299 5.29289 10.7204L8.18198 13.6095C8.3845 13.812 8.66334 13.9188 8.94839 13.9034C9.23345 13.888 9.49959 13.7517 9.68327 13.5268L14.7682 7.63327Z"
                                fill="#4CB92E" 
                                fillRule="evenodd" 
                              />
                            </g>
                            <defs>
                              <clipPath id="clip0"><rect width="20" height="20" fill="white" /></clipPath>
                            </defs>
                          </svg>
                        </div>
                      </div>
                      <CodeBlock code={accurateCodeSnippets.taskCheckboxCompleted} />
                    </div>

                    {/* Task Checkbox - Uncompleted */}
                    <div>
                      <h3 className="text-sm font-medium text-[#71717a] mb-3">Task Checkbox (Uncompleted)</h3>
                      <div className="mb-4 p-4 bg-[#f9fafb] rounded-lg flex items-center justify-center">
                        <div className="size-5 shrink-0 cursor-pointer">
                          <svg className="block size-full" fill="none" viewBox="0 0 20 20">
                            <circle cx="10" cy="10" r="9.5" stroke="#71717A" />
                          </svg>
                        </div>
                      </div>
                      <CodeBlock code={accurateCodeSnippets.taskCheckboxUncompleted} />
                    </div>

                    {/* User Avatar */}
                    <div>
                      <h3 className="text-sm font-medium text-[#71717a] mb-3">User Avatar with Name</h3>
                      <div className="mb-4 p-4 bg-[#f9fafb] rounded-lg flex items-center justify-center">
                        <div className="flex items-center gap-2">
                          <div className="bg-[#fc6] w-8 h-8 rounded-full flex items-center justify-center">
                            <span className="text-sm font-medium text-[#18181b]">TF</span>
                          </div>
                          <span className="text-sm text-[#18181b]">Tim Freeman</span>
                        </div>
                      </div>
                      <CodeBlock code={accurateCodeSnippets.taskUserAvatar} />
                    </div>

                    {/* Due Date Badge - Normal */}
                    <div>
                      <h3 className="text-sm font-medium text-[#71717a] mb-3">Due Date Badge (Normal)</h3>
                      <p className="text-xs text-[#71717a] mb-3">Displays date in mm/dd/yy format with neutral styling</p>
                      <div className="mb-4 p-4 bg-[#f9fafb] rounded-lg flex items-center justify-center">
                        <div className="inline-flex items-center px-2 py-0.5 rounded-md border border-[#e4e4e7] bg-white">
                          <span className="text-xs font-medium text-[#18181b]">03/15/26</span>
                        </div>
                      </div>
                      <CodeBlock code={accurateCodeSnippets.taskDueDateNormal} />
                    </div>

                    {/* Due Date Badge - Overdue */}
                    <div>
                      <h3 className="text-sm font-medium text-[#71717a] mb-3">Due Date Badge (Overdue)</h3>
                      <p className="text-xs text-[#71717a] mb-3">Displays date in mm/dd/yy format with red styling to indicate overdue status</p>
                      <div className="mb-4 p-4 bg-[#f9fafb] rounded-lg flex items-center justify-center">
                        <div className="inline-flex items-center px-2 py-0.5 rounded-md border border-red-200 bg-red-100">
                          <span className="text-xs font-medium text-red-600">02/28/26</span>
                        </div>
                      </div>
                      <CodeBlock code={accurateCodeSnippets.taskDueDateOverdue} />
                    </div>

                    {/* Due Date Badge - Due Soon */}
                    <div>
                      <h3 className="text-sm font-medium text-[#71717a] mb-3">Due Date Badge (Future)</h3>
                      <p className="text-xs text-[#71717a] mb-3">Displays future date in mm/dd/yy format with neutral styling</p>
                      <div className="mb-4 p-4 bg-[#f9fafb] rounded-lg flex items-center justify-center">
                        <div className="inline-flex items-center px-2 py-0.5 rounded-md border border-[#e4e4e7] bg-white">
                          <span className="text-xs font-medium text-[#18181b]">04/20/26</span>
                        </div>
                      </div>
                      <CodeBlock code={accurateCodeSnippets.taskDueDateSoon} />
                    </div>

                    {/* Attention Badge */}
                    <div>
                      <h3 className="text-sm font-medium text-[#71717a] mb-3">Attention Badge</h3>
                      <p className="text-xs text-[#71717a] mb-3">Shows count of files needing attention or missing</p>
                      <div className="mb-4 p-4 bg-[#f9fafb] rounded-lg flex items-center justify-center">
                        <div className="flex items-center gap-1">
                          <AlertCircle className="w-5 h-5 text-[#8745AE]" />
                          <span className="text-xs font-medium text-[#8745AE]">3 Needs Attention</span>
                        </div>
                      </div>
                      <CodeBlock code={accurateCodeSnippets.taskAttentionBadge} />
                    </div>

                  </div>
                </CardContent>
              </Card>
            </section>

            {/* Task Row */}
            <section id="task-row" className="mb-12 scroll-mt-8">
              <h2 className="text-2xl font-bold text-[#18181b] mb-6">Task Row (Molecule)</h2>
              <p className="text-sm text-[#71717a] mb-6">Complete task row combining all atomic pieces with proper cell layout and individual hover states</p>
              <Card>
                <CardContent className="p-6">
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-sm font-medium text-[#71717a] mb-3">Desktop Task Row</h3>
                      <p className="text-xs text-[#71717a] mb-4">
                        Fixed-width cells with borders, individual hover effects per cell, and interactive dropdown menus
                      </p>
                      <div className="mb-4 p-4 bg-[#f9fafb] rounded-lg overflow-x-auto">
                        <div className="bg-white h-10 rounded-lg border border-[#cdd7e1] hover:border-[#47515B] transition-colors min-w-[900px]">
                          <div className="flex items-center h-full">
                            {/* Checkbox Cell */}
                            <div className="w-[44px] flex items-center justify-center h-full hover:bg-[#f5f5f5] transition-colors rounded-l-lg group">
                              <div className="size-5 shrink-0 cursor-pointer">
                                <svg className="block size-full" fill="none" viewBox="0 0 20 20">
                                  <circle cx="10" cy="10" r="9.5" stroke="#71717A" />
                                </svg>
                              </div>
                            </div>
                            
                            {/* Task Title Cell */}
                            <div className="w-[220px] px-3 h-full flex items-center border-r border-[#cdd7e1] hover:bg-[#f5f5f5] transition-colors group">
                              <button className="text-left text-sm underline text-[#18181b] truncate">
                                Upload patient forms
                              </button>
                            </div>
                            
                            {/* Due Date Cell */}
                            <div className="w-[200px] px-3 h-full flex items-center justify-between border-r border-[#cdd7e1] hover:bg-[#f5f5f5] transition-colors group">
                              <div className="inline-flex items-center px-2 py-0.5 rounded-md border border-amber-100 bg-amber-50">
                                <span className="text-xs font-medium text-amber-600">Due in 3 days</span>
                              </div>
                              <ChevronDown className="w-4 h-4 text-[#71717a]" />
                            </div>
                            
                            {/* Assigned To Cell */}
                            <div className="w-[186px] px-3 h-full flex items-center justify-between border-r border-[#cdd7e1] hover:bg-[#f5f5f5] transition-colors group">
                              <div className="flex items-center gap-2">
                                <div className="bg-[#fc6] w-6 h-6 rounded-full flex items-center justify-center">
                                  <span className="text-xs font-medium text-[#18181b]">TF</span>
                                </div>
                                <span className="text-sm text-[#18181b]">Tim Freeman</span>
                              </div>
                              <ChevronDown className="w-4 h-4 text-[#18181b]" />
                            </div>
                            
                            {/* Health Center Cell */}
                            <div className="w-[250px] px-3 h-full flex items-center justify-between border-r border-[#cdd7e1] hover:bg-[#f5f5f5] transition-colors group">
                              <span className="text-sm text-[#18181b]">Mountain View</span>
                              <ChevronDown className="w-4 h-4 text-[#18181b]" />
                            </div>
                            
                            {/* Attention Cell */}
                            <div className="flex-1 px-3 h-full flex items-center hover:bg-[#f5f5f5] transition-colors group">
                              <div className="flex items-center gap-1">
                                <AlertCircle className="w-5 h-5 text-[#8745AE]" />
                                <span className="text-xs font-medium text-[#8745AE]">3 Needs Attention</span>
                              </div>
                            </div>
                            
                            {/* More Menu Cell */}
                            <div className="px-3 h-full flex items-center hover:bg-[#f5f5f5] transition-colors rounded-r-lg group">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <button>
                                    <MoreHorizontal className="w-5 h-5 text-[#18181b]" />
                                  </button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem onClick={() => toast.info('Edit clicked')}>Edit</DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => toast.info('Duplicate clicked')}>Duplicate</DropdownMenuItem>
                                  <DropdownMenuItem className="text-red-600" onClick={() => toast.error('Delete clicked')}>Delete</DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </div>
                        </div>
                      </div>
                      <CodeBlock code={accurateCodeSnippets.taskRowFull} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* Column Header Sort */}
            <section id="column-header" className="mb-12 scroll-mt-8">
              <h2 className="text-2xl font-bold text-[#18181b] mb-6">Column Header Sort</h2>
              <p className="text-sm text-[#71717a] mb-6">Interactive column headers with sorting dropdown showing asc/desc options</p>
              <Card>
                <CardContent className="p-6">
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-sm font-medium text-[#71717a] mb-3">Sortable Column Header</h3>
                      <p className="text-xs text-[#71717a] mb-4">
                        Click to open dropdown menu with Asc/Desc sorting options. Shows current sort direction with chevron icons.
                      </p>
                      <div className="mb-4 p-4 bg-[#f9fafb] rounded-lg flex items-center justify-start gap-4">
                        {/* Unsorted */}
                        <div className="flex flex-col gap-2">
                          <span className="text-xs text-[#71717a] mb-1">Unsorted:</span>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <button className="flex items-center gap-1 hover:bg-[#e5e5e5] px-2 py-1 rounded transition-colors">
                                <User size={14} className="text-[#18181b]" />
                                <span className="text-sm font-semibold text-[#18181b]">Assigned To</span>
                                <ChevronsUpDown size={16} className="text-[#71717a]" />
                              </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="start">
                              <DropdownMenuItem onClick={() => toast.info('Sorted ascending')}>
                                <ChevronUp size={16} className="mr-2" />
                                Asc
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => toast.info('Sorted descending')}>
                                <ChevronDown size={16} className="mr-2" />
                                Desc
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>

                        {/* Sorted Ascending */}
                        <div className="flex flex-col gap-2">
                          <span className="text-xs text-[#71717a] mb-1">Ascending:</span>
                          <button className="flex items-center gap-1 hover:bg-[#e5e5e5] px-2 py-1 rounded transition-colors">
                            <User size={14} className="text-[#18181b]" />
                            <span className="text-sm font-semibold text-[#18181b]">Assigned To</span>
                            <ChevronUp size={16} className="text-[#71717a]" />
                          </button>
                        </div>

                        {/* Sorted Descending */}
                        <div className="flex flex-col gap-2">
                          <span className="text-xs text-[#71717a] mb-1">Descending:</span>
                          <button className="flex items-center gap-1 hover:bg-[#e5e5e5] px-2 py-1 rounded transition-colors">
                            <User size={14} className="text-[#18181b]" />
                            <span className="text-sm font-semibold text-[#18181b]">Assigned To</span>
                            <ChevronDown size={16} className="text-[#71717a]" />
                          </button>
                        </div>
                      </div>
                      <CodeBlock code={accurateCodeSnippets.columnHeaderSort} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </section>

          </div>
        </div>
      </div>
    </div>
  );
}