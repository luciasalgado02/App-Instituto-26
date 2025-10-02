

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import type { User, Role, Attendance, Grade, Conversation, ForumPost, CalendarEvent, Notification, ChatMessage, FinalExamSubject, NewsItem, ClassSchedule, TeacherSummary, PendingStudent, StudentGradeRecord, StudentAttendanceRecord, PendingJustification, UnderperformingStudent, Material, ProcedureRequest } from './types';
import { MOCK_USERS, MOCK_STUDENT_DATA, MOCK_CONVERSATIONS, MOCK_FORUM_POSTS, MOCK_PRECEPTOR_FORUM_POSTS, MOCK_MATERIALS, MOCK_CALENDAR_EVENTS, MOCK_STUDENT_NOTIFICATIONS, MOCK_TEACHER_NOTIFICATIONS, MOCK_PRECEPTOR_NOTIFICATIONS, MOCK_PENDING_JUSTIFICATIONS, MOCK_UNDERPERFORMING_STUDENTS, MOCK_NEWS, MOCK_FINALS_SUBJECTS, MOCK_TODAY_SCHEDULE, MOCK_TEACHER_SCHEDULE, MOCK_TEACHER_SUMMARY, MOCK_PENDING_SUBMISSIONS, MOCK_COURSE_GRADES, MOCK_COURSE_ATTENDANCE, MOCK_PRECEPTOR_ATTENDANCE_DETAIL, MOCK_PROCEDURE_REQUESTS, MOCK_SUBJECTS_BY_YEAR, MOCK_CAREERS, MOCK_STUDENT_PROFILE_DATA } from './constants';

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
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.906 59.906 0 0112 3.493a59.903 59.903 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0l-2.072-1.036A59.922 59.922 0 0112 3.493a59.922 59.922 0 0111.824 5.617l-2.072 1.036m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5z" />
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
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193l-3.72 3.72a1.125 1.125 0 01-1.59 0L13.5 18.5h-1.5a2.25 2.25 0 00-2.25 2.25v-1.5m3.75-12.75-3.75 3.75m3.75-3.75L16.5 11.25m-6-6L4.5 11.25m3.75-3.75-3.75 3.75m6.75 4.5l-3.75 3.75m3.75-3.75l-3.75-3.75m3.75 3.75L13.5 15m-3.75-3.75L6 15m12-9.75L10.5 12" /></svg>
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


type Page = 'panel' | 'calificaciones' | 'asistencia' | 'agenda' | 'mensajes' | 'foros' | 'perfil' | 'materiales' | 'asistencia-general' | 'trámites' | 'alumno-perfil';

// --- REUSABLE UI COMPONENTS ---
const Card: React.FC<{ title?: string; children: React.ReactNode; className?: string; }> = ({ title, children, className = '' }) => (
    <div className={`bg-light-card dark:bg-dark-card rounded-lg shadow-md p-4 sm:p-6 animate-fade-in ${className}`}>
        {title && <h3 className="text-lg font-semibold text-light-text dark:text-dark-text mb-4">{title}</h3>}
        {children}
    </div>
);

const Modal: React.FC<{ isOpen: boolean; onClose: () => void; title: string; children: React.ReactNode; }> = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60" aria-modal="true">
            <div className="bg-light-card dark:bg-dark-card rounded-lg shadow-xl w-full max-w-md m-4 animate-fade-in">
                <div className="flex items-center justify-between p-4 border-b border-light-border dark:border-dark-border">
                    <h3 className="text-lg font-semibold">{title}</h3>
                    <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600">
                        <CloseIcon className="w-5 h-5" />
                    </button>
                </div>
                <div className="p-6">{children}</div>
            </div>
        </div>
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
        const credentials = {
            alumno: { email: 'alumno@example.com', pass: 'password' },
            profesor: { email: 'profesor@example.com', pass: 'password' },
            preceptor: { email: 'preceptor@example.com', pass: 'password' }
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
        <div className="flex items-center justify-center min-h-screen bg-light-bg dark:bg-dark-bg p-4">
            <div className="w-full max-w-md p-6 sm:p-8 space-y-6 sm:space-y-8 bg-light-card rounded-lg shadow-lg dark:bg-dark-card animate-fade-in">
                <div className="text-center">
                    <AcademicCapIcon className="w-16 h-16 mx-auto text-brand-primary"/>
                    <h1 className="mt-4 text-xl sm:text-2xl font-bold text-center text-light-text dark:text-dark-text">Instituto Superior de Formación Docente y Técnica N° 26</h1>
                    <p className="mt-2 text-gray-600 dark:text-gray-400">Inicia sesión para acceder a tu panel</p>
                </div>
                <form className="space-y-4 sm:space-y-6" onSubmit={handleSubmit}>
                    {error && <p className="text-red-500 text-sm text-center">{error}</p>}
                    <div>
                        <label htmlFor="role" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Soy...</label>
                        <select id="role" value={role} onChange={e => setRole(e.target.value as Role)}
                            className="w-full px-3 py-2 mt-1 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-primary focus:border-brand-primary dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                            <option value="alumno">Alumno</option>
                            <option value="profesor">Profesor</option>
                            <option value="preceptor">Preceptor</option>
                        </select>
                    </div>
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Dirección de correo</label>
                        <input id="email" type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder={`ej: ${role}@example.com`}
                            className="w-full px-3 py-2 mt-1 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-primary focus:border-brand-primary dark:bg-gray-700 dark:border-gray-600 dark:text-white"/>
                    </div>
                    <div>
                        <label htmlFor="password"  className="block text-sm font-medium text-gray-700 dark:text-gray-300">Contraseña</label>
                        <input id="password" type="password" required value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••"
                            className="w-full px-3 py-2 mt-1 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-primary focus:border-brand-primary dark:bg-gray-700 dark:border-gray-600 dark:text-white"/>
                    </div>
                    <button type="submit" className="w-full px-4 py-2 font-semibold text-white bg-brand-primary rounded-md hover:bg-brand-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary transition-colors duration-300">
                        Ingresar
                    </button>
                    <div className="text-sm text-center">
                        <a href="#" onClick={(e) => { e.preventDefault(); setForgotModalOpen(true); }} className="font-medium text-brand-primary hover:text-brand-secondary">¿Olvidaste tu contraseña?</a>
                    </div>
                </form>
                 <div className="text-sm text-center text-gray-600 dark:text-gray-400">
                    <span>¿No tienes una cuenta? </span>
                    <a href="#" onClick={(e) => { e.preventDefault(); setRegisterModalOpen(true); }} className="font-medium text-brand-primary hover:text-brand-secondary">Regístrate</a>
                </div>
                <div className="pt-6 border-t border-light-border dark:border-dark-border text-xs text-gray-500 dark:text-gray-400 space-y-3">
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
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Nombre Completo</label>
                    <input type="text" className="w-full p-2 mt-1 bg-transparent border rounded-md dark:border-dark-border" />
                </div>
                 <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Correo Electrónico</label>
                    <input type="email" className="w-full p-2 mt-1 bg-transparent border rounded-md dark:border-dark-border" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Contraseña</label>
                    <input type="password" className="w-full p-2 mt-1 bg-transparent border rounded-md dark:border-dark-border" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Rol</label>
                    <select className="w-full p-2 mt-1 bg-light-bg dark:bg-slate-700 border rounded-md dark:border-dark-border">
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
                    <label htmlFor="recover-email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Correo Electrónico</label>
                    <input id="recover-email" type="email" className="w-full p-2 mt-1 bg-transparent border rounded-md dark:border-dark-border" />
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Se enviará un enlace de recuperación a tu correo electrónico para que puedas crear una nueva contraseña.</p>
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
                    className="text-gray-200 dark:text-gray-700" fill="none" stroke="currentColor" strokeWidth="3"
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
                    <h3 className="text-lg font-semibold text-light-text dark:text-dark-text">Resumen Académico</h3>
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
                    <li key={subject.id} className="flex justify-between items-center p-3 bg-light-bg dark:bg-dark-bg rounded-md">
                        <div>
                            <span className="font-medium">{subject.name}</span>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Fecha: {subject.date}</p>
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
                <label htmlFor="subject-filter-panel" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Filtrar por materia</label>
                <select id="subject-filter-panel" value={selectedSubject} onChange={e => setSelectedSubject(e.target.value)} className="w-full max-w-sm p-2 mt-1 bg-light-bg dark:bg-slate-700 border border-light-border dark:border-dark-border rounded-md focus:ring-brand-primary focus:border-brand-primary">
                    {subjects.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
            </div>
            
            <ul className="space-y-4 max-h-96 overflow-y-auto">
                {filteredMaterials.map(m => (
                    <li key={m.id} className="p-3 bg-light-bg dark:bg-dark-bg rounded-md flex flex-wrap justify-between items-center gap-2">
                        <div>
                            <p className="font-semibold">{m.title}</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">{m.subject} - {m.year}</p>
                        </div>
                        <a href="#" className="text-sm px-3 py-1 border rounded-md dark:border-dark-border hover:bg-gray-100 dark:hover:bg-gray-700 flex-shrink-0">Descargar {m.fileType}</a>
                    </li>
                ))}
                {filteredMaterials.length === 0 && (
                    <p className="text-center text-gray-500 py-6">No hay materiales para la materia seleccionada.</p>
                )}
            </ul>
        </Card>
    );
};


const StudentDashboard: React.FC<{ navigate: (page: Page) => void; forumPosts: ForumPost[]; materials: Material[]; }> = ({ navigate, forumPosts, materials }) => {
    const [isFinalsModalOpen, setFinalsModalOpen] = useState(false);
    const recentPosts = forumPosts.slice(0, 3);

    return (
        <>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="lg:col-span-2">
                    <AcademicSummaryCard />
                </div>
                <Card title="Novedades Importantes">
                    <ul className="space-y-4">
                        {MOCK_NEWS.map(news => (
                             <li key={news.id} className="p-3 bg-light-bg dark:bg-dark-bg rounded-md">
                                <h4 className="font-semibold">{news.title}</h4>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{news.summary}</p>
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
                                <li key={cls.id} className="flex justify-between items-center p-2 rounded-md bg-light-bg dark:bg-dark-bg">
                                    <div>
                                        <p className="font-semibold">{cls.subject}</p>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">{cls.time}</p>
                                    </div>
                                    {cls.virtualLink ? (
                                        <a href={cls.virtualLink} target="_blank" rel="noopener noreferrer"
                                           className="flex items-center gap-2 px-3 py-1 bg-accent-green text-white font-semibold rounded-lg hover:bg-green-600 transition-colors text-sm">
                                            <VideoCameraIcon className="w-4 h-4" />
                                            Unirse
                                        </a>
                                    ) : (
                                        <span className="font-mono text-sm px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded">Aula {cls.classroom}</span>
                                    )}
                                </li>
                            ))}
                        </ul>
                    ) : <p className="text-center text-gray-500 py-4">No tienes clases programadas para hoy.</p>}
                </Card>
                <div className="lg:col-span-2">
                    <Card title="Actividad Reciente en Foros">
                        <ul className="space-y-4">
                            {recentPosts.map(post => (
                                <li key={post.id} className="p-3 bg-light-bg dark:bg-dark-bg rounded-md">
                                    <h4 className="font-semibold">{post.title}</h4>
                                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
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
                <thead className="border-b dark:border-dark-border bg-gray-50 dark:bg-gray-700/50">
                    <tr>
                        <th className="p-2 text-sm font-medium">Evaluación</th>
                        <th className="p-2 text-right text-sm font-medium">Nota</th>
                    </tr>
                </thead>
                <tbody>
                    {grades.filter(g => g.semester === semester).map(g => (
                        <tr key={g.id} className="border-b dark:border-dark-border last:border-b-0">
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
             <div className="p-4 bg-light-card dark:bg-dark-card rounded-lg shadow-md">
                <label htmlFor="year-filter" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Seleccionar Año</label>
                <select id="year-filter" value={selectedYear} onChange={e => setSelectedYear(e.target.value)}
                    className="w-full max-w-xs mt-1 p-2 bg-light-bg dark:bg-slate-700 border border-light-border dark:border-dark-border rounded-md focus:ring-brand-primary focus:border-brand-primary">
                    {years.map(year => <option key={year} value={year}>{year}</option>)}
                </select>
            </div>
            {gradesBySubject.length > 0 ? gradesBySubject.map(({ subject, finalGrade, grades }) => (
                <Card title={subject} key={subject}>
                    <div className="flex justify-between items-center mb-4">
                        <span className="text-gray-600 dark:text-gray-400">Promedio Anual:</span>
                        <span className="text-2xl font-bold text-brand-primary">{finalGrade}</span>
                    </div>
                    {renderSemesterTable(grades, 1)}
                    {renderSemesterTable(grades, 2)}
                </Card>
            )) : (
                <Card>
                    <p className="text-center text-gray-500 py-6">No hay notas cargadas para el año seleccionado.</p>
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
             <div className="border-b border-gray-200 dark:border-gray-700 mb-4">
                <nav className="flex space-x-2" aria-label="Tabs">
                    <button onClick={() => setTab('text')} className={`px-3 py-2 font-medium text-sm rounded-t-md ${tab === 'text' ? 'border-b-2 border-brand-primary text-brand-primary' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'}`}>
                        Explicación
                    </button>
                    <button onClick={() => setTab('upload')} className={`px-3 py-2 font-medium text-sm rounded-t-md ${tab === 'upload' ? 'border-b-2 border-brand-primary text-brand-primary' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'}`}>
                        Subir Certificado
                    </button>
                </nav>
            </div>
            {tab === 'text' && (
                <textarea className="w-full p-2 border rounded-md bg-transparent dark:border-dark-border" rows={5} placeholder="Escribe el motivo de tu ausencia..."></textarea>
            )}
            {tab === 'upload' && (
                <div className="flex items-center justify-center w-full">
                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <UploadIcon className="w-8 h-8 mb-2 text-gray-500 dark:text-gray-400"/>
                            <p className="mb-2 text-sm text-gray-500 dark:text-gray-400"><span className="font-semibold">Click para subir</span> o arrastra</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">PDF, PNG, JPG (MAX. 5MB)</p>
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
                    <label htmlFor="subject-filter-attendance" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Filtrar por materia del año en curso</label>
                    <select 
                        id="subject-filter-attendance" 
                        value={selectedSubject} 
                        onChange={e => setSelectedSubject(e.target.value)}
                        className="w-full max-w-xs mt-1 p-2 bg-light-bg dark:bg-slate-700 border border-light-border dark:border-dark-border rounded-md focus:ring-brand-primary focus:border-brand-primary">
                        <option value="Todas">Todas las materias</option>
                        {currentYearSubjects.map(subject => <option key={subject} value={subject}>{subject}</option>)}
                    </select>
                </div>
                <div className="divide-y dark:divide-dark-border">
                    {displayedAttendance.length > 0 ? displayedAttendance.map(a => (
                        <div key={a.id} className="flex flex-wrap justify-between items-center p-3">
                            <div>
                                <p className="font-semibold">{a.date}</p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">{a.subject}</p>
                            </div>
                            <div className="flex items-center gap-4 mt-2 sm:mt-0">
                                {getStatusChip(a.status)}
                                {a.status === 'ausente' && (
                                    <button onClick={() => handleOpenModal(a)} className="text-sm text-brand-primary hover:underline flex-shrink-0">Justificar</button>
                                )}
                            </div>
                        </div>
                    )) : (
                        <p className="text-center text-gray-500 py-6">No hay registros de asistencia para la materia seleccionada.</p>
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

    const allUsers = useMemo(() => [...MOCK_USERS.alumno, ...MOCK_USERS.profesor, ...MOCK_USERS.preceptor], []);
    
    const contacts = useMemo(() => {
        const allOtherUsers = allUsers.filter(u => u.id !== currentUser.id);
        if (currentUser.role === 'profesor') {
            return allOtherUsers.filter(u => u.role === 'alumno' || u.role === 'preceptor');
        }
        return allOtherUsers;
    }, [allUsers, currentUser]);
    
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
                    <div className="border-b border-light-border dark:border-dark-border mb-2">
                        <nav className="flex -mb-px">
                            <button onClick={() => setActiveTab('inbox')} className={`w-1/2 py-3 text-sm font-medium text-center border-b-2 ${activeTab === 'inbox' ? 'border-brand-primary text-brand-primary' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>Bandeja de Entrada</button>
                            <button onClick={() => setActiveTab('contacts')} className={`w-1/2 py-3 text-sm font-medium text-center border-b-2 ${activeTab === 'contacts' ? 'border-brand-primary text-brand-primary' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>Contactos</button>
                        </nav>
                    </div>
                    {activeTab === 'inbox' ? (
                        <ul className="space-y-2">
                            {conversations.map(convo => (
                                <li key={convo.id} onClick={() => setSelectedConversationId(convo.id)}
                                    className={`p-3 rounded-md cursor-pointer transition-colors ${selectedConversationId === convo.id ? 'bg-brand-primary text-white' : 'hover:bg-gray-100 dark:hover:bg-dark-bg'}`}>
                                    <p className="font-semibold">{getParticipantNames(convo)}</p>
                                    <p className={`text-sm truncate ${selectedConversationId === convo.id ? 'text-indigo-100' : 'text-gray-600 dark:text-gray-400'}`}>{convo.lastMessageSnippet}</p>
                                </li>
                            ))}
                        </ul>
                    ) : (
                         <ul className="space-y-2">
                            {contacts.map(contact => (
                                <li key={contact.id} className="p-3 rounded-md cursor-pointer hover:bg-gray-100 dark:hover:bg-dark-bg flex items-center space-x-3">
                                     <img src={contact.avatarUrl || `https://ui-avatars.com/api/?name=${contact.name.replace(' ', '+')}&background=4f46e5&color=fff&size=40`} alt={contact.name} className="w-10 h-10 rounded-full" />
                                    <div>
                                        <p className="font-semibold">{contact.name}</p>
                                        <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">{contact.role}</p>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </Card>
            </div>
            
            {/* Right Panel: Chat View */}
            <div className={`flex-1 ${selectedConversationId ? 'block' : 'hidden md:flex'}`}>
                <Card className="h-full flex flex-col">
                    {selectedConversation ? (
                        <>
                            <div className="border-b dark:border-dark-border pb-3 mb-4 flex items-center gap-3">
                                <button onClick={() => setSelectedConversationId(null)} className="md:hidden p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
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
                                        <div className={`max-w-xs md:max-w-md p-3 rounded-xl ${msg.senderId === currentUser.id ? 'bg-brand-primary text-white rounded-br-none' : 'bg-gray-200 dark:bg-slate-700 text-light-text dark:text-dark-text rounded-bl-none'}`}>
                                            <p className="text-sm">{msg.text}</p>
                                            <p className={`text-xs mt-1 ${msg.senderId === currentUser.id ? 'text-indigo-200' : 'text-gray-500'}`}>{msg.timestamp}</p>
                                        </div>
                                   </div>
                               ))}
                            </div>
                            <div className="mt-auto flex gap-2">
                                <input type="text" value={newMessage} onChange={(e) => setNewMessage(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                                    className="flex-1 p-2 border rounded-md bg-transparent dark:border-dark-border focus:ring-brand-primary focus:border-brand-primary" placeholder="Escribe tu respuesta..." />
                                <button onClick={handleSendMessage} className="px-4 py-2 bg-brand-primary text-white rounded-md hover:bg-brand-secondary">Enviar</button>
                            </div>
                        </>
                    ) : (
                        <div className="hidden md:flex items-center justify-center h-full">
                            <p className="text-gray-500">Selecciona una conversación o un contacto para empezar a chatear.</p>
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
                    <label htmlFor="post-title" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Título de la duda</label>
                    <input id="post-title" type="text" value={title} onChange={(e) => setTitle(e.target.value)}
                        className="w-full p-2 mt-1 bg-transparent border rounded-md dark:border-dark-border focus:ring-brand-primary focus:border-brand-primary" />
                </div>
                 <div>
                    <label htmlFor="post-category" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Materia</label>
                    <select id="post-category" value={category} onChange={(e) => setCategory(e.target.value)}
                        className="w-full p-2 mt-1 bg-light-bg dark:bg-slate-700 border rounded-md dark:border-dark-border focus:ring-brand-primary focus:border-brand-primary">
                        {categories.filter(c => c !== 'Todas').map(c => <option key={c} value={c} className="bg-light-card dark:bg-dark-card">{c}</option>)}
                    </select>
                </div>
                <div>
                    <label htmlFor="post-content" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Descripción</label>
                     <textarea id="post-content" value={content} onChange={(e) => setContent(e.target.value)} rows={5}
                        className="w-full p-2 mt-1 bg-transparent border rounded-md dark:border-dark-border focus:ring-brand-primary focus:border-brand-primary"
                        placeholder="Describe tu duda o consulta..."></textarea>
                </div>
                <button onClick={handleSubmit} className="w-full mt-4 px-4 py-2 bg-brand-primary text-white rounded-md hover:bg-brand-secondary">Publicar</button>
            </div>
        </Modal>
    );
};


const ForumPage: React.FC<{ currentUser: User; initialPosts: ForumPost[] }> = ({ currentUser, initialPosts }) => {
    const [posts, setPosts] = useState(initialPosts);
    const [selectedPostId, setSelectedPostId] = useState<string | null>(initialPosts[0]?.id || null);
    const [selectedCategory, setSelectedCategory] = useState<string>('Todas');
    const [isNewPostModalOpen, setNewPostModalOpen] = useState(false);
    const [newReply, setNewReply] = useState('');

    const filteredPosts = useMemo(() => {
        if (selectedCategory === 'Todas') return posts;
        return posts.filter(p => p.category === selectedCategory);
    }, [selectedCategory, posts]);

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
            <div className="w-full md:w-1/3 lg:w-1/4">
                 <Card>
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-semibold text-light-text dark:text-dark-text">Foros</h3>
                        <button onClick={() => setNewPostModalOpen(true)} title="Crear Nueva Publicación" className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
                             <PencilSquareIcon className="w-5 h-5 text-brand-primary"/>
                        </button>
                    </div>

                    <div className="mb-4">
                        <select onChange={(e) => setSelectedCategory(e.target.value)} value={selectedCategory} className="w-full p-2 bg-gray-50 dark:bg-gray-700 border rounded-md dark:border-dark-border focus:ring-brand-primary focus:border-brand-primary">
                            {categories.map(c => <option key={c} value={c} className="dark:bg-dark-card">{c}</option>)}
                        </select>
                    </div>
                    <ul className="space-y-2">
                        {filteredPosts.map(post => (
                            <li key={post.id} onClick={() => setSelectedPostId(post.id)}
                                className={`p-3 rounded-md cursor-pointer transition-colors ${selectedPostId === post.id ? 'bg-brand-primary text-white' : 'hover:bg-gray-100 dark:hover:bg-dark-bg'}`}>
                                <p className="font-semibold">{post.title}</p>
                                <p className={`text-xs ${selectedPostId === post.id ? 'text-indigo-100' : 'text-gray-500 dark:text-gray-400'}`}>por {post.author} - {post.replies.length} respuestas</p>
                            </li>
                        ))}
                    </ul>
                </Card>
            </div>
            <div className="flex-1">
                 <Card title={selectedPost?.title || 'Selecciona un tema'} className="h-full flex flex-col">
                    {selectedPost ? (
                       <>
                            <div className="border-b dark:border-dark-border pb-4 mb-4">
                               <p className="text-sm text-gray-500 dark:text-gray-400">Publicado por: {selectedPost.author}</p>
                               <p className="mt-2 prose prose-sm dark:prose-invert max-w-none">{selectedPost.content}</p>
                            </div>
                            <div className="flex-grow overflow-y-auto mb-4 space-y-4">
                                <h4 className="font-semibold">Respuestas</h4>
                                {selectedPost.replies.length > 0 ? selectedPost.replies.map(reply => (
                                    <div key={reply.id} className="p-3 bg-light-bg dark:bg-dark-bg rounded-md">
                                        <p className="font-semibold text-sm">{reply.author}</p>
                                        <p className="text-gray-700 dark:text-gray-300">{reply.content}</p>
                                    </div>
                                )) : <p className="text-sm text-gray-500">No hay respuestas todavía.</p>}
                            </div>
                            <div>
                                <textarea value={newReply} onChange={(e) => setNewReply(e.target.value)} className="w-full p-2 border rounded-md bg-transparent dark:border-dark-border focus:ring-brand-primary focus:border-brand-primary" rows={3} placeholder="Escribe tu respuesta..."></textarea>
                                <button onClick={handleAddReply} className="mt-2 px-4 py-2 bg-brand-primary text-white rounded-md hover:bg-brand-secondary">Responder</button>
                            </div>
                       </>
                    ) : (
                        <div className="flex items-center justify-center h-full">
                             <p className="text-gray-500">Selecciona un tema para participar.</p>
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
    const [dni, setDni] = useState(user.dni || '');
    const [about, setAbout] = useState(user.about || '');

    const handleSave = () => {
        onUpdate({ ...user, name, email, dni, about });
        alert('Perfil actualizado!');
    };

    return (
        <div className="max-w-4xl mx-auto">
            <div className="mb-6">
                <button onClick={onBack} className="flex items-center gap-2 text-sm font-semibold text-gray-600 dark:text-gray-400 hover:text-brand-primary transition-colors">
                    <ArrowLeftIcon className="w-5 h-5" />
                    Volver al Panel
                </button>
            </div>
            <Card title="Mi Perfil">
                <div className="flex flex-col items-center md:flex-row md:items-start gap-6">
                    <div className="flex flex-col items-center">
                        <img src={user.avatarUrl || `https://ui-avatars.com/api/?name=${user.name.replace(' ', '+')}&background=4f46e5&color=fff&size=128`} alt="Avatar" className="w-32 h-32 rounded-full mb-4" />
                        <button className="text-sm text-brand-primary hover:underline">Cambiar foto</button>
                    </div>
                    <div className="w-full flex-1 space-y-4">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Nombre Completo</label>
                            <input id="name" type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full p-2 mt-1 bg-transparent border rounded-md dark:border-dark-border focus:ring-brand-primary focus:border-brand-primary" />
                        </div>
                        {user.career && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Carrera</label>
                                <p className="w-full p-2 mt-1 text-gray-500 dark:text-gray-400 border-b dark:border-dark-border">{user.career}</p>
                            </div>
                        )}
                         <div>
                            <label htmlFor="dni" className="block text-sm font-medium text-gray-700 dark:text-gray-300">DNI</label>
                            <input id="dni" type="text" value={dni} onChange={(e) => setDni(e.target.value)} className="w-full p-2 mt-1 bg-transparent border rounded-md dark:border-dark-border focus:ring-brand-primary focus:border-brand-primary" />
                        </div>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Correo Electrónico</label>
                            <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full p-2 mt-1 bg-transparent border rounded-md dark:border-dark-border focus:ring-brand-primary focus:border-brand-primary" />
                        </div>
                         <div>
                            <label htmlFor="about" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Sobre mí</label>
                            <textarea id="about" value={about} onChange={(e) => setAbout(e.target.value)} rows={3} className="w-full p-2 mt-1 bg-transparent border rounded-md dark:border-dark-border focus:ring-brand-primary focus:border-brand-primary" placeholder="Cuéntanos algo sobre ti..."></textarea>
                        </div>
                        <div className="mt-6 flex justify-end gap-3">
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
                    <label htmlFor="event-title" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Título del Evento</label>
                    <input id="event-title" type="text" value={title} onChange={(e) => setTitle(e.target.value)}
                        className="w-full p-2 mt-1 bg-transparent border rounded-md dark:border-dark-border focus:ring-brand-primary focus:border-brand-primary" />
                </div>
                <div>
                    <label htmlFor="event-day" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Día del Mes</label>
                    <input id="event-day" type="number" value={day} onChange={(e) => setDay(parseInt(e.target.value, 10))} min="1" max="31"
                        className="w-full p-2 mt-1 bg-transparent border rounded-md dark:border-dark-border focus:ring-brand-primary focus:border-brand-primary" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Color</label>
                    <div className="flex space-x-2 mt-2">
                        {colorOptions.map(opt => (
                            <button key={opt.name} onClick={() => setColor(opt.name)}
                                className={`w-8 h-8 rounded-full transition-transform transform hover:scale-110 ${opt.class} ${color === opt.name ? 'ring-2 ring-offset-2 ring-brand-primary dark:ring-offset-dark-card' : ''}`}>
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
            <Card title="Mi Agenda">
                <div className="grid grid-cols-7 gap-1 text-center text-xs sm:text-sm">
                    {['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sá'].map(day => (
                        <div key={day} className="font-semibold p-2 text-gray-600 dark:text-gray-400">{day}</div>
                    ))}
                    {Array.from({ length: firstDayOfMonth }).map((_, i) => <div key={`empty-${i}`}></div>)}
                    {Array.from({ length: daysInMonth }).map((_, dayIndex) => {
                        const day = dayIndex + 1;
                        const dayEvents = getEventsForDay(day);
                        return (
                            <div key={day} className={`p-1 sm:p-2 border border-light-border dark:border-dark-border rounded-md min-h-[70px] sm:min-h-[90px] flex flex-col ${day === today.getDate() && month === today.getMonth() ? 'bg-brand-primary/10 border-brand-primary' : ''}`}>
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
                    <button onClick={onAddEventClick} className="flex items-center gap-2 px-3 py-1.5 bg-brand-primary text-white rounded-md text-sm hover:bg-brand-secondary transition-colors">
                        <PlusCircleIcon className="w-5 h-5" />
                        Añadir
                    </button>
                </div>
                <ul className="space-y-2">
                    {events.length > 0 ? events.sort((a,b) => a.day - b.day).map(event => (
                        <li key={event.id} className="p-3 bg-light-bg dark:bg-dark-bg rounded-md flex items-center">
                            <span className={`w-3 h-3 rounded-full mr-3 flex-shrink-0 ${colorClasses[event.color || 'accent-blue']}`}></span>
                            <div>
                                <p className="font-semibold">{event.title}</p>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Fecha: {event.day}/{month + 1}</p>
                            </div>
                        </li>
                    )) : <p className="text-gray-500 text-sm py-4 text-center">No tienes eventos este mes. ¡Añade uno!</p>}
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
             <h1 className="text-2xl font-bold mb-6 text-light-text dark:text-dark-text">Trámites y Solicitudes</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {procedures.map(proc => (
                    <div key={proc.title} className="bg-light-card dark:bg-slate-800 rounded-xl shadow-lg p-6 flex flex-col items-center text-center animate-fade-in">
                        <div className="mb-4">
                            {proc.icon}
                        </div>
                        <h3 className="text-lg font-semibold text-light-text dark:text-white mb-2">{proc.title}</h3>
                        <p className="text-sm text-gray-600 dark:text-slate-300 mb-6 flex-grow">{proc.description}</p>
                        <button 
                            onClick={() => onRequest(proc.type)}
                            className="w-full px-4 py-3 font-semibold text-slate-900 bg-emerald-400 rounded-lg hover:bg-emerald-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-400 focus:ring-offset-light-card dark:focus:ring-offset-slate-800 transition-colors duration-300"
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
            <button onClick={onBack} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
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
}> = ({ isOpen, onClose, course }) => {
    if (!isOpen || !course) return null;

    const pendingStudents = MOCK_PENDING_SUBMISSIONS[course.id] || [];

    const handleSendNotification = (studentName: string) => {
        alert(`Notificación de recordatorio enviada a ${studentName}.`);
    };
    const handleSendMessage = (studentName: string) => {
        alert(`Mensaje de recordatorio enviado a la bandeja de entrada de ${studentName}.`);
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={`Alumnos Pendientes: ${course.subject}`}>
            <ul className="space-y-3 max-h-80 overflow-y-auto">
                {pendingStudents.length > 0 ? pendingStudents.map(student => (
                    <li key={student.id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-3 bg-light-bg dark:bg-dark-bg rounded-md">
                        <span className="font-medium mb-2 sm:mb-0">{student.name}</span>
                        <div className="flex gap-2 flex-shrink-0">
                            <button onClick={() => handleSendNotification(student.name)} className="px-2 py-1 text-xs rounded-full bg-accent-yellow text-white hover:bg-yellow-600">Enviar Notificación</button>
                            <button onClick={() => handleSendMessage(student.name)} className="px-2 py-1 text-xs rounded-full bg-accent-blue text-white hover:bg-blue-700">Enviar Mensaje</button>
                        </div>
                    </li>
                )) : <p className="text-gray-500 text-center py-4">¡Ningún alumno pendiente!</p>}
            </ul>
            <button onClick={onClose} className="w-full mt-6 px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600">Cerrar</button>
        </Modal>
    );
};

const TeacherDashboard: React.FC<{ user: User; navigate: (page: Page) => void; onShowPending: (summary: TeacherSummary) => void; forumPosts: ForumPost[]; materials: Material[]; }> = ({ user, navigate, onShowPending, forumPosts, materials }) => {
    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold">Bienvenido, {user.name}</h2>
                <p className="text-gray-500 dark:text-gray-400">Aquí tienes un resumen de tu actividad para hoy.</p>
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
                                <li key={cls.id} className="flex justify-between items-center p-2 rounded-md bg-light-bg dark:bg-dark-bg">
                                    <div>
                                        <p className="font-semibold">{cls.subject}</p>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">{cls.time}</p>
                                    </div>
                                    {cls.virtualLink ? (
                                        <a href={cls.virtualLink} target="_blank" rel="noopener noreferrer"
                                           className="flex items-center gap-2 px-3 py-1 bg-accent-green text-white font-semibold rounded-lg hover:bg-green-600 transition-colors text-sm">
                                            <VideoCameraIcon className="w-4 h-4" />
                                            Unirse
                                        </a>
                                    ) : (
                                        <span className="font-mono text-sm px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded">Aula {cls.classroom}</span>
                                    )}
                                </li>
                            ))}
                        </ul>
                    ) : <p className="text-center text-gray-500 py-4">No tienes clases programadas para hoy.</p>}
                </Card>
            </div>
            
            <div>
                <h3 className="text-xl font-semibold mb-4">Resumen de Cursos</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {MOCK_TEACHER_SUMMARY.map(summary => (
                        <Card key={summary.id}>
                            <h4 className="font-bold text-lg">{summary.subject}</h4>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Comisión {summary.commission}</p>
                            <div className="flex justify-between items-center border-t pt-3 mt-3 dark:border-dark-border">
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
                        <li key={m.id} className="p-2 bg-light-bg dark:bg-dark-bg rounded-md flex justify-between items-center">
                            <div>
                                <p className="font-semibold text-sm">{m.title}</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">{m.subject}</p>
                            </div>
                            <span className="text-xs font-mono px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded flex-shrink-0">{m.fileType}</span>
                        </li>
                    ))}
                    {materials.length === 0 && <p className="text-center text-sm text-gray-500 py-4">No hay materiales subidos.</p>}
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
                    <label htmlFor="subject-select" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Seleccione una Materia</label>
                    <select id="subject-select" value={selectedSubject} onChange={(e) => setSelectedSubject(e.target.value)}
                        className="w-full max-w-sm p-2 bg-light-bg dark:bg-slate-700 border border-light-border dark:border-dark-border rounded-md focus:ring-brand-primary focus:border-brand-primary">
                        {subjects.map(subject => <option key={subject} value={subject}>{subject}</option>)}
                    </select>
                </div>
                
                <div className="overflow-x-auto">
                     {/* Desktop Table */}
                     <table className="w-full text-left hidden md:table">
                        <thead className="border-b dark:border-dark-border bg-gray-50 dark:bg-gray-700/50">
                            <tr>
                                <th className="p-3 text-sm font-semibold uppercase">Alumno</th>
                                <th className="p-3 text-center text-sm font-semibold uppercase">1er Cuat.</th>
                                <th className="p-3 text-center text-sm font-semibold uppercase">2do Cuat.</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y dark:divide-dark-border">
                            {grades.map(student => (
                                <tr key={student.id}>
                                    <td className="p-3">{student.name}</td>
                                    <td className="p-3 text-center">
                                        <input type="number" min="0" max="10"
                                            value={student.semester1 ?? ''}
                                            onChange={(e) => handleGradeChange(student.id, 'semester1', e.target.value)}
                                            className="w-16 p-2 text-center bg-light-bg dark:bg-dark-bg border border-light-border dark:border-dark-border rounded-md"
                                        />
                                    </td>
                                    <td className="p-3 text-center">
                                         <input type="number" min="0" max="10"
                                            value={student.semester2 ?? ''}
                                            onChange={(e) => handleGradeChange(student.id, 'semester2', e.target.value)}
                                            className="w-16 p-2 text-center bg-light-bg dark:bg-dark-bg border border-light-border dark:border-dark-border rounded-md"
                                        />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {/* Mobile Card List */}
                    <div className="space-y-3 md:hidden">
                        {grades.map(student => (
                            <div key={student.id} className="p-4 bg-light-bg dark:bg-dark-bg rounded-lg">
                                <p className="font-semibold mb-3">{student.name}</p>
                                <div className="flex items-center justify-between mb-2">
                                    <label htmlFor={`s1-${student.id}`} className="text-sm text-gray-600 dark:text-gray-400">1er Cuatrimestre</label>
                                    <input id={`s1-${student.id}`} type="number" min="0" max="10"
                                        value={student.semester1 ?? ''}
                                        onChange={(e) => handleGradeChange(student.id, 'semester1', e.target.value)}
                                        className="w-20 p-2 text-center bg-white dark:bg-dark-card border border-light-border dark:border-dark-border rounded-md"
                                    />
                                </div>
                                <div className="flex items-center justify-between">
                                    <label htmlFor={`s2-${student.id}`} className="text-sm text-gray-600 dark:text-gray-400">2do Cuatrimestre</label>
                                    <input id={`s2-${student.id}`} type="number" min="0" max="10"
                                        value={student.semester2 ?? ''}
                                        onChange={(e) => handleGradeChange(student.id, 'semester2', e.target.value)}
                                        className="w-20 p-2 text-center bg-white dark:bg-dark-card border border-light-border dark:border-dark-border rounded-md"
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
                            className="px-6 py-2 bg-accent-blue text-white font-semibold rounded-md hover:bg-blue-700 transition-colors disabled:bg-gray-400 dark:disabled:bg-gray-600 disabled:cursor-not-allowed">
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
        null: 'bg-gray-200 dark:bg-gray-600'
    };

    return (
         <div>
            <PageHeader title="Tomar Asistencia" onBack={onBack} />
            <Card>
                <div className="mb-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                        <label htmlFor="subject-select" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Seleccione una Materia</label>
                        <select id="subject-select" value={selectedSubject} onChange={(e) => setSelectedSubject(e.target.value)}
                            className="w-full p-2 bg-light-bg dark:bg-slate-700 border border-light-border dark:border-dark-border rounded-md focus:ring-brand-primary focus:border-brand-primary">
                            {subjects.map(subject => <option key={subject} value={subject}>{subject}</option>)}
                        </select>
                    </div>
                    <div>
                         <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Fecha</label>
                         <input type="date" defaultValue={new Date().toISOString().substring(0, 10)} className="w-full p-2 bg-light-bg dark:bg-slate-700 border border-light-border dark:border-dark-border rounded-md"/>
                    </div>
                </div>
                
                 <div className="overflow-x-auto">
                     <div className="hidden sm:flex justify-between p-3 border-b dark:border-dark-border bg-gray-50 dark:bg-gray-700/50 rounded-t-md">
                        <div className="w-1/2 text-sm font-semibold uppercase">Alumno</div>
                        <div className="w-1/2 text-sm font-semibold uppercase text-center">Estado</div>
                    </div>
                     <div className="divide-y dark:divide-dark-border">
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
                            className="px-6 py-2 bg-accent-blue text-white font-semibold rounded-md hover:bg-blue-700 transition-colors disabled:bg-gray-400 dark:disabled:bg-gray-600 disabled:cursor-not-allowed">
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
                    <label htmlFor="mat-title" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Título</label>
                    <input id="mat-title" type="text" value={title} onChange={e => setTitle(e.target.value)} className="w-full p-2 mt-1 bg-transparent border rounded-md dark:border-dark-border" />
                </div>
                 <div>
                    <label htmlFor="mat-subject" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Materia</label>
                    <select id="mat-subject" value={subject} onChange={e => setSubject(e.target.value)} className="w-full p-2 mt-1 bg-light-bg dark:bg-slate-700 border rounded-md dark:border-dark-border">
                        {subjects.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                </div>
                 <div>
                    <label htmlFor="mat-year" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Año</label>
                    <select id="mat-year" value={year} onChange={e => setYear(e.target.value)} className="w-full p-2 mt-1 bg-light-bg dark:bg-slate-700 border rounded-md dark:border-dark-border">
                        <option>1er Año</option>
                        <option>2do Año</option>
                        <option>3er Año</option>
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Archivo</label>
                    <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-md">
                        <div className="space-y-1 text-center">
                            <UploadIcon className="mx-auto h-12 w-12 text-gray-400" />
                            <div className="flex text-sm text-gray-600 dark:text-gray-400">
                                <label htmlFor="file-upload" className="relative cursor-pointer bg-light-card dark:bg-dark-card rounded-md font-medium text-brand-primary hover:text-brand-secondary focus-within:outline-none">
                                    <span>Selecciona un archivo</span>
                                    <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={e => setFile(e.target.files ? e.target.files[0] : null)} accept=".pdf,.docx,.ppt,.pptx" />
                                </label>
                            </div>
                            {file ? <p className="text-xs text-gray-500">{file.name}</p> : <p className="text-xs text-gray-500">PDF, DOCX, PPT hasta 10MB</p>}
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
                            <li key={m.id} className="p-3 bg-light-bg dark:bg-dark-bg rounded-md flex justify-between items-center">
                                <div>
                                    <p className="font-semibold">{m.title}</p>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">{m.subject} - {m.year}</p>
                                </div>
                                <span className="text-sm font-mono px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded">{m.fileType}</span>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-center text-gray-500 py-6">Aún no has subido ningún material.</p>
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
                    <label htmlFor="comm-recipient-type" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Destinatario</label>
                    <select 
                        id="comm-recipient-type" 
                        value={recipientType} 
                        onChange={e => setRecipientType(e.target.value)} 
                        className="w-full p-2 mt-1 bg-light-bg dark:bg-slate-700 border rounded-md dark:border-dark-border focus:ring-brand-primary focus:border-brand-primary"
                    >
                        <option value="all">Todos los Alumnos</option>
                        <option value="filtered">Filtrar por Carrera y Año</option>
                    </select>
                </div>
                {recipientType === 'filtered' && (
                    <>
                        <div>
                            <label htmlFor="comm-career" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Carrera</label>
                            <select 
                                id="comm-career" 
                                value={selectedCareer} 
                                onChange={e => setSelectedCareer(e.target.value)} 
                                className="w-full p-2 mt-1 bg-light-bg dark:bg-slate-700 border rounded-md dark:border-dark-border focus:ring-brand-primary focus:border-brand-primary"
                            >
                                {careers.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </div>
                        <div>
                            <label htmlFor="comm-year" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Año</label>
                            <select 
                                id="comm-year" 
                                value={selectedYear} 
                                onChange={e => setSelectedYear(e.target.value)} 
                                className="w-full p-2 mt-1 bg-light-bg dark:bg-slate-700 border rounded-md dark:border-dark-border focus:ring-brand-primary focus:border-brand-primary"
                                disabled={availableYears.length === 0}
                            >
                                {availableYears.map(y => <option key={y} value={y}>{y}</option>)}
                            </select>
                        </div>
                    </>
                )}
                <div>
                    <label htmlFor="comm-subject" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Asunto</label>
                    <input id="comm-subject" type="text" value={subject} onChange={e => setSubject(e.target.value)} className="w-full p-2 mt-1 bg-transparent border rounded-md dark:border-dark-border focus:ring-brand-primary focus:border-brand-primary" />
                </div>
                <div>
                    <label htmlFor="comm-message" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Mensaje</label>
                    <textarea id="comm-message" value={message} onChange={e => setMessage(e.target.value)} rows={5} className="w-full p-2 mt-1 bg-transparent border rounded-md dark:border-dark-border focus:ring-brand-primary focus:border-brand-primary"></textarea>
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
                 <div className="border-b border-gray-200 dark:border-gray-700 mb-4">
                    <nav className="flex space-x-2" aria-label="Tabs">
                        <button onClick={() => setContactType('message')} className={`px-3 py-2 font-medium text-sm rounded-t-md ${contactType === 'message' ? 'border-b-2 border-brand-primary text-brand-primary' : 'text-gray-500'}`}>
                            Enviar Mensaje
                        </button>
                        <button onClick={() => setContactType('notice')} className={`px-3 py-2 font-medium text-sm rounded-t-md ${contactType === 'notice' ? 'border-b-2 border-brand-primary text-brand-primary' : 'text-gray-500'}`}>
                            Enviar Aviso
                        </button>
                    </nav>
                </div>
                {contactType === 'message' ? (
                    <div>
                        <label htmlFor="student-message" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Mensaje Personalizado</label>
                        <textarea id="student-message" rows={5} className="w-full p-2 mt-1 bg-transparent border rounded-md dark:border-dark-border" placeholder={`Escribe un mensaje para ${student.name}...`}></textarea>
                    </div>
                ) : (
                    <div>
                         <label htmlFor="student-notice" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Plantilla de Aviso</label>
                         <select id="student-notice" className="w-full p-2 mt-1 bg-light-bg dark:bg-slate-700 border rounded-md dark:border-dark-border">
                            <option>Aviso por inasistencias</option>
                            <option>Aviso por bajo rendimiento académico</option>
                            <option>Solicitud de reunión</option>
                        </select>
                        <p className="text-xs text-gray-500 mt-2">Se enviará una notificación con el aviso seleccionado.</p>
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 p-4 bg-light-bg dark:bg-dark-bg rounded-lg">
                    <div>
                        <label htmlFor="att-date" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Día</label>
                        <input id="att-date" type="date" value={selectedDate} onChange={e => setSelectedDate(e.target.value)}
                            className="w-full p-2 bg-light-card dark:bg-slate-700 border border-light-border dark:border-dark-border rounded-md focus:ring-brand-primary focus:border-brand-primary" />
                    </div>
                     <div>
                        <label htmlFor="att-career" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Carrera</label>
                        <select id="att-career" value={selectedCareer} onChange={e => setSelectedCareer(e.target.value)}
                            className="w-full p-2 bg-light-card dark:bg-slate-700 border border-light-border dark:border-dark-border rounded-md focus:ring-brand-primary focus:border-brand-primary">
                            {careers.map(career => <option key={career} value={career}>{career}</option>)}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="att-year" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Año</label>
                        <select id="att-year" value={selectedYear} onChange={e => setSelectedYear(e.target.value)}
                            className="w-full p-2 bg-light-card dark:bg-slate-700 border border-light-border dark:border-dark-border rounded-md focus:ring-brand-primary focus:border-brand-primary" disabled={!selectedCareer}>
                             {availableYears.map(year => <option key={year} value={year}>{year}</option>)}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="att-subject" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Materia</label>
                        <select id="att-subject" value={selectedSubject} onChange={e => setSelectedSubject(e.target.value)}
                            className="w-full p-2 bg-light-card dark:bg-slate-700 border border-light-border dark:border-dark-border rounded-md focus:ring-brand-primary focus:border-brand-primary" disabled={!selectedYear}>
                           {availableSubjects.map(subject => <option key={subject} value={subject}>{subject}</option>)}
                        </select>
                    </div>
                </div>

                 <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="border-b dark:border-dark-border bg-gray-50 dark:bg-gray-700/50">
                            <tr>
                                <th className="p-3 text-sm font-semibold uppercase">Alumno</th>
                                <th className="p-3 text-sm font-semibold uppercase text-right">Asistencia</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y dark:divide-dark-border">
                            {attendance.length > 0 ? attendance.map(student => {
                                const studentData = allStudents.find(s => s.id === student.id);
                                return (
                                <tr key={student.id}>
                                    <td className="p-3">
                                        <button onClick={() => onViewProfile(student.id)} className="font-medium text-left text-brand-primary hover:underline">
                                            {student.name}
                                        </button>
                                        <span className="block text-xs text-gray-500 dark:text-gray-400">
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
                                    <td colSpan={2} className="p-4 text-center text-gray-500">No hay alumnos para la selección actual.</td>
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
                            className="px-6 py-2 bg-accent-blue text-white font-semibold rounded-md hover:bg-blue-700 transition-colors disabled:bg-gray-400 dark:disabled:bg-gray-600 disabled:cursor-not-allowed">
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
    onManageProcedure: (id: string, action: 'approve' | 'reject') => void;
    onBack: () => void;
}> = ({ requests, onManageProcedure, onBack }) => {
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
        return <span className={`px-2 py-1 text-xs font-medium rounded-full ${styles[status]}`}>{status}</span>;
    };

    return (
        <div>
            <PageHeader title="Gestión de Trámites" onBack={onBack} />
            <Card>
                <div className="flex space-x-2 border-b dark:border-dark-border mb-4 pb-3">
                    {(['pending', 'approved', 'rejected', 'all'] as const).map(tab => (
                        <button
                            key={tab}
                            onClick={() => setFilter(tab)}
                            className={`px-3 py-1.5 text-sm font-medium rounded-md capitalize ${filter === tab ? 'bg-brand-primary text-white' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                        >
                            {tab === 'all' ? 'Todos' : tab}
                        </button>
                    ))}
                </div>

                {filteredRequests.length > 0 ? (
                    <ul className="space-y-3">
                        {filteredRequests.map(req => (
                            <li key={req.id} className="p-4 bg-light-bg dark:bg-dark-bg rounded-md">
                                <div className="flex flex-wrap justify-between items-start gap-2">
                                    <div>
                                        <p className="font-semibold">{req.studentName}</p>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">{req.type}</p>
                                        <p className="text-xs text-gray-500 mt-1">{req.date}</p>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        {getStatusChip(req.status)}
                                        {req.status === 'pending' && (
                                            <div className="flex gap-2">
                                                <button onClick={() => onManageProcedure(req.id, 'approve')} className="px-2 py-1 text-xs rounded-full bg-accent-green text-white hover:bg-green-600">Aprobar</button>
                                                <button onClick={() => onManageProcedure(req.id, 'reject')} className="px-2 py-1 text-xs rounded-full bg-accent-red text-white hover:bg-red-600">Rechazar</button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-center text-gray-500 py-6">No hay solicitudes que coincidan con el filtro.</p>
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
    onManageProcedure: (id: string, action: 'approve' | 'reject') => void;
    forumPosts: ForumPost[];
}> = ({ user, pendingJustifications, onManageJustification, onContactStudent, onShowCommunications, navigate, pendingProcedures, onManageProcedure, forumPosts }) => {
    
    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold">Bienvenido, Preceptor {user.name}</h2>
                <p className="text-gray-500 dark:text-gray-400">Panel de gestión y seguimiento de alumnos.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="lg:col-span-2">
                    <Card title="Acciones Rápidas">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <button onClick={() => navigate('asistencia-general')} className="flex flex-col items-center justify-center p-4 bg-light-bg dark:bg-dark-bg rounded-lg hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors">
                                <ClipboardDocumentCheckIcon className="w-8 h-8 mb-2 text-brand-primary" />
                                <span className="font-semibold text-center">Ver Asistencia General</span>
                            </button>
                             <button onClick={onShowCommunications} className="flex flex-col items-center justify-center p-4 bg-light-bg dark:bg-dark-bg rounded-lg hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors">
                                <MegaphoneIcon className="w-8 h-8 mb-2 text-accent-purple" />
                                <span className="font-semibold text-center">Enviar Comunicado</span>
                            </button>
                            <button onClick={() => navigate('agenda')} className="flex flex-col items-center justify-center p-4 bg-light-bg dark:bg-dark-bg rounded-lg hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors">
                                <CalendarDaysIcon className="w-8 h-8 mb-2 text-accent-blue" />
                                <span className="font-semibold text-center">Ver Agenda</span>
                            </button>
                        </div>
                    </Card>
                </div>
                
                <Card title="Justificaciones Pendientes">
                    {pendingJustifications.length > 0 ? (
                        <ul className="space-y-3 max-h-80 overflow-y-auto">
                            {pendingJustifications.map(justification => (
                                <li key={justification.id} className="p-3 bg-light-bg dark:bg-dark-bg rounded-md">
                                    <p className="font-semibold">{justification.studentName}</p>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">{justification.subject} - {justification.date}</p>
                                    <p className="text-sm italic mt-1">"{justification.reason}"</p>
                                    <div className="flex gap-2 mt-3">
                                        <button onClick={() => onManageJustification(justification.id, 'approve')} className="px-2 py-1 text-xs rounded-full bg-accent-green text-white hover:bg-green-600">Aprobar</button>
                                        <button onClick={() => onManageJustification(justification.id, 'reject')} className="px-2 py-1 text-xs rounded-full bg-accent-red text-white hover:bg-red-600">Rechazar</button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    ) : <p className="text-gray-500 text-center py-4">No hay justificaciones pendientes.</p>}
                </Card>

                <Card title="Solicitudes de Trámites">
                    {pendingProcedures.length > 0 ? (
                        <ul className="space-y-3 max-h-80 overflow-y-auto">
                            {pendingProcedures.map(req => (
                                <li key={req.id} className="p-3 bg-light-bg dark:bg-dark-bg rounded-md">
                                    <p className="font-semibold">{req.studentName}</p>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">{req.type} - {req.date}</p>
                                    <div className="flex gap-2 mt-3">
                                        <button onClick={() => onManageProcedure(req.id, 'approve')} className="px-2 py-1 text-xs rounded-full bg-accent-green text-white hover:bg-green-600">Aprobar</button>
                                        <button onClick={() => onManageProcedure(req.id, 'reject')} className="px-2 py-1 text-xs rounded-full bg-accent-red text-white hover:bg-red-600">Rechazar</button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    ) : <p className="text-gray-500 text-center py-4">No hay solicitudes pendientes.</p>}
                </Card>

                <Card title="Alumnos en Observación">
                     <ul className="space-y-3 max-h-80 overflow-y-auto">
                        {MOCK_UNDERPERFORMING_STUDENTS.map(student => (
                            <li key={student.id} className="p-3 bg-light-bg dark:bg-dark-bg rounded-md">
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
                                <li key={post.id} className="p-3 bg-light-bg dark:bg-dark-bg rounded-md">
                                    <h4 className="font-semibold">{post.title}</h4>
                                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                        en <span className="font-medium">{post.category}</span> por {post.author}
                                    </p>
                                </li>
                            ))}
                        </ul>
                    ) : <p className="text-center text-gray-500 py-4">No hay actividad reciente en los foros.</p>}
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
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
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
                            <p className="text-md text-gray-500 dark:text-gray-400">Legajo: {profileData.legajo}</p>
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
                             <li key={grade.id} className="flex justify-between items-center p-3 bg-light-bg dark:bg-dark-bg rounded-md">
                                <div>
                                    <p className="font-semibold">{grade.title}</p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">{grade.date}</p>
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
                             <li key={exam.subject} className="flex justify-between items-center p-3 bg-light-bg dark:bg-dark-bg rounded-md">
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
                        <p className="text-sm text-gray-500 dark:text-gray-400">El alumno no ha enviado justificaciones.</p>
                    )}
                </Card>
                <Card title="Historial de Mensajes">
                     <p className="text-sm text-gray-500 dark:text-gray-400">El historial de mensajes no está disponible.</p>
                </Card>
            </div>
        </div>
    )
}


// --- LAYOUT COMPONENTS ---
const Header: React.FC<{ user: User; onLogout: () => void; theme: string; toggleTheme: () => void; navigate: (page: Page) => void; isSubPage: boolean; notifications: Notification[] }> = ({ user, onLogout, theme, toggleTheme, navigate, isSubPage, notifications }) => {
    const [notificationsOpen, setNotificationsOpen] = useState(false);
    const [profileMenuOpen, setProfileMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);
    
    return (
        <header className={`sticky top-0 z-20 flex items-center justify-between p-4 shadow-md transition-all duration-300 ${isSubPage ? 'md:hidden' : ''} ${isScrolled ? 'bg-light-card/80 dark:bg-dark-card/80 backdrop-blur-sm' : 'bg-light-card dark:bg-dark-card'}`}>
            <div className="flex items-center space-x-4">
                <AcademicCapIcon className="w-8 h-8 text-brand-primary"/>
                <span className="text-xl font-bold hidden sm:inline">Portal del Instituto</span>
                 <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                    {theme === 'dark' ? <SunIcon className="w-5 h-5" /> : <MoonIcon className="w-5 h-5" />}
                </button>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-4">
                {user.role !== 'preceptor' && (
                    <button onClick={() => navigate('mensajes')} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors" title="Mensajes">
                        <InboxIcon className="w-6 h-6" />
                    </button>
                )}
                <div className="relative">
                     <button onClick={() => setNotificationsOpen(o => !o)} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                        <BellIcon className="w-6 h-6" />
                        {notifications.some(n => !n.read) && <span className="absolute top-1 right-1 block w-2 h-2 bg-red-500 rounded-full"></span>}
                    </button>
                    {notificationsOpen && (
                        <div className="absolute right-0 mt-2 w-72 bg-light-card dark:bg-dark-card border dark:border-dark-border rounded-md shadow-lg animate-fade-in">
                            <div className="p-3 font-semibold border-b dark:border-dark-border">Notificaciones</div>
                            <ul className="py-1 max-h-80 overflow-y-auto">
                                {notifications.map(n => (
                                    <li key={n.id} className="px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">
                                        <p className={`text-sm ${!n.read ? 'font-bold' : ''}`}>{n.title}</p>
                                        <p className="text-xs text-gray-500">{n.date}</p>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
                 <div className="relative">
                    <button onClick={() => setProfileMenuOpen(o => !o)} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                        <img src={user.avatarUrl || `https://ui-avatars.com/api/?name=${user.name.replace(' ', '+')}&background=4f46e5&color=fff&size=32`} alt="Avatar" className="w-8 h-8 rounded-full" />
                    </button>
                    {profileMenuOpen && (
                         <div className="absolute right-0 mt-2 w-48 bg-light-card dark:bg-dark-card border dark:border-dark-border rounded-md shadow-lg animate-fade-in">
                             <ul className="py-1">
                                 <li>
                                     <a href="#" onClick={(e) => { e.preventDefault(); navigate('perfil'); setProfileMenuOpen(false); }}
                                        className="block px-4 py-2 text-sm text-light-text dark:text-dark-text hover:bg-gray-100 dark:hover:bg-gray-700">
                                         Mi Perfil
                                     </a>
                                 </li>
                                 <li>
                                    <button onClick={() => { onLogout(); setProfileMenuOpen(false); }}
                                            className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700">
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
        { name: 'Trámites', page: 'trámites', icon: <PencilSquareIcon className="w-5 h-5"/> },
    ];

    const profesorLinks: NavLink[] = [
        { name: 'Panel Principal', page: 'panel', icon: <ChartBarIcon className="w-5 h-5"/> }, 
        { name: 'Calificaciones', page: 'calificaciones', icon: <PencilSquareIcon className="w-5 h-5"/> }, 
        { name: 'Asistencia', page: 'asistencia', icon: <CheckBadgeIcon className="w-5 h-5"/> },
        { name: 'Agenda', page: 'agenda', icon: <CalendarDaysIcon className="w-5 h-5" /> },
        { name: 'Mensajes', page: 'mensajes', icon: <InboxIcon className="w-5 h-5"/> }, 
        { name: 'Foros', page: 'foros', icon: <ChatBubbleLeftRightIcon className="w-5 h-5"/> }
    ];
    
    const preceptorLinks: NavLink[] = [
        { name: 'Panel Principal', page: 'panel', icon: <ChartBarIcon className="w-5 h-5"/> },
        { name: 'Asistencia', page: 'asistencia-general', icon: <CheckBadgeIcon className="w-5 h-5"/> },
        { name: 'Trámites', page: 'trámites', icon: <DocumentTextIcon className="w-5 h-5"/> },
        { name: 'Agenda', page: 'agenda', icon: <CalendarDaysIcon className="w-5 h-5" /> },
    ];

    const links = user.role === 'alumno' ? alumnoLinks : user.role === 'profesor' ? profesorLinks : preceptorLinks;

    return (
        <aside className="fixed top-0 left-0 z-10 w-64 h-screen bg-dark-card text-dark-text hidden md:flex flex-col">
             <div className="flex items-center justify-center p-4 border-b border-dark-border h-[72px]">
                <h2 className="text-lg font-semibold">Navegación</h2>
            </div>
            <nav className="p-4 flex-grow">
                <ul>
                    {links.map(link => (
                        <li key={link.name}>
                            <a href="#" onClick={(e) => { e.preventDefault(); navigate(link.page); }} 
                               className={`flex items-center p-3 my-1 rounded-md transition-colors ${currentPage === link.page ? 'bg-brand-primary text-white' : 'hover:bg-brand-primary/50'}`}>
                                <span className="mr-3">{link.icon}</span>
                                {link.name}
                            </a>
                        </li>
                    ))}
                </ul>
            </nav>
            <div className="p-4 border-t border-dark-border">
                <a href="#" onClick={(e) => { e.preventDefault(); navigate('perfil'); }}
                   className="flex items-center gap-3 p-2 rounded-md hover:bg-gray-700">
                    <img src={user.avatarUrl || `https://ui-avatars.com/api/?name=${user.name.replace(' ', '+')}&background=4f46e5&color=fff&size=40`} alt="Avatar" className="w-10 h-10 rounded-full" />
                    <div>
                        <p className="font-semibold">{user.name}</p>
                        <p className="text-xs text-gray-400">Ver Perfil</p>
                    </div>
                </a>
            </div>
        </aside>
    );
};

const BottomNav: React.FC<{ user: User; currentPage: Page; navigate: (page: Page) => void; }> = ({ user, currentPage, navigate }) => {
     type NavLink = { name: string; page: Page; icon: React.ReactNode; };

    const alumnoLinks: NavLink[] = [
        { name: 'Panel', page: 'panel', icon: <ChartBarIcon className="w-5 h-5" /> },
        { name: 'Notas', page: 'calificaciones', icon: <AcademicCapIcon className="w-5 h-5" /> },
        { name: 'Asistencia', page: 'asistencia', icon: <CheckBadgeIcon className="w-5 h-5" /> },
        { name: 'Agenda', page: 'agenda', icon: <CalendarDaysIcon className="w-5 h-5" /> },
        { name: 'Trámites', page: 'trámites', icon: <PencilSquareIcon className="w-5 h-5" /> },
    ];

    const profesorLinks: NavLink[] = [
        { name: 'Panel', page: 'panel', icon: <ChartBarIcon className="w-5 h-5" /> },
        { name: 'Notas', page: 'calificaciones', icon: <PencilSquareIcon className="w-5 h-5" /> },
        { name: 'Asistencia', page: 'asistencia', icon: <CheckBadgeIcon className="w-5 h-5" /> },
        { name: 'Mensajes', page: 'mensajes', icon: <InboxIcon className="w-5 h-5" /> },
    ];

    const preceptorLinks: NavLink[] = [
        { name: 'Panel', page: 'panel', icon: <ChartBarIcon className="w-5 h-5"/> },
        { name: 'Asistencia', page: 'asistencia-general', icon: <CheckBadgeIcon className="w-5 h-5"/> },
        { name: 'Trámites', page: 'trámites', icon: <DocumentTextIcon className="w-5 h-5"/> },
        { name: 'Agenda', page: 'agenda', icon: <CalendarDaysIcon className="w-5 h-5" /> },
    ];
    
    const links = user.role === 'alumno' ? alumnoLinks : user.role === 'profesor' ? profesorLinks : preceptorLinks;

    if (links.length === 0) return null;


    return (
        <nav className={`fixed bottom-0 left-0 right-0 z-30 grid grid-cols-${links.length} p-1 bg-light-card border-t border-light-border dark:bg-dark-card dark:border-dark-border md:hidden`}>
            {links.map(link => (
                <a href="#" key={link.page} onClick={(e) => { e.preventDefault(); navigate(link.page); }}
                   className={`flex flex-col items-center justify-center w-full rounded-md p-1 transition-colors ${currentPage === link.page ? 'text-brand-primary' : 'text-gray-600 dark:text-gray-400 hover:text-brand-primary'}`}>
                    {link.icon}
                    <span className="text-[10px] text-center">{link.name}</span>
                </a>
            ))}
        </nav>
    );
}

// --- MAIN APP COMPONENT ---

const TeacherAddEventModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    onAddEvent: (eventData: { title: string; day: number; color: string; isPublic: boolean; notify: boolean; }) => void;
}> = ({ isOpen, onClose, onAddEvent }) => {
    const [title, setTitle] = useState('');
    const [day, setDay] = useState<number>(new Date().getDate());
    const [color, setColor] = useState('accent-blue');
    const [isPublic, setIsPublic] = useState(true);
    const [notify, setNotify] = useState(false);

    const colorOptions = [
        { name: 'accent-blue', class: 'bg-accent-blue' }, { name: 'accent-green', class: 'bg-accent-green' },
        { name: 'accent-purple', class: 'bg-accent-purple' }, { name: 'accent-red', class: 'bg-accent-red' },
        { name: 'accent-yellow', class: 'bg-accent-yellow' },
    ];

    const handleSubmit = () => {
        if (!title.trim() || !day) return;
        onAddEvent({ title, day: Number(day), color, isPublic, notify });
        onClose();
        // Reset state
        setTitle(''); setDay(new Date().getDate()); setColor('accent-blue'); setIsPublic(true); setNotify(false);
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Añadir Evento a la Agenda">
            <div className="space-y-4">
                <div>
                    <label htmlFor="event-title" className="block text-sm font-medium">Título del Evento</label>
                    <input id="event-title" type="text" value={title} onChange={(e) => setTitle(e.target.value)}
                        className="w-full p-2 mt-1 bg-transparent border rounded-md dark:border-dark-border" />
                </div>
                <div>
                    <label htmlFor="event-day" className="block text-sm font-medium">Día del Mes</label>
                    <input id="event-day" type="number" value={day} onChange={(e) => setDay(parseInt(e.target.value, 10))} min="1" max="31"
                        className="w-full p-2 mt-1 bg-transparent border rounded-md dark:border-dark-border" />
                </div>
                <div>
                    <label className="block text-sm font-medium">Color</label>
                    <div className="flex space-x-2 mt-2">
                        {colorOptions.map(opt => (
                            <button key={opt.name} onClick={() => setColor(opt.name)}
                                className={`w-8 h-8 rounded-full transition-transform transform hover:scale-110 ${opt.class} ${color === opt.name ? 'ring-2 ring-offset-2 ring-brand-primary dark:ring-offset-dark-card' : ''}`}>
                            </button>
                        ))}
                    </div>
                </div>
                 <div className="border-t dark:border-dark-border pt-4">
                    <label className="block text-sm font-medium">Visibilidad</label>
                    <div className="flex items-center space-x-4 mt-2">
                        <label className="flex items-center cursor-pointer">
                            <input type="radio" name="visibility" checked={isPublic} onChange={() => setIsPublic(true)} className="h-4 w-4 accent-brand-primary"/>
                            <span className="ml-2">Público (para alumnos)</span>
                        </label>
                        <label className="flex items-center cursor-pointer">
                            <input type="radio" name="visibility" checked={!isPublic} onChange={() => setIsPublic(false)} className="h-4 w-4 accent-brand-primary"/>
                            <span className="ml-2">Privado (solo para mí)</span>
                        </label>
                    </div>
                </div>
                {isPublic && (
                    <div className="pl-6 border-l-2 border-brand-primary/50">
                        <label className="flex items-center cursor-pointer">
                             <input type="checkbox" checked={notify} onChange={(e) => setNotify(e.target.checked)} className="h-4 w-4 accent-brand-primary rounded" />
                             <span className="ml-2 text-sm">Enviar notificación emergente a los alumnos</span>
                        </label>
                        <p className="text-xs text-gray-500 mt-1 ml-6">Marcar si es un evento importante como un parcial o cambio de fecha.</p>
                    </div>
                )}
                <button onClick={handleSubmit} className="w-full mt-4 px-4 py-2 bg-brand-primary text-white rounded-md hover:bg-brand-secondary">Añadir Evento</button>
            </div>
        </Modal>
    );
};

const App: React.FC = () => {
    const [user, setUser] = useState<User | null>(null);
    const [currentPage, setCurrentPage] = useState<Page>('panel');
    const [theme, setTheme] = useState(() => {
        if (typeof window !== 'undefined' && window.localStorage) {
            const savedTheme = localStorage.getItem('theme');
            if (savedTheme) return savedTheme;
            return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        }
        return 'light';
    });
    const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>(MOCK_CALENDAR_EVENTS);
    const [materials, setMaterials] = useState<Material[]>(MOCK_MATERIALS);
    const [studentNotifications, setStudentNotifications] = useState<Notification[]>(MOCK_STUDENT_NOTIFICATIONS);
    const [isAddEventModalOpen, setAddEventModalOpen] = useState(false);
    const [isTeacherAddEventModalOpen, setTeacherAddEventModalOpen] = useState(false);
    const [isPendingModalOpen, setPendingModalOpen] = useState(false);
    const [isUploadModalOpen, setUploadModalOpen] = useState(false);
    const [selectedCourseSummary, setSelectedCourseSummary] = useState<TeacherSummary | null>(null);
    const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
    
    // Preceptor specific state
    const [pendingJustifications, setPendingJustifications] = useState<PendingJustification[]>(MOCK_PENDING_JUSTIFICATIONS);
    const [procedureRequests, setProcedureRequests] = useState<ProcedureRequest[]>(MOCK_PROCEDURE_REQUESTS);
    const [isCommModalOpen, setCommModalOpen] = useState(false);
    const [isContactStudentModalOpen, setContactStudentModalOpen] = useState(false);
    const [selectedStudentToContact, setSelectedStudentToContact] = useState<UnderperformingStudent | null>(null);
    
    const teacherSubjects = useMemo(() => MOCK_TEACHER_SUMMARY.map(s => s.subject), []);

    const notificationsForUser = useMemo(() => {
        if (user?.role === 'profesor') {
            return MOCK_TEACHER_NOTIFICATIONS;
        }
        if (user?.role === 'preceptor') {
            return MOCK_PRECEPTOR_NOTIFICATIONS;
        }
        return studentNotifications;
    }, [user, studentNotifications]);

    const forumPostsForUser = useMemo(() => {
        if (!user) return [];
        if (user.role === 'profesor') {
            const teacherSubjects = MOCK_TEACHER_SUMMARY.map(s => s.subject);
            return MOCK_FORUM_POSTS.filter(post => teacherSubjects.includes(post.category));
        }
        if (user.role === 'preceptor') {
            return MOCK_PRECEPTOR_FORUM_POSTS;
        }
        if (user.role === 'alumno') {
            // Students see a combined view of academic and administrative forums
            return [...MOCK_FORUM_POSTS, ...MOCK_PRECEPTOR_FORUM_POSTS];
        }
        return MOCK_FORUM_POSTS;
    }, [user]);
    
    const eventsForUser = useMemo(() => {
        if (!user) return [];
        if (user.role === 'alumno') {
            // Students see public events and their own private events
            return calendarEvents.filter(e => e.isPublic || e.ownerId === user.id);
        }
        // Teachers and Preceptors see public events and their own private events
        return calendarEvents.filter(e => e.isPublic || e.ownerId === user.id);
    }, [calendarEvents, user]);


    const handleShowPending = (summary: TeacherSummary) => {
        setSelectedCourseSummary(summary);
        setPendingModalOpen(true);
    };
    
    // Preceptor functions
    const handleManageJustification = (id: string, action: 'approve' | 'reject') => {
        alert(`Justificación ${action === 'approve' ? 'aprobada' : 'rechazada'}.`);
        setPendingJustifications(prev => prev.filter(j => j.id !== id));
    };

    const handleManageProcedure = (id: string, action: 'approve' | 'reject') => {
        alert(`Solicitud ${action === 'approve' ? 'aprobada' : 'rechazada'}.`);
        setProcedureRequests(prev => prev.map(req => req.id === id ? { ...req, status: action === 'approve' ? 'approved' : 'rejected' } : req));
    };

    const handleContactStudent = (student: UnderperformingStudent) => {
        setSelectedStudentToContact(student);
        setContactStudentModalOpen(true);
    };
    
    const handleSendCommunication = (subject: string, message: string, recipient: string) => {
        const newNotification: Notification = {
            id: `notif-${Date.now()}`,
            title: `Nuevo comunicado: ${subject}`,
            date: 'ahora mismo',
            read: false,
        };
        setStudentNotifications(prev => [newNotification, ...prev]);

        const today = new Date();
        const newEvent: CalendarEvent = {
            id: `evt-${Date.now()}`,
            day: today.getDate(),
            title: `Comunicado: ${subject}`,
            description: message,
            color: 'accent-red',
            isPublic: true,
            ownerId: user!.id,
        };
        setCalendarEvents(prev => [...prev, newEvent].sort((a,b) => a.day - b.day));

        alert(`Comunicado sobre "${subject}" enviado a ${recipient}.`);
    };

     const handleRequestProcedure = (type: ProcedureRequest['type']) => {
        if (!user) return;
        const newRequest: ProcedureRequest = {
            id: `pr-${Date.now()}`,
            studentId: user.id,
            studentName: user.name,
            type,
            date: new Date().toLocaleDateString('es-AR'),
            status: 'pending',
        };
        setProcedureRequests(prev => [newRequest, ...prev]);
        alert(`Tu solicitud de "${type}" ha sido enviada. Recibirás una notificación cuando sea procesada.`);
    };

    useEffect(() => {
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
        localStorage.setItem('theme', theme);
    }, [theme]);

    const toggleTheme = useCallback(() => {
        setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
    }, []);

    const handleLogin = (loggedInUser: User) => {
        setUser(loggedInUser);
        setCurrentPage('panel');
    };
    
    const handleUpdateUser = (updatedUser: User) => {
        setUser(updatedUser);
    }

    const handleLogout = () => {
        setUser(null);
    }
    
    const handleAddStudentEvent = (newEventData: Omit<CalendarEvent, 'id' | 'description' | 'isPublic' | 'ownerId'>) => {
        const newEvent: CalendarEvent = {
            ...newEventData,
            id: `evt-${Date.now()}`,
            description: 'Evento personal',
            isPublic: false, // Student-added events are private to them
            ownerId: user!.id,
        };
        setCalendarEvents(prev => [...prev, newEvent].sort((a,b) => a.day - b.day));
    };
    
    const handleAddTeacherEvent = (eventData: { title: string; day: number; color: string; isPublic: boolean; notify: boolean; }) => {
        const { title, day, color, isPublic, notify } = eventData;
        const newEvent: CalendarEvent = {
            id: `evt-${Date.now()}`,
            title,
            day,
            color,
            description: 'Evento creado por ' + user?.name,
            isPublic,
            ownerId: user!.id,
        };
        setCalendarEvents(prev => [...prev, newEvent].sort((a,b) => a.day - b.day));
        
        if (isPublic && notify) {
            const newNotification: Notification = {
                id: `notif-${Date.now()}`,
                title: `Nuevo evento en la agenda: ${title}`,
                date: 'ahora mismo',
                read: false,
            };
            setStudentNotifications(prev => [newNotification, ...prev]);
            alert(`Evento público "${title}" creado y notificación enviada a los alumnos.`);
        } else if (isPublic) {
            alert(`Evento público "${title}" creado.`);
        } else {
            alert(`Evento privado "${title}" creado.`);
        }
    };
    
    const handleUploadMaterial = (materialData: Omit<Material, 'id'>) => {
        const newMaterial: Material = {
            ...materialData,
            id: `mat-${Date.now()}`
        };
        setMaterials(prev => [newMaterial, ...prev]);
        alert(`Material "${newMaterial.title}" subido correctamente.`);
    };

    if (!user) {
        return <LoginScreen onLogin={handleLogin} />;
    }

    const renderCurrentPage = () => {
        if (user.role === 'profesor') {
            switch(currentPage) {
                case 'panel': return <TeacherDashboard user={user} navigate={setCurrentPage} onShowPending={handleShowPending} forumPosts={forumPostsForUser} materials={materials} />;
                case 'calificaciones': return <TeacherGradesPage onBack={() => setCurrentPage('panel')} />;
                case 'asistencia': return <TeacherAttendancePage onBack={() => setCurrentPage('panel')} />;
                case 'materiales': return <TeacherMaterialsPage materials={materials} onUploadClick={() => setUploadModalOpen(true)} onBack={() => setCurrentPage('panel')} />;
                case 'agenda': return <CalendarPage events={eventsForUser} onAddEventClick={() => setTeacherAddEventModalOpen(true)} />;
                case 'mensajes': return <MessagesPage currentUser={user} />;
                case 'foros': return <ForumPage currentUser={user} initialPosts={forumPostsForUser} />;
                case 'perfil': return <ProfilePage user={user} onUpdate={handleUpdateUser} onBack={() => setCurrentPage('panel')} />;
                default: return <TeacherDashboard user={user} navigate={setCurrentPage} onShowPending={handleShowPending} forumPosts={forumPostsForUser} materials={materials} />;
            }
        }
        if (user.role === 'preceptor') {
            switch(currentPage) {
                case 'panel': return <PreceptorDashboard 
                                        user={user} 
                                        pendingJustifications={pendingJustifications}
                                        onManageJustification={handleManageJustification}
                                        onContactStudent={handleContactStudent}
                                        onShowCommunications={() => setCommModalOpen(true)}
                                        navigate={setCurrentPage}
                                        pendingProcedures={procedureRequests.filter(p => p.status === 'pending')}
                                        onManageProcedure={handleManageProcedure}
                                        forumPosts={forumPostsForUser}
                                    />;
                case 'asistencia-general': return <PreceptorAttendancePage onBack={() => setCurrentPage('panel')} onViewProfile={(studentId) => { setSelectedStudentId(studentId); setCurrentPage('alumno-perfil'); }} />;
                case 'trámites': return <PreceptorProceduresPage requests={procedureRequests} onManageProcedure={handleManageProcedure} onBack={() => setCurrentPage('panel')} />;
                case 'agenda': return <CalendarPage events={eventsForUser} onAddEventClick={() => setTeacherAddEventModalOpen(true)} />;
                case 'foros': return <ForumPage currentUser={user} initialPosts={forumPostsForUser} />;
                case 'perfil': return <ProfilePage user={user} onUpdate={handleUpdateUser} onBack={() => setCurrentPage('panel')} />;
                case 'alumno-perfil': return selectedStudentId ? <StudentProfilePageForPreceptor studentId={selectedStudentId} onBack={() => { setCurrentPage('asistencia-general'); setSelectedStudentId(null); }} /> : <p>Error: No se ha seleccionado un alumno.</p>;
                default: return <PreceptorDashboard 
                                    user={user} 
                                    pendingJustifications={pendingJustifications}
                                    onManageJustification={handleManageJustification}
                                    onContactStudent={handleContactStudent}
                                    onShowCommunications={() => setCommModalOpen(true)}
                                    navigate={setCurrentPage}
                                    pendingProcedures={procedureRequests.filter(p => p.status === 'pending')}
                                    onManageProcedure={handleManageProcedure}
                                    forumPosts={forumPostsForUser}
                                />;
            }
        }

        // Alumno role pages
        switch (currentPage) {
            case 'panel': return <StudentDashboard navigate={setCurrentPage} forumPosts={forumPostsForUser} materials={materials} />;
            case 'calificaciones': return <GradesPage />;
            case 'asistencia': return <AttendancePage />;
            case 'agenda': return <CalendarPage events={eventsForUser} onAddEventClick={() => setAddEventModalOpen(true)} />;
            case 'mensajes': return <MessagesPage currentUser={user} />;
            case 'foros': return <ForumPage currentUser={user} initialPosts={forumPostsForUser} />;
            case 'trámites': return <ProceduresPage onRequest={handleRequestProcedure} navigate={setCurrentPage} />;
            case 'perfil': return <ProfilePage user={user} onUpdate={handleUpdateUser} onBack={() => setCurrentPage('panel')} />;
            default: return <StudentDashboard navigate={setCurrentPage} forumPosts={forumPostsForUser} materials={materials} />;
        }
    };
    
    const isSubPage = (user.role === 'profesor' && (currentPage === 'calificaciones' || currentPage === 'asistencia' || currentPage === 'materiales')) || (user.role === 'preceptor' && (currentPage === 'asistencia-general' || currentPage === 'trámites' || currentPage === 'alumno-perfil'));


    if (currentPage === 'perfil' || isSubPage) {
        return (
            <div className="min-h-screen bg-light-bg dark:bg-dark-bg">
                {/* Modals for Sub-Pages */}
                <AddEventModal isOpen={isAddEventModalOpen} onClose={() => setAddEventModalOpen(false)} onAddEvent={handleAddStudentEvent} />
                <TeacherAddEventModal isOpen={isTeacherAddEventModalOpen} onClose={() => setTeacherAddEventModalOpen(false)} onAddEvent={handleAddTeacherEvent} />
                <UploadMaterialModal isOpen={isUploadModalOpen} onClose={() => setUploadModalOpen(false)} onUpload={handleUploadMaterial} subjects={teacherSubjects} />
                <PendingSubmissionsModal isOpen={isPendingModalOpen} onClose={() => setPendingModalOpen(false)} course={selectedCourseSummary} />
                <CommunicationModal isOpen={isCommModalOpen} onClose={() => setCommModalOpen(false)} onSend={handleSendCommunication} />
                <ContactStudentModal isOpen={isContactStudentModalOpen} onClose={() => setContactStudentModalOpen(false)} student={selectedStudentToContact} />
                
                {/* Main Header is hidden for sub-pages on desktop, but shown on mobile */}
                 <Header 
                    user={user} 
                    onLogout={handleLogout}
                    theme={theme}
                    toggleTheme={toggleTheme}
                    navigate={setCurrentPage}
                    isSubPage={isSubPage}
                    notifications={notificationsForUser}
                />
                 <div className={`p-4 sm:p-6 lg:p-8 ${isSubPage ? 'md:ml-64' : ''}`}>
                    {renderCurrentPage()}
                </div>
                 {isSubPage && <Sidebar user={user} currentPage={currentPage} navigate={setCurrentPage} onLogout={handleLogout} />}
            </div>
        );
    }
    

    const isMessagesOrForumPage = currentPage === 'mensajes' || currentPage === 'foros';

    return (
        <div className="flex h-screen bg-light-bg dark:bg-dark-bg">
            <AddEventModal isOpen={isAddEventModalOpen} onClose={() => setAddEventModalOpen(false)} onAddEvent={handleAddStudentEvent} />
            <TeacherAddEventModal isOpen={isTeacherAddEventModalOpen} onClose={() => setTeacherAddEventModalOpen(false)} onAddEvent={handleAddTeacherEvent} />
            <UploadMaterialModal isOpen={isUploadModalOpen} onClose={() => setUploadModalOpen(false)} onUpload={handleUploadMaterial} subjects={teacherSubjects} />
            <PendingSubmissionsModal isOpen={isPendingModalOpen} onClose={() => setPendingModalOpen(false)} course={selectedCourseSummary} />
            <CommunicationModal isOpen={isCommModalOpen} onClose={() => setCommModalOpen(false)} onSend={handleSendCommunication} />
            <ContactStudentModal isOpen={isContactStudentModalOpen} onClose={() => setContactStudentModalOpen(false)} student={selectedStudentToContact} />
            <Sidebar 
                user={user}
                currentPage={currentPage}
                navigate={setCurrentPage}
                onLogout={handleLogout}
            />
            <div className="flex-1 flex flex-col md:ml-64">
                <Header 
                    user={user} 
                    onLogout={handleLogout}
                    theme={theme}
                    toggleTheme={toggleTheme}
                    navigate={setCurrentPage}
                    isSubPage={false}
                    notifications={notificationsForUser}
                />
                <main className={`flex-1 overflow-y-auto pb-24 md:pb-8 ${isMessagesOrForumPage ? 'p-0 md:p-4' : 'p-4 sm:p-6 lg:p-8'}`}>
                     <div className={isMessagesOrForumPage ? 'h-full' : ''}>
                        {renderCurrentPage()}
                    </div>
                </main>
                <BottomNav user={user} currentPage={currentPage} navigate={setCurrentPage} />
            </div>
        </div>
    );
};

export default App;