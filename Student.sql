create database WFC_web;
show databases;
show tables;
use WFC_web;
create table Student(
    Student_id INT PRIMARY KEY auto_increment,
    PRN_no VARCHAR(50) unique,
    First_name VARCHAR(150),
    Middle_name VARCHAR(150),
    Last_name VARCHAR(150),
    Department VARCHAR(50),
    Passing_year YEAR,
    Contact_no varchar(15),
    Email VARCHAR(150) unique null,
    User_name VARCHAR(150) unique null,
    Password_hash VARCHAR(255) null,
    Registration_status enum( 'Not  Registered','Verification Pending','Registered') default 'Not  Registered',
    Account_status enum('Inactive','Pending','Active','Blocked') default 'Inactive',
    Create_at timestamp default current_timestamp,
    Update_at timestamp default current_timestamp
);
desc Student;
alter table Student drop column PRN_no,drop column Middle_name;
insert into Student (First_name, Last_name, Department, Passing_year,Contact_no) values 
('Prachi', 'Prajapati', 'Bachelor of Arts in Mass Communication', 2027, '7506380492'),
('Priyanka', 'Hindalkar', 'Bachelor of Arts in Mass Communication', 2027, '9324278436'),
('Vanshika', 'Gala', 'Bachelor of Arts in Mass Communication', 2027, '8655752897'),
('Ruby', 'Pandey','Bachelor of Arts in Mass Communication', 2027, '8591598484'),
('Akansha', 'Jha', 'Bachelor of Arts in Mass Communication', 2027, '7738516514'),

('Gauri', 'Agwan', 'Bachelor of Management Studies',2027, '7208796594'),
('Payal', 'Bhatt', 'Bachelor of Management Studies',2027, '7506376946'),
('Rahi', 'Karmakar', 'Bachelor of Management Studies',2027, '7045768198'),
('Khushi', 'Muduli', 'Bachelor of Management Studies',2027, '8828152032'),
('Sobiya', 'Shaikh', 'Bachelor of Management Studies',2027, '7738912683'),

('Purva', 'Ligam', 'Bachelor of Computer Applications', 2027, '9152789668'),
('Neha', 'Meta', 'Bachelor of Computer Applications', 2027, '8208777842'),
('Prachi', 'Pandey', 'Bachelor of Computer Applications', 2027, '8691943870'),
('Diya', 'Shetty', 'Bachelor of Computer Applications', 2027, '9769278779'),
('Pratha', 'Vaity', 'Bachelor of Computer Applications', 2027, '9833673608'),

('Trisha', 'Sharma', 'Bachelor of Fine Arts', 2027, '9004613836'),
('Mittal', 'Bhanushali', 'SBachelor of Fine Arts', 2027, '8291946741'),
('Taslim', 'Ahmed','Bachelor of Fine Arts', 2027, '9702259564'),
('Kulsum', 'Khan', 'Bachelor of Fine Arts', 2027, '9833524779'),
('Aayesha', 'Khan', 'Bachelor of Fine Arts', 2027, '9594456557'),

('Mayuri', 'More', 'Bachelor of Commerce', 2027, '7972473525'),
('Shravani', 'Patil', 'Bachelor of Commerce', 2027,  '7045337531'),
('Shreya', 'Prajapati', 'Bachelor of Commerce', 2027, '8591257665'),
('Chaitali', 'Lad', 'Bachelor of Commerce', 2027,  '9967136780'),
('Palak', 'Kumavat', 'Bachelor of Commerce', 2027,  '9867018319'),

('Pooja', 'Patel', 'Bachelor of Science – Resource Management', 2027, '9321433430'),
('Gulafsha', 'Khan', 'Bachelor of Science – Resource Management', 2027,  '7715894407'),
('Heena', 'Shaikh', 'Bachelor of Science – Resource Management', 2027,  '9930146376'),
('Aarti', 'Guatam', 'Bachelor of Science – Resource Management', 2027,  '9867048732'),
('Omaima', 'Khan', 'Bachelor of Science – Food Science and Nutrition', 2027, '8976066051'); 

select *from Student;

