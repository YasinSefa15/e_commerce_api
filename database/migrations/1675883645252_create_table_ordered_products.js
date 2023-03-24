module.exports = {
    "up": "create table ordered_products\n" +
        "        (\n" +
        "            id              INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,\n" +
        "            product_id      INT UNSIGNED NOT NULL,\n" +
        "            order_id        INT UNSIGNED NOT NULL,\n" +
        "            quantity        INT UNSIGNED NOT NULL,\n" +
        "            created_at      TIMESTAMP    NOT NULL,\n" +
        "            updated_at      TIMESTAMP,\n" +
        "            deleted_at      TIMESTAMP,\n" +
        "            FOREIGN KEY (order_id) REFERENCES orders (id),\n" +
        "            FOREIGN KEY (product_id) REFERENCES products (id)\n" +
        "        );",
    "down": "drop table ordered_products"
}