import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { authService } from "@/services/auth.service";
import { useState } from "react";
import type { AuthRequest, RegisterRequest } from "@/types/api";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { APP_CONFIG } from "@/config/app.config";

const loginFormSchema = z.object({
  username: z.string({
    required_error: "Username is required",
  }).min(3, "Username must be at least 3 characters").nonempty(),
  password: z.string({
    required_error: "Password is required",
  }).min(6, "Password must be at least 6 characters").nonempty(),
}) as z.ZodType<AuthRequest>;

const registerFormSchema = z.object({
  username: z.string()
    .min(3, "Username must be at least 3 characters")
    .max(50, "Username must be less than 50 characters")
    .regex(/^[a-zA-Z0-9._-]+$/, "Username can only contain letters, numbers, and ._-"),
  name: z.string()
    .min(1, "Full name is required")
    .max(100, "Name must be less than 100 characters")
    .regex(/^[\p{L}\s'-]+$/u, "Name can only contain letters, spaces, hyphens and apostrophes"),
  email: z.string()
    .email("Invalid email address")
    .max(255, "Email must be less than 255 characters")
    .regex(/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/, "Invalid email format"),
  password: z.string()
    .min(8, "Password must be at least 8 characters"),
  ...(APP_CONFIG.requireInviteCode
    ? { inviteCode: z.string().min(1, "Invite code is required") }
    : {}),
}) as z.ZodType<RegisterRequest>;

const Login = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isSignupOpen, setIsSignupOpen] = useState(false);

  const loginForm = useForm<AuthRequest>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const registerForm = useForm<RegisterRequest>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      username: "",
      name: "",
      email: "",
      password: "",
      inviteCode: "",
    },
  });

  const onLogin = async (values: AuthRequest) => {
    if (isLoading) return;
    
    setIsLoading(true);
    try {
      const response = await authService.login(values);
      toast({
        title: "Login successful!",
        description: `Welcome back ${response.user.name || response.user.username}`,
      });
      navigate("/");
    } catch (error: any) {
      console.error('Login error:', error);
      const errorMessage = error.response?.data?.message || "Invalid username or password";
      toast({
        title: "Login failed",
        description: errorMessage,
        variant: "destructive",
        duration: 5000,
      });
      loginForm.setValue('password', '');
    } finally {
      setIsLoading(false);
    }
  };

  const onRegister = async (values: RegisterRequest) => {
    if (isLoading) return;
    
    setIsLoading(true);
    try {
      const response = await authService.register(values);
      toast({
        title: "Registration successful!",
        description: "Welcome to OpenGPA",
      });
      setIsSignupOpen(false);
      navigate("/");
    } catch (error: any) {
      console.error('Registration error:', error);
      const errorMessage = error.response?.data?.message || "Registration failed";
      toast({
        title: "Registration failed",
        description: errorMessage,
        variant: "destructive",
        duration: 5000,
      });
      registerForm.setValue('password', '');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-full max-w-md space-y-8 p-8">
        <div className="text-center">
          <div className="flex justify-center">
            <img
              src="/opengpa_logo_flat_transparent.png"
              alt="OpenGPA Logo"
              className="h-12 w-12"
            />
          </div>
          <h2 className="mt-6 text-3xl font-bold tracking-tight">
            Sign in to your account
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Enter your credentials below
          </p>
        </div>

        <Form {...loginForm}>
          <form onSubmit={loginForm.handleSubmit(onLogin)} className="space-y-6">
            <FormField
              control={loginForm.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder="johndoe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={loginForm.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="••••••" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Signing in..." : "Sign in"}
            </Button>
          </form>
        </Form>

        {APP_CONFIG.signupEnabled && (
          <div className="text-center">
            <Dialog open={isSignupOpen} onOpenChange={setIsSignupOpen}>
              <DialogTrigger asChild>
                <Button variant="link" className="text-sm">
                  Don't have an account? Sign up
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Create an account</DialogTitle>
                </DialogHeader>
                <Form {...registerForm}>
                  <form onSubmit={registerForm.handleSubmit(onRegister)} className="space-y-4">
                    <FormField
                      control={registerForm.control}
                      name="username"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Username</FormLabel>
                          <FormControl>
                            <Input placeholder="johndoe" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={registerForm.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Name</FormLabel>
                          <FormControl>
                            <Input placeholder="John Doe" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={registerForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="john@example.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={registerForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Password</FormLabel>
                          <FormControl>
                            <Input type="password" placeholder="••••••" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {APP_CONFIG.requireInviteCode && (
                      <FormField
                        control={registerForm.control}
                        name="inviteCode"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Invite Code</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter invite code" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}

                    <Button type="submit" className="w-full" disabled={isLoading}>
                      {isLoading ? "Creating account..." : "Create account"}
                    </Button>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;
