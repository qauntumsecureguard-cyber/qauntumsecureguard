import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { User } from "better-auth";

function ProfileHeader({ user }: { user: User }) {
  const joinDate = new Date(user.createdAt || Date.now()).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric'
  });

  const userName = user.name;

  return (
    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 sm:gap-6">
      <div className="flex flex-col justify-center items-center sm:flex-row gap-4 sm:gap-6">
        <Avatar className="h-20 sm:h-24 w-20 sm:w-24 border-2 border-accent">
          <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${userName?.split(" ")[0]}`} />
          <AvatarFallback>
            {userName?.split(" ")[0][0].toLocaleUpperCase()}{userName?.split(" ")[1][0].toLocaleUpperCase()}
          </AvatarFallback>
        </Avatar>

        <div className="text-center sm:text-left">
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">{userName}</h1>
          <p className="text-muted-foreground mt-1 text-sm sm:text-base">{user.email}</p>
          <p className="text-xs sm:text-sm text-muted-foreground mt-2">
            Member since {joinDate}
          </p>
        </div>
      </div>
    </div>
  )
}

export default ProfileHeader