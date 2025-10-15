import React, { useState, useEffect, useMemo, useCallback } from 'react';
import type { User, Role, Attendance, Grade, Conversation, ForumPost, CalendarEvent, Notification, ChatMessage, FinalExamSubject, NewsItem, ClassSchedule, TeacherSummary, PendingStudent, StudentGradeRecord, StudentAttendanceRecord, PendingJustification, UnderperformingStudent, Material, ProcedureRequest, AuxiliarTask, StudentCenterAnnouncement, StudentClaim, IncidentReport } from './types';
import { MOCK_USERS, MOCK_STUDENT_DATA, MOCK_CONVERSATIONS, MOCK_FORUM_POSTS, MOCK_PRECEPTOR_FORUM_POSTS, MOCK_MATERIALS, MOCK_CALENDAR_EVENTS, MOCK_STUDENT_NOTIFICATIONS, MOCK_TEACHER_NOTIFICATIONS, MOCK_PRECEPTOR_NOTIFICATIONS, MOCK_PENDING_JUSTIFICATIONS, MOCK_UNDERPERFORMING_STUDENTS, MOCK_NEWS, MOCK_FINALS_SUBJECTS, MOCK_TODAY_SCHEDULE, MOCK_TEACHER_SCHEDULE, MOCK_TEACHER_SUMMARY, MOCK_PENDING_SUBMISSIONS, MOCK_COURSE_GRADES, MOCK_COURSE_ATTENDANCE, MOCK_PRECEPTOR_ATTENDANCE_DETAIL, MOCK_PROCEDURE_REQUESTS, MOCK_SUBJECTS_BY_YEAR, MOCK_CAREERS, MOCK_STUDENT_PROFILE_DATA, MOCK_DIRECTOR_STATS, MOCK_STAFF_LIST, MOCK_AUXILIAR_TASKS, MOCK_STUDENT_CENTER_ANNOUNCEMENTS, MOCK_STUDENT_CLAIMS, MOCK_INCIDENTS } from './constants';

// --- ICONS (as components for reusability) ---
const ArrowLeftIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
    </svg>
);
const ArrowLeftOnRectangleIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
    </svg>
);
const CloseIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);
const BookOpenIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.023v11.954m-5.45-9.454a2.25 2.25 0 100 4.5 2.25 2.25 0 000-4.5zM17.45 6.577a2.25 2.25 0 100 4.5 2.25 2.25 0 000-4.5zM3.9 12.023a8.1 8.1 0 0116.2 0" />
  </svg>
);
const AcademicCapIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.258-.813A59.906 59.906 0 0112 3.493a59.903 59.903 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0l-2.072-1.036A59.922 59.922 0 0112 3.493a59.922 59.922 0 0111.824 5.617l-2.072 1.036m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5z" />
    </svg>
);
const SunIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-6.364-.386l1.591-1.591M3 12h2.25m.386-6.364l1.591 1.591M12 12a6 6 0 100 12 6 6 0 000-12z" />
    </svg>
);
const MoonIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.72 9.72 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25c0 5.385 4.365 9.75 9.75 9.75 2.572 0 4.92-.99 6.697-2.648z" />
    </svg>
);
const PaletteIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.098 19.902a3.75 3.75 0 005.304 0l6.401-6.402a3.75 3.75 0 00-.615-6.218L15 7.5l-6.402 6.402a3.75 3.75 0 000 5.304z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 7.5l-6.402 6.402a3.75 3.75 0 000 5.304l6.401-6.402a3.75 3.75 0 00-.615-6.218L15 7.5z" />
    </svg>
);
const DevicePhoneMobileIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" />
  </svg>
);

const ChartBarIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125-1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
    </svg>
);
const CheckBadgeIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);
const XCircleIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);
const InboxIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 13.5h3.86a2.25 2.25 0 012.012 1.244l.256.512a2.25 2.25 0 002.013 1.244h3.218a2.25 2.25 0 002.013-1.244l.256-.512a2.25 2.25 0 012.013-1.244h3.859m-19.5.338V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18v-4.162c0-.224-.034-.447-.1-.661L19.24 5.338a2.25 2.25 0 00-2.12-1.588H6.88a2.25 2.25 0 00-2.12 1.588L2.35 13.177a2.25 2.25 0 00-.1.661z" /></svg>
);
const ChatBubbleLeftRightIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193l-3.72 3.72a1.125 1.125 0 01-1.59 0L13.5 18.5h-1.5a2.25 2.25 0 00-2.25 2.25v-1.5m3.75-12.75-3.75 3.75m3.75-3.75L16.5 11.25m-6-6L4.5 11.25m3.75-3.75-3.75 3.75m6.75 4.5l-3.75 3.75m3.75-3.75-3.75-3.75m3.75 3.75L13.5 15m-3.75-3.75L6 15m12-9.75L10.5 12" /></svg>
);
const UserCircleIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
);
const BellIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
    </svg>
);
const CalendarDaysIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0h18M-4.5 12h22.5" />
    </svg>
);
const PlusCircleIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);
const UploadIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
    </svg>
);
const PencilSquareIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
    </svg>
);
const VideoCameraIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9A2.25 2.25 0 0013.5 5.25h-9A2.25 2.25 0 002.25 7.5v9A2.25 2.25 0 004.5 18.75z" />
    </svg>
);
const ClockIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

const ClipboardDocumentCheckIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.125 2.25h-4.5c-1.125 0-2.25.9-2.25 2.25v15c0 1.125.9 2.25 2.25 2.25h11.25c1.125 0 2.25-.9 2.25-2.25v-15c0-1.125-.9-2.25-2.25-2.25h-4.5m-1.875 0c.398 0 .788.064 1.17.187m-1.17-.187c-.398 0-.788.064-1.17.187m1.17.187c.398 0 .788.064 1.17.187m-1.17-.187c-.398 0-.788.064-1.17.187m0 0a2.25 2.25 0 00-2.25 2.25v15c0 1.125.9 2.25 2.25 2.25h11.25c1.125 0 2.25-.9 2.25-2.25v-15c0-1.125-.9-2.25-2.25-2.25h-4.5m-1.875 0c-.398 0-.788.064-1.17.187m-1.17-.187c.398 0 .788.064 1.17.187m0 0c.398 0 .788.064 1.17.187m-1.17-.187c-.398 0-.788.064-1.17.187M12 9.75l-2.625 2.625a.75.75 0 001.06 1.06L12 11.88l3.56-3.56a.75.75 0 10-1.06-1.06L12 9.75z" />
    </svg>
);

const MegaphoneIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" />
    </svg>
);
const DocumentTextIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 9h6m-6 3h6m-6-3h.008v.008H8.25v-.008zm0 3h.008v.008H8.25v-.008zM5.625 5.625A2.25 2.25 0 018.25 3.375h7.5c1.24 0 2.25.934 2.25 2.083v12.75c0 1.149-.933 2.084-2.25 2.084h-7.5a2.25 2.25 0 01-2.25-2.25V5.625z" />
    </svg>
);

const ChatBubbleBottomCenterTextIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 9.75a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.76 9.76 0 01-2.53-.388m-5.34-4.433A12.032 12.032 0 013 11.25c0-2.791.64-5.468 1.75-7.733M21 12c0-4.556-4.03-8.25-9-8.25-1.95 0-3.763.49-5.34 1.333m13.68 12.803A11.953 11.953 0 0112 21c-2.791 0-5.468-.64-7.733-1.75" />
    </svg>
);

const MapPinIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
    </svg>
);

const EnvelopeIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
    </svg>
);

const FacebookIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
      <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
    </svg>
);

const ArrowDownTrayIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
    </svg>
);

// --- NEW ICONS FOR NEW ROLES ---
const UserGroupIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m-7.5-2.962A3.75 3.75 0 0112 15.75c1.253 0 2.423.404 3.372 1.068M12 15.75A3.75 3.75 0 018.628 12 3.75 3.75 0 0112 8.25c1.253 0 2.423.404 3.372 1.068M15 6.75A3.75 3.75 0 0111.628 3 3.75 3.75 0 018.25 6.75c0 1.253.404 2.423 1.068 3.372m0 0a3.75 3.75 0 013.372 0M6.75 8.25A3.75 3.75 0 013 11.628 3.75 3.75 0 016.75 15c1.253 0 2.423-.404 3.372-1.068m0 0a3.75 3.75 0 01-3.372 0" />
    </svg>
);

const ChartPieIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6a7.5 7.5 0 107.5 7.5h-7.5V6z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 10.5H21A7.5 7.5 0 0013.5 3v7.5z" />
    </svg>
);

const WrenchScrewdriverIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 1.263a2.25 2.25 0 010 3.182l-2.72 2.72a2.25 2.25 0 01-3.182 0l-1.263-1.263a2.25 2.25 0 010-3.182l2.72-2.72a2.25 2.25 0 013.182 0zM15.75 9.75l-4.218-4.218a2.25 2.25 0 013.182 0l1.036 1.036m-3.182-3.182a2.25 2.25 0 013.182 0l4.218 4.218m-8.436 8.436a2.25 2.25 0 01-3.182 0l-1.036-1.036a2.25 2.25 0 010-3.182l4.218-4.218a2.25 2.25 0 013.182 0l1.036 1.036m-3.182 3.182l-4.218 4.218a2.25 2.25 0 01-3.182 0l-1.036-1.036a2.25 2.25 0 010-3.182l4.218-4.218a2.25 2.25 0 013.182 0l1.036 1.036" />
    </svg>
);

const BuildingOfficeIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h6M9 11.25h6M9 15.75h6" />
    </svg>
);

const InboxArrowDownIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m0 0l6.75-6.75M12 19.5l-6.75-6.75M3.75 6.75h16.5" />
    </svg>
);

const ExclamationTriangleIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
    </svg>
);

type Page = 'panel' | 'calificaciones' | 'asistencia' | 'agenda' | 'mensajes' | 'foros' | 'perfil' | 'materiales' | 'asistencia-general' | 'trámites' | 'alumno-perfil' | 'personal' | 'estadisticas' | 'comunicados' | 'tareas' | 'instalaciones' | 'turnos' | 'eventos' | 'anuncios' | 'reclamos' ;

// --- REUSABLE UI COMPONENTS ---
const Card: React.FC<{ title?: string; children: React.ReactNode; className?: string; }> = ({ title, children, className = '' }) => (
    <div className={`bg-card-bg rounded-lg shadow-md p-4 sm:p-6 animate-fade-in ${className}`}>
        {title && <h3 className="text-lg font-semibold text-text-primary mb-4">{title}</h3>}
        {children}
    </div>
);

const Modal: React.FC<{ isOpen: boolean; onClose: () => void; title: string; children: React.ReactNode; }> = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60" aria-modal="true">
            <div className="bg-card-bg rounded-lg shadow-xl w-full max-w-md m-4 animate-fade-in">
                <div className="flex items-center justify-between p-4 border-b border-app-border">
                    <h3 className="text-lg font-semibold">{title}</h3>
                    <button onClick={onClose} className="p-1 rounded-full hover:bg-bg-tertiary">
                        <CloseIcon className="w-5 h-5" />
                    </button>
                </div>
                <div className="p-6">{children}</div>
            </div>
        </div>
    );
};

const WeeklyCalendar: React.FC<{ events: CalendarEvent[]; }> = ({ events }) => {
    const today = new Date();
    const currentDay = today.getDay();
    const mondayOffset = (currentDay === 0) ? -6 : 1 - currentDay;
    
    const monday = new Date(today);
    monday.setDate(today.getDate() + mondayOffset);
    monday.setHours(0, 0, 0, 0);

    const weekDays = Array.from({ length: 5 }).map((_, i) => {
        const day = new Date(monday);
        day.setDate(monday.getDate() + i);
        return day;
    });

    const getEventsForDay = (date: Date) => {
        const dayNumber = date.getDate();
        return events.filter(e => e.day === dayNumber);
    };

    const dayNames = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'];
    
    const colorClasses: Record<string, string> = {
        'accent-blue': 'bg-accent-blue/20 text-accent-blue border-l-4 border-accent-blue',
        'accent-purple': 'bg-accent-purple/20 text-accent-purple border-l-4 border-accent-purple',
        'accent-yellow': 'bg-accent-yellow/20 text-accent-yellow border-l-4 border-accent-yellow',
        'accent-red': 'bg-accent-red/20 text-accent-red border-l-4 border-accent-red',
        'accent-green': 'bg-accent-green/20 text-accent-green border-l-4 border-accent-green',
    };
    
    const defaultColorClass = 'bg-gray-500/20 text-gray-500 border-l-4 border-gray-500';

    return (
        <Card title="Registro Semanal">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                {weekDays.map((day, index) => {
                    const dayEvents = getEventsForDay(day);
                    const isToday = day.toDateString() === today.toDateString();
                    return (
                        <div key={index} className={`rounded-lg p-3 flex flex-col ${isToday ? 'bg-brand-primary/10 ring-2 ring-brand-primary/50' : 'bg-bg-primary'}`}>
                            <div className={`flex justify-between items-center pb-2 mb-2 border-b ${isToday ? 'border-brand-primary/50' : 'border-app-border'}`}>
                                <p className="text-sm font-semibold">{dayNames[index]}</p>
                                <p className={`font-bold text-lg ${isToday ? 'text-brand-primary' : ''}`}>{day.getDate()}</p>
                            </div>
                            <div className="space-y-2 min-h-[60px] flex-grow">
                                {dayEvents.length > 0 ? dayEvents.slice(0, 2).map(event => (
                                    <div key={event.id} title={event.title} className={`p-2 rounded text-xs ${colorClasses[event.color || ''] || defaultColorClass}`}>
                                        <p className="font-semibold truncate">{event.title}</p>
                                    </div>
                                )) : (
                                    <div className="flex h-full items-center justify-center">
                                       <p className="text-xs text-text-secondary text-center">Sin eventos</p>
                                    </div>
                                )}
                                {dayEvents.length > 2 && (
                                     <p className="text-xs text-text-secondary text-center pt-1">+ {dayEvents.length - 2} más</p>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </Card>
    );
};


// --- LOGIN SCREEN ---
const LoginScreen: React.FC<{ onLogin: (user: User) => void; }> = ({ onLogin }) => {
    const [role, setRole] = useState<Role>('alumno');
    const [email, setEmail] = useState('alumno@example.com');
    const [password, setPassword] = useState('password');
    const [error, setError] = useState('');
    const [isRegisterModalOpen, setRegisterModalOpen] = useState(false);
    const [isForgotModalOpen, setForgotModalOpen] = useState(false);

    useEffect(() => {
        const credentials: Record<Role, { email: string; pass: string }> = {
            alumno: { email: 'alumno@example.com', pass: 'password' },
            profesor: { email: 'profesor@example.com', pass: 'password' },
            preceptor: { email: 'preceptor@example.com', pass: 'password' },
            directivo: { email: 'directivo@example.com', pass: 'password' },
            auxiliar: { email: 'auxiliar@example.com', pass: 'password' },
            centro_estudiantes: { email: 'centro@example.com', pass: 'password' },
        };
        setEmail(credentials[role].email);
        setPassword(credentials[role].pass);
    }, [role]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const user = MOCK_USERS[role].find(u => u.email === email);
        if (user && password === 'password') { onLogin(user); } 
        else { setError('Credenciales inválidas. Inténtalo de nuevo.'); }
    };

    return (
        <>
        <div className="flex items-center justify-center min-h-screen bg-bg-primary p-4">
            <div className="w-full max-w-md p-6 sm:p-8 space-y-6 sm:space-y-8 bg-card-bg rounded-lg shadow-lg animate-fade-in">
                <div className="text-center">
                    <img src='https://i.postimg.cc/ZnvcNRgC/450c3215-379b-4542-8a15-08ed88e6d696.png' alt="Instituto 26 Logo" className="w-16 h-16 mx-auto"/>
                    <h1 className="mt-4 text-xl sm:text-2xl font-bold text-center text-text-primary">Instituto Superior de Formación Docente y Técnica N° 26</h1>
                    <p className="mt-2 text-text-secondary">Inicia sesión para acceder a tu panel</p>
                </div>
                <form className="space-y-4 sm:space-y-6" onSubmit={handleSubmit}>
                    {error && <p className="text-red-500 text-sm text-center">{error}</p>}
                    <div>
                        <label htmlFor="role" className="block text-sm font-medium text-text-primary">Soy...</label>
                        <select id="role" value={role} onChange={e => setRole(e.target.value as Role)}
                            className="w-full px-3 py-2 mt-1 bg-bg-secondary border border-app-border rounded-md shadow-sm focus:outline-none focus:ring-brand-primary focus:border-brand-primary text-text-primary">
                            <option value="alumno">Alumno</option>
                            <option value="profesor">Profesor</option>
                            <option value="preceptor">Preceptor</option>
                            <option value="directivo">Directivo</option>
                            <option value="auxiliar">Auxiliar</option>
                            <option value="centro_estudiantes">Centro de Estudiantes</option>
                        </select>
                    </div>
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-text-primary">Dirección de correo</label>
                        <input id="email" type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder={`ej: ${role}@example.com`}
                            className="w-full px-3 py-2 mt-1 bg-bg-secondary border border-app-border rounded-md shadow-sm focus:outline-none focus:ring-brand-primary focus:border-brand-primary text-text-primary"/>
                    </div>
                    <div>
                        <label htmlFor="password"  className="block text-sm font-medium text-text-primary">Contraseña</label>
                        <input id="password" type="password" required value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••"
                            className="w-full px-3 py-2 mt-1 bg-bg-secondary border border-app-border rounded-md shadow-sm focus:outline-none focus:ring-brand-primary focus:border-brand-primary text-text-primary"/>
                    </div>
                    <button type="submit" className="w-full px-4 py-2 font-semibold text-white bg-brand-primary rounded-md hover:bg-brand-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary transition-colors duration-300">
                        Ingresar
                    </button>
                    <div className="text-sm text-center">
                        <a href="#" onClick={(e) => { e.preventDefault(); setForgotModalOpen(true); }} className="font-medium text-brand-primary hover:text-brand-secondary">¿Olvidaste tu contraseña?</a>
                    </div>
                </form>
                 <div className="text-sm text-center text-text-secondary">
                    <span>¿No tienes una cuenta? </span>
                    <a href="#" onClick={(e) => { e.preventDefault(); setRegisterModalOpen(true); }} className="font-medium text-brand-primary hover:text-brand-secondary">Regístrate</a>
                </div>
                <div className="pt-6 border-t border-app-border text-xs text-text-secondary space-y-3">
                    <div className="flex items-center justify-center gap-2">
                        <ClockIcon className="w-4 h-4 flex-shrink-0" />
                        <span>HORARIOS DE ATENCIÓN: 18:20 a 22:20 hs.</span>
                    </div>
                    <div className="flex items-center justify-center gap-2">
                        <MapPinIcon className="w-4 h-4 flex-shrink-0" />
                        <span>DIRECCIÓN: Marquez 51</span>
                    </div>
                    <div className="flex items-center justify-center gap-2">
                        <EnvelopeIcon className="w-4 h-4 flex-shrink-0" />
                        <a href="mailto:consultasinstituto26@gmail.com" className="hover:underline">consultasinstituto26@gmail.com</a>
                    </div>
                    <div className="flex items-center justify-center gap-2">
                        <FacebookIcon className="w-4 h-4 flex-shrink-0" />
                        <a href="https://www.facebook.com/isfdyt.dolores" target="_blank" rel="noopener noreferrer" className="hover:underline">
                            /isfdyt.dolores
                        </a>
                    </div>
                </div>
            </div>
        </div>
        
        <Modal isOpen={isRegisterModalOpen} onClose={() => setRegisterModalOpen(false)} title="Crear una Cuenta">
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-text-primary">Nombre Completo</label>
                    <input type="text" className="w-full p-2 mt-1 bg-transparent border rounded-md border-app-border" />
                </div>
                 <div>
                    <label className="block text-sm font-medium text-text-primary">Correo Electrónico</label>
                    <input type="email" className="w-full p-2 mt-1 bg-transparent border rounded-md border-app-border" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-text-primary">Contraseña</label>
                    <input type="password" className="w-full p-2 mt-1 bg-transparent border rounded-md border-app-border" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-text-primary">Rol</label>
                    <select className="w-full p-2 mt-1 bg-bg-secondary border rounded-md border-app-border">
                        <option>Alumno</option>
                        <option>Profesor</option>
                        <option>Preceptor</option>
                    </select>
                </div>
                <button onClick={() => { alert('¡Registro exitoso! Ahora puedes iniciar sesión.'); setRegisterModalOpen(false); }} className="w-full mt-4 px-4 py-2 bg-brand-primary text-white rounded-md hover:bg-brand-secondary">Registrarse</button>
            </div>
        </Modal>

        <Modal isOpen={isForgotModalOpen} onClose={() => setForgotModalOpen(false)} title="Recuperar Contraseña">
            <div className="space-y-4">
                <div>
                    <label htmlFor="recover-email" className="block text-sm font-medium text-text-primary">Correo Electrónico</label>
                    <input id="recover-email" type="email" className="w-full p-2 mt-1 bg-transparent border rounded-md border-app-border" />
                </div>
                <p className="text-xs text-text-secondary">Se enviará un enlace de recuperación a tu correo electrónico para que puedas crear una nueva contraseña.</p>
                <button onClick={() => { alert('Si existe una cuenta con ese correo, se ha enviado un enlace de recuperación.'); setForgotModalOpen(false); }} className="w-full mt-4 px-4 py-2 bg-brand-primary text-white rounded-md hover:bg-brand-secondary">Enviar Enlace</button>
            </div>
        </Modal>
        </>
    );
};

// --- STUDENT PAGES & COMPONENTS ---
const CircularProgress: React.FC<{ value: number; text: string; color: string; max?: number }> = ({ value, text, color, max = 10 }) => {
    const percentage = max > 0 ? (value / max) * 100 : 0;
    const circumference = 30 * 2 * Math.PI;
    const offset = circumference - (percentage / 100) * circumference;

    return (
        <div className="relative flex items-center justify-center w-24 h-24">
            <svg className="w-full h-full" viewBox="0 0 36 36">
                <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    className="text-bg-tertiary" fill="none" stroke="currentColor" strokeWidth="3"
                />
                <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none" stroke={color} strokeWidth="3"
                    strokeDasharray={`${percentage}, 100`}
                />
            </svg>
            <span className="absolute text-xl font-bold">{text}</span>
        </div>
    );
};


const AcademicSummaryCard: React.FC = () => {
    const summary = useMemo(() => {
        const numericGrades = MOCK_STUDENT_DATA.grades.map(g => Number(g.grade)).filter(n => !isNaN(n));
        const averageGrade = numericGrades.length > 0 ? (numericGrades.reduce((sum, g) => sum + g, 0) / numericGrades.length) : 0;
        
        const totalClasses = MOCK_STUDENT_DATA.attendance.length;
        const presentClasses = MOCK_STUDENT_DATA.attendance.filter(a => a.status === 'presente').length;
        const attendancePercentage = totalClasses > 0 ? Math.round((presentClasses / totalClasses) * 100) : 0;
        
        const gradesBySubject = MOCK_STUDENT_DATA.grades.reduce((acc, grade) => {
            if (!acc[grade.subject]) acc[grade.subject] = [];
            acc[grade.subject].push(Number(grade.grade));
            return acc;
        }, {} as Record<string, number[]>);

        let approvedSubjects = 0;
        for (const subject in gradesBySubject) {
            const subjectAvg = gradesBySubject[subject].reduce((s, g) => s + g, 0) / gradesBySubject[subject].length;
            if (subjectAvg >= 4) approvedSubjects++;
        }
        
        return {
            status: "Regular",
            careerProgress: `${approvedSubjects} / ${Object.keys(gradesBySubject).length}`,
            attendance: attendancePercentage,
            average: averageGrade.toFixed(2)
        };
    }, []);

    return (
        <Card>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 items-center text-center">
                <div className="col-span-2 md:col-span-2 text-left mb-4 md:mb-0">
                    <h3 className="text-lg font-semibold text-text-primary">Resumen Académico</h3>
                    <p className="text-sm">Estado: <span className="font-semibold text-accent-green">{summary.status}</span></p>
                    <p className="text-sm mt-2">Avance de Carrera</p>
                    <p className="text-2xl font-bold">{summary.careerProgress} <span className="text-base font-normal">materias</span></p>
                </div>
                <div className="flex flex-col items-center">
                    <p className="font-semibold mb-2">Asistencia General</p>
                    <CircularProgress value={summary.attendance} text={`${summary.attendance}%`} color="#22c55e" max={100} />
                </div>
                <div className="flex flex-col items-center">
                    <p className="font-semibold mb-2">Promedio General</p>
                     <CircularProgress value={parseFloat(summary.average)} text={summary.average} color="#3b82f6" max={10} />
                </div>
            </div>
        </Card>
    );
};

const FinalsModal: React.FC<{ isOpen: boolean; onClose: () => void; subjects: FinalExamSubject[] }> = ({ isOpen, onClose, subjects }) => {
    const [enrolled, setEnrolled] = useState<Record<string, boolean>>({});

    const handleEnroll = (id: string) => {
        setEnrolled(prev => ({ ...prev, [id]: !prev[id] }));
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Inscripción a Mesas de Finales">
            <ul className="space-y-3">
                {subjects.map(subject => (
                    <li key={subject.id} className="flex justify-between items-center p-3 bg-bg-primary rounded-md">
                        <div>
                            <span className="font-medium">{subject.name}</span>
                            <p className="text-sm text-text-secondary">{subject.date}</p>
                        </div>
                        <button onClick={() => handleEnroll(subject.id)}
                            className={`px-3 py-1 text-sm rounded-full flex-shrink-0 ${enrolled[subject.id] ? 'bg-accent-green text-white' : 'bg-brand-primary text-white hover:bg-brand-secondary'}`}>
                            {enrolled[subject.id] ? 'Inscripto' : 'Inscribirse'}
                        </button>
                    </li>
                ))}
            </ul>
             <button onClick={onClose} className="w-full mt-6 px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600">Cerrar</button>
        </Modal>
    );
};

const MaterialsSection: React.FC<{ materials: Material[] }> = ({ materials }) => {
    const [selectedSubject, setSelectedSubject] = useState('Todas');
    const subjects = useMemo(() => ['Todas', ...Array.from(new Set(materials.map(m => m.subject)))], [materials]);

    const filteredMaterials = useMemo(() => {
        if (selectedSubject === 'Todas') return materials;
        return materials.filter(m => m.subject === selectedSubject);
    }, [materials, selectedSubject]);

    return (
        <Card title="Biblioteca de Materiales">
            <div className="mb-4">
                <label htmlFor="subject-filter-panel" className="block text-sm font-medium text-text-primary">Filtrar por materia</label>
                <select id="subject-filter-panel" value={selectedSubject} onChange={e => setSelectedSubject(e.target.value)} className="w-full max-w-sm p-2 mt-1 bg-bg-secondary border border-app-border rounded-md focus:ring-brand-primary focus:border-brand-primary">
                    {subjects.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
            </div>
            
            <ul className="space-y-4 max-h-96 overflow-y-auto">
                {filteredMaterials.map(m => (
                    <li key={m.id} className="p-3 bg-bg-primary rounded-md flex flex-wrap justify-between items-center gap-2">
                        <div>
                            <p className="font-semibold">{m.title}</p>
                            <p className="text-sm text-text-secondary">{m.subject} - {m.year}</p>
                        </div>
                        <a href="#" className="text-sm px-3 py-1 border rounded-md border-app-border hover:bg-bg-tertiary flex-shrink-0">Descargar {m.fileType}</a>
                    </li>
                ))}
                {filteredMaterials.length === 0 && (
                    <p className="text-center text-text-secondary py-6">No hay materiales para la materia seleccionada.</p>
                )}
            </ul>
        </Card>
    );
};


const StudentDashboard: React.FC<{ navigate: (page: Page) => void; forumPosts: ForumPost[]; materials: Material[]; events: CalendarEvent[]; }> = ({ navigate, forumPosts, materials, events }) => {
    const [isFinalsModalOpen, setFinalsModalOpen] = useState(false);
    const recentPosts = forumPosts.slice(0, 3);

    return (
        <>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="lg:col-span-2">
                    <AcademicSummaryCard />
                </div>
                <div className="lg:col-span-2">
                    <WeeklyCalendar events={events} />
                </div>
                <Card title="Novedades Importantes">
                    <ul className="space-y-4">
                        {MOCK_NEWS.map(news => (
                             <li key={news.id} className="p-3 bg-bg-primary rounded-md">
                                <h4 className="font-semibold">{news.title}</h4>
                                <p className="text-sm text-text-secondary mt-1">{news.summary}</p>
                                {news.actionText && (
                                    <button onClick={() => setFinalsModalOpen(true)} className="text-sm font-semibold text-brand-primary hover:underline mt-2">{news.actionText}</button>
                                )}
                            </li>
                        ))}
                    </ul>
                </Card>
                <Card title="Clases de Hoy">
                    {MOCK_TODAY_SCHEDULE.length > 0 ? (
                        <ul className="space-y-3">
                            {MOCK_TODAY_SCHEDULE.map(cls => (
                                <li key={cls.id} className="flex justify-between items-center p-2 rounded-md bg-bg-primary">
                                    <div>
                                        <p className="font-semibold">{cls.subject}</p>
                                        <p className="text-sm text-text-secondary">{cls.time}</p>
                                    </div>
                                    {cls.virtualLink ? (
                                        <a href={cls.virtualLink} target="_blank" rel="noopener noreferrer"
                                           className="flex items-center gap-2 px-3 py-1 bg-accent-green text-white font-semibold rounded-lg hover:bg-green-600 transition-colors text-sm">
                                            <VideoCameraIcon className="w-4 h-4" />
                                            Unirse
                                        </a>
                                    ) : (
                                        <span className="font-mono text-sm px-2 py-1 bg-bg-tertiary rounded">Aula {cls.classroom}</span>
                                    )}
                                </li>
                            ))}
                        </ul>
                    ) : <p className="text-center text-text-secondary py-4">No tienes clases programadas para hoy.</p>}
                </Card>
                <div className="lg:col-span-2">
                    <Card title="Actividad Reciente en Foros">
                        <ul className="space-y-4">
                            {recentPosts.map(post => (
                                <li key={post.id} className="p-3 bg-bg-primary rounded-md">
                                    <h4 className="font-semibold">{post.title}</h4>
                                    <p className="text-sm text-text-secondary mt-1">
                                        en <span className="font-medium">{post.category}</span> por {post.author}
                                    </p>
                                </li>
                            ))}
                        </ul>
                        <button 
                            onClick={() => navigate('foros')} 
                            className="w-full mt-4 px-4 py-2 font-semibold text-white bg-brand-primary rounded-md hover:bg-brand-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary transition-colors duration-300"
                        >
                            Ir a los Foros
                        </button>
                    </Card>
                </div>
                 <div className="lg:col-span-2">
                    <MaterialsSection materials={materials} />
                </div>
            </div>
            <FinalsModal isOpen={isFinalsModalOpen} onClose={() => setFinalsModalOpen(false)} subjects={MOCK_FINALS_SUBJECTS} />
        </>
    );
};

const GradesPage: React.FC = () => {
    const [selectedYear, setSelectedYear] = useState('1er Año');
    const years = ['1er Año', '2do Año', '3er Año'];

    const gradesBySubject = useMemo(() => {
        const subjectsForYear = MOCK_SUBJECTS_BY_YEAR[selectedYear as keyof typeof MOCK_SUBJECTS_BY_YEAR] || [];
        const filteredGrades = MOCK_STUDENT_DATA.grades.filter(grade => subjectsForYear.includes(grade.subject));

        const grouped = filteredGrades.reduce((acc, grade) => {
            if (!acc[grade.subject]) {
                acc[grade.subject] = [];
            }
            acc[grade.subject].push(grade);
            return acc;
        }, {} as Record<string, Grade[]>);
        
        return Object.entries(grouped).map(([subject, grades]) => {
            const numericGrades = grades.map(g => Number(g.grade)).filter(n => !isNaN(n));
            const finalGrade = numericGrades.length > 0 ? (numericGrades.reduce((sum, g) => sum + g, 0) / numericGrades.length).toFixed(2) : 'N/A';
            return { subject, finalGrade, grades };
        });
    }, [selectedYear]);

    const renderSemesterTable = (grades: Grade[], semester: number) => (
        <div className="overflow-x-auto mt-4">
            <h4 className="font-semibold mb-2">{semester}° Cuatrimestre</h4>
            <table className="w-full text-left">
                <thead className="border-b border-app-border bg-bg-secondary">
                    <tr>
                        <th className="p-2 text-sm font-medium">Evaluación</th>
                        <th className="p-2 text-right text-sm font-medium">Nota</th>
                    </tr>
                </thead>
                <tbody>
                    {grades.filter(g => g.semester === semester).map(g => (
                        <tr key={g.id} className="border-b border-app-border last:border-b-0">
                            <td className="p-3">{g.assignment}</td>
                            <td className={`p-3 text-right font-bold ${Number(g.grade) >= 7 ? 'text-accent-green' : 'text-accent-yellow'}`}>{g.grade}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );

    return (
        <div className="space-y-6">
             <div className="p-4 bg-card-bg rounded-lg shadow-md">
                <label htmlFor="year-filter" className="block text-sm font-medium text-text-primary">Seleccionar Año</label>
                <select id="year-filter" value={selectedYear} onChange={e => setSelectedYear(e.target.value)}
                    className="w-full max-w-xs mt-1 p-2 bg-bg-secondary border border-app-border rounded-md focus:ring-brand-primary focus:border-brand-primary">
                    {years.map(year => <option key={year} value={year}>{year}</option>)}
                </select>
            </div>
            {gradesBySubject.length > 0 ? gradesBySubject.map(({ subject, finalGrade, grades }) => (
                <Card title={subject} key={subject}>
                    <div className="flex justify-between items-center mb-4">
                        <span className="text-text-secondary">Promedio Anual:</span>
                        <span className="text-2xl font-bold text-brand-primary">{finalGrade}</span>
                    </div>
                    {renderSemesterTable(grades, 1)}
                    {renderSemesterTable(grades, 2)}
                </Card>
            )) : (
                <Card>
                    <p className="text-center text-text-secondary py-6">No hay notas cargadas para el año seleccionado.</p>
                </Card>
            )}
        </div>
    );
};

const JustificationModal: React.FC<{ isOpen: boolean; onClose: () => void; absence: Attendance | null }> = ({ isOpen, onClose, absence }) => {
    const [tab, setTab] = useState<'upload' | 'text'>('text');
    
    const handleSubmit = () => {
        alert('Justificación enviada para revisión.');
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Justificar Ausencia">
             {absence && <p className="text-center mb-4">Materia: <strong>{absence.subject}</strong> - Fecha: <strong>{absence.date}</strong></p>}
             <div className="border-b border-app-border mb-4">
                <nav className="flex space-x-2" aria-label="Tabs">
                    <button onClick={() => setTab('text')} className={`px-3 py-2 font-medium text-sm rounded-t-md ${tab === 'text' ? 'border-b-2 border-brand-primary text-brand-primary' : 'text-text-secondary hover:text-text-primary'}`}>
                        Explicación
                    </button>
                    <button onClick={() => setTab('upload')} className={`px-3 py-2 font-medium text-sm rounded-t-md ${tab === 'upload' ? 'border-b-2 border-brand-primary text-brand-primary' : 'text-text-secondary hover:text-text-primary'}`}>
                        Subir Certificado
                    </button>
                </nav>
            </div>
            {tab === 'text' && (
                <textarea className="w-full p-2 border rounded-md bg-transparent border-app-border" rows={5} placeholder="Escribe el motivo de tu ausencia..."></textarea>
            )}
            {tab === 'upload' && (
                <div className="flex items-center justify-center w-full">
                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-bg-secondary hover:bg-bg-tertiary">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <UploadIcon className="w-8 h-8 mb-2 text-text-secondary"/>
                            <p className="mb-2 text-sm text-text-secondary"><span className="font-semibold">Click para subir</span> o arrastra</p>
                            <p className="text-xs text-text-secondary">PDF, PNG, JPG (MAX. 5MB)</p>
                        </div>
                        <input type="file" className="hidden" />
                    </label>
                </div> 
            )}
            <button onClick={handleSubmit} className="w-full mt-4 px-4 py-2 bg-brand-primary text-white rounded-md hover:bg-brand-secondary">Enviar Justificación</button>
        </Modal>
    );
}

const AttendancePage: React.FC = () => {
    // Assuming student is in 2nd year for this mock
    const currentYearSubjects = useMemo(() => MOCK_SUBJECTS_BY_YEAR['2do Año'] || [], []);
    const [selectedSubject, setSelectedSubject] = useState('Todas');
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedAbsence, setSelectedAbsence] = useState<Attendance | null>(null);

    const handleOpenModal = (absence: Attendance) => {
        setSelectedAbsence(absence);
        setModalOpen(true);
    };

    const displayedAttendance = useMemo(() => {
        const parseDate = (dateString: string) => {
            const [day, month, year] = dateString.split('/');
            return new Date(`${year}-${month}-${day}`);
        };

        const filtered = MOCK_STUDENT_DATA.attendance.filter(a => {
            if (selectedSubject === 'Todas') {
                return currentYearSubjects.includes(a.subject);
            }
            return a.subject === selectedSubject;
        });
        
        return filtered.sort((a, b) => parseDate(b.date).getTime() - parseDate(a.date).getTime());
    }, [selectedSubject, currentYearSubjects]);
    
    const getStatusChip = (status: Attendance['status']) => {
        const styles: Record<typeof status, string> = {
            presente: 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300',
            ausente: 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300',
            tarde: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300',
            justificado: 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300'
        };
        return <span className={`px-2 py-1 text-xs font-medium rounded-full ${styles[status]}`}>{status}</span>;
    };
    
    return (
        <>
            <Card title="Mi Asistencia">
                 <div className="mb-4">
                    <label htmlFor="subject-filter-attendance" className="block text-sm font-medium text-text-primary">Filtrar por materia del año en curso</label>
                    <select 
                        id="subject-filter-attendance" 
                        value={selectedSubject} 
                        onChange={e => setSelectedSubject(e.target.value)}
                        className="w-full max-w-xs mt-1 p-2 bg-bg-secondary border border-app-border rounded-md focus:ring-brand-primary focus:border-brand-primary">
                        <option value="Todas">Todas las materias</option>
                        {currentYearSubjects.map(subject => <option key={subject} value={subject}>{subject}</option>)}
                    </select>
                </div>
                <div className="divide-y border-app-border">
                    {displayedAttendance.length > 0 ? displayedAttendance.map(a => (
                        <div key={a.id} className="flex flex-wrap justify-between items-center p-3">
                            <div>
                                <p className="font-semibold">{a.date}</p>
                                <p className="text-sm text-text-secondary">{a.subject}</p>
                            </div>
                            <div className="flex items-center gap-4 mt-2 sm:mt-0">
                                {getStatusChip(a.status)}
                                {a.status === 'ausente' && (
                                    <button onClick={() => handleOpenModal(a)} className="text-sm text-brand-primary hover:underline flex-shrink-0">Justificar</button>
                                )}
                            </div>
                        </div>
                    )) : (
                        <p className="text-center text-text-secondary py-6">No hay registros de asistencia para la materia seleccionada.</p>
                    )}
                </div>
            </Card>
            <JustificationModal isOpen={modalOpen} onClose={() => setModalOpen(false)} absence={selectedAbsence} />
        </>
    );
};

const MessagesPage: React.FC<{ currentUser: User }> = ({ currentUser }) => {
    const [conversations, setConversations] = useState<Conversation[]>(() =>
        MOCK_CONVERSATIONS.filter(convo => convo.participants[currentUser.id])
    );
    const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<'inbox' | 'contacts'>('inbox');
    const [newMessage, setNewMessage] = useState('');

    // --- NEW STATE FOR FILTERS ---
    const [contactFilterType, setContactFilterType] = useState<'alumnos' | 'profesores' | 'preceptoría'>('alumnos');
    const [studentContactTab, setStudentContactTab] = useState<'compañeros' | 'profesores' | 'preceptoría'>('compañeros');


    const careers = useMemo(() => MOCK_CAREERS.map(c => c.name), []);
    const [selectedCareer, setSelectedCareer] = useState<string>(careers[1] || careers[0] || ''); // Default to 2nd to match image
    
    const availableYears = useMemo(() => {
        const career = MOCK_CAREERS.find(c => c.name === selectedCareer);
        return career ? Object.keys(career.years) : [];
    }, [selectedCareer]);
    
    const [selectedYear, setSelectedYear] = useState<string>('2do Año'); // Default to match image

    useEffect(() => {
        if (availableYears.length > 0 && !availableYears.includes(selectedYear)) {
            setSelectedYear(availableYears[0]);
        }
    }, [selectedCareer, availableYears, selectedYear]);
    // --- END NEW STATE ---

    const allUsers = useMemo(() => [...MOCK_USERS.alumno, ...MOCK_USERS.profesor, ...MOCK_USERS.preceptor], []);
    
    const contacts = useMemo(() => {
        const allOtherUsers = allUsers.filter(u => u.id !== currentUser.id);

        if (currentUser.role === 'alumno') {
            if (studentContactTab === 'compañeros') {
                return allOtherUsers.filter(u => u.role === 'alumno');
            }
            if (studentContactTab === 'profesores') {
                return allOtherUsers.filter(u => u.role === 'profesor');
            }
            // 'preceptoría' tab
            return allOtherUsers.filter(u => u.role === 'preceptor');
        }
        
        if (currentUser.role === 'profesor' || currentUser.role === 'preceptor') {
            if (contactFilterType === 'alumnos') {
                // NOTE: In a real app, you would filter by career and year here.
                return allOtherUsers.filter(u => u.role === 'alumno');
            }
            if (contactFilterType === 'profesores') {
                return allOtherUsers.filter(u => u.role === 'profesor' && u.id !== currentUser.id);
            }
            // 'preceptoría' for professor
            return allOtherUsers.filter(u => u.role === 'preceptor');
        }

        return allOtherUsers;
    }, [allUsers, currentUser, studentContactTab, contactFilterType, selectedCareer, selectedYear]);
    
    const selectedConversation = useMemo(() => conversations.find(c => c.id === selectedConversationId), [conversations, selectedConversationId]);

    const getParticipantNames = (convo: Conversation) => {
        if (convo.groupName) {
            return convo.groupName;
        }
        const otherId = Object.keys(convo.participants).find(id => id !== currentUser.id);
        return otherId ? convo.participants[otherId] : 'Desconocido';
    };

    const handleSendMessage = () => {
        if (!newMessage.trim() || !selectedConversationId) return;
        const newMessageObj: ChatMessage = {
            id: `msg-${Date.now()}`,
            senderId: currentUser.id,
            text: newMessage.trim(),
            timestamp: new Date().toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })
        };

        setConversations(prev => prev.map(convo => 
            convo.id === selectedConversationId 
            ? { ...convo, messages: [...convo.messages, newMessageObj] } 
            : convo
        ));
        setNewMessage('');
    };
    
    useEffect(() => {
        if (window.innerWidth >= 768 && !selectedConversationId && conversations.length > 0) {
            setSelectedConversationId(conversations[0].id);
        }
        if (window.innerWidth < 768) {
            setSelectedConversationId(null);
        }
    }, [conversations]);

    return (
        <div className="flex flex-col md:flex-row h-full gap-4">
            {/* Left Panel: Inbox/Contacts List */}
            <div className={`w-full md:w-1/3 lg:w-1/4 ${selectedConversationId ? 'hidden md:block' : 'block'}`}>
                <Card className="h-full">
                    <div className="border-b border-app-border mb-2">
                        <nav className="flex -mb-px">
                            <button onClick={() => setActiveTab('inbox')} className={`w-1/2 py-3 text-sm font-medium text-center border-b-2 ${activeTab === 'inbox' ? 'border-brand-primary text-brand-primary' : 'border-transparent text-text-secondary hover:text-text-primary'}`}>Bandeja de Entrada</button>
                            <button onClick={() => setActiveTab('contacts')} className={`w-1/2 py-3 text-sm font-medium text-center border-b-2 ${activeTab === 'contacts' ? 'border-brand-primary text-brand-primary' : 'border-transparent text-text-secondary hover:text-text-primary'}`}>Contactos</button>
                        </nav>
                    </div>
                    {activeTab === 'inbox' ? (
                        <ul className="space-y-2">
                            {conversations.map(convo => (
                                <li key={convo.id} onClick={() => setSelectedConversationId(convo.id)}
                                    className={`p-3 rounded-md cursor-pointer transition-colors ${selectedConversationId === convo.id ? 'bg-brand-primary text-white' : 'hover:bg-bg-tertiary'}`}>
                                    <p className="font-semibold">{getParticipantNames(convo)}</p>
                                    <p className={`text-sm truncate ${selectedConversationId === convo.id ? 'text-gray-200' : 'text-text-secondary'}`}>{convo.lastMessageSnippet}</p>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <>
                            {currentUser.role === 'alumno' && (
                                <div className="flex bg-bg-secondary p-1 rounded-md mb-3">
                                    <button onClick={() => setStudentContactTab('compañeros')} className={`w-1/3 text-center py-1 rounded text-sm font-medium ${studentContactTab === 'compañeros' ? 'bg-card-bg shadow text-brand-primary' : 'text-text-secondary'}`}>Compañeros</button>
                                    <button onClick={() => setStudentContactTab('profesores')} className={`w-1/3 text-center py-1 rounded text-sm font-medium ${studentContactTab === 'profesores' ? 'bg-card-bg shadow text-brand-primary' : 'text-text-secondary'}`}>Profesores</button>
                                    <button onClick={() => setStudentContactTab('preceptoría')} className={`w-1/3 text-center py-1 rounded text-sm font-medium ${studentContactTab === 'preceptoría' ? 'bg-card-bg shadow text-brand-primary' : 'text-text-secondary'}`}>Preceptoría</button>
                                </div>
                            )}
                             {currentUser.role === 'profesor' && (
                                <div className="space-y-3 mb-4">
                                    <div className="flex bg-bg-secondary p-1 rounded-md">
                                        <button onClick={() => setContactFilterType('alumnos')} className={`w-1/3 text-center py-1 rounded text-sm font-medium ${contactFilterType === 'alumnos' ? 'bg-card-bg shadow text-brand-primary' : 'text-text-secondary'}`}>Alumnos</button>
                                        <button onClick={() => setContactFilterType('profesores')} className={`w-1/3 text-center py-1 rounded text-sm font-medium ${contactFilterType === 'profesores' ? 'bg-card-bg shadow text-brand-primary' : 'text-text-secondary'}`}>Profesores</button>
                                        <button onClick={() => setContactFilterType('preceptoría')} className={`w-1/3 text-center py-1 rounded text-sm font-medium ${contactFilterType === 'preceptoría' ? 'bg-card-bg shadow text-brand-primary' : 'text-text-secondary'}`}>Preceptoría</button>
                                    </div>
                                    {contactFilterType === 'alumnos' && (
                                        <>
                                            <select value={selectedCareer} onChange={e => setSelectedCareer(e.target.value)} className="w-full p-2 bg-bg-secondary border border-app-border rounded-md text-sm">
                                                {careers.map(c => <option key={c} value={c}>{c}</option>)}
                                            </select>
                                            <select value={selectedYear} onChange={e => setSelectedYear(e.target.value)} className="w-full p-2 bg-bg-secondary border border-app-border rounded-md text-sm" disabled={availableYears.length === 0}>
                                                {availableYears.map(y => <option key={y} value={y}>{y}</option>)}
                                            </select>
                                        </>
                                    )}
                                </div>
                            )}
                            {currentUser.role === 'preceptor' && (
                                <div className="space-y-3 mb-4">
                                    <div className="flex bg-bg-secondary p-1 rounded-md">
                                        <button onClick={() => setContactFilterType('alumnos')} className={`w-1/2 text-center py-1 rounded text-sm font-medium ${contactFilterType === 'alumnos' ? 'bg-card-bg shadow text-brand-primary' : 'text-text-secondary'}`}>Alumnos</button>
                                        <button onClick={() => setContactFilterType('profesores')} className={`w-1/2 text-center py-1 rounded text-sm font-medium ${contactFilterType === 'profesores' ? 'bg-card-bg shadow text-brand-primary' : 'text-text-secondary'}`}>Profesores</button>
                                    </div>
                                    {contactFilterType === 'alumnos' && (
                                        <>
                                            <select value={selectedCareer} onChange={e => setSelectedCareer(e.target.value)} className="w-full p-2 bg-bg-secondary border border-app-border rounded-md text-sm">
                                                {careers.map(c => <option key={c} value={c}>{c}</option>)}
                                            </select>
                                            <select value={selectedYear} onChange={e => setSelectedYear(e.target.value)} className="w-full p-2 bg-bg-secondary border border-app-border rounded-md text-sm" disabled={availableYears.length === 0}>
                                                {availableYears.map(y => <option key={y} value={y}>{y}</option>)}
                                            </select>
                                        </>
                                    )}
                                </div>
                            )}
                            <ul className="space-y-2">
                                {contacts.map(contact => (
                                    <li key={contact.id} className="p-3 rounded-md cursor-pointer hover:bg-bg-tertiary flex items-center space-x-3">
                                        <img src={contact.avatarUrl || `https://ui-avatars.com/api/?name=${contact.name.replace(' ', '+')}&background=4f46e5&color=fff&size=40`} alt={contact.name} className="w-10 h-10 rounded-full" />
                                        <div>
                                            <p className="font-semibold">{contact.name}</p>
                                            <p className="text-sm text-text-secondary capitalize">{contact.role}</p>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </>
                    )}
                </Card>
            </div>
            
            {/* Right Panel: Chat View */}
            <div className={`flex-1 ${selectedConversationId ? 'block' : 'hidden md:flex'}`}>
                <Card className="h-full flex flex-col">
                    {selectedConversation ? (
                        <>
                            <div className="border-b border-app-border pb-3 mb-4 flex items-center gap-3">
                                <button onClick={() => setSelectedConversationId(null)} className="md:hidden p-1 rounded-full hover:bg-bg-tertiary">
                                    <ArrowLeftIcon className="w-5 h-5" />
                                </button>
                               <h3 className="font-semibold text-lg">{getParticipantNames(selectedConversation)}</h3>
                            </div>
                            <div className="flex-grow overflow-y-auto mb-4 p-2 space-y-4">
                               {selectedConversation.messages.map(msg => (
                                   <div key={msg.id} className={`flex items-end gap-2 ${msg.senderId === currentUser.id ? 'justify-end' : 'justify-start'}`}>
                                        {msg.senderId !== currentUser.id && (
                                            <img src={allUsers.find(u => u.id === msg.senderId)?.avatarUrl || `https://ui-avatars.com/api/?name=${selectedConversation.participants[msg.senderId]?.replace(' ', '+')}&background=6366f1&color=fff&size=32`} alt="avatar" className="w-8 h-8 rounded-full"/>
                                        )}
                                        <div className={`max-w-xs md:max-w-md p-3 rounded-xl ${msg.senderId === currentUser.id ? 'bg-brand-primary text-white rounded-br-none' : 'bg-bg-secondary text-text-primary rounded-bl-none'}`}>
                                            <p className="text-sm">{msg.text}</p>
                                            <p className={`text-xs mt-1 ${msg.senderId === currentUser.id ? 'text-gray-200' : 'text-text-secondary'}`}>{msg.timestamp}</p>
                                        </div>
                                   </div>
                               ))}
                            </div>
                            <div className="mt-auto flex gap-2">
                                <input type="text" value={newMessage} onChange={(e) => setNewMessage(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                                    className="flex-1 p-2 border rounded-md bg-transparent border-app-border focus:ring-brand-primary focus:border-brand-primary" placeholder="Escribe tu respuesta..." />
                                <button onClick={handleSendMessage} className="px-4 py-2 bg-brand-primary text-white rounded-md hover:bg-brand-secondary">Enviar</button>
                            </div>
                        </>
                    ) : (
                        <div className="hidden md:flex items-center justify-center h-full">
                            <p className="text-text-secondary">Selecciona una conversación o un contacto para empezar a chatear.</p>
                        </div>
                    )}
                </Card>
            </div>
        </div>
    );
};

const NewPostModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    onAddPost: (post: Omit<ForumPost, 'id' | 'replies' | 'lastActivity' | 'author'>) => void;
    categories: string[];
}> = ({ isOpen, onClose, onAddPost, categories }) => {
    const [title, setTitle] = useState('');
    const [category, setCategory] = useState(categories.find(c => c !== 'Todas') || '');
    const [content, setContent] = useState('');

    const handleSubmit = () => {
        if (!title.trim() || !category.trim() || !content.trim()) {
            alert('Por favor, completa todos los campos.');
            return;
        }
        onAddPost({ title, category, content });
        onClose();
        setTitle('');
        setCategory(categories.find(c => c !== 'Todas') || '');
        setContent('');
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Crear Nueva Publicación">
            <div className="space-y-4">
                <div>
                    <label htmlFor="post-title" className="block text-sm font-medium text-text-primary">Título de la duda</label>
                    <input id="post-title" type="text" value={title} onChange={(e) => setTitle(e.target.value)}
                        className="w-full p-2 mt-1 bg-transparent border rounded-md border-app-border focus:ring-brand-primary focus:border-brand-primary" />
                </div>
                 <div>
                    <label htmlFor="post-category" className="block text-sm font-medium text-text-primary">Materia</label>
                    <select id="post-category" value={category} onChange={(e) => setCategory(e.target.value)}
                        className="w-full p-2 mt-1 bg-bg-secondary border rounded-md border-app-border focus:ring-brand-primary focus:border-brand-primary">
                        {categories.filter(c => c !== 'Todas').map(c => <option key={c} value={c} className="bg-card-bg">{c}</option>)}
                    </select>
                </div>
                <div>
                    <label htmlFor="post-content" className="block text-sm font-medium text-text-primary">Descripción</label>
                     <textarea id="post-content" value={content} onChange={(e) => setContent(e.target.value)} rows={5}
                        className="w-full p-2 mt-1 bg-transparent border rounded-md border-app-border focus:ring-brand-primary focus:border-brand-primary"
                        placeholder="Describe tu duda o consulta..."></textarea>
                </div>
                <button onClick={handleSubmit} className="w-full mt-4 px-4 py-2 bg-brand-primary text-white rounded-md hover:bg-brand-secondary">Publicar</button>
            </div>
        </Modal>
    );
};


const ForumPage: React.FC<{ currentUser: User; initialPosts: ForumPost[] }> = ({ currentUser, initialPosts }) => {
    const [posts, setPosts] = useState(initialPosts);
    const [selectedPostId, setSelectedPostId] = useState<string | null>(window.innerWidth >= 768 ? initialPosts[0]?.id || null : null);
    const [selectedCategory, setSelectedCategory] = useState<string>('Todas');
    const [isNewPostModalOpen, setNewPostModalOpen] = useState(false);
    const [newReply, setNewReply] = useState('');

    const filteredPosts = useMemo(() => {
        if (selectedCategory === 'Todas') return posts;
        return posts.filter(p => p.category === selectedCategory);
    }, [selectedCategory, posts]);

    useEffect(() => {
        if (window.innerWidth >= 768) {
            const currentPostInFiltered = filteredPosts.find(p => p.id === selectedPostId);
            if (!currentPostInFiltered && filteredPosts.length > 0) {
                setSelectedPostId(filteredPosts[0].id);
            } else if (filteredPosts.length === 0) {
                setSelectedPostId(null);
            }
        }
    }, [filteredPosts, selectedPostId]);

    const selectedPost = useMemo(() => posts.find(p => p.id === selectedPostId), [selectedPostId, posts]);
    const categories = useMemo(() => ['Todas', ...Array.from(new Set(posts.map(p => p.category)))], [posts]);

    const handleAddNewPost = (newPostData: Omit<ForumPost, 'id' | 'replies' | 'lastActivity' | 'author'>) => {
        const newPost: ForumPost = {
            ...newPostData,
            id: `fp-${Date.now()}`,
            author: currentUser.name,
            replies: [],
            lastActivity: 'ahora mismo',
        };
        setPosts(prev => [newPost, ...prev]);
        setSelectedPostId(newPost.id); // Select the new post automatically
    };

    const handleAddReply = () => {
        if (!newReply.trim() || !selectedPostId) return;
        const reply = {
            id: `r-${Date.now()}`,
            author: currentUser.name,
            content: newReply.trim(),
        };
        setPosts(prevPosts => prevPosts.map(post => 
            post.id === selectedPostId
                ? { ...post, replies: [...post.replies, reply], lastActivity: 'ahora mismo' }
                : post
        ));
        setNewReply('');
    };

    return(
        <>
        <div className="flex flex-col md:flex-row h-full gap-4">
            <div className={`w-full md:w-1/3 lg:w-1/4 ${selectedPostId && window.innerWidth < 768 ? 'hidden' : 'block'}`}>
                 <Card>
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-semibold text-text-primary">Foros</h3>
                        <button onClick={() => setNewPostModalOpen(true)} title="Crear Nueva Publicación" className="p-2 rounded-full hover:bg-bg-tertiary">
                             <PencilSquareIcon className="w-5 h-5 text-brand-primary"/>
                        </button>
                    </div>

                    <div className="mb-4">
                        <select onChange={(e) => setSelectedCategory(e.target.value)} value={selectedCategory} className="w-full p-2 bg-bg-secondary border rounded-md border-app-border focus:ring-brand-primary focus:border-brand-primary">
                            {categories.map(c => <option key={c} value={c} className="bg-card-bg">{c}</option>)}
                        </select>
                    </div>
                    <ul className="space-y-2">
                        {filteredPosts.map(post => (
                            <li key={post.id} onClick={() => setSelectedPostId(post.id)}
                                className={`p-3 rounded-md cursor-pointer transition-colors ${selectedPostId === post.id ? 'bg-brand-primary text-white' : 'hover:bg-bg-tertiary'}`}>
                                <p className="font-semibold">{post.title}</p>
                                <p className={`text-xs ${selectedPostId === post.id ? 'text-gray-200' : 'text-text-secondary'}`}>por {post.author} - {post.replies.length} respuestas</p>
                            </li>
                        ))}
                    </ul>
                </Card>
            </div>
            <div className={`flex-1 ${selectedPostId ? 'flex flex-col' : 'hidden md:flex'}`}>
                 <Card className="h-full flex flex-col">
                    {selectedPost ? (
                       <>
                            <div className="border-b border-app-border pb-4 mb-4">
                                <button onClick={() => setSelectedPostId(null)} className="md:hidden flex items-center gap-2 mb-4 text-sm font-semibold text-text-secondary hover:text-brand-primary">
                                    <ArrowLeftIcon className="w-4 h-4"/>
                                    Volver a los temas
                                </button>
                               <h3 className="text-xl font-bold mb-2">{selectedPost.title}</h3>
                               <p className="text-sm text-text-secondary">Publicado por: {selectedPost.author}</p>
                               <p className="mt-2 prose prose-sm dark:prose-invert max-w-none">{selectedPost.content}</p>
                            </div>
                            <div className="flex-grow overflow-y-auto mb-4 space-y-4">
                                <h4 className="font-semibold">Respuestas</h4>
                                {selectedPost.replies.length > 0 ? selectedPost.replies.map(reply => (
                                    <div key={reply.id} className="p-3 bg-bg-primary rounded-md">
                                        <p className="font-semibold text-sm">{reply.author}</p>
                                        <p className="text-text-primary">{reply.content}</p>
                                    </div>
                                )) : <p className="text-sm text-text-secondary">No hay respuestas todavía.</p>}
                            </div>
                            <div className="mt-auto">
                                <textarea value={newReply} onChange={(e) => setNewReply(e.target.value)} className="w-full p-2 border rounded-md bg-transparent border-app-border focus:ring-brand-primary focus:border-brand-primary" rows={3} placeholder="Escribe tu respuesta..."></textarea>
                                <button onClick={handleAddReply} className="w-full sm:w-auto mt-2 px-4 py-2 bg-brand-primary text-white rounded-md hover:bg-brand-secondary">Responder</button>
                            </div>
                       </>
                    ) : (
                        <div className="flex items-center justify-center h-full">
                             <p className="text-text-secondary">Selecciona un tema para participar.</p>
                        </div>
                    )}
                </Card>
            </div>
        </div>
        <NewPostModal 
            isOpen={isNewPostModalOpen}
            onClose={() => setNewPostModalOpen(false)}
            onAddPost={handleAddNewPost}
            categories={categories}
        />
        </>
    );
};

const ProfilePage: React.FC<{user: User; onUpdate: (user: User) => void; onBack: () => void;}> = ({ user, onUpdate, onBack }) => {
    const [name, setName] = useState(user.name);
    const [email, setEmail] = useState(user.email);
    const [about, setAbout] = useState(user.about || '');

    const handleSave = () => {
        onUpdate({ ...user, name, email, about });
        alert('Perfil actualizado!');
    };
    
    const ReadOnlyField: React.FC<{label: string; value: string | undefined}> = ({ label, value }) => (
        <div>
            <label className="block text-sm font-medium text-text-primary">{label}</label>
            <div className="w-full p-2 mt-1 bg-bg-secondary border rounded-md border-app-border text-text-secondary">
                {value || 'No disponible'}
            </div>
        </div>
    );

    return (
        <div className="max-w-4xl mx-auto">
            <div className="mb-6">
                <button onClick={onBack} className="flex items-center gap-2 text-sm font-semibold text-text-secondary hover:text-brand-primary transition-colors">
                    <ArrowLeftIcon className="w-5 h-5" />
                    Volver al Panel
                </button>
            </div>
            <Card title="Mi Perfil">
                <div className="flex flex-col md:flex-row md:items-start gap-6 md:gap-10">
                    <div className="flex flex-col items-center flex-shrink-0 w-full md:w-48">
                        <img src={user.avatarUrl || `https://ui-avatars.com/api/?name=${user.name.replace(' ', '+')}&background=4f46e5&color=fff&size=128`} alt="Avatar" className="w-32 h-32 rounded-full mb-4 ring-4 ring-brand-primary/20" />
                        <button className="text-sm text-brand-primary hover:underline">Cambiar foto</button>
                    </div>
                    <div className="w-full flex-1 space-y-4">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-text-primary">Nombre Completo</label>
                            <input id="name" type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full p-2 mt-1 bg-transparent border rounded-md border-app-border focus:ring-brand-primary focus:border-brand-primary" />
                        </div>
                        
                        <ReadOnlyField label="DNI" value={user.dni} />
                        <ReadOnlyField label="Legajo" value={user.legajo} />

                        {user.role === 'alumno' && user.career && (
                           <ReadOnlyField label="Carrera" value={user.career} />
                        )}

                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-text-primary">Correo Electrónico</label>
                            <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full p-2 mt-1 bg-transparent border rounded-md border-app-border focus:ring-brand-primary focus:border-brand-primary" />
                        </div>
                         <div>
                            <label htmlFor="about" className="block text-sm font-medium text-text-primary">Sobre mí</label>
                            <textarea id="about" value={about} onChange={(e) => setAbout(e.target.value)} rows={3} className="w-full p-2 mt-1 bg-transparent border rounded-md border-app-border focus:ring-brand-primary focus:border-brand-primary" placeholder="Cuéntanos algo sobre ti..."></textarea>
                        </div>
                        <div className="mt-6 flex flex-col sm:flex-row justify-end gap-3 pt-4 border-t border-app-border">
                            <button onClick={() => alert('Funcionalidad no implementada.')} className="px-4 py-2 bg-bg-tertiary text-text-primary rounded-md hover:bg-app-border">Cambiar Contraseña</button>
                            <button onClick={handleSave} className="px-4 py-2 bg-brand-primary text-white rounded-md hover:bg-brand-secondary">Guardar Cambios</button>
                        </div>
                    </div>
                </div>
            </Card>
        </div>
    );
};

const AddEventModal: React.FC<{ isOpen: boolean; onClose: () => void; onAddEvent: (event: Omit<CalendarEvent, 'id' | 'description' | 'isPublic' | 'ownerId'>) => void; }> = ({ isOpen, onClose, onAddEvent }) => {
    const [title, setTitle] = useState('');
    const [day, setDay] = useState<number>(new Date().getDate());
    const [color, setColor] = useState('accent-blue');
    
    const colorOptions = [
        { name: 'accent-blue', class: 'bg-accent-blue' },
        { name: 'accent-green', class: 'bg-accent-green' },
        { name: 'accent-purple', class: 'bg-accent-purple' },
        { name: 'accent-red', class: 'bg-accent-red' },
        { name: 'accent-yellow', class: 'bg-accent-yellow' },
    ];

    const handleSubmit = () => {
        if (!title.trim() || !day) return;
        onAddEvent({ title, day: Number(day), color });
        onClose();
        setTitle('');
        setDay(new Date().getDate());
        setColor('accent-blue');
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Añadir Evento a la Agenda">
            <div className="space-y-4">
                <div>
                    <label htmlFor="event-title" className="block text-sm font-medium text-text-primary">Título del Evento</label>
                    <input id="event-title" type="text" value={title} onChange={(e) => setTitle(e.target.value)}
                        className="w-full p-2 mt-1 bg-transparent border rounded-md border-app-border focus:ring-brand-primary focus:border-brand-primary" />
                </div>
                <div>
                    <label htmlFor="event-day" className="block text-sm font-medium text-text-primary">Día del Mes</label>
                    <input id="event-day" type="number" value={day} onChange={(e) => setDay(parseInt(e.target.value, 10))} min="1" max="31"
                        className="w-full p-2 mt-1 bg-transparent border rounded-md border-app-border focus:ring-brand-primary focus:border-brand-primary" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-text-primary">Color</label>
                    <div className="flex space-x-2 mt-2">
                        {colorOptions.map(opt => (
                            <button key={opt.name} onClick={() => setColor(opt.name)}
                                className={`w-8 h-8 rounded-full transition-transform transform hover:scale-110 ${opt.class} ${color === opt.name ? 'ring-2 ring-offset-2 ring-brand-primary ring-offset-card-bg' : ''}`}>
                            </button>
                        ))}
                    </div>
                </div>
                <button onClick={handleSubmit} className="w-full mt-4 px-4 py-2 bg-brand-primary text-white rounded-md hover:bg-brand-secondary">Añadir Evento</button>
            </div>
        </Modal>
    );
};

const CalendarPage: React.FC<{ events: CalendarEvent[]; onAddEventClick: () => void; }> = ({ events, onAddEventClick }) => {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const getEventsForDay = (day: number) => events.filter(e => e.day === day);
    
    const colorClasses: Record<string, string> = {
        'accent-blue': 'bg-accent-blue', 'accent-purple': 'bg-accent-purple', 'accent-yellow': 'bg-accent-yellow', 'accent-red': 'bg-accent-red', 'accent-green': 'bg-accent-green',
    };

    return (
        <div className="space-y-6">
            <Card>
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-text-primary">Mi Agenda</h3>
                    <button onClick={onAddEventClick} className="flex items-center gap-2 px-3 py-1.5 bg-brand-primary text-white rounded-md text-sm hover:bg-brand-secondary transition-colors">
                        <PlusCircleIcon className="w-5 h-5" />
                        Añadir
                    </button>
                </div>
                <div className="grid grid-cols-7 gap-1 text-center text-xs sm:text-sm">
                    {['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sá'].map(day => (
                        <div key={day} className="font-semibold p-2 text-text-secondary">{day}</div>
                    ))}
                    {Array.from({ length: firstDayOfMonth }).map((_, i) => <div key={`empty-${i}`}></div>)}
                    {Array.from({ length: daysInMonth }).map((_, dayIndex) => {
                        const day = dayIndex + 1;
                        const dayEvents = getEventsForDay(day);
                        return (
                            <div key={day} className={`p-1 sm:p-2 border border-app-border rounded-md min-h-[70px] sm:min-h-[90px] flex flex-col ${day === today.getDate() && month === today.getMonth() ? 'bg-brand-primary/10 border-brand-primary' : ''}`}>
                                <span className="font-medium">{day}</span>
                                <div className="mt-1 space-y-1 overflow-hidden">
                                    {dayEvents.map(event => (
                                        <div key={event.id} title={event.title} className={`${colorClasses[event.color || 'accent-blue']} text-white text-[10px] sm:text-xs rounded px-1 py-0.5 truncate`}>
                                            {event.title}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </Card>
            <Card title="Próximos Eventos">
                <div className="flex justify-between items-center mb-4">
                    <h4 className="text-base font-semibold">Lista de Eventos del Mes</h4>
                </div>
                <ul className="space-y-2">
                    {events.length > 0 ? events.sort((a,b) => a.day - b.day).map(event => (
                        <li key={event.id} className="p-3 bg-bg-primary rounded-md flex items-center">
                            <span className={`w-3 h-3 rounded-full mr-3 flex-shrink-0 ${colorClasses[event.color || 'accent-blue']}`}></span>
                            <div>
                                <p className="font-semibold">{event.title}</p>
                                <p className="text-sm text-text-secondary">Fecha: {event.day}/{month + 1}</p>
                            </div>
                        </li>
                    )) : <p className="text-text-secondary text-sm py-4 text-center">No tienes eventos este mes. ¡Añade uno!</p>}
                </ul>
            </Card>
        </div>
    );
};

const ProceduresPage: React.FC<{ onRequest: (type: ProcedureRequest['type']) => void, navigate: (page: Page) => void }> = ({ onRequest, navigate }) => {
    
    const procedures = [
        { 
            title: 'Constancia de Alumno Regular', 
            description: 'Genera un certificado oficial que acredita tu condición de alumno regular en la institución.', 
            icon: <DocumentTextIcon className="w-12 h-12 text-emerald-400" />,
            type: 'Constancia de Aluno Regular' as ProcedureRequest['type']
        },
        { 
            title: 'Solicitud de Mesa Especial', 
            description: 'Pide una fecha de examen final extraordinaria si cumples con los requisitos académicos.', 
            icon: <CalendarDaysIcon className="w-12 h-12 text-emerald-400" />,
            type: 'Solicitud de Mesa Especial' as ProcedureRequest['type']
        },
        { 
            title: 'Baja de Materia', 
            description: 'Date de baja de una materia en la que te hayas inscripto durante el período habilitado.', 
            icon: <PencilSquareIcon className="w-12 h-12 text-emerald-400" />,
            type: 'Baja de Materia' as ProcedureRequest['type']
        },
        { 
            title: 'Consulta de Legajo', 
            description: 'Accede a tu legajo completo para revisar tu historial y documentación personal.', 
            icon: <DocumentTextIcon className="w-12 h-12 text-emerald-400" />,
            type: 'Consulta de Legajo' as ProcedureRequest['type']
        },
    ];

    return (
        <div className="relative">
             <h1 className="text-2xl font-bold mb-6 text-text-primary">Trámites y Solicitudes</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {procedures.map(proc => (
                    <div key={proc.title} className="bg-card-bg rounded-xl shadow-lg p-6 flex flex-col items-center text-center animate-fade-in">
                        <div className="mb-4">
                            {proc.icon}
                        </div>
                        <h3 className="text-lg font-semibold text-text-primary mb-2">{proc.title}</h3>
                        <p className="text-sm text-text-secondary mb-6 flex-grow">{proc.description}</p>
                        <button 
                            onClick={() => onRequest(proc.type)}
                            className="w-full px-4 py-3 font-semibold text-slate-900 bg-emerald-400 rounded-lg hover:bg-emerald-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-400 focus:ring-offset-card-bg transition-colors duration-300"
                        >
                            Iniciar Trámite
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};


// --- TEACHER/PRECEPTOR COMPONENTS ---
const PageHeader: React.FC<{ title: string; onBack: () => void; children?: React.ReactNode }> = ({ title, onBack, children }) => (
    <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-4">
            <button onClick={onBack} className="p-2 rounded-full hover:bg-bg-tertiary transition-colors">
              <ArrowLeftIcon className="w-6 h-6" />
            </button>
            <h1 className="text-2xl font-bold">{title}</h1>
        </div>
        {children}
    </div>
);

const PendingSubmissionsModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    course: TeacherSummary | null;
    onContactStudent: (student: PendingStudent) => void;
}> = ({ isOpen, onClose, course, onContactStudent }) => {
    if (!isOpen || !course) return null;

    const pendingStudents = MOCK_PENDING_SUBMISSIONS[course.id] || [];

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={`Alumnos Pendientes: ${course.subject}`}>
            <ul className="space-y-3 max-h-80 overflow-y-auto">
                {pendingStudents.length > 0 ? pendingStudents.map(student => (
                    <li key={student.id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-3 bg-bg-primary rounded-md">
                        <span className="font-medium mb-2 sm:mb-0">{student.name}</span>
                        <div className="flex gap-2 flex-shrink-0">
                            <button onClick={() => onContactStudent(student)} className="px-2 py-1 text-xs rounded-full bg-accent-yellow text-white hover:bg-yellow-600">Enviar Notificación</button>
                            <button onClick={() => onContactStudent(student)} className="px-2 py-1 text-xs rounded-full bg-accent-blue text-white hover:bg-blue-700">Enviar Mensaje</button>
                        </div>
                    </li>
                )) : <p className="text-text-secondary text-center py-4">¡Ningún alumno pendiente!</p>}
            </ul>
            <button onClick={onClose} className="w-full mt-6 px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600">Cerrar</button>
        </Modal>
    );
};

const TeacherContactStudentModal: React.FC<{ isOpen: boolean; onClose: () => void; student: PendingStudent | null; }> = ({ isOpen, onClose, student }) => {
    const [contactType, setContactType] = useState<'message' | 'notice'>('message');
    
    const handleSend = () => {
        alert(`Comunicación enviada a ${student?.name}.`);
        onClose();
    };

    if (!student) return null;

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={`Contactar a ${student.name}`}>
            <div className="space-y-4">
                 <div className="border-b border-app-border mb-4">
                    <nav className="flex space-x-2" aria-label="Tabs">
                        <button onClick={() => setContactType('message')} className={`px-3 py-2 font-medium text-sm rounded-t-md ${contactType === 'message' ? 'border-b-2 border-brand-primary text-brand-primary' : 'text-text-secondary'}`}>
                            Enviar Mensaje
                        </button>
                        <button onClick={() => setContactType('notice')} className={`px-3 py-2 font-medium text-sm rounded-t-md ${contactType === 'notice' ? 'border-b-2 border-brand-primary text-brand-primary' : 'text-text-secondary'}`}>
                            Enviar Aviso
                        </button>
                    </nav>
                </div>
                {contactType === 'message' ? (
                    <div>
                        <label htmlFor="student-message" className="block text-sm font-medium text-text-primary">Mensaje Personalizado</label>
                        <textarea id="student-message" rows={5} className="w-full p-2 mt-1 bg-transparent border rounded-md border-app-border" placeholder={`Escribe un mensaje para ${student.name}...`}></textarea>
                    </div>
                ) : (
                    <div>
                         <label htmlFor="student-notice" className="block text-sm font-medium text-text-primary">Plantilla de Aviso</label>
                         <select id="student-notice" className="w-full p-2 mt-1 bg-bg-secondary border rounded-md border-app-border">
                            <option>Recordatorio de entrega pendiente</option>
                            <option>Consulta sobre dificultades con la tarea</option>
                            <option>Solicitud de revisión de la entrega</option>
                        </select>
                        <p className="text-xs text-text-secondary mt-2">Se enviará una notificación con el aviso seleccionado.</p>
                    </div>
                )}
                <button onClick={handleSend} className="w-full mt-4 px-4 py-2 bg-brand-primary text-white rounded-md hover:bg-brand-secondary">Enviar</button>
            </div>
        </Modal>
    );
};

const TeacherDashboard: React.FC<{ user: User; navigate: (page: Page) => void; onShowPending: (summary: TeacherSummary) => void; forumPosts: ForumPost[]; materials: Material[]; events: CalendarEvent[]; }> = ({ user, navigate, onShowPending, forumPosts, materials, events }) => {
    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold">Bienvenido, {user.name}</h2>
                <p className="text-text-secondary">Aquí tienes un resumen de tu actividad para hoy.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card title="Acciones Rápidas">
                    <div className="flex gap-4">
                        <button onClick={() => navigate('asistencia')} className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-brand-primary text-white font-semibold rounded-lg hover:bg-brand-secondary transition-colors">
                            <CheckBadgeIcon className="w-5 h-5" />
                            <span>Tomar Asistencia</span>
                        </button>
                        <button onClick={() => navigate('calificaciones')} className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-accent-purple text-white font-semibold rounded-lg hover:bg-purple-700 transition-colors">
                            <PencilSquareIcon className="w-5 h-5" />
                           <span>Cargar Calificaciones</span>
                        </button>
                    </div>
                </Card>
                 <Card title="Clases de Hoy">
                    {MOCK_TEACHER_SCHEDULE.length > 0 ? (
                        <ul className="space-y-3">
                            {MOCK_TEACHER_SCHEDULE.map(cls => (
                                <li key={cls.id} className="flex justify-between items-center p-2 rounded-md bg-bg-primary">
                                    <div>
                                        <p className="font-semibold">{cls.subject}</p>
                                        <p className="text-sm text-text-secondary">{cls.time}</p>
                                    </div>
                                    {cls.virtualLink ? (
                                        <a href={cls.virtualLink} target="_blank" rel="noopener noreferrer"
                                           className="flex items-center gap-2 px-3 py-1 bg-accent-green text-white font-semibold rounded-lg hover:bg-green-600 transition-colors text-sm">
                                            <VideoCameraIcon className="w-4 h-4" />
                                            Unirse
                                        </a>
                                    ) : (
                                        <span className="font-mono text-sm px-2 py-1 bg-bg-tertiary rounded">Aula {cls.classroom}</span>
                                    )}
                                </li>
                            ))}
                        </ul>
                    ) : <p className="text-center text-text-secondary py-4">No tienes clases programadas para hoy.</p>}
                </Card>
            </div>

            <WeeklyCalendar events={events} />
            
            <div>
                <h3 className="text-xl font-semibold mb-4">Resumen de Cursos</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {MOCK_TEACHER_SUMMARY.map(summary => (
                        <Card key={summary.id}>
                            <h4 className="font-bold text-lg">{summary.subject}</h4>
                            <p className="text-sm text-text-secondary mb-4">Comisión {summary.commission}</p>
                            <div className="flex justify-between items-center border-t pt-3 mt-3 border-app-border">
                                <span className="text-sm">{summary.studentCount} Alumnos</span>
                                <button onClick={() => onShowPending(summary)} className="text-sm font-semibold text-accent-yellow hover:underline">
                                    {summary.pendingSubmissions} Entregas pendientes
                                </button>
                            </div>
                        </Card>
                    ))}
                </div>
            </div>

            <Card title="Material de Estudio">
                <ul className="space-y-3 mb-4 max-h-48 overflow-y-auto">
                    {materials.slice(0, 4).map(m => (
                        <li key={m.id} className="p-2 bg-bg-primary rounded-md flex justify-between items-center">
                            <div>
                                <p className="font-semibold text-sm">{m.title}</p>
                                <p className="text-xs text-text-secondary">{m.subject}</p>
                            </div>
                            <span className="text-xs font-mono px-2 py-1 bg-bg-tertiary rounded flex-shrink-0">{m.fileType}</span>
                        </li>
                    ))}
                    {materials.length === 0 && <p className="text-center text-sm text-text-secondary py-4">No hay materiales subidos.</p>}
                </ul>
                <button
                    onClick={() => navigate('materiales')}
                    className="w-full px-4 py-2 font-semibold text-white bg-brand-primary rounded-md hover:bg-brand-secondary"
                >
                    Gestionar Materiales
                </button>
            </Card>
        </div>
    );
};

const TeacherGradesPage: React.FC<{ onBack: () => void }> = ({ onBack }) => {
    const subjects = Object.keys(MOCK_COURSE_GRADES);
    const [selectedSubject, setSelectedSubject] = useState<string>(subjects[0]);
    const [grades, setGrades] = useState<StudentGradeRecord[]>(MOCK_COURSE_GRADES[subjects[0]]);
    const [isSaving, setIsSaving] = useState(false);
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);

    useEffect(() => {
        setGrades(MOCK_COURSE_GRADES[selectedSubject]);
        setShowSuccessMessage(false); // Reset success state when subject changes
    }, [selectedSubject]);

    const handleGradeChange = (studentId: string, semester: 'semester1' | 'semester2', value: string) => {
        const numericValue = value === '' ? null : Number(value);
        if (numericValue !== null && (isNaN(numericValue) || numericValue < 0 || numericValue > 10)) {
            return;
        }
        setGrades(prevGrades =>
            prevGrades.map(student =>
                student.id === studentId ? { ...student, [semester]: numericValue } : student
            )
        );
    };
    
    const handleSaveChanges = () => {
        setIsSaving(true);
        setShowSuccessMessage(false);

        setTimeout(() => {
            setIsSaving(false);
            setShowSuccessMessage(true);
            
            setTimeout(() => {
                setShowSuccessMessage(false);
            }, 5000);
        }, 1500);
    };

    return (
        <div>
            <PageHeader title="Cargar Notas" onBack={onBack} />
            <Card>
                <div className="mb-6">
                    <label htmlFor="subject-select" className="block text-sm font-medium text-text-primary mb-2">Seleccione una Materia</label>
                    <select id="subject-select" value={selectedSubject} onChange={(e) => setSelectedSubject(e.target.value)}
                        className="w-full max-w-sm p-2 bg-bg-secondary border border-app-border rounded-md focus:ring-brand-primary focus:border-brand-primary">
                        {subjects.map(subject => <option key={subject} value={subject}>{subject}</option>)}
                    </select>
                </div>
                
                <div className="overflow-x-auto">
                     {/* Desktop Table */}
                     <table className="w-full text-left hidden md:table">
                        <thead className="border-b border-app-border bg-bg-secondary">
                            <tr>
                                <th className="p-3 text-sm font-semibold uppercase">Alumno</th>
                                <th className="p-3 text-center text-sm font-semibold uppercase">1er Cuat.</th>
                                <th className="p-3 text-center text-sm font-semibold uppercase">2do Cuat.</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y border-app-border">
                            {grades.map(student => (
                                <tr key={student.id}>
                                    <td className="p-3">{student.name}</td>
                                    <td className="p-3 text-center">
                                        <input type="number" min="0" max="10"
                                            value={student.semester1 ?? ''}
                                            onChange={(e) => handleGradeChange(student.id, 'semester1', e.target.value)}
                                            className="w-16 p-2 text-center bg-bg-primary border border-app-border rounded-md"
                                        />
                                    </td>
                                    <td className="p-3 text-center">
                                         <input type="number" min="0" max="10"
                                            value={student.semester2 ?? ''}
                                            onChange={(e) => handleGradeChange(student.id, 'semester2', e.target.value)}
                                            className="w-16 p-2 text-center bg-bg-primary border border-app-border rounded-md"
                                        />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {/* Mobile Card List */}
                    <div className="space-y-3 md:hidden">
                        {grades.map(student => (
                            <div key={student.id} className="p-4 bg-bg-primary rounded-lg">
                                <p className="font-semibold mb-3">{student.name}</p>
                                <div className="flex items-center justify-between mb-2">
                                    <label htmlFor={`s1-${student.id}`} className="text-sm text-text-secondary">1er Cuatrimestre</label>
                                    <input id={`s1-${student.id}`} type="number" min="0" max="10"
                                        value={student.semester1 ?? ''}
                                        onChange={(e) => handleGradeChange(student.id, 'semester1', e.target.value)}
                                        className="w-20 p-2 text-center bg-card-bg border border-app-border rounded-md"
                                    />
                                </div>
                                <div className="flex items-center justify-between">
                                    <label htmlFor={`s2-${student.id}`} className="text-sm text-text-secondary">2do Cuatrimestre</label>
                                    <input id={`s2-${student.id}`} type="number" min="0" max="10"
                                        value={student.semester2 ?? ''}
                                        onChange={(e) => handleGradeChange(student.id, 'semester2', e.target.value)}
                                        className="w-20 p-2 text-center bg-card-bg border border-app-border rounded-md"
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="flex justify-end mt-6 items-center gap-4">
                     {showSuccessMessage ? (
                        <div className="flex items-center gap-4 animate-fade-in">
                            <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                                <CheckBadgeIcon className="w-5 h-5" />
                                <span className="text-sm font-semibold">Guardado con éxito</span>
                            </div>
                            <button 
                                onClick={() => alert('Descargando PDF de calificaciones...')}
                                className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white font-semibold rounded-md hover:bg-gray-700 transition-colors text-sm"
                            >
                                <ArrowDownTrayIcon className="w-4 h-4" />
                                Descargar PDF
                            </button>
                        </div>
                    ) : (
                        <button 
                            onClick={handleSaveChanges} 
                            disabled={isSaving}
                            className="px-6 py-2 bg-accent-blue text-white font-semibold rounded-md hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed">
                            {isSaving ? 'Guardando...' : 'Guardar Cambios'}
                        </button>
                    )}
                </div>
            </Card>
        </div>
    );
};

const TeacherAttendancePage: React.FC<{ onBack: () => void }> = ({ onBack }) => {
    const subjects = Object.keys(MOCK_COURSE_ATTENDANCE);
    const [selectedSubject, setSelectedSubject] = useState<string>(subjects[0]);
    const [attendance, setAttendance] = useState<StudentAttendanceRecord[]>(MOCK_COURSE_ATTENDANCE[subjects[0]]);
    const [isSaving, setIsSaving] = useState(false);
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);

    useEffect(() => {
        setAttendance(MOCK_COURSE_ATTENDANCE[selectedSubject]);
        setShowSuccessMessage(false);
    }, [selectedSubject]);
    
    const handleStatusChange = (studentId: string, status: StudentAttendanceRecord['status']) => {
        setAttendance(prev => 
            prev.map(student => student.id === studentId ? {...student, status} : student)
        );
    };

    const handleSaveChanges = () => {
        setIsSaving(true);
        setShowSuccessMessage(false);

        setTimeout(() => {
            setIsSaving(false);
            setShowSuccessMessage(true);
            
            setTimeout(() => {
                setShowSuccessMessage(false);
            }, 5000);
        }, 1500);
    };
    
    const statusClasses = {
        presente: 'bg-accent-green text-white',
        ausente: 'bg-accent-red text-white',
        tarde: 'bg-accent-yellow text-white',
        null: 'bg-bg-tertiary'
    };

    return (
         <div>
            <PageHeader title="Tomar Asistencia" onBack={onBack} />
            <Card>
                <div className="mb-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                        <label htmlFor="subject-select" className="block text-sm font-medium text-text-primary mb-2">Seleccione una Materia</label>
                        <select id="subject-select" value={selectedSubject} onChange={(e) => setSelectedSubject(e.target.value)}
                            className="w-full p-2 bg-bg-secondary border border-app-border rounded-md focus:ring-brand-primary focus:border-brand-primary">
                            {subjects.map(subject => <option key={subject} value={subject}>{subject}</option>)}
                        </select>
                    </div>
                    <div>
                         <label className="block text-sm font-medium text-text-primary mb-2">Fecha</label>
                         <input type="date" defaultValue={new Date().toISOString().substring(0, 10)} className="w-full p-2 bg-bg-secondary border border-app-border rounded-md"/>
                    </div>
                </div>
                
                 <div className="overflow-x-auto">
                     <div className="hidden sm:flex justify-between p-3 border-b border-app-border bg-bg-secondary rounded-t-md">
                        <div className="w-1/2 text-sm font-semibold uppercase">Alumno</div>
                        <div className="w-1/2 text-sm font-semibold uppercase text-center">Estado</div>
                    </div>
                     <div className="divide-y border-app-border">
                        {attendance.map(student => (
                            <div key={student.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-3">
                                <div className="mb-2 sm:mb-0 sm:w-1/2 font-medium">{student.name}</div>
                                <div className="sm:w-1/2 flex gap-2">
                                    <button onClick={() => handleStatusChange(student.id, 'presente')} className={`flex-1 text-center px-2.5 py-1 text-sm rounded-full transition-opacity ${student.status === 'presente' ? statusClasses.presente : statusClasses.null + ' hover:opacity-80'}`}>Presente</button>
                                    <button onClick={() => handleStatusChange(student.id, 'ausente')} className={`flex-1 text-center px-2.5 py-1 text-sm rounded-full transition-opacity ${student.status === 'ausente' ? statusClasses.ausente : statusClasses.null + ' hover:opacity-80'}`}>Ausente</button>
                                    <button onClick={() => handleStatusChange(student.id, 'tarde')} title="Tarde" className={`p-2 rounded-full transition-opacity ${student.status === 'tarde' ? statusClasses.tarde : statusClasses.null + ' hover:opacity-80'}`}>
                                        <ClockIcon className="w-4 h-4"/>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="flex justify-end mt-6 items-center gap-4">
                    {showSuccessMessage ? (
                        <div className="flex items-center gap-4 animate-fade-in">
                            <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                                <CheckBadgeIcon className="w-5 h-5" />
                                <span className="text-sm font-semibold">Guardado con éxito</span>
                            </div>
                            <button 
                                onClick={() => alert('Descargando PDF de asistencia...')}
                                className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white font-semibold rounded-md hover:bg-gray-700 transition-colors text-sm"
                            >
                                <ArrowDownTrayIcon className="w-4 h-4" />
                                Descargar PDF
                            </button>
                        </div>
                    ) : (
                        <button 
                            onClick={handleSaveChanges} 
                            disabled={isSaving}
                            className="px-6 py-2 bg-accent-blue text-white font-semibold rounded-md hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed">
                            {isSaving ? 'Guardando...' : 'Guardar Cambios'}
                        </button>
                    )}
                </div>

            </Card>
        </div>
    );
};

const UploadMaterialModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    onUpload: (material: Omit<Material, 'id'>) => void;
    subjects: string[];
}> = ({ isOpen, onClose, onUpload, subjects }) => {
    const [title, setTitle] = useState('');
    const [subject, setSubject] = useState(subjects[0] || '');
    const [year, setYear] = useState('1er Año');
    const [file, setFile] = useState<File | null>(null);

    const handleSubmit = () => {
        if (!title.trim() || !subject || !year || !file) {
            alert('Por favor, complete todos los campos y seleccione un archivo.');
            return;
        }
        const fileType = file.name.split('.').pop()?.toUpperCase();
        if (!['PDF', 'DOCX', 'PPT', 'PPTX'].includes(fileType || '')) {
             alert('Tipo de archivo no soportado. Solo se permiten PDF, DOCX, PPT.');
            return;
        }
        const finalFileType = fileType === 'PPTX' ? 'PPT' : fileType as 'PDF' | 'DOCX' | 'PPT';

        onUpload({ title, subject, year, fileType: finalFileType });
        onClose();
        setTitle('');
        setSubject(subjects[0] || '');
        setYear('1er Año');
        setFile(null);
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Subir Material de Estudio">
            <div className="space-y-4">
                <div>
                    <label htmlFor="mat-title" className="block text-sm font-medium text-text-primary">Título</label>
                    <input id="mat-title" type="text" value={title} onChange={e => setTitle(e.target.value)} className="w-full p-2 mt-1 bg-transparent border rounded-md border-app-border" />
                </div>
                 <div>
                    <label htmlFor="mat-subject" className="block text-sm font-medium text-text-primary">Materia</label>
                    <select id="mat-subject" value={subject} onChange={e => setSubject(e.target.value)} className="w-full p-2 mt-1 bg-bg-secondary border rounded-md border-app-border">
                        {subjects.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                </div>
                 <div>
                    <label htmlFor="mat-year" className="block text-sm font-medium text-text-primary">Año</label>
                    <select id="mat-year" value={year} onChange={e => setYear(e.target.value)} className="w-full p-2 mt-1 bg-bg-secondary border rounded-md border-app-border">
                        <option>1er Año</option>
                        <option>2do Año</option>
                        <option>3er Año</option>
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-text-primary">Archivo</label>
                    <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                        <div className="space-y-1 text-center">
                            <UploadIcon className="mx-auto h-12 w-12 text-gray-400" />
                            <div className="flex text-sm text-text-secondary">
                                <label htmlFor="file-upload" className="relative cursor-pointer bg-card-bg rounded-md font-medium text-brand-primary hover:text-brand-secondary focus-within:outline-none">
                                    <span>Selecciona un archivo</span>
                                    <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={e => setFile(e.target.files ? e.target.files[0] : null)} accept=".pdf,.docx,.ppt,.pptx" />
                                </label>
                            </div>
                            {file ? <p className="text-xs text-text-secondary">{file.name}</p> : <p className="text-xs text-text-secondary">PDF, DOCX, PPT hasta 10MB</p>}
                        </div>
                    </div>
                </div>
                <button onClick={handleSubmit} className="w-full mt-4 px-4 py-2 bg-brand-primary text-white rounded-md hover:bg-brand-secondary">Subir Material</button>
            </div>
        </Modal>
    );
};

const TeacherMaterialsPage: React.FC<{
    materials: Material[];
    onUploadClick: () => void;
    onBack: () => void;
}> = ({ materials, onUploadClick, onBack }) => {
    return (
        <div>
            <PageHeader title="Gestionar Material de Estudio" onBack={onBack}>
                <button onClick={onUploadClick} className="flex items-center gap-2 px-4 py-2 bg-brand-primary text-white font-semibold rounded-lg hover:bg-brand-secondary transition-colors">
                    <UploadIcon className="w-5 h-5" />
                    Subir Nuevo Material
                </button>
            </PageHeader>
            <Card>
                 {materials.length > 0 ? (
                    <ul className="space-y-4">
                        {materials.map(m => (
                            <li key={m.id} className="p-3 bg-bg-primary rounded-md flex justify-between items-center">
                                <div>
                                    <p className="font-semibold">{m.title}</p>
                                    <p className="text-sm text-text-secondary">{m.subject} - {m.year}</p>
                                </div>
                                <span className="text-sm font-mono px-2 py-1 bg-bg-tertiary rounded">{m.fileType}</span>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-center text-text-secondary py-6">Aún no has subido ningún material.</p>
                )}
            </Card>
        </div>
    );
};


const CommunicationModal: React.FC<{ 
    isOpen: boolean; 
    onClose: () => void; 
    onSend: (subject: string, message: string, recipient: string) => void;
}> = ({ isOpen, onClose, onSend }) => {
    const [subject, setSubject] = useState('');
    const [message, setMessage] = useState('');

    const [recipientType, setRecipientType] = useState('all'); // 'all' or 'filtered'
    const careers = useMemo(() => MOCK_CAREERS.map(c => c.name), []);
    const [selectedCareer, setSelectedCareer] = useState<string>(careers[0] || '');

    const availableYears = useMemo(() => {
        const career = MOCK_CAREERS.find(c => c.name === selectedCareer);
        return career ? Object.keys(career.years) : [];
    }, [selectedCareer]);

    const [selectedYear, setSelectedYear] = useState<string>(availableYears[0] || '');
    
    useEffect(() => {
        if (availableYears.length > 0) {
            setSelectedYear(availableYears[0]);
        } else {
            setSelectedYear('');
        }
    }, [selectedCareer, availableYears]);

    const handleSend = () => {
        if (!subject.trim() || !message.trim()) {
            alert('Por favor, complete el asunto y el mensaje.');
            return;
        }

        let finalRecipient = 'Todos los Alumnos';
        if (recipientType === 'filtered') {
             if (!selectedCareer || !selectedYear) {
                alert('Por favor, seleccione una carrera y un año.');
                return;
            }
            finalRecipient = `Alumnos de ${selectedCareer} - ${selectedYear}`;
        }
        
        onSend(subject, message, finalRecipient);
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Enviar Comunicado General">
            <div className="space-y-4">
                <div>
                    <label htmlFor="comm-recipient-type" className="block text-sm font-medium text-text-primary">Destinatario</label>
                    <select 
                        id="comm-recipient-type" 
                        value={recipientType} 
                        onChange={e => setRecipientType(e.target.value)} 
                        className="w-full p-2 mt-1 bg-bg-secondary border rounded-md border-app-border focus:ring-brand-primary focus:border-brand-primary"
                    >
                        <option value="all">Todos los Alumnos</option>
                        <option value="filtered">Filtrar por Carrera y Año</option>
                    </select>
                </div>
                {recipientType === 'filtered' && (
                    <>
                        <div>
                            <label htmlFor="comm-career" className="block text-sm font-medium text-text-primary">Carrera</label>
                            <select 
                                id="comm-career" 
                                value={selectedCareer} 
                                onChange={e => setSelectedCareer(e.target.value)} 
                                className="w-full p-2 mt-1 bg-bg-secondary border rounded-md border-app-border focus:ring-brand-primary focus:border-brand-primary"
                            >
                                {careers.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </div>
                        <div>
                            <label htmlFor="comm-year" className="block text-sm font-medium text-text-primary">Año</label>
                            <select 
                                id="comm-year" 
                                value={selectedYear} 
                                onChange={e => setSelectedYear(e.target.value)} 
                                className="w-full p-2 mt-1 bg-bg-secondary border rounded-md border-app-border focus:ring-brand-primary focus:border-brand-primary"
                                disabled={availableYears.length === 0}
                            >
                                {availableYears.map(y => <option key={y} value={y}>{y}</option>)}
                            </select>
                        </div>
                    </>
                )}
                <div>
                    <label htmlFor="comm-subject" className="block text-sm font-medium text-text-primary">Asunto</label>
                    <input id="comm-subject" type="text" value={subject} onChange={e => setSubject(e.target.value)} className="w-full p-2 mt-1 bg-transparent border rounded-md border-app-border focus:ring-brand-primary focus:border-brand-primary" />
                </div>
                <div>
                    <label htmlFor="comm-message" className="block text-sm font-medium text-text-primary">Mensaje</label>
                    <textarea id="comm-message" value={message} onChange={e => setMessage(e.target.value)} rows={5} className="w-full p-2 mt-1 bg-transparent border rounded-md border-app-border focus:ring-brand-primary focus:border-brand-primary"></textarea>
                </div>
                <button onClick={handleSend} className="w-full mt-4 px-4 py-2 bg-brand-primary text-white rounded-md hover:bg-brand-secondary">Enviar Comunicado</button>
            </div>
        </Modal>
    );
};

const ContactStudentModal: React.FC<{ isOpen: boolean; onClose: () => void; student: UnderperformingStudent | null; }> = ({ isOpen, onClose, student }) => {
    const [contactType, setContactType] = useState<'message' | 'notice'>('message');
    
    const handleSend = () => {
        alert(`Comunicación enviada a ${student?.name}.`);
        onClose();
    };

    if (!student) return null;

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={`Contactar a ${student.name}`}>
            <div className="space-y-4">
                 <div className="border-b border-app-border mb-4">
                    <nav className="flex space-x-2" aria-label="Tabs">
                        <button onClick={() => setContactType('message')} className={`px-3 py-2 font-medium text-sm rounded-t-md ${contactType === 'message' ? 'border-b-2 border-brand-primary text-brand-primary' : 'text-text-secondary'}`}>
                            Enviar Mensaje
                        </button>
                        <button onClick={() => setContactType('notice')} className={`px-3 py-2 font-medium text-sm rounded-t-md ${contactType === 'notice' ? 'border-b-2 border-brand-primary text-brand-primary' : 'text-text-secondary'}`}>
                            Enviar Aviso
                        </button>
                    </nav>
                </div>
                {contactType === 'message' ? (
                    <div>
                        <label htmlFor="student-message" className="block text-sm font-medium text-text-primary">Mensaje Personalizado</label>
                        <textarea id="student-message" rows={5} className="w-full p-2 mt-1 bg-transparent border rounded-md border-app-border" placeholder={`Escribe un mensaje para ${student.name}...`}></textarea>
                    </div>
                ) : (
                    <div>
                         <label htmlFor="student-notice" className="block text-sm font-medium text-text-primary">Plantilla de Aviso</label>
                         <select id="student-notice" className="w-full p-2 mt-1 bg-bg-secondary border rounded-md border-app-border">
                            <option>Aviso por inasistencias</option>
                            <option>Aviso por bajo rendimiento académico</option>
                            <option>Solicitud de reunión</option>
                        </select>
                        <p className="text-xs text-text-secondary mt-2">Se enviará una notificación con el aviso seleccionado.</p>
                    </div>
                )}
                <button onClick={handleSend} className="w-full mt-4 px-4 py-2 bg-brand-primary text-white rounded-md hover:bg-brand-secondary">Enviar</button>
            </div>
        </Modal>
    );
};

const PreceptorAttendancePage: React.FC<{ onBack: () => void; onViewProfile: (studentId: string) => void }> = ({ onBack, onViewProfile }) => {
    const allStudents = useMemo(() => MOCK_USERS.alumno, []);
    const careers = useMemo(() => MOCK_CAREERS.map(c => c.name), []);
    const [selectedCareer, setSelectedCareer] = useState<string>(careers[0]);
    const [isSaving, setIsSaving] = useState(false);
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);

    const availableYears = useMemo(() => {
        const career = MOCK_CAREERS.find(c => c.name === selectedCareer);
        return career ? Object.keys(career.years) : [];
    }, [selectedCareer]);

    const [selectedYear, setSelectedYear] = useState<string>(availableYears[0] || '');

    const availableSubjects = useMemo(() => {
        const career = MOCK_CAREERS.find(c => c.name === selectedCareer);
        if (!career || !selectedYear) return [];
        return career.years[selectedYear as keyof typeof career.years] || [];
    }, [selectedCareer, selectedYear]);

    const [selectedSubject, setSelectedSubject] = useState<string>(availableSubjects[0] || '');
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().substring(0, 10));
    const [attendance, setAttendance] = useState<StudentAttendanceRecord[]>([]);

    useEffect(() => {
        if (availableYears.length > 0) {
            setSelectedYear(availableYears[0]);
        } else {
            setSelectedYear('');
        }
    }, [selectedCareer, availableYears]);

    useEffect(() => {
        if (availableSubjects.length > 0) {
            setSelectedSubject(availableSubjects[0]);
        } else {
            setSelectedSubject('');
        }
    }, [selectedYear, availableSubjects]);

    useEffect(() => {
        if (selectedYear && selectedSubject) {
            const students = MOCK_PRECEPTOR_ATTENDANCE_DETAIL[selectedYear]?.[selectedSubject] || [];
            setAttendance(students);
        } else {
            setAttendance([]);
        }
    }, [selectedYear, selectedSubject]);

    const handleStatusChange = (studentId: string, status: 'P' | 'A' | 'T' | 'J') => {
        const statusMap = { 'P': 'presente', 'A': 'ausente', 'T': 'tarde', 'J': 'justificado' } as const;
        setAttendance(prev => 
            prev.map(student => student.id === studentId ? {...student, status: statusMap[status]} : student)
        );
    };

    const handleSaveChanges = () => {
        setIsSaving(true);
        setShowSuccessMessage(false);

        setTimeout(() => {
            setIsSaving(false);
            setShowSuccessMessage(true);
            
            setTimeout(() => {
                setShowSuccessMessage(false);
            }, 5000);
        }, 1500);
    };

    return (
        <div>
            <PageHeader title="Asistencia General" onBack={onBack} />
            <Card>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 p-4 bg-bg-primary rounded-lg">
                    <div>
                        <label htmlFor="att-date" className="block text-sm font-medium text-text-primary mb-1">Día</label>
                        <input id="att-date" type="date" value={selectedDate} onChange={e => setSelectedDate(e.target.value)}
                            className="w-full p-2 bg-card-bg border border-app-border rounded-md focus:ring-brand-primary focus:border-brand-primary" />
                    </div>
                     <div>
                        <label htmlFor="att-career" className="block text-sm font-medium text-text-primary mb-1">Carrera</label>
                        <select id="att-career" value={selectedCareer} onChange={e => setSelectedCareer(e.target.value)}
                            className="w-full p-2 bg-card-bg border border-app-border rounded-md focus:ring-brand-primary focus:border-brand-primary">
                            {careers.map(career => <option key={career} value={career}>{career}</option>)}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="att-year" className="block text-sm font-medium text-text-primary mb-1">Año</label>
                        <select id="att-year" value={selectedYear} onChange={e => setSelectedYear(e.target.value)}
                            className="w-full p-2 bg-card-bg border border-app-border rounded-md focus:ring-brand-primary focus:border-brand-primary" disabled={!selectedCareer}>
                             {availableYears.map(year => <option key={year} value={year}>{year}</option>)}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="att-subject" className="block text-sm font-medium text-text-primary mb-1">Materia</label>
                        <select id="att-subject" value={selectedSubject} onChange={e => setSelectedSubject(e.target.value)}
                            className="w-full p-2 bg-card-bg border border-app-border rounded-md focus:ring-brand-primary focus:border-brand-primary" disabled={!selectedYear}>
                           {availableSubjects.map(subject => <option key={subject} value={subject}>{subject}</option>)}
                        </select>
                    </div>
                </div>

                 <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="border-b border-app-border bg-bg-secondary">
                            <tr>
                                <th className="p-3 text-sm font-semibold uppercase">Alumno</th>
                                <th className="p-3 text-sm font-semibold uppercase text-right">Asistencia</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y border-app-border">
                            {attendance.length > 0 ? attendance.map(student => {
                                const studentData = allStudents.find(s => s.id === student.id);
                                return (
                                <tr key={student.id}>
                                    <td className="p-3">
                                        <button onClick={() => onViewProfile(student.id)} className="font-medium text-left text-brand-primary hover:underline">
                                            {student.name}
                                        </button>
                                        <span className="block text-xs text-text-secondary">
                                            Legajo: {studentData?.legajo || 'N/A'}
                                        </span>
                                    </td>
                                    <td className="p-3">
                                        <div className="flex justify-end items-center gap-4">
                                            {['P', 'A', 'T', 'J'].map(status => {
                                                const statusMap = { 'P': 'presente', 'A': 'ausente', 'T': 'tarde', 'J': 'justificado' };
                                                const isSelected = student.status === statusMap[status as 'P' | 'A' | 'T' | 'J'];
                                                return (
                                                    <label key={status} className="flex items-center gap-2 cursor-pointer">
                                                        <input type="radio" name={`attendance-${student.id}`} 
                                                            checked={isSelected}
                                                            onChange={() => handleStatusChange(student.id, status as 'P' | 'A' | 'T' | 'J')}
                                                            className="h-4 w-4 accent-brand-primary"
                                                        />
                                                        {status}
                                                    </label>
                                                )
                                            })}
                                        </div>
                                    </td>
                                </tr>
                            )}) : (
                                <tr>
                                    <td colSpan={2} className="p-4 text-center text-text-secondary">No hay alumnos para la selección actual.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="flex justify-end mt-6 items-center gap-4">
                     {showSuccessMessage ? (
                        <div className="flex items-center gap-4 animate-fade-in">
                            <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                                <CheckBadgeIcon className="w-5 h-5" />
                                <span className="text-sm font-semibold">Guardado con éxito</span>
                            </div>
                            <button 
                                onClick={() => alert('Descargando PDF de asistencia...')}
                                className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white font-semibold rounded-md hover:bg-gray-700 transition-colors text-sm"
                            >
                                <ArrowDownTrayIcon className="w-4 h-4" />
                                Descargar PDF
                            </button>
                        </div>
                    ) : (
                        <button 
                            onClick={handleSaveChanges} 
                            disabled={isSaving || attendance.length === 0}
                            className="px-6 py-2 bg-accent-blue text-white font-semibold rounded-md hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed">
                            {isSaving ? 'Guardando...' : 'Guardar'}
                        </button>
                    )}
                </div>
            </Card>
        </div>
    )
};

const PreceptorProceduresPage: React.FC<{
    requests: ProcedureRequest[];
    onSelectRequest: (request: ProcedureRequest) => void;
    onBack: () => void;
}> = ({ requests, onSelectRequest, onBack }) => {
    const [filter, setFilter] = useState<'pending' | 'approved' | 'rejected' | 'all'>('pending');

    const filteredRequests = useMemo(() => {
        if (filter === 'all') return requests;
        return requests.filter(req => req.status === filter);
    }, [requests, filter]);

    const getStatusChip = (status: ProcedureRequest['status']) => {
        const styles: Record<typeof status, string> = {
            pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300',
            approved: 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300',
            rejected: 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300',
        };
        const statusText: Record<typeof status, string> = {
            pending: 'Pendiente',
            approved: 'Aprobado',
            rejected: 'Rechazado'
        };
        return <span className={`px-2 py-1 text-xs font-medium rounded-full ${styles[status]}`}>{statusText[status]}</span>;
    };

    return (
        <div>
            <PageHeader title="Gestión de Trámites" onBack={onBack} />
            <Card>
                <div className="flex flex-wrap gap-2 border-b border-app-border mb-4 pb-3">
                    {(['pending', 'approved', 'rejected', 'all'] as const).map(tab => (
                        <button
                            key={tab}
                            onClick={() => setFilter(tab)}
                            className={`px-4 py-2 text-sm font-semibold rounded-md transition-colors ${filter === tab ? 'bg-brand-primary text-white' : 'bg-bg-secondary hover:bg-bg-tertiary'}`}
                        >
                            {tab === 'all' ? 'Todos' : tab === 'pending' ? 'Pendientes' : tab === 'approved' ? 'Aprobados' : 'Rechazados'}
                        </button>
                    ))}
                </div>

                {filteredRequests.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                        {filteredRequests.map(req => (
                            <button
                                key={req.id}
                                onClick={() => onSelectRequest(req)}
                                className="p-4 bg-bg-primary rounded-lg text-left hover:bg-bg-tertiary transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-brand-primary disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:bg-bg-primary"
                                disabled={req.status !== 'pending'}
                            >
                                <div className="flex flex-col h-full">
                                    <div className="flex-grow">
                                        <p className="font-semibold">{req.studentName}</p>
                                        <p className="text-sm text-text-secondary">{req.type}</p>
                                        <p className="text-xs text-text-secondary mt-1">{req.date}</p>
                                    </div>
                                    <div className="mt-3">
                                        {getStatusChip(req.status)}
                                    </div>
                                </div>
                            </button>
                        ))}
                    </div>
                ) : (
                    <p className="text-center text-text-secondary py-6">No hay solicitudes que coincidan con el filtro.</p>
                )}
            </Card>
        </div>
    );
};


const PreceptorDashboard: React.FC<{ 
    user: User; 
    pendingJustifications: PendingJustification[];
    onManageJustification: (id: string, action: 'approve' | 'reject') => void;
    onContactStudent: (student: UnderperformingStudent) => void;
    onShowCommunications: () => void;
    navigate: (page: Page) => void;
    pendingProcedures: ProcedureRequest[];
    forumPosts: ForumPost[];
    events: CalendarEvent[];
}> = ({ user, pendingJustifications, onManageJustification, onContactStudent, onShowCommunications, navigate, pendingProcedures, forumPosts, events }) => {
    
    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold">Bienvenido, Preceptor {user.name}</h2>
                <p className="text-text-secondary">Panel de gestión y seguimiento de alumnos.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="lg:col-span-2">
                    <Card title="Acciones Rápidas">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <button onClick={() => navigate('asistencia-general')} className="flex flex-col items-center justify-center p-4 bg-bg-primary rounded-lg hover:bg-bg-tertiary transition-colors">
                                <ClipboardDocumentCheckIcon className="w-8 h-8 mb-2 text-brand-primary" />
                                <span className="font-semibold text-center">Ver Asistencia General</span>
                            </button>
                             <button onClick={onShowCommunications} className="flex flex-col items-center justify-center p-4 bg-bg-primary rounded-lg hover:bg-bg-tertiary transition-colors">
                                <MegaphoneIcon className="w-8 h-8 mb-2 text-accent-purple" />
                                <span className="font-semibold text-center">Enviar Comunicado</span>
                            </button>
                            <button onClick={() => navigate('agenda')} className="flex flex-col items-center justify-center p-4 bg-bg-primary rounded-lg hover:bg-bg-tertiary transition-colors">
                                <CalendarDaysIcon className="w-8 h-8 mb-2 text-accent-blue" />
                                <span className="font-semibold text-center">Ver Agenda</span>
                            </button>
                        </div>
                    </Card>
                </div>

                <div className="lg:col-span-2">
                    <WeeklyCalendar events={events} />
                </div>
                
                <Card title="Justificaciones Pendientes">
                    {pendingJustifications.length > 0 ? (
                        <ul className="space-y-3 max-h-80 overflow-y-auto">
                            {pendingJustifications.map(justification => (
                                <li key={justification.id} className="p-3 bg-bg-primary rounded-md">
                                    <p className="font-semibold">{justification.studentName}</p>
                                    <p className="text-sm text-text-secondary">{justification.subject} - {justification.date}</p>
                                    <p className="text-sm italic mt-1">"{justification.reason}"</p>
                                    <div className="flex gap-2 mt-3">
                                        <button onClick={() => onManageJustification(justification.id, 'approve')} className="px-2 py-1 text-xs rounded-full bg-accent-green text-white hover:bg-green-600">Aprobar</button>
                                        <button onClick={() => onManageJustification(justification.id, 'reject')} className="px-2 py-1 text-xs rounded-full bg-accent-red text-white hover:bg-red-600">Rechazar</button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    ) : <p className="text-text-secondary text-center py-4">No hay justificaciones pendientes.</p>}
                </Card>

                <Card title="Solicitudes de Trámites">
                    {pendingProcedures.length > 0 ? (
                         <>
                            <ul className="space-y-3 max-h-72 overflow-y-auto">
                                {pendingProcedures.map(req => (
                                    <li key={req.id} className="p-3 bg-bg-primary rounded-md">
                                        <p className="font-semibold">{req.studentName}</p>
                                        <p className="text-sm text-text-secondary">{req.type} - {req.date}</p>
                                    </li>
                                ))}
                            </ul>
                            <button 
                                onClick={() => navigate('trámites')} 
                                className="w-full mt-4 px-4 py-2 font-semibold text-white bg-brand-primary rounded-md hover:bg-brand-secondary"
                            >
                                Gestionar Trámites
                            </button>
                         </>
                    ) : <p className="text-text-secondary text-center py-4">No hay solicitudes pendientes.</p>}
                </Card>

                <Card title="Alumnos en Observación">
                     <ul className="space-y-3 max-h-80 overflow-y-auto">
                        {MOCK_UNDERPERFORMING_STUDENTS.map(student => (
                            <li key={student.id} className="p-3 bg-bg-primary rounded-md">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="font-semibold">{student.name}</p>
                                        <p className="text-sm text-accent-yellow">{student.reason}: <span className="font-semibold">{student.value}</span></p>
                                    </div>
                                </div>
                                 <div className="flex gap-2 mt-3">
                                    <button onClick={() => onContactStudent(student)} className="px-2 py-1 text-xs rounded-full bg-accent-blue text-white hover:bg-blue-600">Enviar Mensaje</button>
                                    <button onClick={() => onContactStudent(student)} className="px-2 py-1 text-xs rounded-full bg-accent-yellow text-white hover:bg-yellow-600">Enviar Aviso</button>
                                </div>
                            </li>
                        ))}
                    </ul>
                </Card>

                <Card title="Actividad Reciente en Foros">
                    {forumPosts.length > 0 ? (
                        <ul className="space-y-4 max-h-80 overflow-y-auto">
                            {forumPosts.map(post => (
                                <li key={post.id} className="p-3 bg-bg-primary rounded-md">
                                    <h4 className="font-semibold">{post.title}</h4>
                                    <p className="text-sm text-text-secondary mt-1">
                                        en <span className="font-medium">{post.category}</span> por {post.author}
                                    </p>
                                </li>
                            ))}
                        </ul>
                    ) : <p className="text-center text-text-secondary py-4">No hay actividad reciente en los foros.</p>}
                    <button 
                        onClick={() => navigate('foros')} 
                        className="w-full mt-4 px-4 py-2 font-semibold text-white bg-brand-primary rounded-md hover:bg-brand-secondary"
                    >
                        Ir a los Foros
                    </button>
                </Card>

            </div>
        </div>
    );
};

const StudentProfilePageForPreceptor: React.FC<{ studentId: string; onBack: () => void; }> = ({ studentId, onBack }) => {
    const profileData = MOCK_STUDENT_PROFILE_DATA[studentId] || MOCK_STUDENT_PROFILE_DATA['default'];

    const ProgressBar: React.FC<{ value: number }> = ({ value }) => (
        <div className="w-full bg-bg-tertiary rounded-full h-2.5">
            <div className="bg-brand-primary h-2.5 rounded-full" style={{ width: `${value}%` }}></div>
        </div>
    );
    
    return (
        <div>
            <PageHeader title="Perfil del Alumno" onBack={onBack} />
            <div className="space-y-6">
                <Card>
                    <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
                        <img src={profileData.avatarUrl} alt={profileData.name} className="w-24 h-24 sm:w-32 sm:h-32 rounded-full object-cover"/>
                        <div className="text-center sm:text-left">
                            <h2 className="text-2xl sm:text-3xl font-bold">{profileData.name}</h2>
                            <p className="text-md text-text-secondary">Legajo: {profileData.legajo}</p>
                        </div>
                    </div>
                </Card>
                <Card title="Asistencia por Materia">
                    <ul className="space-y-4">
                        {profileData.attendanceBySubject.map((item: any) => (
                            <li key={item.subject}>
                                <div className="flex justify-between items-center mb-1">
                                    <span className="font-medium">{item.subject}</span>
                                    <span className="text-sm font-semibold text-brand-primary">{item.percentage}%</span>
                                </div>
                                <ProgressBar value={item.percentage} />
                            </li>
                        ))}
                    </ul>
                </Card>
                <Card title="Notas de Parciales">
                    <ul className="space-y-3">
                        {profileData.partialGrades.map((grade: any) => (
                             <li key={grade.id} className="flex justify-between items-center p-3 bg-bg-primary rounded-md">
                                <div>
                                    <p className="font-semibold">{grade.title}</p>
                                    <p className="text-sm text-text-secondary">{grade.date}</p>
                                </div>
                                <span className={`flex items-center justify-center w-10 h-10 rounded-full text-lg font-bold text-white ${grade.grade >= 7 ? 'bg-accent-green' : 'bg-accent-yellow'}`}>
                                    {grade.grade}
                                </span>
                            </li>
                        ))}
                    </ul>
                </Card>
                <Card title="Inscripción a Finales">
                    <ul className="space-y-3">
                        {profileData.finalExams.map((exam: any) => (
                             <li key={exam.subject} className="flex justify-between items-center p-3 bg-bg-primary rounded-md">
                                <span className="font-medium">{exam.subject}</span>
                                {exam.enrolled ? (
                                    <span className="flex items-center gap-2 text-sm text-accent-green">
                                        <CheckBadgeIcon className="w-5 h-5"/> Inscripto
                                    </span>
                                ) : (
                                    <span className="flex items-center gap-2 text-sm text-accent-red">
                                        <XCircleIcon className="w-5 h-5"/> No Inscripto
                                    </span>
                                )}
                            </li>
                        ))}
                    </ul>
                </Card>
                <Card title="Historial de Justificaciones">
                     {profileData.justifications.length > 0 ? (
                        <ul className="space-y-2">
                             {profileData.justifications.map((just: any) => <li key={just.id}>{just.reason}</li>)}
                        </ul>
                    ) : (
                        <p className="text-sm text-text-secondary">El alumno no ha enviado justificaciones.</p>
                    )}
                </Card>
                <Card title="Historial de Mensajes">
                     <p className="text-sm text-text-secondary">El historial de mensajes no está disponible.</p>
                </Card>
            </div>
        </div>
    )
}

const ProcedureDetailModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    request: ProcedureRequest | null;
    onApprove: (requestId: string, file: File) => void;
    onReject: (requestId: string) => void;
}> = ({ isOpen, onClose, request, onApprove, onReject }) => {
    const [file, setFile] = useState<File | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            if (e.target.files[0].type === 'application/pdf' && e.target.files[0].size <= 10 * 1024 * 1024) {
                 setFile(e.target.files[0]);
            } else {
                alert('Por favor, selecciona un archivo PDF de hasta 10MB.');
                e.target.value = ''; // Reset input
            }
        }
    };
    
    const handleApprove = () => {
        if (request && file) {
            onApprove(request.id, file);
            handleClose();
        } else {
            alert('Por favor, adjunta un documento para aprobar.');
        }
    };

    const handleReject = () => {
        if (request) {
            onReject(request.id);
            handleClose();
        }
    };

    const handleClose = () => {
        setFile(null);
        onClose();
    };


    if (!isOpen || !request) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60" aria-modal="true">
            <div className="bg-card-bg rounded-lg shadow-xl w-full max-w-md m-4 animate-fade-in">
                <div className="flex items-center justify-between p-4 border-b border-app-border">
                    <h3 className="text-lg font-semibold text-text-primary">Detalle de Trámite</h3>
                    <button onClick={handleClose} className="p-1 rounded-full hover:bg-bg-tertiary">
                        <CloseIcon className="w-5 h-5 text-text-secondary" />
                    </button>
                </div>
                <div className="p-6 space-y-4">
                    <div>
                        <h4 className="text-xl font-bold text-text-primary">{request.studentName}</h4>
                        <p className="text-text-secondary">{request.type}</p>
                        <p className="text-sm text-text-secondary">Fecha: {request.date}</p>
                    </div>
                    <hr className="border-app-border" />
                    <div>
                        <label className="block text-sm font-medium text-text-primary mb-2">Adjuntar Documento (PDF)</label>
                        <div className="flex items-center justify-center w-full">
                            <label htmlFor="file-upload-procedure" className="flex flex-col items-center justify-center w-full h-32 border-2 border-app-border border-dashed rounded-lg cursor-pointer bg-bg-secondary hover:bg-bg-tertiary">
                                <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center">
                                    <UploadIcon className="w-8 h-8 mb-2 text-text-secondary"/>
                                    {file ? (
                                        <p className="text-sm text-accent-green font-semibold">{file.name}</p>
                                    ) : (
                                        <>
                                            <p className="mb-2 text-sm text-text-secondary"><span className="font-semibold">Selecciona un archivo</span></p>
                                            <p className="text-xs text-text-secondary">PDF hasta 10MB</p>
                                        </>
                                    )}
                                </div>
                                <input id="file-upload-procedure" type="file" className="hidden" onChange={handleFileChange} accept="application/pdf" />
                            </label>
                        </div> 
                    </div>
                </div>
                <div className="flex items-center justify-end p-4 bg-bg-primary rounded-b-lg space-x-3">
                    <button onClick={handleReject} className="px-6 py-2 text-sm font-semibold text-white bg-red-500 rounded-md hover:bg-red-600 transition-colors">Rechazar</button>
                    <button onClick={handleApprove} className="px-6 py-2 text-sm font-semibold text-white bg-gray-500 rounded-md hover:bg-gray-600 disabled:bg-gray-400 disabled:cursor-not-allowed" disabled={!file}>Aprobar y Enviar</button>
                </div>
            </div>
        </div>
    );
};


// --- LAYOUT COMPONENTS ---
const Header: React.FC<{ user: User; onLogout: () => void; onMenuToggle: (menu: string) => void; activeMenu: string | null; isSubPage: boolean; notifications: Notification[]; navigate: (page: Page) => void; }> = ({ user, onLogout, onMenuToggle, activeMenu, isSubPage, notifications, navigate }) => {
    
    return (
        <header className={`sticky top-0 z-20 flex items-center justify-between p-4 backdrop-blur-lg transition-colors duration-300 ${isSubPage ? 'md:hidden' : ''} bg-card-bg/70`}>
            <div className="flex items-center space-x-4">
                <AcademicCapIcon className="w-8 h-8 text-brand-primary"/>
                <span className="text-xl font-bold hidden sm:inline">Portal del Instituto</span>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-4">
                 <button onClick={() => onMenuToggle('theme')} className="p-2 rounded-full hover:bg-bg-tertiary transition-colors transition-transform duration-200 ease-in-out hover:scale-110 active:scale-105" title="Cambiar apariencia">
                    <PaletteIcon className="w-6 h-6" />
                </button>
                <button onClick={() => navigate('mensajes')} className="p-2 rounded-full hover:bg-bg-tertiary transition-colors transition-transform duration-200 ease-in-out hover:scale-110 active:scale-105" title="Mensajes">
                    <InboxIcon className="w-6 h-6" />
                </button>
                <div className="relative">
                     <button onClick={() => onMenuToggle('notifications')} className="p-2 rounded-full hover:bg-bg-tertiary transition-colors transition-transform duration-200 ease-in-out hover:scale-110 active:scale-105">
                        <BellIcon className="w-6 h-6" />
                        {notifications.some(n => !n.read) && <span className="absolute top-1 right-1 block w-2 h-2 bg-red-500 rounded-full"></span>}
                    </button>
                    {activeMenu === 'notifications' && (
                        <div className="absolute right-0 mt-2 w-72 bg-card-bg border border-app-border rounded-md shadow-lg animate-fade-in">
                            <div className="p-3 font-semibold border-b border-app-border">Notificaciones</div>
                            <ul className="py-1 max-h-80 overflow-y-auto">
                                {notifications.map(n => (
                                    <li key={n.id} className="px-3 py-2 hover:bg-bg-tertiary cursor-pointer">
                                        <p className={`text-sm ${!n.read ? 'font-bold' : ''}`}>{n.title}</p>
                                        <p className="text-xs text-text-secondary">{n.date}</p>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
                 <div className="relative">
                    <button onClick={() => onMenuToggle('profile')} className="p-2 rounded-full hover:bg-bg-tertiary transition-colors transition-transform duration-200 ease-in-out hover:scale-110 active:scale-105">
                        <img src={user.avatarUrl || `https://ui-avatars.com/api/?name=${user.name.replace(' ', '+')}&background=4f46e5&color=fff&size=32`} alt="Avatar" className="w-8 h-8 rounded-full" />
                    </button>
                    {activeMenu === 'profile' && (
                         <div className="absolute right-0 mt-2 w-48 bg-card-bg border border-app-border rounded-md shadow-lg animate-fade-in">
                             <ul className="py-1">
                                 <li>
                                     <a href="#" onClick={(e) => { e.preventDefault(); navigate('perfil'); onMenuToggle('profile'); }}
                                        className="block px-4 py-2 text-sm text-text-primary hover:bg-bg-tertiary">
                                         Mi Perfil
                                     </a>
                                 </li>
                                 <li>
                                    <button onClick={() => { onLogout(); onMenuToggle('profile'); }}
                                            className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-bg-tertiary">
                                        Cerrar Sesión
                                    </button>
                                 </li>
                             </ul>
                         </div>
                    )}
                </div>
            </div>
        </header>
    );
}

const Sidebar: React.FC<{ user: User; currentPage: Page; navigate: (page: Page) => void; onLogout: () => void; }> = ({ user, currentPage, navigate, onLogout }) => {
    type NavLink = { name: string; page: Page; icon: React.ReactNode; };

    const alumnoLinks: NavLink[] = [ 
        { name: 'Panel Principal', page: 'panel', icon: <ChartBarIcon className="w-5 h-5"/> }, 
        { name: 'Calificaciones', page: 'calificaciones', icon: <AcademicCapIcon className="w-5 h-5"/> }, 
        { name: 'Asistencia', page: 'asistencia', icon: <CheckBadgeIcon className="w-5 h-5"/> },
        { name: 'Agenda', page: 'agenda', icon: <CalendarDaysIcon className="w-5 h-5" /> },
        { name: 'Mensajes', page: 'mensajes', icon: <InboxIcon className="w-5 h-5"/> },
        { name: 'Foros', page: 'foros', icon: <ChatBubbleLeftRightIcon className="w-5 h-5"/> },
        { name: 'Materiales', page: 'materiales', icon: <BookOpenIcon className="w-5 h-5"/> },
        { name: 'Trámites', page: 'trámites', icon: <PencilSquareIcon className="w-5 h-5"/> },
    ];

    const profesorLinks: NavLink[] = [
        { name: 'Panel Principal', page: 'panel', icon: <ChartBarIcon className="w-5 h-5"/> }, 
        { name: 'Calificaciones', page: 'calificaciones', icon: <PencilSquareIcon className="w-5 h-5"/> }, 
        { name: 'Asistencia', page: 'asistencia', icon: <CheckBadgeIcon className="w-5 h-5"/> },
        { name: 'Agenda', page: 'agenda', icon: <CalendarDaysIcon className="w-5 h-5" /> },
        { name: 'Mensajes', page: 'mensajes', icon: <InboxIcon className="w-5 h-5"/> }, 
        { name: 'Foros', page: 'foros', icon: <ChatBubbleLeftRightIcon className="w-5 h-5"/> },
        { name: 'Materiales', page: 'materiales', icon: <BookOpenIcon className="w-5 h-5"/> },
    ];
    
    const preceptorLinks: NavLink[] = [
        { name: 'Panel Principal', page: 'panel', icon: <ChartBarIcon className="w-5 h-5"/> },
        { name: 'Asistencia', page: 'asistencia-general', icon: <CheckBadgeIcon className="w-5 h-5"/> },
        { name: 'Trámites', page: 'trámites', icon: <DocumentTextIcon className="w-5 h-5"/> },
        { name: 'Mensajes', page: 'mensajes', icon: <InboxIcon className="w-5 h-5"/> },
        { name: 'Foros', page: 'foros', icon: <ChatBubbleLeftRightIcon className="w-5 h-5"/> },
        { name: 'Agenda', page: 'agenda', icon: <CalendarDaysIcon className="w-5 h-5" /> },
    ];

    const directivoLinks: NavLink[] = [
        { name: 'Inicio', page: 'panel', icon: <ChartBarIcon className="w-5 h-5" /> },
        { name: 'Personal', page: 'personal', icon: <UserGroupIcon className="w-5 h-5" /> },
        { name: 'Alumnos', page: 'asistencia-general', icon: <AcademicCapIcon className="w-5 h-5" /> },
        { name: 'Estadísticas', page: 'estadisticas', icon: <ChartPieIcon className="w-5 h-5" /> },
        { name: 'Comunicados', page: 'comunicados', icon: <MegaphoneIcon className="w-5 h-5" /> },
    ];

    const auxiliarLinks: NavLink[] = [
        { name: 'Inicio', page: 'panel', icon: <ChartBarIcon className="w-5 h-5" /> },
        { name: 'Tareas', page: 'tareas', icon: <WrenchScrewdriverIcon className="w-5 h-5" /> },
        { name: 'Instalaciones', page: 'instalaciones', icon: <BuildingOfficeIcon className="w-5 h-5" /> },
        { name: 'Mensajes', page: 'mensajes', icon: <InboxIcon className="w-5 h-5" /> },
        { name: 'Turnos', page: 'turnos', icon: <ClockIcon className="w-5 h-5" /> },
    ];
    
    const centroEstudiantesLinks: NavLink[] = [
        { name: 'Inicio', page: 'panel', icon: <ChartBarIcon className="w-5 h-5" /> },
        { name: 'Eventos', page: 'eventos', icon: <CalendarDaysIcon className="w-5 h-5" /> },
        { name: 'Comunidad', page: 'foros', icon: <ChatBubbleLeftRightIcon className="w-5 h-5" /> },
        { name: 'Anuncios', page: 'anuncios', icon: <MegaphoneIcon className="w-5 h-5" /> },
        { name: 'Reclamos', page: 'reclamos', icon: <InboxArrowDownIcon className="w-5 h-5" /> },
    ];

    const links = {
        alumno: alumnoLinks,
        profesor: profesorLinks,
        preceptor: preceptorLinks,
        directivo: directivoLinks,
        auxiliar: auxiliarLinks,
        centro_estudiantes: centroEstudiantesLinks,
    }[user.role];

    return (
        <aside className="fixed top-0 left-0 z-10 w-64 h-screen bg-card-bg text-text-primary hidden md:flex flex-col">
             <div className="flex items-center justify-center p-4 border-b border-app-border h-[72px]">
                <h2 className="text-lg font-semibold">Navegación</h2>
            </div>
            <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
                {links.map(link => (
                    <button key={link.page} onClick={() => navigate(link.page)}
                        className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${currentPage === link.page ? 'bg-brand-primary text-white' : 'hover:bg-bg-tertiary'}`}>
                        {link.icon}
                        <span>{link.name}</span>
                    </button>
                ))}
            </nav>
            <div className="p-4 mt-auto border-t border-app-border">
                <button onClick={() => navigate('perfil')}
                    className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium text-text-secondary hover:bg-bg-tertiary">
                    <UserCircleIcon className="w-5 h-5"/>
                    <span>Mi Perfil</span>
                </button>
                <button onClick={onLogout}
                    className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium text-text-secondary hover:bg-bg-tertiary hover:text-red-500 transition-colors">
                    <ArrowLeftOnRectangleIcon className="w-5 h-5"/>
                    <span>Cerrar Sesión</span>
                </button>
            </div>
        </aside>
    );
};

const BottomNav: React.FC<{ user: User; currentPage: Page; navigate: (page: Page) => void; }> = ({ user, currentPage, navigate }) => {
    type NavLink = { name: string; page: Page; icon: React.ReactNode; };

    const alumnoLinks: NavLink[] = [ 
        { name: 'Panel', page: 'panel', icon: <ChartBarIcon className="w-6 h-6"/> }, 
        { name: 'Notas', page: 'calificaciones', icon: <AcademicCapIcon className="w-6 h-6"/> }, 
        { name: 'Asistencia', page: 'asistencia', icon: <CheckBadgeIcon className="w-6 h-6"/> },
        { name: 'Agenda', page: 'agenda', icon: <CalendarDaysIcon className="w-6 h-6" /> },
        { name: 'Trámites', page: 'trámites', icon: <PencilSquareIcon className="w-6 h-6"/> },
    ];

    const profesorLinks: NavLink[] = [
        { name: 'Panel', page: 'panel', icon: <ChartBarIcon className="w-6 h-6"/> }, 
        { name: 'Notas', page: 'calificaciones', icon: <PencilSquareIcon className="w-6 h-6"/> }, 
        { name: 'Asistencia', page: 'asistencia', icon: <CheckBadgeIcon className="w-6 h-6"/> },
        { name: 'Agenda', page: 'agenda', icon: <CalendarDaysIcon className="w-6 h-6" /> },
        { name: 'Foros', page: 'foros', icon: <ChatBubbleLeftRightIcon className="w-6 h-6"/> },
    ];
    
    const preceptorLinks: NavLink[] = [
        { name: 'Panel', page: 'panel', icon: <ChartBarIcon className="w-6 h-6"/> },
        { name: 'Asistencia', page: 'asistencia-general', icon: <CheckBadgeIcon className="w-6 h-6"/> },
        { name: 'Trámites', page: 'trámites', icon: <DocumentTextIcon className="w-6 h-6"/> },
        { name: 'Agenda', page: 'agenda', icon: <CalendarDaysIcon className="w-6 h-6" /> },
    ];

    const directivoLinks: NavLink[] = [
        { name: 'Inicio', page: 'panel', icon: <ChartBarIcon className="w-6 h-6" /> },
        { name: 'Personal', page: 'personal', icon: <UserGroupIcon className="w-6 h-6" /> },
        { name: 'Alumnos', page: 'asistencia-general', icon: <AcademicCapIcon className="w-6 h-6" /> },
        { name: 'Stats', page: 'estadisticas', icon: <ChartPieIcon className="w-6 h-6" /> },
        { name: 'Avisos', page: 'comunicados', icon: <MegaphoneIcon className="w-6 h-6" /> },
    ];

    const auxiliarLinks: NavLink[] = [
        { name: 'Inicio', page: 'panel', icon: <ChartBarIcon className="w-6 h-6" /> },
        { name: 'Tareas', page: 'tareas', icon: <WrenchScrewdriverIcon className="w-6 h-6" /> },
        { name: 'Sedes', page: 'instalaciones', icon: <BuildingOfficeIcon className="w-6 h-6" /> },
        { name: 'Mensajes', page: 'mensajes', icon: <InboxIcon className="w-6 h-6" /> },
        { name: 'Turnos', page: 'turnos', icon: <ClockIcon className="w-6 h-6" /> },
    ];
    
    const centroEstudiantesLinks: NavLink[] = [
        { name: 'Inicio', page: 'panel', icon: <ChartBarIcon className="w-6 h-6" /> },
        { name: 'Eventos', page: 'eventos', icon: <CalendarDaysIcon className="w-6 h-6" /> },
        { name: 'Comunidad', page: 'foros', icon: <ChatBubbleLeftRightIcon className="w-6 h-6" /> },
        { name: 'Anuncios', page: 'anuncios', icon: <MegaphoneIcon className="w-6 h-6" /> },
        { name: 'Reclamos', page: 'reclamos', icon: <InboxArrowDownIcon className="w-6 h-6" /> },
    ];

    const links = {
        alumno: alumnoLinks,
        profesor: profesorLinks,
        preceptor: preceptorLinks,
        directivo: directivoLinks,
        auxiliar: auxiliarLinks,
        centro_estudiantes: centroEstudiantesLinks,
    }[user.role].slice(0, 5);

    return (
        <nav className="fixed bottom-0 left-0 right-0 z-20 md:hidden bg-card-bg border-t border-app-border flex justify-around">
            {links.map(link => (
                <button
                    key={link.page}
                    onClick={() => navigate(link.page)}
                    className={`flex flex-col items-center justify-center p-2 w-full text-xs transition-colors ${
                        currentPage === link.page ? 'text-brand-primary' : 'text-text-secondary hover:text-brand-primary'
                    }`}
                >
                    {link.icon}
                    <span className="mt-1">{link.name}</span>
                </button>
            ))}
        </nav>
    );
};

// --- NEW COMPONENT FOR DIRECTOR ROLE ---
const DirectorDashboard: React.FC = () => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card title="Asistencia General" className="md:col-span-1">
                <div className="flex items-center justify-center">
                    <CircularProgress value={MOCK_DIRECTOR_STATS.asistenciaGeneral} text={`${MOCK_DIRECTOR_STATS.asistenciaGeneral}%`} color="#3b82f6" max={100} />
                </div>
            </Card>
            <Card title="Rendimiento Académico" className="md:col-span-1">
                <div className="flex items-center justify-center">
                    <CircularProgress value={MOCK_DIRECTOR_STATS.rendimientoAcademico} text={`${MOCK_DIRECTOR_STATS.rendimientoAcademico}`} color="#10b981" max={10} />
                </div>
            </Card>
             <Card title="Docentes Activos" className="md:col-span-1">
                <p className="text-4xl font-bold text-center">{MOCK_DIRECTOR_STATS.docentesActivos}</p>
            </Card>
            <Card title="Alumnos Inscriptos" className="md:col-span-1">
                <p className="text-4xl font-bold text-center">{MOCK_DIRECTOR_STATS.alumnosInscriptos}</p>
            </Card>
            <div className="md:col-span-2 lg:col-span-4">
                 <Card title="Personal Activo">
                     <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b">
                                    <th className="p-2 text-left">Nombre</th>
                                    <th className="p-2 text-left">Rol</th>
                                    <th className="p-2 text-left">Email</th>
                                </tr>
                            </thead>
                            <tbody>
                                {MOCK_STAFF_LIST.map(staff => (
                                    <tr key={staff.id} className="border-b last:border-0">
                                        <td className="p-2">{staff.name}</td>
                                        <td className="p-2 capitalize">{staff.role}</td>
                                        <td className="p-2">{staff.email}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Card>
            </div>
        </div>
    );
};

// --- NEW COMPONENT FOR AUXILIAR ROLE ---
const AuxiliarDashboard: React.FC = () => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card title="Tareas Pendientes">
                <ul className="space-y-3">
                    {MOCK_AUXILIAR_TASKS.filter(t => t.status !== 'completed').map(task => (
                        <li key={task.id} className="p-3 bg-bg-primary rounded-md flex justify-between items-center">
                            <span>{task.title}</span>
                            <span className={`px-2 py-1 text-xs rounded-full ${task.status === 'in_progress' ? 'bg-yellow-500' : 'bg-red-500'} text-white`}>
                                {task.status === 'in_progress' ? 'En Progreso' : 'Pendiente'}
                            </span>
                        </li>
                    ))}
                </ul>
            </Card>
            <Card title="Reportes de Incidentes">
                <ul className="space-y-3">
                    {MOCK_INCIDENTS.map(incident => (
                        <li key={incident.id} className="p-3 bg-bg-primary rounded-md flex justify-between items-center">
                            <span>{incident.title} ({incident.location})</span>
                            <span className={`px-2 py-1 text-xs rounded-full ${incident.status === 'reported' ? 'bg-red-500' : 'bg-green-500'} text-white`}>
                                {incident.status === 'reported' ? 'Reportado' : 'Resuelto'}
                            </span>
                        </li>
                    ))}
                </ul>
                 <button className="w-full mt-4 bg-brand-primary text-white py-2 rounded-md hover:bg-brand-secondary">Reportar Nuevo Incidente</button>
            </Card>
        </div>
    );
};

// --- NEW COMPONENT FOR CENTRO DE ESTUDIANTES ROLE ---
const StudentCenterDashboard: React.FC = () => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card title="Últimos Anuncios">
                 <ul className="space-y-3">
                    {MOCK_STUDENT_CENTER_ANNOUNCEMENTS.map(ann => (
                        <li key={ann.id} className="p-3 bg-bg-primary rounded-md">
                            <h4 className="font-semibold">{ann.title}</h4>
                            <p className="text-sm text-text-secondary">{ann.content}</p>
                        </li>
                    ))}
                </ul>
            </Card>
             <Card title="Sugerencias y Reclamos">
                 <ul className="space-y-3">
                    {MOCK_STUDENT_CLAIMS.map(claim => (
                        <li key={claim.id} className="p-3 bg-bg-primary rounded-md">
                            <p className="font-semibold">{claim.title}</p>
                            <p className="text-xs text-text-secondary">De: {claim.studentName} - Estado: {claim.status}</p>
                        </li>
                    ))}
                </ul>
            </Card>
        </div>
    );
};

const THEMES = [
    { id: 'sereno', name: 'Sereno', colors: ['#f0eee9', '#ffffff', '#4a6c6f'] },
    { id: 'instituto', name: 'Instituto', colors: ['#f8fafc', '#ffffff', '#14b8a6'] },
    { id: 'celestial', name: 'Celestial', colors: ['#f5f5f5', '#ffffff', '#d4af37'] },
    { id: 'ensueño', name: 'Ensoñación', colors: ['#fdf2f8', '#ffffff', '#ec4899'] },
    { id: 'enfoque', name: 'Enfoque', colors: ['#f0f9ff', '#ffffff', '#0891b2'] },
    { id: 'fantasma', name: 'Fantasma', colors: ['#f9fafb', '#ffffff', '#6b7280'] },
    { id: 'rebelde', name: 'Rebelde', colors: ['#fefce8', '#ffffff', '#eab308'] },
];

const AppearanceMenu: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    mode: 'light' | 'dark';
    onModeChange: (mode: 'light' | 'dark') => void;
    colorTheme: string;
    onColorThemeChange: (theme: string) => void;
}> = ({ isOpen, onClose, mode, onModeChange, colorTheme, onColorThemeChange }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={onClose} aria-modal="true">
            <div className="bg-card-bg rounded-xl shadow-xl w-[90vw] max-w-sm animate-fade-in" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center gap-2 p-4 border-b border-app-border">
                    <button onClick={onClose} className="p-2 -m-2 rounded-full hover:bg-bg-tertiary transition-colors">
                        <ArrowLeftIcon className="w-5 h-5 text-text-primary" />
                    </button>
                    <div>
                        <h3 className="text-lg font-semibold">Modelos de Apariencia</h3>
                        <p className="text-sm text-text-secondary">Personaliza la apariencia de la aplicación.</p>
                    </div>
                </div>
                <div className="p-4 space-y-6">
                    <div className="p-1 space-x-1 bg-bg-secondary rounded-lg flex">
                        <button onClick={() => onModeChange('light')} className={`w-full py-1.5 text-sm font-medium rounded-md transition-colors ${mode === 'light' ? 'bg-card-bg shadow text-brand-primary' : 'text-text-secondary hover:bg-bg-tertiary'}`}>
                            <div className="flex items-center justify-center gap-2">
                                <SunIcon className="w-5 h-5" />
                                <span>Claro</span>
                            </div>
                        </button>
                        <button onClick={() => onModeChange('dark')} className={`w-full py-1.5 text-sm font-medium rounded-md transition-colors ${mode === 'dark' ? 'bg-card-bg shadow text-brand-primary' : 'text-text-secondary hover:bg-bg-tertiary'}`}>
                             <div className="flex items-center justify-center gap-2">
                                <MoonIcon className="w-5 h-5" />
                                <span>Oscuro</span>
                            </div>
                        </button>
                    </div>
                    <div>
                        <div className="flex items-center gap-2 mb-3">
                            <DevicePhoneMobileIcon className="w-5 h-5" />
                            <h4 className="text-md font-semibold">Temas de Color</h4>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            {THEMES.map((theme) => (
                                <button key={theme.id} onClick={() => onColorThemeChange(theme.id)} className={`p-3 border-2 rounded-lg text-left transition-colors ${colorTheme === theme.id ? 'border-brand-primary' : 'border-app-border hover:border-text-secondary'}`}>
                                    <p className="font-semibold">{theme.name}</p>
                                    <div className="flex space-x-2 mt-2">
                                        {theme.colors.map((color, index) => (
                                            <div key={index} className="w-5 h-5 rounded-full" style={{ backgroundColor: color, border: '1px solid var(--color-border)' }}></div>
                                        ))}
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};


// --- MAIN APP COMPONENT ---
const App: React.FC = () => {
    const [user, setUser] = useState<User | null>(null);
    const [currentPage, setCurrentPage] = useState<Page>('panel');
    const [theme, setTheme] = useState<'light' | 'dark'>('light');
    const [colorTheme, setColorTheme] = useState('sereno');
    const [activeMenu, setActiveMenu] = useState<string | null>(null);
    
    // modals state
    const [pendingModalCourse, setPendingModalCourse] = useState<TeacherSummary | null>(null);
    const [contactStudent, setContactStudent] = useState<PendingStudent | UnderperformingStudent | null>(null);
    const [isCommModalOpen, setCommModalOpen] = useState(false);
    const [isUploadModalOpen, setUploadModalOpen] = useState(false);
    const [isAddEventModalOpen, setAddEventModalOpen] = useState(false);
    const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
    const [selectedProcedure, setSelectedProcedure] = useState<ProcedureRequest | null>(null);

    // data state
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [pendingJustifications, setPendingJustifications] = useState(MOCK_PENDING_JUSTIFICATIONS);
    const [materials, setMaterials] = useState(MOCK_MATERIALS);
    const [events, setEvents] = useState(MOCK_CALENDAR_EVENTS);
    const [procedureRequests, setProcedureRequests] = useState(MOCK_PROCEDURE_REQUESTS);

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', colorTheme);
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [theme, colorTheme]);

    const handleLogin = (loggedInUser: User) => {
        setUser(loggedInUser);
        setCurrentPage('panel');
        if(loggedInUser.role === 'alumno') setNotifications(MOCK_STUDENT_NOTIFICATIONS);
        if(loggedInUser.role === 'profesor') setNotifications(MOCK_TEACHER_NOTIFICATIONS);
        if(loggedInUser.role === 'preceptor') setNotifications(MOCK_PRECEPTOR_NOTIFICATIONS);
    };

    const handleLogout = () => {
        setUser(null);
        setNotifications([]);
    };

    const navigate = (page: Page) => {
        setCurrentPage(page);
        setActiveMenu(null);
    };

    const onMenuToggle = (menu: string) => {
        setActiveMenu(prev => (prev === menu ? null : menu));
    };
    
    const handleManageJustification = (id: string, action: 'approve' | 'reject') => {
        setPendingJustifications(prev => prev.filter(j => j.id !== id));
        alert(`Justificación ${action === 'approve' ? 'aprobada' : 'rechazada'}.`);
    };

    const handleUploadMaterial = (newMaterial: Omit<Material, 'id'>) => {
        setMaterials(prev => [{ id: `m-${Date.now()}`, ...newMaterial }, ...prev]);
    };

    const handleAddEvent = (newEventData: Omit<CalendarEvent, 'id'| 'description' | 'isPublic' | 'ownerId'>) => {
        const newEvent: CalendarEvent = {
            ...newEventData,
            id: `evt-${Date.now()}`,
            description: '',
            isPublic: true,
            ownerId: user!.id
        };
        setEvents(prev => [...prev, newEvent]);
    };

    const handleApproveProcedure = (requestId: string, file: File) => {
        setProcedureRequests(prev => prev.map(req => 
            req.id === requestId ? { ...req, status: 'approved' } : req
        ));
        alert(`Trámite de ${selectedProcedure?.studentName} aprobado y archivo ${file.name} enviado.`);
        setSelectedProcedure(null);
    };

    const handleRejectProcedure = (requestId: string) => {
        setProcedureRequests(prev => prev.map(req => 
            req.id === requestId ? { ...req, status: 'rejected' } : req
        ));
        alert(`Trámite de ${selectedProcedure?.studentName} rechazado.`);
        setSelectedProcedure(null);
    };
    
    const renderContent = () => {
        switch (currentPage) {
            case 'panel':
                if (user?.role === 'alumno') return <StudentDashboard navigate={navigate} forumPosts={MOCK_FORUM_POSTS} materials={materials} events={events} />;
                if (user?.role === 'profesor') return <TeacherDashboard user={user} navigate={navigate} onShowPending={setPendingModalCourse} forumPosts={MOCK_FORUM_POSTS} materials={materials} events={events} />;
                if (user?.role === 'preceptor') return <PreceptorDashboard user={user} pendingJustifications={pendingJustifications} onManageJustification={handleManageJustification} onContactStudent={setContactStudent} onShowCommunications={() => setCommModalOpen(true)} navigate={navigate} pendingProcedures={procedureRequests.filter(p=>p.status === 'pending')} forumPosts={MOCK_PRECEPTOR_FORUM_POSTS} events={events} />;
                if (user?.role === 'directivo') return <DirectorDashboard />;
                if (user?.role === 'auxiliar') return <AuxiliarDashboard />;
                if (user?.role === 'centro_estudiantes') return <StudentCenterDashboard />;
                return <div>Panel no disponible para este rol.</div>;
            case 'calificaciones':
                if(user?.role === 'alumno') return <GradesPage />;
                if(user?.role === 'profesor') return <TeacherGradesPage onBack={() => navigate('panel')} />;
                return null;
            case 'asistencia':
                if(user?.role === 'alumno') return <AttendancePage />;
                if(user?.role === 'profesor') return <TeacherAttendancePage onBack={() => navigate('panel')} />;
                return null;
            case 'asistencia-general':
                if (user?.role === 'preceptor' || user?.role === 'directivo') {
                    return <PreceptorAttendancePage onBack={() => navigate('panel')} onViewProfile={(id) => { setSelectedStudentId(id); navigate('alumno-perfil'); }} />;
                }
                return null;
            case 'mensajes':
                return <MessagesPage currentUser={user!} />;
            case 'foros':
                const forumPosts = user?.role === 'preceptor' ? MOCK_PRECEPTOR_FORUM_POSTS : MOCK_FORUM_POSTS;
                return <ForumPage currentUser={user!} initialPosts={forumPosts} />;
            case 'materiales':
                if (user?.role === 'alumno') return <MaterialsSection materials={materials} />;
                if (user?.role === 'profesor') return <TeacherMaterialsPage materials={materials} onUploadClick={() => setUploadModalOpen(true)} onBack={() => navigate('panel')} />;
                return null;
            case 'agenda':
                return <CalendarPage events={events.filter(e => e.isPublic || e.ownerId === user?.id)} onAddEventClick={() => setAddEventModalOpen(true)} />;
            case 'perfil':
                return <ProfilePage user={user!} onUpdate={setUser} onBack={() => navigate('panel')} />;
            case 'trámites':
                 if (user?.role === 'alumno') return <ProceduresPage navigate={navigate} onRequest={(type) => alert(`Solicitud de "${type}" iniciada.`)} />;
                 if (user?.role === 'preceptor') return <PreceptorProceduresPage requests={procedureRequests} onSelectRequest={setSelectedProcedure} onBack={() => navigate('panel')} />;
                 return null;
            case 'alumno-perfil':
                if ((user?.role === 'preceptor' || user?.role === 'directivo') && selectedStudentId) {
                    return <StudentProfilePageForPreceptor studentId={selectedStudentId} onBack={() => { setSelectedStudentId(null); navigate('asistencia-general'); }} />;
                }
                return null;
            // Add cases for other pages based on roles
            default:
                return <div>Página no encontrada</div>;
        }
    };

    if (!user) {
        return <LoginScreen onLogin={handleLogin} />;
    }

    const isSubPage = currentPage !== 'panel';

    return (
        <div className="min-h-screen bg-bg-primary text-text-primary">
            <Sidebar user={user} currentPage={currentPage} navigate={navigate} onLogout={handleLogout} />
            <div className="md:ml-64 flex flex-col h-screen">
                <Header 
                    user={user} 
                    onLogout={handleLogout} 
                    onMenuToggle={onMenuToggle} 
                    activeMenu={activeMenu} 
                    isSubPage={isSubPage}
                    notifications={notifications}
                    navigate={navigate}
                />
                <main className="flex-1 p-4 sm:p-6 overflow-y-auto pb-20 md:p-6 md:pb-6">
                    {renderContent()}
                </main>
                <BottomNav user={user} currentPage={currentPage} navigate={navigate} />
            </div>
            {/* --- Modals --- */}
            <AppearanceMenu 
                isOpen={activeMenu === 'theme'}
                onClose={() => setActiveMenu(null)}
                mode={theme}
                onModeChange={setTheme}
                colorTheme={colorTheme}
                onColorThemeChange={setColorTheme}
            />
            <PendingSubmissionsModal isOpen={!!pendingModalCourse} onClose={() => setPendingModalCourse(null)} course={pendingModalCourse} onContactStudent={setContactStudent} />
            <TeacherContactStudentModal isOpen={!!contactStudent && 'pendingSubmissions' in contactStudent} onClose={() => setContactStudent(null)} student={contactStudent as PendingStudent | null} />
            <ContactStudentModal isOpen={!!contactStudent && 'reason' in contactStudent} onClose={() => setContactStudent(null)} student={contactStudent as UnderperformingStudent | null} />
            <CommunicationModal isOpen={isCommModalOpen} onClose={() => setCommModalOpen(false)} onSend={(sub, msg, rec) => alert(`Comunicado enviado a ${rec}`)} />
            <UploadMaterialModal isOpen={isUploadModalOpen} onClose={() => setUploadModalOpen(false)} onUpload={handleUploadMaterial} subjects={['Programación I', 'Bases de Datos', 'Análisis Matemático']} />
            <AddEventModal isOpen={isAddEventModalOpen} onClose={() => setAddEventModalOpen(false)} onAddEvent={handleAddEvent} />
            <ProcedureDetailModal
                isOpen={!!selectedProcedure}
                onClose={() => setSelectedProcedure(null)}
                request={selectedProcedure}
                onApprove={handleApproveProcedure}
                onReject={handleRejectProcedure}
            />
        </div>
    );
};

export default App;