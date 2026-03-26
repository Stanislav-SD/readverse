import React from 'react';
import { User } from '../../../types/User';
import UserTableRow from './UserTableRow';

interface UsersTableProps {
  users: User[];
  userData: User;
}

export default function UsersTable({ users, userData }: UsersTableProps) {
  return (
    <div className="scrollbar-hidden relative whitespace-nowrap overflow-x-auto max-w-full rounded-sm pt-0.5">
      <table className="w-full text-sm text-left text-gray-400 table-auto max-w-full rounded-sm">
        <thead className="text-xs uppercase bg-gray-800 text-gray-400 -translate-y-0.5">
          <tr className="">
            <th scope="col" className="px-3 py-1.5 cursor-pointer select-none">
              <div className="flex gap-1.5 items-center">
                Role
              </div>
            </th>
            <th scope="col" className="px-3 py-1.5 cursor-pointer select-none">
              <div className="flex gap-1.5 items-center">
                Name
              </div>
            </th>
            <th scope="col" className="px-3 py-1.5 cursor-pointer select-none">
              <div className="flex gap-1.5 items-center">
                Email
              </div>
            </th>
            <th scope="col" className="px-3 py-1.5 cursor-pointer select-none">
              <div className="flex gap-1.5 items-center">
                Last Active
              </div>
            </th>
            <th scope="col" className="px-3 py-1.5 cursor-pointer select-none">
              <div className="flex gap-1.5 items-center">
                Created at
              </div>
            </th>
            <th scope="col" className="px-3 py-1.5 cursor-pointer select-none">
              <div className="flex gap-1.5 items-center">
                OAuth ID
              </div>
            </th>
            <th scope="col" className="px-3 py-2 text-right"></th>
          </tr>
        </thead>
        <tbody className="">
          {users.map((user) => (
            <UserTableRow key={user.email} user={user} userData={userData} />
          ))}
        </tbody>
      </table>
    </div>
  );
};