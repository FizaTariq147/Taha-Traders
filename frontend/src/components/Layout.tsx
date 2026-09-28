import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { Footer } from './Footer';
import { LocalBusinessJsonLd } from './LocalBusinessJsonLd';

export function Layout() {
  return (
    <div className="flex min-h-screen flex-col">
      <LocalBusinessJsonLd />
      <Header />
      <div className="flex-1">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
}
