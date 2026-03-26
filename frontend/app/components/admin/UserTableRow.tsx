import React, { memo, useCallback } from 'react';
import { User } from '../../../types/User';
import { HiOutlineChatBubbleLeftRight } from "react-icons/hi2";
import { LuPencil } from "react-icons/lu";
import { CiTrash } from "react-icons/ci";


interface UserTableRowProps {
  user: User;
  userData: User;
}

function UserTableRow({ user, userData }: UserTableRowProps) {
  const canEdit = (user.email !== userData.email) && ((user.role === "ADMIN" && userData.role === "SUPERADMIN") || user.role === "USER");

  const handleChatClick = useCallback(() => {
    // handle chat click logic here
  }, []);

  const handleEditClick = useCallback(() => {
    // handle edit click logic here
  }, []);

  const handleDeleteClick = useCallback(() => {
    // handle delete click logic here
  }, []);

  return (
    <tr className="bg-gray-900 border-gray-850 text-xs">
      <td className="px-3 py-1 min-w-[7rem] w-28">
        <button className="translate-y-0.5">
          <div className={`text-xs font-bold  text-blue-200 w-fit px-2 rounded-sm uppercase line-clamp-1 mr-0.5 ${
            user.role === 'SUPERADMIN' ? 'bg-red-500/20' :
            user.role === 'ADMIN' ? 'bg-blue-500/20' : 'bg-green-500/20'
          }`}>
            {user.role}
          </div>
        </button>
      </td>
      <td className="px-3 py-1 font-medium text-white w-max">
        <div className="flex flex-row w-max">
          <img
            className="rounded-full w-6 h-6 object-cover mr-2.5"
            src="data:image/png;base64,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"
            alt="user"
          />
          <div className="font-medium self-center">{user.name}</div>
        </div>
      </td>
      <td className="px-3 py-1">{user.email}</td>
      <td className="px-3 py-1">{user.lastActive}</td>
      <td className="px-3 py-1">{user.createdAt}</td>
      <td className="px-3 py-1">{user.oauthId}</td>
      <td className="px-3 py-1 text-right">
        <div className="flex justify-end w-full">
            {canEdit && (
                <>
                    <div aria-label="Chats" className="flex">
                    <button className="self-center w-fit text-sm px-2 py-2 hover:bg-white/5 rounded-xl">
                        <HiOutlineChatBubbleLeftRight />
                    </button>
                    </div>
                    <div aria-label="Edit User" className="flex">
                    <button className="self-center w-fit text-sm px-2 py-2 hover:bg-white/5 rounded-xl">
                        <LuPencil />
                    </button>
                    </div>
                    <div aria-label="Delete User" className="flex">
                    <button className="self-center w-fit text-sm px-2 py-2 hover:bg-white/5 rounded-xl">
                        <CiTrash />
                    </button>
                    </div>
                </>
            )}
        </div>
      </td>
    </tr>
  );
};

export default memo(UserTableRow);