"use client";

import Link from "next/link";
import { Building2 } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    console.log("Email:", email);
    console.log("Password:", password);
    const res = await signIn("credentials", {
      password,
      email,
      redirect: false,
    });

    if (res?.error) {
      alert("Enter Correct information");
    } else {
      router.push("/");
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#f5f3f0] flex items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <form onSubmit={handleSubmit}>
          <CardHeader className="space-y-3 text-center">
            <div className="flex justify-center">
              <Building2 className="h-12 w-12 text-primary" />
            </div>
            <CardTitle className="text-2xl font-bold text-primary">
              Gram Panchayat Portal
            </CardTitle>
            <CardDescription className="text-base">
              Welcome back! Please sign in to access the management system
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                placeholder="Enter your email"
                type="email"
                required
                className="bg-white"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                required
                className="bg-white"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button
              className="w-full text-base bg-indigo-900"
              size="lg"
              type="submit"
            >
              Sign In
            </Button>
            <p className="text-sm text-muted-foreground text-center">
              Don&apos;t have an account?{" "}
              <Link
                href="/api/auth/signup"
                className="text-primary hover:underline font-medium"
              >
                Sign up
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
