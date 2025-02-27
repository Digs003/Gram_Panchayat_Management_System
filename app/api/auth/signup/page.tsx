import Link from "next/link";
import { Building2, Users2, User, LineChart } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function LoginRedirectPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-muted/50">
      <div className="container mx-auto px-4 py-16">
        <div className="mx-auto max-w-4xl space-y-12">
          <div className="space-y-4 text-center">
            <h1 className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-4xl font-bold tracking-tighter text-transparent sm:text-5xl">
              Welcome to Gram Panchayat Portal
            </h1>
            <p className="mx-auto max-w-[600px] text-lg text-muted-foreground">
              Please select your user type to proceed to the appropriate login
              page
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <Link href="/api/auth/signup/admin" className="block">
              <Card className="group relative h-full overflow-hidden border-2 transition-all duration-300 hover:border-primary hover:shadow-lg">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                <CardHeader>
                  <div className="relative mx-auto mb-4 size-16 rounded-full bg-primary/10 p-3 transition-transform duration-300 group-hover:scale-110">
                    <Building2 className="size-full text-primary" />
                  </div>
                  <CardTitle className="text-xl transition-colors group-hover:text-primary">
                    System Administrator
                  </CardTitle>
                  <CardDescription className="text-sm">
                    Portal management and system configuration
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button
                    className="w-full transition-transform duration-300 group-hover:scale-105 bg-indigo-900"
                    variant="default"
                  >
                    Login as Administrator
                  </Button>
                </CardContent>
              </Card>
            </Link>

            <Link href="/api/auth/signup/employee" className="block">
              <Card className="group relative h-full overflow-hidden border-2 transition-all duration-300 hover:border-primary hover:shadow-lg">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                <CardHeader>
                  <div className="relative mx-auto mb-4 size-16 rounded-full bg-primary/10 p-3 transition-transform duration-300 group-hover:scale-110">
                    <Users2 className="size-full text-primary" />
                  </div>
                  <CardTitle className="text-xl transition-colors group-hover:text-primary">
                    Panchayat Employee
                  </CardTitle>
                  <CardDescription className="text-sm">
                    Access panchayat services and administrative tools
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button
                    className="w-full transition-transform duration-300 group-hover:scale-105 bg-indigo-900"
                    variant="default"
                  >
                    Login as Employee
                  </Button>
                </CardContent>
              </Card>
            </Link>

            <Link href="/api/auth/signup/citizen" className="block">
              <Card className="group relative h-full overflow-hidden border-2 transition-all duration-300 hover:border-primary hover:shadow-lg">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                <CardHeader>
                  <div className="relative mx-auto mb-4 size-16 rounded-full bg-primary/10 p-3 transition-transform duration-300 group-hover:scale-110">
                    <User className="size-full text-primary" />
                  </div>
                  <CardTitle className="text-xl transition-colors group-hover:text-primary">
                    Citizen
                  </CardTitle>
                  <CardDescription className="text-sm">
                    Access public services and submit applications
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button
                    className="w-full transition-transform duration-300 group-hover:scale-105 bg-indigo-900"
                    variant="default"
                  >
                    Login as Citizen
                  </Button>
                </CardContent>
              </Card>
            </Link>

            <Link href="/api/auth/signup/monitor" className="block">
              <Card className="group relative h-full overflow-hidden border-2 transition-all duration-300 hover:border-primary hover:shadow-lg">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                <CardHeader>
                  <div className="relative mx-auto mb-4 size-16 rounded-full bg-primary/10 p-3 transition-transform duration-300 group-hover:scale-110">
                    <LineChart className="size-full text-primary" />
                  </div>
                  <CardTitle className="text-xl transition-colors group-hover:text-primary">
                    Government Monitor
                  </CardTitle>
                  <CardDescription className="text-sm">
                    Monitor and analyze panchayat activities
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button
                    className="w-full transition-transform duration-300 group-hover:scale-105 bg-indigo-900"
                    variant="default"
                  >
                    Login as Monitor
                  </Button>
                </CardContent>
              </Card>
            </Link>
          </div>
          <p className="text-sm text-muted-foreground text-center">
            Already have an account?{" "}
            <Link
              href="/api/auth/signin"
              className="text-primary hover:underline font-medium"
            >
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
