"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, Phone } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Logo } from "@/components/layout/logo";
import { Button } from "@/components/ui/button";
import { navItems } from "@/lib/navigation";
import { siteConfig } from "@/lib/seo";
import { cn } from "@/lib/utils";

const headerCtaClassName =
  "bg-[#165FC7] text-white hover:bg-[#124DA3] shadow-sm font-normal";

const menuEase = [0.32, 0.72, 0, 1] as const;

const backdropVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.4, ease: menuEase },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.32, ease: menuEase },
  },
};

const panelVariants = {
  hidden: { x: "100%" },
  visible: {
    x: 0,
    transition: { duration: 0.48, ease: menuEase },
  },
  exit: {
    x: "100%",
    transition: { duration: 0.38, ease: menuEase },
  },
};

const navItemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: (index: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: 0.12 + index * 0.045,
      duration: 0.38,
      ease: menuEase,
    },
  }),
  exit: {
    opacity: 0,
    y: 6,
    transition: { duration: 0.2, ease: menuEase },
  },
};

const footerCtaVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { delay: 0.28, duration: 0.38, ease: menuEase },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.2, ease: menuEase },
  },
};

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 4);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 bg-white transition-shadow duration-300",
          isScrolled && "shadow-[0_4px_16px_rgba(16,18,20,0.08)]"
        )}
        role="banner"
      >
        <div className="container-site">
          <div className="flex h-16 items-center justify-between gap-2 lg:h-[72px] lg:gap-8">
            <Logo
              weight="medium"
              className="min-w-0 flex-1 sm:flex-none sm:w-auto"
            />

            <nav
              className="hidden lg:flex items-center gap-8"
              aria-label="Ana menü"
            >
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="font-text text-[15px] font-normal text-foreground/80 hover:text-foreground transition-colors"
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            <div className="hidden lg:flex items-center gap-4">
              <Button
                variant="default"
                size="default"
                className={headerCtaClassName}
                asChild
              >
                <a
                  href={`tel:${siteConfig.phone}`}
                  aria-label="Telefon ile ara"
                >
                  <Phone className="h-4 w-4" strokeWidth={2} />
                  Hemen Ara
                </a>
              </Button>
            </div>

            <button
              type="button"
              className="flex size-11 shrink-0 items-center justify-center rounded-full bg-[#FFF1EB] transition-colors hover:bg-[#FFE4D6] lg:hidden"
              onClick={() => setIsMobileMenuOpen(true)}
              aria-label="Menüyü aç"
              aria-expanded={isMobileMenuOpen}
            >
              <Menu className="h-5 w-5 text-[#101214]" strokeWidth={2} />
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              key="mobile-menu-backdrop"
              variants={backdropVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-[2px] lg:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
              aria-hidden="true"
            />

            <motion.div
              key="mobile-menu-panel"
              variants={panelVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="fixed top-0 right-0 bottom-0 z-[70] w-full max-w-sm bg-white shadow-2xl lg:hidden"
              role="dialog"
              aria-modal="true"
              aria-label="Mobil menü"
            >
              <div className="flex h-16 items-center justify-between border-b border-border px-6 lg:h-[72px]">
                <Logo weight="medium" layout="stacked" />
                <button
                  type="button"
                  className="flex h-11 w-11 items-center justify-center rounded-full bg-[#F0F4FA] transition-colors hover:bg-[#E3EBF7]"
                  onClick={() => setIsMobileMenuOpen(false)}
                  aria-label="Menüyü kapat"
                >
                  <X className="h-5 w-5 text-[#101214]" strokeWidth={2} />
                </button>
              </div>

              <nav className="flex flex-col p-6 gap-1" aria-label="Mobil menü">
                {navItems.map((item, index) => (
                  <motion.div
                    key={item.href}
                    custom={index}
                    variants={navItemVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                  >
                    <Link
                      href={item.href}
                      className="block py-3 px-4 font-display text-lg font-normal text-foreground hover:bg-secondary rounded-xl transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {item.label}
                    </Link>
                  </motion.div>
                ))}
              </nav>

              <motion.div
                className="absolute bottom-0 left-0 right-0 border-t border-border p-6"
                variants={footerCtaVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                <Button
                  variant="default"
                  size="lg"
                  className={cn("w-full", headerCtaClassName)}
                  asChild
                >
                  <a
                    href={`tel:${siteConfig.phone}`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Phone className="h-4 w-4" strokeWidth={2} />
                    Hemen Ara
                  </a>
                </Button>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
