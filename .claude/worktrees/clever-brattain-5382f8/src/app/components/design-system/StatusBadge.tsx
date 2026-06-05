import { Pill, PillColor } from './Pill';

export type TaskStatus = 'In Progress' | 'Complete' | 'Blocked' | 'Not Started';

const STATUS_TO_COLOR: Record<TaskStatus, PillColor> = {
  'In Progress': 'yellow',
  'Complete': 'green',
  'Blocked': 'red',
  'Not Started': 'neutral',
};

export interface StatusBadgeProps {
  status: TaskStatus | string;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const color = STATUS_TO_COLOR[status as TaskStatus] ?? 'neutral';
  return <Pill color={color}>{status}</Pill>;
}
