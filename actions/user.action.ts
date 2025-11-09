"use server";
import { PrismaClient, RequestStatus, Role } from "@prisma/client";
import { revalidatePath } from "next/cache";

import { IUser } from "@/interfaces";

const prisma = new PrismaClient();


export async function createUserAction({ id, email, name }: IUser) {
    if (!id || !email) return;

    const existingUser = await prisma.user.findUnique({ where: { id } });
    if (existingUser) return;

    await prisma.user.create({
        data: { id, email, name, role: "CLIENT", },
    });

}

export async function getUserByIdAction(id: string) {
    return await prisma.user.findUnique({
        where: { id },
    });
}

export async function addPrimumAccountAction({
    userId,
    storeName,
    description,
    phone,
    address,
    logoUrl,
}: {
    userId: string;
    storeName: string;
    description?: string;
    phone?: number;
    address?: string;
    logoUrl?: string;
}): Promise<{ success: boolean; message: string }> {
    if (!userId || !storeName) {
        return { success: false, message: "User ID and Store Name are required." };
    }

    const existingRequest = await prisma.sellerRequest.findFirst({
        where: { userId, status: "PENDING" },
    });

    if (existingRequest) {
        return { success: false, message: "You already have a pending request." };
    }

    await prisma.sellerRequest.create({
        data: {
            userId,
            name: storeName,
            description,
            phone,
            address,
            logoUrl,
        },
    });

    return { success: true, message: "Your request has been sent successfully!" };
}

export async function getUserSellerRequest(userId: string) {
    if (!userId) return null;

    try {
        const request = await prisma.sellerRequest.findFirst({
            where: { userId },
            orderBy: { createdAt: 'desc' },
        });
        return request;
    } catch (error) {
        console.error("Failed to fetch seller request:", error);
        return null;
    }
}



export async function getPendingSellerRequests() {
    const pendingRequests = await prisma.sellerRequest.findMany({

        include: {
            user: true,
        },
        orderBy: {
            createdAt: "desc",
        },
    });

    return pendingRequests;
}


export async function updateSellerRequestStatus(
    requestId: string,
    status: "APPROVED" | "REJECTED"
) {
    try {
        const request = await prisma.sellerRequest.findUnique({
            where: { id: requestId },
            include: { user: true },
        });

        if (!request) throw new Error("Request not found");

        const updatedRequest = await prisma.sellerRequest.update({
            where: { id: requestId },
            data: { status: status as RequestStatus },
        });

        if (status === "APPROVED") {
            await prisma.user.update({
                where: { id: request.userId },
                data: { role: Role.SELLER },
            });
        }

        revalidatePath("/requests");

        return { success: true, request: updatedRequest };
    } catch (error) {
        console.error(error);
        return { success: false, message: "Something went wrong" };
    }
}
