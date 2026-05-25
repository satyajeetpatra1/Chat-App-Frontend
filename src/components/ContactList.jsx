import { useEffect } from "react";
import { useChatStore } from "../store/useChatStore";
import UsersLoadingSkeleton from "./UsersLoadingSkeleton";

function ContactList() {
  const { getAllContacts, allContacts, isUsersLoading, setSelectedUser } =
      useChatStore();
  
    useEffect(() => {
      getAllContacts();
    }, [getAllContacts]);
  
    if (isUsersLoading) return <UsersLoadingSkeleton />;
  
    return <>
        {allContacts.map((chat) => (
          <div
            key={chat._id}
            className="bg-cyan-500/10 p-4 rounded-lg cursor-pointer hover:bg-cyan-500/20 transition-colors"
            onClick={() => setSelectedUser(chat)}
          >
            <div className="flex items-center gap-3">
  
              {/* TODO: FIX THE ONLINE OFLINE USING SOCKETS */}
              <div className="avatar online">
                <div className="size-12 rounded-full">
                  <img src={chat.profilePic || "/avatar.png"} alt={chat.fullName} />
                </div>
              </div>
              <h4 className="text-slate-200 font-medium truncate">{chat.fullName}</h4>
            </div>
          </div>
        ))}
      </>;
}

export default ContactList;
