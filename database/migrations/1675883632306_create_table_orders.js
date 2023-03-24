module.exports = {
    "up": "create table orders\n" +
        "        (\n" +
        "            id                  INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,\n" +
        "            user_id             INT UNSIGNED NOT NULL,\n" +
        "            address_id          INT UNSIGNED NOT NULL,\n" +
        "            ordered_items_count INT UNSIGNED NOT NULL,\n" +
        "            total_price         INT UNSIGNED NOT NULL,\n" +
        "            tracking_code       VARCHAR(20),\n" +
        "            shipment_status     INT UNSIGNED DEFAULT 0,\n" +
        "            cargo_company       VARCHAR(20),\n" +
        "            created_at          TIMESTAMP    NOT NULL,\n" +
        "            updated_at          TIMESTAMP,\n" +
        "            deleted_at          TIMESTAMP,\n" +
        "            FOREIGN KEY (user_id) REFERENCES users (id),\n" +
        "            FOREIGN KEY (address_id) REFERENCES addresses (id)\n" +
        "         );",
    "down": "drop table orders"
}