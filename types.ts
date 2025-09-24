export type Role = 'alumno' | 'profesor' | 'preceptor';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatarUrl?: string;
  dni?: string;
  about?: string;
  career?: string;
}

export interface Subject {
  id: string;
  name: string;
  teacher: string;
  average: number;
}

export interface Assignment {
    id: string;
    title: string;
    subject: string;
    dueDate: string;
}

export interface Grade {
    id: string;
    subject: string;
    assignment: string;
    grade: number | string;
    semester: 1 | 2;
    year: string;
}

export interface Attendance {
    id: string;
    date: string;
    subject: string;
    status: 'presente' | 'ausente' | 'tarde' | 'justificado';
    year: string;
}

export interface Material {
    id:string;
    title: string;
    subject: string;
    fileType: 'PDF' | 'DOCX' | 'PPT';
    year: string;
}

export interface ChatMessage {
    id: string;
    senderId: string;
    text: string;
    timestamp: string;
}

export interface Conversation {
    id: string;
    participants: { [key: string]: string }; // userId: userName
    messages: ChatMessage[];
    lastMessageSnippet: string;
    isRead: boolean;
    groupName?: string;
}

export interface ForumReply {
    id: string;
    author: string;
    content: string;
}

export interface ForumPost {
    id: string;
    title: string;
    author: string;
    category: string;
    content: string;
    replies: ForumReply[];
    lastActivity: string;
}

export interface CalendarEvent {
    id: string;
    day: number;
    title: string;
    description: string;
    color?: string;
    isPublic: boolean;
    ownerId: string; // The ID of the user who created the event
}

export interface Notification {
    id: string;
    title: string;
    date: string;
    read: boolean;
}

export interface NewsItem {
    id: string;
    title: string;
    summary: string;
    actionText?: string;
}

export interface FinalExamSubject {
    id: string;
    name: string;
    date: string;
}

export interface ClassSchedule {
    id:string;
    time: string;
    subject: string;
    classroom: string;
    virtualLink?: string;
}

export interface TeacherSummary {
    id: string;
    subject: string;
    commission: string;
    studentCount: number;
    pendingSubmissions: number;
}

export interface PendingStudent {
  id: string;
  name: string;
}

export interface StudentGradeRecord {
    id: string;
    name: string;
    semester1: number | null;
    semester2: number | null;
}

export interface StudentAttendanceRecord {
    id: string;
    name: string;
    status: 'presente' | 'ausente' | 'tarde' | null;
}

export interface PendingJustification {
  id: string;
  studentName: string;
  subject: string;
  date: string;
  reason: string;
}

export interface UnderperformingStudent {
  id: string;
  name: string;
  reason: string; // e.g., 'Bajo Promedio', 'Inasistencias'
  value: string; // e.g., '5.5 Promedio', '5 Faltas'
}

export interface ProcedureRequest {
  id: string;
  studentId: string;
  studentName: string;
  type: 'Constancia de Aluno Regular' | 'Solicitud de Mesa Especial' | 'Baja de Materia' | 'Consulta de Legajo';
  date: string;
  status: 'pending' | 'approved' | 'rejected';
}

export interface Career {
  name: string;
  years: Record<string, string[]>;
}
