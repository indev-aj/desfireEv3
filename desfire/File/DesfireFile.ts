import DesfireUtils from "../utils/DesfireUtils";
import { DESFIRE_COMM_MODE } from "../DesfireConstants";

class DesfireFile {
    protected fileNumber!: number;
    protected readAccess!: boolean;
    protected writeAccess!: boolean;
    protected readWriteAccess!: boolean;
    protected changeAccess!: boolean;

    protected communicationMode!: DESFIRE_COMM_MODE;
    protected additionalAccessRights!: string;
    protected rfuBinary!: string;

    protected fileOptions!: number[];
    protected accessRights!: number[];

    constructor(
        fileNumber: number,
        readAccess: boolean,
        writeAccess: boolean,
        readWriteAccess: boolean,
        changeAccess: boolean,
        communicationMode: DESFIRE_COMM_MODE,
        rfuBinary: string,
        additionalAccessRights: string
    ) {
        this.fileNumber = fileNumber;
        this.readAccess = readAccess;
        this.writeAccess = writeAccess;
        this.readWriteAccess = readWriteAccess;
        this.changeAccess = changeAccess;
        this.communicationMode = communicationMode;
        this.rfuBinary = rfuBinary;
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

    public getReadAccess(): boolean {
        return this.readAccess;
    }

    public getWriteAccess(): boolean {
        return this.writeAccess;
    }

    public getReadWriteAccess(): boolean {
        return this.readWriteAccess;
    }

    public getChangeAccess(): boolean {
        return this.changeAccess;
    }

    public getCommunicationMode(): DESFIRE_COMM_MODE {
        return this.communicationMode;
    }

    public getAdditionalAccessRights(): string {
        return this.additionalAccessRights;
    }

    public getRfuBinary(): string {
        return this.rfuBinary;
    }

    public getFileOptions(): number[] {
        return this.fileOptions;
    }

    public getAccessRights(): number[] {
        return this.accessRights;
    }
}

export default DesfireFile;