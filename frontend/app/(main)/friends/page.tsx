"use client"
import { useState, useMemo } from "react";
import Image from "next/image";
import { Check, X, Mail } from "lucide-react";
import { useQuery, useMutation, gql, useSubscription } from '@apollo/client';
import Loading from "../../loading";

const SEND_FRIEND_REQUEST = gql`
  mutation SendFriendRequest($friendId: Int!) {
    sendFriendRequest(friendId: $friendId)
  }
`;
const UNSEND_FRIEND_REQUEST = gql`
  mutation UnsendFriendRequest($friendId: Int!) {
    unsendFriendRequest(friendId: $friendId)
  }
`;
const REJECT_FRIEND_REQUEST = gql`
  mutation RejectFriendRequest($friendId: Int!) {
    rejectFriendRequest(friendId: $friendId)
  }
`;
const ACCEPT_FRIEND_REQUEST = gql`
  mutation AcceptFriendRequest($friendId: Int!) {
    acceptFriendRequest(friendId: $friendId)
  }
`;

const GET_FRIEND_REQUESTS = gql`
  query GetFriendRequests{
    getFriendRequests {
      Id
      FriendId
      Username
    }
  }
`;
const GET_FRIENDS_STATUS = gql`
  query GetFriends {
    getFriends {
      Id
      Username
      Status
      LastActive
    }
  }
`;
const GET_USERS = gql`
  query GetUsers {
    getUsers {
      Id
      Username
    }
  }
`;
const GetInfo = gql`
  query GetInfo {
    me{
      Id
    }
  }
`;

const STATUS_CHANGED = gql`
  subscription {
    statusChanged {
      Id
      Status
    }
  }
`;

type FriendRequest = {
  Id: number;
  FriendId: number;
  Username: string;
};
type Friend = {
  Id: number;
  Username: string;
  Status: string;
  LastActive: string;
};

export default function FriendsPage() {
  const { data: friendRequests, loading: friendRequestsLoading, error: friendRequestsError } = useQuery(GET_FRIEND_REQUESTS);
  const { data: friends, loading: friendsLoading, error: friendsError, refetch } = useQuery(GET_FRIENDS_STATUS);
  const { data: users, loading: usersLoading, error: usersError } = useQuery(GET_USERS);
  const { data: user, loading: userLoading, error: userError } = useQuery(GetInfo);
  
  useSubscription(STATUS_CHANGED, {
    onData: () => {
      refetch();
    },
  });
  
  const [sendRequest] = useMutation(SEND_FRIEND_REQUEST, {
    refetchQueries: [{ query: GET_FRIEND_REQUESTS }, { query: GET_USERS }],
  });
  const [unsendRequest] = useMutation(UNSEND_FRIEND_REQUEST, {
    refetchQueries: [{ query: GET_FRIEND_REQUESTS }, { query: GET_USERS }],
  });
  const [acceptRequest] = useMutation(ACCEPT_FRIEND_REQUEST, {
    refetchQueries: [{ query: GET_FRIEND_REQUESTS }, { query: GET_FRIENDS_STATUS }],
  });
  const [rejectRequest] = useMutation(REJECT_FRIEND_REQUEST, {
    refetchQueries: [{ query: GET_FRIEND_REQUESTS }, { query: GET_USERS }],
  });
  
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<"friends" | "requests" | "send">("friends");

  const filteredFriends = useMemo(
    () => (friends?.getFriends || []).filter((friend: Friend) => friend.Username.toLowerCase().includes(search.toLowerCase())),
    [friends, search]
  );

  const filteredRequests = useMemo(
    () =>
      (friendRequests?.getFriendRequests || []).filter((friend: FriendRequest) =>
        friend.Username.toLowerCase().includes(search.toLowerCase())
      ),
    [friendRequests, search]
  );

  const filteredUsers = useMemo(
    () => (users?.getUsers || []).filter((user: Friend) => user.Username.toLowerCase().includes(search.toLowerCase())),
    [users, search]
  );

  if (friendRequestsLoading || friendsLoading || usersLoading || userLoading) {
    return (
      <Loading />
    );
  }
      
  if (friendRequestsError || friendsError || usersError || userError) {
    return (
      <main className="flex justify-center items-center h-screen bg-black text-gray-200">
        <p className="text-red-500 text-2xl">Error: {friendRequestsError?.message || friendsError?.message || usersError?.message || userError?.message}</p>
      </main>
    );
  }

  return (
    <main className="bg-black text-white">
      <div className="grid grid-cols-1 lg:grid-cols-1 mx-auto gap-8 sm:w-2/3 w-full h-full">
        <div className="bg-black min-h-screen px-4 sm:px-6 py-6 sm:py-10 space-y-6 sm:space-y-10">
          <div className="p-6 max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-6 text-center">Friends</h1>
            <input
              type="text"
              placeholder="Search for friends..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-[#25282a] mb-6 p-3 border rounded w-full text-lg focus:outline-none"
            />

            <div className="mb-6 grid sm:grid-cols-3 grid-cols-1 gap-4">
              {["friends", "requests", "send"].map((tab) => (
                <button
                  key={tab}
                  className={`px-4 py-2 sm:text-lgfont-semibold rounded ${
                    activeTab === tab ? "bg-[#b39478] text-white" : "bg-[#25282a]"
                  }`}
                  onClick={() => setActiveTab(tab as "friends" | "requests" | "send")}
                >
                  {tab === "friends" ? "Friends" : tab === "requests" ? "Friend Requests" : "Search for User"}
                </button>
              ))}
            </div>

            {activeTab === "friends" && (
              <FriendList friends={filteredFriends} />
            )}
            {activeTab === "requests" && (
              <RequestList requests={filteredRequests} id={user.me.Id} onAccept={acceptRequest} onReject={rejectRequest} unsend={unsendRequest} />
            )}
            {activeTab === "send" && (
              <UserList users={filteredUsers} onSendRequest={sendRequest} />
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

function FriendList({ friends }: { friends: Friend[] }) {
  return friends.length > 0 ? (
    friends.map((friend) => {
      //console.log(friend.Id);
      return (
      <div key={friend.Id} className="flex items-center gap-4 p-4 border-t mb-3 shadow-md">
        <Image src="/avatars/defaultAvatar.jpg" alt="defaultAvatar" width={50} height={50} className="bg-gray-300 rounded-full" />
        <div className="flex-1">
          <p className="font-medium text-lg">{friend.Username}</p>
          <p className="text-sm text-gray-500">Reading: {friend.Status}</p>
        </div>
        <span className={`px-3 py-1 text-sm font-semibold rounded ${friend.Status === "ONLINE" ? "bg-green-500 text-white" : "bg-[#25282a]"}`}>
          {friend.Status === "ONLINE" ? "Online" : "Offline"}
        </span>
      </div>
    )})
  ) : (
    <p className="text-center text-gray-500">No friends found</p>
  );
}

function RequestList({ requests, id, onAccept, onReject, unsend }: { requests: FriendRequest[]; id: number; onAccept: (options: { variables: { friendId: number } }) => void; onReject: (options: { variables: { friendId: number } }) => void; unsend: (options: { variables: { friendId: number } }) => void }) {
  return requests.length > 0 ? (
    requests.map((request) => (
      <div key={request.Id + request.FriendId} className="flex items-center gap-4 p-4 border-t mb-3 shadow-md">
        <Image src="/avatars/defaultAvatar.jpg" alt="defaultAvatar" width={50} height={50} className="bg-gray-300 rounded-full" />
        <div className="flex-1">
          <p className="font-medium text-lg">{request.Username}</p>
        </div>
        {id != request.Id && (
          <div className="grid xs:grid-cols-2 grid-cols-1">
            <button onClick={() => onAccept({ variables: { friendId: request.Id } })} className="px-3 py-1 bg-green-500 text-white rounded flex items-center hover:bg-green-600 mr-2">
              <Check size={18} className="mr-2" /> Accept
            </button>
            <button onClick={() => onReject({ variables: { friendId: request.Id } })} className="px-3 py-1 bg-red-500 text-white rounded flex items-center hover:bg-red-600">
              <X size={18} className="mr-2" /> Decline
            </button>
          </div>
        )}
        {id === request.Id && (
          <>
            <span className={`px-3 py-1 text-sm font-semibold rounded bg-[#25282a]`}>
              Waiting response
            </span>
            <button onClick={() => unsend({ variables: { friendId: request.FriendId } })} className="px-3 py-1 bg-red-500 text-white rounded flex items-center hover:bg-red-600">
              <X size={18} />
            </button>
          </>
        )}
      </div>
    ))
  ) : (
    <p className="text-center text-gray-500">No friend requests found</p>
  );
}

function UserList({ users, onSendRequest }: { users: Friend[]; onSendRequest:  (options: { variables: { friendId: number } }) => void }) {
  return users.length > 0 ? (
    users.map((user) => (
      <div key={user.Id} className="flex items-center gap-4 p-4 border-t mb-3 shadow-md">
        <Image src="/avatars/defaultAvatar.jpg" alt="defaultAvatar" width={50} height={50} className="bg-gray-300 rounded-full" />
        <p className="font-medium text-lg">{user.Username}</p>
        <button onClick={() => onSendRequest({ variables: { friendId: user.Id } })} className="px-4 py-2 bg-green-500 text-white rounded flex items-center hover:bg-green-600">
          <Mail size={18} className="mr-2" /> Send
        </button>
      </div>
    ))
  ) : (
    <p className="text-center text-gray-500">No users found</p>
  );
}