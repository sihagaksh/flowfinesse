"use client"
import { useEffect, useState } from "react"
import { useAuth } from "@/hooks/use-auth"
import { useRouter } from "next/navigation"
import MaxWidthWrapper from "@/components/max-width-wrapper"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  User,
  Calendar,
  Shield,
  Bell,
  Trash2,
  Edit3,
  Save,
  X,
  Camera,
  Users,
  TrendingUp,
  DollarSign,
} from "lucide-react"
import { supabase } from "@/lib/supabase"
import { toast } from "@/hooks/use-toast"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import Loader from "@/components/Loader"

interface UserProfile {
  id: string
  name: string
  email: string
  avatar_url: string | null
  created_at: string
  updated_at: string
}

interface UserStats {
  totalGroups: number
  totalExpenses: number
  totalAmountPaid: number
  totalAmountOwed: number
}

export default function ProfilePage() {
  const { user, loading: authLoading, logout } = useAuth()
  const router = useRouter()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [stats, setStats] = useState<UserStats>({
    totalGroups: 0,
    totalExpenses: 0,
    totalAmountPaid: 0,
    totalAmountOwed: 0,
  })
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [editedName, setEditedName] = useState("")
  const [saving, setSaving] = useState(false)
  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    pushNotifications: true,
    expenseReminders: true,
    groupInvitations: true,
  })

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login?redirect=/profile")
    }
  }, [user, authLoading, router])

  useEffect(() => {
    if (user) {
      fetchUserProfile()
      fetchUserStats()
    }
  }, [user])

  const fetchUserProfile = async () => {
    if (!user) return

    try {
      const { data, error } = await supabase.from("profiles").select("*").eq("id", user.id).single()

      if (error) {
        console.error("Error fetching profile:", error)
        return
      }

      setProfile(data)
      setEditedName(data.name)
    } catch (error) {
      console.error("Error fetching profile:", error)
    } finally {
      setLoading(false)
    }
  }

  const fetchUserStats = async () => {
    if (!user) return

    try {
      // Get total groups
      const { count: groupCount } = await supabase
        .from("group_members")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id)

      // Get total expenses paid by user
      const { data: paidExpenses } = await supabase.from("expenses").select("amount").eq("paid_by", user.id)

      // Get total amount owed to user (from expense splits)
      const { data: expenseSplits } = await supabase.from("expense_splits").select("amount").eq("user_id", user.id)

      const totalAmountPaid = paidExpenses?.reduce((sum, expense) => sum + Number(expense.amount), 0) || 0
      const totalAmountOwed = expenseSplits?.reduce((sum, split) => sum + Number(split.amount), 0) || 0

      setStats({
        totalGroups: groupCount || 0,
        totalExpenses: paidExpenses?.length || 0,
        totalAmountPaid,
        totalAmountOwed,
      })
    } catch (error) {
      console.error("Error fetching user stats:", error)
    }
  }

  const handleSaveProfile = async () => {
    if (!user || !profile) return

    setSaving(true)
    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          name: editedName.trim(),
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id)

      if (error) throw error

      setProfile({ ...profile, name: editedName.trim() })
      setEditing(false)
      toast({
        title: "Success",
        description: "Profile updated successfully!",
      })
    } catch (error: any) {
      console.error("Error updating profile:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to update profile",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteAccount = async () => {
    if (!user) return

    try {
      // Note: In a real app, you'd want to handle this more carefully
      // and possibly keep some data for legal/business reasons
      await supabase.auth.admin.deleteUser(user.id)

      toast({
        title: "Account Deleted",
        description: "Your account has been permanently deleted.",
      })

      await logout()
      router.push("/")
    } catch (error: any) {
      console.error("Error deleting account:", error)
      toast({
        title: "Error",
        description: "Failed to delete account. Please contact support.",
        variant: "destructive",
      })
    }
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  if (authLoading || loading) {
    return (
      <MaxWidthWrapper className="py-8">
        <Loader />
      </MaxWidthWrapper>
    )
  }

  if (!user || !profile) {
    return null
  }

  const netBalance = stats.totalAmountPaid - stats.totalAmountOwed

  return (
    <MaxWidthWrapper className="py-8">
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Profile Settings</h1>
            <p className="text-muted-foreground mt-2">Manage your account settings and preferences</p>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Profile Information */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="mr-2 h-5 w-5" />
                  Basic Information
                </CardTitle>
                <CardDescription>Update your personal information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Avatar Section */}
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <Avatar className="h-20 w-20">
                      <AvatarImage src={profile.avatar_url || ""} alt={profile.name} />
                      <AvatarFallback className="text-lg">{getInitials(profile.name)}</AvatarFallback>
                    </Avatar>
                    <Button size="icon" variant="outline" className="absolute -bottom-1 -right-1 h-8 w-8 rounded-full">
                      <Camera className="h-4 w-4" />
                    </Button>
                  </div>
                  <div>
                    <h3 className="font-semibold">{profile.name}</h3>
                    <p className="text-sm text-muted-foreground">{profile.email}</p>
                    <p className="text-xs text-muted-foreground mt-1">Member since {formatDate(profile.created_at)}</p>
                  </div>
                </div>

                <Separator />

                {/* Name Edit */}
                <div className="space-y-2">
                  <Label htmlFor="name">Display Name</Label>
                  <div className="flex items-center space-x-2">
                    {editing ? (
                      <>
                        <Input
                          id="name"
                          value={editedName}
                          onChange={(e) => setEditedName(e.target.value)}
                          placeholder="Enter your name"
                        />
                        <Button size="icon" onClick={handleSaveProfile} disabled={saving || !editedName.trim()}>
                          <Save className="h-4 w-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="outline"
                          onClick={() => {
                            setEditing(false)
                            setEditedName(profile.name)
                          }}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </>
                    ) : (
                      <>
                        <Input value={profile.name} disabled />
                        <Button size="icon" variant="outline" onClick={() => setEditing(true)}>
                          <Edit3 className="h-4 w-4" />
                        </Button>
                      </>
                    )}
                  </div>
                </div>

                {/* Email (Read-only) */}
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <div className="flex items-center space-x-2">
                    <Input id="email" value={profile.email} disabled />
                    <Badge variant="secondary">Verified</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Email cannot be changed. Contact support if you need to update your email.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Notification Preferences */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Bell className="mr-2 h-5 w-5" />
                  Notification Preferences
                </CardTitle>
                <CardDescription>Choose how you want to be notified</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                  </div>
                  <Switch
                    checked={notifications.emailNotifications}
                    onCheckedChange={(checked) => setNotifications({ ...notifications, emailNotifications: checked })}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Group Invitations</Label>
                    <p className="text-sm text-muted-foreground">Get notified when someone invites you to a group</p>
                  </div>
                  <Switch
                    checked={notifications.groupInvitations}
                    onCheckedChange={(checked) => setNotifications({ ...notifications, groupInvitations: checked })}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Expense Reminders</Label>
                    <p className="text-sm text-muted-foreground">Reminders about pending expenses and settlements</p>
                  </div>
                  <Switch
                    checked={notifications.expenseReminders}
                    onCheckedChange={(checked) => setNotifications({ ...notifications, expenseReminders: checked })}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Security Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="mr-2 h-5 w-5" />
                  Security Settings
                </CardTitle>
                <CardDescription>Manage your account security</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Password</Label>
                    <p className="text-sm text-muted-foreground">Last updated {formatDate(profile.updated_at)}</p>
                  </div>
                  <Button variant="outline">Change Password</Button>
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Two-Factor Authentication</Label>
                    <p className="text-sm text-muted-foreground">Add an extra layer of security to your account</p>
                  </div>
                  <Button variant="outline">Enable 2FA</Button>
                </div>
              </CardContent>
            </Card>

            {/* Danger Zone */}
            <Card className="border-destructive/20">
              <CardHeader>
                <CardTitle className="flex items-center text-destructive">
                  <Trash2 className="mr-2 h-5 w-5" />
                  Delete Account
                </CardTitle>
                <CardDescription>Irreversible and destructive actions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-destructive">Delete Account</Label>
                    <p className="text-sm text-muted-foreground">
                      Permanently delete your account and all associated data
                    </p>
                  </div>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive">Delete Account</Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently delete your account and remove all your
                          data from our servers, including all groups and expenses.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={handleDeleteAccount}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          Yes, delete my account
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Account Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="mr-2 h-5 w-5" />
                  Account Statistics
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Total Groups</span>
                  </div>
                  <Badge variant="secondary">{stats.totalGroups}</Badge>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Expenses Created</span>
                  </div>
                  <Badge variant="secondary">{stats.totalExpenses}</Badge>
                </div>

                <Separator />

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Total Paid</span>
                    <span className="font-medium">${stats.totalAmountPaid.toFixed(2)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Total Owed</span>
                    <span className="font-medium">${stats.totalAmountOwed.toFixed(2)}</span>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Net Balance</span>
                    <span
                      className={`font-bold ${
                        netBalance > 0 ? "text-green-600" : netBalance < 0 ? "text-red-600" : "text-muted-foreground"
                      }`}
                    >
                      ${Math.abs(netBalance).toFixed(2)}
                      {netBalance > 0 ? " owed to you" : netBalance < 0 ? " you owe" : ""}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full" onClick={() => router.push("/groups/create")}>
                  <Users className="mr-2 h-4 w-4" />
                  Create New Group
                </Button>
                <Button variant="outline" className="w-full" onClick={() => router.push("/dashboard")}>
                  <TrendingUp className="mr-2 h-4 w-4" />
                  View Dashboard
                </Button>
                <Button variant="outline" className="w-full" onClick={logout}>
                  Sign Out
                </Button>
              </CardContent>
            </Card>

            {/* Account Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="mr-2 h-5 w-5" />
                  Account Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">User ID</span>
                  <span className="font-mono text-xs">{user.id.slice(0, 8)}...</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Joined</span>
                  <span>{formatDate(profile.created_at)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Last Updated</span>
                  <span>{formatDate(profile.updated_at)}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </MaxWidthWrapper>
  )
}
