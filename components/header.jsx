import React, { useEffect, useState } from "react";
import '../styles/style.css'
import Link from "next/link";
import { useGlobalContext } from "@/app/Context/UserContext";
import Notification from "@/pages/notification";
import { getNotificationCount } from "@/apis/apis/adminApis";


const Header = ({ heading }) => {
  const { user } = useGlobalContext();
 const [show, setShow] = useState(false)
 const [falseCount,setFalseCount]=useState(0)


 const closeNotification = () => {
  setShow(false);
};

 const handleNotificationClick = async () => {
    setShow(true); 
    setFalseCount(0); 
  };

useEffect(()=>{
  async function getNotification() {
    const response= await getNotificationCount();

    if(response.status==200){
      setFalseCount(response.data.unread_notification_count)
  
    }
    else{
      console.log("something is wrong");
    }
  
  }
  getNotification()
 
},
[falseCount]
)
  return (
    <>
      <div className="top-wrapp">
        <div className="text-wrap">
          <h5>{heading}</h5>
        </div>
        <ul class="notify">
          <li class="leftwrap" 
          onClick={handleNotificationClick}
          // onClick={()=>setShow(true)}
          >
            <img src="/images/notification.svg" alt="" />
            <span>{falseCount}</span>
          </li>
        
          
          <li class="ms-2"><span>{user.first_name} {user.last_name}</span>
            <span className="d-block admin-menu">{user.role.charAt(0).toUpperCase() + user.role.slice(1)}</span></li>

          <li class="user">
            <span></span>
            <Link href="#"
            ><img src="/images/profile.png" alt="" class="ms-2"
              /></Link>
            <ul class="dropdown-content">
              <li class="mb-1"><Link href="/profile">My profile</Link></li>
              <li><Link href="/logout">Log Out</Link></li>
            </ul>
          </li>
        </ul>
        {show &&
        <Notification setFalseCount={setFalseCount} closeNotification={closeNotification}/>
}
      </div>
    </>
  )
}
export default Header








// import React, { useEffect, useState } from "react";
// import '../styles/style.css'
// import Link from "next/link";
// import { useGlobalContext } from "@/app/Context/UserContext";
// import Notification from "@/pages/notification";
// import { getNotificationCount } from "@/apis/apis/adminApis";

// const Header = ({ heading }) => {
//   const { user } = useGlobalContext();
//   const [showNotification, setShowNotification] = useState(false);
//   const [unreadNotificationCount, setUnreadNotificationCount] = useState(0);

//   const toggleNotification = () => {
//     setShowNotification(!showNotification);
//     // Optionally, you can make an API call here to mark notifications as read
//     setUnreadNotificationCount(0); // Reset unread count when notification is shown
//   };

//   useEffect(() => {
//     async function fetchNotificationCount() {
//       try {
//         const response = await getNotificationCount();
//         if (response.status === 200) {
//           setUnreadNotificationCount(response.data.unread_notification_count);
//         } else {
//           console.log("Failed to fetch notification count");
//         }
//       } catch (error) {
//         console.error("Error fetching notification count:", error);
//       }
//     }
//     fetchNotificationCount();
//   }, []);

//   return (
//     <>
//       <div className="top-wrapp">
//         <div className="text-wrap">
//           <h5>{heading}</h5>
//         </div>
//         <ul className="notify">
//           <li className="leftwrap" onClick={toggleNotification}>
//             <img src="/images/notification.svg" alt="" />
//             <span>{unreadNotificationCount}</span>
//           </li>
//           <li className="ms-2">
//             <span>{user.first_name} {user.last_name}</span>
//             <span className="d-block admin-menu">{user.role.charAt(0).toUpperCase() + user.role.slice(1)}</span>
//           </li>
//           <li className="user">
//             <span></span>
//             <Link href="#">
//               <img src="/images/profile.png" alt="" className="ms-2" />
//             </Link>
//             <ul className="dropdown-content">
//               <li className="mb-1"><Link href="/profile">My profile</Link></li>
//               <li><Link href="/logout">Log Out</Link></li>
//             </ul>
//           </li>
//         </ul>
//         {showNotification && <Notification closeNotification={() => setShowNotification(false)} />}
//       </div>
//     </>
//   );
// };

// export default Header;
