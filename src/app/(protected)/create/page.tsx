'use client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import useRefetch from '@/hooks/use-refetch'
import { api } from '@/trpc/react'
import Image from 'next/image'
import React from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

interface FormInput {
	repoUrl: string,
	projectName: string,
	githubToken?: string
}

const CreatePage = () => {
	const { register, handleSubmit, reset } = useForm<FormInput>()
const refetch = useRefetch()
const createProject = api.project.createProject.useMutation()


	const onSubmit = (data: FormInput) => {
		// window.alert(JSON.stringify(data))
		createProject.mutate({
			githubUrl: data.repoUrl,
			name:data.projectName,
			githubToken: data.githubToken
		},{
			onSuccess: ()=>{
				toast.success("Project created successfully")
				refetch()
				reset()

			},
			onError: () =>{
				toast.error("Failed to create project")
			}
		})

		return true
	}

	return (
		<div className='flex items-center gap-12 h-full justify-center'>
			<Image
				alt='github'
				src={'/github-mark.png'}
				width={100} height={100}
			/>
			<div >
				<div >
					<h1 className='font-semibold text-2xl'>
						Link your GitHub Repository
					</h1>
					<p className='text-sm text-muted-foreground'>
						Enter the URL of your repository to link it to SAAS
					</p>

				</div>
				<div className="h-4" />

				<div >
					<form onSubmit={handleSubmit(onSubmit)}>
						<Input
							{...register('projectName', {
								required: true
							})}
							placeholder='Project Name'
							required
						/>
						<div className='h-2' />
						<Input
							{...register('repoUrl', {
								required: true
							})}
							type='url'
							placeholder='Repository Url'
							required
						/>
						<div className='h-2' />
						<Input
							{...register('githubToken')}
							placeholder='GitHub Token (Optional)'

						/>

						<div className="h-4" />

						<Button type='submit' disabled={createProject.isPending}>
							Create Project
						</Button>
					</form>
				</div>
			</div>

		</div>
	)
}

export default CreatePage