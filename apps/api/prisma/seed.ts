import {
  AppointmentStatus,
  ClinicAccessRole,
  PrismaClient,
  UserRole,
} from "@prisma/client";
import * as bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const defaultPassword = "Admin123!";
const staffPassword = "Staff123!";
const dentistPassword = "Dentist123!";

async function main() {
  await prisma.appointment.deleteMany();
  await prisma.userClinicAccess.deleteMany();
  await prisma.clinicService.deleteMany();
  await prisma.clinicStaff.deleteMany();
  await prisma.patientProfile.deleteMany();
  await prisma.staffProfile.deleteMany();
  await prisma.service.deleteMany();
  await prisma.user.deleteMany();
  await prisma.clinic.deleteMany();
  await prisma.organization.deleteMany();

  const organization = await prisma.organization.create({
    data: {
      name: "Magayon Dental Clinic",
    },
  });

  const superAdmin = await prisma.user.create({
    data: {
      email: process.env.SEED_ADMIN_EMAIL || "laurencecadag1@gmail.com",
      passwordHash: await bcrypt.hash(
        process.env.SEED_ADMIN_PASSWORD || defaultPassword,
        12,
      ),
      role: UserRole.SUPER_ADMIN,
    },
  });

  const orgAdmin = await prisma.user.create({
    data: {
      email: process.env.SEED_ORG_ADMIN_EMAIL || "admin@magayondental.com",
      passwordHash: await bcrypt.hash(
        process.env.SEED_ORG_ADMIN_PASSWORD || defaultPassword,
        12,
      ),
      role: UserRole.ORG_ADMIN,
    },
  });

  const [daragaClinic, ligaoClinic] = await Promise.all([
    prisma.clinic.create({
      data: {
        organizationId: organization.id,
        name: "Magayon Dental Clinic - Daraga",
        slug: "magayon-dental-clinic-daraga",
        address: "Ilawod 1, Daraga",
        phone: "0969 363 6426",
      },
    }),
    prisma.clinic.create({
      data: {
        organizationId: organization.id,
        name: "Magayon Dental Clinic - Ligao",
        slug: "magayon-dental-clinic-ligao",
        address: "2nd floor, EY 1217 Building, McKinley St., Brgy. Calzada, Ligao City, Albay",
        phone: "0969 363 6426",
      },
    }),
  ]);

  const clinicAdminUsers = await Promise.all([
    prisma.user.create({
      data: {
        email: "daraga.admin@magayondental.com",
        passwordHash: await bcrypt.hash(defaultPassword, 12),
        role: UserRole.STAFF,
      },
    }),
    prisma.user.create({
      data: {
        email: "ligao.admin@magayondental.com",
        passwordHash: await bcrypt.hash(defaultPassword, 12),
        role: UserRole.STAFF,
      },
    }),
  ]);

  const services = await Promise.all(
    [
      {
        name: "Oral Prophylaxis",
        description: "Routine cleaning and plaque removal for preventive care.",
      },
      {
        name: "Dental Consultation",
        description: "General dental assessment and treatment planning.",
      },
      {
        name: "Tooth Restoration",
        description: "Composite filling for decayed or damaged teeth.",
      },
      {
        name: "Tooth Extraction",
        description: "Simple extraction with post-operative instructions.",
      },
      {
        name: "Wisdom Tooth Evaluation",
        description: "Assessment and planning for impacted third molars.",
      },
      {
        name: "Teeth Whitening",
        description: "Chairside whitening for brighter smiles.",
      },
      {
        name: "Dental Crown",
        description: "Crown preparation and fitting for damaged teeth.",
      },
      {
        name: "Root Canal Therapy",
        description: "Endodontic treatment for infected tooth pulp.",
      },
      {
        name: "Braces Adjustment",
        description: "Orthodontic adjustment and progress monitoring.",
      },
      {
        name: "Dentures Consultation",
        description: "Evaluation and planning for removable dentures.",
      },
      {
        name: "Fluoride Treatment",
        description: "Preventive fluoride application for enamel protection.",
      },
      {
        name: "Pediatric Dental Checkup",
        description: "Child-friendly dental examination and oral care guidance.",
      },
    ].map((service) =>
      prisma.service.create({
        data: {
          organizationId: organization.id,
          ...service,
        },
      }),
    ),
  );

  await prisma.clinicService.createMany({
    data: services.flatMap((service, index) => {
      const basePrice = 50000 + index * 15000;
      const baseDuration = 30 + (index % 5) * 15;

      return [
        {
          clinicId: daragaClinic.id,
          serviceId: service.id,
          priceCents: basePrice,
          durationMinutes: baseDuration,
        },
        {
          clinicId: ligaoClinic.id,
          serviceId: service.id,
          priceCents: basePrice + 5000,
          durationMinutes: baseDuration,
        },
      ];
    }),
  });

  const staffSeed = [
    {
      email: "dr.althea.reyes@magayondental.com",
      firstName: "Althea",
      lastName: "Reyes",
      title: "General Dentist",
      accessRole: ClinicAccessRole.DENTIST,
      clinics: [daragaClinic.id, ligaoClinic.id],
    },
    {
      email: "dr.miguel.santos@magayondental.com",
      firstName: "Miguel",
      lastName: "Santos",
      title: "Orthodontist",
      accessRole: ClinicAccessRole.DENTIST,
      clinics: [daragaClinic.id],
    },
    {
      email: "dr.camille.borja@magayondental.com",
      firstName: "Camille",
      lastName: "Borja",
      title: "Pediatric Dentist",
      accessRole: ClinicAccessRole.DENTIST,
      clinics: [ligaoClinic.id],
    },
    {
      email: "dr.paolo.navarro@magayondental.com",
      firstName: "Paolo",
      lastName: "Navarro",
      title: "Endodontist",
      accessRole: ClinicAccessRole.DENTIST,
      clinics: [daragaClinic.id, ligaoClinic.id],
    },
    {
      email: "ana.cruz@magayondental.com",
      firstName: "Ana",
      lastName: "Cruz",
      title: "Dental Hygienist",
      accessRole: ClinicAccessRole.ASSISTANT,
      clinics: [daragaClinic.id],
    },
    {
      email: "bea.mendoza@magayondental.com",
      firstName: "Bea",
      lastName: "Mendoza",
      title: "Dental Assistant",
      accessRole: ClinicAccessRole.ASSISTANT,
      clinics: [ligaoClinic.id],
    },
    {
      email: "carlo.villanueva@magayondental.com",
      firstName: "Carlo",
      lastName: "Villanueva",
      title: "Dental Assistant",
      accessRole: ClinicAccessRole.ASSISTANT,
      clinics: [daragaClinic.id, ligaoClinic.id],
    },
    {
      email: "dianne.robles@magayondental.com",
      firstName: "Dianne",
      lastName: "Robles",
      title: "Receptionist",
      accessRole: ClinicAccessRole.RECEPTIONIST,
      clinics: [daragaClinic.id],
    },
    {
      email: "erika.salcedo@magayondental.com",
      firstName: "Erika",
      lastName: "Salcedo",
      title: "Receptionist",
      accessRole: ClinicAccessRole.RECEPTIONIST,
      clinics: [ligaoClinic.id],
    },
    {
      email: "francis.dimapilis@magayondental.com",
      firstName: "Francis",
      lastName: "Dimapilis",
      title: "Clinic Coordinator",
      accessRole: ClinicAccessRole.RECEPTIONIST,
      clinics: [daragaClinic.id, ligaoClinic.id],
    },
  ];

  const staffProfiles = await Promise.all(
    staffSeed.map(async (staff) => {
      const user = await prisma.user.create({
        data: {
          email: staff.email,
          passwordHash: await bcrypt.hash(
            staff.accessRole === ClinicAccessRole.DENTIST
              ? dentistPassword
              : staffPassword,
            12,
          ),
          role: UserRole.STAFF,
        },
      });

      await prisma.userClinicAccess.createMany({
        data: staff.clinics.map((clinicId) => ({
          userId: user.id,
          clinicId,
          role: staff.accessRole,
        })),
      });

      const staffProfile = await prisma.staffProfile.create({
        data: {
          userId: user.id,
          firstName: staff.firstName,
          lastName: staff.lastName,
          title: staff.title,
        },
      });

      await prisma.clinicStaff.createMany({
        data: staff.clinics.map((clinicId) => ({
          clinicId,
          staffProfileId: staffProfile.id,
        })),
      });

      return staffProfile;
    }),
  );

  await prisma.userClinicAccess.createMany({
    data: [
      ...[daragaClinic.id, ligaoClinic.id].flatMap((clinicId) => [
        {
          userId: superAdmin.id,
          clinicId,
          role: ClinicAccessRole.CLINIC_ADMIN,
        },
        {
          userId: orgAdmin.id,
          clinicId,
          role: ClinicAccessRole.CLINIC_ADMIN,
        },
      ]),
      {
        userId: clinicAdminUsers[0].id,
        clinicId: daragaClinic.id,
        role: ClinicAccessRole.CLINIC_ADMIN,
      },
      {
        userId: clinicAdminUsers[1].id,
        clinicId: ligaoClinic.id,
        role: ClinicAccessRole.CLINIC_ADMIN,
      },
    ],
  });

  const [daragaAdminProfile, ligaoAdminProfile] = await Promise.all([
    prisma.staffProfile.create({
      data: {
        userId: clinicAdminUsers[0].id,
        firstName: "Grace",
        lastName: "Imperial",
        title: "Daraga Clinic Admin",
      },
    }),
    prisma.staffProfile.create({
      data: {
        userId: clinicAdminUsers[1].id,
        firstName: "Jonas",
        lastName: "Belen",
        title: "Ligao Clinic Admin",
      },
    }),
  ]);

  await prisma.clinicStaff.createMany({
    data: [
      {
        clinicId: daragaClinic.id,
        staffProfileId: daragaAdminProfile.id,
      },
      {
        clinicId: ligaoClinic.id,
        staffProfileId: ligaoAdminProfile.id,
      },
    ],
  });

  const patients = await Promise.all(
    [
      ["Maria", "Ortega", "maria.ortega@example.com", "0917 101 2201"],
      ["Jose", "Bautista", "jose.bautista@example.com", "0917 101 2202"],
      ["Angelica", "Ramos", "angelica.ramos@example.com", "0917 101 2203"],
      ["Rafael", "Aquino", "rafael.aquino@example.com", "0917 101 2204"],
      ["Nicole", "Llaneta", "nicole.llaneta@example.com", "0917 101 2205"],
      ["Mark", "Barcelon", "mark.barcelon@example.com", "0917 101 2206"],
      ["Jessa", "Miranda", "jessa.miranda@example.com", "0917 101 2207"],
      ["Adrian", "San Juan", "adrian.sanjuan@example.com", "0917 101 2208"],
      ["Bianca", "Rosales", "bianca.rosales@example.com", "0917 101 2209"],
      ["Kenneth", "Ocampo", "kenneth.ocampo@example.com", "0917 101 2210"],
      ["Lara", "Buenaventura", "lara.buenaventura@example.com", "0917 101 2211"],
      ["Noel", "Velasco", "noel.velasco@example.com", "0917 101 2212"],
    ].map(([firstName, lastName, email, phone], index) =>
      prisma.patientProfile.create({
        data: {
          firstName,
          lastName,
          email,
          phone,
          birthDate: new Date(1988 + index, index % 12, 10 + (index % 15)),
        },
      }),
    ),
  );

  const appointmentClinics = [daragaClinic, ligaoClinic];
  const daragaStaffProfiles = staffProfiles.filter((_, index) =>
    staffSeed[index].clinics.includes(daragaClinic.id),
  );
  const ligaoStaffProfiles = staffProfiles.filter((_, index) =>
    staffSeed[index].clinics.includes(ligaoClinic.id),
  );
  const appointmentStatuses = [
    AppointmentStatus.PENDING,
    AppointmentStatus.CONFIRMED,
    AppointmentStatus.COMPLETED,
    AppointmentStatus.CANCELLED,
    AppointmentStatus.NO_SHOW,
  ];

  await prisma.appointment.createMany({
    data: patients.map((patient, index) => {
      const clinic = appointmentClinics[index % appointmentClinics.length];
      const service = services[index % services.length];
      const availableStaff =
        clinic.id === daragaClinic.id ? daragaStaffProfiles : ligaoStaffProfiles;
      const staff = availableStaff[index % availableStaff.length];
      const startAt = new Date();
      startAt.setDate(startAt.getDate() + index - 3);
      startAt.setHours(9 + (index % 7), index % 2 === 0 ? 0 : 30, 0, 0);

      const endAt = new Date(startAt);
      endAt.setMinutes(endAt.getMinutes() + 45 + (index % 4) * 15);

      return {
        referenceNumber: `MAG-${String(index + 1).padStart(5, "0")}`,
        clinicId: clinic.id,
        serviceId: service.id,
        patientProfileId: patient.id,
        staffProfileId: staff.id,
        startAt,
        endAt,
        status: appointmentStatuses[index % appointmentStatuses.length],
        notes:
          index % 3 === 0
            ? "Patient requested SMS confirmation before the visit."
            : null,
      };
    }),
  });

  console.log("Magayon Dental Clinic seed data created");
  console.log(`Super admin: ${superAdmin.email} / ${defaultPassword}`);
  console.log(`Clinic staff default password: ${staffPassword}`);
  console.log(`Dentist default password: ${dentistPassword}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
