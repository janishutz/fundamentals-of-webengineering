import React from "react";
import "../Layout.css";

const CSVCard = (props: { 
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}) => {
  return (
    <article>
        <header>
            <h2>Select CSV data</h2>
        </header>
        <form>
            <label htmlFor="file-input" className="custom-file-upload">
                <i className="fa fa-file-csv"></i> Select CSV file to explore
            </label>
            <input id="file-input" type="file" aria-describedby="fileHelp" accept="text/csv" onChange={props.handleChange}/>
            <small>Please upload a CSV file, where the first row is the header.</small>
        </form>
    </article>
  );
}

export default CSVCard;