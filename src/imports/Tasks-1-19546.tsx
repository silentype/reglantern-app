import svgPaths from "./svg-ld1xgcnz3v";

function TaskHeaderContainer() {
  return (
    <div className="content-stretch flex items-center py-[8px] relative rounded-[8px] shrink-0" data-name="Task Header Container">
      <div className="flex flex-col font-['Geist:SemiBold',sans-serif] font-semibold justify-center leading-[0] relative shrink-0 text-[#09090b] text-[24px] tracking-[0.4px] whitespace-nowrap">
        <p className="leading-[32px]">Tasks</p>
      </div>
    </div>
  );
}

function Header() {
  return (
    <div className="content-stretch flex gap-[16px] items-center relative shrink-0 w-full" data-name="Header">
      <TaskHeaderContainer />
    </div>
  );
}

function Description() {
  return (
    <div className="content-stretch flex h-[20px] items-center relative shrink-0 w-[950px]" data-name="Description">
      <div className="flex flex-[1_0_0] flex-col font-['Geist:Medium',sans-serif] font-medium justify-center leading-[0] min-h-px min-w-px relative text-[#09090b] text-[14px]">
        <p className="leading-[14px] whitespace-pre-wrap">This could be a description or guidance for what to do.</p>
      </div>
    </div>
  );
}

function TaskContainer() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Task Container">
      <Header />
      <Description />
    </div>
  );
}

function Plus() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Plus">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Plus">
          <path clipRule="evenodd" d={svgPaths.p1ed18e80} fill="var(--fill-0, #09090B)" fillRule="evenodd" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function ActionButton() {
  return (
    <div className="bg-[#fc6] content-stretch flex gap-[8px] h-[40px] items-center px-[16px] py-[8px] relative rounded-[6px] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.05)] shrink-0" data-name="Action Button">
      <div className="flex flex-col font-['Geist:Medium',sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[#18181b] text-[14px] whitespace-nowrap">
        <p className="leading-[20px]">Add a Task</p>
      </div>
      <Plus />
    </div>
  );
}

function ChevronDown() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Chevron Down">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Status Dropdown Icon">
          <path clipRule="evenodd" d={svgPaths.p248d3d00} fill="var(--fill-0, #18181B)" fillRule="evenodd" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Icon() {
  return (
    <div className="content-stretch flex items-center pl-[8px] relative shrink-0" data-name="Icon">
      <ChevronDown />
    </div>
  );
}

function Select1() {
  return (
    <div className="bg-white content-stretch flex h-[40px] items-center justify-center px-[12px] py-[8px] relative rounded-[6px] shrink-0" data-name="Select">
      <div aria-hidden="true" className="absolute border border-[#e4e4e7] border-solid inset-0 pointer-events-none rounded-[6px]" />
      <div className="flex flex-col font-['Geist:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#18181b] text-[14px] whitespace-nowrap">
        <p className="leading-[20px]">Incomplete</p>
      </div>
      <Icon />
    </div>
  );
}

function Select() {
  return (
    <div className="col-1 content-stretch flex flex-col gap-[8px] items-start ml-0 mt-0 relative row-1 shadow-[0px_1px_3px_0px_rgba(0,0,0,0.05)]" data-name="Select">
      <Select1 />
    </div>
  );
}

function Calendar() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Calendar">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Due Date Dropdown Icon">
          <path clipRule="evenodd" d={svgPaths.p50dd400} fill="var(--fill-0, #18181B)" fillRule="evenodd" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Icon1() {
  return (
    <div className="content-stretch flex items-center pl-[8px] relative shrink-0" data-name="Icon">
      <Calendar />
    </div>
  );
}

function Select3() {
  return (
    <div className="bg-white content-stretch flex h-[40px] items-center justify-center px-[12px] py-[8px] relative rounded-[6px] shrink-0" data-name="Select">
      <div aria-hidden="true" className="absolute border border-[#e4e4e7] border-solid inset-0 pointer-events-none rounded-[6px]" />
      <div className="flex flex-col font-['Geist:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#18181b] text-[14px] whitespace-nowrap">
        <p className="leading-[20px]">12/01/2026</p>
      </div>
      <Icon1 />
    </div>
  );
}

function Select2() {
  return (
    <div className="col-1 content-stretch flex flex-col gap-[8px] items-start ml-[132px] mt-0 relative row-1 shadow-[0px_1px_3px_0px_rgba(0,0,0,0.05)]" data-name="Select">
      <Select3 />
    </div>
  );
}

function AvatarSolid() {
  return (
    <div className="bg-[#fc6] content-stretch flex items-center justify-between overflow-clip relative rounded-[100px] shrink-0 size-[24px]" data-name="<Avatar>/Solid">
      <div className="-translate-x-1/2 -translate-y-1/2 absolute flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] left-1/2 not-italic size-[30px] text-[#09090b] text-[12px] text-center top-1/2">
        <p className="leading-[1.33] whitespace-pre-wrap">TF</p>
      </div>
    </div>
  );
}

function AssignedToDropdown() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0" data-name="Assigned To Dropdown">
      <AvatarSolid />
      <div className="flex flex-col font-['Geist:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#09090b] text-[14px] whitespace-nowrap">
        <p className="leading-[20px]">Tim Freeman</p>
      </div>
    </div>
  );
}

function AssignedToContainer() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0" data-name="Assigned To Container">
      <div className="flex flex-col font-['Geist:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#18181b] text-[14px] whitespace-nowrap">
        <p className="leading-[20px]">{`Assigned to `}</p>
      </div>
      <AssignedToDropdown />
    </div>
  );
}

function AssignedToDropdownIcon() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Assigned To Dropdown Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Status Dropdown Icon">
          <path clipRule="evenodd" d={svgPaths.p248d3d00} fill="var(--fill-0, #18181B)" fillRule="evenodd" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Icon2() {
  return (
    <div className="content-stretch flex items-center pl-[8px] relative shrink-0" data-name="Icon">
      <AssignedToDropdownIcon />
    </div>
  );
}

function Select5() {
  return (
    <div className="bg-white content-stretch flex h-[40px] items-center justify-center px-[12px] py-[8px] relative rounded-[6px] shrink-0" data-name="Select">
      <div aria-hidden="true" className="absolute border border-[#e4e4e7] border-solid inset-0 pointer-events-none rounded-[6px]" />
      <AssignedToContainer />
      <Icon2 />
    </div>
  );
}

function Select4() {
  return (
    <div className="col-1 content-stretch flex flex-col gap-[8px] items-start ml-[269px] mt-0 relative row-1 shadow-[0px_1px_3px_0px_rgba(0,0,0,0.05)]" data-name="Select">
      <Select5 />
    </div>
  );
}

function ChevronDown1() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Chevron Down">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Status Dropdown Icon">
          <path clipRule="evenodd" d={svgPaths.p248d3d00} fill="var(--fill-0, #18181B)" fillRule="evenodd" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Icon3() {
  return (
    <div className="content-stretch flex items-center pl-[8px] relative shrink-0" data-name="Icon">
      <ChevronDown1 />
    </div>
  );
}

function Select7() {
  return (
    <div className="bg-white content-stretch flex h-[40px] items-center justify-center px-[12px] py-[8px] relative rounded-[6px] shrink-0" data-name="Select">
      <div aria-hidden="true" className="absolute border border-[#e4e4e7] border-solid inset-0 pointer-events-none rounded-[6px]" />
      <div className="flex flex-col font-['Geist:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#18181b] text-[14px] whitespace-nowrap">
        <p className="leading-[20px]">Test Health Center Examples</p>
      </div>
      <Icon3 />
    </div>
  );
}

function Select6() {
  return (
    <div className="col-1 content-stretch flex flex-col gap-[8px] items-start ml-[528px] mt-0 relative row-1 shadow-[0px_1px_3px_0px_rgba(0,0,0,0.05)]" data-name="Select">
      <Select7 />
    </div>
  );
}

function Group() {
  return (
    <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid leading-[0] place-items-start relative shrink-0">
      <Select />
      <Select2 />
      <Select4 />
      <Select6 />
    </div>
  );
}

function Filters() {
  return (
    <div className="content-stretch flex items-center justify-between relative shrink-0 w-full" data-name="Filters">
      <ActionButton />
      <Group />
    </div>
  );
}

function DragIndicator() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="drag_indicator">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="drag_indicator">
          <path d={svgPaths.p5fded00} fill="var(--fill-0, black)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function TaskTitle() {
  return (
    <div className="content-stretch flex gap-[8px] h-full items-center px-[12px] relative shrink-0 w-[239px]" data-name="Task Title">
      <div aria-hidden="true" className="absolute border-[#cdd7e1] border-r border-solid inset-0 pointer-events-none" />
      <div className="flex flex-col font-['Geist:SemiBold',sans-serif] font-semibold justify-center leading-[0] relative shrink-0 text-[#09090b] text-[12px] whitespace-nowrap">
        <p className="leading-[20px]">Task Title</p>
      </div>
      <DragIndicator />
    </div>
  );
}

function DueDateHeaderIcon() {
  return (
    <div className="col-1 ml-0 mt-0 relative row-1 size-[20px]" data-name="Due Date Header Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Due Date Header Icon">
          <rect fill="white" height="20" width="20" />
          <path clipRule="evenodd" d={svgPaths.pc55d00} fill="var(--fill-0, #09090B)" fillRule="evenodd" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function DueDateHeader() {
  return (
    <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid leading-[0] place-items-start relative shrink-0" data-name="Due Date Header">
      <DueDateHeaderIcon />
      <div className="col-1 flex flex-col font-['Geist:SemiBold',sans-serif] font-semibold justify-center ml-[28px] mt-0 relative row-1 text-[#09090b] text-[12px] whitespace-nowrap">
        <p className="leading-[20px]">Due Date</p>
      </div>
    </div>
  );
}

function DragIndicator1() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="drag_indicator">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="drag_indicator">
          <path d={svgPaths.p5fded00} fill="var(--fill-0, black)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function DueDate() {
  return (
    <div className="content-stretch flex gap-[8px] h-full items-center px-[12px] relative shrink-0 w-[161px]" data-name="Due Date">
      <div aria-hidden="true" className="absolute border-[#cdd7e1] border-r border-solid inset-0 pointer-events-none" />
      <DueDateHeader />
      <DragIndicator1 />
    </div>
  );
}

function AssignedToHeaderIcon() {
  return (
    <div className="col-1 ml-0 mt-0 relative row-1 size-[20px]" data-name="Assigned To Header Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Assigned To Header Icon">
          <path clipRule="evenodd" d={svgPaths.p1f27cb28} fill="var(--fill-0, #09090B)" fillRule="evenodd" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function AssignedToHeader() {
  return (
    <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid leading-[0] place-items-start relative shrink-0" data-name="Assigned To Header">
      <AssignedToHeaderIcon />
      <div className="col-1 flex flex-col font-['Geist:SemiBold',sans-serif] font-semibold justify-center ml-[28px] mt-0 relative row-1 text-[#09090b] text-[12px] whitespace-nowrap">
        <p className="leading-[20px]">Assigned To</p>
      </div>
    </div>
  );
}

function DragIndicator2() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="drag_indicator">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="drag_indicator">
          <path d={svgPaths.p5fded00} fill="var(--fill-0, black)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function AssignedTo() {
  return (
    <div className="content-stretch flex gap-[8px] h-full items-center px-[12px] relative shrink-0 w-[186px]" data-name="Assigned To">
      <div aria-hidden="true" className="absolute border-[#cdd7e1] border-r border-solid inset-0 pointer-events-none" />
      <AssignedToHeader />
      <DragIndicator2 />
    </div>
  );
}

function ToolsHeaderIcon() {
  return (
    <div className="col-1 ml-0 mt-0 relative row-1 size-[20px]" data-name="Tools Header Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="work">
          <path d={svgPaths.p31514400} fill="var(--fill-0, #09090B)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function ToolsHeader() {
  return (
    <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid leading-[0] place-items-start relative shrink-0" data-name="Tools Header">
      <ToolsHeaderIcon />
      <div className="col-1 flex flex-col font-['Geist:SemiBold',sans-serif] font-semibold justify-center ml-[28px] mt-0 relative row-1 text-[#09090b] text-[12px] whitespace-nowrap">
        <p className="leading-[20px]">Tools</p>
      </div>
    </div>
  );
}

function DragIndicator3() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="drag_indicator">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="drag_indicator">
          <path d={svgPaths.p5fded00} fill="var(--fill-0, black)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Tools() {
  return (
    <div className="content-stretch flex gap-[8px] h-full items-center px-[12px] relative shrink-0 w-[220px]" data-name="Tools">
      <div aria-hidden="true" className="absolute border-[#cdd7e1] border-r border-solid inset-0 pointer-events-none" />
      <ToolsHeader />
      <DragIndicator3 />
    </div>
  );
}

function ToolsHeaderIcon1() {
  return (
    <div className="col-1 ml-0 mt-0 relative row-1 size-[20px]" data-name="Tools Header Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="work">
          <path d={svgPaths.p31514400} fill="var(--fill-0, #09090B)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function ToolsHeader1() {
  return (
    <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid leading-[0] place-items-start relative shrink-0" data-name="Tools Header">
      <ToolsHeaderIcon1 />
      <div className="col-1 flex flex-col font-['Geist:SemiBold',sans-serif] font-semibold justify-center ml-[28px] mt-0 relative row-1 text-[#09090b] text-[12px] whitespace-nowrap">
        <p className="leading-[20px]">Comments</p>
      </div>
    </div>
  );
}

function DragIndicator4() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="drag_indicator">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="drag_indicator">
          <path d={svgPaths.p5fded00} fill="var(--fill-0, black)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Tools1() {
  return (
    <div className="content-stretch flex gap-[8px] h-full items-center px-[12px] relative shrink-0 w-[220px]" data-name="Tools">
      <div aria-hidden="true" className="absolute border-[#cdd7e1] border-r border-solid inset-0 pointer-events-none" />
      <ToolsHeader1 />
      <DragIndicator4 />
    </div>
  );
}

function HealthCenterHeaderIcon() {
  return (
    <div className="col-1 ml-0 mt-0 relative row-1 size-[20px]" data-name="Health Center Header Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="corporate_fare">
          <path d={svgPaths.p20b10300} fill="var(--fill-0, #09090B)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function HealthCenterHeader() {
  return (
    <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid leading-[0] place-items-start relative shrink-0" data-name="Health Center Header">
      <HealthCenterHeaderIcon />
      <div className="col-1 flex flex-col font-['Geist:SemiBold',sans-serif] font-semibold justify-center ml-[28px] mt-0 relative row-1 text-[#09090b] text-[12px] whitespace-nowrap">
        <p className="leading-[20px]">Health Center</p>
      </div>
    </div>
  );
}

function DragIndicator5() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="drag_indicator">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="drag_indicator">
          <path d={svgPaths.p5fded00} fill="var(--fill-0, black)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function HealthCenter() {
  return (
    <div className="content-stretch flex gap-[8px] h-full items-center px-[12px] relative shrink-0 w-[206px]" data-name="Health Center">
      <HealthCenterHeader />
      <DragIndicator5 />
    </div>
  );
}

function Columns() {
  return (
    <div className="h-[40px] relative rounded-[8px] shrink-0 w-full" data-name="Columns">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center pl-[32px] relative size-full">
          <TaskTitle />
          <DueDate />
          <AssignedTo />
          <Tools />
          <Tools1 />
          <HealthCenter />
        </div>
      </div>
    </div>
  );
}

function CircleCheckBig() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Circle Check Big">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g clipPath="url(#clip0_1_12770)" id="Circle Check Big">
          <path clipRule="evenodd" d={svgPaths.p372a9b00} fill="var(--fill-0, #4CB92E)" fillRule="evenodd" id="Icon" />
        </g>
        <defs>
          <clipPath id="clip0_1_12770">
            <rect fill="white" height="20" width="20" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function TaskName() {
  return (
    <div className="content-stretch flex gap-[8px] h-full items-center relative shrink-0 w-[255px]" data-name="Task Name">
      <div aria-hidden="true" className="absolute border-[#cdd7e1] border-r border-solid inset-0 pointer-events-none" />
      <CircleCheckBig />
      <div className="flex flex-[1_0_0] flex-col font-['Geist:Regular',sans-serif] font-normal justify-center leading-[0] min-h-px min-w-px relative text-[#09090b] text-[0px]">
        <p className="decoration-solid leading-[20px] text-[14px] underline whitespace-pre-wrap">This is the task title</p>
      </div>
    </div>
  );
}

function DueDateIcon() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Due Date Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Due Date Icon">
          <rect fill="white" height="16" width="16" />
          <path clipRule="evenodd" d={svgPaths.p50dd400} fill="var(--fill-0, #18181B)" fillRule="evenodd" id="Vector (Stroke)" />
        </g>
      </svg>
    </div>
  );
}

function DueDate1() {
  return (
    <div className="content-stretch flex h-full items-center justify-between px-[12px] relative shrink-0 w-[161px]" data-name="Due Date">
      <div aria-hidden="true" className="absolute border-[#cdd7e1] border-r border-solid inset-0 pointer-events-none" />
      <div className="flex flex-col font-['Geist:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#999] text-[14px] whitespace-nowrap">
        <p className="leading-[20px]">Set Due Date</p>
      </div>
      <DueDateIcon />
    </div>
  );
}

function AssignUserDropdownIcon() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Assign User Dropdown Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Status Dropdown Icon">
          <path clipRule="evenodd" d={svgPaths.p248d3d00} fill="var(--fill-0, #18181B)" fillRule="evenodd" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function DueDate2() {
  return (
    <div className="content-stretch flex h-full items-center justify-between px-[12px] relative shrink-0 w-[186px]" data-name="Due Date">
      <div aria-hidden="true" className="absolute border-[#cdd7e1] border-r border-solid inset-0 pointer-events-none" />
      <div className="flex flex-col font-['Geist:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#999] text-[14px] whitespace-nowrap">
        <p className="leading-[20px]">Assign User</p>
      </div>
      <AssignUserDropdownIcon />
    </div>
  );
}

function AssignUserDropdownIcon1() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Assign User Dropdown Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Status Dropdown Icon">
          <path clipRule="evenodd" d={svgPaths.p248d3d00} fill="var(--fill-0, #18181B)" fillRule="evenodd" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function DueDate3() {
  return (
    <div className="content-stretch flex h-full items-center justify-between px-[12px] relative shrink-0 w-[341px]" data-name="Due Date">
      <div aria-hidden="true" className="absolute border-[#cdd7e1] border-r border-solid inset-0 pointer-events-none" />
      <div className="flex flex-col font-['Geist:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#999] text-[14px] whitespace-nowrap">
        <p className="leading-[20px]">Unassigned to tool</p>
      </div>
      <AssignUserDropdownIcon1 />
    </div>
  );
}

function SelectHealthCenterDropdownIcon() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Select Health Center Dropdown Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Status Dropdown Icon">
          <path clipRule="evenodd" d={svgPaths.p248d3d00} fill="var(--fill-0, #18181B)" fillRule="evenodd" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function DueDate4() {
  return (
    <div className="content-stretch flex h-full items-center justify-between px-[12px] relative shrink-0 w-[196px]" data-name="Due Date">
      <div aria-hidden="true" className="absolute border-[#cdd7e1] border-r border-solid inset-0 pointer-events-none" />
      <div className="flex flex-col font-['Geist:Medium',sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[#999] text-[14px] whitespace-nowrap">
        <p className="leading-[20px]">Select Health Center</p>
      </div>
      <SelectHealthCenterDropdownIcon />
    </div>
  );
}

function EllipsisVertical() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Ellipsis Vertical">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Ellipsis Vertical">
          <path clipRule="evenodd" d={svgPaths.p1592f580} fill="var(--fill-0, #09090B)" fillRule="evenodd" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function DueDate5() {
  return (
    <div className="flex-[1_0_0] h-full min-h-px min-w-px relative" data-name="Due Date">
      <div className="flex flex-row items-center justify-end size-full">
        <div className="content-stretch flex items-center justify-end px-[12px] relative size-full">
          <EllipsisVertical />
        </div>
      </div>
    </div>
  );
}

function Row() {
  return (
    <div className="bg-white h-[40px] relative rounded-[8px] shrink-0 w-full" data-name="Row">
      <div aria-hidden="true" className="absolute border border-[#cdd7e1] border-solid inset-[-1px] pointer-events-none rounded-[9px] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.05)]" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center pl-[16px] relative size-full">
          <TaskName />
          <DueDate1 />
          <DueDate2 />
          <DueDate3 />
          <DueDate4 />
          <DueDate5 />
        </div>
      </div>
    </div>
  );
}

function RadioButtonUnchecked() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="radio_button_unchecked">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="radio_button_unchecked">
          <path d={svgPaths.p34103500} fill="var(--fill-0, #999999)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function TaskName1() {
  return (
    <div className="content-stretch flex gap-[8px] h-full items-center relative shrink-0 w-[255px]" data-name="Task Name">
      <div aria-hidden="true" className="absolute border-[#cdd7e1] border-r border-solid inset-0 pointer-events-none" />
      <RadioButtonUnchecked />
      <div className="flex flex-[1_0_0] flex-col font-['Geist:Regular',sans-serif] font-normal justify-center leading-[0] min-h-px min-w-px relative text-[#09090b] text-[0px]">
        <p className="decoration-solid leading-[20px] text-[14px] underline whitespace-pre-wrap">This is the task title</p>
      </div>
    </div>
  );
}

function DueDateIcon1() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Due Date Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Due Date Icon">
          <rect fill="white" height="16" width="16" />
          <path clipRule="evenodd" d={svgPaths.p50dd400} fill="var(--fill-0, #18181B)" fillRule="evenodd" id="Vector (Stroke)" />
        </g>
      </svg>
    </div>
  );
}

function DueDate6() {
  return (
    <div className="content-stretch flex h-full items-center justify-between px-[12px] relative shrink-0 w-[161px]" data-name="Due Date">
      <div aria-hidden="true" className="absolute border-[#cdd7e1] border-r border-solid inset-0 pointer-events-none" />
      <div className="flex flex-col font-['Geist:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#999] text-[14px] whitespace-nowrap">
        <p className="leading-[20px]">Set Due Date</p>
      </div>
      <DueDateIcon1 />
    </div>
  );
}

function AssignUserDropdownIcon2() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Assign User Dropdown Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Status Dropdown Icon">
          <path clipRule="evenodd" d={svgPaths.p248d3d00} fill="var(--fill-0, #18181B)" fillRule="evenodd" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function DueDate7() {
  return (
    <div className="content-stretch flex h-full items-center justify-between px-[12px] relative shrink-0 w-[186px]" data-name="Due Date">
      <div aria-hidden="true" className="absolute border-[#cdd7e1] border-r border-solid inset-0 pointer-events-none" />
      <div className="flex flex-col font-['Geist:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#999] text-[14px] whitespace-nowrap">
        <p className="leading-[20px]">Assign User</p>
      </div>
      <AssignUserDropdownIcon2 />
    </div>
  );
}

function AssignUserDropdownIcon3() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Assign User Dropdown Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Status Dropdown Icon">
          <path clipRule="evenodd" d={svgPaths.p248d3d00} fill="var(--fill-0, #18181B)" fillRule="evenodd" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function DueDate8() {
  return (
    <div className="content-stretch flex h-full items-center justify-between px-[12px] relative shrink-0 w-[343px]" data-name="Due Date">
      <div aria-hidden="true" className="absolute border-[#cdd7e1] border-r border-solid inset-0 pointer-events-none" />
      <div className="flex flex-col font-['Geist:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#999] text-[14px] whitespace-nowrap">
        <p className="leading-[20px]">Unassigned to tool</p>
      </div>
      <AssignUserDropdownIcon3 />
    </div>
  );
}

function SelectHealthCenterDropdownIcon1() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Select Health Center Dropdown Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Status Dropdown Icon">
          <path clipRule="evenodd" d={svgPaths.p248d3d00} fill="var(--fill-0, #18181B)" fillRule="evenodd" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function DueDate9() {
  return (
    <div className="content-stretch flex h-full items-center justify-between px-[12px] relative shrink-0 w-[196px]" data-name="Due Date">
      <div aria-hidden="true" className="absolute border-[#cdd7e1] border-r border-solid inset-0 pointer-events-none" />
      <div className="flex flex-col font-['Geist:Medium',sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[#999] text-[14px] whitespace-nowrap">
        <p className="leading-[20px]">Select Health Center</p>
      </div>
      <SelectHealthCenterDropdownIcon1 />
    </div>
  );
}

function InsertDriveFile() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="insert_drive_file">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="insert_drive_file">
          <path d={svgPaths.p183b5840} fill="var(--fill-0, #C41C1C)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function DocumentAttention() {
  return (
    <div className="content-stretch flex gap-[4px] items-center relative shrink-0" data-name="Document Attention">
      <InsertDriveFile />
      <div className="flex flex-col font-['Inter:Medium',sans-serif] font-medium h-[20px] justify-center leading-[0] not-italic relative shrink-0 text-[12px] text-black w-[117px]">
        <p className="leading-[normal] whitespace-pre-wrap">1 Needs Attention</p>
      </div>
    </div>
  );
}

function EllipsisVertical1() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Ellipsis Vertical">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Ellipsis Vertical">
          <path clipRule="evenodd" d={svgPaths.p1592f580} fill="var(--fill-0, #09090B)" fillRule="evenodd" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function AttentionRightArrow() {
  return (
    <div className="flex-[1_0_0] h-full min-h-px min-w-px relative" data-name="Attention + Right Arrow">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center justify-between px-[12px] relative size-full">
          <DocumentAttention />
          <EllipsisVertical1 />
        </div>
      </div>
    </div>
  );
}

function Row1() {
  return (
    <div className="bg-[#f2f2f2] h-[40px] relative rounded-[8px] shrink-0 w-full" data-name="Row">
      <div aria-hidden="true" className="absolute border border-[#cdd7e1] border-solid inset-[-1px] pointer-events-none rounded-[9px] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.05)]" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center pl-[16px] relative size-full">
          <TaskName1 />
          <DueDate6 />
          <DueDate7 />
          <DueDate8 />
          <DueDate9 />
          <AttentionRightArrow />
        </div>
      </div>
    </div>
  );
}

function RadioButtonUnchecked1() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="radio_button_unchecked">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="radio_button_unchecked">
          <path d={svgPaths.p34103500} fill="var(--fill-0, #999999)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function TaskName2() {
  return (
    <div className="content-stretch flex gap-[8px] h-full items-center relative shrink-0 w-[255px]" data-name="Task Name">
      <div aria-hidden="true" className="absolute border-[#cdd7e1] border-r border-solid inset-0 pointer-events-none" />
      <RadioButtonUnchecked1 />
      <div className="flex flex-[1_0_0] flex-col font-['Geist:Regular',sans-serif] font-normal justify-center leading-[0] min-h-px min-w-px relative text-[#09090b] text-[0px]">
        <p className="decoration-solid leading-[20px] text-[14px] underline whitespace-pre-wrap">This is the task title</p>
      </div>
    </div>
  );
}

function DueDateIcon2() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Due Date Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Due Date Icon">
          <rect fill="white" height="16" width="16" />
          <path clipRule="evenodd" d={svgPaths.p50dd400} fill="var(--fill-0, #18181B)" fillRule="evenodd" id="Vector (Stroke)" />
        </g>
      </svg>
    </div>
  );
}

function DueDate10() {
  return (
    <div className="content-stretch flex h-full items-center justify-between px-[12px] relative shrink-0 w-[161px]" data-name="Due Date">
      <div aria-hidden="true" className="absolute border-[#cdd7e1] border-r border-solid inset-0 pointer-events-none" />
      <div className="flex flex-col font-['Geist:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#999] text-[14px] whitespace-nowrap">
        <p className="leading-[20px]">Set Due Date</p>
      </div>
      <DueDateIcon2 />
    </div>
  );
}

function AssignUserDropdownIcon4() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Assign User Dropdown Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Status Dropdown Icon">
          <path clipRule="evenodd" d={svgPaths.p248d3d00} fill="var(--fill-0, #18181B)" fillRule="evenodd" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function AssignedTo1() {
  return (
    <div className="content-stretch flex h-full items-center justify-between px-[12px] relative shrink-0 w-[186px]" data-name="Assigned To">
      <div aria-hidden="true" className="absolute border-[#cdd7e1] border-r border-solid inset-0 pointer-events-none" />
      <div className="flex flex-col font-['Geist:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#999] text-[14px] whitespace-nowrap">
        <p className="leading-[20px]">Assign User</p>
      </div>
      <AssignUserDropdownIcon4 />
    </div>
  );
}

function AssignUserDropdownIcon5() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Assign User Dropdown Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Status Dropdown Icon">
          <path clipRule="evenodd" d={svgPaths.p248d3d00} fill="var(--fill-0, #18181B)" fillRule="evenodd" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Tools2() {
  return (
    <div className="content-stretch flex h-full items-center justify-between px-[12px] relative shrink-0 w-[345px]" data-name="Tools">
      <div aria-hidden="true" className="absolute border-[#cdd7e1] border-r border-solid inset-0 pointer-events-none" />
      <div className="flex flex-col font-['Geist:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#999] text-[14px] whitespace-nowrap">
        <p className="leading-[20px]">Unassigned to tool</p>
      </div>
      <AssignUserDropdownIcon5 />
    </div>
  );
}

function SelectHealthCenterDropdownIcon2() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Select Health Center Dropdown Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Status Dropdown Icon">
          <path clipRule="evenodd" d={svgPaths.p248d3d00} fill="var(--fill-0, #18181B)" fillRule="evenodd" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function DueDate11() {
  return (
    <div className="content-stretch flex h-full items-center justify-between px-[12px] relative shrink-0 w-[194px]" data-name="Due Date">
      <div aria-hidden="true" className="absolute border-[#cdd7e1] border-r border-solid inset-0 pointer-events-none" />
      <div className="flex flex-col font-['Geist:Medium',sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[#999] text-[14px] whitespace-nowrap">
        <p className="leading-[20px]">Select Health Center</p>
      </div>
      <SelectHealthCenterDropdownIcon2 />
    </div>
  );
}

function EllipsisVertical2() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Ellipsis Vertical">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Ellipsis Vertical">
          <path clipRule="evenodd" d={svgPaths.p1592f580} fill="var(--fill-0, #09090B)" fillRule="evenodd" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function RightArrow() {
  return (
    <div className="flex-[1_0_0] h-full min-h-px min-w-px relative" data-name="Right Arrow">
      <div className="flex flex-row items-center justify-end size-full">
        <div className="content-stretch flex items-center justify-end px-[12px] relative size-full">
          <EllipsisVertical2 />
        </div>
      </div>
    </div>
  );
}

function Row2() {
  return (
    <div className="bg-white h-[40px] relative rounded-[8px] shrink-0 w-full" data-name="Row">
      <div aria-hidden="true" className="absolute border border-[#cdd7e1] border-solid inset-[-1px] pointer-events-none rounded-[9px] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.1),0px_1px_3px_0px_rgba(0,0,0,0.1)]" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center pl-[16px] relative size-full">
          <TaskName2 />
          <DueDate10 />
          <AssignedTo1 />
          <Tools2 />
          <DueDate11 />
          <RightArrow />
        </div>
      </div>
    </div>
  );
}

function RadioButtonUnchecked2() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="radio_button_unchecked">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="radio_button_unchecked">
          <path d={svgPaths.p34103500} fill="var(--fill-0, #999999)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function TaskName3() {
  return (
    <div className="content-stretch flex gap-[8px] h-full items-center relative shrink-0 w-[255px]" data-name="Task Name">
      <div aria-hidden="true" className="absolute border-[#cdd7e1] border-r border-solid inset-0 pointer-events-none" />
      <RadioButtonUnchecked2 />
      <div className="flex flex-[1_0_0] flex-col font-['Geist:Regular',sans-serif] font-normal justify-center leading-[0] min-h-px min-w-px relative text-[#09090b] text-[0px]">
        <p className="decoration-solid leading-[20px] text-[14px] underline whitespace-pre-wrap">This is the task title</p>
      </div>
    </div>
  );
}

function DueDateIcon3() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Due Date Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Due Date Icon">
          <rect fill="white" height="16" width="16" />
          <path clipRule="evenodd" d={svgPaths.p50dd400} fill="var(--fill-0, #18181B)" fillRule="evenodd" id="Vector (Stroke)" />
        </g>
      </svg>
    </div>
  );
}

function DueDate12() {
  return (
    <div className="content-stretch flex h-full items-center justify-between px-[12px] relative shrink-0 w-[161px]" data-name="Due Date">
      <div aria-hidden="true" className="absolute border-[#cdd7e1] border-r border-solid inset-0 pointer-events-none" />
      <div className="flex flex-col font-['Geist:Medium',sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[#09090b] text-[14px] whitespace-nowrap">
        <p className="leading-[20px]">12/10/2026</p>
      </div>
      <DueDateIcon3 />
    </div>
  );
}

function AvatarSolid1() {
  return (
    <div className="bg-[#fc6] content-stretch flex items-center justify-between overflow-clip relative rounded-[100px] shrink-0 size-[24px]" data-name="<Avatar>/Solid">
      <div className="-translate-x-1/2 -translate-y-1/2 absolute flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] left-1/2 not-italic size-[30px] text-[#09090b] text-[12px] text-center top-1/2">
        <p className="leading-[1.33] whitespace-pre-wrap">TF</p>
      </div>
    </div>
  );
}

function AssignedToContainer1() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0" data-name="Assigned To Container">
      <AvatarSolid1 />
      <div className="flex flex-col font-['Geist:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#09090b] text-[14px] whitespace-nowrap">
        <p className="leading-[20px]">Tim Freeman</p>
      </div>
    </div>
  );
}

function AssignedToDropdownIcon1() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Assigned To Dropdown Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Status Dropdown Icon">
          <path clipRule="evenodd" d={svgPaths.p248d3d00} fill="var(--fill-0, #18181B)" fillRule="evenodd" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function AssignedTo2() {
  return (
    <div className="content-stretch flex h-full items-center justify-between px-[12px] relative shrink-0 w-[186px]" data-name="Assigned To">
      <div aria-hidden="true" className="absolute border-[#cdd7e1] border-r border-solid inset-0 pointer-events-none" />
      <AssignedToContainer1 />
      <AssignedToDropdownIcon1 />
    </div>
  );
}

function X() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="X">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="X">
          <path d="M12 4L4 12M4 4L12 12" id="Icon" stroke="var(--stroke-0, #2C2C2C)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6" />
        </g>
      </svg>
    </div>
  );
}

function Assignee() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0" data-name="Assignee">
      <div className="flex flex-col font-['Geist:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#09090b] text-[14px] whitespace-nowrap">
        <p className="leading-[20px]">Site Visit Protocol Checklist</p>
      </div>
      <X />
    </div>
  );
}

function Tag() {
  return (
    <div className="bg-[#f5f5f5] content-stretch flex items-center justify-center px-[6px] py-[4px] relative rounded-[8px] shrink-0" data-name="Tag">
      <Assignee />
    </div>
  );
}

function Frame1() {
  return (
    <div className="content-stretch flex items-center relative shrink-0">
      <Tag />
    </div>
  );
}

function X1() {
  return (
    <div className="relative size-[16px]" data-name="X">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="X">
          <path d="M12 4L4 12M4 4L12 12" id="Icon" stroke="var(--stroke-0, #2C2C2C)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6" />
        </g>
      </svg>
    </div>
  );
}

function AvatarSolid2() {
  return (
    <div className="bg-[#fc6] content-stretch flex items-center justify-between overflow-clip relative rounded-[100px] shrink-0 size-[24px]" data-name="<Avatar>/Solid">
      <div className="-translate-x-1/2 -translate-y-1/2 absolute flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] left-1/2 not-italic size-[30px] text-[#09090b] text-[12px] text-center top-1/2">
        <p className="leading-[1.33] whitespace-pre-wrap">2</p>
      </div>
    </div>
  );
}

function Assignee1() {
  return (
    <div className="content-stretch flex items-center relative shrink-0" data-name="Assignee">
      <div className="flex items-center justify-center relative shrink-0 size-[22.627px]" style={{ "--transform-inner-width": "1200", "--transform-inner-height": "153.328125" } as React.CSSProperties}>
        <div className="flex-none rotate-45">
          <X1 />
        </div>
      </div>
      <AvatarSolid2 />
    </div>
  );
}

function Tag1() {
  return (
    <div className="bg-[#f5f5f5] content-stretch flex items-center justify-center px-[6px] py-[4px] relative rounded-[8px] shrink-0" data-name="Tag">
      <Assignee1 />
    </div>
  );
}

function Frame2() {
  return (
    <div className="content-stretch flex items-center relative shrink-0">
      <Tag1 />
    </div>
  );
}

function Frame() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0">
      <Frame1 />
      <Frame2 />
    </div>
  );
}

function AssignUserDropdownIcon6() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Assign User Dropdown Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Status Dropdown Icon">
          <path clipRule="evenodd" d={svgPaths.p248d3d00} fill="var(--fill-0, #18181B)" fillRule="evenodd" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Tools3() {
  return (
    <div className="content-stretch flex h-full items-center justify-between px-[12px] relative shrink-0 w-[346px]" data-name="Tools">
      <div aria-hidden="true" className="absolute border-[#cdd7e1] border-r border-solid inset-0 pointer-events-none" />
      <Frame />
      <AssignUserDropdownIcon6 />
    </div>
  );
}

function TestHealthCenterDropdownIcon() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Test Health Center Dropdown Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Test Health Center Dropdown Icon">
          <path clipRule="evenodd" d={svgPaths.p248d3d00} fill="var(--fill-0, #18181B)" fillRule="evenodd" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function HealthCenter1() {
  return (
    <div className="content-stretch flex h-full items-center justify-between px-[12px] relative shrink-0 w-[194px]" data-name="Health Center">
      <div aria-hidden="true" className="absolute border-[#cdd7e1] border-r border-solid inset-0 pointer-events-none" />
      <div className="flex flex-col font-['Geist:Medium',sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[#09090b] text-[14px] whitespace-nowrap">
        <p className="leading-[20px]">Test Health Center</p>
      </div>
      <TestHealthCenterDropdownIcon />
    </div>
  );
}

function InsertDriveFile1() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="insert_drive_file">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="insert_drive_file">
          <path d={svgPaths.p183b5840} fill="var(--fill-0, #C41C1C)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function DocumentAttention1() {
  return (
    <div className="content-stretch flex gap-[4px] items-center relative shrink-0" data-name="Document Attention">
      <InsertDriveFile1 />
      <div className="flex flex-col font-['Inter:Medium',sans-serif] font-medium h-[20px] justify-center leading-[0] not-italic relative shrink-0 text-[12px] text-black w-[117px]">
        <p className="leading-[normal] whitespace-pre-wrap">1 Needs Attention</p>
      </div>
    </div>
  );
}

function EllipsisVertical3() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Ellipsis Vertical">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Ellipsis Vertical">
          <path clipRule="evenodd" d={svgPaths.p1592f580} fill="var(--fill-0, #09090B)" fillRule="evenodd" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function AttentionRightArrow1() {
  return (
    <div className="flex-[1_0_0] h-full min-h-px min-w-px relative" data-name="Attention + Right Arrow">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center justify-between px-[12px] relative size-full">
          <DocumentAttention1 />
          <EllipsisVertical3 />
        </div>
      </div>
    </div>
  );
}

function Row3() {
  return (
    <div className="h-[40px] relative rounded-[8px] shrink-0 w-full" data-name="Row">
      <div aria-hidden="true" className="absolute border border-[#cdd7e1] border-solid inset-[-1px] pointer-events-none rounded-[9px] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.05)]" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center pl-[16px] relative size-full">
          <TaskName3 />
          <DueDate12 />
          <AssignedTo2 />
          <Tools3 />
          <HealthCenter1 />
          <AttentionRightArrow1 />
        </div>
      </div>
    </div>
  );
}

function RadioButtonUnchecked3() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="radio_button_unchecked">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="radio_button_unchecked">
          <path d={svgPaths.p34103500} fill="var(--fill-0, #999999)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function TaskName4() {
  return (
    <div className="content-stretch flex gap-[8px] h-full items-center relative shrink-0 w-[255px]" data-name="Task Name">
      <div aria-hidden="true" className="absolute border-[#cdd7e1] border-r border-solid inset-0 pointer-events-none" />
      <RadioButtonUnchecked3 />
      <div className="flex flex-[1_0_0] flex-col font-['Geist:Regular',sans-serif] font-normal justify-center leading-[0] min-h-px min-w-px relative text-[#09090b] text-[0px]">
        <p className="decoration-solid leading-[20px] text-[14px] underline whitespace-pre-wrap">This is the task title</p>
      </div>
    </div>
  );
}

function DueDateIcon4() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Due Date Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Due Date Icon">
          <rect fill="white" height="16" width="16" />
          <path clipRule="evenodd" d={svgPaths.p50dd400} fill="var(--fill-0, #18181B)" fillRule="evenodd" id="Vector (Stroke)" />
        </g>
      </svg>
    </div>
  );
}

function DueDate13() {
  return (
    <div className="content-stretch flex h-full items-center justify-between px-[12px] relative shrink-0 w-[161px]" data-name="Due Date">
      <div aria-hidden="true" className="absolute border-[#cdd7e1] border-r border-solid inset-0 pointer-events-none" />
      <div className="flex flex-col font-['Geist:Medium',sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[#09090b] text-[14px] whitespace-nowrap">
        <p className="leading-[20px]">12/10/2026</p>
      </div>
      <DueDateIcon4 />
    </div>
  );
}

function AvatarSolid3() {
  return (
    <div className="bg-[#fc6] content-stretch flex items-center justify-between overflow-clip relative rounded-[100px] shrink-0 size-[24px]" data-name="<Avatar>/Solid">
      <div className="-translate-x-1/2 -translate-y-1/2 absolute flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] left-1/2 not-italic size-[30px] text-[#09090b] text-[12px] text-center top-1/2">
        <p className="leading-[1.33] whitespace-pre-wrap">TF</p>
      </div>
    </div>
  );
}

function AssignedToContainer2() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0" data-name="Assigned To Container">
      <AvatarSolid3 />
      <div className="flex flex-col font-['Geist:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#09090b] text-[14px] whitespace-nowrap">
        <p className="leading-[20px]">Tim Freeman</p>
      </div>
    </div>
  );
}

function AssignedToDropdownIcon2() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Assigned To Dropdown Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Status Dropdown Icon">
          <path clipRule="evenodd" d={svgPaths.p248d3d00} fill="var(--fill-0, #18181B)" fillRule="evenodd" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function AssignedTo3() {
  return (
    <div className="content-stretch flex h-full items-center justify-between px-[12px] relative shrink-0 w-[186px]" data-name="Assigned To">
      <div aria-hidden="true" className="absolute border-[#cdd7e1] border-r border-solid inset-0 pointer-events-none" />
      <AssignedToContainer2 />
      <AssignedToDropdownIcon2 />
    </div>
  );
}

function Tools4() {
  return (
    <div className="content-stretch flex h-full items-center px-[12px] relative shrink-0 w-[220px]" data-name="Tools">
      <div aria-hidden="true" className="absolute border-[#cdd7e1] border-r border-solid inset-0 pointer-events-none" />
      <div className="flex flex-col font-['Geist:Medium',sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[#09090b] text-[0px] whitespace-nowrap">
        <p className="decoration-solid leading-[20px] text-[14px] underline">Site Visit Protocol Checklist</p>
      </div>
    </div>
  );
}

function TestHealthCenterDropdownIcon1() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Test Health Center Dropdown Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Test Health Center Dropdown Icon">
          <path clipRule="evenodd" d={svgPaths.p248d3d00} fill="var(--fill-0, #18181B)" fillRule="evenodd" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function HealthCenter2() {
  return (
    <div className="content-stretch flex h-full items-center justify-between px-[12px] relative shrink-0 w-[238px]" data-name="Health Center">
      <div aria-hidden="true" className="absolute border-[#cdd7e1] border-r border-solid inset-0 pointer-events-none" />
      <div className="flex flex-col font-['Geist:Medium',sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[#09090b] text-[14px] whitespace-nowrap">
        <p className="leading-[20px]">Test Health Center</p>
      </div>
      <TestHealthCenterDropdownIcon1 />
    </div>
  );
}

function InsertDriveFile2() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="insert_drive_file">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="insert_drive_file">
          <path d={svgPaths.p183b5840} fill="var(--fill-0, #C41C1C)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function DocumentAttention2() {
  return (
    <div className="content-stretch flex gap-[4px] items-center relative shrink-0" data-name="Document Attention">
      <InsertDriveFile2 />
      <div className="flex flex-col font-['Inter:Medium',sans-serif] font-medium h-[20px] justify-center leading-[0] not-italic relative shrink-0 text-[12px] text-black w-[117px]">
        <p className="leading-[normal] whitespace-pre-wrap">1 Needs Attention</p>
      </div>
    </div>
  );
}

function EllipsisVertical4() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Ellipsis Vertical">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Ellipsis Vertical">
          <path clipRule="evenodd" d={svgPaths.p1592f580} fill="var(--fill-0, #09090B)" fillRule="evenodd" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function RightArrow1() {
  return (
    <div className="flex-[1_0_0] h-full min-h-px min-w-px relative" data-name="Right Arrow">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center justify-between px-[12px] relative size-full">
          <DocumentAttention2 />
          <EllipsisVertical4 />
        </div>
      </div>
    </div>
  );
}

function Row4() {
  return (
    <div className="h-[40px] relative rounded-[8px] shrink-0 w-full" data-name="Row">
      <div aria-hidden="true" className="absolute border border-[#cdd7e1] border-solid inset-[-1px] pointer-events-none rounded-[9px] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.05)]" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center pl-[16px] relative size-full">
          <TaskName4 />
          <DueDate13 />
          <AssignedTo3 />
          <Tools4 />
          <HealthCenter2 />
          <RightArrow1 />
        </div>
      </div>
    </div>
  );
}

function TaskTable() {
  return (
    <div className="content-stretch flex flex-col gap-[12px] items-start relative shrink-0 w-full" data-name="Task Table">
      <Columns />
      <Row />
      <Row1 />
      <Row2 />
      <Row3 />
      <Row4 />
    </div>
  );
}

function Div() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[16px] items-start justify-center left-0 pb-[32px] pt-[24px] px-[32px] top-[80px] w-[1440px]" data-name="Div">
      <TaskContainer />
      <Filters />
      <TaskTable />
    </div>
  );
}

function ChevronDown2() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Chevron Down">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Chevron Down">
          <path clipRule="evenodd" d={svgPaths.p248d3d00} fill="var(--fill-0, #FFCC66)" fillRule="evenodd" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function HealthCenter3() {
  return (
    <div className="content-stretch flex gap-[8px] h-[40px] items-center px-[16px] py-[8px] relative rounded-[6px] shrink-0" data-name="Health Center">
      <div aria-hidden="true" className="absolute border border-[#fc6] border-solid inset-[-1px] pointer-events-none rounded-[7px]" />
      <div className="flex flex-col font-['Geist:Medium',sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[#fc6] text-[14px] w-[169px]">
        <p className="leading-[20px] whitespace-pre-wrap">All Health Centers</p>
      </div>
      <ChevronDown2 />
    </div>
  );
}

function NavigationMenuItem() {
  return (
    <div className="content-stretch flex items-center justify-center relative rounded-[6px] shrink-0" data-name="Navigation Menu Item">
      <div className="flex flex-col font-['Geist:Medium',sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[#f4f4f5] text-[14px] whitespace-nowrap">
        <p className="leading-[20px]">Home</p>
      </div>
    </div>
  );
}

function NavigationMenuItem1() {
  return (
    <div className="content-stretch flex items-center justify-center relative rounded-[6px] shrink-0" data-name="Navigation Menu Item">
      <div className="flex flex-col font-['Geist:Medium',sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[#fc6] text-[14px] whitespace-nowrap">
        <p className="leading-[20px]">Tasks</p>
      </div>
    </div>
  );
}

function NavigationMenuItem2() {
  return (
    <div className="content-stretch flex items-center justify-center relative rounded-[6px] shrink-0" data-name="Navigation Menu Item">
      <div className="flex flex-col font-['Geist:Medium',sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[#f4f4f5] text-[14px] whitespace-nowrap">
        <p className="leading-[20px]">Checklists</p>
      </div>
    </div>
  );
}

function NavigationMenuItem3() {
  return (
    <div className="content-stretch flex items-center justify-center relative rounded-[6px] shrink-0" data-name="Navigation Menu Item">
      <div className="flex flex-col font-['Geist:Medium',sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[#f4f4f5] text-[14px] whitespace-nowrap">
        <p className="leading-[20px]">Tools</p>
      </div>
    </div>
  );
}

function NavigationMenuItem4() {
  return (
    <div className="content-stretch flex items-center justify-center relative rounded-[6px] shrink-0" data-name="Navigation Menu Item">
      <div className="flex flex-col font-['Geist:Medium',sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[#f4f4f5] text-[14px] whitespace-nowrap">
        <p className="leading-[20px]">Resources</p>
      </div>
    </div>
  );
}

function NavigationMenuItem5() {
  return (
    <div className="content-stretch flex items-center justify-center relative rounded-[6px] shrink-0" data-name="Navigation Menu Item">
      <div className="flex flex-col font-['Geist:Medium',sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[#f4f4f5] text-[14px] whitespace-nowrap">
        <p className="leading-[20px]">Documents</p>
      </div>
    </div>
  );
}

function NavigationMenuItem6() {
  return (
    <div className="content-stretch flex items-center justify-center relative rounded-[6px] shrink-0" data-name="Navigation Menu Item">
      <div className="flex flex-col font-['Geist:Medium',sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[#f4f4f5] text-[14px] whitespace-nowrap">
        <p className="leading-[20px]">Settings</p>
      </div>
    </div>
  );
}

function NavigationMenuItem7() {
  return <div className="h-[20px] rounded-[6px] shrink-0 w-[43px]" data-name="Navigation Menu Item" />;
}

function NavigationMenu1() {
  return (
    <div className="content-stretch flex gap-[32px] items-center pr-[24px] relative shrink-0" data-name="Navigation Menu">
      <NavigationMenuItem />
      <NavigationMenuItem1 />
      <NavigationMenuItem2 />
      <NavigationMenuItem3 />
      <NavigationMenuItem4 />
      <NavigationMenuItem5 />
      <NavigationMenuItem6 />
      <NavigationMenuItem7 />
    </div>
  );
}

function NavigationMenu() {
  return (
    <div className="content-stretch flex gap-[50px] items-center relative shrink-0 w-[972px]" data-name="Navigation Menu">
      <HealthCenter3 />
      <NavigationMenu1 />
    </div>
  );
}

function MarkCross() {
  return (
    <div className="absolute contents inset-[0_82.45%_0_0]" data-name="Mark-(Cross)">
      <div className="absolute inset-[0_82.45%_0_0]" data-name="Lantern">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 31.1655 40">
          <path d={svgPaths.pf818080} fill="var(--fill-0, #919599)" id="Lantern" />
        </svg>
      </div>
      <div className="absolute inset-[48.15%_88.74%_29.63%_6.29%]" data-name="Cross">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 8.82042 8.88889">
          <path d={svgPaths.p339abec0} fill="var(--fill-0, #FFCC66)" id="Cross" />
        </svg>
      </div>
    </div>
  );
}

function Type() {
  return (
    <div className="absolute contents inset-[45.17%_0_21.72%_20.88%]" data-name="Type">
      <div className="absolute inset-[46.01%_73.37%_22.52%_20.88%]" data-name="Combined-Shape">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 10.214 12.5867">
          <path d={svgPaths.p1b898a80} fill="var(--fill-0, #919599)" id="Combined-Shape" />
        </svg>
      </div>
      <div className="absolute inset-[46.01%_65.89%_22.52%_29.2%]" data-name="Path">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 8.71458 12.5867">
          <path d={svgPaths.p258c5a80} fill="var(--fill-0, #919599)" id="Path" />
        </svg>
      </div>
      <div className="absolute inset-[45.17%_56.94%_21.72%_36.48%]" data-name="Path">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 11.6782 13.2444">
          <path d={svgPaths.p88cd860} fill="var(--fill-0, #919599)" id="Path" />
        </svg>
      </div>
      <div className="absolute inset-[46.01%_49.47%_22.52%_46.1%]" data-name="Path">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 7.86782 12.5867">
          <path d={svgPaths.p16ade00} fill="var(--fill-0, #FFCC66)" id="Path" />
        </svg>
      </div>
      <div className="absolute inset-[46.01%_40.24%_22.52%_52.24%]" data-name="Combined-Shape">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 13.3541 12.5867">
          <path d={svgPaths.p21e71c80} fill="var(--fill-0, #FFCC66)" id="Combined-Shape" />
        </svg>
      </div>
      <div className="absolute inset-[46.01%_31.87%_22.52%_61.73%]" data-name="Path">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 11.3607 12.5867">
          <path d={svgPaths.p28048a00} fill="var(--fill-0, #FFCC66)" id="Path" />
        </svg>
      </div>
      <div className="absolute inset-[46.01%_24.01%_22.52%_70.31%]" data-name="Path">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 10.0729 12.5867">
          <path d={svgPaths.p1c90e3c0} fill="var(--fill-0, #FFCC66)" id="Path" />
        </svg>
      </div>
      <div className="absolute inset-[46.01%_16.92%_22.52%_78.17%]" data-name="Path">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 8.71459 12.5867">
          <path d={svgPaths.p2c966800} fill="var(--fill-0, #FFCC66)" id="Path" />
        </svg>
      </div>
      <div className="absolute inset-[46.01%_8.47%_22.52%_85.77%]" data-name="Combined-Shape">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 10.214 12.5867">
          <path d={svgPaths.pf512b00} fill="var(--fill-0, #FFCC66)" id="Combined-Shape" />
        </svg>
      </div>
      <div className="absolute inset-[46.01%_0_22.52%_93.6%]" data-name="Path">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 11.3607 12.5867">
          <path d={svgPaths.p15e2f480} fill="var(--fill-0, #FFCC66)" id="Path" />
        </svg>
      </div>
    </div>
  );
}

function RegLanternLogo() {
  return (
    <div className="absolute contents inset-0" data-name="RegLantern-Logo">
      <MarkCross />
      <Type />
    </div>
  );
}

function ReglanternLogo() {
  return (
    <div className="aspect-[133.1707305908203/30] h-full overflow-clip relative shrink-0" data-name="Reglantern Logo">
      <RegLanternLogo />
    </div>
  );
}

function MinWidth() {
  return <div className="mr-[-13px] shrink-0 size-[40px]" data-name="min-width" />;
}

function AvatarSolid4() {
  return (
    <div className="bg-[#fc6] content-stretch flex items-center justify-center overflow-clip pr-[13px] relative rounded-[100px] shrink-0" data-name="<Avatar>/Solid">
      <MinWidth />
      <p className="-translate-x-1/2 absolute font-['Inter:Bold',sans-serif] font-bold leading-[1.33] left-[calc(50%+0.5px)] not-italic text-[#373f51] text-[16px] text-center top-[calc(50%-10px)]">TF</p>
    </div>
  );
}

function ProfileButtonIcon() {
  return (
    <div className="relative size-[16px]" data-name="Profile Button Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Profile Button Icon">
          <path d={svgPaths.p3d8d1980} fill="var(--fill-0, #FFCC66)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function ProfileButton1() {
  return (
    <div className="content-stretch flex gap-[8px] items-center justify-end relative shrink-0 w-[68px]" data-name="Profile Button">
      <AvatarSolid4 />
      <div className="flex items-center justify-center relative shrink-0 size-[16px]" style={{ "--transform-inner-width": "1200", "--transform-inner-height": "153.328125" } as React.CSSProperties}>
        <div className="flex-none rotate-90">
          <ProfileButtonIcon />
        </div>
      </div>
    </div>
  );
}

function ProfileButton() {
  return (
    <div className="content-stretch flex items-center justify-end relative shrink-0" data-name="Profile Button">
      <ProfileButton1 />
    </div>
  );
}

function Logo() {
  return (
    <div className="content-stretch flex gap-[32px] h-full items-center justify-end relative shrink-0" data-name="Logo">
      <ReglanternLogo />
      <ProfileButton />
    </div>
  );
}

function TopBar() {
  return (
    <div className="absolute bg-[#32383e] content-stretch flex items-center justify-between left-0 p-[20px] top-0 w-[1440px]" data-name="Top Bar">
      <NavigationMenu />
      <div className="flex flex-row items-center self-stretch">
        <Logo />
      </div>
    </div>
  );
}

export default function Tasks() {
  return (
    <div className="bg-white relative size-full" data-name="Tasks">
      <Div />
      <TopBar />
    </div>
  );
}