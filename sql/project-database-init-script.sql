drop table if exists votes;
drop table if exists comments;
drop table if exists articles;
drop table if exists users;

create table users(
id integer not null primary key,
fname varchar(32),
lname varchar(32),
bio varchar(500),
username varchar(32),
password varchar(150),
dob date,
avatar varchar(150),
authToken varchar(128),
isadmin integer default 0
);

create table articles(
id integer not null primary key,
title varchar(32),
image varchar(150),
ingredients varchar(2000),
method varchar(5000),
creator_user_id integer,
timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
foreign key (creator_user_id) references users (id)
);

create table comments(
id integer not null,
article_id integer not null,
timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
parent_comment_id integer default 0,
content varchar(500),
user_id integer not null,
upvote integer default 0,
downvote integer default 0,
primary key (id),
foreign key (user_id) references users (id),
foreign key (article_id) references articles (id) ON DELETE CASCADE
);

create table votes (
    id integer not null primary key,
    commentId integer not null,
    userId integer not null,
	isvoted integer default 0,
    foreign key (commentId) references comments (id) ON DELETE CASCADE,
    foreign key (userId) references users (id)
);

insert into users (id, fname, lname, bio, username, password, dob, avatar, authToken,isAdmin) values (1,'Miles','Hartman','User number one of our site','user1','$2b$10$zneAJxwGvEq29hRA1DVw9eec.KXexUvutvVZsoA0UA7AzZ1HASb.e','1954-12-03',1, "12jahdkhjwqdas",1);
insert into users (id, fname, lname, bio, username, password, dob, avatar, authToken) values (2,'Bryson','Jupp','User number two of our site','user2','$2b$10$zneAJxwGvEq29hRA1DVw9eec.KXexUvutvVZsoA0UA7AzZ1HASb.e','1954-12-03',1, "12jahdkhjwqdas");
INSERT INTO users ("id", "fname", "lname", "bio", "username", "password", "dob", "avatar", "authToken", "isadmin") VALUES ('3', 'Xizhe', 'Zhang', 'Happy new year！！！', 'paichichi', '$2b$10$l/9nii6XkvWeg2Zhtn0fROQMmLb1TRNzBgZ26To21doXWeEzfKR7u', '2022-02-01', '2', '4a3c1612-3037-42fe-878e-b61e0433cba2', '0');
INSERT INTO users ("id", "fname", "lname", "bio", "username", "password", "dob", "avatar", "authToken", "isadmin") VALUES ('4', 'Annika', 'Ju', 'i love u', 'badqueen', '$2b$10$yxISugqUVBryEQuqGRLnnu7ZwExSy9P7f12hOQGCfOXQPNa9H3QWq', '2022-02-01', '5', '', '0');
INSERT INTO users ("id", "fname", "lname", "bio", "username", "password", "dob", "avatar", "authToken", "isadmin") VALUES ('5', 'Zexi', 'Ran', 'asdasd', 'goodking', '$2b$10$fSmSUwAfpTTFnp/811OR..FGLMaqzJdktXHOV1p7SxB04B1sb.7lu', '2022-02-04', '6', '', '0');
INSERT INTO users ("id", "fname", "lname", "bio", "username", "password", "dob", "avatar", "authToken", "isadmin") VALUES ('6', 'Ruby', 'Jimenez', 'tagged as 2013, tagged as regal, tagged as witchy, tagged as Biblical, random', 'ruby123', '$2b$10$DqjLYlKwrjH5a7nt0qRo/uAIVuwWIgljE/ReOmPgxFfNiLh1dMh8y', '2043-06-14', '5', '', '0');
INSERT INTO users ("id", "fname", "lname", "bio", "username", "password", "dob", "avatar", "authToken", "isadmin") VALUES ('7', 'Hannah', 'Jimenez', ' tagged as 2013, tagged as regal, tagged as witchy, tagged as Biblical, random', 'hannah123', '$2b$10$OxkOMu5q45FvgOVpOD2hKuePgjISTgtj6PgNGqdFr7YmE/69pfSEq', '1935-02-04', '4', '', '0');
INSERT INTO users ("id", "fname", "lname", "bio", "username", "password", "dob", "avatar", "authToken", "isadmin") VALUES ('8', 'Sarah', 'Jimenez', 'tagged as 2013, tagged as regal, tagged as witchy, tagged as Biblical, random', 'sarah123', '$2b$10$ybobvKUZrpKSRLKqdjYk3OL8zSHlR5cyKKMq0ChMKvQu7XXxNBb/G', '2022-02-05', '5', '', '0');
INSERT INTO users ("id", "fname", "lname", "bio", "username", "password", "dob", "avatar", "authToken", "isadmin") VALUES ('9', 'Roma', 'Young', 'tagged as wise, begins with R, ends in A', 'roma123', '$2b$10$TRj/tCYBTgXykskXYtjOtupZ9qvQ.fZx0bAZuAJdqwOmCnbvRaaBW', '1951-10-01', '3', '', '0');
INSERT INTO users ("id", "fname", "lname", "bio", "username", "password", "dob", "avatar", "authToken", "isadmin") VALUES ('10', 'Raja', 'Berry', 'do with his background as well as searching by a name''s initial and ending.', 'raja123', '$2b$10$Qmszb.mS0q1PZYfhqREbu.U3zW0uGkXk8GqNENGGy2qrBkPbcuKdK', '1868-12-28', '1', '', '0');

INSERT INTO articles ("id", "title", "image", "ingredients", "method", "creator_user_id", "timestamp") VALUES ('1', 'Lamb Tagine', 'lambtagine.jpeg', 
'<ul>
    <li>1 kg oyster-cut lamb shoulder</li>
    <li>2 tablespoons flour</li>
    <li>1 red onion</li>
    <li> 1 onion</li>
    <li>handful dried apricots</li>
    <li>Small pinch of saffron</li>
    <li>3 cups low salt chicken broth</li>
    <li>4 lb boneless lamb roast, cut into 1" pieces</li>
</ul>', 
'<ol>
    <li>You can either prepare this recipe the night before or morning of slow cooking it. Pat lamb dry and toss with flour and season well with salt and pepper. Set aside. Slice onion into 1cm wedges and trim carrots. Place lamb, onion, and carrots into slow cooker, cover and set aside in the fridge.</li>
    <li>Combine all tagine sauce ingredients, except stock, in a bowl. Cover and set aside in the fridge.</li>
    <li>When ready to cook, if you’re using the oven preheat it to 200°. Add stock to tagine sauce mixture and stir to combine. Pour tagine sauce over lamb (note: the sauce will not completely cover lamb) and cook in slow cooker on low for 8-10 hours, or in preheated oven for about 2 hours until lamb is tender and easily falls off the bone when ready. Set lamb aside on a chopping board or plate to rest.</li>
    <li>Heat a drizzle of oil in a medium pot on medium heat. Add second measure of tagine spice mix and cook for about 30 seconds, until fragrant. Add stock and bring to the boil on high heat. Once boiling turn off heat, add couscous, dates and salt, stir, cover and leave for 5 minutes, then fluff up grains with a fork.</li>
    <li>Coarsely grate courgette and fold through cooked couscous. Pull or slice lamb into bite sized pieces and add back to the sauce. Season to taste.To serve, divide couscous and tagine between bowls and top with yoghurt, almonds and mint.</li>
</ol>',
'1',
'2022-01-19 10:03:56');

INSERT INTO articles ("id", "title", "image", "ingredients", "method", "creator_user_id", "timestamp") VALUES ('2', 'Trout Fish Finger Baps', 'trout.jpeg', 
'<ul>
    <li>100 g plain flour</li>
    <li>150 g very fine breadcrumbs</li>
    <li>500 g trout fillet , skinned & pinboned, from sustainable sources</li>
    <li>olive oil</li>
    <li>2 little gem lettuces</li>
    <li>4 soft white rolls</li>
    <li>cayenne pepper , for dusting (optional)</li>
</ul>',
'<ol>
    <li>Sprinkle the flour on one plate, and the breadcrumbs on another. Beat the eggs with a pinch of black pepper in a wide, shallow bowl.</li>
    <li>Slice the fish fillets into 2cm strips, then dip into the flour, shaking off the excess. Next, dunk in the egg, then roll in the breadcrumbs until well coated and place onto a tray.</li>
    <li>Pick the parsley leaves, then finely chop with the dill, capers and cornichons, and transfer to a bowl.</li>
    <li>Stir through the yoghurt, mayonnaise and Dijon mustard, finely grate in the lemon zest and squeeze in the juice, then mix well and season to perfection.</li>
    <li>Preheat the oven to 160°C/325°F/gas 3 and finely slice the lettuce.</li>
    <li>Place a large frying pan on a medium heat with 1 tablespoon of olive oil. Add the fish fingers and pan fry for 3 minutes on each side until crispy and cooked through.</li>
    <li>Meanwhile, warm the rolls in the oven for 2 minutes, then cut in half.</li>
    <li>To serve, load up the rolls with a spoonful of tartare sauce and a handful of shredded lettuce, then place three fish fingers on top. Spread a little tartare sauce on the bottom of the lid, dust with cayenne pepper, if using, then pop the lid on top and tuck in.</li>
</ol>',
'2',
'2022-01-20 10:03:56');

INSERT INTO articles ("id", "title", "image", "ingredients", "method", "creator_user_id", "timestamp") VALUES ('3', 'Aubergine Parmesan Milanese', 'aubergine.jpeg', 
'<ul>
    <li>1 aubergine , (250g)</li>
    <li>2 large free-range eggs</li>
    <li>100 g rosemary focaccia</li>
    <li>olive oil</li>
    <li>20 g Parmesan cheese</li>
    <li>150 g dried spaghetti</li>
    <li>2 cloves of garlic</li>
</ul>',
'<ol>
    <li>Preheat the oven to 180°C/350°F/gas 4. Cut the skin off either side of the aubergine, then cut yourself four 1cm-thick slices lengthways (saving any offcuts for another day). Sprinkle the slices with sea salt, and spend a couple of minutes gently bashing and tenderizing them with a meat mallet or rolling pin. Take a piece of kitchen paper and dab off the liquid from both sides of the aubergine. Beat the eggs in a shallow bowl. Blitz the focaccia into fine crumbs in a food processor and pour on to a plate. Dip the aubergine slices in the egg, let any excess drip off, then dip each side in the crumbs. Fry in a large non-stick frying pan on a medium-high heat with 1 tablespoon of olive oil for 6 minutes, or until golden, turning halfway. Transfer to an oiled baking tray, finely grate over most of the Parmesan and pop into the oven.</li>
    <li>Cook the spaghetti in a pan of boiling salted water according to the packet instructions. Wipe out the frying pan, returning it to a medium-high heat with ½ a tablespoon of oil. Peel, finely slice and add the garlic. Fry until lightly golden, pour in the tomatoes, then swirl a splash of water around the tomato tin and into the pan. Pick the baby basil leaves and put aside, tear the rest into the sauce, season to perfection, then leave to simmer on a low heat. Once cooked, use tongs to drag the spaghetti straight into the sauce, letting a little starchy cooking water go with it. Toss together, then divide between plates. Sit the aubergine on top, grate over the remaining Parmesan and finish with the baby basil leaves.</li>
</ol>',
'2',
'2022-01-23 10:03:56');

INSERT INTO articles ("id", "title", "image", "ingredients", "method", "creator_user_id", "timestamp") VALUES ('4', 'Pan Fried Pork Chops', 'pork_chops.jpeg', 
'<ul>
    <li>2 x 380 g higher-welfare double pork chops , (approximately 2.5cm thick), rind on</li>
    <li>2 sprigs of fresh rosemary</li>
    <li>2 sprigs of fresh rosemary</li>
    <li>2 cloves of garlic</li>
    <li>red wine vinegar</li>
    <li>olive oil</li>
    <li>2 ripe pears</li>
</ul>', 
'<ol>
    <li>Place the pork chops, skin-side down, on a chopping board. Carefully run a sharp knife along the edge of the chops, removing the skin and leaving a thin layer of pork fat on the chop. (You could ask your butcher to do this for you.) Set aside.</li>
    <li>To make the marinade, pick and finely chop the rosemary leaves and most of the sage leaves, then lightly crush the unpeeled garlic cloves with the palm of your hand. Tip into a bowl and mix with 1 tablespoon of red wine vinegar and 3 tablespoons of olive oil. Rub the marinade into the pork chops, then cover and leave to marinate in the fridge for at least 30 minutes, or preferably overnight.</li>
    <li>When you are ready to cook your pork chops, slice the pork skin into 1cm-thick lardons and place in a large frying pan on a medium heat. Fry the lardons, stirring occasionally, for 10 minutes until golden and crisp. Remove from the pan and drain on kitchen paper.</li>
    <li>With a sharp knife, lightly score the pork fat on the chops and place one on top of the other. Place the pan back on a medium-high heat, then use tongs to hold the chops fat-side down in the pan and sear for 3 to 4 minutes, until the fat has started to render.</li>
    <li>Lay the chops down flat in the pan, throwing in the garlic too, and cook for 7 minutes, turning every minute or so and basting with the lovely pan juices, until browned and cooked through.</li>
    <li>With 2 minutes of the pork cooking time left to go, quarter and core the pears, then nestle them into the pan alongside the chops and poke in the remaining sage leaves and cook for 1 minute.</li>
    <li>Remove the pork to a board to rest, then reduce the temperature to medium-low and leave the pears to caramelise for 5 minutes, stirring regularly.</li>
    <li>Slice the pork off the bone and carve into slices and squeeze the garlic from their skins. Serve with the caramelised pear, crispy sage, a little crispy crackling, your favourite style potatoes (I like hasselback) and some seasonal greens.</li>
</ol>',
'1',
'2022-01-26 10:03:56');


INSERT INTO comments ("id", "article_id", "timestamp", "parent_comment_id", "content", "user_id") VALUES ('1', '1', '2022-01-31 10:11:01', '0', 'very nice', '2');
INSERT INTO comments ("id", "article_id", "timestamp", "parent_comment_id", "content", "user_id") VALUES ('2', '1', '2022-02-01 10:11:01', '1', 'thanks', '1');
INSERT INTO comments ("id", "article_id", "timestamp", "parent_comment_id", "content", "user_id") VALUES ('3', '1', '2022-02-02 10:11:01', '2', 'best article I have seen!', '2');




