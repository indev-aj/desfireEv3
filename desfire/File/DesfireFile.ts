import DesfireUtils from "../utils/DesfireUtils";
import { DESFIRE_COMM_MODE, DesfireCommMode } from "../DesfireConstants";

class DesfireFile {
    private fileNumber!: number;
    private readAccess!: boolean;
    private writeAccess!: boolean;
    private readWriteAccess!: boolean;
    private changeAccess!: boolean;

    // not sure what type yet
    private communicationMode!: DesfireCommMode;
    private additionalAccessRights!: string;
    private rfuBinary: string = "00000";

    private fileOptions!: number[];
    private accessRights!: number[];

    constructor(
        fileNumber: number,
        readAccess: boolean,
        writeAccess: boolean,
        readWriteAccess: boolean,
        changeAccess: boolean,
        communicationMode: string,
        additionalAccessRights: DesfireCommMode
    ) {
        this.fileNumber = fileNumber;
        this.readAccess = readAccess;
        this.writeAccess = writeAccess;
        this.readWriteAccess = readWriteAccess;
        this.changeAccess = changeAccess;
        this.communicationMode = communicationMode;
        this.additionalAccessRights = additionalAccessRights;

        this.buildFileOptions();
        this.buildAccessRights();
    }

    private buildFileOptions() {
        let fileOptionsString = this.rfuBinary.concat(this.additionalAccessRights).concat(this.communicationMode);
        let fileOptionsBinary = parseInt(fileOptionsString, 2);
        
        this.fileOptions = DesfireUtils.intToHexArrayLSB(fileOptionsBinary, 1);
    }

    private buildAccessRights() {
        let _readAccess = DesfireUtils.intToHexArrayLSB(Number(this.readAccess), 1);
        let _writeAccess = DesfireUtils.intToHexArrayLSB(Number(this.writeAccess), 1);
        let _readWriteAccess = DesfireUtils.intToHexArrayLSB(Number(this.readWriteAccess), 1);
        let _changeAccess = DesfireUtils.intToHexArrayLSB(Number(this.changeAccess), 1);

        let _accessRightFirstBit = _readWriteAccess.join("") + _changeAccess.join("");
        let _accessRightLastBit = _readAccess.join("") + _writeAccess.join("");

        this.accessRights = DesfireUtils.hexStringToByte(_accessRightFirstBit).concat(DesfireUtils.hexStringToByte(_accessRightLastBit));
    }
}