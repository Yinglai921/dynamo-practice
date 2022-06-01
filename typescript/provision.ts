import { DynamoDB } from "aws-sdk";

const client = new DynamoDB({
  endpoint: "http://localhost:8000",
  region: "local",
});

const params = {
  AttributeDefinitions: [
    {
      AttributeName: "PartitionKey",
      AttributeType: "S",
    },
    {
      AttributeName: "SortKey",
      AttributeType: "S",
    },
    {
      AttributeName: "Team",
      AttributeType: "S",
    },
  ],
  KeySchema: [
    {
      AttributeName: "PartitionKey",
      KeyType: "HASH",
    },
    {
      AttributeName: "SortKey",
      KeyType: "RANGE",
    },
  ],
  ProvisionedThroughput: {
    ReadCapacityUnits: 5,
    WriteCapacityUnits: 5,
  },
  TableName: "EMPLOYEE",
  GlobalSecondaryIndexes: [
    {
      IndexName: "TeamIndex",
      KeySchema: [
        {
          AttributeName: "Team",
          KeyType: "HASH",
        },
      ],
      Projection: {
        ProjectionType: "ALL",
      },
      ProvisionedThroughput: {
        ReadCapacityUnits: 1,
        WriteCapacityUnits: 1,
      },
    },
  ],
};

client.createTable(params, function (err, data) {
  if (err) console.log(err, err.stack); // an error occurred
  else console.log(data); // successful response
});
