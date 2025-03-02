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

interface User {
  name: string;
  [key: string]: any;
}

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
              src="/placeholder.svg?height=40&width=40"
              alt="Logo"
              width={40}
              height={40}
              className="rounded-md"
            />
            <h1 className="text-xl font-bold">Gram Panchayat Portal</h1>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link
              href="#features"
              className="text-sm font-medium hover:text-primary transition-colors"
            >
              Features
            </Link>
            <Link
              href="#about"
              className="text-sm font-medium hover:text-primary transition-colors"
            >
              About
            </Link>
            <Link
              href="#contact"
              className="text-sm font-medium hover:text-primary transition-colors"
            >
              Contact
            </Link>
            {user ? (
              <Button asChild>
                <Link href="/dashboard">
                  Go to Dashboard
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            ) : (
              <Button asChild>
                <Link href="/signin">
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
              <Link
                href="#features"
                className="text-sm font-medium p-2 hover:bg-muted rounded-md"
                onClick={() => setIsMenuOpen(false)}
              >
                Features
              </Link>
              <Link
                href="#about"
                className="text-sm font-medium p-2 hover:bg-muted rounded-md"
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </Link>
              <Link
                href="#contact"
                className="text-sm font-medium p-2 hover:bg-muted rounded-md"
                onClick={() => setIsMenuOpen(false)}
              >
                Contact
              </Link>
              {user ? (
                <Button asChild className="w-full">
                  <Link href="/dashboard">
                    Go to Dashboard
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              ) : (
                <Button asChild className="w-full">
                  <Link href="/signin">
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
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
                Modern Governance for Rural Development
              </h1>
              <p className="text-lg text-muted-foreground">
                Streamline administrative processes, enhance transparency, and
                empower your community with our comprehensive Gram Panchayat
                management solution.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                {user ? (
                  <Button size="lg" asChild>
                    <Link href="/dashboard">
                      Access Dashboard
                      <ChevronRight className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                ) : (
                  <Button size="lg" asChild>
                    <Link href="/signin">
                      Get Started
                      <ChevronRight className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                )}
                <Button size="lg" variant="outline" asChild>
                  <Link href="#features">Learn More</Link>
                </Button>
              </div>
              {user && (
                <p className="text-sm font-medium text-muted-foreground">
                  Welcome back, {user.name}!
                </p>
              )}
            </div>
            <div className="relative h-[300px] md:h-[400px] rounded-lg overflow-hidden shadow-xl">
              <Image
                src="/placeholder.svg?height=400&width=600"
                alt="Gram Panchayat Portal"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Comprehensive Features</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our platform offers a wide range of tools designed specifically
              for Gram Panchayat administration and community development.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white p-6 rounded-lg border shadow-sm hover:shadow-md transition-shadow">
              <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Citizen Management</h3>
              <p className="text-muted-foreground">
                Maintain comprehensive records of all citizens with easy search
                and update capabilities.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg border shadow-sm hover:shadow-md transition-shadow">
              <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <FileText className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">
                Document Management
              </h3>
              <p className="text-muted-foreground">
                Digitize and organize all important documents with secure access
                controls.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg border shadow-sm hover:shadow-md transition-shadow">
              <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <BarChart3 className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Financial Tracking</h3>
              <p className="text-muted-foreground">
                Monitor budgets, expenses, and revenue with detailed reporting
                and analytics.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg border shadow-sm hover:shadow-md transition-shadow">
              <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Calendar className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Event Planning</h3>
              <p className="text-muted-foreground">
                Schedule and manage community events, meetings, and important
                dates.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="relative h-[300px] md:h-[400px] rounded-lg overflow-hidden shadow-xl">
              <Image
                src="/placeholder.svg?height=400&width=600"
                alt="About Gram Panchayat Portal"
                fill
                className="object-cover"
              />
            </div>
            <div className="space-y-6">
              <h2 className="text-3xl font-bold">
                Empowering Rural Governance
              </h2>
              <p className="text-muted-foreground">
                Our platform is designed to address the unique challenges faced
                by Gram Panchayats in managing administrative tasks, community
                engagement, and development projects.
              </p>
              <p className="text-muted-foreground">
                With a focus on simplicity, transparency, and efficiency, we aim
                to strengthen local governance and accelerate rural development
                through technology.
              </p>
              <Button variant="outline" asChild>
                <Link href="#contact">Contact Us</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section
        id="contact"
        className="py-20 bg-primary text-primary-foreground"
      >
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Transform Your Gram Panchayat?
          </h2>
          <p className="max-w-2xl mx-auto mb-8">
            Join hundreds of Gram Panchayats that have already modernized their
            administration with our platform.
          </p>
          {user ? (
            <Button size="lg" variant="secondary" asChild>
              <Link href="/dashboard">
                Go to Your Dashboard
                <ChevronRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          ) : (
            <Button size="lg" variant="secondary" asChild>
              <Link href="/signin">
                Get Started Today
                <ChevronRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-muted py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Image
                  src="/placeholder.svg?height=32&width=32"
                  alt="Logo"
                  width={32}
                  height={32}
                  className="rounded-md"
                />
                <h3 className="font-bold">Gram Panchayat Portal</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Modern solutions for rural governance and community development.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="#features"
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    Features
                  </Link>
                </li>
                <li>
                  <Link
                    href="#about"
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    About
                  </Link>
                </li>
                <li>
                  <Link
                    href="#contact"
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    Contact
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Resources</h4>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="#"
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    Documentation
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    Privacy Policy
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Contact</h4>
              <address className="not-italic text-sm text-muted-foreground">
                <p>Email: info@grampanchayatportal.com</p>
                <p>Phone: +91 1234567890</p>
                <p>Address: Tech Hub, Rural Innovation Center</p>
              </address>
            </div>
          </div>

          <div className="border-t mt-12 pt-6 text-center text-sm text-muted-foreground">
            <p>
              &copy; {new Date().getFullYear()} Gram Panchayat Portal. All
              rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
