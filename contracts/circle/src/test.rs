#![cfg(test)]

use super::*;
use soroban_sdk::{testutils::Address as _, Address, Env, String};

#[test]
fn test_create_circle() {
    let env = Env::default();
    let contract_id = env.register_contract(None, CircleContract);
    let client = CircleContractClient::new(&env, &contract_id);

    let creator = Address::generate(&env);

    let circle_id = String::from_str(&env, "web3-study-group");
    let name = String::from_str(&env, "Web3 Study Group");
    let description = String::from_str(&env, "Learning Stellar and Soroban together");

    let circle = client
        .mock_auths(&[soroban_sdk::testutils::MockAuth {
            address: &creator,
            invoke: &soroban_sdk::testutils::MockAuthInvoke {
                contract: &contract_id,
                fn_name: "create_circle",
                args: (
                    circle_id.clone(),
                    name.clone(),
                    description.clone(),
                    creator.clone(),
                )
                    .into_val(&env),
                sub_invokes: &[],
            },
        }])
        .create_circle(&circle_id, &name, &description, &creator);

    assert_eq!(circle.circle_id, circle_id);
    assert_eq!(circle.name, name);
    assert_eq!(circle.creator, creator);
    assert_eq!(circle.admin, creator);
    assert_eq!(circle.active, true);
}

#[test]
fn test_get_circle() {
    let env = Env::default();
    let contract_id = env.register_contract(None, CircleContract);
    let client = CircleContractClient::new(&env, &contract_id);

    let creator = Address::generate(&env);

    let circle_id = String::from_str(&env, "circle-001");
    let name = String::from_str(&env, "Test Circle");
    let description = String::from_str(&env, "A test circle");

    client
        .mock_auths(&[soroban_sdk::testutils::MockAuth {
            address: &creator,
            invoke: &soroban_sdk::testutils::MockAuthInvoke {
                contract: &contract_id,
                fn_name: "create_circle",
                args: (
                    circle_id.clone(),
                    name.clone(),
                    description.clone(),
                    creator.clone(),
                )
                    .into_val(&env),
                sub_invokes: &[],
            },
        }])
        .create_circle(&circle_id, &name, &description, &creator);

    let retrieved_circle = client.get_circle();

    assert_eq!(retrieved_circle.circle_id, circle_id);
    assert_eq!(retrieved_circle.name, name);
}

#[test]
#[should_panic(expected = "Circle already initialized")]
fn test_cannot_create_duplicate_circle() {
    let env = Env::default();
    let contract_id = env.register_contract(None, CircleContract);
    let client = CircleContractClient::new(&env, &contract_id);

    let creator = Address::generate(&env);

    let circle_id = String::from_str(&env, "circle-001");
    let name = String::from_str(&env, "Test Circle");
    let description = String::from_str(&env, "A test circle");

    client
        .mock_auths(&[soroban_sdk::testutils::MockAuth {
            address: &creator,
            invoke: &soroban_sdk::testutils::MockAuthInvoke {
                contract: &contract_id,
                fn_name: "create_circle",
                args: (
                    circle_id.clone(),
                    name.clone(),
                    description.clone(),
                    creator.clone(),
                )
                    .into_val(&env),
                sub_invokes: &[],
            },
        }])
        .create_circle(&circle_id, &name, &description, &creator);

    // Try to create again - should panic
    client
        .mock_auths(&[soroban_sdk::testutils::MockAuth {
            address: &creator,
            invoke: &soroban_sdk::testutils::MockAuthInvoke {
                contract: &contract_id,
                fn_name: "create_circle",
                args: (
                    circle_id.clone(),
                    name.clone(),
                    description.clone(),
                    creator.clone(),
                )
                    .into_val(&env),
                sub_invokes: &[],
            },
        }])
        .create_circle(&circle_id, &name, &description, &creator);
}

#[test]
fn test_update_circle() {
    let env = Env::default();
    let contract_id = env.register_contract(None, CircleContract);
    let client = CircleContractClient::new(&env, &contract_id);

    let creator = Address::generate(&env);

    let circle_id = String::from_str(&env, "circle-001");
    let name = String::from_str(&env, "Original Name");
    let description = String::from_str(&env, "Original description");

    client
        .mock_auths(&[soroban_sdk::testutils::MockAuth {
            address: &creator,
            invoke: &soroban_sdk::testutils::MockAuthInvoke {
                contract: &contract_id,
                fn_name: "create_circle",
                args: (
                    circle_id.clone(),
                    name.clone(),
                    description.clone(),
                    creator.clone(),
                )
                    .into_val(&env),
                sub_invokes: &[],
            },
        }])
        .create_circle(&circle_id, &name, &description, &creator);

    let new_name = String::from_str(&env, "Updated Name");
    let new_description = String::from_str(&env, "Updated description");

    let updated = client
        .mock_auths(&[soroban_sdk::testutils::MockAuth {
            address: &creator,
            invoke: &soroban_sdk::testutils::MockAuthInvoke {
                contract: &contract_id,
                fn_name: "update_circle",
                args: (new_name.clone(), new_description.clone(), creator.clone()).into_val(&env),
                sub_invokes: &[],
            },
        }])
        .update_circle(&new_name, &new_description, &creator);

    assert_eq!(updated.name, new_name);
    assert_eq!(updated.description, new_description);
}

#[test]
#[should_panic(expected = "Only admin can update circle")]
fn test_unauthorized_update() {
    let env = Env::default();
    let contract_id = env.register_contract(None, CircleContract);
    let client = CircleContractClient::new(&env, &contract_id);

    let creator = Address::generate(&env);
    let unauthorized = Address::generate(&env);

    let circle_id = String::from_str(&env, "circle-001");
    let name = String::from_str(&env, "Original Name");
    let description = String::from_str(&env, "Original description");

    client
        .mock_auths(&[soroban_sdk::testutils::MockAuth {
            address: &creator,
            invoke: &soroban_sdk::testutils::MockAuthInvoke {
                contract: &contract_id,
                fn_name: "create_circle",
                args: (
                    circle_id.clone(),
                    name.clone(),
                    description.clone(),
                    creator.clone(),
                )
                    .into_val(&env),
                sub_invokes: &[],
            },
        }])
        .create_circle(&circle_id, &name, &description, &creator);

    let new_name = String::from_str(&env, "Hacked Name");
    let new_description = String::from_str(&env, "Hacked description");

    // Should panic
    client
        .mock_auths(&[soroban_sdk::testutils::MockAuth {
            address: &unauthorized,
            invoke: &soroban_sdk::testutils::MockAuthInvoke {
                contract: &contract_id,
                fn_name: "update_circle",
                args: (new_name.clone(), new_description.clone(), unauthorized.clone())
                    .into_val(&env),
                sub_invokes: &[],
            },
        }])
        .update_circle(&new_name, &new_description, &unauthorized);
}

#[test]
fn test_transfer_admin() {
    let env = Env::default();
    let contract_id = env.register_contract(None, CircleContract);
    let client = CircleContractClient::new(&env, &contract_id);

    let creator = Address::generate(&env);
    let new_admin = Address::generate(&env);

    let circle_id = String::from_str(&env, "circle-001");
    let name = String::from_str(&env, "Test Circle");
    let description = String::from_str(&env, "A test circle");

    client
        .mock_auths(&[soroban_sdk::testutils::MockAuth {
            address: &creator,
            invoke: &soroban_sdk::testutils::MockAuthInvoke {
                contract: &contract_id,
                fn_name: "create_circle",
                args: (
                    circle_id.clone(),
                    name.clone(),
                    description.clone(),
                    creator.clone(),
                )
                    .into_val(&env),
                sub_invokes: &[],
            },
        }])
        .create_circle(&circle_id, &name, &description, &creator);

    client
        .mock_auths(&[soroban_sdk::testutils::MockAuth {
            address: &creator,
            invoke: &soroban_sdk::testutils::MockAuthInvoke {
                contract: &contract_id,
                fn_name: "set_circle_admin",
                args: (new_admin.clone(), creator.clone()).into_val(&env),
                sub_invokes: &[],
            },
        }])
        .set_circle_admin(&new_admin, &creator);

    let current_admin = client.get_admin();
    assert_eq!(current_admin, new_admin);
}

#[test]
fn test_set_active_status() {
    let env = Env::default();
    let contract_id = env.register_contract(None, CircleContract);
    let client = CircleContractClient::new(&env, &contract_id);

    let creator = Address::generate(&env);

    let circle_id = String::from_str(&env, "circle-001");
    let name = String::from_str(&env, "Test Circle");
    let description = String::from_str(&env, "A test circle");

    client
        .mock_auths(&[soroban_sdk::testutils::MockAuth {
            address: &creator,
            invoke: &soroban_sdk::testutils::MockAuthInvoke {
                contract: &contract_id,
                fn_name: "create_circle",
                args: (
                    circle_id.clone(),
                    name.clone(),
                    description.clone(),
                    creator.clone(),
                )
                    .into_val(&env),
                sub_invokes: &[],
            },
        }])
        .create_circle(&circle_id, &name, &description, &creator);

    client
        .mock_auths(&[soroban_sdk::testutils::MockAuth {
            address: &creator,
            invoke: &soroban_sdk::testutils::MockAuthInvoke {
                contract: &contract_id,
                fn_name: "set_active",
                args: (false, creator.clone()).into_val(&env),
                sub_invokes: &[],
            },
        }])
        .set_active(&false, &creator);

    let circle = client.get_circle();
    assert_eq!(circle.active, false);
}
