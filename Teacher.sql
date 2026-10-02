create database WFC_web;
show databases;
use WFC_web;
create table Teacher (
    Teacher_id INT PRIMARY KEY auto_increment,
    Full_name VARCHAR(150),
    Designation VARCHAR(150) null,
    Experience VARCHAR(150) null,
    Description VARCHAR(250) null,
    Email VARCHAR(150) unique null,
    User_name VARCHAR(150) unique null,
    Password_hash VARCHAR(255) null,
    Account_status enum('Inactive','Active','Blocked') default 'Inactive',
    Profile_status enum('Not Updated','Updated') default 'Not Updated',
    Create_at timestamp default current_timestamp,
    Update_at timestamp default current_timestamp
);
desc Teacher;
insert into Teacher(Full_name,Designation) value 
('Dr. Nimisha Kambli', 'Head of Department - Multimedia and Mass Communication'),
('Dr. Veena Shete', 'Head of Department - Management Studies'),
('Ms. Gayatri Mahapatro', 'Head of Department - Computer Applications'),
('Ms. Sapna Dey', 'Head of Department - Accounting and Finance'),
('Mr. Raju Chauhan', 'Head of Department - Commerce');
select * from Teacher;

USE WFC_web;

INSERT INTO teacher
(
    Full_name,
    Designation,
    Experience,
    Description,
    Email,
    User_name,
    Password_hash,
    Account_status,
    Profile_status
)
VALUES
(
    'Test Teacher',
    'Faculty',
    '5 Years',
    'Test teacher account for WFC portal.',
    'teacher@wfc.com',
    'teacher@wfc.com',
    '$2b$10$xJiP7UnRqrR.9eOqF8gG7.H4ljmCpVlBTHWJRCmeX/5dJifJXa/ga',
    'Active',
    'Not Updated'
);
UPDATE teacher
SET Password_hash = '$2b$10$WG2G0wuWCCQFr/Kc5ExexeXIhscMMw8qhOG8um9JEZ/w3C57lqz.e',
    Account_status = 'Active'
WHERE Teacher_id = 6;
SELECT Teacher_id, Email, User_name, Password_hash, Account_status
FROM teacher
WHERE Teacher_id = 6;