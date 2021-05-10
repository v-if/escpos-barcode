const printer = require('printer')
const log = require('electron-log')

const CRLF = Buffer.from([0x0D, 0x0A])
const ESC_ALT = Buffer.from([0x1B, 0x40])
const HALF_CUT = Buffer.from([0x1B, 0x6D])

function print() {
    log.info('Start print')
    let data

    let s1 = 'www.google.com'
    let s1_leng = s1.length + 3

    let barcode = Buffer.concat([ESC_ALT
        , Buffer.from([0x1D, 0x48, 0]) // 0.Not printed, 1.Above, 2.Below, 3.Both
        , Buffer.from([0x1D, 0x77, 2]) // width
        , Buffer.from([0x1D, 0x68, 64]) // height
        , Buffer.concat([Buffer.from([0x1D, 0x6B, 72, s1_leng]), Buffer.from(s1)]) // 72.CODE93
    ])
    log.info(barcode)

    data = Buffer.concat([ESC_ALT,
        barcode,
        HALF_CUT])

    log.debug(data)

    printer.printDirect({
        data: data,
        printer: get_print_name(),
        type: 'RAW',
        success: function(jobID){
            log.debug('sent to printer with ID: ' + jobID)
        },
        error:function(err){
            log.error(err)
        }

    })
    log.info('End print')
}
