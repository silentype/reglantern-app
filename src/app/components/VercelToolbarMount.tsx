import { useEffect } from 'react';
import { mountVercelToolbar } from '@vercel/toolbar';

// Reglantern's Vercel project (tim-silentypecos-projects/reglantern-app —
// these ids are non-secret, they're published as data-* attributes on a
// public script tag). Confirmed against the Vercel dashboard's Project ID,
// not the stale id in the local .vercel/project.json link.
const VERCEL_OWNER_ID = 'team_XlEjmUNjA5uyqchsG2Bow0C1';
const VERCEL_PROJECT_ID = 'prj_LR6u7BNmgvOAnu0pBivbCGbmRhDb';

export function VercelToolbarMount() {
  useEffect(() => {
    return mountVercelToolbar({
      ownerId: VERCEL_OWNER_ID,
      projectId: VERCEL_PROJECT_ID,
    });
  }, []);

  return null;
}
