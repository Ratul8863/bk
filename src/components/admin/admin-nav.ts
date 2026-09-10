import type { LucideIcon } from 'lucide-react';
import {
  Activity,
  BookOpen,
  Briefcase,
  Calendar,
  Camera,
  Compass,
  FileText,
  FolderOpen,
  Home,
  Image,
  LayoutDashboard,
  LayoutTemplate,
  Link2,
  Mail,
  Megaphone,
  Menu,
  Newspaper,
  PanelBottom,
  Settings,
  Share2,
  Shield,
  Users,
  FlaskConical,
} from 'lucide-react';

export interface AdminNavItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

export interface AdminNavGroup {
  label: string;
  items: AdminNavItem[];
}

export const adminNavGroups: AdminNavGroup[] = [
  {
    label: 'Overview',
    items: [{ label: 'Dashboard', href: '/admin', icon: LayoutDashboard }],
  },
  {
    label: 'Content',
    items: [
      { label: 'Pages', href: '/admin/pages', icon: FileText },
      { label: 'Homepage', href: '/admin/homepage', icon: Home },
      { label: 'Research', href: '/admin/research', icon: FlaskConical },
      { label: 'Publications', href: '/admin/publications', icon: BookOpen },
      { label: 'News', href: '/admin/news', icon: Newspaper },
      { label: 'Events', href: '/admin/events', icon: Calendar },
      { label: 'Notices', href: '/admin/notices', icon: Megaphone },
      { label: 'Activities', href: '/admin/activities', icon: Activity },
      { label: 'Resources', href: '/admin/resources', icon: FolderOpen },
      { label: 'Gallery', href: '/admin/gallery', icon: Camera },
    ],
  },
  {
    label: 'People',
    items: [{ label: 'All People', href: '/admin/people', icon: Users }],
  },
  {
    label: 'Organization',
    items: [
      { label: 'Research Areas', href: '/admin/research-areas', icon: Compass },
      { label: 'Policies / Pages', href: '/admin/pages', icon: Briefcase },
    ],
  },
  {
    label: 'Media',
    items: [{ label: 'Media Library', href: '/admin/media', icon: Image }],
  },
  {
    label: 'Appearance',
    items: [
      { label: 'Navigation', href: '/admin/navigation', icon: Menu },
      { label: 'Footer', href: '/admin/navigation?tab=footer', icon: PanelBottom },
      { label: 'Homepage Sections', href: '/admin/homepage?tab=sections', icon: LayoutTemplate },
      { label: 'Site Settings', href: '/admin/settings', icon: Settings },
    ],
  },
  {
    label: 'Communication',
    items: [
      { label: 'Contact Info', href: '/admin/contact', icon: Mail },
      { label: 'Social', href: '/admin/social', icon: Share2 },
    ],
  },
  {
    label: 'SEO',
    items: [{ label: 'Defaults', href: '/admin/seo', icon: Link2 }],
  },
  {
    label: 'System',
    items: [{ label: 'CMS Settings', href: '/admin/system', icon: Shield }],
  },
];
