import React from 'react'

const ProfilePage = () => {
  return (
    <div className="min-h-screen w-full">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">User Profile</h1>
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">John Doe</h2>
            <p>Email: john.doe@example.com</p>
            <p>Member since: January 2025</p>
            <div className="card-actions justify-end">
              <button className="btn btn-primary">Edit Profile</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfilePage
