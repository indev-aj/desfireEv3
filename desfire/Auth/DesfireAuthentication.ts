import log from "../../utils/logger";
import { DESFIRE_INS, DESFIRE_STATUS } from "../DesfireConstants";
import DesfireResponse from "../DesfireResponse";
import DesfireUtils from "../utils/DesfireUtils";
import DesfireCrypto from "./DesfireCrypto";

class DesfireAuthentication {
    private defaultLegacyKey: string = "0000000000000000";
    private defaultAESKey: string = "00000000000000000000000000000000";
    private static sessionKey: string = '';

    public get getDefaultLegacyKey() : string {
        return this.defaultLegacyKey;
    }

    public get getDefaultAESKey() : string {
        return this.defaultAESKey;
    }

    public static get getSessionKey() : string {
        return DesfireAuthentication.sessionKey;
    }

    static authenticateLegacy = async (keyNumber: number, key: string) : Promise<boolean> => {
        const legacy_iv = "00000000";

        let cmd = DESFIRE_INS.AUTH_LEGACY;
        let _keyNumber = DesfireUtils.intToHexArrayLSB(keyNumber, 1);

        let response = await DesfireResponse.sendCommand(cmd, _keyNumber);

        // get RandB_enc
        let randB_enc = response.data;
        log.info('Encrypted RandB: ', randB_enc);

        // decrypt randB
        let randB = DesfireCrypto.TDESDecryptor(randB_enc, key, legacy_iv);
        log.info('Decrypted RandB: ', randB);

        // rotate randB
        let randB_rotate = DesfireUtils.rotateLeft(randB!);
        log.info('RandB Rotate: ', randB_rotate);

        // generate randA enc
        let randA_enc = DesfireCrypto.generateRandomHexString(8);

        // decrypt randA
        let randA = DesfireCrypto.TDESDecryptor(randA_enc, key, legacy_iv);
        log.info('Decrypted RandA: ', randA);

        // xor RandA and RandB
        let randAB = DesfireUtils.xorHexStrings(randA!, randB_rotate);
        log.info("XOR Result: ", randAB);

        // encrypt xor
        let randAB_enc = DesfireCrypto.TDESEncryptor(randAB, key, legacy_iv);
        log.info("Encrypted XOR: ", randAB_enc);

        // concat RandA and RandAB
        let dataToSend = DesfireUtils.hexStringToByte(randA!.concat(randAB_enc!));

        log.title("Authenticate Part 2")
        cmd = DESFIRE_INS.ADDITIONAL_FRAME;
        response = await DesfireResponse.sendCommand(cmd, dataToSend);
        
        if (response.status != DESFIRE_STATUS.SUCCESS) {
            log.error("Wrong RandB'");
            return false;
        }

        let newRandA_enc = response.data;
        
        // decrypt new rand a
        let newRandA = DesfireCrypto.TDESDecryptor(newRandA_enc, key);
        log.info("Decrypted New RandA: ", newRandA);

        // rotate right
        let newRandA_rotate = DesfireUtils.rotateRight(newRandA!);
        log.info("New RandA Rotated: ", newRandA_rotate);

        // compare newRandA_rotate to the original RandA_enc. it should be identical
        // if not, return false
        if (newRandA_rotate.toUpperCase() !== randA_enc.toUpperCase()) {
            log.error("RandA' is not identical to original RandA. Authentication failed!\n");
            return false;
        }

        let sessionKeyArray: number[] = new Array(16).fill(0);
        const randABytes = DesfireUtils.hexStringToByte(randA!);
        const randBBytes = DesfireUtils.hexStringToByte(randB!);

        sessionKeyArray.splice(0, 4, ...randABytes.slice(0, 4));

        // Copy the first 4 bytes of randB to the session key
        sessionKeyArray.splice(4, 4, ...randBBytes.slice(0, 4));

        // Copy the last 4 bytes of randA to the session key
        sessionKeyArray.splice(8, 4, ...randABytes.slice(4, 8));

        // Copy the last 4 bytes of randB to the session key
        sessionKeyArray.splice(12, 4, ...randBBytes.slice(4, 8));

        DesfireAuthentication.sessionKey = sessionKeyArray.map(byte => 
            byte.toString(16).padStart(2, '0')).join('');
        
        log.title("Authentication successful!");
        return true;
    }

    static authenticateAES = async (keyNumber: number, key: string) => {
        let cmd = DESFIRE_INS.AUTH_AES;
        let _keyNumber = DesfireUtils.intToHexArrayLSB(keyNumber, 1);

        let response = await DesfireResponse.sendCommand(cmd, _keyNumber);
        
        let randB_enc = response.data;
        log.info("RandB Enc: ", randB_enc);

        let randB = DesfireCrypto.AESDecryptor(randB_enc, key);
        log.info("RandB: ", randB);

        let randB_rotate = await DesfireUtils.rotateLeft(randB!);
        log.info("RandB Rotate: ", randB_rotate);

        // Generate random 16-byte RndA
        const randA = DesfireCrypto.generateRandomHexString(16);
        log.info("RandA: ", randA);

        let randAB = randA.concat(randB_rotate);

        let iv = randB_enc;
        let randAB_enc = DesfireCrypto.AESEncryptor(randAB, key, iv);

        let dataToSend = DesfireUtils.hexStringToByte(randAB_enc!);

        cmd = DESFIRE_INS.ADDITIONAL_FRAME;
        response = await DesfireResponse.sendCommand(cmd, dataToSend);

        if (response.status != DESFIRE_STATUS.SUCCESS) {
            log.error("Wrong RandB'");
            return false;
        }

        let newRandA_enc = response.data;
        iv = randAB_enc!.slice(-32);

        // decrypt new rand a
        let newRandA = DesfireCrypto.AESDecryptor(newRandA_enc, key, iv);

        // rotate right
        let newRandA_rotate = DesfireUtils.rotateRight(newRandA!);

        if (newRandA_rotate.toUpperCase() !== randA.toUpperCase()) {
            log.info("RandA' is not identical to original RandA. Authentication failed!\n");
            return false;
        }

        let sessionKeyArray: number[] = new Array(16).fill(0);
        const randABytes = DesfireUtils.hexStringToByte(randA!);
        const randBBytes = DesfireUtils.hexStringToByte(randB!);

        sessionKeyArray.splice(0, 4, ...randABytes.slice(0, 4));

        // Copy the first 4 bytes of randB to the session key
        sessionKeyArray.splice(4, 4, ...randBBytes.slice(0, 4));

        // Copy the last 4 bytes of randA to the session key
        sessionKeyArray.splice(8, 4, ...randABytes.slice(12, 16));

        // Copy the last 4 bytes of randB to the session key
        sessionKeyArray.splice(12, 4, ...randBBytes.slice(12, 16));

        DesfireAuthentication.sessionKey = sessionKeyArray.map(byte => 
            byte.toString(16).padStart(2, '0')).join('');
        
        log.title("Authentication successful!");

        return true;
    }
    
    static authenticateEV2First = async (keyNumber: number, key: string) => {
        let cmd = DESFIRE_INS.AUTH_EV2_FIRST;
        let keyNo = DesfireUtils.intToHexArrayLSB(keyNumber, 1);

        let _lenCap = [0x02];
        let _pcdCap = [0xC0, 0x00];

        let dataToSend = keyNo.concat(_lenCap).concat(_pcdCap);

        let response = await DesfireResponse.sendCommand(cmd, dataToSend);
        log.info(response);
    }
}

export default DesfireAuthentication