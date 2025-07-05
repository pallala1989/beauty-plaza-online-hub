
-- Update the user_role enum to use 'user' instead of 'customer'
ALTER TYPE user_role RENAME VALUE 'customer' TO 'user';

-- Update any existing profiles that have 'customer' role to 'user'
UPDATE profiles SET role = 'user' WHERE role = 'customer';
