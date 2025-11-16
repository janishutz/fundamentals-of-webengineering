import React from "react";
import "../css/Layout.css";

const CSVCard = (props: { 
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
  formRef: React.RefObject<HTMLFormElement>
}) => {
  return (
    <article>
        <header>
            <h2>Upload CSV data</h2>
        </header>
        <form ref={props.formRef} action="/upload" method="post" encType="multipart/form-data" >
            <label htmlFor="file-input" className="custom-file-upload">
                <i className="fa fa-file-csv"></i> Select CSV file to explore
            </label>
            <input id="file-input" type="file" name="dataFile" aria-describedby="fileHelp" accept="text/csv" onChange={props.handleChange}/>
            <small>Please upload a CSV file, where the first row is the header.</small>
        </form>
    </article>
  );
}

export default CSVCard;