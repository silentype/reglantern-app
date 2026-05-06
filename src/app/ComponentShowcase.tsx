import { useState } from 'react';
import { Button } from './components/ui/button';
import { Input } from './components/ui/input';
import { Textarea } from './components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './components/ui/select';
import { Checkbox } from './components/ui/checkbox';
import { Switch } from './components/ui/switch';
import { RadioGroup, RadioGroupItem } from './components/ui/radio-group';
import { Calendar } from './components/ui/calendar';
import { Progress } from './components/ui/progress';
import { Badge } from './components/ui/badge';
import { Avatar, AvatarFallback } from './components/ui/avatar';
import { Slider } from './components/ui/slider';
import { Label } from './components/ui/label';
import { Separator } from './components/ui/separator';
import { Alert, AlertDescription, AlertTitle } from './components/ui/alert';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './components/ui/card';
import { SaveIndicator } from './components/SaveIndicator';
import { DueDatePicker } from './components/DueDatePicker';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './components/ui/accordion';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './components/ui/dialog';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from './components/ui/sheet';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './components/ui/tooltip';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './components/ui/dropdown-menu';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './components/ui/table';
import { Skeleton } from './components/ui/skeleton';
import { Toggle } from './components/ui/toggle';
import { ToggleGroup, ToggleGroupItem } from './components/ui/toggle-group';
import { HoverCard, HoverCardContent, HoverCardTrigger } from './components/ui/hover-card';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from './components/ui/command';
import { CodeBlock } from './components/CodeBlock';
import { codeSnippets } from './constants/codeSnippets';
import NoSim from '../imports/NoSim';
import svgPaths from '../imports/svg-xpk29wrq0q';
import { 
  AlertCircle, 
  Check, 
  X, 
  Calendar as CalendarIcon, 
  User, 
  Building2,
  Search,
  Upload,
  Trash2,
  ChevronDown,
  CheckCircle,
  ArrowLeft,
  MoreVertical,
  Settings,
  Bold,
  Italic,
  Menu,
  ChevronRight,
  Layers,
  Mouse,
  Type,
  Palette as PaletteIcon
} from 'lucide-react';

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
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [progress, setProgress] = useState(65);
  const [activeSection, setActiveSection] = useState(initialActiveSection);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const triggerSaveSequence = () => {
    setSaveStatus('saving');
    setTimeout(() => {
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 2000);
    }, 1000);
  };

  const sections: Section[] = [
    {
      id: 'form-controls',
      title: 'Form Controls',
      icon: Mouse,
      subsections: ['buttons', 'filter-chips', 'inputs', 'selects', 'checkboxes', 'switches']
    },
    {
      id: 'data-display',
      title: 'Data Display',
      icon: Layers,
      subsections: ['avatars', 'badges', 'progress', 'alerts', 'tables']
    },
    {
      id: 'app-specific',
      title: 'App Components',
      icon: CheckCircle,
      subsections: ['due-date', 'task-status', 'save-indicator']
    },
    {
      id: 'layout',
      title: 'Layout & Navigation',
      icon: Menu,
      subsections: ['tabs', 'accordion', 'dialog', 'dropdown', 'command']
    },
    {
      id: 'design',
      title: 'Design System',
      icon: PaletteIcon,
      subsections: ['typography', 'colors', 'icons', 'calendar']
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
      'inputs': 'Inputs & Textareas',
      'selects': 'Selects & Dropdowns',
      'checkboxes': 'Checkboxes & Radio',
      'switches': 'Switches & Sliders',
      'avatars': 'Avatars & Badges',
      'badges': 'Badge Variants',
      'progress': 'Progress & Loading',
      'alerts': 'Alerts & Notifications',
      'tables': 'Tables',
      'due-date': 'Due Date Components',
      'task-status': 'Task Status',
      'save-indicator': 'Save Indicator',
      'tabs': 'Tabs',
      'accordion': 'Accordion',
      'dialog': 'Dialog & Sheet',
      'dropdown': 'Dropdown Menu',
      'command': 'Command Palette',
      'typography': 'Typography',
      'colors': 'Color Palette',
      'icons': 'Icon Library',
      'calendar': 'Calendar'
    };
    return names[id] || id;
  };

  return (
    <div className="h-full flex flex-col bg-[#f9fafb]">
      {/* Header (hidden when in DeveloperHub) */}
      {!hideHeader && (
        <header className="bg-[#32383e] h-[80px] flex items-center justify-between px-8 shrink-0">
          <div>
            <h1 className="text-2xl font-semibold text-white">Reglantern Component Showcase</h1>
            <p className="text-sm text-[#9ca3af]">Explore all UI components used in the application</p>
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
              <h2 className="text-xl font-bold text-[#18181b] mb-2">Component Library</h2>
              <p className="text-[#71717a] mb-3">
                All components include copy-to-clipboard functionality. Hover over any code block and click "Copy" to use the component in your project.
              </p>
              <div className="flex items-center gap-2 text-sm text-[#71717a]">
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Performance Optimized</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>TypeScript Ready</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <span>Accessible</span>
                </div>
              </div>
            </div>

            {/* Buttons Section */}
            <section id="buttons" className="mb-12 scroll-mt-8">\n              <h2 className="text-2xl font-bold text-[#18181b] mb-6">Buttons</h2>
              <Card>
                <CardContent className="p-6">
                  <div className="space-y-6">
                    {/* Primary Buttons */}
                    <div>
                      <h3 className="text-sm font-medium text-[#71717a] mb-3">Primary (Yellow Brand)</h3>
                      <div className="flex flex-wrap gap-3 mb-4">
                        <Button className="bg-[#fc6] text-[#18181b] hover:bg-[#ffcc77]">
                          Primary Button
                        </Button>
                        <Button className="bg-[#fc6] text-[#18181b] hover:bg-[#ffcc77]" disabled>
                          Disabled
                        </Button>
                        <Button className="bg-[#fc6] text-[#18181b] hover:bg-[#ffcc77]" size="sm">
                          Small
                        </Button>
                        <Button className="bg-[#fc6] text-[#18181b] hover:bg-[#ffcc77]" size="lg">
                          Large
                        </Button>
                      </div>
                      <CodeBlock code={codeSnippets.buttonPrimary} />
                    </div>

                    {/* Secondary Buttons */}
                    <div>
                      <h3 className="text-sm font-medium text-[#71717a] mb-3">Secondary</h3>
                      <div className="flex flex-wrap gap-3 mb-4">
                        <Button variant="secondary">Secondary Button</Button>
                        <Button variant="secondary" disabled>Disabled</Button>
                        <Button variant="secondary" size="sm">Small</Button>
                        <Button variant="secondary" size="lg">Large</Button>
                      </div>
                      <CodeBlock code={codeSnippets.buttonSecondary} />
                    </div>

                    {/* Outline Buttons */}
                    <div>
                      <h3 className="text-sm font-medium text-[#71717a] mb-3">Outline</h3>
                      <div className="flex flex-wrap gap-3 mb-4">
                        <Button variant="outline">Outline Button</Button>
                        <Button variant="outline" disabled>Disabled</Button>
                        <Button variant="outline" size="sm">Small</Button>
                        <Button variant="outline" size="lg">Large</Button>
                      </div>
                      <CodeBlock code={codeSnippets.buttonOutline} />
                    </div>

                    {/* Ghost Buttons */}
                    <div>
                      <h3 className="text-sm font-medium text-[#71717a] mb-3">Ghost</h3>
                      <div className="flex flex-wrap gap-3">
                        <Button variant="ghost">Ghost Button</Button>
                        <Button variant="ghost" disabled>Disabled</Button>
                        <Button variant="ghost" size="sm">Small</Button>
                        <Button variant="ghost" size="lg">Large</Button>
                      </div>
                    </div>

                    {/* Destructive Buttons */}
                    <div>
                      <h3 className="text-sm font-medium text-[#71717a] mb-3">Destructive</h3>
                      <div className="flex flex-wrap gap-3">
                        <Button variant="destructive">Delete</Button>
                        <Button variant="destructive" disabled>Disabled</Button>
                        <Button variant="destructive" size="sm">Small</Button>
                        <Button variant="destructive" size="lg">Large</Button>
                      </div>
                    </div>

                    {/* Icon Buttons */}
                    <div>
                      <h3 className="text-sm font-medium text-[#71717a] mb-3">With Icons</h3>
                      <div className="flex flex-wrap gap-3 mb-4">
                        <Button className="bg-[#fc6] text-[#18181b] hover:bg-[#ffcc77]">
                          <Upload className="mr-2 h-4 w-4" />
                          Upload
                        </Button>
                        <Button variant="destructive">
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </Button>
                        <Button variant="outline">
                          <Search className="mr-2 h-4 w-4" />
                          Search
                        </Button>
                        <Button variant="ghost" size="icon">
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                      <CodeBlock code={codeSnippets.buttonWithIcon} />
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
                    {/* Chip/Tag Style - Default */}
                    <div>
                      <h3 className="text-sm font-medium text-[#71717a] mb-3">Chip Style (Default)</h3>
                      <div className="flex flex-wrap gap-2">
                        <button className="px-3 py-1.5 rounded-full text-xs font-medium bg-[#f5f5f5] text-[#18181b] hover:bg-[#e5e5e5] transition-colors">
                          All Tasks
                        </button>
                        <button className="px-3 py-1.5 rounded-full text-xs font-medium bg-[#f5f5f5] text-[#18181b] hover:bg-[#e5e5e5] transition-colors">
                          Incomplete
                        </button>
                        <button className="px-3 py-1.5 rounded-full text-xs font-medium bg-[#f5f5f5] text-[#18181b] hover:bg-[#e5e5e5] transition-colors">
                          Complete
                        </button>
                      </div>
                    </div>

                    {/* Active/Selected State */}
                    <div>
                      <h3 className="text-sm font-medium text-[#71717a] mb-3">Active State (Yellow)</h3>
                      <div className="flex flex-wrap gap-2 mb-4">
                        <button className="px-3 py-1.5 rounded-full text-xs font-medium bg-[#fc6] text-[#18181b] transition-colors">
                          All Tasks
                        </button>
                        <button className="px-3 py-1.5 rounded-full text-xs font-medium bg-[#f5f5f5] text-[#18181b] hover:bg-[#e5e5e5] transition-colors">
                          Incomplete
                        </button>
                        <button className="px-3 py-1.5 rounded-full text-xs font-medium bg-[#f5f5f5] text-[#18181b] hover:bg-[#e5e5e5] transition-colors">
                          Complete
                        </button>
                      </div>
                      <CodeBlock code={codeSnippets.filterChip} />
                    </div>

                    {/* With Icons */}
                    <div>
                      <h3 className="text-sm font-medium text-[#71717a] mb-3">With Icons</h3>
                      <div className="flex flex-wrap gap-2 mb-4">
                        <button className="px-3 py-1.5 rounded-full text-xs font-medium bg-[#fc6] text-[#18181b] transition-colors flex items-center gap-1.5">
                          <User className="w-3 h-3" />
                          Tim Freeman
                        </button>
                        <button className="px-3 py-1.5 rounded-full text-xs font-medium bg-[#f5f5f5] text-[#18181b] hover:bg-[#e5e5e5] transition-colors flex items-center gap-1.5">
                          <Building2 className="w-3 h-3" />
                          Mountain View
                        </button>
                        <button className="px-3 py-1.5 rounded-full text-xs font-medium bg-[#f5f5f5] text-[#18181b] hover:bg-[#e5e5e5] transition-colors flex items-center gap-1.5">
                          <CalendarIcon className="w-3 h-3" />
                          Due: 7 days
                        </button>
                      </div>
                      <CodeBlock code={codeSnippets.filterChipWithIcon} />
                    </div>

                    {/* With Close Button */}
                    <div>
                      <h3 className="text-sm font-medium text-[#71717a] mb-3">With Remove Action</h3>
                      <div className="flex flex-wrap gap-2 mb-4">
                        <div className="px-3 py-1.5 rounded-full text-xs font-medium bg-[#f5f5f5] text-[#18181b] flex items-center gap-1.5">
                          <span>Tim Freeman</span>
                          <button className="ml-1 hover:bg-[#e5e5e5] rounded-full p-0.5">
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                        <div className="px-3 py-1.5 rounded-full text-xs font-medium bg-[#f5f5f5] text-[#18181b] flex items-center gap-1.5">
                          <span>Sarah Martinez</span>
                          <button className="ml-1 hover:bg-[#e5e5e5] rounded-full p-0.5">
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Badge Style */}
                    <div>
                      <h3 className="text-sm font-medium text-[#71717a] mb-3">Badge Chips</h3>
                      <div className="flex flex-wrap gap-2">
                        <Badge>Default</Badge>
                        <Badge variant="secondary">Secondary</Badge>
                        <Badge variant="outline">Outline</Badge>
                        <Badge className="bg-[#fc6] text-[#18181b]">Primary</Badge>
                        <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Success</Badge>
                        <Badge className="bg-red-100 text-red-700 hover:bg-red-100">Error</Badge>
                      </div>
                    </div>

                    {/* With Avatars */}
                    <div>
                      <h3 className="text-sm font-medium text-[#71717a] mb-3">With Avatars</h3>
                      <div className="flex flex-wrap gap-2">
                        <div className="bg-[#f5f5f5] px-3 py-1.5 rounded-full text-sm flex items-center gap-1.5">
                          <div className="bg-[#fc6] rounded-full w-5 h-5 flex items-center justify-center">
                            <span className="text-xs font-medium text-[#18181b]">TF</span>
                          </div>
                          <span>Tim Freeman</span>
                          <button className="ml-1 hover:bg-[#e5e5e5] rounded-full p-0.5">
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                        <div className="bg-[#f5f5f5] px-3 py-1.5 rounded-full text-sm flex items-center gap-1.5">
                          <div className="bg-blue-100 rounded-full w-5 h-5 flex items-center justify-center">
                            <span className="text-xs font-medium text-blue-700">SM</span>
                          </div>
                          <span>Sarah Martinez</span>
                          <button className="ml-1 hover:bg-[#e5e5e5] rounded-full p-0.5">
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Count Badges */}
                    <div>
                      <h3 className="text-sm font-medium text-[#71717a] mb-3">With Count Badges</h3>
                      <div className="flex flex-wrap gap-2">
                        <button className="px-3 py-1.5 rounded-full text-xs font-medium bg-[#f5f5f5] text-[#18181b] hover:bg-[#e5e5e5] transition-colors flex items-center gap-2">
                          <span>All Tasks</span>
                          <span className="bg-[#18181b] text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                            12
                          </span>
                        </button>
                        <button className="px-3 py-1.5 rounded-full text-xs font-medium bg-[#fc6] text-[#18181b] transition-colors flex items-center gap-2">
                          <span>Incomplete</span>
                          <span className="bg-[#18181b] text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                            5
                          </span>
                        </button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* Inputs Section */}
            <section id="inputs" className="mb-12 scroll-mt-8">
              <h2 className="text-2xl font-bold text-[#18181b] mb-6">Inputs & Textareas</h2>
              <Card>
                <CardContent className="p-6">
                  <div className="space-y-6 max-w-md">
                    <div>
                      <Label htmlFor="default-input">Default Input</Label>
                      <Input id="default-input" placeholder="Enter text..." />
                    </div>
                    <div>
                      <Label htmlFor="disabled-input">Disabled Input</Label>
                      <Input id="disabled-input" placeholder="Disabled" disabled />
                    </div>
                    <div>
                      <Label htmlFor="search-input">With Icon</Label>
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#71717a]" />
                        <Input id="search-input" className="pl-10" placeholder="Search..." />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="textarea">Textarea</Label>
                      <Textarea id="textarea" placeholder="Enter longer text..." rows={4} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* Selects Section */}
            <section id="selects" className="mb-12 scroll-mt-8">
              <h2 className="text-2xl font-bold text-[#18181b] mb-6">Selects & Dropdowns</h2>
              <Card>
                <CardContent className="p-6">
                  <div className="space-y-6 max-w-md">
                    <div>
                      <Label>Select Component</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Choose an option" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="option1">Option 1</SelectItem>
                          <SelectItem value="option2">Option 2</SelectItem>
                          <SelectItem value="option3">Option 3</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* Checkboxes Section */}
            <section id="checkboxes" className="mb-12 scroll-mt-8">
              <h2 className="text-2xl font-bold text-[#18181b] mb-6">Checkboxes & Radio Buttons</h2>
              <Card>
                <CardContent className="p-6">
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-sm font-medium text-[#71717a] mb-3">Checkboxes</h3>
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <Checkbox id="check1" />
                          <Label htmlFor="check1">Option 1</Label>
                        </div>
                        <div className="flex items-center gap-2">
                          <Checkbox id="check2" defaultChecked />
                          <Label htmlFor="check2">Option 2 (Checked)</Label>
                        </div>
                        <div className="flex items-center gap-2">
                          <Checkbox id="check3" disabled />
                          <Label htmlFor="check3">Option 3 (Disabled)</Label>
                        </div>
                      </div>
                    </div>
                    <Separator />
                    <div>
                      <h3 className="text-sm font-medium text-[#71717a] mb-3">Radio Buttons</h3>
                      <RadioGroup defaultValue="radio1">
                        <div className="flex items-center gap-2">
                          <RadioGroupItem value="radio1" id="radio1" />
                          <Label htmlFor="radio1">Option 1</Label>
                        </div>
                        <div className="flex items-center gap-2">
                          <RadioGroupItem value="radio2" id="radio2" />
                          <Label htmlFor="radio2">Option 2</Label>
                        </div>
                        <div className="flex items-center gap-2">
                          <RadioGroupItem value="radio3" id="radio3" />
                          <Label htmlFor="radio3">Option 3</Label>
                        </div>
                      </RadioGroup>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* Switches Section */}
            <section id="switches" className="mb-12 scroll-mt-8">
              <h2 className="text-2xl font-bold text-[#18181b] mb-6">Switches & Sliders</h2>
              <Card>
                <CardContent className="p-6">
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-sm font-medium text-[#71717a] mb-3">Switches</h3>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <Switch id="switch1" />
                          <Label htmlFor="switch1">Enable feature</Label>
                        </div>
                        <div className="flex items-center gap-2">
                          <Switch id="switch2" defaultChecked />
                          <Label htmlFor="switch2">Feature on</Label>
                        </div>
                      </div>
                    </div>
                    <Separator />
                    <div>
                      <h3 className="text-sm font-medium text-[#71717a] mb-3">Slider</h3>
                      <div className="max-w-md">
                        <Slider defaultValue={[50]} max={100} step={1} />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* Avatars & Badges Section */}
            <section id="avatars" className="mb-12 scroll-mt-8">
              <h2 className="text-2xl font-bold text-[#18181b] mb-6">Avatars & Badges</h2>
              <Card>
                <CardContent className="p-6">
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-sm font-medium text-[#71717a] mb-3">Avatars</h3>
                      <div className="flex items-center gap-4">
                        <Avatar>
                          <AvatarFallback className="bg-[#fc6] text-[#18181b]">TF</AvatarFallback>
                        </Avatar>
                        <Avatar>
                          <AvatarFallback className="bg-blue-100 text-blue-700">SM</AvatarFallback>
                        </Avatar>
                        <Avatar>
                          <AvatarFallback className="bg-green-100 text-green-700">JD</AvatarFallback>
                        </Avatar>
                      </div>
                    </div>
                    <Separator />
                    <div>
                      <h3 className="text-sm font-medium text-[#71717a] mb-3">Badges</h3>
                      <div className="flex flex-wrap gap-3">
                        <Badge>Default</Badge>
                        <Badge variant="secondary">Secondary</Badge>
                        <Badge variant="destructive">Destructive</Badge>
                        <Badge variant="outline">Outline</Badge>
                        <Badge className="bg-[#fc6] text-[#18181b]">Custom</Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* Progress Section */}
            <section id="progress" className="mb-12 scroll-mt-8">
              <h2 className="text-2xl font-bold text-[#18181b] mb-6">Progress & Loading States</h2>
              <Card>
                <CardContent className="p-6">
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-sm font-medium text-[#71717a] mb-3">Progress Bar</h3>
                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between text-sm mb-2">
                            <span>Progress: {progress}%</span>
                          </div>
                          <Progress value={progress} />
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" onClick={() => setProgress(Math.min(100, progress + 10))}>
                            +10%
                          </Button>
                          <Button size="sm" onClick={() => setProgress(Math.max(0, progress - 10))}>
                            -10%
                          </Button>
                        </div>
                      </div>
                    </div>
                    <Separator />
                    <div>
                      <h3 className="text-sm font-medium text-[#71717a] mb-3">Skeleton Loading</h3>
                      <div className="space-y-3">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-4 w-1/2" />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* Alerts Section */}
            <section id="alerts" className="mb-12 scroll-mt-8">
              <h2 className="text-2xl font-bold text-[#18181b] mb-6">Alerts & Notifications</h2>
              <Card>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <Alert>
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle>Information</AlertTitle>
                      <AlertDescription>
                        This is an informational alert message.
                      </AlertDescription>
                    </Alert>
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle>Error</AlertTitle>
                      <AlertDescription>
                        Something went wrong. Please try again.
                      </AlertDescription>
                    </Alert>
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* Tables Section */}
            <section id="tables" className="mb-12 scroll-mt-8">
              <h2 className="text-2xl font-bold text-[#18181b] mb-6">Tables</h2>
              <Card>
                <CardContent className="p-6">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Role</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell>Tim Freeman</TableCell>
                        <TableCell><Badge>Active</Badge></TableCell>
                        <TableCell>Admin</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Sarah Martinez</TableCell>
                        <TableCell><Badge variant="secondary">Away</Badge></TableCell>
                        <TableCell>User</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </section>

            {/* Due Date Components */}
            <section id="due-date" className="mb-12 scroll-mt-8">
              <h2 className="text-2xl font-bold text-[#18181b] mb-6">Due Date Components</h2>
              <Card>
                <CardContent className="p-6">
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-sm font-medium text-[#71717a] mb-3">Due Date Picker</h3>
                      <DueDatePicker
                        value={selectedDate}
                        onChange={setSelectedDate}
                        placeholder="Select due date"
                      />
                    </div>
                    {selectedDate && (
                      <div className="text-sm text-[#71717a]">
                        Selected: {selectedDate}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* Task Status */}
            <section id="task-status" className="mb-12 scroll-mt-8">
              <h2 className="text-2xl font-bold text-[#18181b] mb-6">Task Status Indicators</h2>
              <Card>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-[#22c55e]" />
                      <span className="text-sm">Completed</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-[#fc6]" />
                      <span className="text-sm">In Progress</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-[#71717a]" />
                      <span className="text-sm">Pending</span>
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
                  <div className="space-y-4">
                    <SaveIndicator status={saveStatus} />
                    <Button onClick={triggerSaveSequence}>
                      Trigger Save Animation
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* Tabs */}
            <section id="tabs" className="mb-12 scroll-mt-8">
              <h2 className="text-2xl font-bold text-[#18181b] mb-6">Tabs</h2>
              <Card>
                <CardContent className="p-6">
                  <Tabs defaultValue="tab1">
                    <TabsList>
                      <TabsTrigger value="tab1">Tab 1</TabsTrigger>
                      <TabsTrigger value="tab2">Tab 2</TabsTrigger>
                      <TabsTrigger value="tab3">Tab 3</TabsTrigger>
                    </TabsList>
                    <TabsContent value="tab1">
                      <p className="text-sm text-[#71717a]">Content for Tab 1</p>
                    </TabsContent>
                    <TabsContent value="tab2">
                      <p className="text-sm text-[#71717a]">Content for Tab 2</p>
                    </TabsContent>
                    <TabsContent value="tab3">
                      <p className="text-sm text-[#71717a]">Content for Tab 3</p>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </section>

            {/* Accordion */}
            <section id="accordion" className="mb-12 scroll-mt-8">
              <h2 className="text-2xl font-bold text-[#18181b] mb-6">Accordion</h2>
              <Card>
                <CardContent className="p-6">
                  <Accordion type="single" collapsible>
                    <AccordionItem value="item-1">
                      <AccordionTrigger>Section 1</AccordionTrigger>
                      <AccordionContent>
                        Content for section 1
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-2">
                      <AccordionTrigger>Section 2</AccordionTrigger>
                      <AccordionContent>
                        Content for section 2
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </CardContent>
              </Card>
            </section>

            {/* Dialog */}
            <section id="dialog" className="mb-12 scroll-mt-8">
              <h2 className="text-2xl font-bold text-[#18181b] mb-6">Dialog & Sheet</h2>
              <Card>
                <CardContent className="p-6">
                  <div className="flex gap-4">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button>Open Dialog</Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Dialog Title</DialogTitle>
                          <DialogDescription>
                            This is a dialog description.
                          </DialogDescription>
                        </DialogHeader>
                        <p className="text-sm text-[#71717a]">Dialog content goes here.</p>
                      </DialogContent>
                    </Dialog>

                    <Sheet>
                      <SheetTrigger asChild>
                        <Button variant="outline">Open Sheet</Button>
                      </SheetTrigger>
                      <SheetContent>
                        <SheetHeader>
                          <SheetTitle>Sheet Title</SheetTitle>
                          <SheetDescription>
                            This is a sheet description.
                          </SheetDescription>
                        </SheetHeader>
                        <p className="text-sm text-[#71717a] mt-4">Sheet content goes here.</p>
                      </SheetContent>
                    </Sheet>
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* Dropdown Menu */}
            <section id="dropdown" className="mb-12 scroll-mt-8">
              <h2 className="text-2xl font-bold text-[#18181b] mb-6">Dropdown Menu</h2>
              <Card>
                <CardContent className="p-6">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline">
                        Options
                        <ChevronDown className="ml-2 h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem>Edit</DropdownMenuItem>
                      <DropdownMenuItem>Duplicate</DropdownMenuItem>
                      <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </CardContent>
              </Card>
            </section>

            {/* Command Palette */}
            <section id="command" className="mb-12 scroll-mt-8">
              <h2 className="text-2xl font-bold text-[#18181b] mb-6">Command Palette</h2>
              <Card>
                <CardContent className="p-6">
                  <Command className="border rounded-lg">
                    <CommandInput placeholder="Type a command or search..." />
                    <CommandList>
                      <CommandEmpty>No results found.</CommandEmpty>
                      <CommandGroup heading="Suggestions">
                        <CommandItem>Calendar</CommandItem>
                        <CommandItem>Search Emoji</CommandItem>
                        <CommandItem>Calculator</CommandItem>
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </CardContent>
              </Card>
            </section>

            {/* Typography */}
            <section id="typography" className="mb-12 scroll-mt-8">
              <h2 className="text-2xl font-bold text-[#18181b] mb-6">Typography</h2>
              <Card>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div>
                      <h1 className="text-4xl font-bold">Heading 1</h1>
                    </div>
                    <div>
                      <h2 className="text-3xl font-semibold">Heading 2</h2>
                    </div>
                    <div>
                      <h3 className="text-2xl font-semibold">Heading 3</h3>
                    </div>
                    <div>
                      <p className="text-base text-[#18181b]">
                        Regular paragraph text. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-[#71717a]">
                        Small text. Secondary information or captions.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* Colors */}
            <section id="colors" className="mb-12 scroll-mt-8">
              <h2 className="text-2xl font-bold text-[#18181b] mb-6">Color Palette</h2>
              <Card>
                <CardContent className="p-6">
                  <div className="space-y-8">
                    {/* Brand Colors */}
                    <div>
                      <h3 className="text-sm font-semibold text-[#71717a] mb-3 uppercase">Brand Colors</h3>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                          <div className="w-full h-20 bg-[#fc6] rounded-lg mb-2" />
                          <p className="text-sm font-medium">#fc6 / #ffcc66</p>
                          <p className="text-xs text-[#71717a]">Primary Yellow</p>
                        </div>
                        <div>
                          <div className="w-full h-20 bg-[#ffcc77] rounded-lg mb-2" />
                          <p className="text-sm font-medium">#ffcc77</p>
                          <p className="text-xs text-[#71717a]">Primary Hover</p>
                        </div>
                        <div>
                          <div className="w-full h-20 bg-[#fffbf5] border border-[#fc6] rounded-lg mb-2" />
                          <p className="text-sm font-medium">#fffbf5</p>
                          <p className="text-xs text-[#71717a]">Yellow Light</p>
                        </div>
                      </div>
                    </div>

                    {/* Neutral Colors */}
                    <div>
                      <h3 className="text-sm font-semibold text-[#71717a] mb-3 uppercase">Neutral Colors</h3>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                          <div className="w-full h-20 bg-[#18181b] rounded-lg mb-2" />
                          <p className="text-sm font-medium">#18181b</p>
                          <p className="text-xs text-[#71717a]">Text Primary</p>
                        </div>
                        <div>
                          <div className="w-full h-20 bg-[#32383e] rounded-lg mb-2" />
                          <p className="text-sm font-medium">#32383e</p>
                          <p className="text-xs text-[#71717a]">Header Dark</p>
                        </div>
                        <div>
                          <div className="w-full h-20 bg-[#373f51] rounded-lg mb-2" />
                          <p className="text-sm font-medium">#373f51</p>
                          <p className="text-xs text-[#71717a]">Dark Accent</p>
                        </div>
                        <div>
                          <div className="w-full h-20 bg-[#404950] rounded-lg mb-2" />
                          <p className="text-sm font-medium">#404950</p>
                          <p className="text-xs text-[#71717a]">Dark Hover</p>
                        </div>
                        <div>
                          <div className="w-full h-20 bg-[#47515B] rounded-lg mb-2" />
                          <p className="text-sm font-medium">#47515B</p>
                          <p className="text-xs text-[#71717a]">Gray Border</p>
                        </div>
                        <div>
                          <div className="w-full h-20 bg-[#71717a] rounded-lg mb-2" />
                          <p className="text-sm font-medium">#71717a</p>
                          <p className="text-xs text-[#71717a]">Text Secondary</p>
                        </div>
                        <div>
                          <div className="w-full h-20 bg-[#9ca3af] rounded-lg mb-2" />
                          <p className="text-sm font-medium">#9ca3af</p>
                          <p className="text-xs text-[#71717a]">Text Muted</p>
                        </div>
                        <div>
                          <div className="w-full h-20 bg-[#a1a1aa] rounded-lg mb-2" />
                          <p className="text-sm font-medium">#a1a1aa</p>
                          <p className="text-xs text-[#71717a]">Text Disabled</p>
                        </div>
                        <div>
                          <div className="w-full h-20 bg-[#6b7280] rounded-lg mb-2" />
                          <p className="text-sm font-medium">#6b7280</p>
                          <p className="text-xs text-[#71717a]">Text Placeholder</p>
                        </div>
                        <div>
                          <div className="w-full h-20 bg-[#e4e4e7] border border-[#e4e4e7] rounded-lg mb-2" />
                          <p className="text-sm font-medium">#e4e4e7</p>
                          <p className="text-xs text-[#71717a]">Border Default</p>
                        </div>
                        <div>
                          <div className="w-full h-20 bg-[#f4f4f5] border border-[#e4e4e7] rounded-lg mb-2" />
                          <p className="text-sm font-medium">#f4f4f5</p>
                          <p className="text-xs text-[#71717a]">Background Hover</p>
                        </div>
                        <div>
                          <div className="w-full h-20 bg-[#f5f5f5] border border-[#e4e4e7] rounded-lg mb-2" />
                          <p className="text-sm font-medium">#f5f5f5</p>
                          <p className="text-xs text-[#71717a]">Background Light</p>
                        </div>
                        <div>
                          <div className="w-full h-20 bg-[#f9fafb] border border-[#e4e4e7] rounded-lg mb-2" />
                          <p className="text-sm font-medium">#f9fafb</p>
                          <p className="text-xs text-[#71717a]">Background Page</p>
                        </div>
                        <div>
                          <div className="w-full h-20 bg-[#e5e5e5] border border-[#e4e4e7] rounded-lg mb-2" />
                          <p className="text-sm font-medium">#e5e5e5</p>
                          <p className="text-xs text-[#71717a]">Background Active</p>
                        </div>
                        <div>
                          <div className="w-full h-20 bg-white border border-[#e4e4e7] rounded-lg mb-2" />
                          <p className="text-sm font-medium">#ffffff</p>
                          <p className="text-xs text-[#71717a]">White</p>
                        </div>
                      </div>
                    </div>

                    {/* Semantic Colors */}
                    <div>
                      <h3 className="text-sm font-semibold text-[#71717a] mb-3 uppercase">Semantic Colors</h3>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {/* Success - Green */}
                        <div>
                          <div className="w-full h-20 bg-[#22c55e] rounded-lg mb-2" />
                          <p className="text-sm font-medium">#22c55e</p>
                          <p className="text-xs text-[#71717a]">Success / Green</p>
                        </div>
                        <div>
                          <div className="w-full h-20 bg-green-100 border border-green-200 rounded-lg mb-2" />
                          <p className="text-sm font-medium">green-100</p>
                          <p className="text-xs text-[#71717a]">Success Light</p>
                        </div>
                        <div>
                          <div className="w-full h-20 bg-green-50 border border-green-200 rounded-lg mb-2" />
                          <p className="text-sm font-medium">green-50</p>
                          <p className="text-xs text-[#71717a]">Success Subtle</p>
                        </div>
                        <div>
                          <div className="w-full h-20 bg-green-50 rounded-lg mb-2 flex items-center justify-center border border-green-200">
                            <span className="text-green-700 font-medium text-sm">Text</span>
                          </div>
                          <p className="text-sm font-medium">green-700</p>
                          <p className="text-xs text-[#71717a]">Success Text</p>
                        </div>

                        {/* Error - Red */}
                        <div>
                          <div className="w-full h-20 bg-red-500 rounded-lg mb-2" />
                          <p className="text-sm font-medium">red-500</p>
                          <p className="text-xs text-[#71717a]">Error</p>
                        </div>
                        <div>
                          <div className="w-full h-20 bg-red-100 border border-red-200 rounded-lg mb-2" />
                          <p className="text-sm font-medium">red-100</p>
                          <p className="text-xs text-[#71717a]">Error Light</p>
                        </div>
                        <div>
                          <div className="w-full h-20 bg-red-50 border border-red-200 rounded-lg mb-2" />
                          <p className="text-sm font-medium">red-50</p>
                          <p className="text-xs text-[#71717a]">Error Subtle</p>
                        </div>
                        <div>
                          <div className="w-full h-20 bg-red-50 rounded-lg mb-2 flex items-center justify-center border border-red-200">
                            <span className="text-red-700 font-medium text-sm">Text</span>
                          </div>
                          <p className="text-sm font-medium">red-700</p>
                          <p className="text-xs text-[#71717a]">Error Text</p>
                        </div>

                        {/* Warning - Orange/Amber */}
                        <div>
                          <div className="w-full h-20 bg-orange-500 rounded-lg mb-2" />
                          <p className="text-sm font-medium">orange-500</p>
                          <p className="text-xs text-[#71717a]">Warning</p>
                        </div>
                        <div>
                          <div className="w-full h-20 bg-orange-100 border border-orange-200 rounded-lg mb-2" />
                          <p className="text-sm font-medium">orange-100</p>
                          <p className="text-xs text-[#71717a]">Warning Light</p>
                        </div>
                        <div>
                          <div className="w-full h-20 bg-orange-50 border border-orange-200 rounded-lg mb-2" />
                          <p className="text-sm font-medium">orange-50</p>
                          <p className="text-xs text-[#71717a]">Warning Subtle</p>
                        </div>
                        <div>
                          <div className="w-full h-20 bg-amber-50 border border-amber-200 rounded-lg mb-2" />
                          <p className="text-sm font-medium">amber-50</p>
                          <p className="text-xs text-[#71717a]">Amber Subtle</p>
                        </div>
                        <div>
                          <div className="w-full h-20 bg-amber-50 rounded-lg mb-2 flex items-center justify-center border border-amber-200">
                            <span className="text-amber-900 font-medium text-sm">Text</span>
                          </div>
                          <p className="text-sm font-medium">amber-900</p>
                          <p className="text-xs text-[#71717a]">Warning Text</p>
                        </div>

                        {/* Info - Blue */}
                        <div>
                          <div className="w-full h-20 bg-[#3b82f6] rounded-lg mb-2" />
                          <p className="text-sm font-medium">#3b82f6</p>
                          <p className="text-xs text-[#71717a]">Info / Blue</p>
                        </div>
                        <div>
                          <div className="w-full h-20 bg-blue-100 border border-blue-200 rounded-lg mb-2" />
                          <p className="text-sm font-medium">blue-100</p>
                          <p className="text-xs text-[#71717a]">Info Light</p>
                        </div>
                        <div>
                          <div className="w-full h-20 bg-blue-50 border border-blue-200 rounded-lg mb-2" />
                          <p className="text-sm font-medium">blue-50</p>
                          <p className="text-xs text-[#71717a]">Info Subtle</p>
                        </div>
                        <div>
                          <div className="w-full h-20 bg-blue-50 rounded-lg mb-2 flex items-center justify-center border border-blue-200">
                            <span className="text-blue-700 font-medium text-sm">Text</span>
                          </div>
                          <p className="text-sm font-medium">blue-700</p>
                          <p className="text-xs text-[#71717a]">Info Text</p>
                        </div>

                        {/* Purple - Tips */}
                        <div>
                          <div className="w-full h-20 bg-purple-500 rounded-lg mb-2" />
                          <p className="text-sm font-medium">purple-500</p>
                          <p className="text-xs text-[#71717a]">Purple</p>
                        </div>
                        <div>
                          <div className="w-full h-20 bg-purple-100 border border-purple-200 rounded-lg mb-2" />
                          <p className="text-sm font-medium">purple-100</p>
                          <p className="text-xs text-[#71717a]">Purple Light</p>
                        </div>
                        <div>
                          <div className="w-full h-20 bg-purple-50 border border-purple-200 rounded-lg mb-2" />
                          <p className="text-sm font-medium">purple-50</p>
                          <p className="text-xs text-[#71717a]">Purple Subtle</p>
                        </div>
                        <div>
                          <div className="w-full h-20 bg-purple-50 rounded-lg mb-2 flex items-center justify-center border border-purple-200">
                            <span className="text-purple-900 font-medium text-sm">Text</span>
                          </div>
                          <p className="text-sm font-medium">purple-900</p>
                          <p className="text-xs text-[#71717a]">Purple Text</p>
                        </div>

                        {/* Gray Shades */}
                        <div>
                          <div className="w-full h-20 bg-gray-50 border border-gray-200 rounded-lg mb-2" />
                          <p className="text-sm font-medium">gray-50</p>
                          <p className="text-xs text-[#71717a]">Gray Light</p>
                        </div>
                        <div>
                          <div className="w-full h-20 bg-gray-100 border border-gray-300 rounded-lg mb-2" />
                          <p className="text-sm font-medium">gray-100</p>
                          <p className="text-xs text-[#71717a]">Gray</p>
                        </div>
                      </div>
                    </div>

                    {/* Usage Guide */}
                    <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <h4 className="font-semibold text-blue-900 mb-2">Color Usage Guide</h4>
                      <ul className="text-sm text-blue-900 space-y-1">
                        <li><strong>Primary (#fc6):</strong> Buttons, focus states, active elements</li>
                        <li><strong>Neutrals:</strong> Text, backgrounds, borders</li>
                        <li><strong>Success (Green):</strong> Completed tasks, success messages</li>
                        <li><strong>Error (Red):</strong> Validation errors, destructive actions</li>
                        <li><strong>Warning (Orange/Amber):</strong> Due dates, caution states</li>
                        <li><strong>Info (Blue):</strong> Links, informational messages</li>
                        <li><strong>Purple:</strong> Tips and special highlights</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* Icons */}
            <section id="icons" className="mb-12 scroll-mt-8">
              <h2 className="text-2xl font-bold text-[#18181b] mb-6">Icon Library (Lucide React)</h2>
              <Card>
                <CardContent className="p-6">
                  <div className="grid grid-cols-4 md:grid-cols-8 gap-6">
                    <div className="flex flex-col items-center gap-2">
                      <Check className="h-6 w-6" />
                      <span className="text-xs">Check</span>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                      <X className="h-6 w-6" />
                      <span className="text-xs">X</span>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                      <Search className="h-6 w-6" />
                      <span className="text-xs">Search</span>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                      <Upload className="h-6 w-6" />
                      <span className="text-xs">Upload</span>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                      <Trash2 className="h-6 w-6" />
                      <span className="text-xs">Trash</span>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                      <User className="h-6 w-6" />
                      <span className="text-xs">User</span>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                      <CalendarIcon className="h-6 w-6" />
                      <span className="text-xs">Calendar</span>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                      <Settings className="h-6 w-6" />
                      <span className="text-xs">Settings</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* Calendar */}
            <section id="calendar" className="mb-12 scroll-mt-8">
              <h2 className="text-2xl font-bold text-[#18181b] mb-6">Calendar</h2>
              <Card>
                <CardContent className="p-6">
                  <Calendar mode="single" className="rounded-md border" />
                </CardContent>
              </Card>
            </section>

          </div>
        </div>
      </div>
    </div>
  );
}