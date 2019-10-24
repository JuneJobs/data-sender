'use strict'
const Simulator =require('./lib/simulator'),
      simulator = new Simulator();

let sensor_info = {
    wmac:'FF58B9EAFDB0'
}

let timer = {};

let runner = () => {
    //get ssn
    let wmac = sensor_info.wmac;
    //set wmac
    simulator.wmac = wmac;
    simulator.run_sensor_identifier_request(wmac, (ssp_sir_rsp)=> {
        if(ssp_sir_rsp.payload.resultCode === 0) {    
            //connectionID 발급
            let ssn = ssp_sir_rsp.payload.ssn;
            simulator.run_dynamic_connection_addition(ssn, (ssp_dca_rsp)=> {
                if(ssp_dca_rsp.payload.resultCode === 0) {
                    let cid = ssp_dca_rsp.payload.cid;
                    simulator.cid = cid;
                    timer = setInterval(simulator.data_transfer, 3000);
                }
            });
        } else {
            console.log(`err,${process.argv[2]}`);
        }
    });

    //RAD TRN 시작
}

runner();

process.on('SIGUSR2', function(){
    clearInterval(timer);
});