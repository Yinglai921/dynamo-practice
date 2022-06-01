use aws_sdk_dynamodb::{Client, Endpoint, Error};
use http::Uri;

/// Lists your DynamoDB tables in the default Region or us-east-1 if a default Region isn't set.
#[tokio::main]
pub async fn list() -> Result<(), Error> {
    // Select a profile by setting the `AWS_PROFILE` environment variable.
    let config = aws_config::from_env().load().await;
    let dynamodb_local_config = aws_sdk_dynamodb::config::Builder::from(&config)
        .endpoint_resolver(
            // 8000 is the default dynamodb port
            Endpoint::immutable(Uri::from_static("http://localhost:8000")),
        )
        .build();

    let client = Client::from_conf(dynamodb_local_config);

    let resp = client.list_tables().send().await?;

    println!("Tables:");

    let names = resp.table_names().unwrap_or_default();

    for name in names {
        println!("  {}", name);
    }

    println!();
    println!("Found {} tables", names.len());

    Ok(())
}
