import { PrismaClient, UserRole } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.appointment.deleteMany();
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
      name: "Bright Smile Dental Group"
    }
  });

  const [downtown, uptown] = await Promise.all([
    prisma.clinic.create({
      data: {
        organizationId: organization.id,
        name: "Bright Smile Downtown",
        slug: "downtown",
        address: "101 Main Street",
        phone: "+1 555 0101"
      }
    }),
    prisma.clinic.create({
      data: {
        organizationId: organization.id,
        name: "Bright Smile Uptown",
        slug: "uptown",
        address: "22 North Avenue",
        phone: "+1 555 0202"
      }
    })
  ]);

  const [cleaning, whitening, extraction] = await Promise.all([
    prisma.service.create({
      data: {
        name: "Dental Cleaning",
        description: "Routine cleaning and oral hygiene check."
      }
    }),
    prisma.service.create({
      data: {
        name: "Teeth Whitening",
        description: "In-clinic whitening treatment."
      }
    }),
    prisma.service.create({
      data: {
        name: "Tooth Extraction",
        description: "Simple extraction consultation and procedure."
      }
    })
  ]);

  await prisma.clinicService.createMany({
    data: [
      {
        clinicId: downtown.id,
        serviceId: cleaning.id,
        priceCents: 8500,
        durationMinutes: 45
      },
      {
        clinicId: downtown.id,
        serviceId: whitening.id,
        priceCents: 22000,
        durationMinutes: 60
      },
      {
        clinicId: uptown.id,
        serviceId: cleaning.id,
        priceCents: 9000,
        durationMinutes: 50
      },
      {
        clinicId: uptown.id,
        serviceId: extraction.id,
        priceCents: 18000,
        durationMinutes: 75
      }
    ]
  });

  const [drRiveraUser, drChenUser] = await Promise.all([
    prisma.user.create({
      data: {
        email: "dr.rivera@example.com",
        role: UserRole.STAFF
      }
    }),
    prisma.user.create({
      data: {
        email: "dr.chen@example.com",
        role: UserRole.STAFF
      }
    })
  ]);

  const [drRivera, drChen] = await Promise.all([
    prisma.staffProfile.create({
      data: {
        userId: drRiveraUser.id,
        firstName: "Maya",
        lastName: "Rivera",
        title: "Dentist"
      }
    }),
    prisma.staffProfile.create({
      data: {
        userId: drChenUser.id,
        firstName: "Elliot",
        lastName: "Chen",
        title: "Dental Hygienist"
      }
    })
  ]);

  await prisma.clinicStaff.createMany({
    data: [
      {
        clinicId: downtown.id,
        staffProfileId: drRivera.id
      },
      {
        clinicId: downtown.id,
        staffProfileId: drChen.id
      },
      {
        clinicId: uptown.id,
        staffProfileId: drRivera.id
      }
    ]
  });

  console.log("Seed data created");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
