import { FormEvent, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Eye, EyeOff, Plus } from "lucide-react";
import { toast } from "sonner";
import { AdminLayout } from "../components/admin/AdminLayout";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import {
  Select,
} from "../components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import { listAdminClinics } from "../features/admin/clinics/api";
import {
  createAdminUser,
  createUserClinicAccess,
  deactivateUserClinicAccess,
  listAdminUsers,
  type ClinicAccessRole,
  type GlobalUserRole,
} from "../features/admin/users/api";

const globalRoles: GlobalUserRole[] = [
  "SUPER_ADMIN",
  "ORG_ADMIN",
  "STAFF",
  "PATIENT",
];

const clinicAccessRoles: ClinicAccessRole[] = [
  "CLINIC_ADMIN",
  "RECEPTIONIST",
  "DENTIST",
  "ASSISTANT",
];

type CreateUserForm = {
  email: string;
  password: string;
  role: GlobalUserRole;
  firstName: string;
  lastName: string;
  title: string;
  clinicId: string;
  clinicRole: ClinicAccessRole;
  clinicAccessActive: boolean;
};

const initialCreateForm: CreateUserForm = {
  email: "",
  password: "",
  role: "STAFF",
  firstName: "",
  lastName: "",
  title: "",
  clinicId: "",
  clinicRole: "CLINIC_ADMIN",
  clinicAccessActive: true,
};

export function AdminUsersPage() {
  const queryClient = useQueryClient();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [createForm, setCreateForm] = useState<CreateUserForm>(initialCreateForm);
  const [selectedUserId, setSelectedUserId] = useState("");
  const [accessClinicId, setAccessClinicId] = useState("");
  const [accessRole, setAccessRole] = useState<ClinicAccessRole>("CLINIC_ADMIN");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const usersQuery = useQuery({
    queryKey: ["admin", "users"],
    queryFn: listAdminUsers,
  });
  const clinicsQuery = useQuery({
    queryKey: ["admin", "clinics"],
    queryFn: listAdminClinics,
  });

  const users = usersQuery.data ?? [];
  const clinics = clinicsQuery.data ?? [];
  const selectedUser = useMemo(
    () => users.find((user) => user.id === selectedUserId) ?? null,
    [selectedUserId, users],
  );

  const createUserMutation = useMutation({
    mutationFn: createAdminUser,
    onSuccess: (user) => {
      toast.success("User created.", { description: user.email });
      setCreateForm(initialCreateForm);
      setIsCreateOpen(false);
      void queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
    },
    onError: (error) => {
      toast.error("Create failed.", {
        description: error instanceof Error ? error.message : "Unable to create user.",
      });
    },
  });

  const addAccessMutation = useMutation({
    mutationFn: createUserClinicAccess,
    onSuccess: () => {
      toast.success("Clinic access added.");
      setAccessClinicId("");
      void queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
    },
    onError: (error) => {
      toast.error("Access update failed.", {
        description:
          error instanceof Error ? error.message : "Unable to add clinic access.",
      });
    },
  });

  const deactivateAccessMutation = useMutation({
    mutationFn: deactivateUserClinicAccess,
    onSuccess: () => {
      toast.success("Clinic access deactivated.");
      void queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
    },
    onError: (error) => {
      toast.error("Access update failed.", {
        description:
          error instanceof Error
            ? error.message
            : "Unable to deactivate clinic access.",
      });
    },
  });

  function handleCreateUser(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    createUserMutation.mutate({
      email: createForm.email,
      password: createForm.password,
      role: createForm.role,
      ...(createForm.firstName.trim() ? { firstName: createForm.firstName } : {}),
      ...(createForm.lastName.trim() ? { lastName: createForm.lastName } : {}),
      ...(createForm.title.trim() ? { title: createForm.title } : {}),
      ...(createForm.clinicId
        ? {
            clinicAccess: [
              {
                clinicId: createForm.clinicId,
                role: createForm.clinicRole,
                isActive: createForm.clinicAccessActive,
              },
            ],
          }
        : {}),
    });
  }

  function handleAddClinicAccess(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!selectedUser || !accessClinicId) {
      return;
    }

    addAccessMutation.mutate({
      userId: selectedUser.id,
      payload: {
        clinicId: accessClinicId,
        role: accessRole,
        isActive: true,
      },
    });
  }

  return (
    <AdminLayout
      actions={
        <>
          <Button onClick={() => setIsCreateOpen(true)} type="button">
            <Plus aria-hidden="true" className="mr-2 h-4 w-4" />
            Add user
          </Button>
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Add user</DialogTitle>
                <DialogDescription>
                  Create a login user. Staff users can also get a linked staff
                  profile and clinic access.
                </DialogDescription>
              </DialogHeader>
              <form className="grid gap-4" onSubmit={handleCreateUser}>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Label className="grid gap-2">
                    <span>Email</span>
                    <Input
                      onChange={(event) =>
                        setCreateForm((form) => ({ ...form, email: event.target.value }))
                      }
                      type="email"
                      value={createForm.email}
                    />
                  </Label>
                  <Label className="grid gap-2">
                    <span>Temporary password</span>
                    <div className="flex h-10 items-center rounded-md border border-border bg-background transition focus-within:border-accent focus-within:ring-2 focus-within:ring-accent/30">
                      <Input
                        className="h-full flex-1 border-0 bg-transparent pr-1 focus:border-transparent focus:ring-0"
                        onChange={(event) =>
                          setCreateForm((form) => ({
                            ...form,
                            password: event.target.value,
                          }))
                        }
                        type={isPasswordVisible ? "text" : "password"}
                        value={createForm.password}
                      />
                      <button
                        aria-label={
                          isPasswordVisible ? "Hide password" : "Show password"
                        }
                        className="mr-2 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-muted-foreground transition hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        onClick={() => setIsPasswordVisible((value) => !value)}
                        type="button"
                      >
                        {isPasswordVisible ? (
                          <EyeOff className="h-4 w-4" aria-hidden="true" />
                        ) : (
                          <Eye className="h-4 w-4" aria-hidden="true" />
                        )}
                      </button>
                    </div>
                  </Label>
                </div>

              <Label className="grid gap-2">
                <span>Global role</span>
                <Select
                  onChange={(event) =>
                    setCreateForm((form) => ({
                      ...form,
                      role: event.target.value as GlobalUserRole,
                    }))
                  }
                  value={createForm.role}
                >
                  {globalRoles.map((role) => (
                    <option key={role} value={role}>
                      {role}
                    </option>
                  ))}
                </Select>
              </Label>

              <div className="grid gap-4 sm:grid-cols-3">
                <Label className="grid gap-2">
                  <span>First name</span>
                  <Input
                    onChange={(event) =>
                      setCreateForm((form) => ({
                        ...form,
                        firstName: event.target.value,
                      }))
                    }
                    value={createForm.firstName}
                  />
                </Label>
                <Label className="grid gap-2">
                  <span>Last name</span>
                  <Input
                    onChange={(event) =>
                      setCreateForm((form) => ({
                        ...form,
                        lastName: event.target.value,
                      }))
                    }
                    value={createForm.lastName}
                  />
                </Label>
                <Label className="grid gap-2">
                  <span>Title</span>
                  <Input
                    onChange={(event) =>
                      setCreateForm((form) => ({ ...form, title: event.target.value }))
                    }
                    value={createForm.title}
                  />
                </Label>
              </div>

              <div className="grid gap-4 rounded-md border border-border p-4 sm:grid-cols-2">
                <Label className="grid gap-2">
                  <span>Initial clinic</span>
                  <Select
                    onChange={(event) =>
                      setCreateForm((form) => ({
                        ...form,
                        clinicId: event.target.value,
                      }))
                    }
                    value={createForm.clinicId}
                  >
                    <option value="">No clinic access</option>
                    {clinics.map((clinic) => (
                      <option key={clinic.id} value={clinic.id}>
                        {clinic.name}
                      </option>
                    ))}
                  </Select>
                </Label>
                <Label className="grid gap-2">
                  <span>Clinic role</span>
                  <Select
                    onChange={(event) =>
                      setCreateForm((form) => ({
                        ...form,
                        clinicRole: event.target.value as ClinicAccessRole,
                      }))
                    }
                    value={createForm.clinicRole}
                  >
                    {clinicAccessRoles.map((role) => (
                      <option key={role} value={role}>
                        {role}
                      </option>
                    ))}
                  </Select>
                </Label>
              </div>

                <div className="flex flex-wrap justify-end gap-3">
                  <Button
                    onClick={() => setIsCreateOpen(false)}
                    type="button"
                    variant="outline"
                  >
                    Cancel
                  </Button>
                  <Button disabled={createUserMutation.isPending} type="submit">
                    {createUserMutation.isPending ? "Creating..." : "Add user"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </>
      }
      description="Manage user accounts, access levels, and account status."
      isRefreshing={usersQuery.isFetching || clinicsQuery.isFetching}
      onRefresh={() => {
        void usersQuery.refetch();
        void clinicsQuery.refetch();
      }}
      title="Users"
    >
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Admin users</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            <p className="text-sm leading-6 text-muted-foreground">
              Staff profiles describe the dental team. Staff users are login
              accounts linked to those profiles when they need dashboard access.
            </p>
            {usersQuery.error ? (
              <p className="rounded-md border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
                {usersQuery.error instanceof Error
                  ? usersQuery.error.message
                  : "Unable to load users."}
              </p>
            ) : null}

            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Profile</TableHead>
                    <TableHead>Clinic access</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {usersQuery.isLoading ? (
                    <TableRow>
                      <TableCell colSpan={5}>Loading users...</TableCell>
                    </TableRow>
                  ) : null}
                  {!usersQuery.isLoading && users.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5}>No users found.</TableCell>
                    </TableRow>
                  ) : null}
                  {users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.email}</TableCell>
                      <TableCell>
                        <Badge variant="muted">{user.role}</Badge>
                      </TableCell>
                      <TableCell>
                        {user.staffProfile
                          ? `${user.staffProfile.firstName} ${user.staffProfile.lastName}`
                          : "None"}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-2">
                          {user.clinicAccess.length === 0 ? (
                            <span className="text-sm text-muted-foreground">None</span>
                          ) : null}
                          {user.clinicAccess.map((access) => (
                            <Badge
                              key={access.id}
                              variant={access.isActive ? "default" : "muted"}
                            >
                              {access.clinic.name}: {access.role}
                              {!access.isActive ? " (inactive)" : ""}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          onClick={() => setSelectedUserId(user.id)}
                          type="button"
                          variant="outline"
                        >
                          Manage access
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {selectedUser ? (
          <Card>
            <CardHeader>
              <CardTitle>Clinic access for {selectedUser.email}</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4">
              <form
                className="grid gap-3 rounded-md border border-border p-4 sm:grid-cols-[1fr_1fr_auto]"
                onSubmit={handleAddClinicAccess}
              >
                <Select
                  onChange={(event) => setAccessClinicId(event.target.value)}
                  value={accessClinicId}
                >
                  <option value="">Clinic</option>
                  {clinics.map((clinic) => (
                    <option key={clinic.id} value={clinic.id}>
                      {clinic.name}
                    </option>
                  ))}
                </Select>
                <Select
                  onChange={(event) => setAccessRole(event.target.value as ClinicAccessRole)}
                  value={accessRole}
                >
                  {clinicAccessRoles.map((role) => (
                    <option key={role} value={role}>
                      {role}
                    </option>
                  ))}
                </Select>
                <Button disabled={addAccessMutation.isPending} type="submit">
                  Add access
                </Button>
              </form>

              <div className="grid gap-2">
                {selectedUser.clinicAccess.map((access) => (
                  <div
                    className="flex flex-wrap items-center justify-between gap-3 rounded-md border border-border p-3"
                    key={access.id}
                  >
                    <div>
                      <p className="text-sm font-medium">{access.clinic.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {access.role} - {access.isActive ? "Active" : "Inactive"}
                      </p>
                    </div>
                    <Button
                      disabled={!access.isActive || deactivateAccessMutation.isPending}
                      onClick={() =>
                        deactivateAccessMutation.mutate({
                          accessId: access.id,
                          userId: selectedUser.id,
                        })
                      }
                      type="button"
                      variant="outline"
                    >
                      Deactivate
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ) : null}
      </div>
    </AdminLayout>
  );
}
