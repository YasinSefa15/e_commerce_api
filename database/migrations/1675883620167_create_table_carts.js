module.exports = {
    "up": "create table cart\n" +
        "(\n" +
        "    user_id    INT UNSIGNED NOT NULL REFERENCES users (id),\n" +
        "    product_id INT UNSIGNED NOT NULL REFERENCES products (id),\n" +
        "    quantity   INT UNSIGNED DEFAULT 1\n" +
        ");",
    "down": "drop table cart"
}