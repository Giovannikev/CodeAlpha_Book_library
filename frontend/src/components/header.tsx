'use client';

import { Menu, Book } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
} from '@/components/ui/sheet';
import { useState } from 'react';
import { ModeToggle } from './themeToggle';

const navLink = [
  { href: '/books', label: 'Books' },
  { href: '/borrowed', label: 'My borrowed books' },
];

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `text-sm font-medium transition-colors ${
      isActive
        ? 'text-primary underline underline-offset-4'
        : 'text-muted-foreground hover:text-primary'
    }`;

  const mobileNavLinkClass = ({ isActive }: { isActive: boolean }) =>
    `block py-3 text-base font-medium transition-colors ${
      isActive
        ? 'text-primary underline underline-offset-4'
        : 'text-muted-foreground hover:text-primary'
    }`;

  return (
    <header className="bg-white dark:bg-[rgb(24,22,33)] rounded-2xl shadow-md m-2">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <NavLink
          to="/"
          className="flex items-center gap-2 font-semibold text-gray-900 dark:text-gray-50"
        >
          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <Book className="size-4" />
          </div>
          <span className="hidden sm:inline">Book Library</span>
          <span className="sm:hidden">Book Library</span>
        </NavLink>

        <nav className="hidden md:block">
          <ul className="hidden sm:flex space-x-6">
            {navLink.map((link) => (
              <li key={link.href}>
                <NavLink to={link.href} className={navLinkClass}>
                  {link.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <ModeToggle />

          <NavLink to="/books" className="hidden sm:block">
            <Button>Borrow a book !</Button>
          </NavLink>

          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon" aria-label="Menu">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[80%] sm:w-[350px] p-2">
              <div className="flex flex-col h-full">
                <div className="flex justify-between items-center mb-6">
                  <NavLink
                    to="/"
                    className="flex items-center gap-2 font-semibold"
                    onClick={() => setIsOpen(false)}
                  >
                    <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
                      <Book className="size-4" />
                    </div>
                    <span className="hidden sm:inline">Books Database.</span>
                    <span className="sm:hidden">Books DB</span>
                  </NavLink>
                  <SheetClose asChild className="cursor-pointer" />
                </div>

                <nav className="flex-1">
                  <ul className="space-y-2">
                    {navLink.map((link) => (
                      <li
                        key={link.href}
                        className="px-2 m-2 hover:bg-gray-400 rounded-sm"
                      >
                        <NavLink
                          to={link.href}
                          className={mobileNavLinkClass}
                          onClick={() => setIsOpen(false)}
                        >
                          {link.label}
                        </NavLink>
                      </li>
                    ))}
                  </ul>
                </nav>

                <div className="mt-auto pt-6 border-t">
                  <NavLink to="/books" onClick={() => setIsOpen(false)}>
                    <Button className="w-full">Borrow a book !</Button>
                  </NavLink>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
