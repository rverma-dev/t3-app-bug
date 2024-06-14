"use client";

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { api } from '@/trpc/react'
import { VideoDAO } from '@/server/api/routers/video'

export function CreateVideo() {
  const router = useRouter()
  const [vid, setVid] = useState({
    id: '',
    title: '',
    uploadId: '',
    url: '',
    status: 'PENDING',
  })

  const addNewVideo = api.video.add.useMutation({
    onSuccess: () => {
      router.refresh()
      setVid({
        id: vid.id,
        title: 'hi',
        uploadId: 'upload-1',
        url: 'https://youtube.com/',
        status: 'PENDING',
      })
    },
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setVid((prevData) => ({
      ...prevData,
      [name]: value,
    }))
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const parseResult = VideoDAO.safeParse(vid)
    if (!parseResult.success) {
      console.error(parseResult.error.errors)
      return
    }

    addNewVideo.mutate(parseResult.data)
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2">
      <input
        type="text"
        name="id"
        placeholder="ID"
        value={vid.id}
        onChange={handleChange}
        className="w-full rounded-full px-4 py-2 text-black"
      />
      <input
        type="text"
        name="title"
        placeholder="Title"
        value={vid.title}
        onChange={handleChange}
        className="w-full rounded-full px-4 py-2 text-black"
      />
      <input
        type="text"
        name="uploadId"
        placeholder="Upload ID"
        value={vid.uploadId}
        onChange={handleChange}
        className="w-full rounded-full px-4 py-2 text-black"
      />
      <input
        type="text"
        name="url"
        placeholder="URL"
        value={vid.url}
        onChange={handleChange}
        className="w-full rounded-full px-4 py-2 text-black"
      />
      <select
        name="status"
        value={vid.status}
        onChange={handleChange}
        className="w-full rounded-full px-4 py-2 text-black"
      >
        <option value="PENDING">PENDING</option>
        <option value="STARTED">STARTED</option>
        <option value="COMPLETED">COMPLETED</option>
      </select>
      <button
        type="submit"
        className="rounded-full bg-white/10 px-10 py-3 font-semibold transition hover:bg-white/20"
        disabled={addNewVideo.isPending}
      >
        {addNewVideo.isPending ? 'Submitting...' : 'Submit'}
      </button>
    </form>
  )
}
