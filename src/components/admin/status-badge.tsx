import { applicationStatusLabels, type ApplicationStatus } from '@/lib/config/loans';
import { Badge } from '@/components/ui/badge';

const tones: Record<ApplicationStatus, 'neutral' | 'info' | 'warning' | 'success' | 'danger' | 'brand'> = {
  pending: 'neutral',
  under_review: 'info',
  additional_information_required: 'warning',
  approved: 'success',
  rejected: 'danger',
  completed: 'brand',
};

export function StatusBadge({ status }: { status: ApplicationStatus }) {
  return <Badge tone={tones[status]}>{applicationStatusLabels[status]}</Badge>;
}
