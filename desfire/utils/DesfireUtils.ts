import 'react-native-get-random-values';
import CryptoJS from 'crypto-js';

class DesfireUtils {
    /**
     * 
     * @param {number[]} response - Array of decimals
     * @returns {string}  2 place Hex
     */
    static getHexFromDecArray(response: number[]): string {
        return response.map(dec => dec.toString(16).toUpperCase().padStart(2, '0')).join('');
    }

    /**
     * 
     * @param {number} amount 
     * @param {number} byteLength if none given, it will default to 4
     * @returns {number[]} Array of hexadecimals in LSB order
     */
    static intToHexArrayLSB(amount: number, byteLength: number = 4): number[] {
        // Convert the integer to its hexadecimal representation
        let hexString = amount.toString(16).toUpperCase().padStart(byteLength * 2, '0');
    
        // Split the padded hexadecimal string into pairs of characters and reverse the order
        let hexPairs = hexString.match(/.{1,2}/g)?.reverse() || [];
    
        // If the number of bytes is less than 4, pad with zeros
        while (hexPairs.length < byteLength) {
            hexPairs.push("00");
        }
    
        // Convert each pair of characters back to its corresponding int value
        let hexArray = hexPairs.map(hex => parseInt(hex, 16));
        return hexArray;
    }

    /**
     * 
     * @param {string} hexString 
     * @returns {Uint8Array} byte array
     */
    static hexStringToUint8Array(hexString: string): Uint8Array {
        const bytes: number[] = [];
        for (let i = 0; i < hexString.length; i += 2) {
            bytes.push(parseInt(hexString.substr(i, 2), 16));
        }
        return new Uint8Array(bytes);
    }

    static hexStringToByte(hexString: string): number[] {
        const bytes: number[] = [];
        for (let i = 0; i < hexString.length; i += 2) {
            bytes.push(parseInt(hexString.substr(i, 2), 16));
        }
        return bytes;
    }

    /**
     * Rotate given hexadecimal to the left by one byte
     * @param {string} source 
     * @returns {string}
     */
    static rotateLeft(source: string): string {
        // Extract the first character
        const firstCharacter = source.charAt(0);
        const secondCharacter = source.charAt(1);
        // Remove the first character and concatenate it to the end
        source = source.slice(1) + firstCharacter;
        return source.slice(1) + secondCharacter;
    }

    /**
     * Rotate given hexadecimal to the right by one byte
     * @param {string} source 
     * @returns {string}
     */
    static rotateRight(source: string): string {
        // Extract the last character
        const lastCharacter = source.charAt(source.length - 1);
        const secondLastCharacter = source.charAt(source.length - 2);
        
        source = lastCharacter + source.slice(0, -2);
        return secondLastCharacter + source;
    }

    /**
     * 
     * @param {string} hexString1 
     * @param {string} hexString2 
     * @returns {string}
     */
    static xorHexStrings(hexString1: string, hexString2: string): string {
        // Convert hexadecimal strings to arrays of integers
        const array1 = hexString1.match(/.{1,2}/g)?.map(hex => parseInt(hex, 16)) || [];
        const array2 = hexString2.match(/.{1,2}/g)?.map(hex => parseInt(hex, 16)) || [];
    
        // Perform XOR operation between corresponding integers
        const resultArray = array1.map((value, index) => value ^ array2[index]);
    
        // Convert result array back to hexadecimal string
        const resultHexString = resultArray.map(value => value.toString(16).padStart(2, '0')).join('');
    
        return resultHexString;
    }

    static generateCrc32Table(): number[] {
        let crcTable: number[] = [];
        for (let i = 0; i < 256; i++) {
            let crc = i;
            for (let j = 8; j > 0; j--) {
                if ((crc & 1) !== 0) {
                    crc = (crc >>> 1) ^ 0xEDB88320;
                } else {
                    crc = crc >>> 1;
                }
            }
            crcTable[i] = crc >>> 0;
        }
        return crcTable;
    }

    /**
     * 
     * @param {Uint8Array} databuf 
     * @returns {number}
     */
    static calculateCrc32(databuf: Uint8Array): number {
        const crc32Table = this.generateCrc32Table();

        let crc = 0xFFFFFFFF;
        for (let i = 0; i < databuf.length; i++) {
            let byte = databuf[i];
            let temp = (crc ^ byte) & 0xFF;
            crc = (crc >>> 8) ^ crc32Table[temp];
        }

        return crc >>> 0;
    }

    // Function to reverse a hexadecimal string
    static reverseHex(hex: string): string {
        return hex.match(/.{1,2}/g)?.reverse().join('') || '';
    }

    // /**
    //  * 
    //  * @param {string} encryptedData 
    //  * @param {string} key 
    //  * @param {string} iv 
    //  * @returns {string | null}
    //  */
    // static aesDecryptor(encryptedData: string, key: string, iv: string = "00000000000000000000000000000000"): string | null {
    //     let decryptKey = CryptoJS.enc.Hex.parse(key);
    //     let decryptIv = CryptoJS.enc.Hex.parse(iv);

    //     try {
    //         const decrypted = CryptoJS.AES.decrypt(
    //             { ciphertext: CryptoJS.enc.Hex.parse(encryptedData) },
    //             decryptKey,
    //             { iv: decryptIv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.NoPadding }
    //         );
    //         const decryptedString = decrypted.toString(CryptoJS.enc.Hex);

    //         return decryptedString;
    //     } catch (e) {
    //         console.error("Decrypt Error: ", e);
    //         return null;
    //     }
    // }

    // /**
    //  * 
    //  * @param {string} hexString 
    //  * @param {string} key 
    //  * @param {string} iv 
    //  * @returns {string | null}
    //  */
    // static aesEncryptor(hexString: string, key: string, iv: string = "00000000000000000000000000000000"): string | null {
    //     key = CryptoJS.enc.Hex.parse(key);
    //     iv = CryptoJS.enc.Hex.parse(iv);

    //     try {
    //         // console.log("IV used: ", iv.toString(CryptoJS.enc.Hex));
    //         const hexWordArray = CryptoJS.enc.Hex.parse(hexString);
    //         const encrypted = CryptoJS.AES.encrypt(hexWordArray, key, 
    //             {
    //                 iv: iv,
    //                 mode: CryptoJS.mode.CBC,
    //                 padding: CryptoJS.pad.NoPadding,
    //             });
    //         const encryptedHex = encrypted.ciphertext.toString(CryptoJS.enc.Hex);

    //         return encryptedHex;
    //     } catch (e) {
    //         console.error("Encrypt Error: ", e);
    //         return null;
    //     }
    // }
}

export default DesfireUtils;
