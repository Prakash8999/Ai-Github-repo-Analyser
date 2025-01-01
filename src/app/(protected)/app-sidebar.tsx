"use client"

import { Button } from "@/components/ui/button"
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from "@/components/ui/sidebar"
import useProject from "@/hooks/use-project"
import { cn } from "@/lib/utils"
import { Bot, CreditCard, LayoutDashboard, Plus, Presentation } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"

export function AppSideBar() {
	const pathname = usePathname()
	const items = [
		{
			id: 1,
			title: "Dashboard",
			url: "/dashboard",
			icon: LayoutDashboard
		},

		{
			id: 2,
			title: "Q&A",
			url: "/qa",
			icon: Bot
		},

		{
			id: 3,
			title: "Meetings",
			url: "/meetings",
			icon: Presentation
		},

		{
			id: 4,
			title: "Billing",
			url: "/billing",
			icon: CreditCard
		},

	]
	
	const { open } = useSidebar()
	const {projects, projectId, setProjectId, project} =useProject()
	console.log("project ", project )
	return (
		<Sidebar collapsible="icon" variant="floating">
			<SidebarHeader>
				<div className="flex items-center gap-2">
					<Image src={'/logo.jpg'} alt="logo" width={50} height={50} />
					{
						open &&
						<h1 className="text-xl font-bold text-primary/80">
							SAAS
						</h1>
					}

				</div>
			</SidebarHeader>
			<SidebarContent>
				<SidebarGroup>
					<SidebarGroupLabel>
						Application
					</SidebarGroupLabel>
					<SidebarGroupContent>
						<SidebarMenu>
							{
								items.map(item => {
									return (
										<SidebarMenuItem key={item.id}>
											<SidebarMenuButton asChild>
												<Link href={item.url} className={cn(
													{ '!bg-primary !text-white ': pathname === item.url }
												)}>
													<item.icon />
													<span>
														{item.title}
													</span>

												</Link>
											</SidebarMenuButton>

										</SidebarMenuItem>
									)
								})
							}

						</SidebarMenu>

					</SidebarGroupContent>
				</SidebarGroup>

				<SidebarGroup>
					<SidebarGroupLabel>
						Your Projects
					</SidebarGroupLabel>
					<SidebarGroupContent>
						<SidebarMenu>
							{
								projects?.map(project => {
									return (
										<SidebarMenuItem key={project.id}>
											<SidebarMenuButton asChild>
												<div onClick={()=>{
													setProjectId(project.id)
												}}>
													<div className={
														cn(
															"rounded-sm border size-6 flex items-center justify-center text-sm bg-white text-primary",
															{

																'bg-primary text-white' :  project.id === projectId
																// 'bg-primary text-white': true

															}
														)
													}>
														{
															project.name[0]
														}

													</div>
													<span>
														{project.name}
													</span>
												</div>
											</SidebarMenuButton>

										</SidebarMenuItem>
									)
								})
							}
							<div className="h-2" />
							{
								open &&
							<SidebarMenuItem>
								<Link href="/create">
									<Button variant={'outline'}>
										<Plus />
										Create Project
									</Button>

								</Link>
							</SidebarMenuItem>
							}
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>

			</SidebarContent>


		</Sidebar>
	)
} 