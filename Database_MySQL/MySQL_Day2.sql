SELECT * FROM post; 

SELECT * FROM profile;

SELECT post.id, title, writer
FROM post
INNER JOIN profile
ON post.profile_id = profile.id;


