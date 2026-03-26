"use client";
import StreakCalendar from "@/app/components/dashboard/calenderStreak";
import WeekStat from "@/app/components/dashboard/weekStat";
import { useQuery, gql } from '@apollo/client';
import Loading from "../../loading";
const GetStats = gql`
  query GetStats {
    getStats {
      WeekRead
      CurrentReading
      PagesRead
      PagesReadForMonth
    }
  }
`;

const StatCard = ({ label, value }: { label: string; value: number | string }) => (
  <div className="bg-[#D0BCA9] p-4 rounded-lg shadow-md flex flex-col items-center">
    <h2 className="text-3xl mb-2">{label}</h2>
    <p className="text-3xl font-bold">{value}</p>
  </div>
);

export default function Dashboard() {
  const { loading, error, data } = useQuery(GetStats);
  
  if (loading) {
    return (
      <Loading />
    );
  }

  if (error) {
    return (
      <main className="flex justify-center items-center h-screen bg-black text-gray-200">
        <p className="text-red-500 text-2xl">Error: {error.message}</p>
      </main>
    );
  }

  const { WeekRead, CurrentReading, PagesRead, PagesReadForMonth } = data.getStats;
  //console.log(WeekRead);

  return (
    <main className="bg-black min-h-screen text-gray-200 px-4 py-8 lg:px-16 lg:py-12">
      <div className="text-black grid grid-cols-1 lg:grid-cols-1 mx-auto gap-8 w-full md:w-3/4 lg:w-2/3 xl:w-2/5">
        <h1 className="text-[#D0BCA9] text-5xl font-inter mb-0 text-left">
          Reading stats
        </h1>

        {/* 🟡 Loading indicator for stats */}
        {loading ? (
          <div className="flex justify-center items-center h-screen bg-black">
            <Loading />
          </div>
        ) : (
          <>
            {/* Weekly Reading */}
            <div className="bg-[#D0BCA9] p-4 rounded-lg shadow-md">
              <h2 className="text-4xl mb-4 mt-4 font-interlight text-center">
                Week read
              </h2>
              <WeekStat daysData={WeekRead} />
            </div>

            {/* Reading Streaks */}
            <div className="bg-[#D0BCA9] p-4 rounded-lg shadow-md">
              <h2 className="text-4xl mb-4 mt-4 font-interlight text-center">
                Reading streaks
              </h2>
              <div className="mt-[40px] mb-[40px]">
                <StreakCalendar streak={PagesReadForMonth} />
              </div>
            </div>

            {/* Stats Summary */}
            <div className="text-black grid grid-cols-1 lg:grid-cols-2 gap-8 mt-2">
              <StatCard label="Currently reading" value={CurrentReading} />
              <StatCard label="Pages read" value={PagesRead} />
            </div>
          </>
        )}
      </div>
    </main>
  );
};
