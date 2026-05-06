import svgPaths from "./svg-2kgd2fmdg0";

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
        <p className="leading-[20px]">View Filters</p>
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

function Group() {
  return (
    <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid leading-[0] place-items-start relative shrink-0">
      <Select />
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