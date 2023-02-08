module.exports = {
    "up": "create table images\n" +
        "(\n" +
        "    type       TINYINT UNSIGNED    NOT NULL,\n" +
        "    product_id INT UNSIGNED        NOT NULL REFERENCES products (id),\n" +
        "    file_path  VARCHAR(127) UNIQUE NOT NULL,\n" +
        "    order_of   TINYINT UNSIGNED    NOT NULL,\n" +
        "    created_at TIMESTAMP           NOT NULL,\n" +
        "    deleted_at TIMESTAMP\n" +
        ");\n",
    "down": "drop table images"
}