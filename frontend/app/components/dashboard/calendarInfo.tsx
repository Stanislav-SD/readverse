import React from 'react';

const CalendarInfo = ({info} : {info: string}) => {
    return (
      <div className='flex bg-gray-700 items-center justify-around w-auto h-11 rounded-full px-5'>
        <label className='flex gap-3'>
          {info}
        </label>        
      </div>
    )
  }
  
  export default CalendarInfo;