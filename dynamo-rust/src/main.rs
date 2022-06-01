use aws_sdk_dynamodb::Error;

mod list_tables;

fn main() -> Result<(), Error> {
    list_tables::list()
}
