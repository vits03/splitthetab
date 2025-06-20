import { useEffect, useState } from "react";
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Link,
    useNavigate,
    Outlet,
} from "react-router-dom";
import TeamDropdown from "./team-dropdown";
const FormMain = ({formData,handleChange}) => {
    const navigate = useNavigate();
const [date,setDate]= useState("");

    useEffect(()=>{
        const date = new Date();
const formattedDate = date.toISOString().split('T')[0];
setDate(formattedDate);
    },[])
    const handleSubmit = (e) => {
        navigate("/names")
        e.preventDefault();}
       
      
    return (
<>
      <h1 className="text-2xl  mb-10 text-center text-[#E34234]">
      Add your expense details
    </h1>
        <form onSubmit={handleSubmit} className='mt-6 flex flex-col gap-4 md:gap-4 text-gray-700 justify-between'>
        <div className="form-group text-gray-700">
          <label htmlFor="persons">Number of Persons*</label>
          <input className='border-2  focus:ring-4 focus:ring-amber-500 focus:outline-none" rounded-2xl '
            type="number"
            id="persons"
            name="persons"
            min="2"
            max="10"
            required
            value={formData.persons}
            onChange={handleChange}
          />
          
        </div>

        <div className="form-group">
          <label htmlFor="partyName">Party Description*</label>
          <input className='border-2 focus:ring-4 focus:ring-amber-500 focus:outline-none  rounded-2xl '
            type="text"
            id="partyName"
            name="partyName"
            maxLength="20"
            required
            value={formData.partyName}
            onChange={handleChange}
          />
       
        </div>

        <div className="form-group">
          <label htmlFor="date">Date*</label>
          <input className='border-2 focus:ring-4 focus:ring-amber-500 focus:outline-none  rounded-2xl '
            type="date"
            id="date"
            name="date"
            required
            max={date}
            placeholder='add a party description ex " zorge divorce party'
            value={formData.date}
            onChange={handleChange}
          />
         
        </div>

      
<div className='w-5/10 mx-auto'>

  <button className="rounded-2xl text-lg font-semibold bg-amber-600  py-3 mb-5 md:mb-1  hover:bg-amber-500 transition-all text-white w-full" type="submit" > Next</button>
</div>
        
      </form></>

    )
}

export default FormMain;