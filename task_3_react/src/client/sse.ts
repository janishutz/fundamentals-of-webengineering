interface SSEMessage {
    'event': string,
    'data': string
}
const eventSource: EventSource = new EventSource( '/sse' );

eventSource.onopen = () => {
    document.dispatchEvent( new CustomEvent( 'sse:connect', {
        'detail': 'success',
        'cancelable': false
    } ) );
};

eventSource.onmessage = event => {
    const data: SSEMessage = JSON.parse( event.data );

    document.dispatchEvent( new CustomEvent( 'sse:' + data.event, {
        'cancelable': false,
        'detail': data.data
    } ) );
};
