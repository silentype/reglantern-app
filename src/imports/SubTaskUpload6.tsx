import svgPaths from "./svg-3gmpygqd7l";

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

function StatusDropdown() {
  return (
    <div className="content-stretch flex items-center relative shrink-0" data-name="Status Dropdown">
      <Select />
    </div>
  );
}

function H() {
  return (
    <div className="content-stretch flex items-center justify-between relative shrink-0 w-full" data-name="H2">
      <StatusDropdown />
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

function Div() {
  return (
    <div className="relative shrink-0 w-full" data-name="Div">
      <div aria-hidden="true" className="absolute border-[#e4e4e7] border-b border-solid inset-0 pointer-events-none" />
      <div className="content-stretch flex flex-col items-start p-[24px] relative w-full">
        <H />
      </div>
    </div>
  );
}

function TaskDetails1() {
  return (
    <div className="content-stretch flex flex-col font-['Geist:Regular',sans-serif] font-normal gap-[12px] items-start justify-center leading-[0] relative shrink-0 text-[#09090b] tracking-[0.4px] w-[521px]" data-name="Task Details">
      <div className="flex flex-col h-[46px] justify-center relative shrink-0 text-[24px] w-full">
        <p className="leading-[22px]">This is the task summary</p>
      </div>
      <div className="flex flex-col justify-center relative shrink-0 text-[15px] w-full">
        <p className="leading-[22px]">This is the task description</p>
      </div>
    </div>
  );
}

function H1() {
  return (
    <div className="absolute h-[19.983px] left-0 top-0 w-[454.809px]" data-name="h4">
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[20px] left-0 not-italic text-[#18181b] text-[14px] top-[0.11px] tracking-[-0.1504px] whitespace-nowrap">This is the sub task summary</p>
    </div>
  );
}

function P() {
  return (
    <div className="absolute h-[31.979px] left-0 overflow-clip top-[23.98px] w-[454.809px]" data-name="p">
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[16px] left-0 not-italic text-[#6b7280] text-[12px] top-[1.11px] w-[431px]">This is the sub task description</p>
    </div>
  );
}

function Container3() {
  return (
    <div className="absolute h-[24.01px] left-0 top-[63.94px] w-[454.809px]" data-name="Container">
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[16px] left-0 not-italic text-[#16a34a] text-[12px] top-[3.67px] whitespace-nowrap">3 files uploaded</p>
    </div>
  );
}

function Container2() {
  return (
    <div className="flex-[1_0_0] h-[87.951px] min-h-px min-w-px relative" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <H1 />
        <P />
        <Container3 />
      </div>
    </div>
  );
}

function ChevronRight() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="ChevronRight">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="ChevronRight">
          <path d="M7.5 15L12.5 10L7.5 5" id="Vector" stroke="var(--stroke-0, #6B7280)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
        </g>
      </svg>
    </div>
  );
}

function Div1() {
  return (
    <div className="absolute content-stretch flex h-[87.951px] items-end justify-between left-[17.1px] top-[17.1px] w-[486.806px]" data-name="div">
      <Container2 />
      <ChevronRight />
    </div>
  );
}

function Button() {
  return (
    <div className="bg-white h-[122.153px] relative rounded-[10px] shrink-0 w-full" data-name="button">
      <div aria-hidden="true" className="absolute border-[#e4e4e7] border-[1.111px] border-solid inset-0 pointer-events-none rounded-[10px]" />
      <Div1 />
    </div>
  );
}

function H2() {
  return (
    <div className="absolute h-[19.983px] left-0 top-0 w-[454.809px]" data-name="h4">
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[20px] left-0 not-italic text-[#18181b] text-[14px] top-[0.11px] tracking-[-0.1504px] whitespace-nowrap">This is the sub task summary</p>
    </div>
  );
}

function P1() {
  return (
    <div className="absolute h-[31.979px] left-0 overflow-clip top-[23.98px] w-[454.809px]" data-name="p">
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[16px] left-0 not-italic text-[#6b7280] text-[12px] top-[1.11px] w-[431px]">This is the sub task description</p>
    </div>
  );
}

function Container5() {
  return (
    <div className="absolute h-[24.01px] left-0 top-[63.94px] w-[454.809px]" data-name="Container">
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[16px] left-0 not-italic text-[#dc2626] text-[12px] top-[3.67px] whitespace-nowrap">Missing files</p>
    </div>
  );
}

function Container4() {
  return (
    <div className="flex-[1_0_0] h-[87.951px] min-h-px min-w-px relative" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <H2 />
        <P1 />
        <Container5 />
      </div>
    </div>
  );
}

function ChevronRight1() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="ChevronRight">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="ChevronRight">
          <path d="M7.5 15L12.5 10L7.5 5" id="Vector" stroke="var(--stroke-0, #6B7280)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
        </g>
      </svg>
    </div>
  );
}

function Div2() {
  return (
    <div className="absolute content-stretch flex h-[87.951px] items-end justify-between left-[17.1px] top-[17.1px] w-[486.806px]" data-name="div">
      <Container4 />
      <ChevronRight1 />
    </div>
  );
}

function Button1() {
  return (
    <div className="bg-white h-[122.153px] relative rounded-[10px] shrink-0 w-full" data-name="button">
      <div aria-hidden="true" className="absolute border-[#e4e4e7] border-[1.111px] border-solid inset-0 pointer-events-none rounded-[10px]" />
      <Div2 />
    </div>
  );
}

function Container1() {
  return (
    <div className="content-stretch flex flex-col gap-[11.997px] items-start relative shrink-0 w-full" data-name="Container">
      <Button />
      <Button1 />
    </div>
  );
}

function Container() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-[521.007px]" data-name="Container">
      <Container1 />
    </div>
  );
}

function TaskDetails() {
  return (
    <div className="content-stretch flex flex-col gap-[12px] items-start pb-[24px] pt-[8px] px-[24px] relative shrink-0 w-[569px]" data-name="Task Details">
      <TaskDetails1 />
      <Container />
    </div>
  );
}

function Icon1() {
  return (
    <div className="content-stretch flex items-center pl-[8px] relative shrink-0" data-name="Icon">
      <div className="overflow-clip relative shrink-0 size-[16px]" data-name="Due Date Dropdown Icon">
        <div className="absolute inset-[4.17%_8.33%]" data-name="Icon">
          <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 13.3333 14.6667">
            <path clipRule="evenodd" d={svgPaths.p37a3e330} fill="var(--fill-0, #18181B)" fillRule="evenodd" id="Icon" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Select2() {
  return (
    <div className="bg-white content-stretch flex h-[40px] items-center justify-between px-[12px] py-[8px] relative rounded-[6px] shrink-0 w-[240px]" data-name="Select">
      <div aria-hidden="true" className="absolute border border-[#e4e4e7] border-solid inset-0 pointer-events-none rounded-[6px]" />
      <div className="flex flex-col font-['Geist:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#18181b] text-[14px] whitespace-nowrap">
        <p className="leading-[20px]">Select Date</p>
      </div>
      <Icon1 />
    </div>
  );
}

function Select1() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-full" data-name="Select">
      <div className="bg-white overflow-clip relative shrink-0 size-[20px]" data-name="Due Date Icon">
        <div className="absolute inset-[4.17%_8.33%]" data-name="Icon">
          <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16.6667 18.3333">
            <path clipRule="evenodd" d={svgPaths.p35bc2d80} fill="var(--fill-0, #09090B)" fillRule="evenodd" id="Icon" />
          </svg>
        </div>
      </div>
      <div className="content-stretch flex items-center relative shrink-0 w-[104px]" data-name="Label">
        <div className="flex flex-col font-['Geist:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#09090b] text-[14px] whitespace-nowrap">
          <p className="leading-[14px]">Due Date</p>
        </div>
      </div>
      <Select2 />
    </div>
  );
}

function AvatarSolid() {
  return (
    <div className="bg-[#fc6] content-stretch flex items-center justify-between overflow-clip relative rounded-[100px] shrink-0 size-[24px]" data-name="<Avatar>/Solid">
      <div className="-translate-x-1/2 -translate-y-1/2 absolute flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] left-1/2 not-italic size-[30px] text-[#09090b] text-[12px] text-center top-1/2">
        <p className="leading-[1.33]">TF</p>
      </div>
    </div>
  );
}

function Assignee() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0" data-name="Assignee">
      <AvatarSolid />
      <div className="flex flex-col font-['Geist:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#09090b] text-[14px] whitespace-nowrap">
        <p className="leading-[20px]">Tim Freeman</p>
      </div>
    </div>
  );
}

function Tag() {
  return (
    <div className="bg-[#f5f5f5] content-stretch flex items-center justify-center px-[6px] py-[4px] relative rounded-[8px] shrink-0" data-name="Tag">
      <Assignee />
    </div>
  );
}

function AssigneeTag() {
  return (
    <div className="content-stretch flex items-center relative shrink-0" data-name="Assignee Tag">
      <Tag />
    </div>
  );
}

function Icon2() {
  return (
    <div className="content-stretch flex items-center pl-[8px] relative shrink-0" data-name="Icon">
      <div className="overflow-clip relative shrink-0 size-[16px]" data-name="Assigned To Dropdown Icon">
        <div className="absolute inset-[33.33%_20.83%]" data-name="Icon">
          <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 9.33333 5.33333">
            <path clipRule="evenodd" d={svgPaths.p23cd8f00} fill="var(--fill-0, #18181B)" fillRule="evenodd" id="Icon" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Select4() {
  return (
    <div className="bg-white content-stretch flex h-[40px] items-center justify-between px-[12px] py-[8px] relative rounded-[6px] shrink-0 w-[240px]" data-name="Select">
      <div aria-hidden="true" className="absolute border border-[#e4e4e7] border-solid inset-0 pointer-events-none rounded-[6px]" />
      <AssigneeTag />
      <Icon2 />
    </div>
  );
}

function Select3() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0" data-name="Select">
      <div className="overflow-clip relative shrink-0 size-[20px]" data-name="Assigned To Icon">
        <div className="absolute inset-[8.33%_16.67%]" data-name="Icon">
          <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 13.3333 16.6667">
            <path clipRule="evenodd" d={svgPaths.p349a14f0} fill="var(--fill-0, #09090B)" fillRule="evenodd" id="Icon" />
          </svg>
        </div>
      </div>
      <div className="content-stretch flex items-center relative shrink-0 w-[104px]" data-name="Label">
        <div className="flex flex-col font-['Geist:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#09090b] text-[14px] whitespace-nowrap">
          <p className="leading-[14px]">Assigned to</p>
        </div>
      </div>
      <Select4 />
    </div>
  );
}

function Icon3() {
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

function Select6() {
  return (
    <div className="bg-white content-stretch flex h-[40px] items-center justify-between px-[12px] py-[8px] relative rounded-[6px] shrink-0 w-[240px]" data-name="Select">
      <div aria-hidden="true" className="absolute border border-[#e4e4e7] border-solid inset-0 pointer-events-none rounded-[6px]" />
      <div className="flex flex-col font-['Geist:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#18181b] text-[14px] whitespace-nowrap">
        <p className="leading-[20px]">Select Collaborators</p>
      </div>
      <Icon3 />
    </div>
  );
}

function Select5() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-full" data-name="Select">
      <div className="overflow-clip relative shrink-0 size-[20px]" data-name="Collaborators Icon">
        <div className="absolute inset-[8.33%_4.17%]" data-name="Icon">
          <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18.3333 16.6667">
            <path clipRule="evenodd" d={svgPaths.p2f793680} fill="var(--fill-0, #09090B)" fillRule="evenodd" id="Icon" />
          </svg>
        </div>
      </div>
      <div className="content-stretch flex items-center relative shrink-0 w-[104px]" data-name="Label">
        <div className="flex flex-col font-['Geist:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#09090b] text-[14px] whitespace-nowrap">
          <p className="leading-[14px]">Collaborators</p>
        </div>
      </div>
      <Select6 />
    </div>
  );
}

function DuplicateTag() {
  return (
    <div className="content-stretch flex gap-[8px] h-[28px] items-center relative shrink-0" data-name="Duplicate Tag">
      <div className="overflow-clip relative shrink-0 size-[20px]" data-name="auto_awesome_motion">
        <div className="absolute inset-[8.33%]" data-name="Vector">
          <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16.6667 16.6667">
            <path d={svgPaths.p2c10b200} fill="var(--fill-0, black)" id="Vector" />
          </svg>
        </div>
      </div>
      <div className="content-stretch flex items-center relative shrink-0 w-[104px]" data-name="Label">
        <div className="flex flex-col font-['Geist:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#09090b] text-[14px] whitespace-nowrap">
          <p className="leading-[14px]">Duplicated in</p>
        </div>
      </div>
    </div>
  );
}

function Assignee1() {
  return (
    <div className="content-stretch flex items-center relative shrink-0" data-name="Assignee">
      <div className="flex flex-col font-['Geist:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#09090b] text-[14px] whitespace-nowrap">
        <p className="leading-[20px]">OSV 2025: Accessible Locations</p>
      </div>
    </div>
  );
}

function Tag1() {
  return (
    <div className="bg-[#f5f5f5] content-stretch flex items-center justify-center px-[6px] py-[4px] relative rounded-[8px] shrink-0" data-name="Tag">
      <Assignee1 />
    </div>
  );
}

function DuplicateItem() {
  return (
    <div className="content-stretch flex items-center relative shrink-0" data-name="Duplicate Item">
      <Tag1 />
    </div>
  );
}

function Assignee2() {
  return (
    <div className="content-stretch flex items-center relative shrink-0" data-name="Assignee">
      <div className="flex flex-col font-['Geist:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#09090b] text-[14px] whitespace-nowrap">
        <p className="leading-[20px]">OSV 2025: Hours of Operation</p>
      </div>
    </div>
  );
}

function Tag2() {
  return (
    <div className="bg-[#f5f5f5] content-stretch flex items-center justify-center px-[6px] py-[4px] relative rounded-[8px] shrink-0" data-name="Tag">
      <Assignee2 />
    </div>
  );
}

function DuplicateItem1() {
  return (
    <div className="content-stretch flex items-center relative shrink-0" data-name="Duplicate Item">
      <Tag2 />
    </div>
  );
}

function Assignee3() {
  return (
    <div className="content-stretch flex items-center relative shrink-0" data-name="Assignee">
      <div className="flex flex-col font-['Geist:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#09090b] text-[14px] whitespace-nowrap">
        <p className="leading-[20px]">OSV 2025: Collaborative Relationships</p>
      </div>
    </div>
  );
}

function Tag3() {
  return (
    <div className="bg-[#f5f5f5] content-stretch flex items-center justify-center px-[6px] py-[4px] relative rounded-[8px] shrink-0" data-name="Tag">
      <Assignee3 />
    </div>
  );
}

function DuplicateItem2() {
  return (
    <div className="content-stretch flex items-center relative shrink-0" data-name="Duplicate Item">
      <Tag3 />
    </div>
  );
}

function DuplicateList() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0" data-name="Duplicate List">
      <DuplicateItem />
      <DuplicateItem1 />
      <DuplicateItem2 />
    </div>
  );
}

function Select7() {
  return (
    <div className="content-stretch flex gap-[8px] items-start relative shrink-0 w-full" data-name="Select">
      <DuplicateTag />
      <DuplicateList />
    </div>
  );
}

function AvatarSolid1() {
  return (
    <div className="bg-[#fc6] content-stretch flex items-center justify-between overflow-clip relative rounded-[100px] shrink-0 size-[24px]" data-name="<Avatar>/Solid">
      <div className="-translate-x-1/2 -translate-y-1/2 absolute flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] left-1/2 not-italic size-[30px] text-[#09090b] text-[12px] text-center top-1/2">
        <p className="leading-[1.33]">LL</p>
      </div>
    </div>
  );
}

function Assignee4() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0" data-name="Assignee">
      <AvatarSolid1 />
      <div className="flex flex-col font-['Geist:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#09090b] text-[14px] whitespace-nowrap">
        <p className="leading-[20px]">Lance Luttrell</p>
      </div>
    </div>
  );
}

function Tag4() {
  return (
    <div className="bg-[#f5f5f5] content-stretch flex items-center justify-center px-[6px] py-[4px] relative rounded-[8px] shrink-0" data-name="Tag">
      <Assignee4 />
    </div>
  );
}

function CreatedByTag() {
  return (
    <div className="content-stretch flex items-center relative shrink-0" data-name="Created By Tag">
      <Tag4 />
    </div>
  );
}

function Select8() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-full" data-name="Select">
      <div className="overflow-clip relative shrink-0 size-[20px]" data-name="Created By Icon">
        <div className="absolute inset-[4.17%]" data-name="Icon">
          <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18.3333 18.3333">
            <path clipRule="evenodd" d={svgPaths.p30074780} fill="var(--fill-0, #09090B)" fillRule="evenodd" id="Icon" />
          </svg>
        </div>
      </div>
      <div className="content-stretch flex items-center relative shrink-0 w-[104px]" data-name="Label">
        <div className="flex flex-col font-['Geist:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#09090b] text-[14px] whitespace-nowrap">
          <p className="leading-[14px]">Created by</p>
        </div>
      </div>
      <CreatedByTag />
    </div>
  );
}

function TaskDetails3() {
  return (
    <div className="content-stretch flex flex-col gap-[12px] items-start justify-center relative shrink-0 w-[521px]" data-name="Task Details">
      <div className="bg-[#f4f4f5] content-stretch flex h-[40px] items-center p-[4px] relative rounded-[6px] shrink-0 w-[521px]" data-name="Tab navigation">
        <div className="bg-white flex-[1_0_0] min-h-px min-w-px relative rounded-[4px] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.05)]" data-name="Tab">
          <div className="flex flex-row items-center justify-center size-full">
            <div className="content-stretch flex items-center justify-center px-[12px] py-[6px] relative w-full">
              <div className="flex flex-col font-['Geist:Medium',sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[#09090b] text-[14px] whitespace-nowrap">
                <p className="leading-[20px]">Details</p>
              </div>
            </div>
          </div>
        </div>
        <div className="flex-[1_0_0] min-h-px min-w-px relative rounded-[4px]" data-name="Tab">
          <div className="flex flex-row items-center justify-center size-full">
            <div className="content-stretch flex items-center justify-center px-[12px] py-[6px] relative w-full">
              <div className="flex flex-col font-['Geist:Medium',sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[#09090b] text-[14px] whitespace-nowrap">
                <p className="leading-[20px]">Comments</p>
              </div>
            </div>
          </div>
        </div>
        <div className="flex-[1_0_0] min-h-px min-w-px relative rounded-[4px]" data-name="Tab">
          <div className="flex flex-row items-center justify-center size-full">
            <div className="content-stretch flex items-center justify-center px-[12px] py-[6px] relative w-full">
              <div className="flex flex-col font-['Geist:Medium',sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[#09090b] text-[14px] whitespace-nowrap">
                <p className="leading-[20px]">Activity</p>
              </div>
            </div>
          </div>
        </div>
        <div className="flex-[1_0_0] min-h-px min-w-px relative rounded-[4px]" data-name="Tab">
          <div className="flex flex-row items-center justify-center size-full">
            <div className="content-stretch flex items-center justify-center px-[12px] py-[6px] relative w-full">
              <div className="flex flex-col font-['Geist:Medium',sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[#09090b] text-[14px] whitespace-nowrap">
                <p className="leading-[20px]">Guidance</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-white h-0 shrink-0 w-full" data-name="Divider" />
      <Select1 />
      <Select3 />
      <Select5 />
      <Select7 />
      <Select8 />
    </div>
  );
}

function TaskDetails2() {
  return (
    <div className="bg-white content-stretch flex flex-col h-[440px] items-start p-[24px] relative shrink-0 w-[569px]" data-name="Task Details">
      <div aria-hidden="true" className="absolute border-[#e4e4e7] border-solid border-t inset-0 pointer-events-none" />
      <TaskDetails3 />
    </div>
  );
}

export default function SubTaskUpload() {
  return (
    <div className="bg-white content-stretch flex flex-col items-start relative size-full" data-name="subTask upload 6">
      <Div />
      <TaskDetails />
      <TaskDetails2 />
    </div>
  );
}