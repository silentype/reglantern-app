import svgPaths from "./svg-oo9u3g75ma";

function Group() {
  return (
    <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid leading-[0] place-items-start relative shrink-0">
      <div className="bg-white col-1 content-stretch flex h-[40px] items-center max-w-[384px] ml-0 mt-0 px-[16px] py-[8px] relative rounded-[6px] row-1 w-[289.899px]" data-name="Input/Default">
        <div aria-hidden="true" className="absolute border border-[#e4e4e7] border-solid inset-0 pointer-events-none rounded-[6px]" />
        <div className="flex flex-[1_0_0] flex-col font-['Geist:Regular',sans-serif] font-normal justify-center leading-[0] min-h-px min-w-px relative text-[#71717a] text-[14px]">
          <p className="leading-[20px] whitespace-pre-wrap">Search tasks</p>
        </div>
      </div>
    </div>
  );
}

function Icon() {
  return (
    <div className="content-stretch flex items-center pl-[8px] relative shrink-0" data-name="Icon">
      <div className="overflow-clip relative shrink-0 size-[16px]" data-name="Settings 2">
        <div className="absolute inset-[12.5%]" data-name="Icon">
          <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 12">
            <path clipRule="evenodd" d={svgPaths.p5c18830} fill="var(--fill-0, #18181b)" fillRule="evenodd" id="Icon" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Select() {
  return (
    <div className="bg-white content-stretch flex h-[40px] items-center justify-center px-[12px] py-[8px] relative rounded-[6px] shrink-0" data-name="Select">
      <div aria-hidden="true" className="absolute border border-[#e4e4e7] border-solid inset-0 pointer-events-none rounded-[6px]" />
      <div className="flex flex-col font-['Geist:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#18181b] text-[14px] whitespace-nowrap">
        <p className="leading-[20px]">Filters</p>
      </div>
      <Icon />
    </div>
  );
}

function Frame() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0">
      <Group />
      <Select />
    </div>
  );
}

export default function Filters() {
  return (
    <div className="content-stretch flex items-center justify-between relative size-full" data-name="Filters">
      <div className="bg-[#fc6] content-stretch flex gap-[8px] h-[40px] items-center px-[16px] py-[8px] relative rounded-[6px] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.05)] shrink-0" data-name="Action Button">
        <div className="flex flex-col font-['Geist:Medium',sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[#18181b] text-[14px] whitespace-nowrap">
          <p className="leading-[20px]">Add a Task</p>
        </div>
        <div className="overflow-clip relative shrink-0 size-[16px]" data-name="Plus">
          <div className="absolute inset-[16.67%]" data-name="Icon">
            <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 10.6667 10.6667">
              <path clipRule="evenodd" d={svgPaths.p1a739400} fill="var(--fill-0, #18181b)" fillRule="evenodd" id="Icon" />
            </svg>
          </div>
        </div>
      </div>
      <Frame />
    </div>
  );
}