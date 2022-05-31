import { v4 as uuidv4 } from "uuid";
import { DynamoDB } from "aws-sdk";

const client = new DynamoDB({
  endpoint: "http://localhost:8000",
  region: "local",
});

const FrameId = uuidv4();
const FeatureboxId = uuidv4();
const scheduleId = uuidv4();

const frameInfo = {
  name: randomString("str"),
  version: 1,
  modified: randomDateTime(),
  modifiedBy: randomString("name"),
};

const frameText = randomFrameText();
const frameMedia = randomFrameMedia();
const frameProgram = randomFrameProgramId();

const schedule = {
  id: scheduleId,
  FrameId,
  FeatureboxId,
  priority: 1,
  start: randomDateTime(),
  end: randomDateTime(),
  modified: randomDateTime(),
  modifiedBy: randomString("name"),
};

const featurebox = {
  FeatureboxId,
  featureboxName: randomString("str"),
  modified: randomDateTime(),
  modifiedBy: randomString("name"),
};

// frame info

client.putItem(
  {
    Item: {
      PartitionKey: {
        S: `FRAME:${FrameId}`,
      },
      SortKey: {
        S: `info`,
      },
      ...DynamoDB.Converter.marshall(frameInfo),
    },
    ReturnConsumedCapacity: "TOTAL",
    TableName: "FRAME_NEW",
  },
  function (err, data) {
    if (err) console.log(err, err.stack); // an error occurred
    else console.log(data); // successful response
  }
);

// frame  text
client.putItem(
  {
    Item: {
      PartitionKey: {
        S: `FRAME:${FrameId}`,
      },
      SortKey: {
        S: `sv:se:text`,
      },
      ...DynamoDB.Converter.marshall(frameText),
    },
    ReturnConsumedCapacity: "TOTAL",
    TableName: "FRAME_NEW",
  },
  function (err, data) {
    if (err) console.log(err, err.stack); // an error occurred
    else console.log(data); // successful response
  }
);

// frame media
client.putItem(
  {
    Item: {
      PartitionKey: {
        S: `FRAME:${FrameId}`,
      },
      SortKey: {
        S: `sv:se:media`,
      },
      ...DynamoDB.Converter.marshall(frameMedia),
    },
    ReturnConsumedCapacity: "TOTAL",
    TableName: "FRAME_NEW",
  },
  function (err, data) {
    if (err) console.log(err, err.stack); // an error occurred
    else console.log(data); // successful response
  }
);

// frame program

client.putItem(
  {
    Item: {
      PartitionKey: {
        S: `FRAME:${FrameId}`,
      },
      SortKey: {
        S: `sv:program`,
      },
      ...DynamoDB.Converter.marshall(frameProgram),
    },
    ReturnConsumedCapacity: "TOTAL",
    TableName: "FRAME_NEW",
  },
  function (err, data) {
    if (err) console.log(err, err.stack); // an error occurred
    else console.log(data); // successful response
  }
);

// featurebox

client.putItem(
  {
    Item: {
      PartitionKey: {
        S: `FEATUREBOX:${FeatureboxId}`,
      },
      SortKey: {
        S: "featurebox",
      },
      ...DynamoDB.Converter.marshall(featurebox),
    },
    ReturnConsumedCapacity: "TOTAL",
    TableName: "FRAME_NEW",
  },
  function (err, data) {
    if (err) console.log(err, err.stack); // an error occurred
    else console.log(data); // successful response
  }
);
// schedule
client.putItem(
  {
    Item: {
      PartitionKey: {
        S: `SCHEDULE:${scheduleId}`,
      },
      SortKey: {
        S: `${schedule.start}`,
      },
      ...DynamoDB.Converter.marshall(schedule),
    },
    ReturnConsumedCapacity: "TOTAL",
    TableName: "FRAME_NEW",
  },
  function (err, data) {
    if (err) console.log(err, err.stack); // an error occurred
    else console.log(data); // successful response
  }
);
// helper functions

export function randomDateTime(): String {
  function randomDate(start: Date, end: Date) {
    return new Date(
      start.getTime() + Math.random() * (end.getTime() - start.getTime())
    );
  }
  const base = new Date(2022, 0, 1);
  return randomDate(base, new Date()).toString();
}

export function randomFrameText() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return {
    version: 1,
    modified: randomDateTime(),
    modifiedBy: randomString("name"),
    title: randomString("str"),
    synopsis: randomString("str"),
  };
}

export function randomFrameMedia() {
  return {
    version: 1,
    modified: randomDateTime(),
    modifiedBy: randomString("name"),
    image34: randomString("link"),
    image169: randomString("link"),
    promoVideo34: randomString("link"),
    promoVideo169: randomString("link"),
  };
}

export function randomFrameProgramId() {
  return {
    version: 1,
    modified: randomDateTime(),
    modifiedBy: randomString("name"),
    programId: randomString("str"),
  };
}

export function randomString(
  type: "name" | "country" | "locale" | "link" | "str"
): string {
  const sampleNames = [
    "Alice",
    "Olivia",
    "Astrid",
    "Maja",
    "Vera",
    "Ebba",
    "Ella",
    "Wilma",
    "Alma",
    "Lilly",
    "Lucas",
    "Liam",
    "William",
    "Elias",
    "Noah",
    "Hugo",
    "Oliver",
    "Oscar",
    "Adam",
    "Matteo",
  ];
  const sampleCountries = ["sv", "da", "fi", "no", "is"];
  const sampleLocales = ["sv-se", "da-dk", "fi-fi", "no-nb", "is-is"];
  const sampleLink = [
    "https://sample.com",
    "https://hello.com",
    "https://yay.com",
  ];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let initList: any[] = [];

  switch (type) {
    case "country":
      initList = sampleCountries;
      break;
    case "locale":
      initList = sampleLocales;
      break;
    case "name":
      initList = sampleNames;
      break;
    case "link":
      initList = sampleLink;
      break;
    case "str":
      initList = ["hello", "world", "apa", "foo", "bar", "heder", "fixi"];
      break;
    default:
      break;
  }

  return initList[Math.floor(Math.random() * initList.length)];
}
