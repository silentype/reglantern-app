import svgPaths from "./svg-cqqadqx4y2";

function ActionButton() {
  return (
    <div className="bg-white content-stretch flex gap-[8px] h-[40px] items-center px-[16px] py-[8px] relative rounded-[6px] shrink-0" data-name="Action Button">
      <div aria-hidden="true" className="absolute border border-[#cdd7e1] border-solid inset-0 pointer-events-none rounded-[6px]" />
      <div className="overflow-clip relative shrink-0 size-[16px]" data-name="Arrow Left">
        <div className="absolute inset-[16.67%]" data-name="Vector (Stroke)">
          <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 10.6667 10.6667">
            <path clipRule="evenodd" d={svgPaths.p38ef20f0} fill="var(--fill-0, #09090B)" fillRule="evenodd" id="Vector (Stroke)" />
          </svg>
        </div>
      </div>
      <div className="flex flex-col font-['Geist:Medium',sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[#18181b] text-[14px] whitespace-nowrap">
        <p className="leading-[20px]">Back</p>
      </div>
    </div>
  );
}

function H() {
  return (
    <div className="content-stretch flex items-center justify-between relative shrink-0 w-full" data-name="H2">
      <ActionButton />
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
        <p className="leading-[22px]">This is the sub task summary</p>
      </div>
      <div className="flex flex-col justify-center relative shrink-0 text-[15px] w-full">
        <p className="leading-[22px]">This is the sub task description</p>
      </div>
    </div>
  );
}

function P() {
  return (
    <div className="absolute h-[19.983px] left-[193.35px] top-[65.09px] w-[134.288px]" data-name="p">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[20px] left-0 not-italic text-[#0d062d] text-[14px] top-[0.11px] tracking-[-0.1504px] whitespace-nowrap">{`Drag & drop file here`}</p>
    </div>
  );
}

function Button() {
  return (
    <div className="absolute bg-white border-[#cdd7e1] border-[1.111px] border-solid h-[38.177px] left-[202.03px] rounded-[8px] top-[101.06px] w-[116.927px]" data-name="button">
      <p className="-translate-x-1/2 absolute font-['Inter:Medium',sans-serif] font-medium leading-[20px] left-[57.49px] not-italic text-[#18181b] text-[14px] text-center top-[8.1px] tracking-[-0.1504px] whitespace-nowrap">Browse Files</p>
    </div>
  );
}

function Svg() {
  return (
    <div className="h-[16.007px] overflow-clip relative shrink-0 w-full" data-name="svg">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16.0069 16.0069">
        <path d={svgPaths.p1363c030} fill="var(--fill-0, black)" id="Vector" />
      </svg>
    </div>
  );
}

function Container2() {
  return (
    <div className="absolute content-stretch flex flex-col items-start left-[252.5px] size-[16.007px] top-[29.1px]" data-name="Container">
      <Svg />
    </div>
  );
}

function Container1() {
  return (
    <div className="bg-[#f6f6f6] h-[164.34px] relative rounded-[10px] shrink-0 w-[521.007px]" data-name="Container">
      <div aria-hidden="true" className="absolute border-[#a7a7a7] border-[1.111px] border-solid inset-0 pointer-events-none rounded-[10px]" />
      <P />
      <Button />
      <Container2 />
    </div>
  );
}

function Container4() {
  return (
    <div className="h-[19.983px] relative shrink-0 w-[150.035px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[0] left-0 not-italic text-[#18181b] text-[14px] top-[0.11px] tracking-[-0.1504px] whitespace-nowrap">
          <span className="leading-[20px]">{`Status: `}</span>
          <span className="leading-[20px] text-[#00bc06]">2 files uploaded</span>
        </p>
      </div>
    </div>
  );
}

function Container5() {
  return (
    <div className="h-[19.983px] relative shrink-0 w-[183.698px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[20px] left-0 not-italic text-[14px] text-[rgba(24,24,27,0.6)] top-[0.11px] tracking-[-0.1504px] whitespace-nowrap">Max size 5MB per document</p>
      </div>
    </div>
  );
}

function Container3() {
  return (
    <div className="content-stretch flex h-[19.983px] items-center justify-between relative shrink-0 w-[521.007px]" data-name="Container">
      <Container4 />
      <Container5 />
    </div>
  );
}

function Container7() {
  return <div className="absolute bg-[#dbeafe] h-[69.948px] left-[1.11px] opacity-50 top-[1.11px] w-[284.08px]" data-name="Container" />;
}

function P1() {
  return (
    <div className="h-[19.983px] overflow-clip relative shrink-0 w-full" data-name="p">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[20px] left-0 not-italic text-[#212121] text-[14px] top-[0.11px] tracking-[-0.1504px] whitespace-nowrap">Lance 2026 PDF Map and Analysis 1.pdf</p>
    </div>
  );
}

function P2() {
  return (
    <div className="h-[15.99px] relative shrink-0 w-full" data-name="p">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[16px] left-0 not-italic text-[#8c8c8c] text-[12px] top-[1.11px] whitespace-nowrap">3.1 - Service Area Reps-Analysis • 2.5MB</p>
    </div>
  );
}

function Container8() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[1.996px] h-[37.969px] items-start left-[61.09px] top-[17.1px] w-[403.854px]" data-name="Container">
      <P1 />
      <P2 />
    </div>
  );
}

function Span() {
  return (
    <div className="absolute h-[15.99px] left-[476.94px] top-[28.09px] w-[26.962px]" data-name="span">
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[16px] left-0 not-italic text-[#3b82f6] text-[12px] top-[1.11px] whitespace-nowrap">56%</p>
    </div>
  );
}

function Upload() {
  return (
    <div className="h-[31.997px] opacity-51 overflow-clip relative shrink-0 w-full" data-name="Upload">
      <div className="absolute inset-[62.5%_12.5%_12.5%_12.5%]" data-name="Vector">
        <div className="absolute inset-[-16.67%_-5.56%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 26.6638 10.6655">
            <path d={svgPaths.p46e8a00} id="Vector" stroke="var(--stroke-0, #3B82F6)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.66638" />
          </svg>
        </div>
      </div>
      <div className="absolute inset-[12.5%_29.17%_66.67%_29.17%]" data-name="Vector">
        <div className="absolute inset-[-20%_-10%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 15.9983 9.33232">
            <path d={svgPaths.pbc2c600} id="Vector" stroke="var(--stroke-0, #3B82F6)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.66638" />
          </svg>
        </div>
      </div>
      <div className="absolute bottom-[37.5%] left-1/2 right-1/2 top-[12.5%]" data-name="Vector">
        <div className="absolute inset-[-8.33%_-1.33px]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 2.66638 18.6646">
            <path d="M1.33319 1.33319V17.3315" id="Vector" stroke="var(--stroke-0, #3B82F6)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.66638" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Container9() {
  return (
    <div className="absolute content-stretch flex flex-col items-start left-[17.1px] size-[31.997px] top-[20.09px]" data-name="Container">
      <Upload />
    </div>
  );
}

function Container6() {
  return (
    <div className="bg-white h-[72.17px] relative rounded-[10px] shrink-0 w-[521.007px]" data-name="Container">
      <div className="overflow-clip relative rounded-[inherit] size-full">
        <Container7 />
        <Container8 />
        <Span />
        <Container9 />
      </div>
      <div aria-hidden="true" className="absolute border-[#3b82f6] border-[1.111px] border-solid inset-0 pointer-events-none rounded-[10px]" />
    </div>
  );
}

function Frame() {
  return (
    <div className="aspect-[24/24] col-1 ml-[14px] mt-[14px] overflow-clip relative row-1 w-[32px]" data-name="Frame">
      <div className="absolute inset-[11.46%_26.64%_11.46%_12.09%]" data-name="Vector">
        <div className="absolute inset-[-2.03%_-2.55%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20.6087 25.6667">
            <path d={svgPaths.p27ee2a60} id="Vector" stroke="var(--stroke-0, black)" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>
      <div className="absolute inset-[50.25%_18.61%_33.94%_44.31%]" data-name="Vector">
        <div className="absolute inset-[-9.88%_-4.21%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12.864 6.06">
            <path d={svgPaths.p2b470e00} id="Vector" stroke="var(--stroke-0, black)" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>
      <div className="absolute inset-[43%_12.09%_26.69%_35.65%]" data-name="Vector">
        <div className="absolute inset-[-5.15%_-2.99%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 17.722 10.7">
            <path d={svgPaths.p1f650a40} id="Vector" stroke="var(--stroke-0, black)" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function FileItem() {
  return (
    <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid leading-[0] place-items-start relative shrink-0" data-name="File Item">
      <div className="bg-white border border-[#cdd7e1] border-solid col-1 h-[60px] ml-0 mt-0 rounded-[8px] row-1 w-[521px]" data-name="Upload Files Background" />
      <Frame />
      <p className="col-1 font-['Inter:Regular',sans-serif] font-normal h-[17px] leading-[normal] ml-[58px] mt-[12px] not-italic relative row-1 text-[#212121] text-[14px] w-[412px]">Lance 2026 PDF Map and Analysis.pdf</p>
      <p className="col-1 font-['Inter:Regular',sans-serif] font-normal h-[17px] leading-[normal] ml-[58px] mt-[32px] not-italic relative row-1 text-[#8c8c8c] text-[11px] w-[412px]">3.1 - Service Area Reps-Analysis</p>
      <p className="col-1 font-['Inter:Regular',sans-serif] font-normal h-[17px] leading-[normal] ml-[58px] mt-[32px] not-italic relative row-1 text-[#8c8c8c] text-[11px] w-[412px]">3.1 - Service Area Reps-Analysis • 2.5MB</p>
      <div className="bg-white col-1 ml-[483px] mt-[20px] overflow-clip relative row-1 size-[20px]" data-name="Due Date Icon">
        <div className="absolute inset-[4.17%_8.33%]" data-name="Icon">
          <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16.6667 18.3333">
            <path clipRule="evenodd" d={svgPaths.pc7d1a80} fill="var(--fill-0, #09090B)" fillRule="evenodd" id="Icon" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Frame1() {
  return (
    <div className="col-1 ml-[14px] mt-[14px] relative row-1 size-[32px]" data-name="Frame">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 32 32">
        <g id="Frame">
          <path d={svgPaths.p284b0000} id="Vector" stroke="var(--stroke-0, black)" strokeLinecap="round" strokeLinejoin="round" />
          <path d={svgPaths.p50e1c00} id="Vector_2" stroke="var(--stroke-0, black)" strokeLinecap="round" strokeLinejoin="round" />
          <path d={svgPaths.pb8d9980} id="Vector_3" stroke="var(--stroke-0, black)" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      </svg>
    </div>
  );
}

function FileItem1() {
  return (
    <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid leading-[0] place-items-start relative shrink-0" data-name="File Item">
      <div className="bg-white border border-[#cdd7e1] border-solid col-1 h-[60px] ml-0 mt-0 rounded-[8px] row-1 w-[521px]" data-name="Upload Files Background" />
      <p className="col-1 font-['Inter:Regular',sans-serif] font-normal h-[17px] leading-[normal] ml-[58px] mt-[12px] not-italic relative row-1 text-[#212121] text-[14px] w-[412px]">Lance 2026 PDF Map and Analysis.pdf</p>
      <Frame1 />
      <p className="col-1 font-['Inter:Regular',sans-serif] font-normal h-[17px] leading-[normal] ml-[58px] mt-[32px] not-italic relative row-1 text-[#8c8c8c] text-[11px] w-[412px]">3.1 - Service Area Reps-Analysis</p>
      <p className="col-1 font-['Inter:Regular',sans-serif] font-normal h-[17px] leading-[normal] ml-[58px] mt-[32px] not-italic relative row-1 text-[#8c8c8c] text-[11px] w-[412px]">3.1 - Service Area Reps-Analysis • 2.5MB</p>
      <div className="bg-white col-1 ml-[483px] mt-[20px] overflow-clip relative row-1 size-[20px]" data-name="Due Date Icon">
        <div className="absolute inset-[4.17%_8.33%]" data-name="Icon">
          <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16.6667 18.3333">
            <path clipRule="evenodd" d={svgPaths.pc7d1a80} fill="var(--fill-0, #09090B)" fillRule="evenodd" id="Icon" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Container() {
  return (
    <div className="content-stretch flex flex-col gap-[15.99px] items-start relative shrink-0 w-[521.007px]" data-name="Container">
      <Container1 />
      <Container3 />
      <Container6 />
      <FileItem />
      <FileItem1 />
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

export default function SubTaskUpload() {
  return (
    <div className="bg-white content-stretch flex flex-col items-start relative size-full" data-name="subTask upload 7">
      <Div />
      <TaskDetails />
    </div>
  );
}