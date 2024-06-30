import 'react-native-get-random-values';
import CryptoJS from "crypto-js"
import log from '../../utils/logger';

class DesfireCrypto {
    static AESDecryptor = (encryptedData: string, key: string, iv: string = "00000000000000000000000000000000") => {
        let _key = CryptoJS.enc.Hex.parse(key);
        let _iv = CryptoJS.enc.Hex.parse(iv);
        let data = CryptoJS.enc.Hex.parse(encryptedData);

        const cipherParams = CryptoJS.lib.CipherParams.create({
            ciphertext: data
        });

        try {
            const decrypted = CryptoJS.AES.decrypt(
                cipherParams,
                _key,
                { iv: _iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.NoPadding }
            );

            const decryptedString = decrypted.toString(CryptoJS.enc.Hex);
            return decryptedString;
        } catch (e) {
            console.error("Decrypt Error: ", e);
            return null;
        }
    }

    static AESEncryptor = (msg: string, key: string, iv: string = "00000000000000000000000000000000") => {
        let _key = CryptoJS.enc.Hex.parse(key);
        let _iv = CryptoJS.enc.Hex.parse(iv);

        try {
            const hexWordArray = CryptoJS.enc.Hex.parse(msg);
            const encrypted = CryptoJS.AES.encrypt(hexWordArray, _key, 
                {
                    iv: _iv,
                    mode: CryptoJS.mode.CBC,
                    padding: CryptoJS.pad.NoPadding,
                });
            const encryptedHex = encrypted.ciphertext.toString(CryptoJS.enc.Hex);
            return encryptedHex;
        } catch (e) {
            console.error("Decrypt Error: ", e);
            return null;
        }
    }

    static example() {
        /*
            Encrypted: 24677DDBD46349E623798FD729006E79
            Decrypted: FA659AD0DCA738DD65DC7DC38612AD81
        */
       
        let encrypted = "24677DDBD46349E623798FD729006E79";
        let data = this.AESDecryptor(encrypted, "00000000000000000000000000000000");
        console.log("data: ",data);

        let decrypted = this.AESEncryptor(data!, "00000000000000000000000000000000");
        console.log("decrypted: ",decrypted);
    }
}

export default DesfireCrypto;
