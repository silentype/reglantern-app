import svgPaths from "./svg-4rlgkpgv7k";

function UploadFiles() {
  return (
    <div className="absolute bg-[#f6f6f6] content-stretch flex flex-col gap-[12px] items-center justify-center left-0 py-[16px] rounded-[8px] top-0 w-[521px]" data-name="Upload Files">
      <div aria-hidden="true" className="absolute border border-[#a7a7a7] border-dashed inset-0 pointer-events-none rounded-[8px]" />
      <div className="overflow-clip relative shrink-0 size-[24px]" data-name="file_upload">
        <div className="absolute inset-[16.67%]" data-name="Vector">
          <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
            <path d={svgPaths.p1942b080} fill="var(--fill-0, black)" id="Vector" />
          </svg>
        </div>
      </div>
      <p className="font-['Inter:Regular',sans-serif] font-normal h-[17px] leading-[normal] not-italic relative shrink-0 text-[#0d062d] text-[14px] text-center w-[517px] whitespace-pre-wrap">{`Drag & drop file here`}</p>
      <div className="bg-white content-stretch flex gap-[8px] items-start justify-center px-[16px] py-[8px] relative rounded-[6px] shrink-0 w-[116px]" data-name="Action Button">
        <div aria-hidden="true" className="absolute border border-[#cdd7e1] border-solid inset-0 pointer-events-none rounded-[6px]" />
        <div className="flex flex-col font-['Geist:Medium',sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[#18181b] text-[14px] whitespace-nowrap">
          <p className="leading-[20px]">Browse Files</p>
        </div>
      </div>
    </div>
  );
}

function UploadFilesContainer() {
  return (
    <div className="absolute contents left-0 top-0" data-name="Upload Files Container">
      <UploadFiles />
    </div>
  );
}

function StatusAndFileSizeInfo() {
  return (
    <div className="absolute content-stretch flex font-['Geist:Regular',sans-serif] font-normal items-center justify-between leading-[0] left-0 text-[14px] top-[145px] w-[522px] whitespace-nowrap" data-name="Status and file size info">
      <div className="flex flex-col justify-center relative shrink-0 text-[#18181b]">
        <p>
          <span className="leading-[14px]">{`Status: `}</span>
          <span className="leading-[14px] text-[#00bc06]">2 files uploaded</span>
        </p>
      </div>
      <div className="flex flex-col justify-center relative shrink-0 text-[rgba(9,9,11,0.6)]">
        <p className="leading-[14px]">Max size 5MB per document</p>
      </div>
    </div>
  );
}

function Frame() {
  return (
    <div className="absolute aspect-[24/24] left-[2.68%] overflow-clip right-[91.19%] top-[185px]" data-name="Frame">
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
    <div className="absolute contents left-0 top-[171px]" data-name="File Item">
      <div className="absolute bg-white border border-[#cdd7e1] border-solid h-[60px] left-0 rounded-[8px] top-[171px] w-[521px]" data-name="Upload Files Background" />
      <Frame />
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal h-[17px] leading-[normal] left-[58px] not-italic text-[#212121] text-[14px] top-[183px] w-[412px] whitespace-pre-wrap">Lance 2026 PDF Map and Analysis.pdf</p>
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal h-[17px] leading-[normal] left-[58px] not-italic text-[#8c8c8c] text-[11px] top-[203px] w-[412px] whitespace-pre-wrap">3.1 - Service Area Reps-Analysis</p>
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal h-[17px] leading-[normal] left-[58px] not-italic text-[#8c8c8c] text-[11px] top-[203px] w-[412px] whitespace-pre-wrap">3.1 - Service Area Reps-Analysis • 2.5MB</p>
      <div className="absolute bg-white left-[483px] overflow-clip size-[20px] top-[191px]" data-name="Due Date Icon">
        <div className="absolute inset-[4.17%_8.33%]" data-name="Icon">
          <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16.6667 18.3333">
            <path clipRule="evenodd" d={svgPaths.pc7d1a80} fill="var(--fill-0, #18181b)" fillRule="evenodd" id="Icon" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Frame1() {
  return (
    <div className="absolute left-[14px] size-[32px] top-[257px]" data-name="Frame">
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
    <div className="absolute contents left-0 top-[243px]" data-name="File Item">
      <div className="absolute bg-white border border-[#cdd7e1] border-solid h-[60px] left-0 rounded-[8px] top-[243px] w-[521px]" data-name="Upload Files Background" />
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal h-[17px] leading-[normal] left-[58px] not-italic text-[#212121] text-[14px] top-[255px] w-[412px] whitespace-pre-wrap">Lance 2026 PDF Map and Analysis.pdf</p>
      <Frame1 />
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal h-[17px] leading-[normal] left-[58px] not-italic text-[#8c8c8c] text-[11px] top-[275px] w-[412px] whitespace-pre-wrap">3.1 - Service Area Reps-Analysis</p>
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal h-[17px] leading-[normal] left-[58px] not-italic text-[#8c8c8c] text-[11px] top-[275px] w-[412px] whitespace-pre-wrap">3.1 - Service Area Reps-Analysis • 2.5MB</p>
      <div className="absolute bg-white left-[483px] overflow-clip size-[20px] top-[263px]" data-name="Due Date Icon">
        <div className="absolute inset-[4.17%_8.33%]" data-name="Icon">
          <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16.6667 18.3333">
            <path clipRule="evenodd" d={svgPaths.pc7d1a80} fill="var(--fill-0, #18181b)" fillRule="evenodd" id="Icon" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function NavigationButtons() {
  return (
    <div className="absolute content-stretch flex items-start justify-between left-0 top-[315px] w-[521px]" data-name="Navigation buttons">
      <div className="bg-white content-stretch flex gap-[8px] h-[40px] items-center px-[16px] py-[8px] relative rounded-[6px] shrink-0" data-name="Action Button">
        <div aria-hidden="true" className="absolute border border-[#cdd7e1] border-solid inset-0 pointer-events-none rounded-[6px]" />
        <div className="flex flex-col font-['Geist:Medium',sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[#18181b] text-[14px] whitespace-nowrap">
          <p className="leading-[20px]">Back</p>
        </div>
      </div>
      <div className="bg-[#0e172a] content-stretch flex gap-[8px] h-[40px] items-center px-[16px] py-[8px] relative rounded-[6px] shrink-0" data-name="Action Button">
        <div className="flex flex-col font-['Geist:Medium',sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[14px] text-white whitespace-nowrap">
          <p className="leading-[20px]">Next</p>
        </div>
      </div>
    </div>
  );
}

export default function Frame2() {
  return (
    <div className="relative size-full">
      <UploadFilesContainer />
      <StatusAndFileSizeInfo />
      <FileItem />
      <FileItem1 />
      <NavigationButtons />
    </div>
  );
}