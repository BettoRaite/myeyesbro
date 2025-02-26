import CreateProfileForm from "@/components/CreateProfileForm";
import { HeartLoader } from "@/components/HeartLoader";
import { useAuth } from "@/hooks/useAuth";
import useProfileQuery from "@/hooks/useProfileQuery";
import { useNavigate } from "react-router";
import type { Route } from "./+types/profile.page";
import { GoBack } from "@/components/GoBack";
import UserProfile from "@/components/UserProfile";
import GlassyBackground from "@/components/Backgrounds/GlassyBackground";
import ErrorScreen from "@/components/ErrorScreen";

export default function ProfilePage({ params }: Route.ComponentProps) {
  const userId = Number.parseInt(params.userId);
  const navigate = useNavigate();
  const { data: user, status } = useAuth();
  const {
    data: profile,
    status: profileStatus,
    error: profileError,
    refetch,
  } = useProfileQuery(
    {
      type: "profile",
      userId: userId,
    },
    {
      retry: 2,
      enabled: status !== "pending",
    }
  );
  const {
    data: viewerProfile,
    status: viewerProfileStatus,
    error: viewerProfileError,
  } = useProfileQuery(
    {
      type: "profile",
      userId: user?.id as number,
    },
    {
      retry: 2,
      enabled: status !== "pending",
    }
  );
  // Validate userId
  if (!Number.isFinite(userId) || userId < 0) {
    navigate("/");
    return null;
  }

  // Show loader while auth or profile data is loading
  if (profileStatus === "pending" || viewerProfileStatus === "pending") {
    return <HeartLoader />;
  }

  // Handle profile fetch errors (excluding 404)
  if (profileStatus === "error" && profileError?.status !== 404) {
    return <ErrorScreen description="Что-то пошло не так" />;
  }
  const role =
    user?.id === userId
      ? "owner"
      : user && viewerProfile
      ? "user"
      : "unauthenticated";
  return (
    <div className="flex justify-center min-h-dvh p-4 bg-gradient-to-tr to-slate-200 from-slate-400 ">
      <GoBack />
      {!profile && role === "owner" && (
        <CreateProfileForm userId={userId} onProfileRefetch={refetch} />
      )}
      {!profile && role !== "owner" && (
        <p className="text-xl font-comfortaa font-bold">
          Упс... кажись пусто 👀
        </p>
      )}
      {profile && <UserProfile profile={profile} role={role} />}
      {/* <img
        src="../public/tokyopeople.jpg"
        alt=""
        className="absolute w-full h-full bottom-0 -z-20 blur-xl"
      /> */}

      <GlassyBackground className="-z-10" intensity="medium" />
    </div>
  );
}
