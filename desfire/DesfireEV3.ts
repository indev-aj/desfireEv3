import log from "../utils/logger";
import { DESFIRE_AUTH_TYPE, DESFIRE_INS, DESFIRE_STATUS } from "./DesfireConstants";
import DesfireUtils from "./utils/DesfireUtils";
import DesfireResponse from "./DesfireResponse";
import DesfireAuthentication from "./Auth/DesfireAuthentication";
import { ValueFile } from "./File/ValueFile";

class DesfireEV3 {
    private nfcManager: any;
    private appId: number[] = [0x12, 0x00, 0x00];
    private sessionKey: String = "";
    private sessionAuthMac: String = "";
    private sessionAuthEnc: String = "";

    authenticate = async (keyNumber: number, authType: DESFIRE_AUTH_TYPE, key: string) => {
        log.title("Authenticate");
        let isAuth = authType === DESFIRE_AUTH_TYPE.DES ?
            await DesfireAuthentication.authenticateLegacy(keyNumber, key) :
            await DesfireAuthentication.authenticateAES(keyNumber, key);

        if (isAuth) {
            this.sessionKey = DesfireAuthentication.getSessionKey;
            log.title("Session Key: ", this.sessionKey);
        } else {
            log.error("Authentication Failed");
        }
    }
    
    format = async () => {
        log.title("Format");
        let cmd = DESFIRE_INS.FORMAT;
        let response = await DesfireResponse.sendCommand(cmd);

        let status = response.status;
        if (status === DESFIRE_STATUS.SUCCESS) {
            console.log("Format Successful");
        }
    }

    createApplication = async (appId: number[] = this.appId) => {
        log.title("Create Application");
        let cmd = DESFIRE_INS.CREATE_APPLICATION;
        const param = [0x09, 0x81];
        const options = appId.concat(param);

        let response = await DesfireResponse.sendCommand(cmd, options);
        const status = response.status;

        if (status == DESFIRE_STATUS.SUCCESS) {
            console.log("Application Created Successfully");
        }
    }

    /*
    {
        "fileNumber": 1,
        "readAccess": true,
        "writeAccess": false,
        "readWriteAccess": false,
        "changeAccess": false,
        "communicationMode": "00",
        "rfuBinary": "00000",
        "additionalAccessRights": "0",
        "fileOptions": [
            0
        ],
        "accessRights": [
            0,
            16
        ],
        "lowerLimit": 0,
        "upperLimit": 1000,
        "value": 500,
        "limitedCreditEnabled": true,
        "freeGetValue": false
    }
  */
    createValueFile = async (file: ValueFile) => {
        log.title("Create Value File");
        let cmd = DESFIRE_INS.CREATE_VALUE_FILE;

        let _fileNo = DesfireUtils.intToHexArrayLSB(file['fileNumber'], 1);
        let _lowerLimit = DesfireUtils.intToHexArrayLSB(file["lowerLimit"], 4);
        let _upperLimit = DesfireUtils.intToHexArrayLSB(file["upperLimit"], 4);
        let _value = DesfireUtils.intToHexArrayLSB(file["value"], 4);

        let _limitedCreditValueEnabled = file["limitedCreditEnabled"] ? '1' : '0';
        let _getFreeValue = file["freeGetValue"] ? '1' : '0';

        const limitedRfuBinary = file["rfuBinary"];
        let limitedCreditString = limitedRfuBinary.concat(_getFreeValue).concat(_limitedCreditValueEnabled);
        let limitedCreditBinary = parseInt(limitedCreditString, 2);
        let _limitedCredit = DesfireUtils.intToHexArrayLSB(limitedCreditBinary, 1);

        let options = _fileNo.concat(file["fileOptions"]).concat(file["accessRights"])
                            .concat(_lowerLimit).concat(_upperLimit).concat(_value).concat(_limitedCredit);

        let response = await DesfireResponse.sendCommand(cmd, options);
        const status = response.status;

        // TODO: Parameter Error
    }

    selectApplication = async (aid = [0x00, 0x00, 0x00]) => {
        let cmd = DESFIRE_INS.SELECT_APPLICATION;

        const response = await DesfireResponse.sendCommand(cmd, aid);
        const status = response.status;

        if (status === DESFIRE_STATUS.SUCCESS) {
            console.log("Application Successfully Selected with AID: ", aid);
        }
    }

    getUid = async () => {
        let cmd = DESFIRE_INS.GET_UID;
        let response = await DesfireResponse.sendCommand(cmd);
        log.info(response);

        cmd = DESFIRE_INS.ADDITIONAL_FRAME;

        response = await DesfireResponse.sendCommand(cmd);        
        response = await DesfireResponse.sendCommand(cmd);

        let cardUid = response.data.slice(0, 14);
        cardUid = ("0x").concat(cardUid);

        return cardUid;
    }
}

export default DesfireEV3;