#![cfg(test)]

use super::*;
use soroban_sdk::{testutils::Address as _, Address, Env};

#[test]
fn test_initialize() {
    let env = Env::default();
    let contract_id = env.register_contract(None, MembershipContract);
    let client = MembershipContractClient::new(&env, &contract_id);

    let admin = Address::generate(&env);

    client
        .mock_auths(&[soroban_sdk::testutils::MockAuth {
            address: &admin,
            invoke: &soroban_sdk::testutils::MockAuthInvoke {
                contract: &contract_id,
                fn_name: "initialize",
                args: (admin.clone(),).into_val(&env),
                sub_invokes: &[],
            },
        }])
        .initialize(&admin);

    let count = client.get_member_count();
    assert_eq!(count, 0);
}

#[test]
fn test_join_circle() {
    let env = Env::default();
    let contract_id = env.register_contract(None, MembershipContract);
    let client = MembershipContractClient::new(&env, &contract_id);

    let admin = Address::generate(&env);
    let member = Address::generate(&env);

    client
        .mock_auths(&[soroban_sdk::testutils::MockAuth {
            address: &admin,
            invoke: &soroban_sdk::testutils::MockAuthInvoke {
                contract: &contract_id,
                fn_name: "initialize",
                args: (admin.clone(),).into_val(&env),
                sub_invokes: &[],
            },
        }])
        .initialize(&admin);

    let joined = client
        .mock_auths(&[soroban_sdk::testutils::MockAuth {
            address: &member,
            invoke: &soroban_sdk::testutils::MockAuthInvoke {
                contract: &contract_id,
                fn_name: "join_circle",
                args: (member.clone(),).into_val(&env),
                sub_invokes: &[],
            },
        }])
        .join_circle(&member);

    assert_eq!(joined.address, member);
    assert_eq!(joined.role, MemberRole::Member);
    assert_eq!(joined.active, true);

    let is_member = client.is_member(&member);
    assert_eq!(is_member, true);

    let count = client.get_member_count();
    assert_eq!(count, 1);
}

#[test]
#[should_panic(expected = "Already a member")]
fn test_cannot_join_twice() {
    let env = Env::default();
    let contract_id = env.register_contract(None, MembershipContract);
    let client = MembershipContractClient::new(&env, &contract_id);

    let admin = Address::generate(&env);
    let member = Address::generate(&env);

    client
        .mock_auths(&[soroban_sdk::testutils::MockAuth {
            address: &admin,
            invoke: &soroban_sdk::testutils::MockAuthInvoke {
                contract: &contract_id,
                fn_name: "initialize",
                args: (admin.clone(),).into_val(&env),
                sub_invokes: &[],
            },
        }])
        .initialize(&admin);

    client
        .mock_auths(&[soroban_sdk::testutils::MockAuth {
            address: &member,
            invoke: &soroban_sdk::testutils::MockAuthInvoke {
                contract: &contract_id,
                fn_name: "join_circle",
                args: (member.clone(),).into_val(&env),
                sub_invokes: &[],
            },
        }])
        .join_circle(&member);

    // Try to join again - should panic
    client
        .mock_auths(&[soroban_sdk::testutils::MockAuth {
            address: &member,
            invoke: &soroban_sdk::testutils::MockAuthInvoke {
                contract: &contract_id,
                fn_name: "join_circle",
                args: (member.clone(),).into_val(&env),
                sub_invokes: &[],
            },
        }])
        .join_circle(&member);
}

#[test]
fn test_invite_member() {
    let env = Env::default();
    let contract_id = env.register_contract(None, MembershipContract);
    let client = MembershipContractClient::new(&env, &contract_id);

    let admin = Address::generate(&env);
    let new_member = Address::generate(&env);

    client
        .mock_auths(&[soroban_sdk::testutils::MockAuth {
            address: &admin,
            invoke: &soroban_sdk::testutils::MockAuthInvoke {
                contract: &contract_id,
                fn_name: "initialize",
                args: (admin.clone(),).into_val(&env),
                sub_invokes: &[],
            },
        }])
        .initialize(&admin);

    let invited = client
        .mock_auths(&[soroban_sdk::testutils::MockAuth {
            address: &admin,
            invoke: &soroban_sdk::testutils::MockAuthInvoke {
                contract: &contract_id,
                fn_name: "invite_member",
                args: (admin.clone(), new_member.clone()).into_val(&env),
                sub_invokes: &[],
            },
        }])
        .invite_member(&admin, &new_member);

    assert_eq!(invited.address, new_member);
    assert_eq!(client.is_member(&new_member), true);
}

#[test]
#[should_panic(expected = "Only admin can invite members")]
fn test_non_admin_cannot_invite() {
    let env = Env::default();
    let contract_id = env.register_contract(None, MembershipContract);
    let client = MembershipContractClient::new(&env, &contract_id);

    let admin = Address::generate(&env);
    let member = Address::generate(&env);
    let new_member = Address::generate(&env);

    client
        .mock_auths(&[soroban_sdk::testutils::MockAuth {
            address: &admin,
            invoke: &soroban_sdk::testutils::MockAuthInvoke {
                contract: &contract_id,
                fn_name: "initialize",
                args: (admin.clone(),).into_val(&env),
                sub_invokes: &[],
            },
        }])
        .initialize(&admin);

    // Should panic - member trying to invite
    client
        .mock_auths(&[soroban_sdk::testutils::MockAuth {
            address: &member,
            invoke: &soroban_sdk::testutils::MockAuthInvoke {
                contract: &contract_id,
                fn_name: "invite_member",
                args: (member.clone(), new_member.clone()).into_val(&env),
                sub_invokes: &[],
            },
        }])
        .invite_member(&member, &new_member);
}

#[test]
fn test_remove_member() {
    let env = Env::default();
    let contract_id = env.register_contract(None, MembershipContract);
    let client = MembershipContractClient::new(&env, &contract_id);

    let admin = Address::generate(&env);
    let member = Address::generate(&env);

    client
        .mock_auths(&[soroban_sdk::testutils::MockAuth {
            address: &admin,
            invoke: &soroban_sdk::testutils::MockAuthInvoke {
                contract: &contract_id,
                fn_name: "initialize",
                args: (admin.clone(),).into_val(&env),
                sub_invokes: &[],
            },
        }])
        .initialize(&admin);

    client
        .mock_auths(&[soroban_sdk::testutils::MockAuth {
            address: &member,
            invoke: &soroban_sdk::testutils::MockAuthInvoke {
                contract: &contract_id,
                fn_name: "join_circle",
                args: (member.clone(),).into_val(&env),
                sub_invokes: &[],
            },
        }])
        .join_circle(&member);

    assert_eq!(client.is_member(&member), true);

    client
        .mock_auths(&[soroban_sdk::testutils::MockAuth {
            address: &admin,
            invoke: &soroban_sdk::testutils::MockAuthInvoke {
                contract: &contract_id,
                fn_name: "remove_member",
                args: (admin.clone(), member.clone()).into_val(&env),
                sub_invokes: &[],
            },
        }])
        .remove_member(&admin, &member);

    assert_eq!(client.is_member(&member), false);
    assert_eq!(client.get_member_count(), 0);
}

#[test]
#[should_panic(expected = "Only admin can remove members")]
fn test_unauthorized_removal() {
    let env = Env::default();
    let contract_id = env.register_contract(None, MembershipContract);
    let client = MembershipContractClient::new(&env, &contract_id);

    let admin = Address::generate(&env);
    let member1 = Address::generate(&env);
    let member2 = Address::generate(&env);

    client
        .mock_auths(&[soroban_sdk::testutils::MockAuth {
            address: &admin,
            invoke: &soroban_sdk::testutils::MockAuthInvoke {
                contract: &contract_id,
                fn_name: "initialize",
                args: (admin.clone(),).into_val(&env),
                sub_invokes: &[],
            },
        }])
        .initialize(&admin);

    client
        .mock_auths(&[soroban_sdk::testutils::MockAuth {
            address: &member1,
            invoke: &soroban_sdk::testutils::MockAuthInvoke {
                contract: &contract_id,
                fn_name: "join_circle",
                args: (member1.clone(),).into_val(&env),
                sub_invokes: &[],
            },
        }])
        .join_circle(&member1);

    client
        .mock_auths(&[soroban_sdk::testutils::MockAuth {
            address: &member2,
            invoke: &soroban_sdk::testutils::MockAuthInvoke {
                contract: &contract_id,
                fn_name: "join_circle",
                args: (member2.clone(),).into_val(&env),
                sub_invokes: &[],
            },
        }])
        .join_circle(&member2);

    // Should panic - member1 trying to remove member2
    client
        .mock_auths(&[soroban_sdk::testutils::MockAuth {
            address: &member1,
            invoke: &soroban_sdk::testutils::MockAuthInvoke {
                contract: &contract_id,
                fn_name: "remove_member",
                args: (member1.clone(), member2.clone()).into_val(&env),
                sub_invokes: &[],
            },
        }])
        .remove_member(&member1, &member2);
}

#[test]
fn test_get_members() {
    let env = Env::default();
    let contract_id = env.register_contract(None, MembershipContract);
    let client = MembershipContractClient::new(&env, &contract_id);

    let admin = Address::generate(&env);
    let member1 = Address::generate(&env);
    let member2 = Address::generate(&env);

    client
        .mock_auths(&[soroban_sdk::testutils::MockAuth {
            address: &admin,
            invoke: &soroban_sdk::testutils::MockAuthInvoke {
                contract: &contract_id,
                fn_name: "initialize",
                args: (admin.clone(),).into_val(&env),
                sub_invokes: &[],
            },
        }])
        .initialize(&admin);

    client
        .mock_auths(&[soroban_sdk::testutils::MockAuth {
            address: &member1,
            invoke: &soroban_sdk::testutils::MockAuthInvoke {
                contract: &contract_id,
                fn_name: "join_circle",
                args: (member1.clone(),).into_val(&env),
                sub_invokes: &[],
            },
        }])
        .join_circle(&member1);

    client
        .mock_auths(&[soroban_sdk::testutils::MockAuth {
            address: &member2,
            invoke: &soroban_sdk::testutils::MockAuthInvoke {
                contract: &contract_id,
                fn_name: "join_circle",
                args: (member2.clone(),).into_val(&env),
                sub_invokes: &[],
            },
        }])
        .join_circle(&member2);

    let members = client.get_members();
    assert_eq!(members.len(), 2);
}

#[test]
fn test_promote_to_admin() {
    let env = Env::default();
    let contract_id = env.register_contract(None, MembershipContract);
    let client = MembershipContractClient::new(&env, &contract_id);

    let admin = Address::generate(&env);
    let member = Address::generate(&env);

    client
        .mock_auths(&[soroban_sdk::testutils::MockAuth {
            address: &admin,
            invoke: &soroban_sdk::testutils::MockAuthInvoke {
                contract: &contract_id,
                fn_name: "initialize",
                args: (admin.clone(),).into_val(&env),
                sub_invokes: &[],
            },
        }])
        .initialize(&admin);

    client
        .mock_auths(&[soroban_sdk::testutils::MockAuth {
            address: &member,
            invoke: &soroban_sdk::testutils::MockAuthInvoke {
                contract: &contract_id,
                fn_name: "join_circle",
                args: (member.clone(),).into_val(&env),
                sub_invokes: &[],
            },
        }])
        .join_circle(&member);

    client
        .mock_auths(&[soroban_sdk::testutils::MockAuth {
            address: &admin,
            invoke: &soroban_sdk::testutils::MockAuthInvoke {
                contract: &contract_id,
                fn_name: "promote_to_admin",
                args: (admin.clone(), member.clone()).into_val(&env),
                sub_invokes: &[],
            },
        }])
        .promote_to_admin(&admin, &member);

    let promoted_member = client.get_member(&member);
    assert_eq!(promoted_member.role, MemberRole::Admin);
}
