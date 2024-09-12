import { DESFIRE_COMM_MODE } from "../DesfireConstants";
import DesfireFile from "./DesfireFile";
import DesfireFileBuilder from "./DesfireFileBuilder";

class StandardFile extends DesfireFile {
    private fileSize: number;

    constructor(
        fileNumber: number,
        readAccess: boolean,
        writeAccess: boolean,
        readWriteAccess: boolean,
        changeAccess: boolean,
        communicationMode: DESFIRE_COMM_MODE,
        rfuBinary: string,
        additionalAccessRights: string,
        fileSize: number
    ) {
        super(fileNumber, readAccess, writeAccess, readWriteAccess, changeAccess, communicationMode, rfuBinary, additionalAccessRights);
        this.fileSize = fileSize;
    }

    public getFileSize(): number {
        return this.fileSize;
    }
}

class StandardFileBuider extends DesfireFileBuilder<StandardFile, StandardFileBuider> {
    private fileSize: number = 0;

    public withFileSize(fileSize: number): StandardFileBuider {
        this.fileSize = fileSize;
        return this;
    }

    public build(): StandardFile {
        return new StandardFile(
            this.fileNumber,
            this.readAccess,
            this.writeAccess,
            this.readWriteAccess,
            this.changeAccess,
            this.communicationMode,
            this.rfuBinary,
            this.additionalAccessRights,
            this.fileSize
        );
    }
}

export { StandardFile, StandardFileBuider };