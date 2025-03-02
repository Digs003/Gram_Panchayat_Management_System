"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ChevronRight,
  Users,
  FileText,
  BarChart3,
  Calendar,
  Menu,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { signOut } from "next-auth/react";

interface User {
  name: string;
  [key: string]: any;
}

const handleSignOut = async () => {
  await signOut({ callbackUrl: "/api/auth/signin" });
};

export default function LandingPage({ user }: { user: User | null }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header
        className={`sticky top-0 z-50 w-full transition-all duration-200 ${
          isScrolled ? "bg-white shadow-sm" : "bg-transparent"
        }`}
      >
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Image
              src="/logo.png"
              alt="Logo"
              width={40}
              height={40}
              className="rounded-md"
            />
            <h1 className="text-xl font-bold">Gram Panchayat Portal</h1>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {user ? (
              <Button onClick={handleSignOut}>Sign Out</Button>
            ) : (
              <Button asChild>
                <Link href="/api/auth/signin">
                  Sign In
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-md hover:bg-muted"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t">
            <div className="container mx-auto px-4 py-4 flex flex-col space-y-4">
              {user ? (
                <Button className="w-full" onClick={handleSignOut}>
                  Sign Out
                </Button>
              ) : (
                <Button asChild className="w-full">
                  <Link href="/api/auth/signin">
                    Sign In
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="relative py-20 md:py-32 bg-gradient-to-b from-blue-50 to-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-12 items-center">
            <div className="space-y-6">
              <h1 className="text-xl md:text-3xl font-bold tracking-tight">
                Modern Governance for Rural Development
              </h1>
              <p className="text-muted-foreground">
                Streamline administrative processes, enhance transparency, and
                empower your community with our comprehensive Gram Panchayat
                management solution.
              </p>
              <div className="flex flex-col  sm:flex-row gap-4">
                {user ? (
                  <Button size="lg" asChild>
                    <Link
                      href={
                        user.occupation === "System Administrator"
                          ? "/admin/dashboard"
                          : user.occupation === "Panchayat Employee"
                          ? "/employee/dashboard"
                          : user.occupation === "Government Monitor"
                          ? "/monitor/dashboard"
                          : "/citizen/dashboard"
                      }
                    >
                      Access Dashboard
                      <ChevronRight className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                ) : (
                  <Button size="lg" asChild>
                    <Link href="/api/auth/signin">
                      Get Started
                      <ChevronRight className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                )}
                {user && (
                  <Button size="lg" variant="outline" asChild>
                    <Link href="/citizen/dashboard">Citizen Dashboard</Link>
                  </Button>
                )}
              </div>
              {user && (
                <p className="text-sm font-medium text-muted-foreground">
                  Welcome back, {user.name}!
                </p>
              )}
            </div>
            <div className="relative h-[300px] md:h-[480px] rounded-lg overflow-hidden shadow-xl transition-opacity duration-300 hover:opacity-100 opacity-60 col-span-2">
              <Image
                src="/GPMS_banner.png"
                alt="Gram Panchayat Portal"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
