create extension if not exists "uuid-ossp";

create table products (
	id uuid not null default uuid_generate_v4() primary key,
	title text not null,
	description text,
	price int
);

create table stocks (
	count int
);

alter table stocks add column product_id uuid references products(id);

insert into products (title, description, price) values ('Product 1', 'Product description', 2);
insert into products (title, description, price) values ('Product 12', 'Product description', 4);
insert into products (title, description, price) values ('Product 2', 'Product description', 3);
insert into products (title, description, price) values ('Product 50', 'Product description', 5);
insert into products (title, description, price) values ('Product 5', 'Product description', 10);
insert into products (title, description, price) values ('Product 21', 'Product description', 12);

insert into stocks (product_id, count) values ('1c8994ce-89ae-40a9-be4a-c99fe1181774', 200);
insert into stocks (product_id, count) values ('a6188d56-588e-4830-8413-1c805d1625e7', 0);
insert into stocks (product_id, count) values ('84504251-9ad7-4515-8817-d9e2df993a3b', 20);
insert into stocks (product_id, count) values ('e2093f19-8fb2-416d-9127-b2a44b8ceaa8', 10);
insert into stocks (product_id, count) values ('e9a76678-d30c-4778-81ed-867c749978ea', 20000);
insert into stocks (product_id, count) values ('ce04a918-32d8-45c4-8398-f07988de94d6', 412);
