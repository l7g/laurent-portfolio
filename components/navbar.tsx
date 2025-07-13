"use client";

import {
  Navbar as HeroUINavbar,
  NavbarContent,
  NavbarMenu,
  NavbarMenuToggle,
  NavbarBrand,
  NavbarItem,
  NavbarMenuItem,
} from "@heroui/navbar";
import { Link } from "@heroui/link";
import { link as linkStyles } from "@heroui/theme";
import NextLink from "next/link";
import clsx from "clsx";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

import { siteConfig } from "@/config/site";
import { ThemeSwitch } from "@/components/theme-switch";
import { GithubIcon, Logo } from "@/components/icons";
import { useEducationVisibility } from "@/lib/use-education-visibility";

export const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const [mounted, setMounted] = useState(false);
  const currentPath = usePathname();
  const { isEducationVisible, isLoading: visibilityLoading } =
    useEducationVisibility();

  // Ensure component is mounted before doing any filtering
  useEffect(() => {
    setMounted(true);
  }, []);

  // Create navigation items that exclude education by default, only show when explicitly enabled
  const getFilteredNavItems = () => {
    return siteConfig.navItems.filter((item) => {
      // Only show Education when explicitly enabled and not loading
      if (item.href === "/education") {
        return mounted && !visibilityLoading && isEducationVisible;
      }
      return true;
    });
  };

  const getFilteredNavMenuItems = () => {
    return siteConfig.navMenuItems.filter((item) => {
      // Only show Education when explicitly enabled and not loading
      if (item.href === "/education") {
        return mounted && !visibilityLoading && isEducationVisible;
      }
      return true;
    });
  };

  const filteredNavItems = getFilteredNavItems();
  const filteredNavMenuItems = getFilteredNavMenuItems();

  useEffect(() => {
    // Only track scroll sections on homepage
    if (currentPath !== "/") return;

    const handleScroll = () => {
      const sections = [
        "home",
        "about",
        "education-skills",
        "projects",
        "blog",
        "contact",
      ];
      const scrollPosition = window.scrollY + 100;

      for (const section of sections) {
        const element = document.getElementById(
          section === "home" ? "hero" : section,
        );

        if (element) {
          const offsetTop = element.offsetTop;
          const offsetHeight = element.offsetHeight;

          if (
            scrollPosition >= offsetTop &&
            scrollPosition < offsetTop + offsetHeight
          ) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Call once to set initial state

    return () => window.removeEventListener("scroll", handleScroll);
  }, [currentPath]);

  const handleLinkClick = () => {
    setIsMenuOpen(false);
  };

  const isLinkActive = (href: string) => {
    // Handle homepage section links
    if (href.startsWith("#")) {
      if (currentPath !== "/") return false;
      const section = href.replace("#", "");

      return activeSection === section;
    }

    // Handle homepage exact match
    if (href === "/") return currentPath === "/";

    // Handle page routes (including sub-routes)
    // This will highlight "Blog" for /blog, /blog/some-post, /blog/category/tech, etc.
    return currentPath.startsWith(href) && href !== "/";
  };

  return (
    <HeroUINavbar
      isMenuOpen={isMenuOpen}
      maxWidth="xl"
      position="sticky"
      onMenuOpenChange={setIsMenuOpen}
    >
      <NavbarContent className="basis-1/5 sm:basis-full" justify="start">
        <NavbarBrand as="li" className="gap-3 max-w-fit">
          <NextLink className="flex justify-start items-center gap-1" href="/">
            <Logo />
            <p className="font-bold text-inherit">{siteConfig.name}</p>
          </NextLink>
        </NavbarBrand>{" "}
        <ul className="hidden lg:flex gap-4 justify-start ml-2">
          {filteredNavItems.map((item) => (
            <NavbarItem key={item.href}>
              <NextLink
                className={clsx(
                  linkStyles({ color: "foreground" }),
                  "data-[active=true]:text-primary data-[active=true]:font-medium",
                  isLinkActive(item.href) && "text-primary font-medium",
                )}
                color="foreground"
                href={item.href}
                onClick={handleLinkClick}
              >
                {item.label}
              </NextLink>
            </NavbarItem>
          ))}
        </ul>
      </NavbarContent>
      <NavbarContent
        className="hidden sm:flex basis-1/5 sm:basis-full"
        justify="end"
      >
        <NavbarItem className="hidden sm:flex gap-2">
          <Link isExternal aria-label="Github" href={siteConfig.links.github}>
            <GithubIcon className="text-default-500 w-5 h-5" />
          </Link>
          <ThemeSwitch />
        </NavbarItem>
      </NavbarContent>
      <NavbarContent className="sm:hidden basis-1 pl-4" justify="end">
        <Link isExternal aria-label="Github" href={siteConfig.links.github}>
          <GithubIcon className="text-default-500 w-5 h-5" />
        </Link>
        <ThemeSwitch />
        <NavbarMenuToggle />
      </NavbarContent>{" "}
      <NavbarMenu>
        <div className="mx-4 mt-2 flex flex-col gap-2">
          {filteredNavMenuItems.map((item, index) => (
            <NavbarMenuItem key={`${item}-${index}`}>
              <Link
                color={
                  isLinkActive(item.href)
                    ? "primary"
                    : index === filteredNavMenuItems.length - 1
                      ? "danger"
                      : "foreground"
                }
                href={item.href}
                isExternal={item.href.startsWith("/Laurent_Cv.pdf")}
                size="lg"
                onClick={handleLinkClick}
              >
                {item.label}
              </Link>
            </NavbarMenuItem>
          ))}
        </div>
      </NavbarMenu>
    </HeroUINavbar>
  );
};
