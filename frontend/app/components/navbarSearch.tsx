import React from 'react';
import { FaSearch } from 'react-icons/fa';

const NavSearch = () => {
  return (
    <div className='flex bg-gray-700 items-center justify-center w-auto h-11 rounded-full px-5'>
      <label className='flex gap-3'>
        <FaSearch className="text-white text-xl "/>
        <input type="text" placeholder="Search Book" className='bg-transparent text-gray-400 focus:outline-none'/>
      </label>        
    </div>
  )
}

export default NavSearch;