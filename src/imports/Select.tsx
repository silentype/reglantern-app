import svgPaths from "./svg-rtwaejf5mz";

function ChevronUp() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Chevron Up">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Chevron Up" opacity="0.5">
          <path clipRule="evenodd" d={svgPaths.p189ae680} fill="var(--fill-0, #09090B)" fillRule="evenodd" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Icon() {
  return (
    <div className="content-stretch flex items-center pl-[8px] relative shrink-0" data-name="Icon">
      <ChevronUp />
    </div>
  );
}

function Select2() {
  return (
    <div className="bg-white h-[40px] relative rounded-[6px] shrink-0 w-full" data-name="Select">
      <div aria-hidden="true" className="absolute border border-[#e4e4e7] border-solid inset-0 pointer-events-none rounded-[6px]" />
      <div className="flex flex-row items-center justify-center size-full">
        <div className="content-stretch flex items-center justify-center px-[12px] py-[8px] relative size-full">
          <div className="flex flex-[1_0_0] flex-col font-['Geist:Regular',sans-serif] font-normal h-[20px] justify-center leading-[0] min-h-px min-w-px relative text-[#18181b] text-[14px]">
            <p className="leading-[20px] whitespace-pre-wrap">Select Status</p>
          </div>
          <Icon />
        </div>
      </div>
    </div>
  );
}

function Select1() {
  return (
    <div className="absolute content-stretch flex flex-col items-start left-0 top-0 w-[204px]" data-name="Select">
      <Select2 />
    </div>
  );
}

function Row() {
  return (
    <div className="relative rounded-[4px] shrink-0 w-full" data-name="Row">
      <div className="flex flex-row items-center justify-center size-full">
        <div className="content-stretch flex items-center justify-center pl-[28px] pr-[8px] py-[6px] relative w-full">
          <div className="flex flex-[1_0_0] flex-col font-['Geist:Regular',sans-serif] font-normal h-[20px] justify-center leading-[0] min-h-px min-w-px relative text-[#09090b] text-[14px]">
            <p className="leading-[20px] whitespace-pre-wrap">Ready for Review</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Row1() {
  return (
    <div className="relative rounded-[4px] shrink-0 w-full" data-name="Row">
      <div className="flex flex-row items-center justify-center size-full">
        <div className="content-stretch flex items-center justify-center pl-[28px] pr-[8px] py-[6px] relative w-full">
          <div className="flex flex-[1_0_0] flex-col font-['Geist:Regular',sans-serif] font-normal h-[20px] justify-center leading-[0] min-h-px min-w-px relative text-[#09090b] text-[14px]">
            <p className="leading-[20px] whitespace-pre-wrap">Ready for Upload</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Row2() {
  return (
    <div className="bg-[#f4f4f5] relative rounded-[4px] shrink-0 w-full" data-name="Row">
      <div className="flex flex-row items-center justify-center size-full">
        <div className="content-stretch flex items-center justify-center pl-[28px] pr-[8px] py-[6px] relative w-full">
          <div className="flex flex-[1_0_0] flex-col font-['Geist:Regular',sans-serif] font-normal h-[20px] justify-center leading-[0] min-h-px min-w-px relative text-[#09090b] text-[14px]">
            <p className="leading-[20px] whitespace-pre-wrap">Complete</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Row3() {
  return (
    <div className="relative rounded-[4px] shrink-0 w-full" data-name="Row">
      <div className="flex flex-row items-center justify-center size-full">
        <div className="content-stretch flex items-center justify-center pl-[28px] pr-[8px] py-[6px] relative w-full">
          <div className="flex flex-[1_0_0] flex-col font-['Geist:Regular',sans-serif] font-normal h-[20px] justify-center leading-[0] min-h-px min-w-px relative text-[#09090b] text-[14px]">
            <p className="leading-[20px] whitespace-pre-wrap">Incomplete</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Rows() {
  return (
    <div className="relative shrink-0 w-full" data-name="Rows">
      <div className="content-stretch flex flex-col items-start p-[4px] relative w-full">
        <Row />
        <Row1 />
        <Row2 />
        <Row3 />
      </div>
    </div>
  );
}

function Popover() {
  return (
    <div className="bg-white content-stretch flex flex-col items-start relative rounded-[6px] shrink-0 w-full" data-name="Popover">
      <div aria-hidden="true" className="absolute border border-[#e4e4e7] border-solid inset-0 pointer-events-none rounded-[6px] shadow-[0px_2px_4px_0px_rgba(0,0,0,0.1),0px_4px_6px_0px_rgba(0,0,0,0.1)]" />
      <Rows />
    </div>
  );
}

function Div() {
  return (
    <div className="absolute content-stretch flex flex-col items-start left-0 top-[47px] w-[204px]" data-name="Div">
      <Popover />
    </div>
  );
}

export default function Select() {
  return (
    <div className="relative size-full" data-name="Select">
      <Select1 />
      <Div />
    </div>
  );
}