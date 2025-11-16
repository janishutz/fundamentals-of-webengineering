import { Key, SetStateAction, useState } from "react";
import { CSV_Data } from "../types";

const DataTable = (props: {data: CSV_Data}) => {
    if (props.data.length == 0) return <></>;

    const header = Object.keys(props.data[0]!);
    const [sortCol, setSortCol] = useState("None");
    const [sortType, setSortType] = useState("asc");

    const sortingHandler = (col: String) => { 
        if (sortCol !== col) {
            setSortCol(col as SetStateAction<string>); 
            setSortType("asc");
        } else if (sortType === "asc") {
            setSortType("desc");
        } else {
            setSortCol("None");
            setSortType("None");
        }
    }

    if (sortCol !== "None" && sortType === "asc") {
        props.data.sort( (a, b) => {
            if (a[sortCol]! < b[sortCol]!) return -1;
            if (a[sortCol]! > b[sortCol]!) return 1;
            return 0;
        }); 
    } else if (sortCol !== "None" && sortType === "desc") {
        props.data.sort( (a, b) => {
            if (a[sortCol]! > b[sortCol]!) return -1;
            if (a[sortCol]! < b[sortCol]!) return 1;
            return 0;
        });
    }

    return (
        <article className="table-container">
            <header>
                <h2>Data table</h2>
            </header>
            <div className="table-scroll-wrapper">
                <table id="table-content">
                    <thead>
                        <tr>
                        {
                            header.map( (col) => (
                                <ColHeader col={col} sortingHandle={sortingHandler} isSelected={col == sortCol} sortType={sortType}></ColHeader>
                            ))
                        }
                        </tr>
                    </thead>
                    <tbody>
                        {
                            props.data.map( (row, i) => (
                                <tr key={i}>
                                    {
                                        header.map( (col) => (
                                            <Row col={col} content={row[col] as String}></Row>
                                        ))
                                    }
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
            </div>
        </article>
    )
}

const ColHeader = (props: {col: String, sortingHandle: (s: String) => void, isSelected: boolean, sortType: String}) => {
    return (
        <th 
            className={
                props.isSelected 
                ? (props.sortType === "asc" ? "active sorting asc" : "active sorting desc")
                : "sortable"
            } 
            onClick={() => {props.sortingHandle!(props.col)}} 
            key={props.col as Key}>
            {props.col}
        </th>
    );
}

const Row = (props: {col: String, content: String}) => {
    return <td key={props.col as Key}>{props.content}</td>;
}

export default DataTable;