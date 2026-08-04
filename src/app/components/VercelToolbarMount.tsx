import { useEffect } from 'react';
import { mountVercelToolbar } from '@vercel/toolbar';

// Reglantern's Vercel project (see .vercel/project.json — these ids are
// non-secret, they're published as data-* attributes on a public script tag).
const VERCEL_OWNER_ID = 'team_XlEjmUNjA5uyqchsG2Bow0C1';
const VERCEL_PROJECT_ID = 'prj_lFphCUU7TWWeDFgUgHM9jAIJ0JRh';

export function VercelToolbarMount() {
  useEffect(() => {
    return mountVercelToolbar({
      ownerId: VERCEL_OWNER_ID,
      projectId: VERCEL_PROJECT_ID,
    });
  }, []);

  return null;
}
