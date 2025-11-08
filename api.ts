import type { User, Role, Grade, Attendance, Material, Conversation, ForumPost, CalendarEvent, Notification, Assignment, NewsItem, FinalExamSubject, ClassSchedule, ChatMessage, TeacherSummary, PendingStudent, StudentGradeRecord, StudentAttendanceRecord, PendingJustification, UnderperformingStudent, ProcedureRequest, Career, AuxiliarTask, IncidentReport, StudentCenterAnnouncement, StudentClaim, ForumReply } from './types';
import { MOCK_USERS, MOCK_STUDENT_DATA, MOCK_CONVERSATIONS, MOCK_FORUM_POSTS, MOCK_PRECEPTOR_FORUM_POSTS, MOCK_MATERIALS, MOCK_CALENDAR_EVENTS, MOCK_STUDENT_NOTIFICATIONS, MOCK_TEACHER_NOTIFICATIONS, MOCK_PRECEPTOR_NOTIFICATIONS, MOCK_PENDING_JUSTIFICATIONS, MOCK_UNDERPERFORMING_STUDENTS, MOCK_NEWS, MOCK_FINALS_SUBJECTS, MOCK_TODAY_SCHEDULE, MOCK_TEACHER_SCHEDULE, MOCK_TEACHER_SUMMARY, MOCK_PENDING_SUBMISSIONS, MOCK_COURSE_GRADES, MOCK_COURSE_ATTENDANCE, MOCK_PRECEPTOR_ATTENDANCE_DETAIL, MOCK_PROCEDURE_REQUESTS, MOCK_CAREERS, MOCK_STUDENT_PROFILE_DATA, MOCK_DIRECTOR_STATS, MOCK_STAFF_LIST, MOCK_AUXILIAR_TASKS, MOCK_STUDENT_CENTER_ANNOUNCEMENTS, MOCK_STUDENT_CLAIMS, MOCK_INCIDENTS } from './constants';

const API_DELAY = 400;

// In-memory data stores to simulate a database
let db = {
    users: [...MOCK_USERS.alumno, ...MOCK_USERS.profesor, ...MOCK_USERS.preceptor, ...MOCK_USERS.directivo, ...MOCK_USERS.auxiliar, ...MOCK_USERS.centro_estudiantes],
    studentData: { ...MOCK_STUDENT_DATA },
    conversations: [...MOCK_CONVERSATIONS],
    forumPosts: [...MOCK_FORUM_POSTS],
    preceptorForumPosts: [...MOCK_PRECEPTOR_FORUM_POSTS],
    materials: [...MOCK_MATERIALS],
    calendarEvents: [...MOCK_CALENDAR_EVENTS],
    pendingJustifications: [...MOCK_PENDING_JUSTIFICATIONS],
    procedureRequests: [...MOCK_PROCEDURE_REQUESTS],
    courseGrades: { ...MOCK_COURSE_GRADES },
    courseAttendance: { ...MOCK_COURSE_ATTENDANCE },
};


const simulateNetwork = <T>(data: T): Promise<T> => {
  return new Promise(resolve => setTimeout(() => resolve(JSON.parse(JSON.stringify(data))), API_DELAY));
};

// --- AUTH ---
export const login = async (role: Role, email: string): Promise<User> => {
  const user = db.users.find(u => u.role === role && u.email === email);
  if (user) {
    return simulateNetwork(user);
  }
  throw new Error('Credenciales inválidas. Inténtalo de nuevo.');
};

export const updateUser = async (user: User): Promise<User> => {
    db.users = db.users.map(u => u.id === user.id ? user : u);
    return simulateNetwork(user);
};

// --- GENERAL ---
export const getNotifications = async (role: Role): Promise<Notification[]> => {
    const notifications = {
        alumno: MOCK_STUDENT_NOTIFICATIONS,
        profesor: MOCK_TEACHER_NOTIFICATIONS,
        preceptor: MOCK_PRECEPTOR_NOTIFICATIONS,
        directivo: [],
        auxiliar: [],
        centro_estudiantes: [],
    };
    return simulateNetwork(notifications[role] || []);
};

// --- STUDENT ---
export const getStudentDashboardData = async () => simulateNetwork({
    news: MOCK_NEWS,
    schedule: MOCK_TODAY_SCHEDULE,
    finals: MOCK_FINALS_SUBJECTS,
});

export const getStudentGrades = async () => simulateNetwork(db.studentData.grades);
export const getStudentAttendance = async () => simulateNetwork(db.studentData.attendance);
export const enrollInFinals = async (subjectIds: string[]) => simulateNetwork({ success: true });
export const submitJustification = async (absenceId: string, reason: string) => simulateNetwork({ success: true });
export const requestProcedure = async (type: ProcedureRequest['type']) => simulateNetwork({ success: true });

// --- FORUM ---
export const getForumPosts = async (role: Role) => simulateNetwork(role === 'preceptor' ? db.preceptorForumPosts : db.forumPosts);
export const createForumPost = async (postData: Omit<ForumPost, 'id' | 'replies' | 'lastActivity' | 'author'>, author: User): Promise<ForumPost> => {
    const newPost: ForumPost = {
        ...postData,
        id: `fp-${Date.now()}`,
        author: author.name,
        replies: [],
        lastActivity: 'ahora mismo',
    };
    if (author.role === 'preceptor') {
        db.preceptorForumPosts = [newPost, ...db.preceptorForumPosts];
    } else {
        db.forumPosts = [newPost, ...db.forumPosts];
    }
    return simulateNetwork(newPost);
};
export const addForumReply = async (postId: string, reply: Omit<ForumReply, 'id'>, authorRole: Role): Promise<ForumReply> => {
    const newReply = { ...reply, id: `r-${Date.now()}` };
    const updatePosts = (posts: ForumPost[]) => posts.map(p => p.id === postId ? { ...p, replies: [...p.replies, newReply] } : p);
    
    if (authorRole === 'preceptor') {
        db.preceptorForumPosts = updatePosts(db.preceptorForumPosts);
    } else {
        db.forumPosts = updatePosts(db.forumPosts);
    }
    return simulateNetwork(newReply);
};

// --- MESSAGES ---
export const getConversations = async (userId: string) => simulateNetwork(db.conversations.filter(c => c.participants[userId]));
export const sendMessage = async (conversationId: string, message: ChatMessage) => {
    db.conversations = db.conversations.map(c => 
        c.id === conversationId 
        ? { ...c, messages: [...c.messages, message], lastMessageSnippet: message.text } 
        : c
    );
    return simulateNetwork(message);
};
export const getContacts = async (currentUser: User) => simulateNetwork({
    careers: MOCK_CAREERS,
    users: db.users.filter(u => u.id !== currentUser.id)
});

// --- SHARED (Student/Teacher) ---
export const getMaterials = async () => simulateNetwork(db.materials);
export const getCalendarEvents = async () => simulateNetwork(db.calendarEvents);

// --- TEACHER ---
export const getTeacherDashboardData = async () => simulateNetwork({
    schedule: MOCK_TEACHER_SCHEDULE,
    summary: MOCK_TEACHER_SUMMARY,
});
export const getPendingSubmissions = async (courseId: string) => simulateNetwork(MOCK_PENDING_SUBMISSIONS[courseId] || []);
export const getCourseGrades = async (subject: string) => simulateNetwork(db.courseGrades[subject] || []);
export const saveCourseGrades = async (subject: string, grades: StudentGradeRecord[]) => {
    db.courseGrades[subject] = grades;
    return simulateNetwork({ success: true });
};
export const getCourseAttendance = async (subject: string) => simulateNetwork(db.courseAttendance[subject] || []);
export const saveCourseAttendance = async (subject: string, attendance: StudentAttendanceRecord[]) => {
    db.courseAttendance[subject] = attendance;
    return simulateNetwork({ success: true });
};
export const uploadMaterial = async (material: Omit<Material, 'id'>) => {
    const newMaterial = { ...material, id: `m-${Date.now()}` };
    db.materials = [newMaterial, ...db.materials];
    return simulateNetwork(newMaterial);
};

// --- PRECEPTOR ---
export const getPreceptorDashboardData = async () => simulateNetwork({
    pendingJustifications: db.pendingJustifications,
    underperformingStudents: MOCK_UNDERPERFORMING_STUDENTS,
    pendingProcedures: db.procedureRequests.filter(p => p.status === 'pending'),
});

export const manageJustification = async (id: string, action: 'approve' | 'reject') => {
    db.pendingJustifications = db.pendingJustifications.filter(j => j.id !== id);
    return simulateNetwork({ success: true });
};
export const sendCommunication = async (subject: string, message: string, recipient: string) => simulateNetwork({ success: true });
export const getGeneralAttendanceData = async () => simulateNetwork({
    careers: MOCK_CAREERS,
    attendanceDetail: MOCK_PRECEPTOR_ATTENDANCE_DETAIL,
});
export const getStudentProfile = async (studentId: string) => simulateNetwork(MOCK_STUDENT_PROFILE_DATA[studentId] || MOCK_STUDENT_PROFILE_DATA['default']);
export const getProcedureRequests = async () => simulateNetwork(db.procedureRequests);
export const manageProcedure = async (requestId: string, status: 'approved' | 'rejected') => {
    db.procedureRequests = db.procedureRequests.map(req => req.id === requestId ? { ...req, status } : req);
    return simulateNetwork({ success: true });
};


// --- DIRECTOR ---
export const getDirectorDashboardData = async () => simulateNetwork({
    stats: MOCK_DIRECTOR_STATS,
    staff: MOCK_STAFF_LIST,
});

export const getStaffList = async () => simulateNetwork(MOCK_STAFF_LIST);


// --- AUXILIAR ---
export const getAuxiliarDashboardData = async () => simulateNetwork({
    tasks: MOCK_AUXILIAR_TASKS,
    incidents: MOCK_INCIDENTS,
});

// --- STUDENT CENTER ---
export const getStudentCenterDashboardData = async () => simulateNetwork({
    announcements: MOCK_STUDENT_CENTER_ANNOUNCEMENTS,
    claims: MOCK_STUDENT_CLAIMS,
});
