In a table that has only a partition key, no two items can have the same partition key value.

If it's a PK + SK, PK can be non unique. 


https://aws.amazon.com/blogs/database/choosing-the-right-dynamodb-partition-key/

https://aws.amazon.com/blogs/database/using-sort-keys-to-organize-data-in-amazon-dynamodb/

https://dynobase.dev/dynamodb-sort-key/


Common sort key: 
- version control: v0_xxx, v1_xxx
- timestamp
- `[country]#[region]#[state]#[county]#[city]#[neighborhood]`


Global secondary index: query the data when it's cross by the partition key, for example, partition key is team, but we want to group by team players.

Design pattern/best practice: 
https://www.slideshare.net/AmazonWebServices/design-patterns-using-amazon-dynamodb

### Rust docs: 

https://docs.rs/aws-sdk-dynamodb/0.12.0/aws_sdk_dynamodb/

examples:
https://github.com/awsdocs/aws-doc-sdk-examples/blob/main/rust_dev_preview/dynamodb/src/bin/add-item.rs