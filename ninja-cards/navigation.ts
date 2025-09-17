// nav.ts
import {createNavigation} from 'next-intl/navigation';
import {routing} from './config';

export const { Link, getPathname, redirect, usePathname, useRouter } =
  createNavigation(routing);

// ✅ Export a strongly-typed Href based on your routing
export type Href = Parameters<typeof getPathname>[0]['href'];
