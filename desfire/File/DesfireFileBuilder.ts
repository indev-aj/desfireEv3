import { DESFIRE_COMM_MODE } from "../DesfireConstants";
import DesfireFile from "./DesfireFile";

abstract class DesfireFileBuilder<T extends DesfireFile, B extends DesfireFileBuilder<T, B>> {
    protected fileNumber!: number;
    protected readAccess: boolean = false;
    protected writeAccess: boolean = false;
    protected readWriteAccess: boolean = false;
    protected changeAccess: boolean = false;
    protected communicationMode: DESFIRE_COMM_MODE = DESFIRE_COMM_MODE.PLAIN;
    protected additionalAccessRights: string = '0';
    protected rfuBinary: string = '00000';

    public withFileNumber(fileNumber: number): B {
        this.fileNumber = fileNumber;
        return this as unknown as B;
    }

    public withReadAccess(readAccess: boolean): B {
        this.readAccess = readAccess;
        return this as unknown as B;
    }

    public withWriteAccess(writeAccess: boolean): B {
        this.writeAccess = writeAccess;
        return this as unknown as B;
    }

    public withReadWriteAccess(readWriteAccess: boolean): B {
        this.readWriteAccess = readWriteAccess;
        return this as unknown as B;
    }

    public withChangeAccess(changeAccess: boolean): B {
        this.changeAccess = changeAccess;
        return this as unknown as B;
    }

    public withCommunicationMode(communicationMode: DESFIRE_COMM_MODE): B {
        this.communicationMode = communicationMode;
        return this as unknown as B;
    }

    public withAdditionalAccessRights(additionalAccessRights: string): B {
        this.additionalAccessRights = additionalAccessRights;
        return this as unknown as B;
    }

    public withRFUBinary(rfuBinary: string): B {
        this.rfuBinary = rfuBinary;
        return this as unknown as B;
    }

    abstract build(): T;
}

export default DesfireFileBuilder;