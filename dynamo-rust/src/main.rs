use aws_sdk_dynamodb::{Client, Endpoint, Error, PKG_VERSION};
use http::Uri;

// mod create_table;
mod table;

#[tokio::main]
async fn main() -> Result<(), Error> {
    println!("DynamoDB client version: {}", PKG_VERSION);
    // Select a profile by setting the `AWS_PROFILE` environment variable, will choose [default]
    let config = aws_config::from_env().load().await;
    let dynamodb_local_config = aws_sdk_dynamodb::config::Builder::from(&config)
        .endpoint_resolver(Endpoint::immutable(Uri::from_static(
            "http://localhost:8000",
        )))
        .build();

    let client = Client::from_conf(dynamodb_local_config);
    // table::list(&client).await
    // table::create_sample_table(&client).await

    let (first, second) = tokio::join!(
        table::add_employee(&client, "EMPLOYEE:liza", "pm", "kraken",),
        table::add_employee(&client, "EMPLOYEE:viktor", "pm", "message",)
    );

    Ok(())
}
