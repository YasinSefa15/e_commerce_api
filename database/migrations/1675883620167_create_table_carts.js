module.exports = {
    "up": "create table carts\n" +
        "(\n" +
        "    user_id    INT UNSIGNED NOT NULL ,\n" +
        "    product_id INT UNSIGNED NOT NULL ,\n" +
        "    quantity   INT UNSIGNED DEFAULT 1,\n" +
        " FOREIGN KEY (product_id) REFERENCES products (id),\n" +
        " FOREIGN KEY (user_id) REFERENCES users (id)" +
        ");",
    "down": "drop table carts"
}