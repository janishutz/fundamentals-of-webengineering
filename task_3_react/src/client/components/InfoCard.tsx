import {
    fileInfo
} from '../types';

const InfoCard = ( props: {
    'info': fileInfo
} ) => {
    let noFileMessage = <div></div>;

    if ( props.info.filename === 'None' )
        noFileMessage = <div id="data-info-placeholder">No file selected</div>;

    return (
        <article>
            <header>
                <h2>Data infos</h2>
            </header>
            <div className="info">
                {noFileMessage}
                <h4>Filename</h4>
                <p>{props.info.filename}</p>

                <h4>File type</h4>
                <p>{props.info.filetype}</p>

                <h4>File size</h4>
                <p>{props.info.filesize}</p>

                <h4>Number of rows</h4>
                <p>{props.info.rowcount}</p>
            </div>
        </article>
    );
};

export default InfoCard;

