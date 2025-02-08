'use server'

import { auth } from "@/auth"
import prisma from "@/lib/prisma"


export const approveNotification = async (groupId: string) => {
    try {
        const sesion = await auth()

        if(!sesion || !sesion.user?.id){
            return {
                success:false,
                status:401,
                message: "Unauthorized"
            }
        }
        const existGroup = await prisma.group.findFirst({
            where:{
                id: groupId
            }
        })
        if(!existGroup){
            return {
                success:false,
                status:403,
                message: "Group Not Found"
            }
        }
        await prisma.group.update({
            where:{
                id:groupId
            },
            data:{
                groupUsers:{
                    connect:{
                        id:sesion.user.id
                    }
                }
            }
        })
    } catch (error) {
        
    }
}