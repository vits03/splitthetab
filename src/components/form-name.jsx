import {
    BrowserRouter as Router,
    Routes,
    Route,
    Link,
    useNavigate,
    Outlet,
} from "react-router-dom";
import { useState } from "react";
const FormName = ({StoreUserNames,formData}) => {
    const navigate = useNavigate();
    const [errorMsg,setErrorMsg]= useState("");
  
   const handleNameChange = (e,i) =>{
    if ( formData.personsList.includes(e.target.value) &&formData.personsList.indexOf(e.target.value) !== e.target.value){
        setErrorMsg("Duplicate names found");
      }
      else {

         StoreUserNames(i, e.target.value)
         setErrorMsg("");
      }
   
   }
    const handleSubmit = (e) => {
      
        navigate("/buyers") 
         e.preventDefault();}
    return (

        <>
        
      <h1 className="text-2xl  mb-10 text-center text-[#E34234]">
      Add your team
    </h1>
        <form onSubmit={handleSubmit}  id="names-form" className={formData.persons>=5?'mt-4 flex flex-col  grid-cols-2 text-gray-700  md:grid  gap-x-4':'mt-4 flex flex-col text-gray-700 grid-cols-2 gap-x-4'}>
        <div className="h-5 mx-auto text-red-600">{errorMsg || ""}</div>
        {
  (formData.personsList).map((value, i) => (
    <div className="form-group" key={i}>
      <label htmlFor={`name-${i}`}>Metter Nissa no {i + 1}</label>
      
      <input
        className="border rounded-4xl"
        type="text"
        id={`name-${i}`}
        name={`name-${i}`}
        maxLength="20"
        required
        
        value={formData.personsList[i] }
        onChange={(e) =>handleNameChange(e,i)}
      />
    </div>
  ))
}

        

        
      </form>
      
      <div className="flex justify-between gap-4 mt-10"> {/* Reduced gap for better control */}
  <button onClick={()=>navigate("/")}
    className="w-1/4 rounded-2xl text-lg font-semibold bg-amber-600 py-3 hover:bg-amber-500 transition-all text-white"
  >
    Back
  </button>
  <button 
    className="w-1/4 rounded-2xl text-lg font-semibold bg-amber-600 py-3 hover:bg-amber-500 transition-all text-white" 
    type="submit" form="names-form"
  >
    Next
  </button>
</div>
      </>
    )
}

export default FormName;