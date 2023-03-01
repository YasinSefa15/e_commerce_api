module.exports = {
    "up": "create table categories\n" +
        "(\n" +
        "    id         INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,\n" +
        "    parent_id  INT UNSIGNED ,\n" +
        "    title      VARCHAR(25) NOT NULL,\n" +
        "    slug       VARCHAR(28) NOT NULL UNIQUE,\n" +
        "    created_at TIMESTAMP   NOT NULL,\n" +
        "    updated_at TIMESTAMP,\n" +
        "    deleted_at TIMESTAMP,\n" +
        "    FOREIGN KEY (parent_id) REFERENCES categories (id)\n" +
        ")",
    "down": "drop table categories"
}