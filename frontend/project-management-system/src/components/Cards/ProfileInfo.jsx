import { getInitials } from "../../utilis/Helper"


const ProfileInfo = ({ userInfo, onLogout}) => {
  return (
    userInfo && <div className="flex items-center gap-3">
     <div className="w-10 h-10 flex items-center justify-center rounded-full text-slate-950 font-medium bg-slate-100">
      {getInitials(userInfo.fullName)}</div>

     <div className="">
        <p className="text-sm font-medium">{userInfo.fullName}</p>
        <button className="text-sm text-slate-700 underline" onClick={onLogout}>Logout</button>
     </div>
    </div>
  )
}

export default ProfileInfo
