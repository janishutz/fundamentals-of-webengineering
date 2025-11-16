import "./css/App.css";
import '@fortawesome/fontawesome-free/css/all.css';
import { readCSV } from './csv';
import { CSV_Data, fileInfo } from './types';

import React, { useState, useRef } from "react";
import Layout from "./Layout";
import CSVCard from "./components/CSVCard";
import InfoCard from "./components/InfoCard";
import DataTable from "./components/DataTable";

function App() {
  const [data, setData] = useState([] as CSV_Data);
  const [info, setInfo] = useState({
    filename: "None",
    filetype: "None",
    filesize: "None",
    rowcount: 0
  });

  const formRef = useRef(null);

  // This is triggered in CSVCard
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>): Promise<void> => {
    const file = e.target.files?.[0];
    if (!file) throw new Error("No file received");

    const data = await readCSV(e);

    const newFileInfo: fileInfo = {
      filename: file.name,
      filetype: file.type,
      filesize: String(file.size) + "B",
      rowcount: data.length
    }
    setInfo(newFileInfo);
    setData(data);

    if (formRef.current) {
      // Upload to server
      const formData = new FormData(formRef.current);
      const res = await fetch("/upload", {
        method: "POST",
        body: formData
      });
      const result = await res.json();
      console.log(result);
    }
  }

  return (
      <Layout>
        <CSVCard handleChange={handleFileChange} formRef={formRef}></CSVCard>
        <InfoCard info={info}></InfoCard>
        <DataTable data={data}></DataTable>
      </Layout>
  );
}

export default App;
