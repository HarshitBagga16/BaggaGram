// import React from "react";
// import { Avatar, AvatarFallback, AvatarImage } from "./avatar";
// import { Button } from "./button";
// import Link from "next/link";
// import { useSelector } from "react-redux";
// import useGetAllMessage from "../../hooks/useGetAllMessage"

// const Messages = ({ selectedUser }) => {
//   useGetAllMessage();
//   const {messages} = useSelector(store=>store.chat);
//   return (
//     <div className="overflow-y-auto flex-1 p-4">
//       <div className="flex justify-center">
//         <div className="flex flex-col items-center justify-center">
//           <Avatar className="h-20 w-20">
//             <AvatarImage
//               src={selectedUser?.profilePicture || null}
//               alt="Profile"
//             />
//             <AvatarFallback>CN</AvatarFallback>
//           </Avatar>
//           <span>
//             {
//                 selectedUser?.username
//             }
//           </span>
//           <Link href={`../profile/${selectedUser?._id}`}><Button className="h-8 my-2" variant="secondary">View Profile</Button></Link>
//         </div>
//       </div>
//       <div className="flex flex-col gap-3">
//         {
//           messages 
//           &&
//         messages.map((message,index) => {
//             return (
//                 <div key={index} className={`flex `}>
//                     <div>
//                         {
//                             message
//                         }
//                      </div>   
//                 </div>
//             )
//         })
//         }
//       </div>
//     </div>
//   );
// };

// export default Messages;


import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./avatar";
import { Button } from "./button";
import Link from "next/link";
import { useSelector } from "react-redux";
import useGetAllMessage from "../../hooks/useGetAllMessage";
import useGetRTM from "../../hooks/useGetRTM";

const Messages = ({ selectedUser }) => {
  useGetRTM();
  useGetAllMessage();
  const { messages } = useSelector((store) => store.chat);
  const {user} = useSelector(store=>store.auth)

  return (
    <div className="overflow-y-auto flex-1 p-4">
      <div className="flex justify-center">
        <div className="flex flex-col items-center justify-center">
          <Avatar className="h-20 w-20">
            <AvatarImage
              src={selectedUser?.profilePicture || null}
              alt="Profile"
            />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <span>{selectedUser?.username}</span>
          <Link href={`../profile/${selectedUser?._id}`}>
            <Button className="h-8 my-2" variant="secondary">
              View Profile
            </Button>
          </Link>
        </div>
      </div>
      <div className="flex flex-col gap-3">
        {messages &&
          messages.map((message) => {
            const isSender = message.senderId === user?._id;
            return (
              <div key={message._id} className={`flex ${isSender ? 'justify-end' : 'justify-start'}`}>
                <div className={`p-2 rounded-lg max-w-xs break-words ${isSender 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-200 text-black'}`}>
                  {message.message ? message.message : "No message content"}
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default Messages;
