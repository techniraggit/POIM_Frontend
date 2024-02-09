import React, { useState } from "react";
import '../styles/style.css'
import Link from "next/link";
import { useGlobalContext } from "@/app/Context/UserContext";
import Notification from "@/pages/notification";


const Header = ({ heading }) => {
  const { user } = useGlobalContext();
 const [show, setShow] = useState(false)
 const [falseCount,setFalseCount]=useState(0)
 const closeNotification = () => {
  setShow(false);
};
  return (
    <>
      <div className="top-wrapp">
        <div className="text-wrap">
          <h5>{heading}</h5>
        </div>
        <ul class="notify">
          <li class="leftwrap" onClick={()=>setShow(true)}>
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
        <Notification   falseCount={falseCount} setFalseCount={setFalseCount} closeNotification={closeNotification}/>
}
      </div>
    </>
  )
}
export default Header