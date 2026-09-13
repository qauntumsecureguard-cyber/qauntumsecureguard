"use client"

import ActiveSessions from "@/components/active-sessions"
import PersonalInfo from "@/components/personal-info"
import ProfileHeader from "@/components/profile-header"
import SecuritySettings from "@/components/security-settings"
import { Session, User } from "better-auth"
import { useState } from "react"

interface ProfileProps {
  session: {
    user: User,
    session: Session
  },
  sessions: Session[]
}

function ProfileClient({ session, sessions }: ProfileProps) {
  const [activeTab, setActiveTab] = useState("overview")

  return (
    <div className="min-h-screen">
      <div className="max-w-6xl mx-auto px-4 lg:px-8 pt-4 sm:pt-6 pb-20">
        <ProfileHeader user={session.user} />

        <div className="flex gap-2 mt-6 sm:mt-8 border-b border-border overflow-x-auto">
          {[
            { id: "overview", label: "Overview" },
            { id: "security", label: "Security" },
            { id: "sessions", label: "Sessions" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 sm:px-4 py-3 font-medium transition-colors whitespace-nowrap text-sm sm:text-base cursor-pointer ${activeTab === tab.id
                ? "text-primary border-b-2 border-primary"
                : "text-muted-foreground hover:text-foreground"
                }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="mt-6 sm:mt-8">
          {activeTab === "overview" && <PersonalInfo user={session.user} />}
          {activeTab === "security" && <SecuritySettings user={session.user} />}
          {activeTab === "sessions" && <ActiveSessions sessions={sessions} currentSession={session.session} />}
        </div>
      </div>
    </div>
  )
}

export default ProfileClient