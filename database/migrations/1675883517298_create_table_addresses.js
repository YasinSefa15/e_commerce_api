module.exports = {
    "up": "create table addresses\n" +
        "(\n" +
        "    id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,\n" +
        "    first_name  VARCHAR(35) NOT NULL,\n" +
        "    last_name   VARCHAR(35) NOT NULL,\n" +
        "    title       VARCHAR(35) NOT NULL,\n" +
        "    city        VARCHAR(50) NOT NULL,\n" +
        "    state       VARCHAR(50) NOT NULL,\n" +
        "    description VARCHAR(50) NOT NULL,\n" +
        "    phone       VARCHAR(25) NOT NULL,\n" +
        "    user_id       INT UNSIGNED NOT NULL,\n" +
        "    FOREIGN KEY (user_id) REFERENCES users (id),\n" +
        "    created_at  TIMESTAMP   NOT NULL,\n" +
        "    updated_at  TIMESTAMP,\n" +
        "    deleted_at  TIMESTAMP\n" +
        ")",
    "down": "drop table addresses"
}