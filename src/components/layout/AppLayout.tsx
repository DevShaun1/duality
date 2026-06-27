import { Outlet } from 'react-router';
import TopNavigation from './TopNavigation';
import MobileBottomNavigation from './MobileBottomNavigation';

export default function AppLayout() {
  return (
    <>
      <TopNavigation />

      <main className="pb-24 md:pb-0">
        <Outlet />
      </main>

      <MobileBottomNavigation />
    </>
  );
}
