import { IoMdAddCircle } from "react-icons/io";
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Link,
    useNavigate,
    Outlet,
} from "react-router-dom";
import TeamDropdown from "./team-dropdown";
import { useCallback, useState, useEffect } from 'react';

const FormSelectBuyers = ({ buyers,setBuyers,formData }) => {
  // Sample list of usernames
  const navigate = useNavigate();

  // Form state
  



  const handleSubmit = (e) => {
   
    navigate("/pdf-file")
 e.preventDefault();}


  const handleClick = (username) => {
    const usernameIndex = buyers.findIndex((item) => item.name === username);
    if (usernameIndex !== -1) {
      // User exists - remove them
      setBuyers((prev) => prev.filter((item) => item.name !== username));
    } else {
      // User doesn't exist - add them with default values
      setBuyers((prev) => [
        ...prev,
        {
          name: username,
          noOfItems: 1,
          descriptions: [{ spendingDescription: "", amount: 0 }],
        },
      ]);
    }
  };
  const addDescription = (buyerName) => {
    setBuyers(prevBuyers => 
      prevBuyers.map(buyer => 
        buyer.name === buyerName && 
        buyer.descriptions.length < 10
          ? {
              ...buyer,
              noOfItems: buyer.noOfItems+1 ,
              descriptions: [
                ...buyer.descriptions,
                { spendingDescription: "", amount: 0 } // New empty field
              ]
            }
          : buyer
      )
    );
  };



  
    const updateDropdown = useCallback((buyerName, descriptionIndex, contributorsList = []) => {
        setBuyers(prevBuyers => 
          prevBuyers.map(buyer => 
            buyer.name === buyerName
              ? {
                  ...buyer,
                  descriptions: buyer.descriptions.map((desc, idx) => 
                    idx === descriptionIndex
                      ? { 
                          ...desc, 
                          contributors: [...contributorsList]
                        } 
                      : desc
                  )
                }
              : buyer
          )
        );
     
  },[setBuyers])




  const addRow = (name) => { 
    
   addDescription(name);
  };
  const updateDescription = (buyerName, index, field, value) => {
    setBuyers(prevBuyers =>
      prevBuyers.map(buyer =>
        buyer.name === buyerName
          ? {
              ...buyer,
              descriptions: buyer.descriptions.map((desc, i) =>
                i === index ? { 
                  ...desc, 
                  [field]: field === "amount" ? Number(value) || 0 : value 
                } : desc
              )
            }
          : buyer
      )
    );
  };
 

  return (
    <>
    <h1 className="text-2xl  mb-10 text-center  text-[#E34234]">
    Select your buyers
  </h1>
    <div>
      <section className="flex gap-1 text-gray-700 justify-center flex-wrap ">
        {formData.personsList.map((username, index) => {
          const usernameIndex = (buyers || []).findIndex(
            (item) => item.name === username
          );
          if (usernameIndex !== -1) {
            return (
              <div
                key={index}
                onClick={() => handleClick(username)}
                className=" text-md bg-amber-500 py-2 px-2 rounded-3xl transition-all hover:bg-amber-500"
              >
                {username}
              </div>
            );
          } else {
            return (
              <div
                key={index}
                onClick={() => handleClick(username)}
                className=" text-md bg-amber-300 py-2 px-2 rounded-3xl transition-all hover:bg-amber-500"
              >
                {username}
              </div>
            );
          }
        })}
      </section>

      <section className="flex flex-col gap-5 mt-5">
        <form onSubmit={handleSubmit} id="buyers">
          {(buyers || []).length !== 0 ? (
            buyers.map((buyer, index) => (
              <div  key={index} className="border-2 transition-all  border-amber-500 rounded-2xl p-3 mb-5">
                
                <h1 className="text-xl font-bold uppercase mb-1 ">
                  {buyer.name}
                </h1>
                {buyer.descriptions.map((descriptionObj,indexx) => (
                  <div className="flex items-end gap-4 mb-3" key={indexx}>
                    {/* Description (50% width) */}
                    <div className="flex-1" style={{ flexBasis: "65%" }}>
                      <label
                        htmlFor="description"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Description
                      </label>
                      <input
                        type="text"
                        id="description"
                        name="description"
                        required
                        value={descriptionObj.spendingDescription}
                        onChange={(e)=>updateDescription(buyer.name,indexx,"spendingDescription",e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                        placeholder="Enter details"
                      />
                    </div>
                 
                    <div  style={{ flexBasis: "30%" }}>
                      <label
                        htmlFor="currency"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Amount
                      </label>

                      <input
                        type="number"
                        id="currency"
                        name="currency"
                        required
                        value={descriptionObj.amount || ''}
                        onChange={(e)=>updateDescription(buyer.name,indexx,"amount",Number(e.target.value) || 0 )}
                        className="w-full  pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                        placeholder="MUR"
                        min="0"
                      />
                    </div><TeamDropdown name={buyer.name} index={indexx} formData={formData} updateDropdown={updateDropdown} className="z-1000"/>
                  </div>
                   
                ))}
                <div className="flex justify-center items-center gap-3">
               
                  <IoMdAddCircle
                    onClick={() => addRow(buyer.name)}
                    className="size-10 hover:text-amber-600 transition-all"
                  />
                </div>
              </div>
            ))
          ) : (
            <div className="text-black font-bold text-xl min-h-50 flex justify-center ">
              <p>click on the buyer's name to select.</p>
            </div>
          )}
        </form>
      </section>

      <div className="flex justify-between gap-4">
      <button onClick={()=>navigate("/names")}
    className="w-1/4 rounded-2xl text-lg font-semibold bg-amber-600 py-3 hover:bg-amber-500 transition-all text-white"
  >
    Back
  </button>
        <button
          className="rounded-2xl w-1/4 text-lg font-semibold bg-amber-600  py-3   hover:bg-amber-500 transition-all text-white "
          type="submit" form="buyers" 
        >
          Next
        </button>
      </div>
    </div></>
  );
};

export default FormSelectBuyers;
