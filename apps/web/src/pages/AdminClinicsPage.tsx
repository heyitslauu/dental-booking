import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus } from "lucide-react";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import type { Clinic } from "../features/booking/types";
import {
  createClinic,
  listAdminClinics,
  updateClinic,
  type ClinicFormPayload,
} from "../features/admin/clinics/api";

type ClinicFormState = {
  address: string;
  name: string;
  phone: string;
  slug: string;
};

const emptyForm: ClinicFormState = {
  address: "",
  name: "",
  phone: "",
  slug: "",
};

function getClinicFormState(clinic: Clinic | null): ClinicFormState {
  if (!clinic) {
    return emptyForm;
  }

  return {
    address: clinic.address ?? "",
    name: clinic.name,
    phone: clinic.phone ?? "",
    slug: clinic.slug,
  };
}

function getPayload(form: ClinicFormState): ClinicFormPayload {
  return {
    name: form.name.trim(),
    ...(form.slug.trim() ? { slug: form.slug.trim() } : {}),
    ...(form.address.trim() ? { address: form.address.trim() } : {}),
    ...(form.phone.trim() ? { phone: form.phone.trim() } : {}),
  };
}

export function AdminClinicsPage() {
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingClinic, setEditingClinic] = useState<Clinic | null>(null);
  const [form, setForm] = useState<ClinicFormState>(emptyForm);

  const clinicsQuery = useQuery({
    queryKey: ["admin", "clinics"],
    queryFn: listAdminClinics,
  });

  const createMutation = useMutation({
    mutationFn: createClinic,
    onSuccess: (clinic) => {
      toast.success("Clinic branch created.", {
        description: clinic.name,
      });
      closeDialog();
      void queryClient.invalidateQueries({ queryKey: ["admin", "clinics"] });
    },
    onError: (error) => {
      toast.error("Create failed.", {
        description:
          error instanceof Error
            ? error.message
            : "Unable to create clinic branch.",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: updateClinic,
    onSuccess: (clinic) => {
      toast.success("Clinic branch updated.", {
        description: clinic.name,
      });
      closeDialog();
      void queryClient.invalidateQueries({ queryKey: ["admin", "clinics"] });
    },
    onError: (error) => {
      toast.error("Update failed.", {
        description:
          error instanceof Error
            ? error.message
            : "Unable to update clinic branch.",
      });
    },
  });

  function openCreateDialog() {
    setEditingClinic(null);
    setForm(emptyForm);
    createMutation.reset();
    updateMutation.reset();
    setIsDialogOpen(true);
  }

  function openEditDialog(clinic: Clinic) {
    setEditingClinic(clinic);
    setForm(getClinicFormState(clinic));
    createMutation.reset();
    updateMutation.reset();
    setIsDialogOpen(true);
  }

  function closeDialog() {
    setIsDialogOpen(false);
    setEditingClinic(null);
    setForm(emptyForm);
    createMutation.reset();
    updateMutation.reset();
  }

  function updateForm(field: keyof ClinicFormState, value: string) {
    setForm((currentForm) => ({ ...currentForm, [field]: value }));
  }

  function handleSubmit() {
    const payload = getPayload(form);

    if (!payload.name) {
      toast.error("Clinic name is required.");
      return;
    }

    if (editingClinic) {
      updateMutation.mutate({
        clinicId: editingClinic.id,
        payload,
      });
      return;
    }

    createMutation.mutate(payload);
  }

  function toggleClinicStatus(clinic: Clinic) {
    updateMutation.mutate({
      clinicId: clinic.id,
      payload: { isActive: !clinic.isActive },
    });
  }

  const clinics = clinicsQuery.data ?? [];
  const isSaving = createMutation.isPending || updateMutation.isPending;

  return (
    <AdminLayout
      actions={
        <Button onClick={openCreateDialog} type="button">
          <Plus aria-hidden="true" className="mr-2 h-4 w-4" />
          New branch
        </Button>
      }
      description="Manage clinic branches, locations, and operational details."
      isRefreshing={clinicsQuery.isFetching}
      onRefresh={() => {
        void clinicsQuery.refetch();
      }}
      title="Clinics"
    >

        <Card>
          <CardHeader className="flex-row items-center justify-between gap-4 space-y-0">
            <CardTitle>Branches</CardTitle>
            <p className="text-sm text-muted-foreground">
              {clinicsQuery.isFetching
                ? "Refreshing..."
                : `${clinics.length} branches`}
            </p>
          </CardHeader>
          <CardContent>
            {clinicsQuery.error ? (
              <div className="grid gap-3 rounded-md border border-destructive/30 bg-destructive/10 p-4">
                <p className="text-sm font-medium text-destructive">
                  {clinicsQuery.error instanceof Error
                    ? clinicsQuery.error.message
                    : "Unable to load clinic branches."}
                </p>
                <Button
                  className="w-fit"
                  onClick={() => void clinicsQuery.refetch()}
                  type="button"
                  variant="outline"
                >
                  Retry
                </Button>
              </div>
            ) : null}

            {!clinicsQuery.error ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Clinic</TableHead>
                    <TableHead>Address</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {clinicsQuery.isLoading ? (
                    <TableRow>
                      <TableCell
                        className="py-8 text-center text-muted-foreground"
                        colSpan={5}
                      >
                        Loading clinic branches...
                      </TableCell>
                    </TableRow>
                  ) : null}

                  {!clinicsQuery.isLoading && clinics.length === 0 ? (
                    <TableRow>
                      <TableCell
                        className="py-8 text-center text-muted-foreground"
                        colSpan={5}
                      >
                        No clinic branches have been added yet.
                      </TableCell>
                    </TableRow>
                  ) : null}

                  {clinics.map((clinic) => (
                    <TableRow key={clinic.id}>
                      <TableCell>
                        <p className="font-medium">{clinic.name}</p>
                        <p className="mt-1 text-xs text-muted-foreground">
                          {clinic.slug}
                        </p>
                      </TableCell>
                      <TableCell>{clinic.address ?? "Not provided"}</TableCell>
                      <TableCell>{clinic.phone ?? "Not provided"}</TableCell>
                      <TableCell>
                        <Badge variant={clinic.isActive ? "success" : "muted"}>
                          {clinic.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex flex-wrap justify-end gap-2">
                          <Button
                            className="h-8 px-3"
                            onClick={() => openEditDialog(clinic)}
                            type="button"
                            variant="outline"
                          >
                            Edit
                          </Button>
                          <Button
                            className="h-8 px-3"
                            disabled={updateMutation.isPending}
                            onClick={() => toggleClinicStatus(clinic)}
                            type="button"
                            variant="outline"
                          >
                            {clinic.isActive ? "Deactivate" : "Activate"}
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
            closeDialog();
          }
        }}
        open={isDialogOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingClinic ? "Edit clinic branch" : "New clinic branch"}
            </DialogTitle>
            <DialogDescription>
              Manage the branch details shown to booking and back-office users.
            </DialogDescription>
          </DialogHeader>

          <div className="mt-6 grid gap-4">
            <Label className="grid gap-2">
              <span>
                Clinic name{" "}
                <span className="font-bold text-destructive">* Required</span>
              </span>
              <Input
                onChange={(event) => updateForm("name", event.target.value)}
                value={form.name}
              />
            </Label>

            <Label className="grid gap-2">
              <span>Slug</span>
              <Input
                className="placeholder:text-foreground/35"
                onChange={(event) => updateForm("slug", event.target.value)}
                placeholder="downtown"
                value={form.slug}
              />
            </Label>

            <Label className="grid gap-2">
              <span>Address</span>
              <Input
                onChange={(event) => updateForm("address", event.target.value)}
                value={form.address}
              />
            </Label>

            <Label className="grid gap-2">
              <span>Contact number</span>
              <Input
                onChange={(event) => updateForm("phone", event.target.value)}
                value={form.phone}
              />
            </Label>
          </div>

          <DialogFooter>
            <DialogClose onClose={closeDialog} />
            <Button disabled={isSaving} onClick={handleSubmit} type="button">
              {isSaving ? "Saving..." : "Save branch"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
