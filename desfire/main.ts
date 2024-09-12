import { DESFIRE_COMM_MODE } from "./DesfireConstants";
import { ValueFileBuilder } from "./File/ValueFile";
import { StandardFileBuider } from "./File/StandardFile";

const valueFile = new ValueFileBuilder()
    .withFileNumber(1)
    .withReadAccess(true)
    .withWriteAccess(false)
    .withCommunicationMode(DESFIRE_COMM_MODE.PLAIN)
    .withLowerLimit(0)
    .withUpperLimit(1000)
    .withValue(500)
    .withLimitedCreditEnabled(true)
    .withFreeGetValue(false)
    .build();

const standardFile = new StandardFileBuider()
    .withFileNumber(2)
    .withReadAccess(true)
    .withWriteAccess(false)
    .withCommunicationMode(DESFIRE_COMM_MODE.PLAIN)
    .withFileSize(1000)
    .build();

console.log(valueFile);
console.log(standardFile);