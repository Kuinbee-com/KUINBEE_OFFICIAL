import { PrismaClient } from "@prisma/client";
import { hashPassword } from "../utility/common/security/crypto";
const prisma = new PrismaClient();

async function main() {
    await prisma.superAdmin.create({
        data: {
            title: "Mr.",
            firstName: "Om",
            middleName: "K",
            lastName: "Argade",
            officialEmailId: "superadmin@kuinbee.com",
            personalEmailId: "om.personal@example.com",
            phNo: BigInt("9999999999"),
            alternativePhNo: BigInt("8888888888"),
            PersonalInfo: {
                create: {
                    address: "123 Main Street",
                    aadharUrl: "https://example.com/aadhar.pdf",
                    panCardUrl: "https://example.com/pan.pdf",
                    fatherName: "John Doe",
                    motherName: "Jane Doe",
                    gender: "MALE",
                    dob: new Date("1990-01-01"),
                    city: "Mumbai",
                    state: "Maharashtra",
                    country: "India",
                    pinCode: "400001",
                    nationality: "Indian"
                }
            },
            Auth: {
                create: {
                    emailId: "superadmin@kuinbee.com",
                    password: await hashPassword("superadmin@1234"),
                    role: "SUPERADMIN"
                }
            }
        }
    });

    console.log("✅ SuperAdmin created successfully!");
}

main()
    .catch((e) => {
        console.error("❌ Error seeding SuperAdmin:", e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
