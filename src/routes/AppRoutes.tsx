import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { PublicLayout } from '@/components/layout/PublicLayout';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { AdminMatchManagementView } from '@/pages/admin/AdminMatchManagementView';
import { AdminRosterView } from '@/pages/admin/AdminRosterView';
import { AdminDashboardView } from '@/pages/admin/AdminDashboardView';
import { PublicHomeView } from '@/pages/public/PublicHomeView';
import { LoginView } from '@/pages/auth/LoginView';
import { PublicLeaderboardView } from '@/pages/public/PublicLeaderboardView';
import { PublicPlayersView } from '@/pages/public/PublicPlayersView';
import { PublicMatchesView } from '@/pages/public/PublicMatchesView';
import { PublicCourtsView } from '@/pages/public/PublicCourtsView';
import { PublicPlayerProfileView } from '@/pages/public/PublicPlayerProfileView';

import { ScrollToTop } from '@/lib/ScrollToTop';




// ==========================================
// Admin Placeholders
// ==========================================

function AdminAuditLogView() {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-black">Moderator Audit Log</h2>
      <div className="p-8 bg-card rounded-2xl border border-border/60 text-center text-muted-foreground">
        History Feed of Admin Activity & Modifications Placeholder
      </div>
    </div>
  );
}

function AdminSettingsView() {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-black">Group Settings</h2>
      <div className="p-8 bg-card rounded-2xl border border-border/60 text-center text-muted-foreground">
        Match Rules & Group Configuration Placeholder
      </div>
    </div>
  );
}

// ==========================================
// App Routes
// ==========================================

export function AppRoutes() {
  return (
    <BrowserRouter>
      <ScrollToTop/>
      <Routes>
        {/* Public Shared Layout */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<PublicHomeView />} />
          <Route path="/leaderboard" element={<PublicLeaderboardView />} />
          <Route path="/players" element={<PublicPlayersView />} />
          <Route path="/matches" element={<PublicMatchesView />} />
          <Route path="/courts" element={<PublicCourtsView />} />
          <Route path="/p/:slug" element={<PublicPlayerProfileView />} />
          <Route path="/admin/login" element={<LoginView />} />
        </Route>

        {/* Admin Shared Layout */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboardView />} />
          <Route path="matches" element={<AdminMatchManagementView />} />
          <Route path="roster" element={<AdminRosterView />} />
          <Route path="audit" element={<AdminAuditLogView />} />
          <Route path="settings" element={<AdminSettingsView />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}