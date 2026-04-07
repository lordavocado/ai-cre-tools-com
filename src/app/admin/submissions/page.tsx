import { requireAdminPageAuth } from '@/lib/admin-auth';
import SubmissionsDashboard from './submissions-dashboard';

export default async function AdminSubmissionsPage() {
  await requireAdminPageAuth('/admin/submissions');

  return <SubmissionsDashboard />;
}
