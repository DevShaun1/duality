import { Outlet } from 'react-router';
import TopNavigation from './TopNavigation';

export default function AppLayout() {
    return (
        <>
          <TopNavigation />

          <main>
            <Outlet />
          </main>
        </>
      );
}