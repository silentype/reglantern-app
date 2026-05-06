import svgPaths from "./svg-9dvk04xanb";

function MultiFileUploadPanel() {
  return (
    <div className="h-[20px] relative shrink-0 w-[74.563px]" data-name="MultiFileUploadPanel">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="-translate-x-1/2 absolute font-['Inter:Medium',sans-serif] font-medium leading-[20px] left-[37px] not-italic text-[#18181b] text-[14px] text-center top-0 tracking-[-0.1504px] whitespace-nowrap">In Progress</p>
      </div>
    </div>
  );
}

function Icon() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon" opacity="0.5">
          <path d={svgPaths.p17a0fc80} id="Vector" stroke="var(--stroke-0, #18181B)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p3042540} id="Vector_2" stroke="var(--stroke-0, #18181B)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function SlotClone() {
  return (
    <div className="bg-white flex-[1_0_0] h-[38px] min-w-px relative rounded-[8px]" data-name="SlotClone">
      <div aria-hidden="true" className="absolute border border-[#e4e4e7] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <div className="flex flex-row items-center size-full">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-between px-[13px] py-px relative size-full">
          <MultiFileUploadPanel />
          <Icon />
        </div>
      </div>
    </div>
  );
}

function Container1() {
  return (
    <div className="h-[38px] relative shrink-0 w-[200px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center relative size-full">
        <SlotClone />
      </div>
    </div>
  );
}

function Icon1() {
  return (
    <div className="h-[24px] overflow-clip relative shrink-0 w-full" data-name="Icon">
      <div className="absolute inset-1/4" data-name="Vector">
        <div className="absolute inset-[-8.33%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
            <path d="M13 1L1 13" id="Vector" stroke="var(--stroke-0, #18181B)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          </svg>
        </div>
      </div>
      <div className="absolute inset-1/4" data-name="Vector">
        <div className="absolute inset-[-8.33%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
            <path d="M1 1L13 13" id="Vector" stroke="var(--stroke-0, #18181B)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Button() {
  return (
    <div className="flex-[1_0_0] h-[32px] min-w-px relative rounded-[4px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pt-[4px] px-[4px] relative size-full">
        <Icon1 />
      </div>
    </div>
  );
}

function Container2() {
  return (
    <div className="relative shrink-0 size-[32px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center relative size-full">
        <Button />
      </div>
    </div>
  );
}

function Container() {
  return (
    <div className="absolute content-stretch flex h-[87px] items-center justify-between left-0 pb-px px-[24px] top-0 w-[569px]" data-name="Container">
      <div aria-hidden="true" className="absolute border-[#e5e7eb] border-b border-solid inset-0 pointer-events-none" />
      <Container1 />
      <Container2 />
    </div>
  );
}

function Heading() {
  return (
    <div className="font-['Inter:Regular',sans-serif] font-normal h-[216px] not-italic relative shrink-0 text-[#09090b] w-full" data-name="Heading 2">
      <p className="absolute leading-[27px] left-0 text-[18px] top-px tracking-[-0.0395px] w-[506px]">Upload and verify all required enrollment documentation for patient records</p>
      <p className="absolute leading-[22.5px] left-0 text-[15px] top-[64px] tracking-[0.1656px] w-[486px]">Submit quarterly clinical report to regulatory authorities with detailed analysis of patient outcomes, adverse events, and study protocol adherence metrics including comprehensive statistical analysis, safety data review, enrollment progress updates, protocol deviations documentation, data quality metrics, and recommendations for ongoing study management with supporting appendices and source documentation</p>
    </div>
  );
}

function Paragraph() {
  return <div className="h-[9px] shrink-0 w-full" data-name="Paragraph" />;
}

function Container7() {
  return (
    <div className="absolute content-stretch flex h-[16px] items-start left-[16px] top-[8px] w-[295px]" data-name="Container">
      <p className="flex-[1_0_0] font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[16px] min-w-px not-italic relative text-[#6b7280] text-[12px] tracking-[0.3px] uppercase">Subtask</p>
    </div>
  );
}

function Container8() {
  return (
    <div className="absolute content-stretch flex h-[16px] items-start left-[327px] top-[8px] w-[140px]" data-name="Container">
      <p className="flex-[1_0_0] font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[16px] min-w-px not-italic relative text-[#6b7280] text-[12px] tracking-[0.3px] uppercase">Status</p>
    </div>
  );
}

function Container6() {
  return (
    <div className="bg-[#f9fafb] h-[33px] relative shrink-0 w-full" data-name="Container">
      <div aria-hidden="true" className="absolute border-[#e4e4e7] border-b border-solid inset-0 pointer-events-none" />
      <Container7 />
      <Container8 />
    </div>
  );
}

function Heading1() {
  return (
    <div className="absolute h-[20px] left-[16px] overflow-clip top-[14px] w-[295px]" data-name="Heading 4">
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[20px] left-0 not-italic text-[#18181b] text-[14px] top-0 tracking-[-0.1504px] whitespace-nowrap">Safety Data Report</p>
    </div>
  );
}

function Container10() {
  return (
    <div className="absolute h-[24px] left-[327px] top-[12px] w-[140px]" data-name="Container">
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[16px] left-0 not-italic text-[#6b7280] text-[12px] top-[3px] whitespace-nowrap">Not applicable</p>
    </div>
  );
}

function Icon2() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d="M6 12L10 8L6 4" id="Vector" stroke="var(--stroke-0, #6B7280)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Container11() {
  return (
    <div className="absolute content-stretch flex h-[16px] items-center justify-center left-[483px] px-[2px] top-[16px] w-[20px]" data-name="Container">
      <Icon2 />
    </div>
  );
}

function Button1() {
  return (
    <div className="h-[49px] relative shrink-0 w-full" data-name="Button">
      <div aria-hidden="true" className="absolute border-[#e4e4e7] border-b border-solid inset-0 pointer-events-none" />
      <Heading1 />
      <Container10 />
      <Container11 />
    </div>
  );
}

function Heading2() {
  return (
    <div className="absolute h-[20px] left-[16px] overflow-clip top-[14px] w-[295px]" data-name="Heading 4">
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[20px] left-0 not-italic text-[#18181b] text-[14px] top-0 tracking-[-0.1504px] whitespace-nowrap">Enrollment Progress Report</p>
    </div>
  );
}

function Container12() {
  return (
    <div className="absolute h-[24px] left-[327px] top-[12px] w-[140px]" data-name="Container">
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[16px] left-0 not-italic text-[#16a34a] text-[12px] top-[3px] whitespace-nowrap">1 file uploaded</p>
    </div>
  );
}

function Icon3() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d="M6 12L10 8L6 4" id="Vector" stroke="var(--stroke-0, #6B7280)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Container13() {
  return (
    <div className="absolute content-stretch flex h-[16px] items-center justify-center left-[483px] px-[2px] top-[16px] w-[20px]" data-name="Container">
      <Icon3 />
    </div>
  );
}

function Button2() {
  return (
    <div className="h-[49px] relative shrink-0 w-full" data-name="Button">
      <div aria-hidden="true" className="absolute border-[#e4e4e7] border-b border-solid inset-0 pointer-events-none" />
      <Heading2 />
      <Container12 />
      <Container13 />
    </div>
  );
}

function Heading3() {
  return (
    <div className="absolute h-[20px] left-[16px] overflow-clip top-[14px] w-[295px]" data-name="Heading 4">
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[20px] left-0 not-italic text-[#18181b] text-[14px] top-0 tracking-[-0.1504px] whitespace-nowrap">Protocol Deviations Summary</p>
    </div>
  );
}

function Container14() {
  return (
    <div className="absolute h-[24px] left-[327px] top-[12px] w-[140px]" data-name="Container">
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[16px] left-0 not-italic text-[#dc2626] text-[12px] top-[3px] whitespace-nowrap">Missing files</p>
    </div>
  );
}

function Icon4() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d="M6 12L10 8L6 4" id="Vector" stroke="var(--stroke-0, #6B7280)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Container15() {
  return (
    <div className="absolute content-stretch flex h-[16px] items-center justify-center left-[483px] px-[2px] top-[16px] w-[20px]" data-name="Container">
      <Icon4 />
    </div>
  );
}

function Button3() {
  return (
    <div className="h-[49px] relative shrink-0 w-full" data-name="Button">
      <div aria-hidden="true" className="absolute border-[#e4e4e7] border-b border-solid inset-0 pointer-events-none" />
      <Heading3 />
      <Container14 />
      <Container15 />
    </div>
  );
}

function Container9() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <Button1 />
      <Button2 />
      <Button3 />
    </div>
  );
}

function Container5() {
  return (
    <div className="relative rounded-[10px] shrink-0 w-[521px]" data-name="Container">
      <div className="content-stretch flex flex-col items-start overflow-clip p-px relative rounded-[inherit] size-full">
        <Container6 />
        <Container9 />
      </div>
      <div aria-hidden="true" className="absolute border border-[#e4e4e7] border-solid inset-0 pointer-events-none rounded-[10px]" />
    </div>
  );
}

function Container4() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="content-stretch flex flex-col gap-[12px] items-start pt-[24px] px-[24px] relative size-full">
        <Heading />
        <Paragraph />
        <Container5 />
      </div>
    </div>
  );
}

function Container3() {
  return (
    <div className="absolute content-stretch flex flex-col items-start left-0 pt-[-153px] top-[241px] w-[569px]" data-name="Container">
      <Container4 />
    </div>
  );
}

function TabButton() {
  return (
    <div className="bg-white flex-[128.25_0_0] h-[32px] min-w-px relative rounded-[4px] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_0px_rgba(0,0,0,0.1)]" data-name="TabButton">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="-translate-x-1/2 absolute font-['Inter:Medium',sans-serif] font-medium leading-[20px] left-[64.38px] not-italic text-[#09090b] text-[14px] text-center top-[6px] tracking-[-0.1504px] whitespace-nowrap">Details</p>
      </div>
    </div>
  );
}

function TabButton1() {
  return (
    <div className="flex-[128.25_0_0] h-[32px] min-w-px relative rounded-[4px]" data-name="TabButton">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="-translate-x-1/2 absolute font-['Inter:Medium',sans-serif] font-medium leading-[20px] left-[64.36px] not-italic text-[#6b7280] text-[14px] text-center top-[6px] tracking-[-0.1504px] whitespace-nowrap">Comments</p>
      </div>
    </div>
  );
}

function TabButton2() {
  return (
    <div className="flex-[128.25_0_0] h-[32px] min-w-px relative rounded-[4px]" data-name="TabButton">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="-translate-x-1/2 absolute font-['Inter:Medium',sans-serif] font-medium leading-[20px] left-[64.25px] not-italic text-[#6b7280] text-[14px] text-center top-[6px] tracking-[-0.1504px] whitespace-nowrap">Activity</p>
      </div>
    </div>
  );
}

function TabButton3() {
  return (
    <div className="flex-[128.25_0_0] h-[32px] min-w-px relative rounded-[4px]" data-name="TabButton">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="-translate-x-1/2 absolute font-['Inter:Medium',sans-serif] font-medium leading-[20px] left-[64.38px] not-italic text-[#6b7280] text-[14px] text-center top-[6px] tracking-[-0.1504px] whitespace-nowrap">Guidance</p>
      </div>
    </div>
  );
}

function Container17() {
  return (
    <div className="bg-[#f4f4f5] h-[40px] relative rounded-[8px] shrink-0 w-full" data-name="Container">
      <div className="content-stretch flex items-start pt-[4px] px-[4px] relative size-full">
        <TabButton />
        <TabButton1 />
        <TabButton2 />
        <TabButton3 />
      </div>
    </div>
  );
}

function Icon5() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Icon">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Icon">
          <path d="M6.66667 1.66667V5" id="Vector" stroke="var(--stroke-0, #09090B)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d="M13.3333 1.66667V5" id="Vector_2" stroke="var(--stroke-0, #09090B)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d={svgPaths.p1da67b80} id="Vector_3" stroke="var(--stroke-0, #09090B)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d="M2.5 8.33333H17.5" id="Vector_4" stroke="var(--stroke-0, #09090B)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
        </g>
      </svg>
    </div>
  );
}

function Text() {
  return (
    <div className="h-[20px] relative shrink-0 w-[104px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[20px] left-0 not-italic text-[#09090b] text-[14px] top-0 tracking-[-0.1504px] whitespace-nowrap">Due Date</p>
      </div>
    </div>
  );
}

function Icon6() {
  return (
    <div className="absolute left-[211px] size-[16px] top-[11px]" data-name="Icon">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d="M4 6L8 10L12 6" id="Vector" stroke="var(--stroke-0, #71717A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function SlotClone1() {
  return (
    <div className="bg-white flex-[240_0_0] h-[38px] min-w-px relative rounded-[8px]" data-name="SlotClone">
      <div aria-hidden="true" className="absolute border border-[#e4e4e7] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="-translate-x-1/2 absolute font-['Inter:Medium',sans-serif] font-medium leading-[20px] left-[52px] not-italic text-[#18181b] text-[14px] text-center top-[9px] tracking-[-0.1504px] whitespace-nowrap">02/28/2026</p>
        <Icon6 />
      </div>
    </div>
  );
}

function Container19() {
  return (
    <div className="h-[38px] relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[8px] items-center pr-[141px] relative size-full">
          <Icon5 />
          <Text />
          <SlotClone1 />
        </div>
      </div>
    </div>
  );
}

function Icon7() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Icon">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Icon">
          <path d={svgPaths.p2026e800} id="Vector" stroke="var(--stroke-0, #09090B)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d={svgPaths.p32ab0300} id="Vector_2" stroke="var(--stroke-0, #09090B)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
        </g>
      </svg>
    </div>
  );
}

function Text1() {
  return (
    <div className="h-[20px] relative shrink-0 w-[104px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[20px] left-0 not-italic text-[#09090b] text-[14px] top-0 tracking-[-0.1504px] whitespace-nowrap">Assigned to</p>
      </div>
    </div>
  );
}

function Container21() {
  return (
    <div className="bg-[#fc6] relative rounded-[33554400px] shrink-0 size-[24px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <p className="font-['Inter:Medium',sans-serif] font-medium leading-[16px] not-italic relative shrink-0 text-[#18181b] text-[12px] text-center whitespace-nowrap">SM</p>
      </div>
    </div>
  );
}

function Text2() {
  return (
    <div className="flex-[1_0_0] h-[20px] min-w-px relative" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="-translate-x-1/2 absolute font-['Inter:Medium',sans-serif] font-medium leading-[20px] left-[50px] not-italic text-[#18181b] text-[14px] text-center top-0 tracking-[-0.1504px] whitespace-nowrap">Sarah Martinez</p>
      </div>
    </div>
  );
}

function MultiFileUploadPanel1() {
  return (
    <div className="h-[24px] relative shrink-0 w-[131.75px]" data-name="MultiFileUploadPanel">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[8px] items-center relative size-full">
        <Container21 />
        <Text2 />
      </div>
    </div>
  );
}

function Icon8() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon" opacity="0.5">
          <path d={svgPaths.p17a0fc80} id="Vector" stroke="var(--stroke-0, #18181B)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p3042540} id="Vector_2" stroke="var(--stroke-0, #18181B)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function SlotClone2() {
  return (
    <div className="bg-white flex-[240_0_0] h-[42px] min-w-px relative rounded-[8px]" data-name="SlotClone">
      <div aria-hidden="true" className="absolute border border-[#e4e4e7] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <div className="flex flex-row items-center size-full">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-between px-[13px] py-px relative size-full">
          <MultiFileUploadPanel1 />
          <Icon8 />
        </div>
      </div>
    </div>
  );
}

function Container20() {
  return (
    <div className="h-[42px] relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[8px] items-center pr-[141px] relative size-full">
          <Icon7 />
          <Text1 />
          <SlotClone2 />
        </div>
      </div>
    </div>
  );
}

function Icon9() {
  return (
    <div className="absolute left-0 size-[20px] top-[8px]" data-name="Icon">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Icon">
          <path d={svgPaths.p25397b80} id="Vector" stroke="var(--stroke-0, #09090B)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d={svgPaths.p2c4f400} id="Vector_2" stroke="var(--stroke-0, #09090B)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d={svgPaths.p2241fff0} id="Vector_3" stroke="var(--stroke-0, #09090B)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d={svgPaths.pae3c380} id="Vector_4" stroke="var(--stroke-0, #09090B)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
        </g>
      </svg>
    </div>
  );
}

function Text3() {
  return (
    <div className="absolute h-[20px] left-[28px] top-[8px] w-[104px]" data-name="Text">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[20px] left-0 not-italic text-[#09090b] text-[14px] top-0 tracking-[-0.1504px] whitespace-nowrap">Collaborators</p>
    </div>
  );
}

function MultiFileUploadPanel2() {
  return (
    <div className="h-[20px] relative shrink-0 w-[134.484px]" data-name="MultiFileUploadPanel">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="-translate-x-1/2 absolute font-['Inter:Medium',sans-serif] font-medium leading-[20px] left-[67px] not-italic text-[#6b7280] text-[14px] text-center top-0 tracking-[-0.1504px] whitespace-nowrap">Select Collaborators</p>
      </div>
    </div>
  );
}

function Icon10() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon" opacity="0.5">
          <path d={svgPaths.p17a0fc80} id="Vector" stroke="var(--stroke-0, #18181B)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p3042540} id="Vector_2" stroke="var(--stroke-0, #18181B)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function SlotClone3() {
  return (
    <div className="absolute bg-white content-stretch flex h-[38px] items-center justify-between left-[140px] px-[13px] py-px rounded-[8px] top-0 w-[240px]" data-name="SlotClone">
      <div aria-hidden="true" className="absolute border border-[#e4e4e7] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <MultiFileUploadPanel2 />
      <Icon10 />
    </div>
  );
}

function Container22() {
  return (
    <div className="h-[38px] relative shrink-0 w-full" data-name="Container">
      <Icon9 />
      <Text3 />
      <SlotClone3 />
    </div>
  );
}

function Icon11() {
  return (
    <div className="absolute left-0 size-[20px] top-[4px]" data-name="Icon">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g clipPath="url(#clip0_2098_1077)" id="Icon">
          <path d={svgPaths.p1a039080} id="Vector" stroke="var(--stroke-0, #09090B)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d={svgPaths.p2b428080} id="Vector_2" stroke="var(--stroke-0, #09090B)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
        </g>
        <defs>
          <clipPath id="clip0_2098_1077">
            <rect fill="white" height="20" width="20" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Text4() {
  return (
    <div className="absolute h-[20px] left-[28px] top-[4px] w-[104px]" data-name="Text">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[20px] left-0 not-italic text-[#09090b] text-[14px] top-0 tracking-[-0.1504px] whitespace-nowrap">Duplicated in</p>
    </div>
  );
}

function Container25() {
  return (
    <div className="absolute bg-[#f5f5f5] h-[32px] left-0 rounded-[10px] top-0 w-[225.406px]" data-name="Container">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[20px] left-[8px] not-italic text-[#09090b] text-[14px] top-[5px] tracking-[-0.1504px] whitespace-nowrap">OSV 2025: Accessible Locations</p>
    </div>
  );
}

function Container26() {
  return (
    <div className="absolute bg-[#f5f5f5] h-[32px] left-0 rounded-[10px] top-[40px] w-[213.172px]" data-name="Container">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[20px] left-[8px] not-italic text-[#09090b] text-[14px] top-[5px] tracking-[-0.1504px] whitespace-nowrap">OSV 2025: Hours of Operation</p>
    </div>
  );
}

function Container27() {
  return (
    <div className="absolute bg-[#f5f5f5] h-[32px] left-0 rounded-[10px] top-[80px] w-[264.781px]" data-name="Container">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[20px] left-[8px] not-italic text-[#09090b] text-[14px] top-[5px] tracking-[-0.1504px] whitespace-nowrap">OSV 2025: Collaborative Relationships</p>
    </div>
  );
}

function Container24() {
  return (
    <div className="absolute h-[112px] left-[140px] top-0 w-[381px]" data-name="Container">
      <Container25 />
      <Container26 />
      <Container27 />
    </div>
  );
}

function Container23() {
  return (
    <div className="h-[112px] relative shrink-0 w-full" data-name="Container">
      <Icon11 />
      <Text4 />
      <Container24 />
    </div>
  );
}

function Icon12() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Icon">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Icon">
          <path d={svgPaths.p25397b80} id="Vector" stroke="var(--stroke-0, #09090B)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d={svgPaths.p2c4f400} id="Vector_2" stroke="var(--stroke-0, #09090B)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d="M15.8333 6.66667V11.6667" id="Vector_3" stroke="var(--stroke-0, #09090B)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d="M18.3333 9.16667H13.3333" id="Vector_4" stroke="var(--stroke-0, #09090B)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
        </g>
      </svg>
    </div>
  );
}

function Text5() {
  return (
    <div className="h-[20px] relative shrink-0 w-[104px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[20px] left-0 not-italic text-[#09090b] text-[14px] top-0 tracking-[-0.1504px] whitespace-nowrap">Created by</p>
      </div>
    </div>
  );
}

function Container30() {
  return (
    <div className="bg-[#fc6] relative rounded-[33554400px] shrink-0 size-[24px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <p className="font-['Inter:Medium',sans-serif] font-medium leading-[16px] not-italic relative shrink-0 text-[#18181b] text-[12px] whitespace-nowrap">RL</p>
      </div>
    </div>
  );
}

function Text6() {
  return (
    <div className="flex-[1_0_0] h-[20px] min-w-px relative" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[20px] left-0 not-italic text-[#09090b] text-[14px] top-0 tracking-[-0.1504px] whitespace-nowrap">Reglantern</p>
      </div>
    </div>
  );
}

function Container29() {
  return (
    <div className="bg-[#f5f5f5] h-[32px] relative rounded-[10px] shrink-0 w-[126.031px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[8px] items-center px-[12px] relative size-full">
        <Container30 />
        <Text6 />
      </div>
    </div>
  );
}

function Container28() {
  return (
    <div className="content-stretch flex gap-[8px] h-[32px] items-center relative shrink-0 w-full" data-name="Container">
      <Icon12 />
      <Text5 />
      <Container29 />
    </div>
  );
}

function Container18() {
  return (
    <div className="content-stretch flex flex-col gap-[16px] h-[326px] items-start relative shrink-0 w-full" data-name="Container">
      <Container19 />
      <Container20 />
      <Container22 />
      <Container23 />
      <Container28 />
    </div>
  );
}

function Container16() {
  return (
    <div className="absolute bg-white content-stretch flex flex-col gap-[24px] h-[440px] items-start left-0 pt-[18px] px-[24px] top-[569px] w-[569px]" data-name="Container">
      <div aria-hidden="true" className="absolute border-[#e4e4e7] border-solid border-t-2 inset-0 pointer-events-none" />
      <Container17 />
      <Container18 />
    </div>
  );
}

export default function SystemTaskWith20SubTasksV() {
  return (
    <div className="bg-white relative shadow-[0px_25px_50px_0px_rgba(0,0,0,0.25)] size-full" data-name="SystemTask with 20 SubTasks v2">
      <Container />
      <Container3 />
      <Container16 />
    </div>
  );
}