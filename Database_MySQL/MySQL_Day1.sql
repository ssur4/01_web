CREATE DATABASE myboard DEFAULT CHARACTER SET utf8;

use myboard;

CREATE table post(
	id int(11) not null auto_increment,
    title varchar(100) not null,
    content text,
    created datetime not null,
    profile_id int(11) default null,
    primary key(id)
    );
    
    create table profile(
    id int(11) not null auto_increment,
    writer varchar(20) not null,
    email varchar(100) default null,
    primary key(id)
    );
    
    desc post;
    
    insert into post(title, content, created, profile_id)
    values('삶은', '계란이다', now(), 1);
    
    insert into post(title, content, created, profile_id)
    values('위대하다', '밥을 많이 먹어서', now(), 1);
    
    insert into post(title, content, created, profile_id)
    values('나의 성격유형', 'infj', now(), 2);
    
    insert into post(title, content, created, profile_id)
    values('가을바람', '가을은 쓸쓸하다', now(), 3);
    
    insert into post(title, content, created, profile_id)
    values('언젠가부터', '사람들과 이해계가 힘들어지는 것 같다', now(), 1);
    
    select id, title, content from post;
    
    select * from post where id > 2;
    
    select * from post where writer = 'lee';
    
    select * from post order by id asc;
    
    select * from post limit 2;
    
    update post set id = 5 where id = 6;
    
    delete from post where id = 5;
    
    rename table post to post_bk;
    
    select post.id, title, content, created, writer, email
    from post
    left join profile
    on post.profile_id = profile.id;
    
    update profile set email = 'lee@daum.net' where id =1;