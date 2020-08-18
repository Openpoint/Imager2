var AF_initDataKeys = ["ds:0", "ds:1"];
var AF_dataServiceRequests = {
    'ds:0': {
        id: 'ewC93d',
        request: [null, 2, null, null, null, null, null, [], null, null, null, null, null, []]
    },
    'ds:1': {
        id: 'HoAMBc',
        request: [null, null, [null, null, null, 1, null, [],
            [],
            [], null, null, null, null, null, []
        ], null, "isz:l", null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, "vip\u003d74.125.193.147,server_port\u003d443,client_port\u003d48810,tcp_connection_request_count\u003d0,header_order\u003dHUAEL,gfe_version\u003d2.682.2,ssl,ssl_info\u003dTLSv1.3:RNA:T,tlsext\u003dS,sni\u003dwww.google.com,hex_encoded_client_hello\u003d9a9a130113021303c02bc02fc02cc030cca9cca8c013c014009c009d002f0035-00-7a7a00000017ff01000a000b002300100005000d00120033002d002b001b6a6a0015,c\u003d1301,pn\u003dalpn,ja3\u003db32309a26951912be7dba376398abc3b,rtt_source\u003dtcp,rtt\u003d40,srtt\u003d40,client_protocol\u003dh2,client_transport\u003dtcp,first_request\u003d1,ip_block_version\u003d1,ip_block_index\u003d52815,gfe\u003ddibg10-20020a17052a054ab0290011a3d71b61,pzf\u003dLinux 2.2.x-3.x [4:53+11:0:1420:mss*44/7:mss/sok/ts/nop/ws:df/id+:0] [generic tos:0x20],vip_region\u003ddefault,asn\u003d6830,cc\u003dIE,eid\u003djrc6X-aiNvWJ1fAPk6uzsAg", null, ["seaside"], "www.google.com", true, "", 4]
    }
};
var AF_initDataChunkQueue = [];
var AF_initDataCallback;
var AF_initDataInitializeCallback;
if (AF_initDataInitializeCallback) {
    AF_initDataInitializeCallback(AF_initDataKeys, AF_initDataChunkQueue, AF_dataServiceRequests);
}
if (!AF_initDataCallback) {
    AF_initDataCallback = function (chunk) {
        AF_initDataChunkQueue.push(chunk);
    };
}