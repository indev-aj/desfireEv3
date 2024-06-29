import 'react-native-get-random-values';
import CryptoJS from "crypto-js"
import log from '../../utils/logger';

class DesfireCrypto {
    static AESDecryptor = (encryptedData: string, key: string, iv: string = "00000000000000000000000000000000") => {
        let _key = CryptoJS.enc.Hex.parse(key);
        let _iv = CryptoJS.enc.Hex.parse(iv);
        let data = CryptoJS.enc.Hex.parse(encryptedData);

        try {
            const decrypted = CryptoJS.AES.decrypt(encryptedData, _key, {
                iv: _iv, 
                mode: CryptoJS.mode.CBC, 
                padding: CryptoJS.pad.NoPadding,
            })

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
}

export default DesfireCrypto;

// AES Key: 3F91B3E7A74088FDE6B2F4A3D9E187AB
// IV: D4F49E18C03B5730F2CDD09962F38229
// Encrypted Message: 59e0a9993e8c2173d2d8f1e5d5b8f0edf6dc4c62a6f5c7e28a4b1b1bf14f4f0d553f982118f5e49140d2060e91f8a7d
// Decrypted Message: Hello, World! This is a secret message.
