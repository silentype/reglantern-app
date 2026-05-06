/**
 * Accurate Code Snippets
 * Real component code examples from the Reglantern application
 */

export const accurateCodeSnippets = {
  // Primary Action Button (Yellow Brand)
  primaryButton: `<button className="bg-[#fc6] flex gap-2 h-10 items-center px-4 py-2 rounded-md shadow-[0px_1px_3px_0px_rgba(0,0,0,0.05)] hover:bg-[#ffcc77] transition-colors">
  <span className="font-medium text-[#18181b] text-sm">
    Add a Task
  </span>
</button>`,

  // Primary Button with Icon
  primaryButtonWithIcon: `<button className="bg-[#fc6] flex gap-2 h-10 items-center px-4 py-2 rounded-md shadow-[0px_1px_3px_0px_rgba(0,0,0,0.05)] hover:bg-[#ffcc77] transition-colors">
  <span className="font-medium text-[#18181b] text-sm">Upload</span>
  <Upload className="w-4 h-4 text-[#18181b]" />
</button>`,

  // Secondary Button (White/Border)
  secondaryButton: `<button className="bg-white border border-[#cdd7e1] px-4 py-2 rounded-md text-sm font-medium text-[#18181b] hover:bg-[#f9fafb] transition-colors">
  Browse Files
</button>`,

  // Filter Chip - Inactive
  filterChipInactive: `<button className="px-3 py-1.5 rounded-full text-xs font-medium bg-[#f5f5f5] text-[#18181b] hover:bg-[#e5e5e5] transition-colors">
  All Tasks
</button>`,

  // Filter Chip - Active (Yellow)
  filterChipActive: `<button className="px-3 py-1.5 rounded-full text-xs font-medium bg-[#fc6] text-[#18181b] transition-colors">
  All Tasks
</button>`,

  // Filter Chip with Icon
  filterChipWithIcon: `<button className="px-3 py-1.5 rounded-full text-xs font-medium bg-[#fc6] text-[#18181b] flex items-center gap-1.5">
  <User className="w-3 h-3" />
  Tim Freeman
</button>`,

  // Removable Tag
  removableTag: `<div className="bg-[#f5f5f5] px-3 py-1.5 rounded-full text-sm flex items-center gap-1.5">
  <div className="bg-[#fc6] w-5 h-5 rounded-full flex items-center justify-center">
    <span className="text-xs font-medium text-[#18181b]">TF</span>
  </div>
  <span className="text-sm text-[#18181b]">Tim Freeman</span>
  <button className="ml-1 hover:bg-[#e5e5e5] rounded-full p-0.5">
    <X className="w-3 h-3" />
  </button>
</div>`,

  // Avatar with Initials
  avatar: `<div className="bg-[#fc6] w-8 h-8 rounded-full flex items-center justify-center">
  <span className="text-sm font-medium text-[#18181b]">TF</span>
</div>`,

  // Custom Checkbox (Completed)
  checkboxCompleted: `<div className="size-5 shrink-0 cursor-pointer">
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
</div>`,

  // Custom Checkbox (Uncompleted)
  checkboxUncompleted: `<div className="size-5 shrink-0 cursor-pointer">
  <svg className="block size-full" fill="none" viewBox="0 0 20 20">
    <circle cx="10" cy="10" r="9.5" stroke="#71717A" />
  </svg>
</div>`,

  // Status Select with Command
  statusSelect: `<Popover open={statusOpen} onOpenChange={setStatusOpen}>
  <PopoverTrigger asChild>
    <button className="bg-white border border-[#e4e4e7] rounded-md px-3 py-2 text-sm focus:outline-none focus:border-[#fc6] w-[200px] flex items-center justify-between hover:bg-[#f9fafb]">
      <span className="text-[#18181b]">{status}</span>
      <ChevronsUpDown className="h-4 w-4 opacity-50" />
    </button>
  </PopoverTrigger>
  <PopoverContent className="w-[200px] p-0">
    <Command>
      <CommandList>
        <CommandGroup>
          {statusOptions.map((status) => (
            <CommandItem key={status} value={status} onSelect={() => setStatus(status)}>
              <Check className={\`mr-2 h-4 w-4 \${currentStatus === status ? 'opacity-100' : 'opacity-0'}\`} />
              {status}
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </Command>
  </PopoverContent>
</Popover>`,

  // Tab Buttons
  tabButtons: `<div className="bg-[#f4f4f5] p-1 rounded-md flex gap-0">
  <button className="flex-1 px-3 py-1.5 text-sm font-medium rounded transition-all bg-white text-[#18181b] shadow-sm">
    Details
  </button>
  <button className="flex-1 px-3 py-1.5 text-sm font-medium rounded transition-all bg-transparent text-[#6b7280] hover:text-[#18181b]">
    Comments
  </button>
  <button className="flex-1 px-3 py-1.5 text-sm font-medium rounded transition-all bg-transparent text-[#6b7280] hover:text-[#18181b]">
    Activity
  </button>
</div>`,

  // Date Badge (Overdue)
  dateBadgeOverdue: `<div className="inline-flex items-center gap-1.5 px-2 py-1 bg-red-100 border border-red-200 rounded text-xs">
  <CalendarIcon className="w-3 h-3 text-red-600" />
  <span className="text-red-600">Overdue by 2 days</span>
</div>`,

  // Date Badge (Due Soon)
  dateBadgeDueSoon: `<div className="inline-flex items-center gap-1.5 px-2 py-1 bg-amber-50 border border-amber-100 rounded text-xs">
  <CalendarIcon className="w-3 h-3 text-amber-600" />
  <span className="text-amber-600">Due in 3 days</span>
</div>`,

  // Save Indicator
  saveIndicator: `<SaveIndicator status={saveStatus} />

// saveStatus can be:
// - 'idle': No indicator shown
// - 'saving': Shows "Saving..." with spinner
// - 'saved': Shows "Saved" with checkmark`,

  // Upload Progress Bar
  uploadProgress: `<div className="bg-white border rounded-lg p-4 flex items-center gap-3 relative overflow-hidden border-[#3b82f6]">
  {/* Progress background */}
  <div 
    className="absolute inset-0 bg-[#dbeafe]" 
    style={{ width: \`\${progress}%\`, opacity: 0.5 }}
  />
  
  {/* Icon */}
  <Upload className="size-8 text-[#3b82f6] animate-pulse z-10" />
  
  {/* File info */}
  <div className="flex-1 min-w-0 z-10">
    <p className="text-sm text-[#212121] truncate">Document.pdf</p>
    <p className="text-xs text-[#8c8c8c]">Category • 2.5MB</p>
  </div>
  
  {/* Progress percentage */}
  <span className="text-xs font-medium text-[#3b82f6] z-10">{progress}%</span>
</div>`,

  // Dropdown Expandable
  dropdownExpandable: `<button className="w-full bg-white border border-[#e4e4e7] rounded-md cursor-pointer focus:border-[#fc6] transition-all text-left">
  <div className="flex items-center justify-between px-3 py-2.5">
    <span className="text-sm text-[#18181b]">Uploads overview</span>
    <div className="flex items-center gap-3 text-sm text-[#18181b]">
      <span>3 of 5 files uploaded</span>
      <ChevronDown className="w-4 h-4" />
    </div>
  </div>
</button>`,

  // Input with Label (Inline)
  inputInline: `<div className="flex items-center gap-2">
  <User size={20} className="text-[#18181b]" />
  <span className="text-sm text-[#18181b] w-[104px]">Assigned to</span>
  <input 
    className="flex-1 max-w-[240px] bg-white border border-[#e4e4e7] rounded-md px-3 py-2 text-sm focus:outline-none focus:border-[#fc6]"
    placeholder="Select User"
  />
</div>`,

  // Alert/Notification Badge
  alertBadge: `<div className="inline-flex items-center gap-1.5 px-2 py-1 bg-orange-50 border border-orange-200 rounded text-xs">
  <AlertCircle className="w-3 h-3 text-orange-600" />
  <span className="text-orange-600">Needs 3 documents</span>
</div>`,

  // More Menu (3 dots)
  moreMenu: `<DropdownMenu>
  <DropdownMenuTrigger asChild>
    <button className="p-1 hover:bg-[#f4f4f5] rounded transition-colors">
      <MoreHorizontal className="w-4 h-4 text-[#71717a]" />
    </button>
  </DropdownMenuTrigger>
  <DropdownMenuContent align="end">
    <DropdownMenuItem>Edit</DropdownMenuItem>
    <DropdownMenuItem>Duplicate</DropdownMenuItem>
    <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>`,

  // Multi-select Status Dropdown
  multiSelectStatus: `<Popover open={open} onOpenChange={setOpen}>
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
                setSelectedStatuses(prev =>
                  prev.includes(status)
                    ? prev.filter(s => s !== status)
                    : [...prev, status]
                );
              }}
            >
              <Check
                className={\`mr-2 h-4 w-4 \${
                  selectedStatuses.includes(status) ? 'opacity-100' : 'opacity-0'
                }\`}
              />
              {status}
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </Command>
  </PopoverContent>
</Popover>`,

  // Button (from UI components)
  uiButton: `<Button 
  variant="outline"  // or "default", "ghost", "destructive"
  size="default"     // or "sm", "lg", "icon"
>
  Button Text
</Button>`,

  // Button with Navigation (Back/Next)
  navigationButtons: `<div className="flex items-center justify-between mt-6">
  <Button 
    type="button"
    variant="outline"
    onClick={handleBack}
    disabled={currentPatient === 1}
  >
    Back
  </Button>
  <Button 
    type="button"
    onClick={handleNext}
    disabled={currentPatient === totalPatients}
  >
    Next
  </Button>
</div>`,

  // Column Header Sort Button
  columnHeaderSort: `<DropdownMenu>
  <DropdownMenuTrigger asChild>
    <button className="flex items-center gap-1 hover:bg-[#e5e5e5] px-1 py-0.5 rounded transition-colors">
      <User size={14} className="text-[#18181b]" />
      <span className="text-sm font-semibold text-[#18181b]">Assigned To</span>
      {currentColumn === 'assignedTo' ? (
        sortDirection === 'asc' ? 
          <ChevronUp size={16} className="text-[#71717a]" /> : 
          <ChevronDown size={16} className="text-[#71717a]" />
      ) : (
        <ChevronsUpDown size={16} className="text-[#71717a]" />
      )}
    </button>
  </DropdownMenuTrigger>
  <DropdownMenuContent align="start">
    <DropdownMenuItem onClick={() => onSort('assignedTo', 'asc')}>
      <ChevronUp size={16} className="mr-2" />
      Asc
    </DropdownMenuItem>
    <DropdownMenuItem onClick={() => onSort('assignedTo', 'desc')}>
      <ChevronDown size={16} className="mr-2" />
      Desc
    </DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>`,

  // Task Row Atomic Components
  // Checkbox Icon - Completed
  taskCheckboxCompleted: `<div className="size-5 shrink-0 cursor-pointer">
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
</div>`,

  // Checkbox Icon - Uncompleted
  taskCheckboxUncompleted: `<div className="size-5 shrink-0 cursor-pointer">
  <svg className="block size-full" fill="none" viewBox="0 0 20 20">
    <circle cx="10" cy="10" r="9.5" stroke="#71717A" />
  </svg>
</div>`,

  // User Avatar with Initials
  taskUserAvatar: `<div className="flex items-center gap-2">
  <div className="bg-[#fc6] w-8 h-8 rounded-full flex items-center justify-center">
    <span className="text-sm font-medium text-[#18181b]">TF</span>
  </div>
  <span className="text-sm text-[#18181b]">Tim Freeman</span>
</div>`,

  // Due Date Badge - Normal
  taskDueDateNormal: `<div className="inline-flex items-center px-2 py-0.5 rounded-md border border-[#e4e4e7] bg-white">
  <span className="text-xs font-medium text-[#18181b]">03/15/26</span>
</div>`,

  // Due Date Badge - Overdue
  taskDueDateOverdue: `<div className="inline-flex items-center px-2 py-0.5 rounded-md border border-red-200 bg-red-100">
  <span className="text-xs font-medium text-red-600">02/28/26</span>
</div>`,

  // Due Date Badge - Future
  taskDueDateSoon: `<div className="inline-flex items-center px-2 py-0.5 rounded-md border border-[#e4e4e7] bg-white">
  <span className="text-xs font-medium text-[#18181b]">04/20/26</span>
</div>`,

  // Attention Badge - Needs Attention
  taskAttentionBadge: `<div className="flex items-center gap-1">
  <AlertCircle className="w-5 h-5 text-[#8745AE]" />
  <span className="text-xs font-medium text-[#8745AE]">3 Needs Attention</span>
</div>`,

  // Task Row - Full Example
  taskRowFull: `<div className="bg-white h-10 rounded-lg border border-[#cdd7e1] hover:border-[#47515B] transition-colors">
  <div className="flex items-center h-full px-3 gap-3">
    {/* Checkbox */}
    <button className="size-5 shrink-0">
      <CheckboxIcon completed={task.completed} />
    </button>
    
    {/* Task Title */}
    <button className="flex-1 text-left text-sm underline text-[#18181b] truncate">
      Upload patient consent forms
    </button>
    
    {/* Due Date Badge */}
    <DueDateBadge dueDate={task.dueDate} />
    
    {/* User Avatar */}
    <UserAvatar user={task.assignedTo} />
    
    {/* Health Center */}
    <span className="text-sm text-[#18181b] w-40 truncate">Mountain View</span>
    
    {/* Attention Badge */}
    <AttentionBadge attention={task.attention} />
    
    {/* More Menu */}
    <DropdownMenu>
      <DropdownMenuTrigger>
        <MoreHorizontal className="w-5 h-5" />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem>Edit</DropdownMenuItem>
        <DropdownMenuItem>Duplicate</DropdownMenuItem>
        <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  </div>
</div>`,
};
