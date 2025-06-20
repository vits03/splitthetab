import { useEffect,useCallback,createContext, useState } from "react";

import "./App.css";
import FormMain from "./components/form-main";
import FormName from "./components/form-name";
import FormSelectBuyers from "./components/form-select-buyers";
import PdfFileViewer from "./components/pdf-file-viewer";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  Outlet,
  Navigate,
} from "react-router-dom";

function App() {
  const ResetContext = createContext();
  const [buyers, setBuyers] = useState([]);
  const [reset,setReset] = useState(false);
  const [formData, setFormData] = useState({
    persons: "",
    partyName: "",
    date: "",
    personsList: [],
    buyers: [],
  });
  useEffect(() => {
    console.log(formData);
  }, [formData]);
  

  const resetAll = useCallback(() => {
    setFormData({
      persons: "",
    partyName: "",
    date: "",
    personsList: [],
    buyers: [],
  
    })
    setBuyers([]);
  }, []);

 

  const StoreUserNames = (index, username) => {
  
    setFormData((prev) => ({
      ...prev,
      personsList: [
        ...prev.personsList.slice(0, index),
        username,
        ...prev.personsList.slice(index + 1),
      ],
    }));
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (name === "persons" && value <= 10) {
      const emptyArray = Array.from({ length: value });
      setFormData((prev) => ({
        ...prev,
        personsList: emptyArray,
      }));
    }
    // Clear error when user starts typing
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <Router>
      <div className="w-full min-h-screen z-10 bg-[linear-gradient(to_right,#fa709a_0%,#fee140_100%)] overflow-auto ">
      <header className="h-15 app-name flex justify-center items-center">
  <Link to="/" className="text-5xl mt-5 text-white hover:opacity-50  transition-all duration-75">
    SplitTheTab
  </Link>
</header>

        <div className="  flex min-h-[calc(100vh-60px)] justify-center  items-center">
          <section className=" w-97/100 md:max-w-2xl bg-white px-2 py-10 md:p-10 rounded-4xl ">
           
         
              <Routes>
               
                <Route
                  path="/names"
                  element={
                    <FormName
                      handleSubmit={handleSubmit}
                      formData={formData}
                      StoreUserNames={StoreUserNames}
                    />
                  }
                />
                <Route
                  path="/buyers"
                  element={
                    <FormSelectBuyers
                      buyers={buyers}
                      setBuyers={setBuyers}
                      formData={formData}
                    />
                  }
                />
                <Route
                  path="/pdf-file"
                  element={
                    <PdfFileViewer formData={formData} buyers={buyers || []}  resetAll={resetAll}/>
                  }
                />
                <Route
                  path="/"
                  element={
                    <FormMain
                      handleSubmit={handleSubmit}
                      formData={formData}
                      handleChange={handleChange}
                    />
                  }
                />
                <Route path="*" element={<Navigate to="/" />} />
              </Routes> 
          
          </section>
        </div>
        <div className="flex justify-center text-center text-white ">
       

          <div>
            <div>©2025 SpliltTheTab</div>{" "}
            <div>
              <div>Inspired (50%) by Homesh Seetah</div>
            
            </div>
          </div>
        </div>
      </div>
      </Router>
  );
}

export default App;
