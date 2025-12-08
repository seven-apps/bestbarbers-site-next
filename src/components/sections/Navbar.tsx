"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { homeContent } from "@/content/home";

interface NavbarProps {
  onCtaClick?: () => void;
}
export function Navbar({ onCtaClick }: NavbarProps) {
  const { navbar } = homeContent;

  return (
    <nav className="section-dark fixed top-0 left-0 right-0 z-fixed py-3 md:py-4 z-50">
      <div className="container-custom flex justify-between items-center min-h-[60px] md:h-navbar">
        <Link href="/" className="flex-shrink-0">
          <Image
            src={navbar.logo.src}
            alt={navbar.logo.alt}
            width={navbar.logo.width}
            height={navbar.logo.height}
            className="w-[120px] md:w-[140px] h-auto"
            priority
          />
        </Link>

        <div className="hidden md:flex items-center space-x-0">
          {onCtaClick ? (
            <Button
              onClick={onCtaClick}
              className="btn-primary text-xs font-bold leading-tight px-6 py-3 rounded-2xl transition-colors hover:bg-primary-hover"
              style={{ backgroundColor: "#ffaf02", color: "#121212" }}
            >
              {navbar.buttons.primary.text}
            </Button>
          ) : (
            <Button
              asChild
              className="btn-primary text-xs font-bold leading-tight px-6 py-3 rounded-2xl transition-colors hover:bg-primary-hover"
              style={{ backgroundColor: "#ffaf02", color: "#121212" }}
            >
              <Link
                href={navbar.buttons.primary.href}
                target="_blank"
                rel="noopener noreferrer"
              >
                {navbar.buttons.primary.text}
              </Link>
            </Button>
          )}

          {/* <Button
            asChild
            variant="outline"
            className="btn-ghost text-xs font-bold leading-tight px-6 py-3 rounded-2xl border-white text-white bg-transparent hover:bg-white hover:text-neutral-bg2 transition-all ml-3"
          >
            <Link
              href={navbar.buttons.secondary.href}
              target="_blank"
              rel="noopener noreferrer"
            >
              {navbar.buttons.secondary.text}
            </Link>
          </Button> */}
        </div>

        {/* Mobile menu button */}
        <div className="md:hidden">
          {onCtaClick ? (
            <Button
              onClick={onCtaClick}
              className="btn-primary text-xs font-bold leading-tight px-3 py-2 rounded-xl"
              style={{ backgroundColor: "#ffaf02", color: "#121212" }}
            >
              {navbar.buttons.primary.text}
            </Button>
          ) : (
            <Button
              asChild
              className="btn-primary text-xs font-bold leading-tight px-3 py-2 rounded-xl"
              style={{ backgroundColor: "#ffaf02", color: "#121212" }}
            >
              <Link
                href={navbar.buttons.primary.href}
                target="_blank"
                rel="noopener noreferrer"
              >
                {navbar.buttons.primary.text}
              </Link>
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
}
