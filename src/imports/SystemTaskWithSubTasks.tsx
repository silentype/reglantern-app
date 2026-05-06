import svgPaths from "./svg-17jbnhrqrm";

function Span() {
  return (
    <div className="h-[20px] relative shrink-0 w-[74.549px]" data-name="span">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="-translate-x-1/2 absolute font-['Inter:Medium',sans-serif] font-medium leading-[20px] left-[37.01px] not-italic text-[#18181b] text-[14px] text-center top-[0.67px] tracking-[-0.1504px] whitespace-nowrap">In Progress</p>
      </div>
    </div>
  );
}

function ChevronsUpDown() {
  return (
    <div className="relative shrink-0 size-[15.998px]" data-name="ChevronsUpDown">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 15.9983 15.9983">
        <g id="ChevronsUpDown" opacity="0.5">
          <path d={svgPaths.p1cdae400} id="Vector" stroke="var(--stroke-0, #18181B)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33319" />
          <path d={svgPaths.p3a02d180} id="Vector_2" stroke="var(--stroke-0, #18181B)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33319" />
        </g>
      </svg>
    </div>
  );
}

function Button() {
  return (
    <div className="bg-white flex-[1_0_0] h-[37.101px] min-h-px min-w-px relative rounded-[8px]" data-name="button">
      <div aria-hidden="true" className="absolute border-[#e4e4e7] border-[0.556px] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <div className="flex flex-row items-center size-full">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-between pl-[12.552px] pr-[12.553px] py-[0.556px] relative size-full">
          <Span />
          <ChevronsUpDown />
        </div>
      </div>
    </div>
  );
}

function Container1() {
  return (
    <div className="h-[37.101px] relative shrink-0 w-[200px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center relative size-full">
        <Button />
      </div>
    </div>
  );
}

function X() {
  return (
    <div className="h-[23.993px] overflow-clip relative shrink-0 w-full" data-name="X">
      <div className="absolute bottom-1/4 left-[25.03%] right-[24.97%] top-1/4" data-name="Vector">
        <div className="absolute inset-[-8.33%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 13.996 13.996">
            <path d={svgPaths.p3d16db80} id="Vector" stroke="var(--stroke-0, #18181B)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.99942" />
          </svg>
        </div>
      </div>
      <div className="absolute bottom-1/4 left-[25.03%] right-[24.97%] top-1/4" data-name="Vector">
        <div className="absolute inset-[-8.33%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 13.996 13.996">
            <path d={svgPaths.p2d63cf40} id="Vector" stroke="var(--stroke-0, #18181B)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.99942" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Button1() {
  return (
    <div className="flex-[1_0_0] h-[31.979px] min-h-px min-w-px relative rounded-[4px]" data-name="button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pt-[3.993px] px-[3.993px] relative size-full">
        <X />
      </div>
    </div>
  );
}

function Container2() {
  return (
    <div className="relative shrink-0 size-[31.979px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center relative size-full">
        <Button1 />
      </div>
    </div>
  );
}

function Container() {
  return (
    <div className="h-[85.642px] relative shrink-0 w-[568.993px]" data-name="Container">
      <div aria-hidden="true" className="absolute border-[#e5e7eb] border-b-[0.556px] border-solid inset-0 pointer-events-none" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-between pb-[0.556px] px-[23.993px] relative size-full">
        <Container1 />
        <Container2 />
      </div>
    </div>
  );
}

function H() {
  return (
    <div className="h-[54px] relative shrink-0 w-full" data-name="h2">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[27px] left-0 not-italic text-[#09090b] text-[18px] top-[0.78px] tracking-[0.1656px] w-[506px]">Upload and verify all required enrollment documentation for patient records</p>
    </div>
  );
}

function P() {
  return (
    <div className="h-[152px] relative shrink-0 w-full" data-name="p">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[22px] left-0 not-italic text-[#09090b] text-[15px] top-[-0.78px] tracking-[-0.0395px] w-[486px]">Submit quarterly clinical report to regulatory authorities with detailed analysis of patient outcomes, adverse events, and study protocol adherence metrics including comprehensive statistical analysis, safety data review, enrollment progress updates, protocol deviations documentation, data quality metrics, and recommendations for ongoing study management with supporting appendices and source documentation.</p>
    </div>
  );
}

function Container3() {
  return (
    <div className="relative shrink-0 w-[568.993px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[11.997px] items-start pt-[23.993px] px-[23.993px] relative w-full">
        <H />
        <P />
      </div>
    </div>
  );
}

function Icon() {
  return (
    <div className="content-stretch flex gap-[12px] items-center pl-[8px] relative shrink-0" data-name="Icon">
      <div className="flex flex-col font-['Geist:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#dc2626] text-[14px] text-right whitespace-nowrap">
        <p className="leading-[20px]">Missing files</p>
      </div>
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

function Frame() {
  return (
    <div className="content-stretch flex items-center justify-end relative shrink-0">
      <Icon />
    </div>
  );
}

function Select() {
  return (
    <div className="bg-white h-[40px] relative rounded-[6px] shrink-0 w-full" data-name="Select">
      <div aria-hidden="true" className="absolute border border-[#e4e4e7] border-solid inset-0 pointer-events-none rounded-[6px]" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center justify-between px-[12px] py-[8px] relative size-full">
          <div className="flex flex-col font-['Geist:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#18181b] text-[14px] whitespace-nowrap">
            <p className="leading-[20px]">Uploads Overview</p>
          </div>
          <Frame />
        </div>
      </div>
    </div>
  );
}

function Frame1() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full">
      <Select />
    </div>
  );
}

function Container5() {
  return (
    <div className="bg-white content-stretch flex flex-col items-start justify-center pb-[24px] pt-[16px] px-[24px] relative shrink-0 w-[570px]" data-name="Container">
      <Frame1 />
    </div>
  );
}

function Container4() {
  return (
    <div className="relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start overflow-clip relative rounded-[inherit]">
        <Container5 />
      </div>
    </div>
  );
}

function Button2() {
  return (
    <div className="absolute bg-white h-[31.997px] left-[3.99px] rounded-[4px] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_0px_rgba(0,0,0,0.1)] top-[3.64px] w-[128.255px]" data-name="button">
      <p className="-translate-x-1/2 absolute font-['Inter:Medium',sans-serif] font-medium leading-[20px] left-[64.38px] not-italic text-[#09090b] text-[14px] text-center top-[6.67px] tracking-[-0.1504px] whitespace-nowrap">Details</p>
    </div>
  );
}

function Button3() {
  return (
    <div className="absolute h-[31.997px] left-[132.25px] rounded-[4px] top-[3.64px] w-[128.255px]" data-name="button">
      <p className="-translate-x-1/2 absolute font-['Inter:Medium',sans-serif] font-medium leading-[20px] left-[64.36px] not-italic text-[#6b7280] text-[14px] text-center top-[6.66px] tracking-[-0.1504px] whitespace-nowrap">Comments</p>
    </div>
  );
}

function Button4() {
  return (
    <div className="absolute h-[31.997px] left-[260.5px] rounded-[4px] top-[3.64px] w-[128.255px]" data-name="button">
      <p className="-translate-x-1/2 absolute font-['Inter:Medium',sans-serif] font-medium leading-[20px] left-[64.26px] not-italic text-[#6b7280] text-[14px] text-center top-[6.67px] tracking-[-0.1504px] whitespace-nowrap">Activity</p>
    </div>
  );
}

function Button5() {
  return (
    <div className="absolute h-[31.997px] left-[388.76px] rounded-[4px] top-[3.64px] w-[128.255px]" data-name="button">
      <p className="-translate-x-1/2 absolute font-['Inter:Medium',sans-serif] font-medium leading-[20px] left-[64.39px] not-italic text-[#6b7280] text-[14px] text-center top-[6.66px] tracking-[-0.1504px] whitespace-nowrap">Guidance</p>
    </div>
  );
}

function Container7() {
  return (
    <div className="bg-[#f4f4f5] h-[39.983px] relative rounded-[8px] shrink-0 w-full" data-name="Container">
      <Button2 />
      <Button3 />
      <Button4 />
      <Button5 />
    </div>
  );
}

function CalendarIcon() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="CalendarIcon">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="CalendarIcon">
          <path d="M6.66699 1.30933V4.64266" id="Vector" stroke="var(--stroke-0, #09090B)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d="M13.333 1.30933V4.64266" id="Vector_2" stroke="var(--stroke-0, #09090B)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d={svgPaths.p22635300} id="Vector_3" stroke="var(--stroke-0, #09090B)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d="M2.5 7.97583H17.5" id="Vector_4" stroke="var(--stroke-0, #09090B)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
        </g>
      </svg>
    </div>
  );
}

function Span1() {
  return (
    <div className="h-[20px] relative shrink-0 w-[103.993px]" data-name="span">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[20px] left-0 not-italic text-[#09090b] text-[14px] top-[0.31px] tracking-[-0.1504px] whitespace-nowrap">Due Date</p>
      </div>
    </div>
  );
}

function Span2() {
  return (
    <div className="h-[20px] relative shrink-0 w-[76.198px]" data-name="span">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="-translate-x-1/2 absolute font-['Inter:Medium',sans-serif] font-medium leading-[20px] left-[38px] not-italic text-[#6b7280] text-[14px] text-center top-[0.31px] tracking-[-0.1504px] whitespace-nowrap">Select Date</p>
      </div>
    </div>
  );
}

function ChevronDown() {
  return (
    <div className="relative shrink-0 size-[15.998px]" data-name="ChevronDown">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 15.9983 15.9983">
        <g id="ChevronDown">
          <path d={svgPaths.p159f1080} id="Vector" stroke="var(--stroke-0, #71717A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33319" />
        </g>
      </svg>
    </div>
  );
}

function Button6() {
  return (
    <div className="bg-white flex-[1_0_0] h-[37.101px] min-h-px min-w-px relative rounded-[8px]" data-name="button">
      <div aria-hidden="true" className="absolute border-[#e4e4e7] border-[0.556px] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <div className="flex flex-row items-center size-full">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-between pl-[12.553px] pr-[12.552px] py-[0.556px] relative size-full">
          <Span2 />
          <ChevronDown />
        </div>
      </div>
    </div>
  );
}

function Container9() {
  return (
    <div className="h-[37.101px] relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[7.995px] items-center pr-[141.024px] relative size-full">
          <CalendarIcon />
          <Span1 />
          <Button6 />
        </div>
      </div>
    </div>
  );
}

function User() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="User">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="User">
          <path d={svgPaths.p1fa96100} id="Vector" stroke="var(--stroke-0, #09090B)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d={svgPaths.p28b9dc80} id="Vector_2" stroke="var(--stroke-0, #09090B)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
        </g>
      </svg>
    </div>
  );
}

function Span3() {
  return (
    <div className="h-[20px] relative shrink-0 w-[103.993px]" data-name="span">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[20px] left-0 not-italic text-[#09090b] text-[14px] top-[0.31px] tracking-[-0.1504px] whitespace-nowrap">Assigned to</p>
      </div>
    </div>
  );
}

function Span4() {
  return (
    <div className="h-[20px] relative shrink-0 w-[76.363px]" data-name="span">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="-translate-x-1/2 absolute font-['Inter:Medium',sans-serif] font-medium leading-[20px] left-[38px] not-italic text-[#6b7280] text-[14px] text-center top-[0.31px] tracking-[-0.1504px] whitespace-nowrap">Select User</p>
      </div>
    </div>
  );
}

function ChevronsUpDown1() {
  return (
    <div className="relative shrink-0 size-[15.998px]" data-name="ChevronsUpDown">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 15.9983 15.9983">
        <g id="ChevronsUpDown" opacity="0.5">
          <path d={svgPaths.p10eef1a0} id="Vector" stroke="var(--stroke-0, #18181B)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33319" />
          <path d={svgPaths.p24397240} id="Vector_2" stroke="var(--stroke-0, #18181B)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33319" />
        </g>
      </svg>
    </div>
  );
}

function Button7() {
  return (
    <div className="bg-white flex-[1_0_0] h-[37.101px] min-h-px min-w-px relative rounded-[8px]" data-name="button">
      <div aria-hidden="true" className="absolute border-[#e4e4e7] border-[0.556px] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <div className="flex flex-row items-center size-full">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-between pl-[12.553px] pr-[12.552px] py-[0.556px] relative size-full">
          <Span4 />
          <ChevronsUpDown1 />
        </div>
      </div>
    </div>
  );
}

function Container10() {
  return (
    <div className="h-[37.101px] relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[7.995px] items-center pr-[141.024px] relative size-full">
          <User />
          <Span3 />
          <Button7 />
        </div>
      </div>
    </div>
  );
}

function Users() {
  return (
    <div className="absolute left-0 size-[20px] top-[7.64px]" data-name="Users">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Users">
          <path d={svgPaths.p33137780} id="Vector" stroke="var(--stroke-0, #09090B)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d={svgPaths.p360d68f0} id="Vector_2" stroke="var(--stroke-0, #09090B)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d={svgPaths.pb47c480} id="Vector_3" stroke="var(--stroke-0, #09090B)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d={svgPaths.pfb558b0} id="Vector_4" stroke="var(--stroke-0, #09090B)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
        </g>
      </svg>
    </div>
  );
}

function Span5() {
  return (
    <div className="absolute h-[20px] left-[28px] top-[7.64px] w-[103.993px]" data-name="span">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[20px] left-0 not-italic text-[#09090b] text-[14px] top-[0.67px] tracking-[-0.1504px] whitespace-nowrap">Collaborators</p>
    </div>
  );
}

function Span6() {
  return (
    <div className="h-[20px] relative shrink-0 w-[134.479px]" data-name="span">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="-translate-x-1/2 absolute font-['Inter:Medium',sans-serif] font-medium leading-[20px] left-[67px] not-italic text-[#6b7280] text-[14px] text-center top-[0.67px] tracking-[-0.1504px] whitespace-nowrap">Select Collaborators</p>
      </div>
    </div>
  );
}

function ChevronsUpDown2() {
  return (
    <div className="relative shrink-0 size-[15.998px]" data-name="ChevronsUpDown">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 15.9983 15.9983">
        <g id="ChevronsUpDown" opacity="0.5">
          <path d={svgPaths.p220c4d00} id="Vector" stroke="var(--stroke-0, #18181B)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33319" />
          <path d={svgPaths.p2129df80} id="Vector_2" stroke="var(--stroke-0, #18181B)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33319" />
        </g>
      </svg>
    </div>
  );
}

function Button8() {
  return (
    <div className="absolute bg-white content-stretch flex h-[37.101px] items-center justify-between left-[139.98px] pl-[12.553px] pr-[12.552px] py-[0.556px] rounded-[8px] top-[-0.36px] w-[240px]" data-name="button">
      <div aria-hidden="true" className="absolute border-[#e4e4e7] border-[0.556px] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <Span6 />
      <ChevronsUpDown2 />
    </div>
  );
}

function Container11() {
  return (
    <div className="h-[37.101px] relative shrink-0 w-full" data-name="Container">
      <Users />
      <Span5 />
      <Button8 />
    </div>
  );
}

function Copy() {
  return (
    <div className="absolute left-0 size-[20px] top-[3.64px]" data-name="Copy">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g clipPath="url(#clip0_2001_1329)" id="Copy">
          <path d={svgPaths.p15109e00} id="Vector" stroke="var(--stroke-0, #09090B)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d={svgPaths.p2aebc840} id="Vector_2" stroke="var(--stroke-0, #09090B)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
        </g>
        <defs>
          <clipPath id="clip0_2001_1329">
            <rect fill="white" height="20" width="20" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Span7() {
  return (
    <div className="absolute h-[20px] left-[28px] top-[3.64px] w-[103.993px]" data-name="span">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[20px] left-0 not-italic text-[#09090b] text-[14px] top-[0.67px] tracking-[-0.1504px] whitespace-nowrap">Duplicated in</p>
    </div>
  );
}

function Container14() {
  return (
    <div className="absolute bg-[#f5f5f5] h-[31.979px] left-0 rounded-[10px] top-0 w-[225.399px]" data-name="Container">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[20px] left-[8px] not-italic text-[#09090b] text-[14px] top-[5.44px] tracking-[-0.1504px] whitespace-nowrap">OSV 2025: Accessible Locations</p>
    </div>
  );
}

function Container15() {
  return (
    <div className="absolute bg-[#f5f5f5] h-[31.979px] left-0 rounded-[10px] top-[39.97px] w-[213.16px]" data-name="Container">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[20px] left-[8px] not-italic text-[#09090b] text-[14px] top-[5.44px] tracking-[-0.1504px] whitespace-nowrap">OSV 2025: Hours of Operation</p>
    </div>
  );
}

function Container16() {
  return (
    <div className="absolute bg-[#f5f5f5] h-[31.979px] left-0 rounded-[10px] top-[79.95px] w-[264.757px]" data-name="Container">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[20px] left-[8px] not-italic text-[#09090b] text-[14px] top-[5.44px] tracking-[-0.1504px] whitespace-nowrap">OSV 2025: Collaborative Relationships</p>
    </div>
  );
}

function Container13() {
  return (
    <div className="absolute h-[111.927px] left-[139.98px] top-[-0.36px] w-[381.024px]" data-name="Container">
      <Container14 />
      <Container15 />
      <Container16 />
    </div>
  );
}

function Container12() {
  return (
    <div className="h-[111.927px] relative shrink-0 w-full" data-name="Container">
      <Copy />
      <Span7 />
      <Container13 />
    </div>
  );
}

function UserPlus() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="UserPlus">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="UserPlus">
          <path d={svgPaths.pbca5b80} id="Vector" stroke="var(--stroke-0, #09090B)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d={svgPaths.p17d841f0} id="Vector_2" stroke="var(--stroke-0, #09090B)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d="M15.833 6.30933V11.3093" id="Vector_3" stroke="var(--stroke-0, #09090B)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d="M18.333 8.80933H13.333" id="Vector_4" stroke="var(--stroke-0, #09090B)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
        </g>
      </svg>
    </div>
  );
}

function Span8() {
  return (
    <div className="h-[20px] relative shrink-0 w-[103.993px]" data-name="span">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[20px] left-0 not-italic text-[#09090b] text-[14px] top-[0.31px] tracking-[-0.1504px] whitespace-nowrap">Created by</p>
      </div>
    </div>
  );
}

function Container19() {
  return (
    <div className="bg-[#fc6] relative rounded-[18641400px] shrink-0 size-[23.993px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <p className="font-['Inter:Medium',sans-serif] font-medium leading-[16px] not-italic relative shrink-0 text-[#18181b] text-[12px] whitespace-nowrap">RL</p>
      </div>
    </div>
  );
}

function Span9() {
  return (
    <div className="h-[20px] relative shrink-0 w-[70.026px]" data-name="span">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[20px] left-0 not-italic text-[#09090b] text-[14px] top-[0.31px] tracking-[-0.1504px] whitespace-nowrap">Reglantern</p>
      </div>
    </div>
  );
}

function Container18() {
  return (
    <div className="bg-[#f5f5f5] h-[31.979px] relative rounded-[10px] shrink-0 w-[126.007px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[7.995px] items-center pl-[11.997px] relative size-full">
        <Container19 />
        <Span9 />
      </div>
    </div>
  );
}

function Container17() {
  return (
    <div className="content-stretch flex gap-[7.995px] h-[31.979px] items-center relative shrink-0 w-full" data-name="Container">
      <UserPlus />
      <Span8 />
      <Container18 />
    </div>
  );
}

function Container8() {
  return (
    <div className="content-stretch flex flex-col gap-[15.998px] h-[319.201px] items-start relative shrink-0 w-full" data-name="Container">
      <Container9 />
      <Container10 />
      <Container11 />
      <Container12 />
      <Container17 />
    </div>
  );
}

function Container6() {
  return (
    <div className="bg-white relative shrink-0 w-full" data-name="Container">
      <div aria-hidden="true" className="absolute border-[#e4e4e7] border-solid border-t-[1.667px] inset-0 pointer-events-none" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[23.993px] items-start pt-[17.665px] px-[23.993px] relative w-full">
        <Container7 />
        <Container8 />
      </div>
    </div>
  );
}

export default function SystemTaskWithSubTasks() {
  return (
    <div className="bg-white content-stretch flex flex-col items-start relative shadow-[0px_25px_50px_-12px_rgba(0,0,0,0.25)] size-full" data-name="System Task - With Sub Tasks">
      <Container />
      <Container3 />
      <Container4 />
      <Container6 />
    </div>
  );
}