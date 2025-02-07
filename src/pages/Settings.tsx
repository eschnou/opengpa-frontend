
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { httpClient } from "@/lib/http-client";
import { UserProfileDTO } from "@/types/api";
import { TopNav } from "@/components/layout/TopNav";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { updateProfile } from "@/services/profile.service";
import { changePassword } from "@/services/security.service";

const Settings = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const { data: user, isLoading } = useQuery({
    queryKey: ["user-profile"],
    queryFn: async () => {
      const response = await httpClient.get<UserProfileDTO>("/users/me");
      return response.data;
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateProfile({ name, email });
      await queryClient.invalidateQueries({ queryKey: ["user-profile"] });
      setIsDialogOpen(false);
      toast({
        title: "Success",
        description: "Profile updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive",
      });
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await changePassword({ currentPassword, newPassword });
      setIsPasswordDialogOpen(false);
      setCurrentPassword("");
      setNewPassword("");
      toast({
        title: "Success",
        description: "Password changed successfully",
      });
    } catch (error: any) {
      if (error.validationErrors) {
        const validationMessages = Object.values(error.validationErrors).join(", ");
        toast({
          title: "Validation Error",
          description: validationMessages,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to change password",
          variant: "destructive",
        });
      }
    }
  };

  const handleDialogOpen = (open: boolean) => {
    if (open && user) {
      setName(user.name);
      setEmail(user.email);
    }
    setIsDialogOpen(open);
  };

  if (isLoading) {
    return (
      <>
        <TopNav />
        <div className="container mx-auto p-6 max-w-2xl mt-16">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-muted rounded w-1/4"></div>
            <div className="h-32 bg-muted rounded"></div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <TopNav />
      <div className="container mx-auto p-6 max-w-2xl mt-16">
        <h1 className="text-2xl font-bold mb-8">Settings</h1>

        <div className="space-y-6">
          <div className="bg-card p-6 rounded-lg border">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-lg font-semibold">Profile Information</h2>
                <p className="text-sm text-muted-foreground">Manage your personal information</p>
              </div>
              <Dialog open={isDialogOpen} onOpenChange={handleDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline">Edit Profile</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Edit Profile</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                    <div className="flex justify-end">
                      <Button type="submit">Save Changes</Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Username</label>
                <p className="mt-1">{user?.username}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Full Name</label>
                <p className="mt-1">{user?.name}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Email</label>
                <p className="mt-1">{user?.email}</p>
              </div>
            </div>
          </div>

          <div className="bg-card p-6 rounded-lg border">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-lg font-semibold">Security</h2>
                <p className="text-sm text-muted-foreground">Manage your account security settings</p>
              </div>
              <Dialog open={isPasswordDialogOpen} onOpenChange={setIsPasswordDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline">Change Password</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Change Password</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handlePasswordSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="currentPassword">Current Password</Label>
                      <Input
                        id="currentPassword"
                        type="password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="newPassword">New Password</Label>
                      <Input
                        id="newPassword"
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                      />
                    </div>
                    <div className="flex justify-end">
                      <Button type="submit">Change Password</Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Password</label>
                <p className="mt-1 text-sm text-muted-foreground">Change your account password</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Settings;

