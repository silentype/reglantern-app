import svgPaths from "./svg-xpk29wrq0q";

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

function HealthCenter() {
  return (
    <div className="content-stretch flex gap-[8px] h-full items-center px-[12px] relative shrink-0 w-[206px]" data-name="Health Center">
      <HealthCenterHeader />
      <DragIndicator3 />
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

function DueDate3() {
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

function DueDate4() {
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

function DueDate5() {
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

function DueDate6() {
  return (
    <div className="content-stretch flex h-full items-center justify-between px-[12px] relative shrink-0 w-[186px]" data-name="Due Date">
      <div aria-hidden="true" className="absolute border-[#cdd7e1] border-r border-solid inset-0 pointer-events-none" />
      <div className="flex flex-col font-['Geist:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#999] text-[14px] whitespace-nowrap">
        <p className="leading-[20px]">Assign User</p>
      </div>
      <AssignUserDropdownIcon1 />
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

function DueDate7() {
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
          <path d={svgPaths.p183b5840} fill="var(--fill-0, #8745AE)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function DocumentAttention1() {
  return (
    <div className="content-stretch flex gap-[4px] items-center relative shrink-0" data-name="Document Attention">
      <InsertDriveFile />
      <div className="flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[#8745ae] text-[12px] whitespace-nowrap">
        <p className="leading-[normal]">1 Needs Attention</p>
      </div>
    </div>
  );
}

function DocumentAttention() {
  return (
    <div className="content-stretch flex items-center relative shrink-0" data-name="Document Attention">
      <DocumentAttention1 />
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
          <DueDate5 />
          <DueDate6 />
          <DueDate7 />
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

function DueDate8() {
  return (
    <div className="content-stretch flex h-full items-center justify-between px-[12px] relative shrink-0 w-[161px]" data-name="Due Date">
      <div aria-hidden="true" className="absolute border-[#cdd7e1] border-r border-solid inset-0 pointer-events-none" />
      <div className="flex flex-col font-['Geist:Medium',sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[#09090b] text-[14px] whitespace-nowrap">
        <p className="leading-[20px]">12/10/2026</p>
      </div>
      <DueDateIcon2 />
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

function AssignedToContainer() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0" data-name="Assigned To Container">
      <AvatarSolid />
      <div className="flex flex-col font-['Geist:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#09090b] text-[14px] whitespace-nowrap">
        <p className="leading-[20px]">Tim Freeman</p>
      </div>
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

function AssignedTo1() {
  return (
    <div className="content-stretch flex h-full items-center justify-between px-[12px] relative shrink-0 w-[186px]" data-name="Assigned To">
      <div aria-hidden="true" className="absolute border-[#cdd7e1] border-r border-solid inset-0 pointer-events-none" />
      <AssignedToContainer />
      <AssignedToDropdownIcon />
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
          <path d={svgPaths.p183b5840} fill="var(--fill-0, #8745AE)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function DocumentAttention3() {
  return (
    <div className="content-stretch flex gap-[4px] items-center relative shrink-0" data-name="Document Attention">
      <InsertDriveFile1 />
      <div className="flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[#8745ae] text-[12px] whitespace-nowrap">
        <p className="leading-[normal]">1 Needs Attention</p>
      </div>
    </div>
  );
}

function DocumentAttention2() {
  return (
    <div className="content-stretch flex items-center relative shrink-0" data-name="Document Attention">
      <DocumentAttention3 />
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

function AttentionRightArrow1() {
  return (
    <div className="flex-[1_0_0] h-full min-h-px min-w-px relative" data-name="Attention + Right Arrow">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center justify-between px-[12px] relative size-full">
          <DocumentAttention2 />
          <EllipsisVertical2 />
        </div>
      </div>
    </div>
  );
}

function Row2() {
  return (
    <div className="bg-white h-[40px] relative rounded-[8px] shrink-0 w-full" data-name="Row">
      <div aria-hidden="true" className="absolute border border-[#cdd7e1] border-solid inset-[-1px] pointer-events-none rounded-[9px] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.05)]" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center pl-[16px] relative size-full">
          <TaskName2 />
          <DueDate8 />
          <AssignedTo1 />
          <HealthCenter1 />
          <AttentionRightArrow1 />
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

function DueDate9() {
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
    <div className="content-stretch flex h-full items-center justify-between px-[12px] relative shrink-0 w-[194px]" data-name="Health Center">
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
          <path d={svgPaths.p183b5840} fill="var(--fill-0, #8745AE)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function DocumentAttention4() {
  return (
    <div className="content-stretch flex gap-[4px] items-center relative shrink-0" data-name="Document Attention">
      <InsertDriveFile2 />
      <div className="flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[#8745ae] text-[12px] whitespace-nowrap">
        <p className="leading-[normal]">1 Needs Attention</p>
      </div>
    </div>
  );
}

function NoSim() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="no_sim">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="no_sim">
          <path d={svgPaths.pabe8980} fill="var(--fill-0, #C41C1C)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function DocumentAttention5() {
  return (
    <div className="content-stretch flex gap-[4px] items-center relative shrink-0" data-name="Document Attention">
      <NoSim />
      <div className="flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[#c41c1c] text-[12px] whitespace-nowrap">
        <p className="leading-[normal]">2 Missing Files</p>
      </div>
    </div>
  );
}

function Frame() {
  return (
    <div className="content-stretch flex gap-[16px] items-center relative shrink-0">
      <DocumentAttention4 />
      <DocumentAttention5 />
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

function AttentionRightArrow2() {
  return (
    <div className="flex-[1_0_0] h-full min-h-px min-w-px relative" data-name="Attention + Right Arrow">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center justify-between px-[12px] relative size-full">
          <Frame />
          <EllipsisVertical3 />
        </div>
      </div>
    </div>
  );
}

function Row3() {
  return (
    <div className="bg-white h-[40px] relative rounded-[8px] shrink-0 w-full" data-name="Row">
      <div aria-hidden="true" className="absolute border border-[#cdd7e1] border-solid inset-[-1px] pointer-events-none rounded-[9px] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.05)]" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center pl-[16px] relative size-full">
          <TaskName3 />
          <DueDate9 />
          <AssignedTo2 />
          <HealthCenter2 />
          <AttentionRightArrow2 />
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

function DueDate10() {
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

function AvatarSolid2() {
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
      <AvatarSolid2 />
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

function TestHealthCenterDropdownIcon2() {
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

function HealthCenter3() {
  return (
    <div className="content-stretch flex h-full items-center justify-between px-[12px] relative shrink-0 w-[194px]" data-name="Health Center">
      <div aria-hidden="true" className="absolute border-[#cdd7e1] border-r border-solid inset-0 pointer-events-none" />
      <div className="flex flex-col font-['Geist:Medium',sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[#09090b] text-[14px] whitespace-nowrap">
        <p className="leading-[20px]">Test Health Center</p>
      </div>
      <TestHealthCenterDropdownIcon2 />
    </div>
  );
}

function NoSim1() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="no_sim">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="no_sim">
          <path d={svgPaths.pabe8980} fill="var(--fill-0, #C41C1C)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function DocumentAttention6() {
  return (
    <div className="content-stretch flex gap-[4px] items-center relative shrink-0" data-name="Document Attention">
      <NoSim1 />
      <div className="flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[#c41c1c] text-[12px] whitespace-nowrap">
        <p className="leading-[normal]">2 Missing Files</p>
      </div>
    </div>
  );
}

function Frame1() {
  return (
    <div className="content-stretch flex items-center relative shrink-0">
      <DocumentAttention6 />
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

function AttentionRightArrow3() {
  return (
    <div className="flex-[1_0_0] h-full min-h-px min-w-px relative" data-name="Attention + Right Arrow">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center justify-between px-[12px] relative size-full">
          <Frame1 />
          <EllipsisVertical4 />
        </div>
      </div>
    </div>
  );
}

function Row4() {
  return (
    <div className="bg-white h-[40px] relative rounded-[8px] shrink-0 w-full" data-name="Row">
      <div aria-hidden="true" className="absolute border border-[#cdd7e1] border-solid inset-[-1px] pointer-events-none rounded-[9px] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.05)]" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center pl-[16px] relative size-full">
          <TaskName4 />
          <DueDate10 />
          <AssignedTo3 />
          <HealthCenter3 />
          <AttentionRightArrow3 />
        </div>
      </div>
    </div>
  );
}

export default function TaskTable() {
  return (
    <div className="content-stretch flex flex-col gap-[12px] items-start relative size-full" data-name="Task Table">
      <Columns />
      <Row />
      <Row1 />
      <Row2 />
      <Row3 />
      <Row4 />
    </div>
  );
}