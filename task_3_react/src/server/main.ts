import * as fs from 'node:fs/promises';
import ViteExpress from 'vite-express';
import express from 'express';
import multer from 'multer';
import path from 'path';
import {
    responseObject
} from './types';

const app = express();
// Set up file storage
const storage = multer.diskStorage( {
    'destination': './src/server/uploads',
    'filename': (
        _req, file, cb
    ) => {
    // Suggested in Multer's readme
        const uniqueSuffix = Date.now() + '-' + Math.round( Math.random() * 1E3 );

        cb( null, file.fieldname + '-' + uniqueSuffix );
    }
} );
// CSV file upload endpoint
const upload = multer( {
    'storage': storage
} );

app.post(
    '/upload',
    upload.single( 'dataFile' ),
    (
        req, res, next
    ) => {
        console.log(
            req, res, next
        );
    }
);

// Endpoint to send back file names/upload times
app.get( '/status', async ( _req, res ) => {
    const resObject: responseObject = {
        'names': [],
        'uploadTimes': []
    };
    const dir = await fs.opendir( './src/server/uploads/' );

    for await ( const file of dir ) {
        resObject.names.push( file.name );
        const stats = await fs.stat( `./src/server/uploads/${ file.name }` );

        resObject.uploadTimes.push( stats.birthtime.toString() );
    }

    res.status( 200 ).json( resObject );
} );

// Endpoint to send back whole files
app.get( '/download/:fileName', ( req, res ) => {
    const fileName = req.params.fileName;
    const filePath = path.join(
        __dirname, 'uploads', fileName
    ); // Filepaths must be absolute

    res.sendFile( filePath, err => {
        if ( err ) {
            console.error( 'Error sending file:', err );
            res.status( 500 ).send( 'Error downloading file' );
        }
    } );
} );

// Endpoint to remove files from server
app.delete( '/delete/:fileName', async ( req, res ) => {
    const fileName = req.params.fileName;
    const filePath = path.join(
        __dirname, 'uploads', fileName
    );

    try {
        await fs.unlink( filePath ); // deletes the file
        res.status( 200 ).send( 'File deleted successfully' );
    } catch ( error ) {
        console.error( 'Error deleting file:', error );
        res.status( 500 ).send( 'Error deleting file' );
    }
} );

// example route which returns a message
app.get( '/hello', async function ( _req, res ) {
    res.status( 200 ).json( {
        'message': 'Hello World!'
    } );
} );

// Do not change below this line
ViteExpress.listen(
    app, 5173, () => console.log( 'Server is listening on http://localhost:5173' ),
);
