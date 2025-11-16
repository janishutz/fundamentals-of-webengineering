import { responseObject } from "../types";

const FileCard = (props: {
    fileList: responseObject,
    fileChangeHandle: (fileName: string) => Promise<void>
}) => {

    const convert = (res: responseObject) => {
        let list = [];
        for (let i = 0; i < res.names.length; i++) {
            const elem = {
                filename: res.names[i],
                uploadTime: res.uploadTimes[i]
            }
            list.push(elem);
        }
        return list;
    }

    const list = props.fileList != null ? convert(props.fileList) : null;

    return (
        <article className="wide">
            <header>
                <h2>Select a File</h2>
            </header>
                <table id="table-content">
                    <thead>
                        <tr>
                            <th>Filename</th>
                            <th>Upload Time</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            list ? list.map( (file, i) => (
                                <FileRow key={i} filename={file.filename!} uploadTime={file.uploadTime!} fileChangeHandle={props.fileChangeHandle}></FileRow>
                            )) : <tr></tr>
                        }
                    </tbody>
                </table>
        </article>
    );
}

const FileRow = (props: {
    filename: string,
    uploadTime: string,
    fileChangeHandle: (fileName: string) => Promise<void>
}) => {

    const remFile = async () => {
        await fetch(`/delete/${props.filename}`, { method: "DELETE" });
    }

    return (
        <tr>
            <td>{props.filename}</td>
            <td>{props.uploadTime}</td>
            <td>
                <div className="action-icons">
                    <i onClick={() => { remFile()} }  className="fa-solid fa-trash-can"></i>
                    <i onClick={() => {props.fileChangeHandle(props.filename)}} className="fa-solid fa-file-arrow-down"></i>
                </div>
            </td>
        </tr>
    )
}

export default FileCard;