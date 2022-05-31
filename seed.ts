import { DynamoDB } from "aws-sdk";

export const employees = [
  {
    id: "123",
    email: "yinglai.xu@viaplay.com",
    phone: "+46 0790223362",
    name: "Yinglai Xu",
    role: "developer",
    Team: "kraken",
  },
  {
    id: "340958340",
    email: "jane.doe@viaplay.com",
    phone: "+46 0790000000",
    name: "Jane Doe",
    role: "developer",
    Team: "kraken",
  },
  {
    id: "340958340",
    email: "jane.doe@viaplay.com",
    phone: "+46 0790000000",
    name: "Jane Doe",
    role: "product manager",
    Team: "nova",
  },
  {
    id: "56787",
    email: "leilani.hopkins@nentgroup.com",
    phone: "+46 0700000000",
    name: "Leilani Hopkins",
    role: "engineer manager",
    Team: "kraken",
  },
  {
    id: "56787",
    email: "leilani.hopkins@nentgroup.com",
    phone: "+46 0700000000",
    name: "Leilani Hopkins",
    role: "engineer manager",
    Team: "message",
  },
  {
    id: "45698394",
    email: "liza.T@nentgroup.com",
    phone: "+46 0700000000",
    name: "Liza T",
    role: "product manager",
    Team: "kraken",
  },
];

export const repositories = [
  {
    id: "3053745",
    link: "https://github.com/nentgroup/lego",
    Team: "kraken",
    createdAt: "2010-01-01",
  },
  {
    id: "34095830",
    link: "https://github.com/nentgroup/cms-admin",
    Team: "kraken",
    createdAt: "2011-01-01",
  },
  {
    id: "05834",
    link: "https://github.com/nentgroup/content",
    Team: "content",
    createdAt: "2012-01-01",
  },
];

const client = new DynamoDB({
  endpoint: "http://localhost:8000",
  region: "local",
});

for (const repository of repositories) {
  const rest = DynamoDB.Converter.marshall(repository);
  const params = {
    Item: {
      PartitionKey: {
        S: `REPOSITORY:${repository.id}`,
      },
      SortKey: {
        S: `${repository.createdAt}`,
      },
      ...rest,
    },
    ReturnConsumedCapacity: "TOTAL",
    TableName: "EMPLOYEE",
  };
  client.putItem(params, function (err, data) {
    if (err) console.log(err, err.stack); // an error occurred
    else console.log(data); // successful response
  });
}

for (const employee of employees) {
  const rest = DynamoDB.Converter.marshall(employee);
  var params = {
    Item: {
      PartitionKey: {
        S: `EMPLOYEE:${employee.id}`,
      },
      SortKey: {
        S: `${employee.Team}:${employee.role}`,
      },
      ...rest,
    },
    ReturnConsumedCapacity: "TOTAL",
    TableName: "EMPLOYEE",
  };
  client.putItem(params, function (err, data) {
    if (err) console.log(err, err.stack); // an error occurred
    else console.log(data); // successful response
  });
}
