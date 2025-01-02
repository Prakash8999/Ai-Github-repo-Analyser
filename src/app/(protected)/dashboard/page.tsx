"use client"
import useProject from "@/hooks/use-project"
import { useUser } from "@clerk/nextjs"
import { ExternalLink, Github } from "lucide-react"
import Link from "next/link"
import CommitLog from "./commit-log"

const Dashboard =  () => {
	const { user } = useUser()
	const { project } = useProject()

	return (

		<div>
			<div className="flex flex-col items-center justify-center flex-wrap gap-y-4">
				<div className="w-fit rounded-md bg-primary px-4 py-3">
					<div className="flex items-center">
						<Github className="size-5 text-white" />
						<div className="ml-2">

							<p className="text-sm font-medium text-white">
								This project is linked to {" "}
								<Link href={project?.githubUrl ?? ""}
									target="_blank"
									className="inline-flex items-center text-white/80 hover:underline"
								>
									{project?.githubUrl}
									<ExternalLink />
								</Link>

							</p>
						</div>

					</div>

				</div>


				<div className="h-4" />

				<div className="flex items-center gap-4">
					Team Members
					Invite Btton
					Archive Button

				</div>
			</div>
			<div className="h-4">
				<div className="grid grid-cols-1 gap-4 sm:grid-cols-5">
					Ask Question
					Meeting Card

				</div>
			</div>

			<div className="mt-8"></div>
							<CommitLog/>
			
		</div>
	)
}

export default Dashboard