show databases;
use WFC_web;
create table Alumni (
    Alumni_id INT PRIMARY KEY auto_increment,
    PRN_no VARCHAR(50) unique,
    First_name VARCHAR(150),
    Middle_name VARCHAR(150),
    Last_name VARCHAR(150),
    Department VARCHAR(150),
    Passing_year YEAR,
    Description VARCHAR(250),
    Email VARCHAR(150) unique null,
    User_name VARCHAR(150) unique null,
    Password_hash VARCHAR(255) null,
    Registration_status enum( 'Not  Registered','Verification Pending','Registered') default 'Not  Registered',
    Account_status enum('Inactive','Pending','Active','Blocked') default 'Inactive',
    Profile_status enum('Not Updated','Updated') default 'Not Updated',
    Create_at timestamp default current_timestamp,
    Update_at timestamp default current_timestamp
);
desc Alumni;
insert into Alumni (First_name, Middle_name, Last_name, Department, Passing_year) VALUES
('Adiba', NULL, 'Havaldar', 'Bachelor of Arts in Multimedia and Mass Communication.', 2025),
('Shabnam', 'Yunus', 'Sayyed', 'Bachelor of Arts in Multimedia and Mass Communication.', 2025),
('Sakshi', NULL, 'Mishra', 'Bachelor of Arts in Multimedia and Mass Communication.', 2025),
('Rajvi', NULL, 'Jogi', 'Bachelor of Arts in Multimedia and Mass Communication.', 2025),
('Shreya', NULL, 'Nakarja', 'Bachelor of Arts in Multimedia and Mass Communication.', 2025),

('Anushka', NULL, 'Panigrahi', 'Bachelor of Management Studies', 2025),
('Komal', NULL, 'Pathak', 'Bachelor of Management Studies', 2025),
('Ravika', NULL, 'Goswami', 'Bachelor of Management Studies', 2025),
('Deesha', 'Sanjay', 'Kadu', 'Bachelor of Management Studies', 2025),
('Snehal', 'Jivraj', 'Padaya', 'Bachelor of Management Studies', 2025),

('Harshita', NULL, 'Patel', 'Bachelor of Computer Applications', 2025),
('Harshali', 'Ramesh', 'Vala', 'Bachelor of Computer Applications', 2025),
('Gadhavi', 'Punshree', 'Karshan', 'Bachelor of Computer Applications', 2025),
('Sapna', NULL, 'Gupta', 'Bachelor of Computer Applications', 2025),
('Krutika', 'Dinesh', 'Gupta', 'Bachelor of Computer Applications', 2025),

('Ankita', 'Vinod', 'Shukla', 'Bachelor of Fine Arts', 2025),
('Snehi', 'Praful', 'Vora', 'Bachelor of Fine Arts', 2025),
('Kashish', 'Santosh', 'Gaud', 'Bachelor of Fine Arts', 2025),
('Monika', 'Ashok', 'Chowdhury', 'Bachelor of Fine Arts', 2025),
('Avishra Farheen', 'Avishra Farheen Mohammad Shahid', 'Khan', 'Bachelor of Fine Arts', 2025),

('Sneha', 'Srinivas', 'Ambati', 'Bachelor of Commerce',2025),
('Kiran', 'Sarvan', 'Jatholiya', 'Bachelor of Commerce',2025),
('Foram', NULL, 'Mehta', 'Bachelor of Commerce',2025),
('Saloni', 'Chandrabhаn', 'Singh', 'Bachelor of Commerce',2025),
('Pooja', 'Shivanand', 'Talwar', 'Bachelor of Commerce',2025);
select* from Alumni;
