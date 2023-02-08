module.exports = {
    "up": "create table ordered_products\n" +
        "(\n" +
        "    id              INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,\n" +
        "    product_id      INT UNSIGNED NOT NULL REFERENCES products (id),\n" +
        "    quantity        INT UNSIGNED NOT NULL,\n" +
        "    shipment_status INT UNSIGNED NOT NULL,\n" +
        "    cargo_company   VARCHAR(20)  NOT NULL,\n" +
        "    created_at      TIMESTAMP    NOT NULL,\n" +
        "    updated_at      TIMESTAMP,\n" +
        "    deleted_at      TIMESTAMP\n" +
        ");",
    "down": "drop table ordered_products"
}