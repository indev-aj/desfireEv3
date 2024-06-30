import log from "../../utils/logger";
import { DESFIRE_INS, DESFIRE_STATUS } from "../DesfireConstants";
import DesfireResponse from "../DesfireResponse";
import DesfireUtils from "../utils/DesfireUtils";
import DesfireCrypto from "./DesfireCrypto";

class DesfireAuthentication {
    private defaultLegacyKey: string = "0000000000000000";
    private defaultAESKey: string = "00000000000000000000000000000000";

    public get getDefaultLegacyKey() : string {
        return this.defaultLegacyKey;
    }

    public get getDefaultAESKey() : string {
        return this.defaultAESKey;
    }

    static authenticateLegacy = async (keyNumber: number, key: string) : Promise<boolean> => {
        const legacy_iv = "00000000";

        let cmd = DESFIRE_INS.AUTH_LEGACY;
        let _keyNumber = DesfireUtils.intToHexArrayLSB(keyNumber, 1);

        let response = await DesfireResponse.sendCommand(cmd, _keyNumber);
        log.info("Auth Response: ", response);

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

        return true;
    }

    static authenticateAES = async (keyNumber: number, key: string) => {
        let cmd = DESFIRE_INS.AUTH_AES;
        let _keyNumber = DesfireUtils.intToHexArrayLSB(keyNumber, 1);

        let response = await DesfireResponse.sendCommand(cmd, _keyNumber);
        log.info("Auth Response: ", response);
        
        /*
        let randB_enc = response.data;
        log.info("RandB Enc: ", randB_enc);

        let randB = DesfireCrypto.AESDecryptor(randB_enc, key);
        log.info("RandB: ", randB);

        let randB_rotate = await DesfireUtils.rotateLeft(randB!);
        log.info("RandB Rotate: ", randB_rotate);

        // Generate random 16-byte RndA
        const randA = "112233445566778899AABBCCDDEEFFGG";
        log.info("RandA: ", randA);

        let randAB = randA.concat(randB_rotate);

        let iv = CryptoJS.enc.Hex.parse(randB_enc).toString();
        let randAB_enc = DesfireCrypto.AESEncryptor(randAB, key, iv);

        let dataToSend = DesfireUtils.hexStringToByte(randAB_enc!);

        cmd = DESFIRE_INS.ADDITIONAL_FRAME;
        response = await DesfireResponse.sendCommand(cmd, dataToSend);

        log.info("Auth Response: ", response);
        */
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