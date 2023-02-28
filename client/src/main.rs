use ethcontract;
use std::time::Duration;
use web3::api::Web3;
use web3::types::*;
use dotenv::dotenv;
use std::env;

ethcontract::contract!("Rzhuken.json");

fn main() {
    dotenv().ok();
    let web3 = web3::transports::Http::new(&format!("https://goerli.infura.io/v3/{}", env::var("INFURA").unwrap())).unwrap();
    let addr: Address = env::var("ADDRESS").unwrap().parse().unwrap();
    
}