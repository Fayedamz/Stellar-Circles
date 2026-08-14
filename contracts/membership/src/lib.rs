#![no_std]

use soroban_sdk::{contract, contractimpl, contracttype, symbol_short, Address, Env, Map, Symbol, Vec};

const MEMBERS: Symbol = symbol_short!("MEMBERS");
const MEMBER_COUNT: Symbol = symbol_short!("M_COUNT");
const CIRCLE_ADMIN: Symbol = symbol_short!("C_ADMIN");

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub enum MemberRole {
    Admin,
    Member,
}

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct Member {
    pub address: Address,
    pub role: MemberRole,
    pub joined_at: u64,
    pub active: bool,
}

#[contract]
pub struct MembershipContract;

#[contractimpl]
impl MembershipContract {
    /// Initialize membership contract with circle admin
    pub fn initialize(env: Env, admin: Address) {
        admin.require_auth();

        if env.storage().instance().has(&CIRCLE_ADMIN) {
            panic!("Contract already initialized");
        }

        env.storage().instance().set(&CIRCLE_ADMIN, &admin);
        env.storage().instance().set(&MEMBER_COUNT, &0u32);

        let members: Map<Address, Member> = Map::new(&env);
        env.storage().instance().set(&MEMBERS, &members);
    }

    /// Join circle (open membership)
    pub fn join_circle(env: Env, member: Address) -> Member {
        member.require_auth();

        let mut members: Map<Address, Member> = env
            .storage()
            .instance()
            .get(&MEMBERS)
            .expect("Members not initialized");

        if members.contains_key(member.clone()) {
            panic!("Already a member");
        }

        let joined_at = env.ledger().timestamp();

        let new_member = Member {
            address: member.clone(),
            role: MemberRole::Member,
            joined_at,
            active: true,
        };

        members.set(member.clone(), new_member.clone());
        env.storage().instance().set(&MEMBERS, &members);

        let count: u32 = env.storage().instance().get(&MEMBER_COUNT).unwrap_or(0);
        env.storage().instance().set(&MEMBER_COUNT, &(count + 1));

        new_member
    }

    /// Admin invites/adds a member
    pub fn invite_member(env: Env, admin: Address, new_member: Address) -> Member {
        admin.require_auth();

        let circle_admin: Address = env
            .storage()
            .instance()
            .get(&CIRCLE_ADMIN)
            .expect("Admin not set");

        if admin != circle_admin {
            panic!("Only admin can invite members");
        }

        let mut members: Map<Address, Member> = env
            .storage()
            .instance()
            .get(&MEMBERS)
            .expect("Members not initialized");

        if members.contains_key(new_member.clone()) {
            panic!("Already a member");
        }

        let joined_at = env.ledger().timestamp();

        let member = Member {
            address: new_member.clone(),
            role: MemberRole::Member,
            joined_at,
            active: true,
        };

        members.set(new_member.clone(), member.clone());
        env.storage().instance().set(&MEMBERS, &members);

        let count: u32 = env.storage().instance().get(&MEMBER_COUNT).unwrap_or(0);
        env.storage().instance().set(&MEMBER_COUNT, &(count + 1));

        member
    }

    /// Remove a member (admin only)
    pub fn remove_member(env: Env, admin: Address, member: Address) {
        admin.require_auth();

        let circle_admin: Address = env
            .storage()
            .instance()
            .get(&CIRCLE_ADMIN)
            .expect("Admin not set");

        if admin != circle_admin {
            panic!("Only admin can remove members");
        }

        let mut members: Map<Address, Member> = env
            .storage()
            .instance()
            .get(&MEMBERS)
            .expect("Members not initialized");

        if !members.contains_key(member.clone()) {
            panic!("Member not found");
        }

        members.remove(member);
        env.storage().instance().set(&MEMBERS, &members);

        let count: u32 = env.storage().instance().get(&MEMBER_COUNT).unwrap_or(1);
        env.storage().instance().set(&MEMBER_COUNT, &(count - 1));
    }

    /// Check if address is a member
    pub fn is_member(env: Env, address: Address) -> bool {
        let members: Map<Address, Member> = env
            .storage()
            .instance()
            .get(&MEMBERS)
            .expect("Members not initialized");

        members.contains_key(address)
    }

    /// Get a member's details
    pub fn get_member(env: Env, address: Address) -> Member {
        let members: Map<Address, Member> = env
            .storage()
            .instance()
            .get(&MEMBERS)
            .expect("Members not initialized");

        members.get(address).expect("Member not found")
    }

    /// Get all members
    pub fn get_members(env: Env) -> Vec<Member> {
        let members: Map<Address, Member> = env
            .storage()
            .instance()
            .get(&MEMBERS)
            .expect("Members not initialized");

        let mut result = Vec::new(&env);
        for (_, member) in members.iter() {
            result.push_back(member);
        }

        result
    }

    /// Get member count
    pub fn get_member_count(env: Env) -> u32 {
        env.storage().instance().get(&MEMBER_COUNT).unwrap_or(0)
    }

    /// Promote member to admin
    pub fn promote_to_admin(env: Env, admin: Address, member: Address) {
        admin.require_auth();

        let circle_admin: Address = env
            .storage()
            .instance()
            .get(&CIRCLE_ADMIN)
            .expect("Admin not set");

        if admin != circle_admin {
            panic!("Only admin can promote members");
        }

        let mut members: Map<Address, Member> = env
            .storage()
            .instance()
            .get(&MEMBERS)
            .expect("Members not initialized");

        let mut target_member = members.get(member.clone()).expect("Member not found");
        target_member.role = MemberRole::Admin;

        members.set(member, target_member);
        env.storage().instance().set(&MEMBERS, &members);
    }
}

#[cfg(test)]
mod test;
