module.exports = {
    "up": "CREATE TABLE addresses (address_id INT NOT NULL, UNIQUE KEY address_id (address_id), name TEXT )",
    "down": "DROP TABLE addresses"
}