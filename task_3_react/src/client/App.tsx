import './css/App.css';
import '@fortawesome/fontawesome-free/css/all.css';
import './sse';
import {
    CSV_Data, fileInfo, responseObject
} from './types';
import React, {
    useEffect,
    useRef, useState
} from 'react';
import {
    convertCSVtoJSON, readCSV
} from './csv';
import CSVCard from './components/CSVCard';
import DataTable from './components/DataTable';
import FileCard from './components/FileCard';
import InfoCard from './components/InfoCard';
import Layout from './components/Layout';

function App () {
    const [
        data,
        setData
    ] = useState( [] as CSV_Data );
    const [
        info,
        setInfo
    ] = useState( {
        'filename': 'None',
        'filetype': 'None',
        'filesize': 'None',
        'rowcount': 0
    } );
    const [
        fileList,
        setFileList
    ] = useState( null as responseObject | null );
    // For the loading spinner in DataTable
    const [
        loading,
        setLoading
    ] = useState( false );
    // Add evenbt listener for server-sent events on first render
    const [
        active,
        setActive
    ] = useState( false );

    useEffect( () => {
        if ( !active ) {
            document.addEventListener( 'sse:uploaded', () => {
                fetch( '/status', {
                    'method': 'GET'
                } )
                    .then( response => response.json() )
                    .then( response => setFileList( response ) )
                    .catch( error => console.log( error ) );
            } );
            document.addEventListener( 'sse:deleted', () => {
                fetch( '/status', {
                    'method': 'GET'
                } )
                    .then( response => response.json() )
                    .then( response => setFileList( response ) )
                    .catch( error => console.log( error ) );
            } );
            setActive( true );
            // Initial fetch of file list at first component render
            fetch( '/status', {
                'method': 'GET'
            } )
                .then( response => response.json() )
                .then( response => setFileList( response ) )
                .catch( error => console.log( error ) );
        }
    } );

    const formRef = useRef( null );

    // This is triggered in CSVCard
    const handleFileUpload = async ( e: React.ChangeEvent<HTMLInputElement> ): Promise<void> => {
        setLoading( true );
        const file = e.target.files?.[0];

        if ( !file ) throw new Error( 'No file received' );

        const data = await readCSV( e );
        const newFileInfo: fileInfo = {
            'filename': file.name,
            'filetype': '.csv', // file.type delivers weird name
            'filesize': String( file.size ) + 'B',
            'rowcount': data.length
        };

        setInfo( newFileInfo );
        setData( data );
        setLoading( false );

        if ( formRef.current ) {
            // Upload to server
            const formData = new FormData( formRef.current );

            await fetch( '/upload?fname=' + file.name, {
                'method': 'POST',
                'body': formData
            } );
        }
    };

    const handleFileChange = async ( fileName: string ) => {
        setLoading( true );

        const response = await fetch( `/download/${ fileName }` );
        const blob = await response.blob();
        const text = await blob.text();

        if ( !response ) throw new Error( 'No file received' );

        const data = await convertCSVtoJSON( text );

        setInfo( {
            'filesize': blob.size + 'B',
            'filetype': response.headers.get( 'Content-Type' ) ?? 'text/csv',
            'filename': fileName,
            'rowcount': data.length
        } );

        // Updating fileInfo requires more effort since blob doesn't have the metadata
        setData( data );
        setLoading( false );
    };

    return (
        <Layout>
            <div className={'loading-spinner' + ( loading ? ' active' : '' )}>
                <div aria-busy="true" >
                    Loading...
                </div>
            </div>
            <CSVCard handleChange={handleFileUpload} formRef={formRef}></CSVCard>
            <FileCard fileList={fileList as responseObject} fileChangeHandle={handleFileChange}></FileCard>
            <InfoCard info={info}></InfoCard>
            <DataTable data={data}></DataTable>
        </Layout>
    );
}

export default App;
