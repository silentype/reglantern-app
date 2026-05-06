import svgPaths from "./svg-qmhm1wx3l7";

function Icon() {
  return (
    <div className="content-stretch flex items-center pl-[8px] relative shrink-0" data-name="Icon">
      <div className="overflow-clip relative shrink-0 size-[16px]" data-name="Status Dropdown Icon">
        <div className="absolute inset-[33.33%_20.83%]" data-name="Icon">
          <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 9.33333 5.33333">
            <path clipRule="evenodd" d={svgPaths.p23cd8f00} fill="var(--fill-0, #18181B)" fillRule="evenodd" id="Icon" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Select() {
  return (
    <div className="bg-white content-stretch flex h-[40px] items-center justify-between px-[12px] py-[8px] relative rounded-[6px] shrink-0 w-[200px]" data-name="Select">
      <div aria-hidden="true" className="absolute border border-[#e4e4e7] border-solid inset-0 pointer-events-none rounded-[6px]" />
      <div className="flex flex-col font-['Geist:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#18181b] text-[14px] whitespace-nowrap">
        <p className="leading-[20px]">Select Status</p>
      </div>
      <Icon />
    </div>
  );
}

function Frame() {
  return (
    <div className="content-stretch flex gap-[16px] items-center relative shrink-0">
      <div className="bg-[#fc6] content-stretch flex gap-[8px] h-[40px] items-center px-[16px] py-[8px] relative rounded-[6px] shrink-0" data-name="Action Button">
        <div className="flex flex-col font-['Geist:Medium',sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[#18181b] text-[14px] whitespace-nowrap">
          <p className="leading-[20px]">Save</p>
        </div>
      </div>
      <Select />
    </div>
  );
}

function H() {
  return (
    <div className="content-stretch flex items-center justify-between relative shrink-0 w-full" data-name="H2">
      <Frame />
      <div className="overflow-clip relative shrink-0 size-[24px]" data-name="Close Button">
        <div className="absolute inset-[20.83%]" data-name="Icon">
          <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
            <path clipRule="evenodd" d={svgPaths.p34ceb700} fill="var(--fill-0, #09090B)" fillRule="evenodd" id="Icon" />
          </svg>
        </div>
      </div>
    </div>
  );
}

export default function Div() {
  return (
    <div className="content-stretch flex flex-col items-start p-[24px] relative size-full" data-name="Div">
      <H />
    </div>
  );
}