In a table that has only a partition key, no two items can have the same partition key value.

If it's a PK + SK, PK can be non unique. 


https://aws.amazon.com/blogs/database/choosing-the-right-dynamodb-partition-key/

https://aws.amazon.com/blogs/database/using-sort-keys-to-organize-data-in-amazon-dynamodb/

Global secondary index: query the data when it's cross by the partition key, for example, partition key is team, but we want to group by team players.