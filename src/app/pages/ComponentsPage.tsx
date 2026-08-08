/**
 * ComponentsPage  —  /test/components
 *
 * Live catalog of every design-system primitive in src/app/components/design-system/,
 * rendered with real props rather than screenshots. Companion to /test/colors and
 * /test/typography — same "pull from the real source" philosophy.
 */

import { ReactNode, useState } from 'react';
import { Star, Inbox, Settings, User, LogOut } from 'lucide-react';

import { Avatar } from '../components/design-system/Avatar';
import { AvatarStack } from '../components/design-system/AvatarStack';
import { BackButton } from '../components/design-system/BackButton';
import { Breadcrumb } from '../components/design-system/Breadcrumb';
import { Button } from '../components/design-system/Button';
import { Card, CardHeader, CardBody, CardFooter } from '../components/design-system/Card';
import { CommentItem } from '../components/design-system/CommentItem';
import { DateChip } from '../components/design-system/DateChip';
import { EmptyState } from '../components/design-system/EmptyState';
import { FileRow } from '../components/design-system/FileRow';
import { FileUploadDropzone } from '../components/design-system/FileUploadDropzone';
import { DocumentPreviewModal } from '../components/multi-file-upload-panel/DocumentPreviewModal';
import { FilterChip } from '../components/design-system/FilterChip';
import { PageHeader } from '../components/design-system/PageHeader';
import { Pagination } from '../components/design-system/Pagination';
import { Pill, type PillColor } from '../components/design-system/Pill';
import { SearchInput } from '../components/design-system/SearchInput';
import { Select } from '../components/design-system/Select';
import { StatusBadge, type TaskStatus } from '../components/design-system/StatusBadge';
import { Tab, TabStrip } from '../components/design-system/Tab';
import { TopNavButton } from '../components/design-system/TopNavButton';
import { YesNoCard, type YesNoValue } from '../components/design-system/YesNoCard';

import { TopNav } from '../components/TopNav';
import { TasksHeader } from '../components/TasksHeader';
import { SaveIndicator } from '../components/SaveIndicator';
import { DueDatePicker } from '../components/DueDatePicker';
import { RelativeDuePicker } from '../components/RelativeDuePicker';

import { UserAvatar } from '../components/task-table/UserAvatar';
import { CheckboxIcon } from '../components/task-table/CheckboxIcon';
import { SortButton } from '../components/task-table/SortButton';
import { QuickDateButton } from '../components/task-table/QuickDateButton';
import { AttentionBadge } from '../components/task-table/AttentionBadge';
import { DueDateBadge } from '../components/task-table/DueDateBadge';

import {
  Popover as UIPopover,
  PopoverTrigger as UIPopoverTrigger,
  PopoverContent as UIPopoverContent,
} from '../components/ui/popover';
import { Calendar as UICalendar } from '../components/ui/calendar';
import {
  DropdownMenu as UIDropdownMenu,
  DropdownMenuTrigger as UIDropdownMenuTrigger,
  DropdownMenuContent as UIDropdownMenuContent,
  DropdownMenuItem as UIDropdownMenuItem,
  DropdownMenuSeparator as UIDropdownMenuSeparator,
  DropdownMenuLabel as UIDropdownMenuLabel,
} from '../components/ui/dropdown-menu';
import {
  Select as UISelect,
  SelectTrigger as UISelectTrigger,
  SelectValue as UISelectValue,
  SelectContent as UISelectContent,
  SelectItem as UISelectItem,
} from '../components/ui/select';
import {
  Command as UICommand,
  CommandInput as UICommandInput,
  CommandList as UICommandList,
  CommandEmpty as UICommandEmpty,
  CommandGroup as UICommandGroup,
  CommandItem as UICommandItem,
} from '../components/ui/command';

function SectionHeading({ children, source }: { children: ReactNode; source: string }) {
  return (
    <div className="mt-8 mb-3 first:mt-0 flex items-baseline justify-between gap-3">
      <h2 className="text-[13px] font-semibold text-[#18181b]">{children}</h2>
      <code className="text-[11px] text-[#9ca3af]">{source}</code>
    </div>
  );
}

function Swatch({ children, dark }: { children: ReactNode; dark?: boolean }) {
  return (
    <div
      className={`border border-[#e4e4e7] rounded-[6px] p-4 flex flex-wrap items-center gap-3 ${dark ? 'bg-[#32383e]' : 'bg-white'}`}
    >
      {children}
    </div>
  );
}

const PILL_COLORS: PillColor[] = ['neutral', 'yellow', 'green', 'blue', 'red', 'purple'];
const STATUSES: TaskStatus[] = ['In Progress', 'Complete', 'Blocked', 'Not Started'];

export function ComponentsPage() {
  const [search, setSearch] = useState('due date');
  const [selectValue, setSelectValue] = useState('clinical');
  const [activeTab, setActiveTab] = useState('details');
  const [yesNo, setYesNo] = useState<YesNoValue>('yes');
  const [page, setPage] = useState(2);
  const [filterActive, setFilterActive] = useState(true);
  const [uiSelectValue, setUiSelectValue] = useState('clinical');
  const [dueDateValue, setDueDateValue] = useState('07/23/2026');
  const [topNavPage, setTopNavPage] = useState<'home' | 'tasks' | 'checklists' | 'admin' | 'settings'>('tasks');
  const [taskCompleted, setTaskCompleted] = useState(false);
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
  const [previewOpen, setPreviewOpen] = useState(false);

  return (
    <div className="h-full flex flex-col bg-[#f9fafb]">
      <div className="px-[24px] pt-[24px] pb-[16px] border-b border-[#e4e4e7] bg-white shrink-0">
        <p className="text-[11px] font-medium text-[#6b7280] uppercase tracking-wide mb-[2px]">Test Page</p>
        <h1 className="text-[20px] font-semibold text-[#18181b] leading-[28px]">Components</h1>
        <p className="mt-[4px] text-[13px] text-[#6b7280]">
          Every design-system primitive, rendered live with real props — not screenshots.
        </p>
      </div>

      <div className="flex-1 overflow-auto px-[24px] py-6 max-w-[1000px]">
        <SectionHeading source="design-system/Avatar.tsx">Avatar</SectionHeading>
        <Swatch>
          <Avatar initials="TF" name="Tim Freeman" size="sm" />
          <Avatar initials="EC" name="Emily Chen" size="md" />
          <Avatar initials="DB" name="David Brown" size="lg" />
          <Avatar initials="RP" name="Robert Park" size="md" color="#fc6" />
        </Swatch>

        <SectionHeading source="design-system/AvatarStack.tsx">Avatar Stack</SectionHeading>
        <Swatch>
          <AvatarStack
            users={[
              { initials: 'TF', name: 'Tim Freeman' },
              { initials: 'EC', name: 'Emily Chen' },
              { initials: 'DB', name: 'David Brown' },
              { initials: 'RP', name: 'Robert Park' },
              { initials: 'SM', name: 'Sarah Miller' },
            ]}
            max={3}
          />
        </Swatch>

        <SectionHeading source="design-system/BackButton.tsx">Back Button</SectionHeading>
        <Swatch>
          <BackButton onClick={() => {}}>Project Builder</BackButton>
        </Swatch>

        <SectionHeading source="design-system/Breadcrumb.tsx">Breadcrumb</SectionHeading>
        <Swatch>
          <Breadcrumb
            items={[
              { label: 'Chapter 3', onClick: () => {} },
              { label: 'Element b', onClick: () => {} },
              { label: 'Meeting Minutes' },
            ]}
          />
        </Swatch>

        <SectionHeading source="design-system/Button.tsx">Button</SectionHeading>
        <Swatch>
          <Button variant="primary">Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="danger">Danger</Button>
          <Button variant="primary" size="sm">Small</Button>
          <Button variant="primary" disabled>Disabled</Button>
        </Swatch>

        <SectionHeading source="design-system/Card.tsx">Card</SectionHeading>
        <Swatch>
          <Card className="w-[260px]" elevated>
            <CardHeader>
              <p className="text-[14px] font-semibold text-[#18181b]">340B Pharmacy Audit</p>
            </CardHeader>
            <CardBody>
              <p className="text-[13px] text-[#6b7280]">5 of 12 tasks complete</p>
            </CardBody>
            <CardFooter>
              <span>Downtown Medical Center</span>
              <StatusBadge status="In Progress" />
            </CardFooter>
          </Card>
        </Swatch>

        <SectionHeading source="design-system/CommentItem.tsx">Comment Item</SectionHeading>
        <Swatch>
          <CommentItem author={{ initials: 'TF', name: 'Tim Freeman' }} timestamp="2h ago">
            Uploaded the revised policy doc — ready for another look.
          </CommentItem>
        </Swatch>

        <SectionHeading source="design-system/DateChip.tsx">Date Chip</SectionHeading>
        <Swatch>
          <DateChip value="07/23/2026" onClick={() => {}} />
          <DateChip placeholder="Select Date" onClick={() => {}} />
          <DateChip value="07/23/2026" highlighted onClick={() => {}} />
        </Swatch>

        <SectionHeading source="design-system/EmptyState.tsx">Empty State</SectionHeading>
        <Swatch>
          <EmptyState
            icon={<Inbox className="size-6" />}
            title="No comments yet"
            description="Comments left on this task will show up here."
            action={<Button variant="secondary" size="sm">Add comment</Button>}
            className="w-full"
          />
        </Swatch>

        <SectionHeading source="design-system/FileRow.tsx">File Row</SectionHeading>
        <Swatch>
          <FileRow
            name="Site-Visit-Protocol.pdf"
            size={482_000}
            category="Documentation"
            onPreview={() => {}}
            onDownload={() => {}}
            onDelete={() => {}}
            className="w-full"
          />
        </Swatch>

        <SectionHeading source="design-system/FileUploadDropzone.tsx">File Upload Dropzone</SectionHeading>
        <Swatch>
          <FileUploadDropzone onFiles={() => {}} className="w-full" />
        </Swatch>
        <Swatch>
          <FileUploadDropzone onFiles={() => {}} compact className="w-full" />
        </Swatch>

        <SectionHeading source="design-system/FilterChip.tsx">Filter Chip</SectionHeading>
        <Swatch>
          <FilterChip active={filterActive} count={12} onClick={() => setFilterActive((v) => !v)}>
            In Progress
          </FilterChip>
          <FilterChip active={!filterActive} count={4} onClick={() => setFilterActive((v) => !v)}>
            Complete
          </FilterChip>
        </Swatch>

        <SectionHeading source="design-system/PageHeader.tsx">Page Header — with back button</SectionHeading>
        <Swatch>
          <PageHeader
            eyebrow={<BackButton onClick={() => {}}>Project Builder</BackButton>}
            title="340B Pharmacy Compliance Audit"
            description="Downtown Medical Center · Due 07/23/2026"
            actions={<Button variant="primary">Save</Button>}
            className="w-full"
          />
        </Swatch>

        <SectionHeading source="design-system/PageHeader.tsx">Page Header — without back button</SectionHeading>
        <Swatch>
          <PageHeader
            title="Health Center Fields"
            description="Global catalog of fields available to every project."
            actions={<Button variant="primary">Add Field</Button>}
            className="w-full"
          />
        </Swatch>

        <SectionHeading source="design-system/Pagination.tsx">Pagination</SectionHeading>
        <Swatch>
          <Pagination
            current={page}
            total={6}
            onPrev={() => setPage((p) => Math.max(1, p - 1))}
            onNext={() => setPage((p) => Math.min(6, p + 1))}
            className="w-full"
          />
        </Swatch>

        <SectionHeading source="design-system/Pill.tsx">Pill</SectionHeading>
        <Swatch>
          {PILL_COLORS.map((c) => (
            <Pill key={c} color={c}>
              {c[0].toUpperCase() + c.slice(1)}
            </Pill>
          ))}
        </Swatch>

        <SectionHeading source="design-system/SearchInput.tsx">Search Input</SectionHeading>
        <Swatch>
          <SearchInput
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onClear={() => setSearch('')}
            placeholder="Search tasks…"
          />
          <SearchInput size="md" placeholder="Search (md)…" />
        </Swatch>

        <SectionHeading source="design-system/Select.tsx">Select</SectionHeading>
        <Swatch>
          <Select value={selectValue} onChange={(e) => setSelectValue(e.target.value)} className="w-[200px]">
            <option value="clinical">Clinical</option>
            <option value="fiscal">Fiscal</option>
            <option value="governance">Governance</option>
          </Select>
        </Swatch>

        <SectionHeading source="design-system/StatusBadge.tsx">Status Badge</SectionHeading>
        <Swatch>
          {STATUSES.map((s) => (
            <StatusBadge key={s} status={s} />
          ))}
        </Swatch>

        <SectionHeading source="design-system/Tab.tsx">Tab / Tab Strip</SectionHeading>
        <Swatch>
          <TabStrip className="w-full max-w-[360px]">
            {['details', 'comments', 'activity'].map((t) => (
              <Tab key={t} active={activeTab === t} onClick={() => setActiveTab(t)}>
                {t[0].toUpperCase() + t.slice(1)}
              </Tab>
            ))}
          </TabStrip>
        </Swatch>

        <SectionHeading source="design-system/TopNavButton.tsx">TopNav Button</SectionHeading>
        <Swatch dark>
          <TopNavButton active>Tasks</TopNavButton>
          <TopNavButton>Admin</TopNavButton>
        </Swatch>

        <SectionHeading source="design-system/YesNoCard.tsx">Yes / No Card</SectionHeading>
        <Swatch>
          <YesNoCard value={yesNo} onChange={setYesNo} />
        </Swatch>

        <h2 className="text-[13px] font-semibold text-[#6b7280] uppercase tracking-wide mt-10 mb-3">App shell</h2>

        <SectionHeading source="components/TopNav.tsx">Top Navigation</SectionHeading>
        <div className="border border-[#e4e4e7] rounded-[6px] overflow-x-auto">
          <TopNav
            currentPage={topNavPage}
            onNavChange={setTopNavPage}
            user={{ name: 'Tim Freeman', initials: 'TF' }}
            isAdmin
            canChangeHC
            selectedHC="Downtown Medical Center"
            onHCChange={() => {}}
            healthCenterNames={['Downtown Medical Center', 'Westside Health Clinic', 'Mountain View Clinic']}
            users={[
              { name: 'Tim Freeman', initials: 'TF' },
              { name: 'Emily Chen', initials: 'EC' },
            ]}
            onUserChange={() => {}}
          />
        </div>

        <SectionHeading source="components/SideNavigation.tsx">Side Navigation</SectionHeading>
        <div className="px-4 py-3 border border-[#e4e4e7] rounded-[6px] bg-white text-[13px] text-[#6b7280]">
          Not embedded live here — it renders with <code className="text-[12px]">fixed left-0 top-[80px]</code>{' '}
          positioning against the viewport (see <code className="text-[12px]">SideNavigation.tsx:149</code>), so a
          second instance would overlay this app&rsquo;s real left rail rather than sit inside this card. You&rsquo;re
          already looking at the live component — it&rsquo;s the rail to the left of this page. Full interactive
          variants (collapsed, per pageType) are in Storybook under &ldquo;App Shell/SideNavigation&rdquo;.
        </div>

        <SectionHeading source="components/TasksHeader.tsx">Tasks Header</SectionHeading>
        <Swatch>
          <TasksHeader tableSaveStatus="saved" onAddTask={() => {}} />
        </Swatch>

        <SectionHeading source="components/SaveIndicator.tsx">Save Indicator</SectionHeading>
        <Swatch>
          <SaveIndicator status="saving" />
          <SaveIndicator status="saved" />
        </Swatch>

        <h2 className="text-[13px] font-semibold text-[#6b7280] uppercase tracking-wide mt-10 mb-3">Date selection</h2>

        <SectionHeading source="components/DueDatePicker.tsx">Due Date Picker</SectionHeading>
        <Swatch>
          <DueDatePicker
            value={dueDateValue}
            onSelect={setDueDateValue}
            triggerClassName="flex items-center gap-1 px-3 py-1.5 border border-[#e4e4e7] rounded-[6px] text-[13px] text-[#18181b] bg-white"
          />
        </Swatch>

        <SectionHeading source="components/RelativeDuePicker.tsx">Relative Due Picker</SectionHeading>
        <Swatch>
          <RelativeDuePicker
            currentProjectName="340B Pharmacy Compliance Audit"
            projectStartDate="07/01/2026"
            projectEndDate="09/30/2026"
            onSave={() => {}}
            className="w-full max-w-[420px]"
          />
        </Swatch>

        <SectionHeading source="components/ui/calendar.tsx">Calendar (Radix / react-day-picker)</SectionHeading>
        <Swatch>
          <UICalendar mode="single" className="border border-[#e4e4e7] rounded-[6px] bg-white" />
        </Swatch>

        <SectionHeading source="components/ui/popover.tsx">Popover (Radix)</SectionHeading>
        <Swatch>
          <UIPopover>
            <UIPopoverTrigger asChild>
              <Button variant="secondary" size="sm">Open popover</Button>
            </UIPopoverTrigger>
            <UIPopoverContent className="text-[13px] text-[#18181b]">
              Generic floating content anchored to its trigger — the base primitive
              behind <code className="text-[12px]">DueDatePicker</code>.
            </UIPopoverContent>
          </UIPopover>
        </Swatch>

        <h2 className="text-[13px] font-semibold text-[#6b7280] uppercase tracking-wide mt-10 mb-3">Dropdown &amp; input primitives (Radix)</h2>

        <SectionHeading source="components/ui/dropdown-menu.tsx">Dropdown Menu</SectionHeading>
        <Swatch>
          <UIDropdownMenu>
            <UIDropdownMenuTrigger asChild>
              <Button variant="secondary" size="sm">Open menu</Button>
            </UIDropdownMenuTrigger>
            <UIDropdownMenuContent>
              <UIDropdownMenuLabel>Account</UIDropdownMenuLabel>
              <UIDropdownMenuSeparator />
              <UIDropdownMenuItem>
                <User className="size-4" /> Profile
              </UIDropdownMenuItem>
              <UIDropdownMenuItem>
                <Settings className="size-4" /> Settings
              </UIDropdownMenuItem>
              <UIDropdownMenuSeparator />
              <UIDropdownMenuItem variant="destructive">
                <LogOut className="size-4" /> Log out
              </UIDropdownMenuItem>
            </UIDropdownMenuContent>
          </UIDropdownMenu>
        </Swatch>

        <SectionHeading source="components/ui/select.tsx">Select (Radix combobox)</SectionHeading>
        <Swatch>
          <UISelect value={uiSelectValue} onValueChange={setUiSelectValue}>
            <UISelectTrigger className="w-[200px]">
              <UISelectValue placeholder="Select a category" />
            </UISelectTrigger>
            <UISelectContent>
              <UISelectItem value="clinical">Clinical</UISelectItem>
              <UISelectItem value="fiscal">Fiscal</UISelectItem>
              <UISelectItem value="governance">Governance</UISelectItem>
            </UISelectContent>
          </UISelect>
          <span className="text-[12px] text-[#9ca3af]">
            Distinct from design-system/Select above — this is the Radix-based combobox used inside
            RelativeDuePicker; the plain one wraps a native &lt;select&gt;.
          </span>
        </Swatch>

        <SectionHeading source="components/ui/command.tsx">Command (palette list)</SectionHeading>
        <Swatch>
          <UICommand className="border border-[#e4e4e7] rounded-[6px] w-full max-w-[320px]">
            <UICommandInput placeholder="Search health centers…" />
            <UICommandList>
              <UICommandEmpty>No results found.</UICommandEmpty>
              <UICommandGroup heading="Health Centers">
                <UICommandItem>Downtown Medical Center</UICommandItem>
                <UICommandItem>Westside Health Clinic</UICommandItem>
                <UICommandItem>Mountain View Clinic</UICommandItem>
              </UICommandGroup>
            </UICommandList>
          </UICommand>
        </Swatch>

        <h2 className="text-[13px] font-semibold text-[#6b7280] uppercase tracking-wide mt-10 mb-3">Task table primitives</h2>

        <SectionHeading source="task-table/UserAvatar.tsx">User Avatar (row-level)</SectionHeading>
        <Swatch>
          <UserAvatar user={{ initials: 'TF', name: 'Tim Freeman' }} />
        </Swatch>

        <SectionHeading source="task-table/CheckboxIcon.tsx">Checkbox Icon</SectionHeading>
        <Swatch>
          <button onClick={() => setTaskCompleted((v) => !v)} className="size-5">
            <CheckboxIcon completed={taskCompleted} />
          </button>
          <span className="text-[12px] text-[#9ca3af]">Click to toggle</span>
        </Swatch>

        <SectionHeading source="task-table/SortButton.tsx">Sort Button</SectionHeading>
        <Swatch>
          <SortButton
            label="Due Date"
            sortColumn="dueDate"
            currentColumn="dueDate"
            sortDirection={sortDir}
            onSort={() => setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))}
          />
        </Swatch>

        <SectionHeading source="task-table/QuickDateButton.tsx">Quick Date Button</SectionHeading>
        <Swatch>
          <div className="w-[140px] bg-white">
            <QuickDateButton label="Today" onClick={() => {}} />
            <QuickDateButton label="In 7 days" onClick={() => {}} />
          </div>
        </Swatch>

        <SectionHeading source="task-table/AttentionBadge.tsx">Attention Badge</SectionHeading>
        <Swatch>
          <AttentionBadge attention={{ type: 'needs', count: 2 }} />
          <AttentionBadge attention={{ type: 'missing', count: 1 }} />
        </Swatch>

        <SectionHeading source="task-table/DueDateBadge.tsx">Due Date Badge</SectionHeading>
        <Swatch>
          <DueDateBadge dueDate="09/15/2026" onOpenChange={() => {}} />
          <DueDateBadge dueDate="01/01/2026" onOpenChange={() => {}} />
          <DueDateBadge ruleBroken ruleSummary="7 days after Kickoff" onOpenChange={() => {}} />
        </Swatch>

        <h2 className="text-[13px] font-semibold text-[#6b7280] uppercase tracking-wide mt-10 mb-3">Task overlay panel</h2>

        <SectionHeading source="components/MultiFileUploadPanel.tsx">Task Overlay Panel</SectionHeading>
        <div className="px-4 py-3 border border-[#e4e4e7] rounded-[6px] bg-white text-[13px] text-[#6b7280]">
          The right-hand sliding panel itself isn&rsquo;t embedded here — like Side Navigation, it&rsquo;s a
          fixed-position, full-height overlay (and, per <code className="text-[12px]">CLAUDE.md</code>, still a
          ~1,500-line god component composing its own file-upload, subtask, and comment state) rather than a small
          reusable primitive. Open any task from <code className="text-[12px]">/tasks/my-tasks</code> to see it live.
          Its two extracted leaf pieces are cataloged individually: <code className="text-[12px]">CommentItem</code>{' '}
          above, and <code className="text-[12px]">DocumentPreviewModal</code> below.
        </div>

        <SectionHeading source="multi-file-upload-panel/DocumentPreviewModal.tsx">Document Preview Modal</SectionHeading>
        <Swatch>
          <Button variant="secondary" size="sm" onClick={() => setPreviewOpen(true)}>
            Preview a file
          </Button>
        </Swatch>
        {previewOpen && (
          <DocumentPreviewModal
            file={{ id: 'f1', name: 'Site-Visit-Protocol.pdf', size: 482_000, category: 'Documentation' }}
            onClose={() => setPreviewOpen(false)}
            onDownload={() => {}}
            onOpenInNew={() => {}}
          />
        )}

        <div className="mt-8 mb-4 px-4 py-3 rounded-[6px] bg-[#dbeafe] border border-[#e4e4e7] text-[13px] text-[#1e40af]">
          <Star className="inline size-3.5 -mt-0.5 mr-1" />
          These are also documented interactively in Storybook (<code className="text-[12px]">npm run storybook</code>)
          with full prop controls — this page is the quick at-a-glance version, in the app itself.
        </div>
      </div>
    </div>
  );
}
