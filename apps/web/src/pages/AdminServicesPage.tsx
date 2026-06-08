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
import { Textarea } from "../components/ui/textarea";
import { listAdminClinics } from "../features/admin/clinics/api";
import {
  createClinicService,
  createService,
  listAdminServices,
  updateClinicService,
  updateService,
  type AdminService,
} from "../features/admin/services/api";
import type { ClinicService } from "../features/booking/types";

type ServiceFormState = {
  description: string;
  name: string;
};

type OfferingFormState = {
  clinicId: string;
  durationMinutes: string;
  price: string;
};

const emptyServiceForm: ServiceFormState = {
  description: "",
  name: "",
};

const emptyOfferingForm: OfferingFormState = {
  clinicId: "",
  durationMinutes: "",
  price: "",
};

const iconButtonClass = "h-8 w-8 p-0";

function formatPrice(priceCents: number) {
  return new Intl.NumberFormat("en-PH", {
    currency: "PHP",
    style: "currency",
  }).format(priceCents / 100);
}

function getServiceFormState(service: AdminService | null): ServiceFormState {
  if (!service) {
    return emptyServiceForm;
  }

  return {
    description: service.description ?? "",
    name: service.name,
  };
}

function getOfferingFormState(
  service: AdminService | null,
  offering: ClinicService | null,
): OfferingFormState {
  if (!service || !offering) {
    return emptyOfferingForm;
  }

  return {
    clinicId: offering.clinicId,
    durationMinutes: String(offering.durationMinutes),
    price: String((offering.priceCents / 100).toFixed(2)),
  };
}

function getPriceCents(value: string) {
  return Math.round(Number(value) * 100);
}

export function AdminServicesPage() {
  const queryClient = useQueryClient();
  const [isServiceDialogOpen, setIsServiceDialogOpen] = useState(false);
  const [isOfferingDialogOpen, setIsOfferingDialogOpen] = useState(false);
  const [editingService, setEditingService] = useState<AdminService | null>(null);
  const [selectedService, setSelectedService] = useState<AdminService | null>(null);
  const [editingOffering, setEditingOffering] = useState<ClinicService | null>(null);
  const [serviceForm, setServiceForm] =
    useState<ServiceFormState>(emptyServiceForm);
  const [offeringForm, setOfferingForm] =
    useState<OfferingFormState>(emptyOfferingForm);

  const servicesQuery = useQuery({
    queryKey: ["admin", "services"],
    queryFn: listAdminServices,
  });

  const clinicsQuery = useQuery({
    queryKey: ["admin", "clinics"],
    queryFn: listAdminClinics,
  });

  const createServiceMutation = useMutation({
    mutationFn: createService,
    onSuccess: (service) => {
      toast.success("Service created.", { description: service.name });
      closeServiceDialog();
      void queryClient.invalidateQueries({ queryKey: ["admin", "services"] });
    },
    onError: (error) => {
      toast.error("Create failed.", {
        description:
          error instanceof Error ? error.message : "Unable to create service.",
      });
    },
  });

  const updateServiceMutation = useMutation({
    mutationFn: updateService,
    onSuccess: (service) => {
      toast.success("Service updated.", { description: service.name });
      closeServiceDialog();
      void queryClient.invalidateQueries({ queryKey: ["admin", "services"] });
    },
    onError: (error) => {
      toast.error("Update failed.", {
        description:
          error instanceof Error ? error.message : "Unable to update service.",
      });
    },
  });

  const createOfferingMutation = useMutation({
    mutationFn: createClinicService,
    onSuccess: () => {
      toast.success("Clinic offering assigned.");
      closeOfferingDialog();
      void queryClient.invalidateQueries({ queryKey: ["admin", "services"] });
    },
    onError: (error) => {
      toast.error("Assignment failed.", {
        description:
          error instanceof Error ? error.message : "Unable to assign service.",
      });
    },
  });

  const updateOfferingMutation = useMutation({
    mutationFn: updateClinicService,
    onSuccess: () => {
      toast.success("Clinic offering updated.");
      closeOfferingDialog();
      void queryClient.invalidateQueries({ queryKey: ["admin", "services"] });
    },
    onError: (error) => {
      toast.error("Update failed.", {
        description:
          error instanceof Error
            ? error.message
            : "Unable to update clinic offering.",
      });
    },
  });

  const services = servicesQuery.data ?? [];
  const clinics = clinicsQuery.data ?? [];
  const activeClinics = useMemo(
    () => clinics.filter((clinic) => clinic.isActive),
    [clinics],
  );
  const isSavingService =
    createServiceMutation.isPending || updateServiceMutation.isPending;
  const isSavingOffering =
    createOfferingMutation.isPending || updateOfferingMutation.isPending;

  function openCreateServiceDialog() {
    setEditingService(null);
    setServiceForm(emptyServiceForm);
    createServiceMutation.reset();
    updateServiceMutation.reset();
    setIsServiceDialogOpen(true);
  }

  function openEditServiceDialog(service: AdminService) {
    setEditingService(service);
    setServiceForm(getServiceFormState(service));
    createServiceMutation.reset();
    updateServiceMutation.reset();
    setIsServiceDialogOpen(true);
  }

  function closeServiceDialog() {
    setIsServiceDialogOpen(false);
    setEditingService(null);
    setServiceForm(emptyServiceForm);
    createServiceMutation.reset();
    updateServiceMutation.reset();
  }

  function openCreateOfferingDialog(service: AdminService) {
    setSelectedService(service);
    setEditingOffering(null);
    setOfferingForm(emptyOfferingForm);
    createOfferingMutation.reset();
    updateOfferingMutation.reset();
    setIsOfferingDialogOpen(true);
  }

  function openEditOfferingDialog(service: AdminService, offering: ClinicService) {
    setSelectedService(service);
    setEditingOffering(offering);
    setOfferingForm(getOfferingFormState(service, offering));
    createOfferingMutation.reset();
    updateOfferingMutation.reset();
    setIsOfferingDialogOpen(true);
  }

  function closeOfferingDialog() {
    setIsOfferingDialogOpen(false);
    setSelectedService(null);
    setEditingOffering(null);
    setOfferingForm(emptyOfferingForm);
    createOfferingMutation.reset();
    updateOfferingMutation.reset();
  }

  function updateServiceForm(field: keyof ServiceFormState, value: string) {
    setServiceForm((currentForm) => ({ ...currentForm, [field]: value }));
  }

  function updateOfferingForm(field: keyof OfferingFormState, value: string) {
    setOfferingForm((currentForm) => ({ ...currentForm, [field]: value }));
  }

  function handleServiceSubmit() {
    const payload = {
      name: serviceForm.name.trim(),
      description: serviceForm.description.trim() || null,
    };

    if (!payload.name) {
      toast.error("Service name is required.");
      return;
    }

    if (editingService) {
      updateServiceMutation.mutate({
        serviceId: editingService.id,
        payload,
      });
      return;
    }

    createServiceMutation.mutate(payload);
  }

  function toggleServiceStatus(service: AdminService) {
    updateServiceMutation.mutate({
      serviceId: service.id,
      payload: { isActive: !service.isActive },
    });
  }

  function handleOfferingSubmit() {
    if (!selectedService) {
      return;
    }

    const priceCents = getPriceCents(offeringForm.price);
    const durationMinutes = Number(offeringForm.durationMinutes);

    if (!editingOffering && !offeringForm.clinicId) {
      toast.error("Clinic branch is required.");
      return;
    }

    if (!Number.isInteger(priceCents) || priceCents < 0) {
      toast.error("Price must be zero or greater.");
      return;
    }

    if (!Number.isInteger(durationMinutes) || durationMinutes <= 0) {
      toast.error("Duration must be a positive whole number.");
      return;
    }

    if (editingOffering) {
      updateOfferingMutation.mutate({
        clinicServiceId: editingOffering.id,
        payload: { durationMinutes, priceCents },
      });
      return;
    }

    createOfferingMutation.mutate({
      clinicId: offeringForm.clinicId,
      serviceId: selectedService.id,
      durationMinutes,
      priceCents,
      isActive: true,
    });
  }

  function toggleOfferingStatus(offering: ClinicService) {
    updateOfferingMutation.mutate({
      clinicServiceId: offering.id,
      payload: { isActive: !offering.isActive },
    });
  }

  function getUnassignedClinics(service: AdminService | null) {
    if (!service) {
      return activeClinics;
    }

    const assignedClinicIds = new Set(
      service.clinicServices.map((offering) => offering.clinicId),
    );

    return activeClinics.filter((clinic) => !assignedClinicIds.has(clinic.id));
  }

  const unassignedClinics = getUnassignedClinics(selectedService);

  return (
    <AdminLayout
      actions={
        <Button
          aria-label="Create service"
          className="h-10 w-10 p-0"
          onClick={openCreateServiceDialog}
          title="Create service"
          type="button"
        >
          <Plus aria-hidden="true" className="h-4 w-4" />
        </Button>
      }
      title="Services"
    >

        <Card>
          <CardHeader className="flex-row items-center justify-between gap-4 space-y-0">
            <CardTitle>Global services</CardTitle>
            <p className="text-sm text-muted-foreground">
              {servicesQuery.isFetching
                ? "Refreshing..."
                : `${services.length} services`}
            </p>
          </CardHeader>
          <CardContent>
            {servicesQuery.error ? (
              <div className="grid gap-3 rounded-md border border-destructive/30 bg-destructive/10 p-4">
                <p className="text-sm font-medium text-destructive">
                  {servicesQuery.error instanceof Error
                    ? servicesQuery.error.message
                    : "Unable to load services."}
                </p>
                <Button
                  className="w-fit"
                  onClick={() => void servicesQuery.refetch()}
                  type="button"
                  variant="outline"
                >
                  Retry
                </Button>
              </div>
            ) : null}

            {!servicesQuery.error ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Service</TableHead>
                    <TableHead>Default duration</TableHead>
                    <TableHead>Clinic offerings</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {servicesQuery.isLoading ? (
                    <TableRow>
                      <TableCell
                        className="py-8 text-center text-muted-foreground"
                        colSpan={5}
                      >
                        Loading services...
                      </TableCell>
                    </TableRow>
                  ) : null}

                  {!servicesQuery.isLoading && services.length === 0 ? (
                    <TableRow>
                      <TableCell
                        className="py-8 text-center text-muted-foreground"
                        colSpan={5}
                      >
                        No services have been added yet.
                      </TableCell>
                    </TableRow>
                  ) : null}

                  {services.map((service) => (
                    <TableRow key={service.id}>
                      <TableCell className="min-w-64">
                        <p className="font-medium">{service.name}</p>
                        <p className="mt-1 max-w-md text-sm text-muted-foreground">
                          {service.description ?? "No description"}
                        </p>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-muted-foreground">
                          Managed per branch
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="grid gap-2">
                          {service.clinicServices.length === 0 ? (
                            <span className="text-sm text-muted-foreground">
                              Not assigned
                            </span>
                          ) : null}
                          {service.clinicServices.map((offering) => (
                            <div
                              className="flex flex-wrap items-center gap-2"
                              key={offering.id}
                            >
                              <Badge
                                variant={offering.isActive ? "success" : "muted"}
                              >
                                {offering.clinic.name}
                              </Badge>
                              <span className="text-sm text-muted-foreground">
                                {formatPrice(offering.priceCents)} /{" "}
                                {offering.durationMinutes} min
                              </span>
                              <Button
                                aria-label={`Edit ${offering.clinic.name} offering`}
                                className={iconButtonClass}
                                onClick={() =>
                                  openEditOfferingDialog(service, offering)
                                }
                                title={`Edit ${offering.clinic.name} offering`}
                                type="button"
                                variant="outline"
                              >
                                <Pencil aria-hidden="true" className="h-4 w-4" />
                              </Button>
                              <Button
                                aria-label={`${offering.isActive ? "Disable" : "Enable"} ${offering.clinic.name} offering`}
                                className={iconButtonClass}
                                disabled={updateOfferingMutation.isPending}
                                onClick={() => toggleOfferingStatus(offering)}
                                title={`${offering.isActive ? "Disable" : "Enable"} ${offering.clinic.name} offering`}
                                type="button"
                                variant="outline"
                              >
                                {offering.isActive ? (
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
                        <Badge variant={service.isActive ? "success" : "muted"}>
                          {service.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex flex-wrap justify-end gap-2">
                          <Button
                            aria-label={`Assign ${service.name} to a clinic`}
                            className={iconButtonClass}
                            onClick={() => openCreateOfferingDialog(service)}
                            title={`Assign ${service.name} to a clinic`}
                            type="button"
                            variant="outline"
                          >
                            <Plus aria-hidden="true" className="h-4 w-4" />
                          </Button>
                          <Button
                            aria-label={`Edit ${service.name}`}
                            className={iconButtonClass}
                            onClick={() => openEditServiceDialog(service)}
                            title={`Edit ${service.name}`}
                            type="button"
                            variant="outline"
                          >
                            <Pencil aria-hidden="true" className="h-4 w-4" />
                          </Button>
                          <Button
                            aria-label={`${service.isActive ? "Deactivate" : "Activate"} ${service.name}`}
                            className={iconButtonClass}
                            disabled={updateServiceMutation.isPending}
                            onClick={() => toggleServiceStatus(service)}
                            title={`${service.isActive ? "Deactivate" : "Activate"} ${service.name}`}
                            type="button"
                            variant="outline"
                          >
                            {service.isActive ? (
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
            closeServiceDialog();
          }
        }}
        open={isServiceDialogOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingService ? "Edit service" : "New service"}
            </DialogTitle>
            <DialogDescription>
              Manage the base service shared across clinic branches.
            </DialogDescription>
          </DialogHeader>

          <div className="mt-6 grid gap-4">
            <Label className="grid gap-2">
              <span>
                Service name{" "}
                <span className="font-bold text-destructive">* Required</span>
              </span>
              <Input
                onChange={(event) =>
                  updateServiceForm("name", event.target.value)
                }
                value={serviceForm.name}
              />
            </Label>
            <Label className="grid gap-2">
              <span>Description</span>
              <Textarea
                onChange={(event) =>
                  updateServiceForm("description", event.target.value)
                }
                value={serviceForm.description}
              />
            </Label>
          </div>

          <DialogFooter>
            <DialogClose onClose={closeServiceDialog} />
            <Button
              disabled={isSavingService}
              onClick={handleServiceSubmit}
              type="button"
            >
              {isSavingService ? "Saving..." : "Save service"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        onOpenChange={(open) => {
          if (!open) {
            closeOfferingDialog();
          }
        }}
        open={isOfferingDialogOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingOffering ? "Edit clinic offering" : "Assign to clinic"}
            </DialogTitle>
            <DialogDescription>
              Set the branch-specific price and duration for{" "}
              {selectedService?.name ?? "this service"}.
            </DialogDescription>
          </DialogHeader>

          <div className="mt-6 grid gap-4">
            <Label className="grid gap-2">
              <span>
                Clinic branch{" "}
                <span className="font-bold text-destructive">* Required</span>
              </span>
              <Select
                disabled={Boolean(editingOffering)}
                onChange={(event) =>
                  updateOfferingForm("clinicId", event.target.value)
                }
                value={offeringForm.clinicId}
              >
                <option value="">Select a clinic</option>
                {editingOffering && editingOffering.clinic ? (
                  <option value={editingOffering.clinicId}>
                    {editingOffering.clinic.name}
                  </option>
                ) : null}
                {!editingOffering
                  ? unassignedClinics.map((clinic) => (
                      <option key={clinic.id} value={clinic.id}>
                        {clinic.name}
                      </option>
                    ))
                  : null}
              </Select>
            </Label>
            <Label className="grid gap-2">
              <span>Price</span>
              <Input
                min="0"
                onChange={(event) =>
                  updateOfferingForm("price", event.target.value)
                }
                step="0.01"
                type="number"
                value={offeringForm.price}
              />
            </Label>
            <Label className="grid gap-2">
              <span>Duration minutes</span>
              <Input
                min="1"
                onChange={(event) =>
                  updateOfferingForm("durationMinutes", event.target.value)
                }
                step="1"
                type="number"
                value={offeringForm.durationMinutes}
              />
            </Label>
          </div>

          <DialogFooter>
            <DialogClose onClose={closeOfferingDialog} />
            <Button
              disabled={isSavingOffering}
              onClick={handleOfferingSubmit}
              type="button"
            >
              {isSavingOffering ? "Saving..." : "Save offering"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
