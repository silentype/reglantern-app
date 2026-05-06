import svgPaths from "./svg-i4sj883k7b";

function ChevronDown() {
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
      <ChevronDown />
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
      <div className="flex flex-col font-['Geist:Medium',sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[#fc6] text-[14px] whitespace-nowrap">
        <p className="leading-[20px]">Tasks</p>
      </div>
    </div>
  );
}

function NavigationMenuItem2() {
  return (
    <div className="content-stretch flex items-center justify-center relative rounded-[6px] shrink-0" data-name="Navigation Menu Item">
      <div className="flex flex-col font-['Geist:Medium',sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[#f4f4f5] text-[14px] whitespace-nowrap">
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

function NavigationMenu1() {
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

function NavigationMenu() {
  return (
    <div className="content-stretch flex gap-[50px] items-center relative shrink-0 w-[972px]" data-name="Navigation Menu">
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
      <div className="flex items-center justify-center relative shrink-0 size-[16px]" style={{ "--transform-inner-width": "1200", "--transform-inner-height": "18.875" } as React.CSSProperties}>
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

export default function TopBar() {
  return (
    <div className="bg-[#32383e] content-stretch flex items-center justify-between p-[20px] relative size-full" data-name="Top Bar">
      <NavigationMenu />
      <div className="flex flex-row items-center self-stretch">
        <Logo />
      </div>
    </div>
  );
}