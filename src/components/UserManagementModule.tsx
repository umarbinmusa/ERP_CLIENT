import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Alert, AlertDescription } from "./ui/alert";
import { UserPlus, Edit, Trash2, Search, Shield, Users, UserCheck, UserX } from "lucide-react";
import { apiService } from "../services/api";
import { useAuth } from "./AuthContext";

interface User {
  id: number;
  username: string;
  fullName: string;
  email: string;
  role: string;
  permissions: string[];
  isActive: boolean;
  createdAt: string;
  lastLogin?: string;
}

const roleOptions = [
  { value: "Managing Director", label: "Managing Director", permissions: ["all"] },
  { value: "Finance Manager", label: "Finance Manager", permissions: ["finance", "reports", "dashboard"] },
  { value: "General Manager", label: "General Manager", permissions: ["inventory", "production", "sales", "logistics", "dashboard"] },
  { value: "Laboratory Personnel", label: "Laboratory Personnel", permissions: ["laboratory", "dashboard"] },
  { value: "Production Manager", label: "Production Manager", permissions: ["production", "inventory", "dashboard"] },
  { value: "Sales Manager", label: "Sales Manager", permissions: ["sales", "reports", "dashboard"] }
];

export function UserManagementModule() {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // New user form state
  const [newUser, setNewUser] = useState({
    username: "",
    fullName: "",
    email: "",
    password: "",
    role: "",
    isActive: true
  });

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setIsLoading(true);
      const response = await apiService.getUsers();
      
      if (response.success) {
        setUsers(response.data);
      } else {
        // Mock data for demo
        setUsers([
          {
            id: 1,
            username: "admin",
            fullName: "John Adebayo",
            email: "admin@sajfoods.com",
            role: "Managing Director",
            permissions: ["all"],
            isActive: true,
            createdAt: "2024-01-01",
            lastLogin: "2024-01-15 10:30:00"
          },
          {
            id: 2,
            username: "finance",
            fullName: "Sarah Johnson",
            email: "finance@sajfoods.com",
            role: "Finance Manager",
            permissions: ["finance", "reports", "dashboard"],
            isActive: true,
            createdAt: "2024-01-02",
            lastLogin: "2024-01-15 09:15:00"
          },
          {
            id: 3,
            username: "general",
            fullName: "Michael Chen",
            email: "general@sajfoods.com",
            role: "General Manager",
            permissions: ["inventory", "production", "sales", "logistics", "dashboard"],
            isActive: true,
            createdAt: "2024-01-03",
            lastLogin: "2024-01-14 16:45:00"
          },
          {
            id: 4,
            username: "lab",
            fullName: "Dr. Amina Yusuf",
            email: "lab@sajfoods.com",
            role: "Laboratory Personnel",
            permissions: ["laboratory", "dashboard"],
            isActive: true,
            createdAt: "2024-01-04",
            lastLogin: "2024-01-15 08:00:00"
          }
        ]);
      }
    } catch (error) {
      console.error("Error loading users:", error);
      setError("Failed to load users");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const selectedRole = roleOptions.find(role => role.value === newUser.role);
      const userData = {
        ...newUser,
        permissions: selectedRole?.permissions || []
      };

      const response = await apiService.createUser(userData);

      if (response.success) {
        setSuccess("User created successfully");
        setNewUser({
          username: "",
          fullName: "",
          email: "",
          password: "",
          role: "",
          isActive: true
        });
        setIsCreateDialogOpen(false);
        loadUsers();
      } else {
        setError(response.message || "Failed to create user");
      }
    } catch (error) {
      console.error("Error creating user:", error);
      setError("Network error. Failed to create user.");
    }
  };

  const handleToggleUserStatus = async (userId: number) => {
    try {
      const user = users.find(u => u.id === userId);
      if (!user) return;

      const response = await apiService.updateUser(userId, {
        isActive: !user.isActive
      });

      if (response.success) {
        setUsers(users.map(u => 
          u.id === userId ? { ...u, isActive: !u.isActive } : u
        ));
        setSuccess(`User ${user.isActive ? 'deactivated' : 'activated'} successfully`);
      } else {
        setError(response.message || "Failed to update user status");
      }
    } catch (error) {
      console.error("Error updating user status:", error);
      setError("Network error. Failed to update user status.");
    }
  };

  const handleDeleteUser = async (userId: number) => {
    if (!confirm("Are you sure you want to delete this user? This action cannot be undone.")) {
      return;
    }

    try {
      const response = await apiService.deleteUser(userId);

      if (response.success) {
        setUsers(users.filter(u => u.id !== userId));
        setSuccess("User deleted successfully");
      } else {
        setError(response.message || "Failed to delete user");
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      setError("Network error. Failed to delete user.");
    }
  };

  const filteredUsers = users.filter(user =>
    user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case "Managing Director": return "default";
      case "Finance Manager": return "secondary";
      default: return "outline";
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
          <p className="text-gray-600">Manage system users, roles, and permissions</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <UserPlus className="h-4 w-4 mr-2" />
              Add New User
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Create New User</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreateUser} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    value={newUser.username}
                    onChange={(e) => setNewUser({...newUser, username: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input
                    id="fullName"
                    value={newUser.fullName}
                    onChange={(e) => setNewUser({...newUser, fullName: e.target.value})}
                    required
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={newUser.email}
                  onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                  required
                />
              </div>
              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={newUser.password}
                  onChange={(e) => setNewUser({...newUser, password: e.target.value})}
                  required
                />
              </div>
              <div>
                <Label htmlFor="role">Role</Label>
                <Select value={newUser.role} onValueChange={(value) => setNewUser({...newUser, role: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    {roleOptions.map((role) => (
                      <SelectItem key={role.value} value={role.value}>
                        {role.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-end space-x-3">
                <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Create User</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Alerts */}
      {error && (
        <Alert className="border-red-200 bg-red-50">
          <AlertDescription className="text-red-700">{error}</AlertDescription>
        </Alert>
      )}
      {success && (
        <Alert className="border-green-200 bg-green-50">
          <AlertDescription className="text-green-700">{success}</AlertDescription>
        </Alert>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="rounded-xl shadow-sm border-0 bg-gradient-to-br from-blue-50 to-blue-100">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-600 mb-1">Total Users</p>
                <p className="text-2xl font-bold text-blue-900">{users.length}</p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-xl shadow-sm border-0 bg-gradient-to-br from-green-50 to-green-100">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-600 mb-1">Active Users</p>
                <p className="text-2xl font-bold text-green-900">{users.filter(u => u.isActive).length}</p>
              </div>
              <UserCheck className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-xl shadow-sm border-0 bg-gradient-to-br from-red-50 to-red-100">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-red-600 mb-1">Inactive Users</p>
                <p className="text-2xl font-bold text-red-900">{users.filter(u => !u.isActive).length}</p>
              </div>
              <UserX className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-xl shadow-sm border-0 bg-gradient-to-br from-purple-50 to-purple-100">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-purple-600 mb-1">Roles</p>
                <p className="text-2xl font-bold text-purple-900">{roleOptions.length}</p>
              </div>
              <Shield className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* User Table */}
      <Card className="rounded-xl shadow-sm border-0">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Users className="h-5 w-5 text-blue-600" />
            <span>System Users</span>
          </CardTitle>
          <div className="flex items-center space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border border-gray-200 overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead>User</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Last Login</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id} className="hover:bg-gray-50">
                    <TableCell>
                      <div>
                        <div className="font-medium">{user.fullName}</div>
                        <div className="text-sm text-gray-500">@{user.username}</div>
                      </div>
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Badge variant={getRoleBadgeVariant(user.role)}>
                        {user.role}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={user.isActive ? "default" : "destructive"}>
                        {user.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-gray-600">{user.createdAt}</TableCell>
                    <TableCell className="text-sm text-gray-600">{user.lastLogin || "Never"}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button size="sm" variant="outline" className="h-8">
                          <Edit className="h-3 w-3 mr-1" />
                          Edit
                        </Button>
                        <Button 
                          size="sm" 
                          variant={user.isActive ? "destructive" : "default"} 
                          className="h-8"
                          onClick={() => handleToggleUserStatus(user.id)}
                        >
                          {user.isActive ? "Deactivate" : "Activate"}
                        </Button>
                        {user.id !== currentUser?.id && (
                          <Button 
                            size="sm" 
                            variant="destructive" 
                            className="h-8"
                            onClick={() => handleDeleteUser(user.id)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}