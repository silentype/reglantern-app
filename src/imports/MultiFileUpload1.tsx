import svgPaths from "./svg-8o23z7km16";

function ActionButton() {
  return (
    <div className="bg-[#fc6] content-stretch flex gap-[8px] h-[40px] items-center px-[16px] py-[8px] relative rounded-[6px] shrink-0" data-name="Action Button">
      <div className="flex flex-col font-['Geist:Medium',sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[#18181b] text-[14px] whitespace-nowrap">
        <p className="leading-[20px]">Save</p>
      </div>
    </div>
  );
}

function StatusDropdownIcon() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Status Dropdown Icon">
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
      <StatusDropdownIcon />
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

function Frame7() {
  return (
    <div className="content-stretch flex gap-[16px] items-center relative shrink-0">
      <ActionButton />
      <Select />
    </div>
  );
}

function CloseButton() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="Close Button">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="Close Button">
          <path clipRule="evenodd" d={svgPaths.p28fcbf80} fill="var(--fill-0, #18181b)" fillRule="evenodd" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function H() {
  return (
    <div className="content-stretch flex items-center justify-between relative shrink-0 w-full" data-name="H2">
      <Frame7 />
      <CloseButton />
    </div>
  );
}

function Div() {
  return (
    <div className="relative shrink-0 w-full" data-name="Div">
      <div className="content-stretch flex flex-col items-start p-[24px] relative w-full">
        <H />
      </div>
    </div>
  );
}

function StatusDropdownIcon1() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Status Dropdown Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Status Dropdown Icon">
          <path clipRule="evenodd" d={svgPaths.p248d3d00} fill="var(--fill-0, #18181B)" fillRule="evenodd" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Icon1() {
  return (
    <div className="content-stretch flex gap-[12px] items-center pl-[8px] relative shrink-0" data-name="Icon">
      <div className="flex flex-col font-['Geist:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#18181b] text-[14px] text-right whitespace-nowrap">
        <p className="leading-[20px]">0 of 5 files uploaded</p>
      </div>
      <StatusDropdownIcon1 />
    </div>
  );
}

function Frame8() {
  return (
    <div className="content-stretch flex items-center justify-end relative shrink-0">
      <Icon1 />
    </div>
  );
}

function Select1() {
  return (
    <div className="bg-white h-[40px] relative rounded-[6px] shrink-0 w-full" data-name="Select">
      <div aria-hidden="true" className="absolute border border-[#e4e4e7] border-solid inset-0 pointer-events-none rounded-[6px]" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center justify-between px-[12px] py-[8px] relative size-full">
          <div className="flex flex-col font-['Geist:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#18181b] text-[14px] whitespace-nowrap">
            <p className="leading-[20px]">Uploads overview</p>
          </div>
          <Frame8 />
        </div>
      </div>
    </div>
  );
}

function FileUpload() {
  return (
    <div className="col-1 ml-[247px] mt-[55px] relative row-1 size-[24px]" data-name="file_upload">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="file_upload">
          <path d={svgPaths.pab52080} fill="var(--fill-0, black)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function ActionButton1() {
  return (
    <div className="bg-white col-1 content-stretch flex gap-[8px] h-[40px] items-center ml-[201px] mt-[119px] px-[16px] py-[8px] relative rounded-[6px] row-1" data-name="Action Button">
      <div aria-hidden="true" className="absolute border border-[#cdd7e1] border-solid inset-0 pointer-events-none rounded-[6px]" />
      <div className="flex flex-col font-['Geist:Medium',sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[#18181b] text-[14px] whitespace-nowrap">
        <p className="leading-[20px]">Browse Files</p>
      </div>
    </div>
  );
}

function ActionButton2() {
  return (
    <div className="bg-white col-1 content-stretch flex gap-[8px] h-[40px] items-center ml-0 mt-[200px] px-[16px] py-[8px] relative rounded-[6px] row-1" data-name="Action Button">
      <div aria-hidden="true" className="absolute border border-[#cdd7e1] border-solid inset-0 pointer-events-none rounded-[6px]" />
      <div className="flex flex-col font-['Geist:Medium',sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[#18181b] text-[14px] whitespace-nowrap">
        <p className="leading-[20px]">Back</p>
      </div>
    </div>
  );
}

function ActionButton3() {
  return (
    <div className="bg-[#0e172a] col-1 content-stretch flex gap-[8px] h-[40px] items-center ml-[456px] mt-[197px] px-[16px] py-[8px] relative rounded-[6px] row-1" data-name="Action Button">
      <div className="flex flex-col font-['Geist:Medium',sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[14px] text-white whitespace-nowrap">
        <p className="leading-[20px]">Next</p>
      </div>
    </div>
  );
}

function UploadFilesContainer() {
  return (
    <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid leading-[0] place-items-start relative shrink-0" data-name="Upload Files Container">
      <div className="bg-[#f6f6f6] border border-[#a7a7a7] border-dashed col-1 h-[164px] ml-0 mt-[25px] rounded-[8px] row-1 w-[521px]" data-name="Upload Files Background" />
      <FileUpload />
      <p className="col-1 font-['Inter:Regular',sans-serif] font-normal h-[17px] leading-[normal] ml-0 mt-[86px] not-italic relative row-1 text-[#0d062d] text-[14px] text-center w-[517px] whitespace-pre-wrap">{`Drag & drop file here`}</p>
      <div className="col-1 flex flex-col font-['Geist:Regular',sans-serif] font-normal justify-center ml-0 mt-0 relative row-1 text-[#18181b] text-[14px] whitespace-nowrap">
        <p>
          <span className="leading-[14px]">{`Status: `}</span>
          <span className="leading-[14px] text-[#dc2626]">Missing file</span>
        </p>
      </div>
      <div className="col-1 flex flex-col font-['Geist:Regular',sans-serif] font-normal justify-center ml-[307px] mt-0 relative row-1 text-[14px] text-[rgba(9,9,11,0.6)] whitespace-nowrap">
        <p className="leading-[14px]">Accepted: PDF or JPG · Max 5MB</p>
      </div>
      <ActionButton1 />
      <ActionButton2 />
      <ActionButton3 />
    </div>
  );
}

function TaskDetails1() {
  return (
    <div className="content-stretch flex flex-col gap-[12px] items-start justify-center relative shrink-0 w-[521px]" data-name="Task Details">
      <div className="flex flex-col font-['Geist:Regular',sans-serif] font-normal h-[46px] justify-center leading-[0] relative shrink-0 text-[#18181b] text-[24px] tracking-[0.4px] w-full">
        <p className="leading-[22px] whitespace-pre-wrap">Upload patient files</p>
      </div>
      <Select1 />
      <div className="flex flex-col font-['Geist:Regular',sans-serif] font-normal justify-center leading-[0] min-w-full relative shrink-0 text-[#18181b] text-[17px] tracking-[0.4px] w-[min-content]">
        <p className="leading-[22px] whitespace-pre-wrap">Upload File for Patient 1</p>
      </div>
      <UploadFilesContainer />
    </div>
  );
}

function TaskDetails() {
  return (
    <div className="content-stretch flex flex-col items-start pb-[24px] pt-[8px] px-[24px] relative shrink-0 w-[569px]" data-name="Task Details">
      <TaskDetails1 />
    </div>
  );
}

function Tab() {
  return (
    <div className="bg-white flex-[1_0_0] min-h-px min-w-px relative rounded-[4px] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.05)]" data-name="Tab">
      <div className="flex flex-row items-center justify-center size-full">
        <div className="content-stretch flex items-center justify-center px-[12px] py-[6px] relative w-full">
          <div className="flex flex-col font-['Geist:Medium',sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[#18181b] text-[14px] whitespace-nowrap">
            <p className="leading-[20px]">Details</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Tab1() {
  return (
    <div className="flex-[1_0_0] min-h-px min-w-px relative rounded-[4px]" data-name="Tab">
      <div className="flex flex-row items-center justify-center size-full">
        <div className="content-stretch flex items-center justify-center px-[12px] py-[6px] relative w-full">
          <div className="flex flex-col font-['Geist:Medium',sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[#18181b] text-[14px] whitespace-nowrap">
            <p className="leading-[20px]">Comments</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Tab2() {
  return (
    <div className="flex-[1_0_0] min-h-px min-w-px relative rounded-[4px]" data-name="Tab">
      <div className="flex flex-row items-center justify-center size-full">
        <div className="content-stretch flex items-center justify-center px-[12px] py-[6px] relative w-full">
          <div className="flex flex-col font-['Geist:Medium',sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[#18181b] text-[14px] whitespace-nowrap">
            <p className="leading-[20px]">Activity</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Tab3() {
  return (
    <div className="flex-[1_0_0] min-h-px min-w-px relative rounded-[4px]" data-name="Tab">
      <div className="flex flex-row items-center justify-center size-full">
        <div className="content-stretch flex items-center justify-center px-[12px] py-[6px] relative w-full">
          <div className="flex flex-col font-['Geist:Medium',sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[#18181b] text-[14px] whitespace-nowrap">
            <p className="leading-[20px]">Guidance</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Tabs() {
  return (
    <div className="bg-[#f4f4f5] content-stretch flex h-[40px] items-center p-[4px] relative rounded-[6px] shrink-0 w-[521px]" data-name="Tabs">
      <Tab />
      <Tab1 />
      <Tab2 />
      <Tab3 />
    </div>
  );
}

function DueDateIcon() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Due Date Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Due Date Icon">
          <rect fill="white" height="20" width="20" />
          <path clipRule="evenodd" d={svgPaths.pc55d00} fill="var(--fill-0, #18181b)" fillRule="evenodd" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Label() {
  return (
    <div className="content-stretch flex items-center relative shrink-0 w-[104px]" data-name="Label">
      <div className="flex flex-col font-['Geist:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#18181b] text-[14px] whitespace-nowrap">
        <p className="leading-[14px]">Due Date</p>
      </div>
    </div>
  );
}

function DueDateDropdownIcon() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Due Date Dropdown Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Due Date Dropdown Icon">
          <path clipRule="evenodd" d={svgPaths.p50dd400} fill="var(--fill-0, #18181B)" fillRule="evenodd" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Icon2() {
  return (
    <div className="content-stretch flex items-center pl-[8px] relative shrink-0" data-name="Icon">
      <DueDateDropdownIcon />
    </div>
  );
}

function Select3() {
  return (
    <div className="bg-white content-stretch flex h-[40px] items-center justify-between px-[12px] py-[8px] relative rounded-[6px] shrink-0 w-[240px]" data-name="Select">
      <div aria-hidden="true" className="absolute border border-[#e4e4e7] border-solid inset-0 pointer-events-none rounded-[6px]" />
      <div className="flex flex-col font-['Geist:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#18181b] text-[14px] whitespace-nowrap">
        <p className="leading-[20px]">Select Date</p>
      </div>
      <Icon2 />
    </div>
  );
}

function Select2() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-full" data-name="Select">
      <DueDateIcon />
      <Label />
      <Select3 />
    </div>
  );
}

function AssignedToIcon() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Assigned To Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Assigned To Icon">
          <path clipRule="evenodd" d={svgPaths.p1f27cb28} fill="var(--fill-0, #18181b)" fillRule="evenodd" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Label1() {
  return (
    <div className="content-stretch flex items-center relative shrink-0 w-[104px]" data-name="Label">
      <div className="flex flex-col font-['Geist:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#18181b] text-[14px] whitespace-nowrap">
        <p className="leading-[14px]">Assigned to</p>
      </div>
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

function Assignee() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0" data-name="Assignee">
      <AvatarSolid />
      <div className="flex flex-col font-['Geist:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#18181b] text-[14px] whitespace-nowrap">
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

function Frame() {
  return (
    <div className="content-stretch flex items-center relative shrink-0">
      <Tag />
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

function Icon3() {
  return (
    <div className="content-stretch flex items-center pl-[8px] relative shrink-0" data-name="Icon">
      <AssignedToDropdownIcon />
    </div>
  );
}

function Select5() {
  return (
    <div className="bg-white content-stretch flex h-[40px] items-center justify-between px-[12px] py-[8px] relative rounded-[6px] shrink-0 w-[240px]" data-name="Select">
      <div aria-hidden="true" className="absolute border border-[#e4e4e7] border-solid inset-0 pointer-events-none rounded-[6px]" />
      <Frame />
      <Icon3 />
    </div>
  );
}

function Select4() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0" data-name="Select">
      <AssignedToIcon />
      <Label1 />
      <Select5 />
    </div>
  );
}

function CollaboratorsIcon() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Collaborators Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Collaborators Icon">
          <path clipRule="evenodd" d={svgPaths.p10480470} fill="var(--fill-0, #18181b)" fillRule="evenodd" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Label2() {
  return (
    <div className="content-stretch flex items-center relative shrink-0 w-[104px]" data-name="Label">
      <div className="flex flex-col font-['Geist:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#18181b] text-[14px] whitespace-nowrap">
        <p className="leading-[14px]">Collaborators</p>
      </div>
    </div>
  );
}

function StatusDropdownIcon2() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Status Dropdown Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Status Dropdown Icon">
          <path clipRule="evenodd" d={svgPaths.p248d3d00} fill="var(--fill-0, #18181B)" fillRule="evenodd" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Icon4() {
  return (
    <div className="content-stretch flex items-center pl-[8px] relative shrink-0" data-name="Icon">
      <StatusDropdownIcon2 />
    </div>
  );
}

function Select7() {
  return (
    <div className="bg-white content-stretch flex h-[40px] items-center justify-between px-[12px] py-[8px] relative rounded-[6px] shrink-0 w-[240px]" data-name="Select">
      <div aria-hidden="true" className="absolute border border-[#e4e4e7] border-solid inset-0 pointer-events-none rounded-[6px]" />
      <div className="flex flex-col font-['Geist:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#18181b] text-[14px] whitespace-nowrap">
        <p className="leading-[20px]">Select Collaborators</p>
      </div>
      <Icon4 />
    </div>
  );
}

function Select6() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-full" data-name="Select">
      <CollaboratorsIcon />
      <Label2 />
      <Select7 />
    </div>
  );
}

function Spacer() {
  return <div className="h-[16px] shrink-0 w-[118px]" data-name="Spacer" />;
}

function AutoAwesomeMotion() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="auto_awesome_motion">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="auto_awesome_motion">
          <path d={svgPaths.p2454fa80} fill="var(--fill-0, black)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Label3() {
  return (
    <div className="content-stretch flex items-center relative shrink-0 w-[104px]" data-name="Label">
      <div className="flex flex-col font-['Geist:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#18181b] text-[14px] whitespace-nowrap">
        <p className="leading-[14px]">Duplicated in</p>
      </div>
    </div>
  );
}

function Frame1() {
  return (
    <div className="content-stretch flex gap-[8px] h-[28px] items-center relative shrink-0">
      <AutoAwesomeMotion />
      <Label3 />
    </div>
  );
}

function Assignee1() {
  return (
    <div className="content-stretch flex items-center relative shrink-0" data-name="Assignee">
      <div className="flex flex-col font-['Geist:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#18181b] text-[14px] whitespace-nowrap">
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

function Frame3() {
  return (
    <div className="content-stretch flex items-center relative shrink-0">
      <Tag1 />
    </div>
  );
}

function Assignee2() {
  return (
    <div className="content-stretch flex items-center relative shrink-0" data-name="Assignee">
      <div className="flex flex-col font-['Geist:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#18181b] text-[14px] whitespace-nowrap">
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

function Frame4() {
  return (
    <div className="content-stretch flex items-center relative shrink-0">
      <Tag2 />
    </div>
  );
}

function Assignee3() {
  return (
    <div className="content-stretch flex items-center relative shrink-0" data-name="Assignee">
      <div className="flex flex-col font-['Geist:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#18181b] text-[14px] whitespace-nowrap">
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

function Frame5() {
  return (
    <div className="content-stretch flex items-center relative shrink-0">
      <Tag3 />
    </div>
  );
}

function Frame2() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0">
      <Frame3 />
      <Frame4 />
      <Frame5 />
    </div>
  );
}

function Select8() {
  return (
    <div className="content-stretch flex gap-[8px] items-start relative shrink-0 w-full" data-name="Select">
      <Frame1 />
      <Frame2 />
    </div>
  );
}

function CreatedByIcon() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Created By Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g clipPath="url(#clip0_1_15014)" id="Created By Icon">
          <path clipRule="evenodd" d={svgPaths.p3760ea20} fill="var(--fill-0, #18181b)" fillRule="evenodd" id="Icon" />
        </g>
        <defs>
          <clipPath id="clip0_1_15014">
            <rect fill="white" height="20" width="20" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Label4() {
  return (
    <div className="content-stretch flex items-center relative shrink-0 w-[104px]" data-name="Label">
      <div className="flex flex-col font-['Geist:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#18181b] text-[14px] whitespace-nowrap">
        <p className="leading-[14px]">Created by</p>
      </div>
    </div>
  );
}

function AvatarSolid1() {
  return (
    <div className="bg-[#fc6] content-stretch flex items-center justify-between overflow-clip relative rounded-[100px] shrink-0 size-[24px]" data-name="<Avatar>/Solid">
      <div className="-translate-x-1/2 -translate-y-1/2 absolute flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] left-1/2 not-italic size-[30px] text-[#18181b] text-[12px] text-center top-1/2">
        <p className="leading-[1.33] whitespace-pre-wrap">LL</p>
      </div>
    </div>
  );
}

function Assignee4() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0" data-name="Assignee">
      <AvatarSolid1 />
      <div className="flex flex-col font-['Geist:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#18181b] text-[14px] whitespace-nowrap">
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

function Frame6() {
  return (
    <div className="content-stretch flex items-center relative shrink-0">
      <Tag4 />
    </div>
  );
}

function Select9() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-full" data-name="Select">
      <CreatedByIcon />
      <Label4 />
      <Frame6 />
    </div>
  );
}

function TaskDetails3() {
  return (
    <div className="content-stretch flex flex-col gap-[12px] items-start justify-center relative shrink-0 w-[521px]" data-name="Task Details">
      <Tabs />
      <div className="bg-white h-0 shrink-0 w-full" />
      <Select2 />
      <Select4 />
      <Select6 />
      <Spacer />
      <Select8 />
      <Select9 />
    </div>
  );
}

function TaskDetails2() {
  return (
    <div className="bg-white content-stretch flex flex-col h-[441px] items-start pb-[24px] pt-[12px] px-[24px] relative shrink-0 w-[569px]" data-name="Task Details">
      <TaskDetails3 />
    </div>
  );
}

export default function MultiFileUpload() {
  return (
    <div className="bg-white content-stretch flex flex-col items-start relative size-full" data-name="Multi-file Upload 1">
      <Div />
      <TaskDetails />
      <TaskDetails2 />
    </div>
  );
}