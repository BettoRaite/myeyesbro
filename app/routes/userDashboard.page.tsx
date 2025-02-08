import GlassyBackground from "@/components/Backgrounds/GlassyBackground";
import ErrorScreen from "@/components/ErrorScreen";
import { GoBack } from "@/components/GoBack";
import { HeartLoader } from "@/components/HeartLoader";
import ComplimentCardLayout from "@/components/userDashboard/ComplimentCardLayout";
import { getAuth, useAuth } from "@/hooks/useAuth";
import { useComplimentMutation } from "@/hooks/useComplimentMutation";
import useProfileQuery from "@/hooks/useProfileQuery";
import useUserQuery from "@/hooks/useUserQuery";
import {
  createComplimentSchema,
  type CreateComplimentPayload,
} from "@/lib/schemas/compliment.schema";
import type { Profile } from "@/lib/types";
import { FormField } from "@/ui/formField/FormField";
import NavButton from "@/ui/NavButton";
import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence } from "motion/react";
import * as motion from "motion/react-client";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { MdEdit } from "react-icons/md";

export default function UserDashboard() {
  const { data: profiles, status } = useProfileQuery({
    type: "profiles",
    searchParams: "gender=female",
  });
  const mutation = useComplimentMutation();
  const [profileIndex, setProfileIndex] = useState(0);
  const methods = useForm<CreateComplimentPayload>({
    resolver: zodResolver(createComplimentSchema),
  });

  if (status === "pending") {
    return <HeartLoader />;
  }
  if (status === "error") {
    return <ErrorScreen description="Не получилось загрузить профили" />;
  }
  if (profiles.length === 0) {
    return "no profiles";
  }

  const currentProfile = profiles.at(profileIndex) as Profile;
  const len = profiles.length;

  function handleShiftTo(dir: "prev" | "next") {
    if (dir === "prev" && profileIndex > 0) {
      setProfileIndex(profileIndex - 1);
    }
    if (dir === "next" && profileIndex < len - 1) {
      setProfileIndex(profileIndex + 1);
    }
  }
  function handleCreateCompliment(payload: CreateComplimentPayload) {
    mutation.mutate({
      type: "create",
      profileId: currentProfile.id,
      payload,
    });
  }

  return (
    <main className="relative flex justify-center items-center flex-col">
      <GoBack to="/" className="hover:text-gray-700" theme="dark" />
      <GlassyBackground className="bg-gray-200 h-full" />
      <div className="relative rounded-xl h-[500px] p-4 mt-20 flex justify-center">
        <div className="hidden md:block w-[360px] h-96 bg-gray-300 absolute shadow-lg -left-[110%] -bottom-[5%] -rotate-[20deg] rounded-xl" />
        <div className="hidden md:block w-[360px] h-96 bg-gray-300 absolute shadow-lg -right-[110%] -bottom-[5%] rotate-[20deg] rounded-xl" />
        <AnimatePresence>
          <div className="h-auto w-[320px]">
            <motion.img
              animate={{ scale: [0.5, 1.0] }}
              key={currentProfile.id}
              className="object-cover rounded-lg"
              src={currentProfile.profileImageUrl}
              alt={currentProfile?.displayName}
            />
            <h1 className="text-center text-6xl font-bold mt-4 text-pink-400">
              {currentProfile.displayName}
            </h1>
            <div className="flex justify-between">
              <NavButton
                direction="left"
                onClick={() => handleShiftTo("prev")}
              />
              <NavButton
                direction="right"
                onClick={() => handleShiftTo("next")}
              />
            </div>
            {/* <SelectInput
              options={profiles.map((p) => {
                return {
                  value: p.id,
                  label: p.displayName,
                };
              })}
              onChange={(id) => setProfileId(id as number)}
              ctaText="Кто получит комплимент?"
              className="mt-4"
            /> */}
          </div>
        </AnimatePresence>
      </div>

      <section className="mt-16 w-[50%]">
        <FormProvider {...methods}>
          <motion.form
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onSubmit={methods.handleSubmit(handleCreateCompliment)}
            className="bg-white rounded-2xl shadow-xl p-8"
          >
            <h2 className="text-2xl font-bold text-gray-700 mb-6 flex items-center gap-2">
              Удиви девушку, напиши комплимент
              <MdEdit />
            </h2>

            <div className="space-y-6">
              <FormField<CreateComplimentPayload> fieldName="title">
                <FormField.Label content="Teма" className="text-[1rem]" />
                <FormField.Select
                  options={[
                    {
                      value: "Если бы мы встречались",
                      label: "Если бы мы встречались",
                    },
                  ]}
                  className="w-full f"
                />
              </FormField>

              <FormField<CreateComplimentPayload> fieldName="content">
                <FormField.TextArea
                  placeholder="Напиши что-нибудь..."
                  className="min-h-[150px] w-full p-4 border border-gray-200 rounded-xl focus:border-pink-300"
                />
              </FormField>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-pink-400 to-blue-500 text-white py-4 px-8 rounded-xl font-bold hover:shadow-lg transition-all flex items-center justify-center gap-2"
              >
                <MdEdit />
                Отправить
              </button>
            </div>
          </motion.form>
        </FormProvider>
      </section>
      <div className="mt-20">
        <h2 className="text-4xl font-bold text-gray-800 text-center w-full font-amatic bg-pink-300">
          Ищешь вдохновение?
        </h2>
        <p className="text-3xl font-bold text-gray-800 text-center w-full font-amatic">
          Тебе сюда
        </p>
      </div>
      <section className="w-[50%]">
        <ComplimentCardLayout
          key={currentProfile.id}
          profileId={currentProfile.id}
        />
      </section>
    </main>
  );
}
