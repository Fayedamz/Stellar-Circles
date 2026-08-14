#![no_std]

use soroban_sdk::{contract, contractimpl, contracttype, symbol_short, Address, Env, String, Symbol};

// Storage keys
const CIRCLE_ID: Symbol = symbol_short!("C_ID");
const CIRCLE_DATA: Symbol = symbol_short!("C_DATA");
const ADMIN: Symbol = symbol_short!("ADMIN");

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct Circle {
    pub circle_id: String,
    pub name: String,
    pub description: String,
    pub creator: Address,
    pub admin: Address,
    pub created_at: u64,
    pub active: bool,
}

#[contract]
pub struct CircleContract;

#[contractimpl]
impl CircleContract {
    /// Initialize a new circle
    /// 
    /// # Arguments
    /// * `env` - Contract environment
    /// * `circle_id` - Unique identifier for the circle
    /// * `name` - Circle name
    /// * `description` - Circle description
    /// * `creator` - Address of the circle creator
    /// 
    /// # Returns
    /// * `Circle` - The created circle data
    pub fn create_circle(
        env: Env,
        circle_id: String,
        name: String,
        description: String,
        creator: Address,
    ) -> Circle {
        // Verify caller is the creator
        creator.require_auth();

        // Check if circle already exists
        if env.storage().instance().has(&CIRCLE_ID) {
            panic!("Circle already initialized");
        }

        let created_at = env.ledger().timestamp();

        let circle = Circle {
            circle_id: circle_id.clone(),
            name,
            description,
            creator: creator.clone(),
            admin: creator.clone(),
            created_at,
            active: true,
        };

        // Store circle ID and data
        env.storage().instance().set(&CIRCLE_ID, &circle_id);
        env.storage().instance().set(&CIRCLE_DATA, &circle);
        env.storage().instance().set(&ADMIN, &creator);

        circle
    }

    /// Get circle data
    pub fn get_circle(env: Env) -> Circle {
        env.storage()
            .instance()
            .get(&CIRCLE_DATA)
            .expect("Circle not found")
    }

    /// Update circle information (admin only)
    pub fn update_circle(
        env: Env,
        name: String,
        description: String,
        caller: Address,
    ) -> Circle {
        caller.require_auth();

        let admin: Address = env.storage().instance().get(&ADMIN).expect("Admin not set");
        if caller != admin {
            panic!("Only admin can update circle");
        }

        let mut circle: Circle = env.storage()
            .instance()
            .get(&CIRCLE_DATA)
            .expect("Circle not found");

        circle.name = name;
        circle.description = description;

        env.storage().instance().set(&CIRCLE_DATA, &circle);

        circle
    }

    /// Set circle active status (admin only)
    pub fn set_active(env: Env, active: bool, caller: Address) {
        caller.require_auth();

        let admin: Address = env.storage().instance().get(&ADMIN).expect("Admin not set");
        if caller != admin {
            panic!("Only admin can change active status");
        }

        let mut circle: Circle = env.storage()
            .instance()
            .get(&CIRCLE_DATA)
            .expect("Circle not found");

        circle.active = active;

        env.storage().instance().set(&CIRCLE_DATA, &circle);
    }

    /// Transfer admin role (current admin only)
    pub fn set_circle_admin(env: Env, new_admin: Address, caller: Address) {
        caller.require_auth();

        let admin: Address = env.storage().instance().get(&ADMIN).expect("Admin not set");
        if caller != admin {
            panic!("Only current admin can transfer admin role");
        }

        let mut circle: Circle = env.storage()
            .instance()
            .get(&CIRCLE_DATA)
            .expect("Circle not found");

        circle.admin = new_admin.clone();

        env.storage().instance().set(&CIRCLE_DATA, &circle);
        env.storage().instance().set(&ADMIN, &new_admin);
    }

    /// Get admin address
    pub fn get_admin(env: Env) -> Address {
        env.storage().instance().get(&ADMIN).expect("Admin not set")
    }
}

#[cfg(test)]
mod test;
