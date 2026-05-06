import svgPaths from "./svg-sx8gdg6uns";

function Plus() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Plus">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Plus">
          <path clipRule="evenodd" d={svgPaths.p1ed18e80} fill="var(--fill-0, #18181b)" fillRule="evenodd" id="Icon" />
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
      <div className="-translate-x-1/2 -translate-y-1/2 absolute flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] left-1/2 not-italic size-[30px] text-[#18181b] text-[12px] text-center top-1/2">
        <p className="leading-[1.33] whitespace-pre-wrap">TF</p>
      </div>
    </div>
  );
}

function AssignedToDropdown() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0" data-name="Assigned To Dropdown">
      <AvatarSolid />
      <div className="flex flex-col font-['Geist:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#18181b] text-[14px] whitespace-nowrap">
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

export default function Filters() {
  return (
    <div className="content-stretch flex items-center justify-between relative size-full" data-name="Filters">
      <ActionButton />
      <Group />
    </div>
  );
}