import {
    fileInfo
} from '../types';

const InfoCard = ( props: {
    'info': fileInfo
} ) => {
    return (
        <article>
            <header>
                <h2>Data infos</h2>
                <InfoRenderer info={props.info}></InfoRenderer>
            </header>
        </article>
    );
};

const InfoRenderer = ( props: {
    'info': fileInfo
} ) => {
    if ( props.info.filename !== 'None' ) {
        return <div className="info">
            <h4>Filename</h4>
            <p>{props.info.filename}</p>

            <h4>File type</h4>
            <p>{props.info.filetype}</p>

            <h4>File size</h4>
            <p>{props.info.filesize}</p>

            <h4>Number of rows</h4>
            <p>{props.info.rowcount}</p>
        </div>;
    } else {
        return <div className="info">
            <p>No file selected</p>
        </div>;
    }
};


export default InfoCard;
