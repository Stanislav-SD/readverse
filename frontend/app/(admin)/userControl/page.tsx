import React from 'react';
import UsersTable from '../../components/admin/UsersTable';

export default function Users() {
  const users = [
      { role: 'SUPERADMIN', name: 'Stan', email: 'stanislav123456789bg@gmail.com', lastActive: 'a few seconds ago', createdAt: 'April 2, 2025', oauthId: '' },
      { role: 'ADMIN', name: 'Stan', email: 'stanislav123456789bg@gmail.comd', lastActive: 'a few seconds ago', createdAt: 'April 2, 2025', oauthId: '' },
      { role: 'USER', name: 'Free Profile', email: 'free@free.com', lastActive: '7 days ago', createdAt: 'April 5, 2025', oauthId: '' },
      { role: 'USER', name: 'Admin', email: 'asdfasdf@dsf.asd', lastActive: '3 days ago', createdAt: 'April 7, 2025', oauthId: '' },
      { role: 'USER', name: 'Fiorfi', email: 'ssadadsdads@gmail.com', lastActive: '5 days ago', createdAt: 'April 7, 2025', oauthId: '' },
  ];
  const userData = { role: 'SUPERADMIN', name: 'Stan', email: 'stanislav123456789bg@gmail.com', lastActive: 'a few seconds ago', createdAt: 'April 2, 2025', oauthId: '' };
  
  return (
    <div className="pb-1 px-[16px] flex-1 max-h-full overflow-y-auto">
      <div className="flex flex-col lg:flex-row w-full h-full pb-2 lg:space-x-4">
        <div className="flex-1 mt-1 lg:mt-0">
          <UsersTable users={users} userData={userData} />
        </div>
      </div>
    </div>
  );
};