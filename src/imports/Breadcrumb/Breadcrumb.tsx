import svgPaths from "./svg-b16mjavhsk";

export default function Breadcrumb() {
  return (
    <div className="content-stretch flex gap-[10px] items-center relative size-full" data-name="Breadcrumb">
      <div className="flex flex-col font-['Geist:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#71717a] text-[14px] whitespace-nowrap">
        <p className="leading-[20px]">Chapter 1</p>
      </div>
      <div className="overflow-clip relative shrink-0 size-[24px]" data-name="Chevron Right">
        <div className="absolute inset-[20.83%_33.33%]" data-name="Icon">
          <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 8 14">
            <path clipRule="evenodd" d={svgPaths.p1c6e4d00} fill="var(--fill-0, #71717A)" fillRule="evenodd" id="Icon" />
          </svg>
        </div>
      </div>
      <div className="flex flex-col font-['Geist:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#71717a] text-[14px] whitespace-nowrap">
        <p className="leading-[20px]">{`Element `}</p>
      </div>
      <div className="overflow-clip relative shrink-0 size-[24px]" data-name="Chevron Right">
        <div className="absolute inset-[20.83%_33.33%]" data-name="Icon">
          <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 8 14">
            <path clipRule="evenodd" d={svgPaths.p1c6e4d00} fill="var(--fill-0, #71717A)" fillRule="evenodd" id="Icon" />
          </svg>
        </div>
      </div>
      <div className="flex flex-col font-['Geist:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#09090b] text-[14px] whitespace-nowrap">
        <p className="leading-[20px]">Service Identification</p>
      </div>
    </div>
  );
}