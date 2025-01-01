import { db } from '@/server/db'
import { Octokit } from 'octokit'
import axios from 'axios'
import { AisummariseCommit } from './gemini'
export const octokit = new Octokit({
	auth: process.env.GITHUB_TOKEN
})

const githubUrl = "https://github.com/docker/genai-stack"

interface Response {
	commitHash: string,
	commitMessage: string,
	commitAuthorName: string,
	commitAuthorAvatar: string,
	commitDate: string
}

export const getCommitHashes = async (githubUrl: string): Promise<Response[]> => {
	const [owner, repo] = githubUrl.split('/').slice(-2)
	if (!owner || !repo) {
		throw new Error("Invalid Github Url")
	}
	const { data } = await octokit.rest.repos.listCommits({
		owner,
		repo,
	})
	console.log("data ", data)
	const sortedCommits = data.sort((a: any, b: any) => new Date(b.commit.author.date).getTime() - new Date(a.commit.author.date).getTime()) as any[]
	
	console.log("sortedCommits ", sortedCommits)

	return sortedCommits.slice(0, 10).map((commit: any) => ({
		
		commitHash: commit.sha as string,
		commitMessage: commit.commit?.message ?? "",
		commitAuthorName: commit.commit?.author?.name ?? "",
		commitAuthorAvatar: commit.commit?.author?.avatar_url ?? "",
		commitDate: commit.commit?.author?.date ?? ""


	}))

}

export const pullCommits = async (projectId: string) => {
	const { project, githubUrl } = await fetchGithubUrl(projectId)
	const commitHashes = await getCommitHashes(githubUrl)
	const unProcessedCommits = await filterUnProcessedCommits(projectId, commitHashes)
	// console.log(unProcessedCommits);
	const summaryResponses = await Promise.allSettled(unProcessedCommits.map(commit=>{
		return summariseCommit(githubUrl, commit?.commitHash)
	}))
	const summarise = summaryResponses.map((response: any) => {
		if(response.status === 'fulfilled'){
			return response.value as string
		}
		return ""
	})
	const commits =await db.commit.createMany({
		data: summarise.map((summary, index) => { 
			// console.log("processing commits ", index, commitHashes[index]!.commitAuthorAvatar);
			return {
				projectId:projectId,
				commitHash:commitHashes[index]!.commitHash,
				commitMessage: commitHashes[index]!.commitMessage,
				summary:summary,
				commitAuthorAvatar: commitHashes[index]!.commitAuthorAvatar,
				commitAuthorName: commitHashes[index]!.commitAuthorName,
				commitDate: commitHashes[index]!.commitDate,

			
			}
		} )
	})

	return commits
}


const fetchGithubUrl = async (projectId: string) => {
	const project = await db.project.findUnique({
		where: {
			id: projectId
		}
		,
		select: {
			githubUrl: true
		}
	})
	if (!project?.githubUrl) {
		throw new Error("Project has not github url")
	}
	return {
		project, githubUrl: project?.githubUrl
	}
}

const filterUnProcessedCommits = async (projectId: string, commitHashes: Response[]) => {
	const processedCommits = await db.commit.findMany({
		where: {
			projectId
		}
	})

	const unProcessedCommits = commitHashes.filter((commit) => !processedCommits.some((processedCommit) =>
		processedCommit.commitHash === commit.commitHash
	))
	return unProcessedCommits

}



export const summariseCommit = async (githubUrl: string, commitHash: string) => {
	const { data } = await axios.get(`${githubUrl}/commit/${commitHash}.diff`, {
		headers: {
			'Accept': 'application/vnd.github.v3.diff'
		}
	})
	return await AisummariseCommit(data) || ""
}