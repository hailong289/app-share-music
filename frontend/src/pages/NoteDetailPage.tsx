import React from 'react'
import { useParams } from 'react-router-dom'

const NoteDetailPage = () => {
  const { id } = useParams()

  return (
    <div className="min-h-screen w-full">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Note Detail</h1>
        <p>Viewing note with ID: {id}</p>
      </div>
    </div>
  )
}

export default NoteDetailPage
