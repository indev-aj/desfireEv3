import { Platform } from "react-native";
import log from "../utils/logger";
import { DESFIRE_INS, DESFIRE_STATUS } from "./DesfireConstants";
import DesfireUtils from "./utils/DesfireUtils";

import nfcManager from 'react-native-nfc-manager';

type CommandResponse = {
    status: DESFIRE_STATUS;
    data: string,
};

class DesfireResponse {
    static sendCommand = async (command: DESFIRE_INS, data?: number[]): Promise<CommandResponse> => {
        let status: DESFIRE_STATUS = DESFIRE_STATUS.COMMAND_ABORTED;
        let result: string = "";
    
        if (Platform.OS === "ios") {
    
        } else {
            let instruction = DesfireUtils.intToHexArrayLSB(command, 1);
        
            instruction = data ? instruction.concat(data) : instruction;
    
            await nfcManager.transceive(instruction).then((response: any) => {
                const decimalArray = response;
                
                status = decimalArray[0];
                decimalArray.shift();
                result = DesfireUtils.getHexFromDecArray(decimalArray);
            })
        }
    
        // Construct the CommandResponse object
        const response: CommandResponse = {
            status,
            data: result,
        };
    
        // Log status based on DESFIRE_STATUS
        switch (status as DESFIRE_STATUS) {
            case DESFIRE_STATUS.SUCCESS:
                log.title("Operation Success");
                break;
            case DESFIRE_STATUS.ADDITIONAL_FRAME:
                log.title("Additional Frame");
                break;
            case DESFIRE_STATUS.AUTHENTICATION_ERROR:
                log.error("Authentication Error");
                break;
            case DESFIRE_STATUS.COMMAND_ABORTED:
                log.error("Command Aborted");
                break;
            case DESFIRE_STATUS.DUPLICATE_ERROR:
                log.error("Duplicate Error");
                break;
            case DESFIRE_STATUS.INTEGRITY_ERROR:
                log.error("Integrity Error");
                break;
            case DESFIRE_STATUS.LENGTH_ERROR:
                log.error("Length Error");
                break;
            case DESFIRE_STATUS.MEMORY_ERROR:
                log.error("Memory Error");
                break;
            case DESFIRE_STATUS.OUT_OF_MEMORY:
                log.error("Out of Memory Error");
                break;
            case DESFIRE_STATUS.PARAMETER_ERROR:
                log.error("Parameter Error");
                break;
            case DESFIRE_STATUS.PERMISSION_DENIED:
                log.error("Permission Denied");
                break;
            default:
                break;
        }
    
        return response;
    };
}

export default DesfireResponse;