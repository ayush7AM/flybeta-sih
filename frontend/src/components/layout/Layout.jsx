import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

export default function Layout() {
  return (
    <div className="min-h-screen grid-bg">
      <Navbar />
      <main className="max-w-[1440px] mx-auto px-4 md:px-12 pt-28 pb-16">
        <Outlet />
      </main>
    </div>
  );
}
