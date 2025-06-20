import MyDocument from "./pdf-file";
import { useEffect } from "react";
import ReactPDF from "@react-pdf/renderer";
import { PDFViewer, BlobProvider, PDFDownloadLink } from "@react-pdf/renderer";
import { useContext } from "react";

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useNavigate,
} from "react-router-dom";
const PdfFileViewer = ({ formData = {}, buyers = [] }) => {
  const navigate = useNavigate();
  const handleRestart = () => {
    navigate("/");
    navigate(0);
  };

  if (!buyers || !formData) return <Text>Loading data...</Text>;
  console.log(buyers);

  return (
    <>
      <h1 className="text-2xl  mb-10 text-center text-[#E34234] ">
        Download your report
      </h1>
      <div className="flex flex-col items-center ">
        <PDFViewer className="  collapse lg:visible h-12 lg:h-[50vh]  ">
          <MyDocument formData={formData} buyers={buyers} />
        </PDFViewer>

        <div className="flex justify-between w-full my-5">
          <div className="p-2 basis-2/10 rounded-2xl text-white bg-[#E34234] border-2 text-cente cursor-pointer hover:bg-amber-500  border-amber-300">
            <button className="w-full " onClick={() => navigate("/buyers")}>
              Back
            </button>
          </div>
          <div className="p-2 rounded-2xl text-white bg-[#E34234] border-2 text-center cursor-pointer hover:bg-amber-500 border-amber-300">
            <PDFDownloadLink
              document={<MyDocument formData={formData} buyers={buyers} />}
              fileName={formData.partyName || "splitthetab"}
            >
              {({ loading }) => (loading ? "Loading " : "Download now!")}
            </PDFDownloadLink>
          </div>

          <div className="p-2 basis-2/10 rounded-2xl text-white bg-[#E34234] border-2 text-center cursor-pointer focus:bg-amber-500 border-amber-300">
            <button onClick={handleRestart}>restart</button>
          </div>
        </div>
      </div>
    </>
  );
};

export default PdfFileViewer;
