-- Add the trigger to enforce the unique_account_limit constraint separately
CREATE TRIGGER unique_account_limit_trigger
BEFORE INSERT OR UPDATE
ON profile
EXECUTE FUNCTION check_unique_account_limit();