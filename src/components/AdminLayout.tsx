// src/components/AdminLayout.tsx
import { useState, ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";

interface AdminLayoutProps {
  children: ReactNode;
  pageTitle?: string;
}

const menuLinks = [
  { name: "Dashboard", href: "/admin" },
  { name: "Respostas", href: "/admin/respostas" },
  { name: "Ana Gaming", href: "/admin/ana-gaming" },
  { name: "Black Sheep", href: "/admin/black-sheep" },
];

export const AdminLayout = ({ children, pageTitle }: AdminLayoutProps) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Sidebar Desktop */}
      <aside className="hidden md:flex md:flex-col w-64 bg-gray-900 text-white p-6 space-y-6">
        <h1 className="text-2xl font-bold">Admin</h1>
        <ul className="flex flex-col space-y-4 mt-4">
          {menuLinks.map((link) => (
            <li key={link.name}>
              <a href={link.href} className="hover:text-blue-400">
                {link.name}
              </a>
            </li>
          ))}
        </ul>
      </aside>

      {/* Mobile Navbar */}
      <nav className="md:hidden bg-gray-900 text-white flex items-center justify-between px-4 py-3 w-full">
        <h1 className="text-xl font-bold">Admin</h1>
        <Button variant="ghost" onClick={() => setMobileMenuOpen(true)}>
          <Menu size={24} />
        </Button>
      </nav>

      {/* Mobile Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-gray-800 shadow-xl transform transition-transform duration-300 z-50 ${
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex justify-end p-4">
          <Button variant="ghost" onClick={() => setMobileMenuOpen(false)}>
            <X size={24} />
          </Button>
        </div>
        <ul className="flex flex-col mt-4 space-y-4 px-6">
          {menuLinks.map((link) => (
            <li key={link.name}>
              <a
                href={link.href}
                className="block text-white hover:text-blue-400"
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.name}
              </a>
            </li>
          ))}
        </ul>
      </div>

      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300 ${
          mobileMenuOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setMobileMenuOpen(false)}
      />

      {/* Conteúdo */}
      <main className="flex-1 p-6 space-y-6">
        {pageTitle && (
          <h2 className="text-3xl font-bold gradient-primary bg-clip-text text-transparent">
            {pageTitle}
          </h2>
        )}
        {children}
      </main>
    </div>
  );
};
