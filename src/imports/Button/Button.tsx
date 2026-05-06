import svgPaths from "./svg-itt5jgyi6c";
import { imgVector } from "./svg-inu87";

function Group() {
  return (
    <div className="absolute contents inset-[4.14%_4.17%_4.19%_4.17%]" data-name="Group">
      <div className="absolute inset-[4.14%_4.17%_4.19%_4.17%] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-0.833px_-0.829px] mask-size-[20px_20px]" style={{ maskImage: `url('${imgVector}')` }} data-name="Vector">
        <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18.3334 18.3333">
          <path clipRule="evenodd" d={svgPaths.p3b077500} fill="var(--fill-0, #18181B)" fillRule="evenodd" id="Vector" />
        </svg>
      </div>
    </div>
  );
}

function ClipPathGroup() {
  return (
    <div className="absolute contents inset-0" data-name="Clip path group">
      <Group />
    </div>
  );
}

function Svg() {
  return (
    <div className="h-[20px] overflow-clip relative shrink-0 w-full" data-name="svg">
      <ClipPathGroup />
    </div>
  );
}

export default function Button() {
  return (
    <div className="content-stretch flex flex-col items-start relative size-full" data-name="button">
      <Svg />
    </div>
  );
}