module.exports = {
    "up": "create table auth_tokens\n" +
        "(\n" +
        "    uuid            VARCHAR(36)         NOT NULL UNIQUE,\n" +
        "    user_id        INT UNSIGNED        NOT NULL REFERENCES users (id),\n" +
        "    created_at     TIMESTAMP           NOT NULL,\n" +
        "    last_used_at   TIMESTAMP           \n" +
        ");\n",
    "down": "drop table auth_tokens"
}