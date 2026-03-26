"use client";
import { useQuery, gql } from '@apollo/client';
import Loading from "../../loading";
import ProfileCard from "../../components/profile/ProfileCard";
import PersonalInfoCard from "../../components/profile/PersonalInfoCard";

const GET_USER_INFO = gql`
  query GetInfo {
    me {
      Username
      Email
    }
  }
`;

export default function Profile() {
  const { loading, error, data } = useQuery(GET_USER_INFO);

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return (
      <main className="flex justify-center items-center h-screen bg-black text-gray-200">
        <p className="text-red-500 text-2xl">Error: {error.message}</p>
      </main>
    );
  }

  if (!data || !data.me) {
    return <p>No info</p>;
  }

  return (
    <main className="bg-black text-gray-200 px-4 py-8 lg:px-16 lg:py-12">
      <div className="text-black min-h-screen">
        <div className="grid grid-cols-1 lg:grid-cols-1 mx-auto w-full md:w-3/4 lg:w-2/3 xl:w-2/5 gap-8">
          <ProfileCard data={data.me} />
          <PersonalInfoCard data={data.me} />
          <div className="flex justify-between">
            <button className="flex text-left font-interlight text-lg text-white hover:underline">
              Change password
            </button>
            <button className="flex text-right font-interlight text-lg text-[#FF0010] hover:underline hover:font-inter opacity-65 hover:opacity-100">
              Delete account
            </button>
          </div>
        </div>
      </div>
    </main>
  );
};
