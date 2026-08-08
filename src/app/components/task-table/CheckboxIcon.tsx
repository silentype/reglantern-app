import { memo } from 'react';
import svgPaths from '../../../imports/svg-82opxwp0w8';

export const CheckboxIcon = memo(({ completed }: { completed: boolean }) =>
  completed ? (
    <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
      <g clipPath="url(#clip0_checkbox)">
        <path clipRule="evenodd" d={svgPaths.p372a9b00} fill="#16a34a" fillRule="evenodd" />
      </g>
      <defs>
        <clipPath id="clip0_checkbox">
          <rect fill="white" height="20" width="20" />
        </clipPath>
      </defs>
    </svg>
  ) : (
    <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
      <path d={svgPaths.p34103500} fill="#9ca3af" />
    </svg>
  ),
);
CheckboxIcon.displayName = 'CheckboxIcon';
