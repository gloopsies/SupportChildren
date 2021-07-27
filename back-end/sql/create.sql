DROP TABLE IF EXISTS donations;
DROP TABLE IF EXISTS fundraisers;
DROP INDEX IF EXISTS fundraiser_contract_address;
DROP FUNCTION IF EXISTS fundraiser_done;

create table fundraisers (
    id                bigserial primary key unique,
    contract_address  varchar(42)        not null,
    recipient_address varchar(42)        not null,
    name              varchar(64)        not null,
    image             varchar            not null,
    description       varchar(1000)      not null,
    end_date          date               not null,
    goal              varchar(20)        not null,
    category          int                not null,
    createdAt         DATE DEFAULT now() not null,
    done              bool DEFAULT false not null
);

create index fundraiser_contract_address on fundraisers (contract_address);

create table donations (
    id          bigserial primary key unique,
    createdAt   timestamp default now(),
    value       varchar                            not null,
    email       varchar,
    fundraiser  bigint references fundraisers (id) not null,
    transaction varchar(100)                       not null
);

CREATE FUNCTION fundraiser_done(contract_address varchar(42))
    RETURNS VOID
    LANGUAGE plpgsql
AS $$
BEGIN
    UPDATE fundraisers
    SET done = true
    WHERE fundraisers.contract_address = fundraiser_done.contract_address;
END;
$$;