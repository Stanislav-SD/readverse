"use client";

import Image from "next/image";
import { FaLock } from "react-icons/fa";
import { useQuery, gql } from '@apollo/client';

const GET_BADGE_DATA = gql`
  query GetBadgeData {
    getBadges {
      Id
      Image
      Label
      Quest
    }
    getUserBadges {
      BadgeId
    }
  }
`;

export default function Badges() {
  const { data, loading, error } = useQuery(GET_BADGE_DATA);

  if (loading) return <div className="p-10 text-white">Loading badges...</div>;
  if (error) return <div className="p-10 text-red-500">Error: {error.message}</div>;

  const allBadges = data?.getBadges || [];
  const earnedIds = new Set(data?.getUserBadges?.map((b: any) => b.BadgeId) || []);

  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  
  const regularBadges = allBadges.filter((b: any) => !months.includes(b.Label));
  const monthlyGoals = allBadges.filter((b: any) => months.includes(b.Label));

  // const badges = [
  //   { img: "/badges/FirstTime.png", label: "First timer", quest: "Log your first reading session." },
  //   { img: "/badges/Regular.png", label: "A regular", quest: "Read for 7 days in a row." },
  //   { img: "/badges/Achiever.png", label: "Achiever", quest: "Finish 5 books." },
  //   { img: "/badges/Underground.png", label: "Underground", quest: "Read a book  with less than 100 ratings or from a lesser-known author" },
  // ];
  
  // const monthlyGoals = [
  //   { img: "/badges/January.png", label: "January", quest: "Start the year strong: read 300 pages." },
  //   { img: "/badges/February.png", label: "February", quest: "Short but sweet: finish 1 book." },
  //   { img: "/badges/March.png", label: "March", quest: "Build momentum: read for 10 days this month." },
  //   { img: "/badges/April.png", label: "April", quest: "Try something new: read a book from a new genre." },
  //   { img: "/badges/May.png", label: "May", quest: "Page turner: read 400 pages." },
  //   { img: "/badges/June.png", label: "June", quest: "Summer reads: finish 2 books." },
  //   { img: "/badges/July.png", label: "July", quest: "Reading streak: read 15 days this month." },
  //   { img: "/badges/August.png", label: "August", quest: "Deep focus: spend 10 hours reading." },
  //   { img: "/badges/September.png", label: "September", quest: "Back to routine: read 300 pages." },
  //   { img: "/badges/October.png", label: "October", quest: "Spooky season: read a mystery or horror book." },
  //   { img: "/badges/November.png", label: "November", quest: "Consistency wins: maintain a 7-day streak." },
  //   { img: "/badges/December.png", label: "December", quest: "Finish strong: complete 2 books." },
  // ];

  const BadgeItem = ({ badge }: { badge: any }) => {
      const isUnlocked = earnedIds.has(badge.Id);

      return (
          <div
              className={`relative bg-gray-800 rounded-lg p-4 flex flex-col items-center transition-all duration-300 ${
                  isUnlocked ? "hover:scale-105 shadow-lg shadow-yellow-900/20" : "opacity-60"
              }`}
          >
              {/* Lock Overlay for locked badges */}
              {!isUnlocked && (
                  <div className="absolute top-2 right-2 text-gray-500">
                      <FaLock size={14} />
                  </div>
              )}

              <Image
                  src={badge.Image}
                  alt={badge.Label}
                  width={100}
                  height={100}
                  className={`w-16 h-16 object-contain mb-2 ${!isUnlocked ? "grayscale brightness-50" : ""}`}
              />
              
              <p className={`text-xl text-center font-semibold ${isUnlocked ? "text-yellow-500" : "text-gray-400"}`}>
                  {badge.Label}
              </p>
              
              <p className="text-sm text-center border-t border-zinc-700 w-full mt-2 pt-2 text-gray-400">
                  {badge.Quest}
              </p>

              {/* Status Indicator */}
              <div className={`mt-2 text-xs font-bold uppercase ${isUnlocked ? "text-green-500" : "text-gray-600"}`}>
                  {isUnlocked ? "Unlocked" : "Locked"}
              </div>
          </div>
      );
  };

    return (
        <div className="bg-black text-white min-h-screen px-6 py-10">
            {/* Regular Badges Section */}
            <div className="mb-12">
                <div className="flex items-center gap-4 mb-6">
                    <h2 className="text-3xl font-bold">Your Badges</h2>
                    <span className="bg-zinc-800 text-zinc-400 px-3 py-1 rounded-full text-sm">
                        {regularBadges.filter((b: any) => earnedIds.has(b.Id)).length} / {regularBadges.length}
                    </span>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {regularBadges.map((badge: any) => (
                        <BadgeItem key={badge.Id} badge={badge} />
                    ))}
                </div>
            </div>

            {/* Monthly Goals Section */}
            <div>
                <div className="flex items-center gap-4 mb-6">
                    <h2 className="text-3xl font-bold">Monthly Roadmap</h2>
                    <span className="bg-zinc-800 text-zinc-400 px-3 py-1 rounded-full text-sm">
                        {monthlyGoals.filter((b: any) => earnedIds.has(b.Id)).length} / 12
                    </span>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {monthlyGoals.map((badge: any) => (
                        <BadgeItem key={badge.Id} badge={badge} />
                    ))}
                </div>
            </div>
        </div>
    );
};
