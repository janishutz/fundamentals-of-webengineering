import "./css/App.css";
import '@fortawesome/fontawesome-free/css/all.css';
import { CSV_Data, fileInfo, responseObject } from './types';
import { readCSV, convertCSVtoJSON } from './csv';

import React, { useState, useRef, useEffect } from "react";
import Layout from "./components/Layout";
import CSVCard from "./components/CSVCard";
import InfoCard from "./components/InfoCard";
import DataTable from "./components/DataTable";
import FileCard from "./components/FileCard";

function App() {
  const [data, setData] = useState([] as CSV_Data);
  const [info, setInfo] = useState({
    filename: "None",
    filetype: "None",
    filesize: "None",
    rowcount: 0
  });

  const [fileList, setFileList] = useState(null as responseObject | null);
  // Effect has to be in top level of the component
  useEffect(() => {
    fetch("/status", { method: "GET" })
      .then((response) => response.json())
      .then((response) => setFileList(response))
      .catch((error) => console.log(error));
  });

  const formRef = useRef(null);

  // This is triggered in CSVCard
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>): Promise<void> => {
    const file = e.target.files?.[0];
    if (!file) throw new Error("No file received");

    const data = await readCSV(e);

    const newFileInfo: fileInfo = {
      filename: file.name,
      filetype: ".csv", // file.type delivers weird name
      filesize: String(file.size) + "B",
      rowcount: data.length
    }
    setInfo(newFileInfo);
    setData(data);

    if (formRef.current) {
      // Upload to server
      const formData = new FormData(formRef.current);
      await fetch("/upload", {
        method: "POST",
        body: formData
      });
    }
  }

  const handleFileChange = async (fileName: string) => {
    const response = await fetch(`/download/${fileName}`);
    const blob = await response.blob();
    const text = await blob.text();

    if (!response) throw new Error("No file received");

    const data = await convertCSVtoJSON(text);
    
    // Updating fileInfo requires more effort since blob doesn't have the metadata

    setData(data);
  }

  return (
      <Layout>
        <CSVCard handleChange={handleFileUpload} formRef={formRef}></CSVCard>
        <FileCard fileList={fileList as responseObject} fileChangeHandle={handleFileChange}></FileCard>
        <InfoCard info={info}></InfoCard>
        <DataTable data={data}></DataTable>
      </Layout>
  );
}

export default App;
