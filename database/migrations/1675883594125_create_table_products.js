module.exports = {
    "up": "create table products\n" +
        "(\n" +
        "    id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,\n" +
        "    category_id INT UNSIGNED NOT NULL,\n" +
        "    title       VARCHAR(63)  NOT NULL,\n" +
        "    slug        VARCHAR(127)  NOT NULL UNIQUE,\n" +
        "    description VARCHAR(255) NOT NULL,\n" +
        "    price       INT UNSIGNED NOT NULL,\n" +
        "    quantity    INT UNSIGNED NOT NULL default 0,\n" +
        "    created_at  TIMESTAMP    NOT NULL,\n" +
        "    updated_at  TIMESTAMP,\n" +
        "    deleted_at  TIMESTAMP,\n" +
        "    FOREIGN KEY (category_id) REFERENCES categories (id)\n" +
        ")",
    "down": "drop table products"
}