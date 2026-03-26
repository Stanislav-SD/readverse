"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface BookCardProps {
  id: number;
  image: string;
  title: string;
  author?: string;
  index?: number;
  showRank?: boolean;
}

export default function BookCard({ id, image, title, author, index, showRank = false }: BookCardProps) {
  const router = useRouter();

  return (
    <div className="relative group">
      <Image
        src={image}
        alt={title}
        onClick={() => router.push(`/bookPreview/${id}`)}
        width={400}
        height={800}
        className="w-full h-auto border-4 border-gray-800 rounded-lg shadow-md transition-transform cursor-pointer hover:scale-105"
      />
      {showRank && typeof index === "number" && (
        <div className="absolute top-0 left-0 transform -translate-x-1/4 -translate-y-1/4 text-6xl font-extrabold text-black bg-yellow-400 border-4 border-gray-800 p-2 rounded group-hover:scale-105 transition-transform">
          {index + 1}
        </div>
      )}
      <div className="mt-3 flex flex-col text-center items-center">
        <div className="font-inter text-xl">{title}</div>
        {author && <div className="font-interlight text-sm mt-1">{author}</div>}
      </div>
    </div>
  );
}
