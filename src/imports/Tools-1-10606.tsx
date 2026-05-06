import svgPaths from "./svg-cp2emp5ol3";

function Tasks() {
  return (
    <div className="bg-[#cdd7e1] content-stretch flex h-[40px] items-center px-[16px] py-[8px] relative rounded-[6px] shrink-0 w-[225px]" data-name="Tasks">
      <div className="flex flex-[1_0_0] flex-col font-['Geist:Medium',sans-serif] font-medium justify-center leading-[0] min-h-px min-w-px relative text-[#18181b] text-[14px]">
        <p className="leading-[20px] whitespace-pre-wrap">Site Visit Protocol Checklist</p>
      </div>
    </div>
  );
}

function Home() {
  return (
    <div className="content-stretch flex gap-[8px] h-[40px] items-center px-[16px] py-[8px] relative rounded-[6px] shrink-0 w-[225px]" data-name="Home">
      <div className="flex flex-[1_0_0] flex-col font-['Geist:Medium',sans-serif] font-medium justify-center leading-[0] min-h-px min-w-px relative text-[#18181b] text-[14px]">
        <p className="leading-[20px] whitespace-pre-wrap">Ryan White Part C/D</p>
      </div>
    </div>
  );
}

function Home1() {
  return (
    <div className="content-stretch flex gap-[8px] h-[40px] items-center px-[16px] py-[8px] relative rounded-[6px] shrink-0 w-[225px]" data-name="Home">
      <div className="flex flex-[1_0_0] flex-col font-['Geist:Medium',sans-serif] font-medium justify-center leading-[0] min-h-px min-w-px relative text-[#18181b] text-[14px]">
        <p className="leading-[20px] whitespace-pre-wrap">FTCA Site Visit Protocol</p>
      </div>
    </div>
  );
}

function Div() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] items-start pt-[8px] px-[8px] relative shrink-0" data-name="Div">
      <Tasks />
      <Home />
      <Home1 />
    </div>
  );
}

function AdminPanel() {
  return (
    <div className="content-stretch flex flex-col h-[440px] items-start p-[8px] relative shrink-0" data-name="Admin Panel">
      <Div />
    </div>
  );
}

function UserPlus() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="User Plus">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="User Plus">
          <path clipRule="evenodd" d={svgPaths.p15aee600} fill="var(--fill-0, #18181B)" fillRule="evenodd" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function AccountSettings() {
  return (
    <div className="content-stretch flex gap-[8px] h-[40px] items-center px-[16px] py-[8px] relative rounded-[6px] shrink-0 w-[209px]" data-name="Account Settings">
      <UserPlus />
      <div className="flex flex-[1_0_0] flex-col font-['Geist:Medium',sans-serif] font-medium justify-center leading-[0] min-h-px min-w-px relative text-[#18181b] text-[14px]">
        <p className="leading-[20px] whitespace-pre-wrap">Invite Teammates</p>
      </div>
    </div>
  );
}

function HelpOutline() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="help_outline">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="help_outline">
          <path d={svgPaths.p9f6a200} fill="var(--fill-0, #18181B)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function GetHelp() {
  return (
    <div className="content-stretch flex gap-[8px] h-[40px] items-center px-[16px] py-[8px] relative rounded-[6px] shrink-0 w-[209px]" data-name="Get Help">
      <HelpOutline />
      <div className="flex flex-[1_0_0] flex-col font-['Geist:Medium',sans-serif] font-medium justify-center leading-[0] min-h-px min-w-px relative text-[#18181b] text-[14px]">
        <p className="leading-[20px] whitespace-pre-wrap">Ask an Expert</p>
      </div>
    </div>
  );
}

function Info() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="info">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="info">
          <path d={svgPaths.p1ecaa900} fill="var(--fill-0, #18181B)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function About() {
  return (
    <div className="content-stretch flex gap-[8px] h-[40px] items-center px-[16px] py-[8px] relative rounded-[6px] shrink-0 w-[209px]" data-name="About">
      <Info />
      <div className="flex flex-[1_0_0] flex-col font-['Geist:Medium',sans-serif] font-medium justify-center leading-[0] min-h-px min-w-px relative text-[#18181b] text-[14px]">
        <p className="leading-[20px] whitespace-pre-wrap">About</p>
      </div>
    </div>
  );
}

function Div1() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] items-start pt-[8px] px-[8px] relative shrink-0" data-name="Div">
      <AccountSettings />
      <GetHelp />
      <About />
    </div>
  );
}

function BottomNav() {
  return (
    <div className="relative shrink-0 w-full" data-name="Bottom Nav">
      <div aria-hidden="true" className="absolute border-[#cdd7e1] border-solid border-t inset-0 pointer-events-none" />
      <div className="content-stretch flex flex-col items-start p-[8px] relative w-full">
        <Div1 />
      </div>
    </div>
  );
}

function AdminNavigation() {
  return (
    <div className="absolute bg-[#f4f4f5] content-stretch flex flex-col h-[820px] items-start justify-between left-0 top-[80px]" data-name="Admin Navigation">
      <AdminPanel />
      <BottomNav />
    </div>
  );
}

function ChevronRight() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="Chevron Right">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="Chevron Right">
          <path clipRule="evenodd" d={svgPaths.pcdb3800} fill="var(--fill-0, #71717A)" fillRule="evenodd" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Breadcrumb() {
  return (
    <div className="content-stretch flex gap-[10px] items-center relative shrink-0" data-name="Breadcrumb">
      <div className="flex flex-col font-['Geist:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#71717a] text-[14px] whitespace-nowrap">
        <p className="leading-[20px]">Checklists</p>
      </div>
      <ChevronRight />
      <div className="flex flex-col font-['Geist:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#71717a] text-[14px] whitespace-nowrap">
        <p className="leading-[20px]">Site Visit Protocol Checklists</p>
      </div>
    </div>
  );
}

function Frame17() {
  return (
    <div className="content-stretch flex items-center py-[8px] relative rounded-[8px] shrink-0">
      <div className="flex flex-col font-['Geist:SemiBold',sans-serif] font-semibold justify-center leading-[0] relative shrink-0 text-[#09090b] text-[24px] tracking-[0.4px] whitespace-nowrap">
        <p className="leading-[32px]">OSV 2025</p>
      </div>
    </div>
  );
}

function ActionButton() {
  return (
    <div className="bg-white content-stretch flex gap-[8px] h-[40px] items-center px-[16px] py-[8px] relative rounded-[6px] shrink-0" data-name="Action Button">
      <div aria-hidden="true" className="absolute border border-[#cdd7e1] border-solid inset-0 pointer-events-none rounded-[6px]" />
      <div className="flex flex-col font-['Geist:Medium',sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[#18181b] text-[14px] whitespace-nowrap">
        <p className="leading-[20px]">Ready to Export</p>
      </div>
    </div>
  );
}

function DivHeader() {
  return (
    <div className="content-stretch flex items-center justify-between relative shrink-0 w-full" data-name="Div - Header">
      <Frame17 />
      <ActionButton />
    </div>
  );
}

function BadgePrimary() {
  return (
    <div className="bg-[#373f51] content-stretch flex items-center justify-center px-[10px] py-[2px] relative rounded-[9999px] shrink-0" data-name="Badge Primary">
      <div className="flex flex-col font-['Geist:SemiBold',sans-serif] font-semibold justify-center leading-[0] relative shrink-0 text-[#fafafa] text-[12px] text-center whitespace-nowrap">
        <p className="leading-[20px]">Active</p>
      </div>
    </div>
  );
}

function ChapterDescription() {
  return (
    <div className="content-stretch flex gap-[16px] h-[20px] items-center relative shrink-0 w-[950px]" data-name="Chapter Description">
      <BadgePrimary />
      <div className="flex flex-col font-['Geist:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#09090b] text-[14px] whitespace-nowrap">
        <p className="leading-[14px]">Version: 10.13.2025</p>
      </div>
      <div className="flex flex-col font-['Geist:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#09090b] text-[14px] whitespace-nowrap">
        <p className="leading-[14px]">Created Dec 4, 2025, 12:34AM</p>
      </div>
      <div className="flex flex-col font-['Geist:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#09090b] text-[14px] whitespace-nowrap">
        <p className="leading-[14px]">Updated Dec 4, 2025, 12:35AM</p>
      </div>
    </div>
  );
}

function Frame20() {
  return (
    <div className="content-stretch flex items-center relative shrink-0">
      <ChapterDescription />
    </div>
  );
}

function Frame19() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full">
      <DivHeader />
      <Frame20 />
    </div>
  );
}

function Frame18() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full">
      <Frame19 />
    </div>
  );
}

function InputDefault() {
  return (
    <div className="bg-white col-1 content-stretch flex h-[40px] items-center max-w-[384px] ml-0 mt-0 px-[16px] py-[8px] relative rounded-[6px] row-1 w-[289.899px]" data-name="Input/Default">
      <div aria-hidden="true" className="absolute border border-[#e4e4e7] border-solid inset-0 pointer-events-none rounded-[6px]" />
      <div className="flex flex-[1_0_0] flex-col font-['Geist:Regular',sans-serif] font-normal justify-center leading-[0] min-h-px min-w-px relative text-[#71717a] text-[14px]">
        <p className="leading-[20px] whitespace-pre-wrap">Search categories and prompts...</p>
      </div>
    </div>
  );
}

function Group() {
  return (
    <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid leading-[0] place-items-start relative shrink-0">
      <InputDefault />
    </div>
  );
}

function Settings() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Settings 2">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Settings 2">
          <path clipRule="evenodd" d={svgPaths.p196c6c00} fill="var(--fill-0, #09090B)" fillRule="evenodd" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Icon() {
  return (
    <div className="content-stretch flex items-center pl-[8px] relative shrink-0" data-name="Icon">
      <Settings />
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

function ChevronsUpDown() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Chevrons Up Down">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Chevrons Up Down">
          <path clipRule="evenodd" d={svgPaths.p5fc180} fill="var(--fill-0, #09090B)" fillRule="evenodd" id="Vector (Stroke)" />
        </g>
      </svg>
    </div>
  );
}

function Icon1() {
  return (
    <div className="content-stretch flex items-center pl-[8px] relative shrink-0" data-name="Icon">
      <ChevronsUpDown />
    </div>
  );
}

function Select1() {
  return (
    <div className="bg-white content-stretch flex h-[40px] items-center justify-center px-[12px] py-[8px] relative rounded-[6px] shrink-0" data-name="Select">
      <div aria-hidden="true" className="absolute border border-[#e4e4e7] border-solid inset-0 pointer-events-none rounded-[6px]" />
      <div className="flex flex-col font-['Geist:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#18181b] text-[14px] whitespace-nowrap">
        <p className="leading-[20px]">Expand All</p>
      </div>
      <Icon1 />
    </div>
  );
}

function Filters() {
  return (
    <div className="content-stretch flex gap-[8px] items-center justify-end relative shrink-0 w-full" data-name="Filters">
      <Group />
      <div className="bg-white flex-[1_0_0] h-[21px] min-h-px min-w-px" />
      <Select />
      <Select1 />
    </div>
  );
}

function ChevronUp() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="Chevron Up">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="Chevron Up">
          <path clipRule="evenodd" d={svgPaths.p229f3c00} fill="var(--fill-0, #09090B)" fillRule="evenodd" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function ChapterName() {
  return (
    <div className="content-stretch flex gap-[16px] h-full items-center relative shrink-0" data-name="Chapter Name">
      <ChevronUp />
      <div className="flex flex-col font-['Geist:Medium',sans-serif] font-medium h-full justify-center leading-[0] relative shrink-0 text-[#09090b] text-[20px] w-[554px]">
        <p className="leading-[28px] whitespace-pre-wrap">Chapter 3: Required and Additional Health Services</p>
      </div>
    </div>
  );
}

function Calendar() {
  return (
    <div className="col-1 ml-0 mt-0 relative row-1 size-[20px]" data-name="Calendar">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Calendar">
          <path clipRule="evenodd" d={svgPaths.pc55d00} fill="var(--fill-0, #DC2626)" fillRule="evenodd" id="Vector (Stroke)" />
        </g>
      </svg>
    </div>
  );
}

function Group1() {
  return (
    <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid leading-[0] place-items-start relative shrink-0">
      <Calendar />
      <div className="col-1 flex flex-col font-['Inter:Medium',sans-serif] font-medium h-[20px] justify-center ml-[24px] mt-0 not-italic relative row-1 text-[12px] text-black w-[117px]">
        <p className="leading-[normal] whitespace-pre-wrap">1 Expired Document</p>
      </div>
    </div>
  );
}

function InsertDriveFile() {
  return (
    <div className="col-1 ml-0 mt-0 relative row-1 size-[20px]" data-name="insert_drive_file">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="insert_drive_file">
          <path d={svgPaths.p183b5840} fill="var(--fill-0, #C41C1C)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Group2() {
  return (
    <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid leading-[0] place-items-start relative shrink-0">
      <InsertDriveFile />
      <div className="col-1 flex flex-col font-['Inter:Medium',sans-serif] font-medium h-[20px] justify-center ml-[24px] mt-0 not-italic relative row-1 text-[12px] text-black w-[128px]">
        <p className="leading-[normal] whitespace-pre-wrap">3 Missing Documents</p>
      </div>
    </div>
  );
}

function MoreVertFilled() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="MoreVertFilled">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="MoreVertFilled">
          <path d={svgPaths.p3fdba000} fill="var(--fill-0, black)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Frame21() {
  return (
    <div className="content-stretch flex gap-[12px] items-center relative shrink-0">
      <Group1 />
      <Group2 />
      <MoreVertFilled />
    </div>
  );
}

function TopRightIcons1() {
  return (
    <div className="content-stretch flex items-center justify-end relative shrink-0" data-name="Top Right Icons">
      <Frame21 />
    </div>
  );
}

function TopRightIcons() {
  return (
    <div className="content-stretch flex items-center justify-end relative shrink-0" data-name="Top Right Icons">
      <TopRightIcons1 />
    </div>
  );
}

function ChapterNameAndIcons() {
  return (
    <div className="content-stretch flex items-center justify-between relative shrink-0 w-full" data-name="Chapter Name and Icons">
      <div className="flex flex-row items-center self-stretch">
        <ChapterName />
      </div>
      <TopRightIcons />
    </div>
  );
}

function File() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="File">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="File">
          <path clipRule="evenodd" d={svgPaths.p1598bac0} fill="var(--fill-0, #09090B)" fillRule="evenodd" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Frame25() {
  return (
    <div className="content-stretch flex gap-[4px] items-center relative shrink-0">
      <File />
      <div className="flex flex-col font-['Geist:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#09090b] text-[14px] whitespace-nowrap">
        <p className="leading-[20px]">3.1 - Service Area Reps-Analysis</p>
      </div>
    </div>
  );
}

function File1() {
  return (
    <div className="relative shrink-0 size-[18px]" data-name="File">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
        <g id="File">
          <path clipRule="evenodd" d={svgPaths.pd9ebc80} fill="var(--fill-0, white)" fillRule="evenodd" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function MinHeight() {
  return <div className="h-0 w-[24px]" data-name="min-height" />;
}

function TextContainer() {
  return (
    <div className="content-stretch flex items-center relative shrink-0" data-name="Text Container">
      <div className="flex h-[24px] items-center justify-center relative shrink-0 w-0" style={{ "--transform-inner-width": "1200", "--transform-inner-height": "0" } as React.CSSProperties}>
        <div className="-rotate-90 flex-none">
          <MinHeight />
        </div>
      </div>
      <p className="font-['Inter:Regular',sans-serif] font-normal leading-[1.42] not-italic relative shrink-0 text-[14px] text-white w-[252px] whitespace-pre-wrap">Lance’s PDF Map and Analysis.pdf</p>
    </div>
  );
}

function ListItemSoft() {
  return (
    <div className="bg-[#32383e] content-stretch flex gap-[14px] items-center px-[8px] py-[4px] relative rounded-[8px] shrink-0" data-name="<ListItem>/Soft">
      <File1 />
      <TextContainer />
    </div>
  );
}

function Frame32() {
  return (
    <div className="content-stretch flex gap-[16px] items-center relative shrink-0 w-full">
      <Frame25 />
      <ListItemSoft />
    </div>
  );
}

function HelpOutline1() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="help_outline">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="help_outline">
          <path d={svgPaths.pe593d70} fill="var(--fill-0, black)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Frame22() {
  return (
    <div className="content-stretch flex gap-[4px] items-center relative shrink-0 w-full">
      <HelpOutline1 />
      <div className="flex flex-[1_0_0] flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] min-h-px min-w-px not-italic relative text-[0px] text-black">
        <p className="font-['Geist:Regular',sans-serif] font-normal leading-[20px] text-[#09090b] text-[14px] whitespace-pre-wrap">
          <a className="[text-decoration-skip-ink:none] cursor-pointer decoration-solid underline" href="https://geocarenavigator.hrsa.gov/">
            <span className="[text-decoration-skip-ink:none] decoration-solid leading-[20px]" href="https://geocarenavigator.hrsa.gov/">
              HCP GeoCare Navigator
            </span>
          </a>
          <span>{` Service Area Map (if not included/updated since last application submission) `}</span>
        </p>
      </div>
    </div>
  );
}

function Frame4() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col gap-[16px] items-start min-h-px min-w-px relative">
      <div className="flex flex-col font-['Geist:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#09090b] text-[17px] tracking-[0.4px] w-full">
        <p className="leading-[22px] whitespace-pre-wrap">Service area reports or analysis documentation (UDS Reports, etc.)</p>
      </div>
      <Frame32 />
      <Frame22 />
    </div>
  );
}

function InsertDriveFile1() {
  return (
    <div className="col-1 ml-0 mt-0 relative row-1 size-[20px]" data-name="insert_drive_file">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="insert_drive_file">
          <path d={svgPaths.p183b5840} fill="var(--fill-0, #C41C1C)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Group3() {
  return (
    <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid leading-[0] place-items-start relative shrink-0">
      <InsertDriveFile1 />
      <div className="col-1 flex flex-col font-['Inter:Medium',sans-serif] font-medium h-[20px] justify-center ml-[24px] mt-0 not-italic relative row-1 text-[12px] text-black w-[117px]">
        <p className="leading-[normal] whitespace-pre-wrap">Ready for Upload</p>
      </div>
    </div>
  );
}

function Frame23() {
  return (
    <div className="content-stretch flex items-center relative shrink-0">
      <Group3 />
    </div>
  );
}

function ActionButton1() {
  return (
    <div className="bg-white content-stretch flex gap-[8px] h-[36px] items-center px-[16px] py-[8px] relative rounded-[6px] shrink-0" data-name="Action Button">
      <div aria-hidden="true" className="absolute border border-[#cdd7e1] border-solid inset-0 pointer-events-none rounded-[6px]" />
      <div className="flex flex-col font-['Geist:Medium',sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[#18181b] text-[14px] whitespace-nowrap">
        <p className="leading-[20px]">View Task</p>
      </div>
    </div>
  );
}

function TopRightIcons3() {
  return (
    <div className="content-stretch flex gap-[12px] items-center justify-end relative shrink-0" data-name="Top Right Icons">
      <Frame23 />
      <ActionButton1 />
    </div>
  );
}

function TopRightIcons2() {
  return (
    <div className="content-stretch flex items-center justify-end relative shrink-0" data-name="Top Right Icons">
      <TopRightIcons3 />
    </div>
  );
}

function ChapterNameAndIcons1() {
  return (
    <div className="content-stretch flex items-start justify-between relative shrink-0 w-full" data-name="Chapter Name and Icons">
      <Frame4 />
      <TopRightIcons2 />
    </div>
  );
}

function Div4() {
  return (
    <div className="bg-[#f6f6f6] relative rounded-[8px] shrink-0 w-full" data-name="Div">
      <div aria-hidden="true" className="absolute border border-[#cdd7e1] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <div className="content-stretch flex flex-col items-start p-[16px] relative w-full">
        <ChapterNameAndIcons1 />
      </div>
    </div>
  );
}

function Star() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="star">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="star">
          <path d={svgPaths.p26e22380} fill="var(--fill-0, black)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Frame27() {
  return (
    <div className="content-stretch flex gap-[4px] items-center relative shrink-0 w-full">
      <Star />
      <div className="flex flex-[1_0_0] flex-col font-['Geist:Regular',sans-serif] font-normal justify-center leading-[0] min-h-px min-w-px relative text-[#09090b] text-[0px]">
        <p className="text-[14px] whitespace-pre-wrap">
          <span className="leading-[20px]">{`Required for: `}</span>
          <span className="font-['Geist:Bold',sans-serif] font-bold leading-[20px]">Compliance and Excellence Operational Site Visit Assessment</span>
          <span className="font-['Geist:Regular',sans-serif] font-normal leading-[20px]">†</span>
        </p>
      </div>
    </div>
  );
}

function Frame5() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col gap-[16px] items-start min-h-px min-w-px relative">
      <div className="flex flex-col font-['Geist:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#09090b] text-[17px] tracking-[0.4px] w-[724px]">
        <p className="leading-[22px] whitespace-pre-wrap">Provide a narrative that describes how the health center conducts the Service Area Analysis process.†</p>
      </div>
      <Frame27 />
    </div>
  );
}

function InsertDriveFile2() {
  return (
    <div className="col-1 ml-0 mt-0 relative row-1 size-[20px]" data-name="insert_drive_file">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="insert_drive_file">
          <path d={svgPaths.p183b5840} fill="var(--fill-0, #C41C1C)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Group4() {
  return (
    <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid leading-[0] place-items-start relative shrink-0">
      <InsertDriveFile2 />
      <div className="col-1 flex flex-col font-['Inter:Medium',sans-serif] font-medium h-[20px] justify-center ml-[24px] mt-0 not-italic relative row-1 text-[12px] text-black w-[117px]">
        <p className="leading-[normal] whitespace-pre-wrap">1 Missing Document</p>
      </div>
    </div>
  );
}

function Frame24() {
  return (
    <div className="content-stretch flex items-center relative shrink-0">
      <Group4 />
    </div>
  );
}

function ActionButton2() {
  return (
    <div className="bg-white content-stretch flex gap-[8px] h-[36px] items-center px-[16px] py-[8px] relative rounded-[6px] shrink-0" data-name="Action Button">
      <div aria-hidden="true" className="absolute border border-[#cdd7e1] border-solid inset-0 pointer-events-none rounded-[6px]" />
      <div className="flex flex-col font-['Geist:Medium',sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[#18181b] text-[14px] whitespace-nowrap">
        <p className="leading-[20px]">View Task</p>
      </div>
    </div>
  );
}

function TopRightIcons5() {
  return (
    <div className="content-stretch flex gap-[12px] items-center justify-end relative shrink-0" data-name="Top Right Icons">
      <Frame24 />
      <ActionButton2 />
    </div>
  );
}

function TopRightIcons4() {
  return (
    <div className="content-stretch flex items-center justify-end relative shrink-0" data-name="Top Right Icons">
      <TopRightIcons5 />
    </div>
  );
}

function ChapterNameAndIcons2() {
  return (
    <div className="content-stretch flex items-start justify-between relative shrink-0 w-full" data-name="Chapter Name and Icons">
      <Frame5 />
      <TopRightIcons4 />
    </div>
  );
}

function Div5() {
  return (
    <div className="bg-white relative rounded-[8px] shrink-0 w-full" data-name="Div">
      <div aria-hidden="true" className="absolute border border-[#cdd7e1] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <div className="content-stretch flex flex-col items-start p-[16px] relative w-full">
        <ChapterNameAndIcons2 />
      </div>
    </div>
  );
}

function Frame6() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-[718px]">
      <div className="flex flex-col font-['Geist:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#09090b] text-[17px] tracking-[0.4px] w-full">
        <p className="leading-[22px] whitespace-pre-wrap">Most recent needs assessment and documentation (e.g., studies, resources, reports) used to develop the needs assessment.*</p>
      </div>
    </div>
  );
}

function Calendar1() {
  return (
    <div className="col-1 ml-0 mt-0 relative row-1 size-[20px]" data-name="Calendar">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Calendar">
          <path clipRule="evenodd" d={svgPaths.pc55d00} fill="var(--fill-0, #DC2626)" fillRule="evenodd" id="Vector (Stroke)" />
        </g>
      </svg>
    </div>
  );
}

function Group5() {
  return (
    <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid leading-[0] place-items-start relative shrink-0">
      <Calendar1 />
      <div className="col-1 flex flex-col font-['Inter:Medium',sans-serif] font-medium h-[20px] justify-center ml-[24px] mt-0 not-italic relative row-1 text-[12px] text-black w-[117px]">
        <p className="leading-[normal] whitespace-pre-wrap">1 Expired Document</p>
      </div>
    </div>
  );
}

function ActionButton3() {
  return (
    <div className="bg-white content-stretch flex gap-[8px] h-[36px] items-center px-[16px] py-[8px] relative rounded-[6px] shrink-0" data-name="Action Button">
      <div aria-hidden="true" className="absolute border border-[#cdd7e1] border-solid inset-0 pointer-events-none rounded-[6px]" />
      <div className="flex flex-col font-['Geist:Medium',sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[#18181b] text-[14px] whitespace-nowrap">
        <p className="leading-[20px]">View Task</p>
      </div>
    </div>
  );
}

function TopRightIcons7() {
  return (
    <div className="content-stretch flex gap-[12px] items-center justify-end relative shrink-0" data-name="Top Right Icons">
      <Group5 />
      <ActionButton3 />
    </div>
  );
}

function TopRightIcons6() {
  return (
    <div className="content-stretch flex items-center justify-end relative shrink-0" data-name="Top Right Icons">
      <TopRightIcons7 />
    </div>
  );
}

function ChapterNameAndIcons3() {
  return (
    <div className="content-stretch flex items-start justify-between relative shrink-0 w-full" data-name="Chapter Name and Icons">
      <Frame6 />
      <TopRightIcons6 />
    </div>
  );
}

function File2() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="File">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="File">
          <path clipRule="evenodd" d={svgPaths.p1598bac0} fill="var(--fill-0, #09090B)" fillRule="evenodd" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Frame26() {
  return (
    <div className="content-stretch flex gap-[4px] items-center relative shrink-0 w-full">
      <File2 />
      <div className="flex flex-[1_0_0] flex-col font-['Geist:Regular',sans-serif] font-normal justify-center leading-[0] min-h-px min-w-px relative text-[#09090b] text-[0px]">
        <p className="text-[14px] whitespace-pre-wrap">
          <span className="leading-[20px]">{`Naming Convention: `}</span>
          <span className="font-['Geist:Bold',sans-serif] font-bold leading-[20px]">3.2 - Recent NA-Docs</span>
        </p>
      </div>
    </div>
  );
}

function Star1() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="star">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="star">
          <path d={svgPaths.p26e22380} fill="var(--fill-0, black)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Frame28() {
  return (
    <div className="content-stretch flex gap-[4px] items-center relative shrink-0 w-full">
      <Star1 />
      <div className="flex flex-[1_0_0] flex-col font-['Geist:Regular',sans-serif] font-normal justify-center leading-[0] min-h-px min-w-px relative text-[#09090b] text-[0px]">
        <p className="text-[14px] whitespace-pre-wrap">
          <span className="leading-[20px]">{`Required for: `}</span>
          <span className="font-['Geist:Bold',sans-serif] font-bold leading-[20px]">HRSA Site Visit Protocol.</span>
        </p>
      </div>
    </div>
  );
}

function Div6() {
  return (
    <div className="bg-white relative rounded-[8px] shrink-0 w-full" data-name="Div">
      <div aria-hidden="true" className="absolute border border-[#cdd7e1] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <div className="content-stretch flex flex-col gap-[16px] items-start p-[16px] relative w-full">
        <ChapterNameAndIcons3 />
        <Frame26 />
        <Frame28 />
      </div>
    </div>
  );
}

function Frame7() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-[718px]">
      <div className="flex flex-col font-['Geist:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#09090b] text-[16px] tracking-[0.4px] w-full">
        <p className="leading-[20px] whitespace-pre-wrap">Form 5B: Services Sites</p>
      </div>
    </div>
  );
}

function InsertDriveFile3() {
  return (
    <div className="col-1 ml-0 mt-0 relative row-1 size-[20px]" data-name="insert_drive_file">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="insert_drive_file">
          <path d={svgPaths.p183b5840} fill="var(--fill-0, #C41C1C)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Group6() {
  return (
    <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid leading-[0] place-items-start relative shrink-0">
      <InsertDriveFile3 />
      <div className="col-1 flex flex-col font-['Inter:Medium',sans-serif] font-medium h-[20px] justify-center ml-[24px] mt-0 not-italic relative row-1 text-[12px] text-black w-[117px]">
        <p className="leading-[normal] whitespace-pre-wrap">1 Missing Document</p>
      </div>
    </div>
  );
}

function Frame29() {
  return (
    <div className="content-stretch flex items-center relative shrink-0">
      <Group6 />
    </div>
  );
}

function ActionButton4() {
  return (
    <div className="bg-white content-stretch flex gap-[8px] h-[36px] items-center px-[16px] py-[8px] relative rounded-[6px] shrink-0" data-name="Action Button">
      <div aria-hidden="true" className="absolute border border-[#cdd7e1] border-solid inset-0 pointer-events-none rounded-[6px]" />
      <div className="flex flex-col font-['Geist:Medium',sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[#18181b] text-[14px] whitespace-nowrap">
        <p className="leading-[20px]">View Task</p>
      </div>
    </div>
  );
}

function TopRightIcons9() {
  return (
    <div className="content-stretch flex gap-[12px] items-center justify-end relative shrink-0" data-name="Top Right Icons">
      <Frame29 />
      <ActionButton4 />
    </div>
  );
}

function TopRightIcons8() {
  return (
    <div className="content-stretch flex items-center justify-end relative shrink-0" data-name="Top Right Icons">
      <TopRightIcons9 />
    </div>
  );
}

function ChapterNameAndIcons4() {
  return (
    <div className="content-stretch flex items-start justify-between relative shrink-0 w-full" data-name="Chapter Name and Icons">
      <Frame7 />
      <TopRightIcons8 />
    </div>
  );
}

function AutoAwesomeMotion() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="auto_awesome_motion">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="auto_awesome_motion">
          <path d={svgPaths.p1a00800} fill="var(--fill-0, black)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Frame30() {
  return (
    <div className="content-stretch flex gap-[4px] items-center relative shrink-0 w-full">
      <AutoAwesomeMotion />
      <div className="flex flex-[1_0_0] flex-col font-['Geist:Regular',sans-serif] font-normal justify-center leading-[0] min-h-px min-w-px relative text-[#09090b] text-[0px]">
        <p className="text-[14px] whitespace-pre-wrap">
          <span className="leading-[20px]">{`Duplicated in: `}</span>
          <span className="font-['Geist:Bold',sans-serif] font-bold leading-[20px]">Accessible Locations and Hours of Operations, Budget</span>
        </p>
      </div>
    </div>
  );
}

function Div7() {
  return (
    <div className="bg-white relative rounded-[8px] shrink-0 w-full" data-name="Div">
      <div aria-hidden="true" className="absolute border border-[#cdd7e1] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <div className="content-stretch flex flex-col gap-[16px] items-start p-[16px] relative w-full">
        <ChapterNameAndIcons4 />
        <Frame30 />
      </div>
    </div>
  );
}

function Frame8() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-[718px]">
      <div className="flex flex-col font-['Geist:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#09090b] text-[16px] tracking-[0.4px] w-full">
        <p className="leading-[20px] whitespace-pre-wrap">Competing Continuation Application (SAC or RD/NAP or ID)</p>
      </div>
    </div>
  );
}

function ActionButton5() {
  return (
    <div className="bg-white content-stretch flex gap-[8px] h-[36px] items-center px-[16px] py-[8px] relative rounded-[6px] shrink-0" data-name="Action Button">
      <div aria-hidden="true" className="absolute border border-[#cdd7e1] border-solid inset-0 pointer-events-none rounded-[6px]" />
      <div className="flex flex-col font-['Geist:Medium',sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[#18181b] text-[14px] whitespace-nowrap">
        <p className="leading-[20px]">View Task</p>
      </div>
    </div>
  );
}

function TopRightIcons11() {
  return (
    <div className="content-stretch flex items-center justify-end relative shrink-0" data-name="Top Right Icons">
      <ActionButton5 />
    </div>
  );
}

function TopRightIcons10() {
  return (
    <div className="content-stretch flex items-center justify-end relative shrink-0" data-name="Top Right Icons">
      <TopRightIcons11 />
    </div>
  );
}

function ChapterNameAndIcons5() {
  return (
    <div className="content-stretch flex items-start justify-between relative shrink-0 w-full" data-name="Chapter Name and Icons">
      <Frame8 />
      <TopRightIcons10 />
    </div>
  );
}

function Div8() {
  return (
    <div className="bg-white relative rounded-[8px] shrink-0 w-full" data-name="Div">
      <div aria-hidden="true" className="absolute border border-[#cdd7e1] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <div className="content-stretch flex flex-col items-start p-[16px] relative w-full">
        <ChapterNameAndIcons5 />
      </div>
    </div>
  );
}

function Frame9() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-[718px]">
      <div className="flex flex-col font-['Geist:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#09090b] text-[16px] tracking-[0.4px] w-full">
        <p className="leading-[20px] whitespace-pre-wrap">Most recent Form 5A</p>
      </div>
    </div>
  );
}

function ActionButton6() {
  return (
    <div className="bg-white content-stretch flex gap-[8px] h-[36px] items-center px-[16px] py-[8px] relative rounded-[6px] shrink-0" data-name="Action Button">
      <div aria-hidden="true" className="absolute border border-[#cdd7e1] border-solid inset-0 pointer-events-none rounded-[6px]" />
      <div className="flex flex-col font-['Geist:Medium',sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[#18181b] text-[14px] whitespace-nowrap">
        <p className="leading-[20px]">View Task</p>
      </div>
    </div>
  );
}

function TopRightIcons13() {
  return (
    <div className="content-stretch flex items-center justify-end relative shrink-0" data-name="Top Right Icons">
      <ActionButton6 />
    </div>
  );
}

function TopRightIcons12() {
  return (
    <div className="content-stretch flex items-center justify-end relative shrink-0" data-name="Top Right Icons">
      <TopRightIcons13 />
    </div>
  );
}

function ChapterNameAndIcons6() {
  return (
    <div className="content-stretch flex items-start justify-between relative shrink-0 w-full" data-name="Chapter Name and Icons">
      <Frame9 />
      <TopRightIcons12 />
    </div>
  );
}

function Div9() {
  return (
    <div className="bg-white relative rounded-[8px] shrink-0 w-full" data-name="Div">
      <div aria-hidden="true" className="absolute border border-[#cdd7e1] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <div className="content-stretch flex flex-col items-start p-[16px] relative w-full">
        <ChapterNameAndIcons6 />
      </div>
    </div>
  );
}

function Frame10() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col items-start min-h-px min-w-px relative">
      <div className="flex flex-col font-['Geist:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#09090b] text-[16px] tracking-[0.4px] w-[764px]">
        <p className="leading-[20px] whitespace-pre-wrap">Provide a narrative that describes how the health center utilizes Needs Assessments to improve health care. (Required for the Compliance and Excellence Operational Site Visit Assessment)†</p>
      </div>
    </div>
  );
}

function InsertDriveFile4() {
  return (
    <div className="col-1 ml-0 mt-0 relative row-1 size-[20px]" data-name="insert_drive_file">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="insert_drive_file">
          <path d={svgPaths.p183b5840} fill="var(--fill-0, #C41C1C)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Group7() {
  return (
    <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid leading-[0] place-items-start relative shrink-0">
      <InsertDriveFile4 />
      <div className="col-1 flex flex-col font-['Inter:Medium',sans-serif] font-medium h-[20px] justify-center ml-[24px] mt-0 not-italic relative row-1 text-[12px] text-black w-[117px]">
        <p className="leading-[normal] whitespace-pre-wrap">1 Missing Document</p>
      </div>
    </div>
  );
}

function Frame31() {
  return (
    <div className="content-stretch flex items-center relative shrink-0">
      <Group7 />
    </div>
  );
}

function ActionButton7() {
  return (
    <div className="bg-white content-stretch flex gap-[8px] h-[36px] items-center px-[16px] py-[8px] relative rounded-[6px] shrink-0" data-name="Action Button">
      <div aria-hidden="true" className="absolute border border-[#cdd7e1] border-solid inset-0 pointer-events-none rounded-[6px]" />
      <div className="flex flex-col font-['Geist:Medium',sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[#18181b] text-[14px] whitespace-nowrap">
        <p className="leading-[20px]">View Task</p>
      </div>
    </div>
  );
}

function TopRightIcons15() {
  return (
    <div className="content-stretch flex gap-[12px] items-center justify-end relative shrink-0" data-name="Top Right Icons">
      <Frame31 />
      <ActionButton7 />
    </div>
  );
}

function TopRightIcons14() {
  return (
    <div className="content-stretch flex items-center justify-end relative shrink-0" data-name="Top Right Icons">
      <TopRightIcons15 />
    </div>
  );
}

function ChapterNameAndIcons7() {
  return (
    <div className="content-stretch flex items-start justify-between relative shrink-0 w-full" data-name="Chapter Name and Icons">
      <Frame10 />
      <TopRightIcons14 />
    </div>
  );
}

function Star2() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="star">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="star">
          <path d={svgPaths.p26e22380} fill="var(--fill-0, black)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Frame33() {
  return (
    <div className="content-stretch flex gap-[4px] items-center relative shrink-0 w-full">
      <Star2 />
      <div className="flex flex-[1_0_0] flex-col font-['Geist:Regular',sans-serif] font-normal justify-center leading-[0] min-h-px min-w-px relative text-[#09090b] text-[0px]">
        <p className="text-[14px] whitespace-pre-wrap">
          <span className="leading-[20px]">{`Required for: `}</span>
          <span className="font-['Geist:Bold',sans-serif] font-bold leading-[20px]">HRSA Site Visit Protocol.</span>
        </p>
      </div>
    </div>
  );
}

function Div10() {
  return (
    <div className="bg-white relative rounded-[8px] shrink-0 w-full" data-name="Div">
      <div aria-hidden="true" className="absolute border border-[#cdd7e1] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <div className="content-stretch flex flex-col gap-[16px] items-start p-[16px] relative w-full">
        <ChapterNameAndIcons7 />
        <Frame33 />
      </div>
    </div>
  );
}

function Div3() {
  return (
    <div className="bg-white relative rounded-[8px] shrink-0 w-full" data-name="Div">
      <div aria-hidden="true" className="absolute border border-[#cdd7e1] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <div className="flex flex-col items-end size-full">
        <div className="content-stretch flex flex-col gap-[16px] items-end p-[16px] relative w-full">
          <ChapterNameAndIcons />
          <Div4 />
          <Div5 />
          <Div6 />
          <Div7 />
          <Div8 />
          <Div9 />
          <Div10 />
        </div>
      </div>
    </div>
  );
}

function ChevronDown() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="Chevron Down">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="Chevron Down">
          <path clipRule="evenodd" d={svgPaths.p2b042d70} fill="var(--fill-0, #09090B)" fillRule="evenodd" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function ChapterName1() {
  return (
    <div className="content-stretch flex gap-[16px] h-full items-center relative shrink-0" data-name="Chapter Name">
      <ChevronDown />
      <div className="flex flex-col font-['Geist:Regular',sans-serif] font-normal h-full justify-center leading-[0] relative shrink-0 text-[#09090b] text-[20px] tracking-[0.4px] w-[628px]">
        <p className="leading-[16px] whitespace-pre-wrap">Chapter 4: Required and Additional Health Services</p>
      </div>
    </div>
  );
}

function InsertDriveFile5() {
  return (
    <div className="col-1 ml-0 mt-0 relative row-1 size-[20px]" data-name="insert_drive_file">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="insert_drive_file">
          <path d={svgPaths.p183b5840} fill="var(--fill-0, #C41C1C)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Group8() {
  return (
    <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid leading-[0] place-items-start relative shrink-0">
      <InsertDriveFile5 />
      <div className="col-1 flex flex-col font-['Inter:Medium',sans-serif] font-medium h-[20px] justify-center ml-[24px] mt-0 not-italic relative row-1 text-[12px] text-black w-[117px]">
        <p className="leading-[normal] whitespace-pre-wrap">1 Needs Attention</p>
      </div>
    </div>
  );
}

function MoreVertFilled1() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="MoreVertFilled">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="MoreVertFilled">
          <path d={svgPaths.p3fdba000} fill="var(--fill-0, black)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Frame34() {
  return (
    <div className="content-stretch flex gap-[12px] items-center relative shrink-0">
      <Group8 />
      <MoreVertFilled1 />
    </div>
  );
}

function TopRightIcons17() {
  return (
    <div className="content-stretch flex items-center justify-end relative shrink-0" data-name="Top Right Icons">
      <Frame34 />
    </div>
  );
}

function TopRightIcons16() {
  return (
    <div className="content-stretch flex items-center justify-end relative shrink-0" data-name="Top Right Icons">
      <TopRightIcons17 />
    </div>
  );
}

function ChapterNameAndIcons8() {
  return (
    <div className="content-stretch flex items-center justify-between relative shrink-0 w-full" data-name="Chapter Name and Icons">
      <div className="flex flex-row items-center self-stretch">
        <ChapterName1 />
      </div>
      <TopRightIcons16 />
    </div>
  );
}

function Div11() {
  return (
    <div className="bg-white relative rounded-[8px] shrink-0 w-full" data-name="Div">
      <div aria-hidden="true" className="absolute border border-[#cdd7e1] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <div className="content-stretch flex flex-col items-start p-[16px] relative w-full">
        <ChapterNameAndIcons8 />
      </div>
    </div>
  );
}

function ChevronDown1() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="Chevron Down">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="Chevron Down">
          <path clipRule="evenodd" d={svgPaths.p2b042d70} fill="var(--fill-0, #09090B)" fillRule="evenodd" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function ChapterName2() {
  return (
    <div className="content-stretch flex gap-[16px] h-full items-center relative shrink-0" data-name="Chapter Name">
      <ChevronDown1 />
      <div className="flex flex-col font-['Geist:Regular',sans-serif] font-normal h-full justify-center leading-[0] relative shrink-0 text-[#09090b] text-[16px] tracking-[0.4px] w-[441px]">
        <p className="leading-[16px] whitespace-pre-wrap">Chapter 5: Clinical Staffing</p>
      </div>
    </div>
  );
}

function Frame() {
  return <div className="absolute bg-[#373f51] h-[4px] left-0 top-0 w-[32px]" />;
}

function Progress() {
  return (
    <div className="bg-[#d3dce5] h-[4px] overflow-clip relative rounded-[9999px] shrink-0 w-[142px]" data-name="Progress">
      <Frame />
    </div>
  );
}

function Frame11() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0">
      <div className="flex flex-col font-['Geist:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#09090b] text-[12px] whitespace-nowrap">
        <p className="leading-[20px]">1 of 3 Tasks Complete</p>
      </div>
      <Progress />
    </div>
  );
}

function MoreVertFilled2() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="MoreVertFilled">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="MoreVertFilled">
          <path d={svgPaths.p3fdba000} fill="var(--fill-0, black)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Frame35() {
  return (
    <div className="content-stretch flex items-center relative shrink-0">
      <MoreVertFilled2 />
    </div>
  );
}

function TopRightIcons20() {
  return (
    <div className="content-stretch flex gap-[12px] items-center justify-end relative shrink-0" data-name="Top Right Icons">
      <Frame11 />
      <Frame35 />
    </div>
  );
}

function TopRightIcons19() {
  return (
    <div className="content-stretch flex items-center justify-end relative shrink-0" data-name="Top Right Icons">
      <TopRightIcons20 />
    </div>
  );
}

function TopRightIcons18() {
  return (
    <div className="content-stretch flex items-center justify-end relative shrink-0" data-name="Top Right Icons">
      <TopRightIcons19 />
    </div>
  );
}

function ChapterNameAndIcons9() {
  return (
    <div className="content-stretch flex items-center justify-between relative shrink-0 w-full" data-name="Chapter Name and Icons">
      <div className="flex flex-row items-center self-stretch">
        <ChapterName2 />
      </div>
      <TopRightIcons18 />
    </div>
  );
}

function Div12() {
  return (
    <div className="bg-white relative rounded-[8px] shrink-0 w-full" data-name="Div">
      <div aria-hidden="true" className="absolute border border-[#cdd7e1] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <div className="content-stretch flex flex-col items-start p-[16px] relative w-full">
        <ChapterNameAndIcons9 />
      </div>
    </div>
  );
}

function ChevronDown2() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="Chevron Down">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="Chevron Down">
          <path clipRule="evenodd" d={svgPaths.p2b042d70} fill="var(--fill-0, #09090B)" fillRule="evenodd" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function ChapterName3() {
  return (
    <div className="content-stretch flex gap-[16px] h-full items-center relative shrink-0" data-name="Chapter Name">
      <ChevronDown2 />
      <div className="flex flex-col font-['Geist:Regular',sans-serif] font-normal h-full justify-center leading-[0] relative shrink-0 text-[#09090b] text-[16px] tracking-[0.4px] w-[441px]">
        <p className="leading-[16px] whitespace-pre-wrap">Chapter 6: Clinical Staffing</p>
      </div>
    </div>
  );
}

function Frame15() {
  return <div className="flex-[1_0_0] h-[24px] min-h-px min-w-px" />;
}

function Frame1() {
  return <div className="absolute bg-[#373f51] h-[4px] left-0 top-0 w-[142px]" />;
}

function Progress1() {
  return (
    <div className="bg-[#d3dce5] h-[4px] overflow-clip relative rounded-[9999px] shrink-0 w-[142px]" data-name="Progress">
      <Frame1 />
    </div>
  );
}

function Frame12() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0">
      <div className="flex flex-col font-['Geist:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#09090b] text-[12px] whitespace-nowrap">
        <p className="leading-[20px]">3 of 3 Tasks Complete</p>
      </div>
      <Progress1 />
    </div>
  );
}

function MoreVertFilled3() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="MoreVertFilled">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="MoreVertFilled">
          <path d={svgPaths.p3fdba000} fill="var(--fill-0, black)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Frame36() {
  return (
    <div className="content-stretch flex items-center relative shrink-0">
      <MoreVertFilled3 />
    </div>
  );
}

function TopRightIcons23() {
  return (
    <div className="content-stretch flex gap-[12px] items-center justify-end relative shrink-0 w-[290px]" data-name="Top Right Icons">
      <Frame15 />
      <Frame12 />
      <Frame36 />
    </div>
  );
}

function TopRightIcons22() {
  return (
    <div className="content-stretch flex items-center justify-end relative shrink-0" data-name="Top Right Icons">
      <TopRightIcons23 />
    </div>
  );
}

function TopRightIcons21() {
  return (
    <div className="content-stretch flex items-center justify-end relative shrink-0" data-name="Top Right Icons">
      <TopRightIcons22 />
    </div>
  );
}

function ChapterNameAndIcons10() {
  return (
    <div className="content-stretch flex items-center justify-between relative shrink-0 w-full" data-name="Chapter Name and Icons">
      <div className="flex flex-row items-center self-stretch">
        <ChapterName3 />
      </div>
      <TopRightIcons21 />
    </div>
  );
}

function Div13() {
  return (
    <div className="bg-white relative rounded-[8px] shrink-0 w-full" data-name="Div">
      <div aria-hidden="true" className="absolute border border-[#cdd7e1] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <div className="content-stretch flex flex-col items-start p-[16px] relative w-full">
        <ChapterNameAndIcons10 />
      </div>
    </div>
  );
}

function ChevronDown3() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="Chevron Down">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="Chevron Down">
          <path clipRule="evenodd" d={svgPaths.p2b042d70} fill="var(--fill-0, #09090B)" fillRule="evenodd" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function ChapterName4() {
  return (
    <div className="content-stretch flex gap-[16px] h-full items-center relative shrink-0" data-name="Chapter Name">
      <ChevronDown3 />
      <div className="flex flex-col font-['Geist:Regular',sans-serif] font-normal h-full justify-center leading-[0] relative shrink-0 text-[#09090b] text-[16px] tracking-[0.4px] w-[441px]">
        <p className="leading-[16px] whitespace-pre-wrap">Chapter 7: Clinical Staffing</p>
      </div>
    </div>
  );
}

function BadgePrimary1() {
  return (
    <div className="absolute bg-[#4cb92e] content-stretch flex items-center justify-center left-[24px] px-[10px] py-[2px] rounded-[9999px] top-0" data-name="Badge Primary">
      <div className="flex flex-col font-['Geist:SemiBold',sans-serif] font-semibold justify-center leading-[0] relative shrink-0 text-[#fafafa] text-[12px] text-center whitespace-nowrap">
        <p className="leading-[20px]">Approved</p>
      </div>
    </div>
  );
}

function Frame16() {
  return (
    <div className="h-[24px] relative shrink-0 w-[100px]">
      <BadgePrimary1 />
    </div>
  );
}

function Frame2() {
  return <div className="absolute bg-[#373f51] h-[4px] left-0 top-0 w-[142px]" />;
}

function Progress2() {
  return (
    <div className="bg-[#d3dce5] h-[4px] overflow-clip relative rounded-[9999px] shrink-0 w-[142px]" data-name="Progress">
      <Frame2 />
    </div>
  );
}

function Frame13() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0">
      <div className="flex flex-col font-['Geist:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#09090b] text-[12px] whitespace-nowrap">
        <p className="leading-[20px]">3 of 3 Tasks Complete</p>
      </div>
      <Progress2 />
    </div>
  );
}

function MoreVertFilled4() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="MoreVertFilled">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="MoreVertFilled">
          <path d={svgPaths.p3fdba000} fill="var(--fill-0, black)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Frame37() {
  return (
    <div className="content-stretch flex items-center relative shrink-0">
      <MoreVertFilled4 />
    </div>
  );
}

function TopRightIcons26() {
  return (
    <div className="content-stretch flex gap-[12px] items-center justify-end relative shrink-0" data-name="Top Right Icons">
      <Frame16 />
      <Frame13 />
      <Frame37 />
    </div>
  );
}

function TopRightIcons25() {
  return (
    <div className="content-stretch flex items-center justify-end relative shrink-0" data-name="Top Right Icons">
      <TopRightIcons26 />
    </div>
  );
}

function TopRightIcons24() {
  return (
    <div className="content-stretch flex items-center justify-end relative shrink-0" data-name="Top Right Icons">
      <TopRightIcons25 />
    </div>
  );
}

function ChapterNameAndIcons11() {
  return (
    <div className="content-stretch flex items-center justify-between relative shrink-0 w-full" data-name="Chapter Name and Icons">
      <div className="flex flex-row items-center self-stretch">
        <ChapterName4 />
      </div>
      <TopRightIcons24 />
    </div>
  );
}

function Div14() {
  return (
    <div className="bg-white relative rounded-[8px] shrink-0 w-full" data-name="Div">
      <div aria-hidden="true" className="absolute border border-[#cdd7e1] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <div className="content-stretch flex flex-col items-start p-[16px] relative w-full">
        <ChapterNameAndIcons11 />
      </div>
    </div>
  );
}

function ChevronDown4() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="Chevron Down">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="Chevron Down">
          <path clipRule="evenodd" d={svgPaths.p2b042d70} fill="var(--fill-0, #09090B)" fillRule="evenodd" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function ChapterName5() {
  return (
    <div className="content-stretch flex gap-[16px] h-full items-center relative shrink-0" data-name="Chapter Name">
      <ChevronDown4 />
      <div className="flex flex-col font-['Geist:Regular',sans-serif] font-normal h-full justify-center leading-[0] relative shrink-0 text-[#09090b] text-[16px] tracking-[0.4px] w-[441px]">
        <p className="leading-[16px] whitespace-pre-wrap">Chapter 7: Clinical Staffing</p>
      </div>
    </div>
  );
}

function Frame3() {
  return <div className="bg-[#373f51] h-[4px] w-[7px]" />;
}

function Progress3() {
  return (
    <div className="bg-[#d3dce5] h-[4px] overflow-clip relative rounded-[9999px] shrink-0 w-[142px]" data-name="Progress">
      <div className="absolute flex h-[4px] items-center justify-center left-[-7px] top-0 w-[7px]">
        <div className="-scale-y-100 flex-none rotate-180">
          <Frame3 />
        </div>
      </div>
    </div>
  );
}

function Frame14() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0">
      <div className="flex flex-col font-['Geist:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#09090b] text-[12px] whitespace-nowrap">
        <p className="leading-[20px]">0 of 3 Tasks Complete</p>
      </div>
      <Progress3 />
    </div>
  );
}

function MoreVertFilled5() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="MoreVertFilled">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="MoreVertFilled">
          <path d={svgPaths.p3fdba000} fill="var(--fill-0, black)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Frame38() {
  return (
    <div className="content-stretch flex items-center relative shrink-0">
      <MoreVertFilled5 />
    </div>
  );
}

function TopRightIcons29() {
  return (
    <div className="content-stretch flex gap-[12px] items-center justify-end relative shrink-0" data-name="Top Right Icons">
      <Frame14 />
      <Frame38 />
    </div>
  );
}

function TopRightIcons28() {
  return (
    <div className="content-stretch flex items-center justify-end relative shrink-0" data-name="Top Right Icons">
      <TopRightIcons29 />
    </div>
  );
}

function TopRightIcons27() {
  return (
    <div className="content-stretch flex items-center justify-end relative shrink-0" data-name="Top Right Icons">
      <TopRightIcons28 />
    </div>
  );
}

function ChapterNameAndIcons12() {
  return (
    <div className="content-stretch flex items-center justify-between relative shrink-0 w-full" data-name="Chapter Name and Icons">
      <div className="flex flex-row items-center self-stretch">
        <ChapterName5 />
      </div>
      <TopRightIcons27 />
    </div>
  );
}

function Div15() {
  return (
    <div className="bg-white relative rounded-[8px] shrink-0 w-full" data-name="Div">
      <div aria-hidden="true" className="absolute border border-[#cdd7e1] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <div className="content-stretch flex flex-col items-start p-[16px] relative w-full">
        <ChapterNameAndIcons12 />
      </div>
    </div>
  );
}

function Div2() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[16px] items-start justify-center left-[257px] pb-[32px] pt-[24px] px-[32px] top-[81px] w-[1183px]" data-name="Div">
      <Breadcrumb />
      <Frame18 />
      <Filters />
      <Div3 />
      <Div11 />
      <Div12 />
      <Div13 />
      <Div14 />
      <Div15 />
    </div>
  );
}

function ChevronDown5() {
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

function HealthCenter() {
  return (
    <div className="content-stretch flex gap-[8px] h-[40px] items-center px-[16px] py-[8px] relative rounded-[6px] shrink-0" data-name="Health Center">
      <div aria-hidden="true" className="absolute border border-[#fc6] border-solid inset-[-1px] pointer-events-none rounded-[7px]" />
      <div className="flex flex-col font-['Geist:Medium',sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[#fc6] text-[14px] w-[169px]">
        <p className="leading-[20px] whitespace-pre-wrap">All Health Centers</p>
      </div>
      <ChevronDown5 />
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
      <div className="flex flex-col font-['Geist:Medium',sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[14px] text-white whitespace-nowrap">
        <p className="leading-[20px]">Tasks</p>
      </div>
    </div>
  );
}

function NavigationMenuItem2() {
  return (
    <div className="content-stretch flex items-center justify-center relative rounded-[6px] shrink-0" data-name="Navigation Menu Item">
      <div className="flex flex-col font-['Geist:Medium',sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[#fc6] text-[14px] whitespace-nowrap">
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

function NavigationMenu2() {
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

function NavigationMenu1() {
  return (
    <div className="content-stretch flex items-center pr-[24px] relative shrink-0" data-name="Navigation Menu">
      <NavigationMenu2 />
    </div>
  );
}

function NavigationMenu() {
  return (
    <div className="content-stretch flex gap-[50px] items-center relative shrink-0 w-[825.085px]" data-name="Navigation Menu">
      <HealthCenter />
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

function AvatarSolid() {
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
      <AvatarSolid />
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

export default function Tools() {
  return (
    <div className="bg-white relative size-full" data-name="Tools">
      <AdminNavigation />
      <Div2 />
      <TopBar />
    </div>
  );
}