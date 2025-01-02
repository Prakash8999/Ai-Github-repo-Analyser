import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { pullCommits } from "@/lib/github";

export const projectRouter = createTRPCRouter({
	createProject: protectedProcedure.input(z.object({
		name: z.string(),
		githubUrl: z.string(),
		githubToken: z.string().optional()

	})).mutation(async ({
		ctx, input
	}) => {

		const project = await ctx.db.project.create({
			data:{
				githubUrl:input.githubUrl,
				name: input.name,
				UserToProject:{
					create:{
						userId:ctx.user.userId!,
					}
				}
			}
		})
		await pullCommits(project.id)
		return project
	}),
	getProject: protectedProcedure.query(async ({ctx})=>{
		return await ctx.db.project.findMany({
			where:{
				UserToProject:{ 
					some:{
						userId:ctx.user.userId!
					}
				},
				deltedAt:null
			}
		})
	}),
	getCommits: protectedProcedure.input(z.object({
		projectId: z.string()
	})).query(async ({ctx, input})=>{

		pullCommits(input.projectId).then().catch(console.error)
		return await ctx.db.commit.findMany({ 
			where:{ 
				projectId:input.projectId
			}
		})
	})

})