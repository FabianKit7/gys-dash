import React, { useEffect, useState } from 'react'
import Header from './components/header'
import { FaCaretDown } from 'react-icons/fa'
import { Chargebee } from '../../dashboard'
import { supabase } from '../../supabaseClient'
import { Link } from 'react-router-dom'
import { countDays } from '../../helpers'

export default function ManagePage() {
  const [sectionName, setSectionName] = useState('active')
  const [sectionTotal, setSectionTotal] = useState(0)
  const [showSectionMenu, setShowSectionMenu] = useState(false)
  const [selectedUser, setSelectedUser] = useState()
  const [showChargebee, setShowChargebee] = useState(false)
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetch = async () => {
      if (!sectionName) return;
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq("status", sectionName.toLocaleLowerCase())
        .limit(3000)
      error && console.log(error);
      if (error) return;

      setUsers(data);
      setSectionTotal(data?.length)
    }
    fetch()
  }, [sectionName])

  useEffect(() => {
    if (users.length > 0) {
      users.forEach(async user => {
        const resData = await supabase
          .from('sessions')
          .select()
          .eq('username', user?.username)
        resData.error && console.log(resData.error);
        var d = resData?.data?.[0]?.data
        // console.log(d);
        const growthDifference = calculateLast7DaysGrowth(d)
        console.log(growthDifference);
        const v = `
        <div class="${growthDifference > 0 ? `${growthDifference === 0 ? "text-[#000]": "text-[#23DF85]"}` :"text-[#E9C81B]"} font-black">${growthDifference}</div>
        `
        document.getElementById(`last_7_days_growth_${user?.username}`).innerHTML = v
      })
    }
  }, [users])

  const calculateLast7DaysGrowth = (sessionData) => {
    // Assuming the array of objects is stored in the 'data' variable

    // Sort the array by finish_time in ascending order
    sessionData.sort((a, b) => new Date(a.finish_time) - new Date(b.finish_time));

    // Get the followers growth in the previous 7 days
    const previous7DaysGrowth =
      sessionData[sessionData.length - 1].profile.followers - sessionData[sessionData.length - 8].profile.followers;

    // Get the followers growth in the last 7 days
    const last7DaysGrowth =
      sessionData[sessionData.length - 1].profile.followers - sessionData[sessionData.length - 2].profile.followers;

    // Calculate the growth difference and determine if it's positive, negative, or zero
    let growthDifference;
    if (last7DaysGrowth > previous7DaysGrowth) {
      growthDifference = `+${last7DaysGrowth - previous7DaysGrowth}`;
    } else if (last7DaysGrowth < previous7DaysGrowth) {
      growthDifference = `-${previous7DaysGrowth - last7DaysGrowth}`;
    } else {
      growthDifference = "0";
    }

    return growthDifference
  }

  return (
    <div className="font-MontserratRegular max-w-[1600px] mx-auto">
      {showChargebee && <Chargebee k={selectedUser?.id} user={selectedUser} setShowChargebee={setShowChargebee} />}
      <Header setUsers={setUsers} setLoading={setLoading} />

      <div className="mt-[30px] h-[82px] w-full rounded-[10px] border shadow-[0px_0px_5px_0px_#E7E7E7] px-5 flex items-center">
        <div className="h-[59px] rounded-[10px] bg-[#F8F8F8] text-[25px] font-bold font-MontserratBold text-black px-4 flex justify-center items-center relative">
          <div className="flex justify-center items-center capitalize cursor-pointer select-none" onClick={() => { setShowSectionMenu(!showSectionMenu) }}>{sectionName} <span className="px-[15px] h-[37px] rounded-[10px] text-center text-white bg-[#1B89FF] select-none ml-5">{sectionTotal}</span> <FaCaretDown size={24} className='ml-3 mr-2' /></div>

          <div className={`${showSectionMenu ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"} transition-all absolute top-full mt-2 left-0 border border-[#bbbbbb] rounded-[10px] bg-[#fff] text-[25px] font-bold font-MontserratBold text-black w-full min-h-[100px] flex flex-col gap-3`}>
            <div className="h-[59px] rounded-[10px] hover:bg-[#cdcdcd] bg-[#F8F8F8] text-[25px] font-bold font-MontserratBold text-black px-4 flex items-center cursor-pointer" onClick={() => { setSectionName('active'); setShowSectionMenu(!showSectionMenu) }}>Active</div>
            <div className="h-[59px] rounded-[10px] hover:bg-[#cdcdcd] bg-[#F8F8F8] text-[25px] font-bold font-MontserratBold text-black px-4 flex items-center capitalize cursor-pointer" onClick={() => { setSectionName('new'); setShowSectionMenu(!showSectionMenu) }}>new</div>
            <div className="h-[59px] rounded-[10px] hover:bg-[#cdcdcd] bg-[#F8F8F8] text-[25px] font-bold font-MontserratBold text-black px-4 flex items-center capitalize cursor-pointer" onClick={() => { setSectionName('checking'); setShowSectionMenu(!showSectionMenu) }}>checking</div>
            <div className="h-[59px] rounded-[10px] hover:bg-[#cdcdcd] bg-[#F8F8F8] text-[25px] font-bold font-MontserratBold text-black px-4 flex items-center capitalize cursor-pointer" onClick={() => { setSectionName('pending'); setShowSectionMenu(!showSectionMenu) }}>pending</div>
            <div className="h-[59px] rounded-[10px] hover:bg-[#cdcdcd] bg-[#F8F8F8] text-[25px] font-bold font-MontserratBold text-black px-4 flex items-center capitalize cursor-pointer" onClick={() => { setSectionName('twofactor'); setShowSectionMenu(!showSectionMenu) }}>twofactor</div>
            <div className="h-[59px] rounded-[10px] hover:bg-[#cdcdcd] bg-[#F8F8F8] text-[25px] font-bold font-MontserratBold text-black px-4 flex items-center capitalize cursor-pointer" onClick={() => { setSectionName('incorrect'); setShowSectionMenu(!showSectionMenu) }}>incorrect</div>
            <div className="h-[59px] rounded-[10px] hover:bg-[#cdcdcd] bg-[#F8F8F8] text-[25px] font-bold font-MontserratBold text-black px-4 flex items-center capitalize cursor-pointer" onClick={() => { setSectionName('cancelled'); setShowSectionMenu(!showSectionMenu) }}>cancelled</div>
          </div>
        </div>
      </div>

      {loading && <div className="flex justify-center items-center">
        <img src="/logo.png" alt="Loading" className="animate-spin w-10 h-10" />
      </div>}

      <table className="mt-[30px] w-full table-auto border-separate border-spacing-y-2 border-none border-slate-500">
        <thead>
          <tr>
            <th></th>
            <th>Account</th>
            <th>Email</th>
            <th>Followers</th>
            <th>Following</th>
            <th>Last 7 Days Growth</th>
            <th>Updated</th>
            <th></th>
            <th></th>
          </tr>
        </thead>

        <tbody>
          {users.map(user => {
            if (!user) {
              return ("Loading")
            }

            return (
              <tr key={`${user?.username}_row`} className='rounded-[10px] bg-[#F8F8F8] h-[64px] w-full'>
                <td>
                  <img src={user?.profile_pic_url} alt="" className="w-[30px] h-[30px] min-w-[30px] min-h-[30px] rounded-full bg-black ml-4" />
                </td>
                <td>@{user?.username}</td>
                <td><a href={`mailto:${user?.email}`} className="">{user?.email}</a></td>
                <td>{user?.followers}</td>
                <td>{user?.following}</td>
                <td>
                  <div id={`last_7_days_growth_${user?.username}`}>N/A
                  </div>
                </td>
                <td>{user?.session_updated_at ? countDays(user?.session_updated_at) : "N/A"}</td>
                <td>
                  <div className="w-[35px] h-[35px] grid place-items-center rounded-[10px] bg-black cursor-pointer" onClick={() => {
                    setSelectedUser(user)
                    setShowChargebee(true)
                  }}>
                    <img src="/icons/monetization.svg" alt="" className="w-[18px] h-[18px]" />
                  </div>
                </td>
                <td>
                  <Link to={`/dashboard/${user?.username}?uuid=${user?.user_id}`} target='_blank' className="w-[35px] h-[35px] grid place-items-center rounded-[10px] bg-black">
                    <img src="/icons/user-settings.svg" alt="" className="w-[18px] h-[18px]" />
                  </Link>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
