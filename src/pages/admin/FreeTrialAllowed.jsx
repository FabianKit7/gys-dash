import React from 'react';
import Header from './components/header';
import { useState } from 'react';
import { useEffect } from 'react';
import { supabase } from '../../supabaseClient';
import { TbTrash } from 'react-icons/tb';
import { LOGO } from '../../config';
import { BsFillSendFill } from 'react-icons/bs';

export default function FreeTrialAllowed() {
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [username, setUsername] = useState('');
  const [refreshUsersList, setRefreshUsersList] = useState(true);

  // setUsers([]); and setSectionTotal(0)
  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('freeTrialAllowed')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(3000);
      error && console.log(error);
      if (error) return;

      setUsers(data);
      setLoading(false);
      setRefreshUsersList(false);
    };
    if (refreshUsersList) {
      fetch();
    }
  }, [refreshUsersList]);

  const handleAddUser = async () => {
    setLoading(true);
    var cleanUsername = username;
    if (username.startsWith('@')) {
      cleanUsername = username.substring(1);
    }
    const data = { username: cleanUsername };
    const { error } = await supabase
      .from('freeTrialAllowed')
      .insert(data)
      .select();
    if (error) {
      console.log(error);
      alert(error?.message);
    } else {
      setRefreshUsersList(true);
      setUsername('');
    }
    setLoading(false);
  };

  const handleRemoveUser = async (username) => {
    setLoading(true);
    const { error } = await supabase
      .from('freeTrialAllowed')
      .delete()
      .eq('username', username);
    !error && setRefreshUsersList(true);
    setLoading(false);
  };

  return (
    <>
      <div className="font-MontserratRegular max-w-[1600px] mx-auto">
        <Header
          setUsers={null}
          searchTerm={null}
          setSearchTerm={null}
          setLoading={null}
          disableSearch={true}
        />

        <form
          className="h-[82px] w-full max-w-[600px] mx-auto rounded-[10px] border shadow-[0px_0px_5px_0px_#E7E7E7] flex flex-row-reverse gap-4 items-center px-[28px] py-[23px] mt-[22px]"
          onSubmit={(e) => {
            e.preventDefault();
            handleAddUser();
          }}
        >
          <button
            type="submit"
            className="w-[40px] h-[40px] grid place-items-center rounded-[10px] bg-black"
          >
            {/* <img
              src="/icons/user-search.svg"
              alt=""
              className="w-[24px] h-[24px]"
            /> */}
            <BsFillSendFill size={20} color={'white'} />
          </button>
          <input
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);
            }}
            type="search"
            className="placeholder-[#C4C4C4] text-[#363636] outline-none border-none w-full h-[40px]"
            placeholder="Enter username"
          />
        </form>

        {loading && (
          <div className="flex items-center justify-center">
            <img src={LOGO} alt="Loading" className="w-10 h-10 animate-spin" />
          </div>
        )}

        <div className="min-h-[82px] w-full rounded-[10px] border shadow-[0px_0px_5px_0px_#E7E7E7] flex flex-col gap-6 px-[28px] py-[23px] mt-[22px]">
          {users?.map((user) => (
            <div
              key={`user_${user?.username}`}
              className="flex items-center justify-between w-full gap-4"
            >
              <div className="border-b pb-4 w-full">@{user?.username}</div>
              <button
                className="rounded-[10px] bg-primary hover:bg-primary/80 text-white w-fit px-3 h-[40px] ml-5"
                title="logout"
                onClick={() => handleRemoveUser(user?.username)}
              >
                <TbTrash size={24} color={'white'} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
