show databases;
use WFC_web;
create table Mentor (
    Mentor_id INT PRIMARY KEY auto_increment,
    Full_name VARCHAR(150),
    Current_organization VARCHAR(150) null,
    Designation VARCHAR(150) null,
    Experience VARCHAR(150) null,
    City VARCHAR(150) null,
	Description VARCHAR(250) null,
    Email VARCHAR(150) unique not null,
    User_name VARCHAR(150) unique null,
    Password_hash VARCHAR(255) null,
    Account_status enum('Inactive','Active','Blocked') default 'Inactive',
    Profile_status enum('Not Updated','Updated') default 'Not Updated',
    Create_at timestamp default current_timestamp,
    Update_at timestamp default current_timestamp
);
desc Mentor;
insert into Mentor(Full_name, Current_organization, Designation, Experience, City,Description,Email) value 
('Minette Ansell',
 'Women for Change Australia',
 'General Manager',
 'Leadership Development, Education & Social Impact, Non-profit/For-purpose Organisations',
 'Sydney, New South Wales, Australia',
 'General Manager with experience leading purpose-driven organisations',
 'Minette@womenforchange.org.au'),
('Preeti Inchody',
 'Ankura',
 'Managing Director',
 '6+ years was publicly stated in an older 2012 profile; current total experience should be verified',
 NULL,
 NULL,
 'preetiinchody@gmail.com'),
('Kim Hamrosi',
 'Corporate Mental Health Alliance Australia (CMHAA)',
 'Chief Executive Officer (CEO)',
 '20+ years',
 'Sydney, Australia',
 NULL,
 'Kimh@cmhaa.org.au'),
('Kristin Stubbins',
 'KSIB',
 'CEO and Founder',
 '30+ years',
 'Sydney, New South Wales, Australia',
 NULL,
 'kristin.stubbins@pwc.com');
select * from Mentor;
