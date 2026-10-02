const express = require('express');
const session = require('express-session');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;
const DATABASE_PATH = process.env.DATABASE_PATH || path.join(__dirname, 'data', 'wfc.db');

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret: process.env.SESSION_SECRET || 'wfc-secret',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 1000 * 60 * 60 * 12 }
}));

const db = new sqlite3.Database(DATABASE_PATH);

function ensureDataDir() {
  const dir = path.dirname(DATABASE_PATH);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function runSql(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) return reject(err);
      resolve({ id: this.lastID, changes: this.changes });
    });
  });
}

function getSql(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) return reject(err);
      resolve(row);
    });
  });
}

function allSql(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) return reject(err);
      resolve(rows);
    });
  });
}

function formatRoleLabel(role) {
  if (!role) return 'User';
  return role.charAt(0).toUpperCase() + role.slice(1);
}

function defaultPasswordFor(user) {
  const name = (user.full_name || user.name || 'wfc').split(' ')[0];
  const first = name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
  if (user.role === 'student' || user.role === 'alumni') {
    const phone = (user.phone || '00000').replace(/\D/g, '');
    return `${first.toLowerCase()}@${phone.slice(-5) || '12345'}`;
  }
  if (user.role === 'mentor' || user.role === 'teacher') {
    return `${first}@123`;
  }
  return 'Admin@123';
}

function sendEmailLog(to, subject, body) {
  console.log('\n==== Email Notification ====');
  console.log(`To: ${to}`);
  console.log(`Subject: ${subject}`);
  console.log(`Body: ${body}`);
  console.log('============================\n');
}

function seedUsers() {
  const defaultUsers = [
    { role: 'admin', full_name: 'WFC Admin', email: 'admin@wfc.com', username: 'admin@wfc.com', phone: '9999999999', department: 'Administration', password: 'Admin@123', status: 'Active' },
    { role: 'teacher', full_name: 'Test Teacher', email: 'teacher@wfc.com', username: 'teacher@wfc.com', phone: '9000000000', department: 'Faculty', password: 'Teacher@123', status: 'Active' },
    { role: 'student', full_name: 'Prachi Prajapati', email: 'prachiprajapati0512@gmail.com', username: 'prachiprajapati0512@gmail.com', phone: '7506380492', department: 'Bachelor of Arts in Mass Communication', password: 'WFC@123', status: 'Active' },
    { role: 'mentor', full_name: 'Minette Ansell', email: 'minette@womenforchange.org.au', username: 'minette@womenforchange.org.au', phone: '0000000000', department: 'Women for Change Australia', password: 'WFC@123', status: 'Active' },
    { role: 'alumni', full_name: 'Adiba Havaldar', email: 'adiba.havaldar@wfc.com', username: 'adiba.havaldar@wfc.com', phone: '9876543210', department: 'Bachelor of Arts in Multimedia and Mass Communication.', password: 'WFC@123', status: 'Active' }
  ];

  const studentSeed = [
    ['Prachi Prajapati', 'Bachelor of Arts in Mass Communication', '7506380492', 'prachiprajapati0512@gmail.com'],
    ['Priyanka Hindalkar', 'Bachelor of Arts in Mass Communication', '9324278436', 'dobi.kun1525@gmail.com'],
    ['Vanshika Gala', 'Bachelor of Arts in Mass Communication', '8655752897', 'galavanshika229@gmail.com'],
    ['Ruby Pandey', 'Bachelor of Arts in Mass Communication', '8591598484', 'rucc.p2007@gmail.com'],
    ['Akansha Jha', 'Bachelor of Arts in Mass Communication', '7738516514', 'akankshajha01357@gmail.com'],
    ['Gauri Agwan', 'Bachelor of Management Studies', '7208796594', 'gauriagwan24@gmail.com'],
    ['Payal Bhatt', 'Bachelor of Management Studies', '7506376946', 'bhattpayal1606@gmail.com'],
    ['Rahi Karmakar', 'Bachelor of Management Studies', '7045768198', 'rahikarmakar1@gmail.com'],
    ['Khushi Muduli', 'Bachelor of Management Studies', '8828152032', 'khushimuduli22@gmail.com'],
    ['Sobiya Shaikh', 'Bachelor of Management Studies', '7738912683', 'sobiya1411@gmail.com'],
    ['Purva Ligam', 'Bachelor of Computer Applications', '9152789668', 'purvaligam3@gmail.com'],
    ['Neha Meta', 'Bachelor of Computer Applications', '8208777842', 'nehameta635@gmail.com'],
    ['Prachi Pandey', 'Bachelor of Computer Applications', '8691943870', 'prachi.pandey07192006@gmail.com'],
    ['Diya Shetty', 'Bachelor of Computer Applications', '9769278779', 'diyashetty080907@gmail.com'],
    ['Pratha Vaity', 'Bachelor of Computer Applications', '9833673608', 'prathavaity@gmail.com'],
    ['Trisha Sharma', 'Bachelor of Fine Arts', '9004613836', 'ssstrisha09@gmail.com'],
    ['Mittal Bhanushali', 'Bachelor of Fine Arts', '8291946741', 'bhanushalimittal222@gmail.com'],
    ['Taslim Ramzan Ahmed', 'Bachelor of Fine Arts', '9702259564', 'taslimkhan0603@gmail.com'],
    ['Kulsum Khan', 'Bachelor of Fine Arts', '9833524779', 'khankulsumandhassan@gmail.com'],
    ['Aayesha Khan', 'Bachelor of Fine Arts', '9594456557', 'aayeshakhan3116@gmail.com'],
    ['Mayuri More', 'Bachelor of Commerce', '7972473525', 'mayuri90045@gmail.com'],
    ['Shravani Patil', 'Bachelor of Commerce', '7045337531', 'shravanipatilaug1708@gmail.com'],
    ['Shreya Prajapati', 'Bachelor of Commerce', '8591257665', 'shreyaprajapati406@gmail.com'],
    ['Chaitali Lad', 'Bachelor of Commerce', '9967136780', 'chaitalilad1008@gmail.com'],
    ['Palak Kumavat', 'Bachelor of Commerce', '9867018319', 'kumawatpalak377@gmail.com'],
    ['Pooja Patel', 'Bachelor of Science – Resource Management', '9321433430', 'gamip522@gmail.com'],
    ['Gulafsha Khan', 'Bachelor of Science – Resource Management', '7715894407', 'gulafshakhan3421@gmail.com'],
    ['Heena Shaikh', 'Bachelor of Science – Resource Management', '9930146376', 'hs336552@gmail.com'],
    ['Aarti Gautam', 'Bachelor of Science – Resource Management', '9867048732', 'gautamaarti4545@gmail.com'],
    ['Omaima Khan', 'Bachelor of Science – Food Science and Nutrition', '8976066051', 'khanomaima2006@gmail.com']
  ];

  const teacherSeed = [
    ['Dr. Nimisha Kambli', 'Head of Department - Multimedia and Mass Communication', 'nimisha.kambli@wfc.com'],
    ['Dr. Veena Shete', 'Head of Department - Management Studies', 'veena.shete@wfc.com'],
    ['Ms. Gayatri Mahapatro', 'Head of Department - Computer Applications', 'gayatri.mahapatro@wfc.com'],
    ['Ms. Sapna Dey', 'Head of Department - Accounting and Finance', 'sapna.dey@wfc.com'],
    ['Mr. Raju Chauhan', 'Head of Department - Commerce', 'raju.chauhan@wfc.com']
  ];

  const mentorSeed = [
    ['Minette Ansell', 'Women for Change Australia', 'minette@womenforchange.org.au'],
    ['Preeti Inchody', 'Ankura', 'preetiinchody@gmail.com'],
    ['Kim Hamrosi', 'Corporate Mental Health Alliance Australia (CMHAA)', 'kimh@cmhaa.org.au'],
    ['Kristin Stubbins', 'KSIB', 'kristin.stubbins@pwc.com']
  ];

  const alumniSeed = [
    ['Adiba Havaldar', 'Bachelor of Arts in Multimedia and Mass Communication.', 'adiba.havaldar@wfc.com'],
    ['Shabnam Yunus Sayyed', 'Bachelor of Arts in Multimedia and Mass Communication.', 'shabnam.sayyed@wfc.com'],
    ['Sakshi Mishra', 'Bachelor of Arts in Multimedia and Mass Communication.', 'sakshi.mishra@wfc.com'],
    ['Rajvi Jogi', 'Bachelor of Arts in Multimedia and Mass Communication.', 'rajvi.jogi@wfc.com'],
    ['Shreya Nakarja', 'Bachelor of Arts in Multimedia and Mass Communication.', 'shreya.nakarja@wfc.com'],
    ['Anushka Panigrahi', 'Bachelor of Management Studies', 'anushka.panigrahi@wfc.com'],
    ['Komal Pathak', 'Bachelor of Management Studies', 'komal.pathak@wfc.com'],
    ['Ravika Goswami', 'Bachelor of Management Studies', 'ravika.goswami@wfc.com'],
    ['Deesha Sanjay Kadu', 'Bachelor of Management Studies', 'deesha.kadu@wfc.com'],
    ['Snehal Jivraj Padaya', 'Bachelor of Management Studies', 'snehal.padaya@wfc.com'],
    ['Harshita Patel', 'Bachelor of Computer Applications', 'harshita.patel@wfc.com'],
    ['Harshali Ramesh Vala', 'Bachelor of Computer Applications', 'harshali.vala@wfc.com'],
    ['Gadhavi Punshree Karshan', 'Bachelor of Computer Applications', 'gadhavi.karshan@wfc.com'],
    ['Sapna Gupta', 'Bachelor of Computer Applications', 'sapna.gupta@wfc.com'],
    ['Krutika Dinesh Gupta', 'Bachelor of Computer Applications', 'krutika.gupta@wfc.com'],
    ['Ankita Vinod Shukla', 'Bachelor of Fine Arts', 'ankita.shukla@wfc.com'],
    ['Snehi Praful Vora', 'Bachelor of Fine Arts', 'snehi.vora@wfc.com'],
    ['Kashish Santosh Gaud', 'Bachelor of Fine Arts', 'kashish.gaud@wfc.com'],
    ['Monika Ashok Chowdhury', 'Bachelor of Fine Arts', 'monika.chowdhury@wfc.com'],
    ['Avishra Farheen Mohammad Shahid Khan', 'Bachelor of Fine Arts', 'avishra.khan@wfc.com'],
    ['Sneha Srinivas Ambati', 'Bachelor of Commerce', 'sneha.ambati@wfc.com'],
    ['Kiran Sarvan Jatholiya', 'Bachelor of Commerce', 'kiran.jatholiya@wfc.com'],
    ['Foram Mehta', 'Bachelor of Commerce', 'foram.mehta@wfc.com'],
    ['Saloni Chandrabhan Singh', 'Bachelor of Commerce', 'saloni.singh@wfc.com'],
    ['Pooja Shivanand Talwar', 'Bachelor of Commerce', 'pooja.talwar@wfc.com']
  ];

  defaultUsers.forEach(async (u) => {
    const exists = await getSql('SELECT id FROM users WHERE email = ?', [u.email]);
    if (!exists) {
      const hash = await bcrypt.hash(u.password, 10);
      await runSql(
        `INSERT INTO users (role, full_name, email, username, phone, department, password_hash, status, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)`,
        [u.role, u.full_name, u.email, u.username, u.phone, u.department, hash, u.status || 'Active']
      );
    }
  });

  studentSeed.forEach(async ([name, dept, phone, email]) => {
    const exists = await getSql('SELECT id FROM users WHERE email = ?', [email]);
    if (!exists) {
      const hash = await bcrypt.hash('WFC@123', 10);
      await runSql(
        `INSERT INTO users (role, full_name, email, username, phone, department, password_hash, status, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)`,
        ['student', name, email, email, phone, dept, hash, 'Active']
      );
    }
  });

  teacherSeed.forEach(async ([name, dept, email]) => {
    const exists = await getSql('SELECT id FROM users WHERE email = ?', [email]);
    if (!exists) {
      const hash = await bcrypt.hash('WFC@123', 10);
      await runSql(
        `INSERT INTO users (role, full_name, email, username, phone, department, password_hash, status, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)`,
        ['teacher', name, email, email, '0000000000', dept, hash, 'Active']
      );
    }
  });

  mentorSeed.forEach(async ([name, dept, email]) => {
    const exists = await getSql('SELECT id FROM users WHERE email = ?', [email]);
    if (!exists) {
      const hash = await bcrypt.hash('WFC@123', 10);
      await runSql(
        `INSERT INTO users (role, full_name, email, username, phone, department, password_hash, status, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)`,
        ['mentor', name, email, email, '0000000000', dept, hash, 'Active']
      );
    }
  });

  alumniSeed.forEach(async ([name, dept, email]) => {
    const exists = await getSql('SELECT id FROM users WHERE email = ?', [email]);
    if (!exists) {
      const hash = await bcrypt.hash('WFC@123', 10);
      await runSql(
        `INSERT INTO users (role, full_name, email, username, phone, department, password_hash, status, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)`,
        ['alumni', name, email, email, '0000000000', dept, hash, 'Active']
      );
    }
  });
}

async function initializeDatabase() {
  ensureDataDir();

  await runSql(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      role TEXT NOT NULL,
      full_name TEXT NOT NULL,
      email TEXT UNIQUE,
      username TEXT UNIQUE,
      phone TEXT,
      department TEXT,
      password_hash TEXT NOT NULL,
      status TEXT DEFAULT 'Active',
      bio TEXT,
      experience TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await runSql(`
    CREATE TABLE IF NOT EXISTS messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      sender_id INTEGER NOT NULL,
      receiver_id INTEGER NOT NULL,
      message TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await runSql(`
    CREATE TABLE IF NOT EXISTS achievements (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      title TEXT NOT NULL,
      description TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await runSql(`
    CREATE TABLE IF NOT EXISTS tasks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT,
      user_id INTEGER NOT NULL,
      assigned_by INTEGER,
      due_date TEXT,
      status TEXT DEFAULT 'Open',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await runSql(`
    CREATE TABLE IF NOT EXISTS announcements (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      created_by INTEGER NOT NULL,
      title TEXT NOT NULL,
      content TEXT NOT NULL,
      visible_to TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await runSql(`
    CREATE TABLE IF NOT EXISTS activity_posts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      created_by INTEGER NOT NULL,
      title TEXT NOT NULL,
      content TEXT,
      image_url TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await runSql(`
    CREATE TABLE IF NOT EXISTS documents (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      title TEXT NOT NULL,
      description TEXT,
      status TEXT DEFAULT 'Pending',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  const adminCount = await getSql('SELECT COUNT(*) as cnt FROM users WHERE role = ?', ['admin']);
  if (!adminCount || adminCount.cnt === 0) {
    seedUsers();
  }
}

function requireAuth(req, res, next) {
  if (!req.session.user) {
    return res.redirect('/login');
  }
  next();
}

function requireRole(roles) {
  return (req, res, next) => {
    if (!req.session.user) return res.redirect('/login');
    if (!roles.includes(req.session.user.role)) {
      return res.status(403).send('Access denied');
    }
    next();
  };
}

app.get('/login', (req, res) => {
  res.render('login', { user: req.session.user });
});

app.post('/login', async (req, res) => {
  const emailOrUsername = (req.body.email || '').trim();
  const password = req.body.password || '';

  if (!emailOrUsername || !password) {
    return res.render('login', { error: 'Email and password are required.', user: null });
  }

  const user = await getSql(
    `SELECT * FROM users WHERE email = ? OR username = ? LIMIT 1`,
    [emailOrUsername, emailOrUsername]
  );

  if (!user) {
    return res.render('login', { error: 'Invalid login credentials.', user: null });
  }

  const valid = await bcrypt.compare(password, user.password_hash);
  if (!valid) {
    return res.render('login', { error: 'Invalid login credentials.', user: null });
  }

  req.session.user = { id: user.id, role: user.role, full_name: user.full_name, email: user.email, department: user.department, phone: user.phone };
  res.redirect('/dashboard');
});

app.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/login');
  });
});

app.get('/', requireAuth, (req, res) => {
  res.redirect('/dashboard');
});

app.get('/dashboard', requireAuth, async (req, res) => {
  const user = await getSql('SELECT * FROM users WHERE id = ?', [req.session.user.id]);
  const announcements = await allSql(`SELECT a.*, u.full_name as author_name FROM announcements a JOIN users u ON u.id = a.created_by ORDER BY a.created_at DESC LIMIT 5`);
  const tasks = await allSql(`SELECT * FROM tasks WHERE user_id = ? ORDER BY created_at DESC LIMIT 5`, [user.id]);
  const achievements = await allSql(`SELECT * FROM achievements WHERE user_id = ? ORDER BY created_at DESC LIMIT 3`, [user.id]);
  const community = await allSql(`SELECT * FROM users WHERE id != ? ORDER BY full_name LIMIT 6`, [user.id]);

  res.render('dashboard', {
    user,
    announcements,
    tasks,
    achievements,
    community,
    roleLabel: formatRoleLabel(user.role)
  });
});

app.get('/community', requireAuth, async (req, res) => {
  const users = await allSql('SELECT * FROM users WHERE id != ? ORDER BY full_name', [req.session.user.id]);
  res.render('community', { user: req.session.user, users, currentRole: req.session.user.role });
});

app.get('/profile/:id', requireAuth, async (req, res) => {
  const targetUser = await getSql('SELECT * FROM users WHERE id = ?', [req.params.id]);
  if (!targetUser) return res.status(404).send('Profile not found');

  const achievements = await allSql('SELECT * FROM achievements WHERE user_id = ? ORDER BY created_at DESC', [targetUser.id]);
  const posts = await allSql('SELECT * FROM activity_posts WHERE created_by = ? ORDER BY created_at DESC', [targetUser.id]);
  const tasks = await allSql('SELECT * FROM tasks WHERE user_id = ? ORDER BY created_at DESC LIMIT 5', [targetUser.id]);

  res.render('profile', {
    currentUser: req.session.user,
    targetUser,
    achievements,
    posts,
    tasks,
    canMessage: Number(req.params.id) !== Number(req.session.user.id)
  });
});

app.get('/chat', requireAuth, async (req, res) => {
  const targetId = Number(req.query.user || 0);
  const contacts = await allSql('SELECT * FROM users WHERE id != ? ORDER BY full_name', [req.session.user.id]);

  let selectedUser = null;
  if (targetId) {
    selectedUser = await getSql('SELECT * FROM users WHERE id = ?', [targetId]);
  }

  let messages = [];
  if (selectedUser) {
    messages = await allSql(
      `SELECT m.*, u.full_name as sender_name FROM messages m JOIN users u ON u.id = m.sender_id
       WHERE (m.sender_id = ? AND m.receiver_id = ?) OR (m.sender_id = ? AND m.receiver_id = ?)
       ORDER BY m.created_at ASC`,
      [req.session.user.id, selectedUser.id, selectedUser.id, req.session.user.id]
    );
  }

  res.render('chat', { user: req.session.user, contacts, selectedUser, messages });
});

app.post('/chat', requireAuth, async (req, res) => {
  const receiverId = Number(req.body.receiver_id);
  const message = (req.body.message || '').trim();

  if (!receiverId || !message) {
    return res.redirect('/chat?user=' + receiverId);
  }

  await runSql(
    'INSERT INTO messages (sender_id, receiver_id, message) VALUES (?, ?, ?)',
    [req.session.user.id, receiverId, message]
  );

  res.redirect('/chat?user=' + receiverId);
});

app.get('/admin', requireAuth, requireRole(['admin']), async (req, res) => {
  const users = await allSql('SELECT * FROM users ORDER BY created_at DESC');
  const stats = {
    total: users.length,
    students: users.filter(u => u.role === 'student').length,
    alumni: users.filter(u => u.role === 'alumni').length,
    teachers: users.filter(u => u.role === 'teacher').length,
    mentors: users.filter(u => u.role === 'mentor').length
  };
  res.render('admin', { user: req.session.user, users, stats });
});

app.post('/admin/users', requireAuth, requireRole(['admin']), async (req, res) => {
  const role = req.body.role;
  const fullName = (req.body.full_name || '').trim();
  const email = (req.body.email || '').trim();
  const phone = (req.body.phone || '').trim();
  const department = (req.body.department || '').trim();

  if (!role || !fullName || !email) {
    return res.redirect('/admin?error=Please+fill+all+required+fields');
  }

  const username = email;
  const generatedPassword = defaultPasswordFor({ role, full_name: fullName, phone });
  const passwordHash = await bcrypt.hash(generatedPassword, 10);

  await runSql(
    `INSERT INTO users (role, full_name, email, username, phone, department, password_hash, status)
     VALUES (?, ?, ?, ?, ?, ?, ?, 'Active')`,
    [role, fullName, email, username, phone, department, passwordHash]
  );

  sendEmailLog(
    email,
    'Your WFC Portal Account Credentials',
    `Hello ${fullName},\n\nYour WFC account has been created.\nUsername: ${email}\nPassword: ${generatedPassword}\n\nPlease login and update your profile.`
  );

  res.redirect('/admin');
});

app.post('/admin/seed-demo-data', requireAuth, requireRole(['admin']), async (req, res) => {
  await initializeDatabase();
  await seedUsers();
  res.redirect('/admin');
});

app.get('/tasks', requireAuth, async (req, res) => {
  const user = req.session.user;
  const tasks = await allSql(`SELECT t.*, u.full_name as assigned_by_name FROM tasks t LEFT JOIN users u ON u.id = t.assigned_by WHERE t.user_id = ? ORDER BY t.created_at DESC`, [user.id]);
  const myAssignments = await allSql(`SELECT * FROM tasks WHERE assigned_by = ? ORDER BY created_at DESC`, [user.id]);
  res.render('tasks', { user, tasks, myAssignments });
});

app.post('/tasks', requireAuth, async (req, res) => {
  const user = req.session.user;
  const title = (req.body.title || '').trim();
  const description = (req.body.description || '').trim();
  const assigneeEmail = (req.body.assignee_email || '').trim();

  if (!title || !description || !assigneeEmail) {
    return res.redirect('/tasks?error=Task+details+required');
  }

  const assignee = await getSql('SELECT * FROM users WHERE email = ? OR username = ? LIMIT 1', [assigneeEmail, assigneeEmail]);
  if (!assignee) {
    return res.redirect('/tasks?error=Student+not+found');
  }

  await runSql(
    'INSERT INTO tasks (title, description, user_id, assigned_by, due_date, status) VALUES (?, ?, ?, ?, ?, ?)',
    [title, description, assignee.id, user.id, req.body.due_date || null, 'Open']
  );

  res.redirect('/tasks');
});

app.get('/announcements', requireAuth, async (req, res) => {
  const announcements = await allSql(`SELECT a.*, u.full_name as author_name FROM announcements a JOIN users u ON u.id = a.created_by ORDER BY a.created_at DESC`);
  res.render('announcements', { user: req.session.user, announcements });
});

app.post('/announcements', requireAuth, async (req, res) => {
  const title = (req.body.title || '').trim();
  const content = (req.body.content || '').trim();
  if (!title || !content) return res.redirect('/announcements');

  await runSql(
    'INSERT INTO announcements (created_by, title, content, visible_to) VALUES (?, ?, ?, ?)',
    [req.session.user.id, title, content, req.session.user.role]
  );

  res.redirect('/announcements');
});

app.get('/achievements', requireAuth, async (req, res) => {
  const achievements = await allSql(`SELECT a.*, u.full_name FROM achievements a JOIN users u ON u.id = a.user_id ORDER BY a.created_at DESC`);
  res.render('achievements', { user: req.session.user, achievements });
});

app.post('/achievements', requireAuth, async (req, res) => {
  const title = (req.body.title || '').trim();
  const description = (req.body.description || '').trim();
  const userId = Number(req.body.user_id || req.session.user.id);
  if (!title || !description) return res.redirect('/achievements');

  await runSql(
    'INSERT INTO achievements (user_id, title, description) VALUES (?, ?, ?)',
    [userId, title, description]
  );

  res.redirect('/achievements');
});

app.get('/activity', requireAuth, async (req, res) => {
  const posts = await allSql(`SELECT p.*, u.full_name as author_name FROM activity_posts p JOIN users u ON u.id = p.created_by ORDER BY p.created_at DESC`);
  res.render('activity', { user: req.session.user, posts });
});

app.post('/activity', requireAuth, async (req, res) => {
  const title = (req.body.title || '').trim();
  const content = (req.body.content || '').trim();
  if (!title || !content) return res.redirect('/activity');

  await runSql(
    'INSERT INTO activity_posts (created_by, title, content, image_url) VALUES (?, ?, ?, ?)',
    [req.session.user.id, title, content, req.body.image_url || '']
  );

  res.redirect('/activity');
});

app.get('/documents', requireAuth, async (req, res) => {
  const items = await allSql(`SELECT d.*, u.full_name FROM documents d JOIN users u ON u.id = d.user_id ORDER BY d.created_at DESC`);
  res.render('documents', { user: req.session.user, items });
});

app.post('/documents', requireAuth, async (req, res) => {
  const title = (req.body.title || '').trim();
  const description = (req.body.description || '').trim();
  if (!title || !description) return res.redirect('/documents');

  await runSql(
    'INSERT INTO documents (user_id, title, description, status) VALUES (?, ?, ?, ?)',
    [req.session.user.id, title, description, 'Pending']
  );

  res.redirect('/documents');
});

app.get('/health', (req, res) => {
  res.json({ ok: true, message: 'WFC platform is running' });
});

(async () => {
  await initializeDatabase();
  app.listen(PORT, () => {
    console.log(`WFC platform running on http://localhost:${PORT}`);
  });
})();
