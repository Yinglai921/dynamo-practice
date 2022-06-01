use aws_sdk_dynamodb::model::{
    AttributeDefinition, AttributeValue, GlobalSecondaryIndex, KeySchemaElement, KeyType,
    Projection, ProjectionType, ProvisionedThroughput, ScalarAttributeType,
};
use aws_sdk_dynamodb::{Client, Error};
use std::process;

pub async fn list(client: &Client) -> Result<(), Error> {
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

// create a table with only primary key
pub async fn create(client: &Client, table: &str, key: &str) -> Result<(), Error> {
    let a_name: String = key.into();
    let table_name: String = table.into();

    let attribute_definitions = AttributeDefinition::builder()
        .attribute_name(&a_name)
        .attribute_type(ScalarAttributeType::S)
        .build();

    let key_schema = KeySchemaElement::builder()
        .attribute_name(&a_name)
        .key_type(KeyType::Hash)
        .build();

    let provisioned_throughput = ProvisionedThroughput::builder()
        .read_capacity_units(10)
        .write_capacity_units(5)
        .build();

    match client
        .create_table()
        .table_name(table_name)
        .key_schema(key_schema)
        .attribute_definitions(attribute_definitions)
        .provisioned_throughput(provisioned_throughput)
        .send()
        .await
    {
        Ok(_) => println!("Added table {} with key {}", table, key),
        Err(e) => {
            println!("Got an error creating table:");
            println!("{}", e);
            process::exit(1);
        }
    };
    Ok(())
}

pub async fn create_sample_table(client: &Client) -> Result<(), Error> {
    let table_name = String::from("VIAPLAY");
    let pk = String::from("primary_key");
    let sk = String::from("sort_key");
    let gsi = String::from("team");
    let gsi_name = String::from("team_index");

    let pk_schema = KeySchemaElement::builder()
        .attribute_name(&pk)
        .key_type(KeyType::Hash)
        .build();

    let sk_schema = KeySchemaElement::builder()
        .attribute_name(&sk)
        .key_type(KeyType::Range)
        .build();

    let gsi_schema = KeySchemaElement::builder()
        .attribute_name(&gsi)
        .key_type(KeyType::Hash)
        .build();

    let pk_ad = AttributeDefinition::builder()
        .attribute_name(&pk)
        .attribute_type(ScalarAttributeType::S)
        .build();

    let sk_ad = AttributeDefinition::builder()
        .attribute_name(&sk)
        .attribute_type(ScalarAttributeType::S)
        .build();

    let gsi_ad = AttributeDefinition::builder()
        .attribute_name(&gsi)
        .attribute_type(ScalarAttributeType::S)
        .build();

    let provisioned_throughput = ProvisionedThroughput::builder()
        .read_capacity_units(5)
        .write_capacity_units(5)
        .build();

    let gsi_provisioned_throughput = ProvisionedThroughput::builder()
        .read_capacity_units(1)
        .write_capacity_units(1)
        .build();

    let gsi_projection = Projection::builder()
        .projection_type(ProjectionType::All)
        .build();

    let gsi = GlobalSecondaryIndex::builder()
        .index_name(&gsi_name)
        .key_schema(gsi_schema)
        .provisioned_throughput(gsi_provisioned_throughput)
        .projection(gsi_projection)
        .build();
    let mut vec = Vec::new();
    vec.push(gsi);
    let gsi_vec: Option<Vec<GlobalSecondaryIndex>> = Some(vec);

    match client
        .create_table()
        .table_name(&table_name)
        .key_schema(pk_schema)
        .key_schema(sk_schema)
        .attribute_definitions(pk_ad)
        .attribute_definitions(sk_ad)
        .attribute_definitions(gsi_ad)
        .provisioned_throughput(provisioned_throughput)
        .set_global_secondary_indexes(gsi_vec)
        .send()
        .await
    {
        Ok(_) => println!("Added table {}", table_name),
        Err(e) => {
            println!("Got an error creating table:");
            println!("{}", e);
            process::exit(1);
        }
    };
    Ok(())
}

pub async fn add_employee(
    client: &Client,
    name: &str,
    location: &str,
    team: &str,
) -> Result<(), Error> {
    let name_av = AttributeValue::S(name.into());
    let location_av = AttributeValue::S(location.into());
    let team_av = AttributeValue::S(team.into());
    let table_name = String::from("VIAPLAY");

    let request = client
        .put_item()
        .table_name(table_name)
        .item("primary_key", name_av)
        .item("sort_key", location_av)
        .item("team", team_av);

    println!("Executing request to add item...");

    request.send().await?;

    println!("Added employee {} in {}, {}", name, location, team);

    Ok(())
}
