/**
 * Code Snippets
 * Reusable code examples for components
 */

export const codeSnippets = {
  // Button Examples
  buttonPrimary: `<Button className="bg-[#fc6] text-[#18181b] hover:bg-[#ffcc77]">
  Primary Button
</Button>`,

  buttonSecondary: `<Button variant="secondary">
  Secondary Button
</Button>`,

  buttonOutline: `<Button variant="outline">
  Outline Button
</Button>`,

  buttonWithIcon: `<Button className="bg-[#fc6] text-[#18181b] hover:bg-[#ffcc77]">
  <Upload className="mr-2 h-4 w-4" />
  Upload
</Button>`,

  buttonDestructive: `<Button variant="destructive">
  <Trash2 className="mr-2 h-4 w-4" />
  Delete
</Button>`,

  // Input Examples
  inputBasic: `<Input placeholder="Enter text..." />`,

  inputWithLabel: `<div>
  <Label htmlFor="email">Email</Label>
  <Input id="email" type="email" placeholder="you@example.com" />
</div>`,

  inputWithIcon: `<div className="relative">
  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#71717a]" />
  <Input className="pl-10" placeholder="Search..." />
</div>`,

  // Select Examples
  selectBasic: `<Select>
  <SelectTrigger>
    <SelectValue placeholder="Choose an option" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="option1">Option 1</SelectItem>
    <SelectItem value="option2">Option 2</SelectItem>
    <SelectItem value="option3">Option 3</SelectItem>
  </SelectContent>
</Select>`,

  // Checkbox Examples
  checkboxBasic: `<div className="flex items-center gap-2">
  <Checkbox id="terms" />
  <Label htmlFor="terms">Accept terms and conditions</Label>
</div>`,

  // Switch Examples
  switchBasic: `<div className="flex items-center gap-2">
  <Switch id="notifications" />
  <Label htmlFor="notifications">Enable notifications</Label>
</div>`,

  // Badge Examples
  badgeVariants: `<Badge>Default</Badge>
<Badge variant="secondary">Secondary</Badge>
<Badge variant="outline">Outline</Badge>
<Badge className="bg-[#fc6] text-[#18181b]">Primary</Badge>`,

  // Alert Examples
  alertBasic: `<Alert>
  <AlertCircle className="h-4 w-4" />
  <AlertTitle>Note</AlertTitle>
  <AlertDescription>
    This is an important message.
  </AlertDescription>
</Alert>`,

  // Card Examples
  cardBasic: `<Card>
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
    <CardDescription>Card description goes here.</CardDescription>
  </CardHeader>
  <CardContent>
    <p>Card content goes here.</p>
  </CardContent>
</Card>`,

  // Dialog Examples
  dialogBasic: `<Dialog>
  <DialogTrigger asChild>
    <Button>Open Dialog</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Dialog Title</DialogTitle>
      <DialogDescription>
        Dialog description goes here.
      </DialogDescription>
    </DialogHeader>
    <p>Dialog content goes here.</p>
  </DialogContent>
</Dialog>`,

  // Tabs Examples
  tabsBasic: `<Tabs defaultValue="tab1">
  <TabsList>
    <TabsTrigger value="tab1">Tab 1</TabsTrigger>
    <TabsTrigger value="tab2">Tab 2</TabsTrigger>
  </TabsList>
  <TabsContent value="tab1">
    Content for tab 1
  </TabsContent>
  <TabsContent value="tab2">
    Content for tab 2
  </TabsContent>
</Tabs>`,

  // Due Date Picker
  dueDatePicker: `<DueDatePicker
  value={dueDate}
  onSelect={(date) => setDueDate(date)}
  displayValue={getDisplayValueForDate(dueDate)}
  placeholder="Select Date"
/>`,

  // Save Indicator
  saveIndicator: `<SaveIndicator status={saveStatus} />

// saveStatus: 'idle' | 'saving' | 'saved'`,

  // Filter Chip
  filterChip: `<button className="px-3 py-1.5 rounded-full text-xs font-medium bg-[#fc6] text-[#18181b] transition-colors">
  All Tasks
</button>`,

  filterChipWithIcon: `<button className="px-3 py-1.5 rounded-full text-xs font-medium bg-[#fc6] text-[#18181b] flex items-center gap-1.5">
  <User className="w-3 h-3" />
  Tim Freeman
</button>`,

  filterChipRemovable: `<div className="px-3 py-1.5 rounded-full text-xs font-medium bg-[#f5f5f5] text-[#18181b] flex items-center gap-1.5">
  <span>Tim Freeman</span>
  <button className="ml-1 hover:bg-[#e5e5e5] rounded-full p-0.5">
    <X className="w-3 h-3" />
  </button>
</div>`,

  // Avatar with Initials
  avatarWithInitials: `<div className="bg-[#fc6] w-8 h-8 rounded-full flex items-center justify-center">
  <span className="text-sm font-medium text-[#18181b]">TF</span>
</div>`,

  // Command Palette
  commandPalette: `<Command>
  <CommandInput placeholder="Search..." />
  <CommandList>
    <CommandEmpty>No results found.</CommandEmpty>
    <CommandGroup heading="Suggestions">
      <CommandItem>Item 1</CommandItem>
      <CommandItem>Item 2</CommandItem>
    </CommandGroup>
  </CommandList>
</Command>`,

  // Dropdown Menu
  dropdownMenu: `<DropdownMenu>
  <DropdownMenuTrigger asChild>
    <Button variant="ghost" size="icon">
      <MoreVertical className="h-4 w-4" />
    </Button>
  </DropdownMenuTrigger>
  <DropdownMenuContent>
    <DropdownMenuItem>Edit</DropdownMenuItem>
    <DropdownMenuItem>Delete</DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>`,

  // Accordion
  accordion: `<Accordion type="single" collapsible>
  <AccordionItem value="item-1">
    <AccordionTrigger>Section 1</AccordionTrigger>
    <AccordionContent>
      Content for section 1
    </AccordionContent>
  </AccordionItem>
</Accordion>`,

  // Progress Bar
  progress: `<Progress value={65} />`,

  // Slider
  slider: `<Slider defaultValue={[50]} max={100} step={1} />`,

  // Textarea
  textarea: `<Textarea placeholder="Enter longer text..." rows={4} />`,

  // Table
  table: `<Table>
  <TableHeader>
    <TableRow>
      <TableHead>Name</TableHead>
      <TableHead>Status</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow>
      <TableCell>Task 1</TableCell>
      <TableCell>Complete</TableCell>
    </TableRow>
  </TableBody>
</Table>`,
};
