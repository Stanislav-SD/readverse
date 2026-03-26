import Image from "next/image";

interface ProfileCardProps {
  data: {
    Username: string;
  };
}

export default function ProfileCard({ data }: ProfileCardProps) {
  return (
    <>
      <h1 className="text-[#D0BCA9] text-5xl font-inter mb-0 text-left mr-1">
        Profile:
      </h1>
      <div className="flex justify-start items-end space-x-5">
        <Image
          width={100}
          height={100}
          src="/avatars/defaultAvatar.jpg"
          alt="Profile"
          className="w-[150px] rounded-full"
        />
        <h1 className="text-4xl text-white font-interlight">
          {data.Username}
        </h1>
      </div>
    </>
  );
}