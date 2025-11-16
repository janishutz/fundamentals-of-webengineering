import * as fs from 'node:fs/promises';
import {
    EventEmitter
} from 'node:stream';
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

        fileEvent.emit( 'uploaded', file.fieldname + '-' + uniqueSuffix );

        cb( null, file.fieldname + '-' + uniqueSuffix );
    }
} );
// CSV file upload endpoint
const upload = multer( {
    'storage': storage
} );

class FileEvent extends EventEmitter {}

const fileEvent = new FileEvent();

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
        await fs.rm( filePath ); // deletes the file
        res.status( 200 ).send( 'File deleted successfully' );
        fileEvent.emit( 'deleted', filePath );
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


interface SSESubscriber {
    'uuid': string;
    'response': express.Response;
}

interface SSESubscribers {
    [id: string]: SSESubscriber | undefined;
}
const subscribers: SSESubscribers = {};

app.get( '/sse', async ( request: express.Request, response: express.Response ) => {
    response.writeHead( 200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
    } );
    response.status( 200 );
    response.flushHeaders();
    response.write( `data: ${ JSON.stringify( [] ) }\n\n` );

    const uuid = crypto.randomUUID();

    subscribers[uuid] = {
        'uuid': uuid,
        'response': response
    };

    request.on( 'close', () => {
        subscribers[ uuid ] = undefined;
    } );
} );

const sendSSEData = ( event: string, data: string ) => {
    const subs = Object.values( subscribers );

    for ( let i = 0; i < subs.length; i++ ) {
        subs[i]!.response.write( `data: ${ JSON.stringify( {
            'event': event,
            'data': data
        } ) }\n\n` );
    }
};

fileEvent.on( 'uploaded', file => {
    sendSSEData( 'uploaded', file );
} );
fileEvent.on( 'deleted', file => {
    sendSSEData( 'deleted', file );
} );

// Do not change below this line
ViteExpress.listen(
    app, 5173, () => console.log( 'Server is listening on http://localhost:5173' ),
);
