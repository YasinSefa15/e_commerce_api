module.exports = {
    "up": "create table users\n" +
        "(\n" +
        "    id                 INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,\n" +
        "    first_name         VARCHAR(35) NOT NULL,\n" +
        "    last_name          VARCHAR(35) NOT NULL,\n" +
        "    e_mail             VARCHAR(50) NOT NULL,\n" +
        "    e_mail_verified_at TIMESTAMP,\n" +
        "    timezone           VARCHAR(31) default 'Europe/Istanbul',\n" +
        "    phone              VARCHAR(25) NOT NULL,\n" +
        "    phone_verified_at  TIMESTAMP,\n" +
        "    created_at         TIMESTAMP   NOT NULL,\n" +
        "    updated_at         TIMESTAMP,\n" +
        "    deleted_at         TIMESTAMP\n" +
        ")",
    "down": "drop table users"
}