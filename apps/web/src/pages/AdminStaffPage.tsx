import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Pencil, Plus, Power, PowerOff } from "lucide-react";
import { toast } from "sonner";
import { AdminLayout } from "../components/admin/AdminLayout";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Select } from "../components/ui/select";
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
  createClinicStaff,
  createStaff,
  listAdminStaff,
  updateClinicStaff,
  updateStaff,
  type AdminStaffProfile,
} from "../features/admin/staff/api";
import type { ClinicStaff } from "../features/booking/types";

type StaffFormState = {
  firstName: string;
  lastName: string;
  title: string;
};

type AssignmentFormState = {
  clinicId: string;
};

const emptyStaffForm: StaffFormState = {
  firstName: "",
  lastName: "",
  title: "",
};

const emptyAssignmentForm: AssignmentFormState = {
  clinicId: "",
};

const iconButtonClass = "h-8 w-8 p-0";

function getStaffName(staff: AdminStaffProfile) {
  return `${staff.firstName} ${staff.lastName}`;
}

function getStaffFormState(staff: AdminStaffProfile | null): StaffFormState {
  if (!staff) {
    return emptyStaffForm;
  }

  return {
    firstName: staff.firstName,
    lastName: staff.lastName,
    title: staff.title ?? "",
  };
}

export function AdminStaffPage() {
  const queryClient = useQueryClient();
  const [isStaffDialogOpen, setIsStaffDialogOpen] = useState(false);
  const [isAssignmentDialogOpen, setIsAssignmentDialogOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState<AdminStaffProfile | null>(
    null,
  );
  const [selectedStaff, setSelectedStaff] = useState<AdminStaffProfile | null>(
    null,
  );
  const [staffForm, setStaffForm] = useState<StaffFormState>(emptyStaffForm);
  const [assignmentForm, setAssignmentForm] =
    useState<AssignmentFormState>(emptyAssignmentForm);

  const staffQuery = useQuery({
    queryKey: ["admin", "staff"],
    queryFn: listAdminStaff,
  });

  const clinicsQuery = useQuery({
    queryKey: ["admin", "clinics"],
    queryFn: listAdminClinics,
  });

  const createStaffMutation = useMutation({
    mutationFn: createStaff,
    onSuccess: (staff) => {
      toast.success("Staff profile created.", { description: getStaffName(staff) });
      closeStaffDialog();
      void queryClient.invalidateQueries({ queryKey: ["admin", "staff"] });
    },
    onError: (error) => {
      toast.error("Create failed.", {
        description:
          error instanceof Error
            ? error.message
            : "Unable to create staff profile.",
      });
    },
  });

  const updateStaffMutation = useMutation({
    mutationFn: updateStaff,
    onSuccess: (staff) => {
      toast.success("Staff profile updated.", { description: getStaffName(staff) });
      closeStaffDialog();
      void queryClient.invalidateQueries({ queryKey: ["admin", "staff"] });
    },
    onError: (error) => {
      toast.error("Update failed.", {
        description:
          error instanceof Error
            ? error.message
            : "Unable to update staff profile.",
      });
    },
  });

  const createAssignmentMutation = useMutation({
    mutationFn: createClinicStaff,
    onSuccess: () => {
      toast.success("Staff assigned to clinic.");
      closeAssignmentDialog();
      void queryClient.invalidateQueries({ queryKey: ["admin", "staff"] });
    },
    onError: (error) => {
      toast.error("Assignment failed.", {
        description:
          error instanceof Error ? error.message : "Unable to assign staff.",
      });
    },
  });

  const updateAssignmentMutation = useMutation({
    mutationFn: updateClinicStaff,
    onSuccess: () => {
      toast.success("Staff assignment updated.");
      void queryClient.invalidateQueries({ queryKey: ["admin", "staff"] });
    },
    onError: (error) => {
      toast.error("Update failed.", {
        description:
          error instanceof Error
            ? error.message
            : "Unable to update staff assignment.",
      });
    },
  });

  const staffProfiles = staffQuery.data ?? [];
  const clinics = clinicsQuery.data ?? [];
  const activeClinics = useMemo(
    () => clinics.filter((clinic) => clinic.isActive),
    [clinics],
  );
  const isSavingStaff =
    createStaffMutation.isPending || updateStaffMutation.isPending;
  const isSavingAssignment = createAssignmentMutation.isPending;

  function openCreateStaffDialog() {
    setEditingStaff(null);
    setStaffForm(emptyStaffForm);
    createStaffMutation.reset();
    updateStaffMutation.reset();
    setIsStaffDialogOpen(true);
  }

  function openEditStaffDialog(staff: AdminStaffProfile) {
    setEditingStaff(staff);
    setStaffForm(getStaffFormState(staff));
    createStaffMutation.reset();
    updateStaffMutation.reset();
    setIsStaffDialogOpen(true);
  }

  function closeStaffDialog() {
    setIsStaffDialogOpen(false);
    setEditingStaff(null);
    setStaffForm(emptyStaffForm);
    createStaffMutation.reset();
    updateStaffMutation.reset();
  }

  function openAssignDialog(staff: AdminStaffProfile) {
    setSelectedStaff(staff);
    setAssignmentForm(emptyAssignmentForm);
    createAssignmentMutation.reset();
    setIsAssignmentDialogOpen(true);
  }

  function closeAssignmentDialog() {
    setIsAssignmentDialogOpen(false);
    setSelectedStaff(null);
    setAssignmentForm(emptyAssignmentForm);
    createAssignmentMutation.reset();
  }

  function updateStaffForm(field: keyof StaffFormState, value: string) {
    setStaffForm((currentForm) => ({ ...currentForm, [field]: value }));
  }

  function handleStaffSubmit() {
    const payload = {
      firstName: staffForm.firstName.trim(),
      lastName: staffForm.lastName.trim(),
      title: staffForm.title.trim() || null,
    };

    if (!payload.firstName || !payload.lastName) {
      toast.error("Staff first and last name are required.");
      return;
    }

    if (editingStaff) {
      updateStaffMutation.mutate({
        staffProfileId: editingStaff.id,
        payload,
      });
      return;
    }

    createStaffMutation.mutate(payload);
  }

  function toggleStaffStatus(staff: AdminStaffProfile) {
    updateStaffMutation.mutate({
      staffProfileId: staff.id,
      payload: { isActive: !staff.isActive },
    });
  }

  function handleAssignmentSubmit() {
    if (!selectedStaff) {
      return;
    }

    if (!assignmentForm.clinicId) {
      toast.error("Clinic branch is required.");
      return;
    }

    createAssignmentMutation.mutate({
      clinicId: assignmentForm.clinicId,
      staffProfileId: selectedStaff.id,
      isActive: true,
    });
  }

  function toggleAssignmentStatus(assignment: ClinicStaff) {
    updateAssignmentMutation.mutate({
      clinicStaffId: assignment.id,
      payload: { isActive: !assignment.isActive },
    });
  }

  function getUnassignedClinics(staff: AdminStaffProfile | null) {
    if (!staff) {
      return activeClinics;
    }

    const assignedClinicIds = new Set(
      staff.clinicStaff.map((assignment) => assignment.clinicId),
    );

    return activeClinics.filter((clinic) => !assignedClinicIds.has(clinic.id));
  }

  const unassignedClinics = getUnassignedClinics(selectedStaff);

  return (
    <AdminLayout
      actions={
        <Button
          aria-label="Create staff profile"
          className="h-10 w-10 p-0"
          onClick={openCreateStaffDialog}
          title="Create staff profile"
          type="button"
        >
          <Plus aria-hidden="true" className="h-4 w-4" />
        </Button>
      }
      title="Staff"
    >

        <Card>
          <CardHeader className="flex-row items-center justify-between gap-4 space-y-0">
            <CardTitle>Staff profiles</CardTitle>
            <p className="text-sm text-muted-foreground">
              {staffQuery.isFetching
                ? "Refreshing..."
                : `${staffProfiles.length} staff`}
            </p>
          </CardHeader>
          <CardContent>
            {staffQuery.error ? (
              <div className="grid gap-3 rounded-md border border-destructive/30 bg-destructive/10 p-4">
                <p className="text-sm font-medium text-destructive">
                  {staffQuery.error instanceof Error
                    ? staffQuery.error.message
                    : "Unable to load staff."}
                </p>
                <Button
                  className="w-fit"
                  onClick={() => void staffQuery.refetch()}
                  type="button"
                  variant="outline"
                >
                  Retry
                </Button>
              </div>
            ) : null}

            {!staffQuery.error ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Staff</TableHead>
                    <TableHead>Position</TableHead>
                    <TableHead>Clinic assignments</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {staffQuery.isLoading ? (
                    <TableRow>
                      <TableCell
                        className="py-8 text-center text-muted-foreground"
                        colSpan={5}
                      >
                        Loading staff...
                      </TableCell>
                    </TableRow>
                  ) : null}

                  {!staffQuery.isLoading && staffProfiles.length === 0 ? (
                    <TableRow>
                      <TableCell
                        className="py-8 text-center text-muted-foreground"
                        colSpan={5}
                      >
                        No staff profiles have been added yet.
                      </TableCell>
                    </TableRow>
                  ) : null}

                  {staffProfiles.map((staff) => (
                    <TableRow key={staff.id}>
                      <TableCell className="min-w-56">
                        <p className="font-medium">{getStaffName(staff)}</p>
                      </TableCell>
                      <TableCell>{staff.title ?? "Not provided"}</TableCell>
                      <TableCell>
                        <div className="grid gap-2">
                          {staff.clinicStaff.length === 0 ? (
                            <span className="text-sm text-muted-foreground">
                              Not assigned
                            </span>
                          ) : null}
                          {staff.clinicStaff.map((assignment) => (
                            <div
                              className="flex flex-wrap items-center gap-2"
                              key={assignment.id}
                            >
                              <Badge
                                variant={assignment.isActive ? "success" : "muted"}
                              >
                                {assignment.clinic.name}
                              </Badge>
                              <Button
                                aria-label={`${assignment.isActive ? "Disable" : "Enable"} ${assignment.clinic.name} assignment`}
                                className={iconButtonClass}
                                disabled={updateAssignmentMutation.isPending}
                                onClick={() => toggleAssignmentStatus(assignment)}
                                title={`${assignment.isActive ? "Disable" : "Enable"} ${assignment.clinic.name} assignment`}
                                type="button"
                                variant="outline"
                              >
                                {assignment.isActive ? (
                                  <PowerOff
                                    aria-hidden="true"
                                    className="h-4 w-4"
                                  />
                                ) : (
                                  <Power aria-hidden="true" className="h-4 w-4" />
                                )}
                              </Button>
                            </div>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={staff.isActive ? "success" : "muted"}>
                          {staff.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex flex-wrap justify-end gap-2">
                          <Button
                            aria-label={`Assign ${getStaffName(staff)} to a clinic`}
                            className={iconButtonClass}
                            onClick={() => openAssignDialog(staff)}
                            title={`Assign ${getStaffName(staff)} to a clinic`}
                            type="button"
                            variant="outline"
                          >
                            <Plus aria-hidden="true" className="h-4 w-4" />
                          </Button>
                          <Button
                            aria-label={`Edit ${getStaffName(staff)}`}
                            className={iconButtonClass}
                            onClick={() => openEditStaffDialog(staff)}
                            title={`Edit ${getStaffName(staff)}`}
                            type="button"
                            variant="outline"
                          >
                            <Pencil aria-hidden="true" className="h-4 w-4" />
                          </Button>
                          <Button
                            aria-label={`${staff.isActive ? "Deactivate" : "Activate"} ${getStaffName(staff)}`}
                            className={iconButtonClass}
                            disabled={updateStaffMutation.isPending}
                            onClick={() => toggleStaffStatus(staff)}
                            title={`${staff.isActive ? "Deactivate" : "Activate"} ${getStaffName(staff)}`}
                            type="button"
                            variant="outline"
                          >
                            {staff.isActive ? (
                              <PowerOff aria-hidden="true" className="h-4 w-4" />
                            ) : (
                              <Power aria-hidden="true" className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : null}
          </CardContent>
        </Card>
      <Dialog
        onOpenChange={(open) => {
          if (!open) {
            closeStaffDialog();
          }
        }}
        open={isStaffDialogOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingStaff ? "Edit staff profile" : "New staff profile"}
            </DialogTitle>
            <DialogDescription>
              Manage the staff record shared across clinic branches.
            </DialogDescription>
          </DialogHeader>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <Label className="grid gap-2">
              <span>
                First name{" "}
                <span className="font-bold text-destructive">* Required</span>
              </span>
              <Input
                onChange={(event) =>
                  updateStaffForm("firstName", event.target.value)
                }
                value={staffForm.firstName}
              />
            </Label>
            <Label className="grid gap-2">
              <span>
                Last name{" "}
                <span className="font-bold text-destructive">* Required</span>
              </span>
              <Input
                onChange={(event) =>
                  updateStaffForm("lastName", event.target.value)
                }
                value={staffForm.lastName}
              />
            </Label>
            <Label className="grid gap-2 sm:col-span-2">
              <span>Position</span>
              <Input
                onChange={(event) =>
                  updateStaffForm("title", event.target.value)
                }
                value={staffForm.title}
              />
            </Label>
          </div>

          <DialogFooter>
            <DialogClose onClose={closeStaffDialog} />
            <Button
              disabled={isSavingStaff}
              onClick={handleStaffSubmit}
              type="button"
            >
              {isSavingStaff ? "Saving..." : "Save staff"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        onOpenChange={(open) => {
          if (!open) {
            closeAssignmentDialog();
          }
        }}
        open={isAssignmentDialogOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assign to clinic</DialogTitle>
            <DialogDescription>
              Add a branch assignment for {selectedStaff ? getStaffName(selectedStaff) : "this staff member"}.
            </DialogDescription>
          </DialogHeader>

          <div className="mt-6 grid gap-4">
            <Label className="grid gap-2">
              <span>
                Clinic branch{" "}
                <span className="font-bold text-destructive">* Required</span>
              </span>
              <Select
                onChange={(event) =>
                  setAssignmentForm({ clinicId: event.target.value })
                }
                value={assignmentForm.clinicId}
              >
                <option value="">Select a clinic</option>
                {unassignedClinics.map((clinic) => (
                  <option key={clinic.id} value={clinic.id}>
                    {clinic.name}
                  </option>
                ))}
              </Select>
            </Label>
          </div>

          <DialogFooter>
            <DialogClose onClose={closeAssignmentDialog} />
            <Button
              disabled={isSavingAssignment}
              onClick={handleAssignmentSubmit}
              type="button"
            >
              {isSavingAssignment ? "Saving..." : "Save assignment"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
