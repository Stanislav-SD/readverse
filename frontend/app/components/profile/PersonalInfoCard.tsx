import { FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";

interface PersonalInfoCardProps {
  data: {
    Email: string;
  };
}

export default function PersonalInfoCard({ data }: PersonalInfoCardProps) {
  return (
    <div className="bg-[#D0BCA9] p-4 rounded-lg shadow-md">
      <h2 className="text-3xl mb-4 mt-4 font-interlight text-center">
        Personal information
      </h2>
      <div className="flex justify-between items-center py-2 border-b-2 border-black">
        <FaEnvelope className="font-inter text-2xl" />
        <span className="font-interlight text-2xl absolute left-1/2 transform -translate-x-1/2">
          {data.Email}
        </span>
      </div>
      <div className="flex justify-between items-center py-2">
        <FaMapMarkerAlt className="font-inter text-2xl" />
        <span className="font-interlight text-2xl absolute left-1/2 transform -translate-x-1/2">
          Bulgaria
        </span>
      </div>
    </div>
  );
}