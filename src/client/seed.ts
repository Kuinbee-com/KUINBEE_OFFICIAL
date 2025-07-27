import { prisma } from "./getPrismaClient";
import bcrypt from "bcrypt";
import { Gender, Role } from "@prisma/client";

const createSuperAdmin = async () => {
    try {
        const existingSuperAdmin = await prisma.auth.findFirst({ where: { role: "SUPERADMIN" } });

        if (existingSuperAdmin) {
            console.log("⚠️  SuperAdmin already exists, skipping creation");
            return { message: "SuperAdmin already exists" };
        }

        const superAdminData = {
            title: "Mr.",
            firstName: "Super",
            middleName: "Admin",
            lastName: "User",
            officialEmailId: "superadmin@company.com",
            personalEmailId: "superadmin.personal@gmail.com",
            phNo: BigInt("9876543210"),
            alternativePhNo: BigInt("9876543211"),
        };

        const personalInfoData = {
            address: "123 Admin Street, Tech City",
            fatherName: "Father Name",
            motherName: "Mother Name",
            gender: Gender.MALE,
            dob: new Date("1990-01-01"),
            city: "Tech City",
            state: "Tech State",
            country: "India",
            pinCode: "123456",
            nationality: "Indian",
            aadharUrl: "https://example.com/aadhar.pdf",
            panCardUrl: "https://example.com/pan.pdf"
        };

        // Auth data
        const authData = {
            emailId: superAdminData.officialEmailId,
            password: await bcrypt.hash("SuperAdmin@123", 12), // Hash the password
            role: Role.SUPERADMIN
        };

        // Create all records in a transaction
        const result = await prisma.$transaction(async (tx) => {
            const personalInfo = await tx.personalInfo.create({
                data: personalInfoData
            });

            // 2. Create SuperAdmin
            const superAdmin = await tx.superAdmin.create({
                data: {
                    ...superAdminData,
                    personalInfoId: personalInfo.id
                }
            });

            const auth = await tx.auth.create({
                data: {
                    ...authData,
                    superAdminId: superAdmin.id
                }
            });

            // 4. Create PasswordDetails
            const passwordDetails = await tx.passwordDetails.create({
                data: {
                    userId: auth.id,
                    password: authData.password,
                    updatePasswordTimeStamp: new Date()
                }
            });

            return {
                superAdmin,
                personalInfo,
                auth,
                passwordDetails
            };
        });

        console.log("🌱 SuperAdmin seeded successfully");
        console.log("📧 Email:", superAdminData.officialEmailId);
        console.log("🔐 Password: SuperAdmin@123");
        console.log("🆔 SuperAdmin ID:", result.superAdmin.id);

        return {
            message: "SuperAdmin created successfully",
            data: {
                id: result.superAdmin.id,
                email: superAdminData.officialEmailId,
                name: `${superAdminData.firstName} ${superAdminData.lastName}`
            }
        };

    } catch (error) {
        console.error("❌ Error creating SuperAdmin:", error);
        throw error;
    }
};

createSuperAdmin()
    .then((resolve) => {
        console.log("✅ Seed completed:", resolve);
    })
    .catch((reject) => {
        console.error("❌ Seed failed:", reject);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
        console.log("🔌 Database connection closed");
    });