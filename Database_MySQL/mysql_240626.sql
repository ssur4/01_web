create table UserSalt(
userid varchar(20) primary key,
salt varchar(500) not null
);

SELECT * FROM myboard.usersalt;
