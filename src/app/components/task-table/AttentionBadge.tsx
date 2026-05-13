import { memo } from 'react';
import NoSim from '../../../imports/NoSim';
import svgPaths from '../../../imports/svg-82opxwp0w8';
import type { Task } from './types';

export const AttentionBadge = memo(({ attention }: { attention: Task['attention'] }) => {
  if (!attention) return null;
  return (
    <div className="flex items-center gap-1">
      <div className="relative shrink-0 size-[20px]">
        {attention.type === 'missing' ? (
          <NoSim />
        ) : (
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
            <path d={svgPaths.p183b5840} fill="#8745AE" />
          </svg>
        )}
      </div>
      <span
        className="font-['Inter:Medium',sans-serif] font-medium text-[12px]"
        style={{ color: attention.type === 'needs' ? '#8745AE' : '#DC2626' }}
      >
        {attention.count} {attention.type === 'needs' ? 'Needs Attention' : 'Missing Files'}
      </span>
    </div>
  );
});
AttentionBadge.displayName = 'AttentionBadge';
