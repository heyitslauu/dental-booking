import { FormEvent, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import {
  isAdminAuthenticated,
  loginAdmin,
} from "../features/admin/auth";

type LoginLocationState = {
  from?: string;
};

export function AdminLoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as LoginLocationState | null;
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const loginMutation = useMutation({
    mutationFn: loginAdmin,
    onSuccess: () => {
      navigate(state?.from || "/admin/appointments", { replace: true });
    },
  });

  if (isAdminAuthenticated()) {
    return <Navigate replace to={state?.from || "/admin/appointments"} />;
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    loginMutation.mutate({
      email: email.trim(),
      password,
    });
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-6 text-foreground">
      <Card className="w-full max-w-md">
        <CardHeader>
          <p className="text-sm font-semibold uppercase tracking-wide text-accent-foreground">
            Back office
          </p>
          <CardTitle>Admin login</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="grid gap-4" onSubmit={handleSubmit}>
            <Label className="grid gap-2">
              <span>Email</span>
              <Input
                autoComplete="email"
                onChange={(event) => setEmail(event.target.value)}
                type="email"
                value={email}
              />
            </Label>
            <Label className="grid gap-2">
              <span>Password</span>
              <Input
                autoComplete="current-password"
                onChange={(event) => setPassword(event.target.value)}
                type="password"
                value={password}
              />
            </Label>

            {loginMutation.error ? (
              <p className="rounded-md border border-destructive/30 bg-destructive/10 p-3 text-sm font-medium text-destructive">
                {loginMutation.error instanceof Error
                  ? loginMutation.error.message
                  : "Unable to sign in."}
              </p>
            ) : null}

            <Button
              disabled={loginMutation.isPending}
              type="submit"
            >
              {loginMutation.isPending ? "Signing in..." : "Sign in"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}
