

import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import type { User, Role, Attendance, Grade, Conversation, ForumPost, CalendarEvent, Notification, ChatMessage, FinalExamSubject, NewsItem, ClassSchedule, TeacherSummary, PendingStudent, StudentGradeRecord, StudentAttendanceRecord, PendingJustification, UnderperformingStudent, Material, ProcedureRequest, AuxiliarTask, StudentCenterAnnouncement, StudentClaim, IncidentReport, ForumReply, Career } from './types';
import * as api from './api';
import { FullPageLoader, CardLoader, SkeletonLoader, ErrorMessage } from './components';

declare var jspdf: any;

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

const MagnifyingGlassIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
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
    const [isLoading, setIsLoading] = useState(false);
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
        setError('');
    }, [role]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);
        try {
            const user = await api.login(role, email);
            onLogin(user);
        } catch (err) {
            setError((err as Error).message);
        } finally {
            setIsLoading(false);
        }
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
                    <button type="submit" disabled={isLoading} className="w-full px-4 py-2 font-semibold text-white bg-brand-primary rounded-md hover:bg-brand-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary transition-colors duration-300 disabled:bg-gray-400">
                        {isLoading ? 'Ingresando...' : 'Ingresar'}
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
    const [grades, setGrades] = useState<Grade[]>([]);
    const [attendance, setAttendance] = useState<Attendance[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const [gradesData, attendanceData] = await Promise.all([
                    api.getStudentGrades(),
                    api.getStudentAttendance()
                ]);
                setGrades(gradesData);
                setAttendance(attendanceData);
            } catch (error) {
                console.error("Failed to fetch academic summary data", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const summary = useMemo(() => {
        if (loading || !grades.length || !attendance.length) return null;

        const numericGrades = grades.map(g => Number(g.grade)).filter(n => !isNaN(n));
        const averageGrade = numericGrades.length > 0 ? (numericGrades.reduce((sum, g) => sum + g, 0) / numericGrades.length) : 0;
        
        const totalClasses = attendance.length;
        const presentClasses = attendance.filter(a => a.status === 'presente').length;
        const attendancePercentage = totalClasses > 0 ? Math.round((presentClasses / totalClasses) * 100) : 0;
        
        const gradesBySubject = grades.reduce((acc, grade) => {
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
    }, [grades, attendance, loading]);
    
    if (loading) return <Card><SkeletonLoader className="h-40" /></Card>;
    if (!summary) return <Card><p>No se pudo cargar el resumen académico.</p></Card>;

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
    const [isEnrolling, setIsEnrolling] = useState(false);

    const handleEnroll = async (id: string) => {
        setIsEnrolling(true);
        try {
            await api.enrollInFinals([id]);
            setEnrolled(prev => ({ ...prev, [id]: !prev[id] }));
        } catch(e) {
            alert("Error al inscribirse.")
        } finally {
            setIsEnrolling(false);
        }
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
                            disabled={isEnrolling}
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

// Fix: Add a dedicated page component for materials to handle navigation.
const MaterialsPage: React.FC = () => {
    const [materials, setMaterials] = useState<Material[] | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.getMaterials().then(data => {
            setMaterials(data);
            setLoading(false);
        });
    }, []);

    if(loading || !materials) return <CardLoader lines={8} />;

    return <MaterialsSection materials={materials} />;
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


const StudentDashboard: React.FC<{ navigate: (page: Page) => void; user: User; }> = ({ navigate, user }) => {
    const [data, setData] = useState<{ news: NewsItem[]; schedule: ClassSchedule[]; finals: FinalExamSubject[] } | null>(null);
    const [forumPosts, setForumPosts] = useState<ForumPost[] | null>(null);
    const [materials, setMaterials] = useState<Material[] | null>(null);
    const [events, setEvents] = useState<CalendarEvent[] | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isFinalsModalOpen, setFinalsModalOpen] = useState(false);
    
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const [dashData, forumData, materialData, eventData] = await Promise.all([
                    api.getStudentDashboardData(),
                    api.getForumPosts(user.role),
                    api.getMaterials(),
                    api.getCalendarEvents()
                ]);
                setData(dashData);
                setForumPosts(forumData);
                setMaterials(materialData);
                setEvents(eventData);
            } catch (e) {
                setError("No se pudieron cargar los datos del panel.");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [user.role]);

    if (loading) return (
        <div className="space-y-6">
            <CardLoader lines={4} />
            <CardLoader lines={5} />
            <CardLoader lines={3} />
        </div>
    );

    if (error || !data || !forumPosts || !materials || !events) return <ErrorMessage message={error || "Error desconocido."} />;
    
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
                        {data.news.map(news => (
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
                    {data.schedule.length > 0 ? (
                        <ul className="space-y-3">
                            {data.schedule.map(cls => (
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
            <FinalsModal isOpen={isFinalsModalOpen} onClose={() => setFinalsModalOpen(false)} subjects={data.finals} />
        </>
    );
};

const GradesPage: React.FC = () => {
    const [selectedYear, setSelectedYear] = useState('1er Año');
    const [gradesData, setGradesData] = useState<Grade[] | null>(null);
    const [subjectsByYear, setSubjectsByYear] = useState<Record<string, string[]>>({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const grades = await api.getStudentGrades();
                // This would normally come from an API too
                const subjects = { '1er Año': ['Análisis Matemático', 'Física I', 'Química General', 'Sistemas Operativos'], '2do Año': ['Programación I', 'Bases de Datos'], '3er Año': [], };
                setGradesData(grades);
                setSubjectsByYear(subjects);
            } catch(e) {
                setError("No se pudieron cargar las calificaciones.");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const gradesBySubject = useMemo(() => {
        if (!gradesData || !Array.isArray(gradesData)) return [];
        const subjectsForYear = subjectsByYear[selectedYear] || [];
        const filteredGrades = gradesData.filter(grade => subjectsForYear.includes(grade.subject));

        // Fix: Use a generic parameter for reduce to ensure proper type inference for the accumulator.
        const grouped = filteredGrades.reduce<Record<string, Grade[]>>((acc, grade) => {
            if (!acc[grade.subject]) acc[grade.subject] = [];
            acc[grade.subject].push(grade);
            return acc;
        }, {});
        
        return Object.entries(grouped).map(([subject, grades]) => {
            const numericGrades = grades.map(g => Number(g.grade)).filter(n => !isNaN(n));
            const finalGrade = numericGrades.length > 0 ? (numericGrades.reduce((sum, g) => sum + g, 0) / numericGrades.length).toFixed(2) : 'N/A';
            return { subject, finalGrade, grades };
        });
    }, [selectedYear, gradesData, subjectsByYear]);

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
    
    if (loading) return <CardLoader lines={10} />;
    if (error) return <ErrorMessage message={error} />;

    return (
        <div className="space-y-6">
             <div className="p-4 bg-card-bg rounded-lg shadow-md">
                <label htmlFor="year-filter" className="block text-sm font-medium text-text-primary">Seleccionar Año</label>
                <select id="year-filter" value={selectedYear} onChange={e => setSelectedYear(e.target.value)}
                    className="w-full max-w-xs mt-1 p-2 bg-bg-secondary border border-app-border rounded-md focus:ring-brand-primary focus:border-brand-primary">
                    {Object.keys(subjectsByYear).map(year => <option key={year} value={year}>{year}</option>)}
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
    const [reason, setReason] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    const handleSubmit = async () => {
        if (!absence) return;
        setIsSubmitting(true);
        try {
            await api.submitJustification(absence.id, reason);
            alert('Justificación enviada para revisión.');
            onClose();
        } catch(e) {
            alert('Error al enviar la justificación.');
        } finally {
            setIsSubmitting(false);
        }
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
                <textarea value={reason} onChange={e => setReason(e.target.value)} className="w-full p-2 border rounded-md bg-transparent border-app-border" rows={5} placeholder="Escribe el motivo de tu ausencia..."></textarea>
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
            <button onClick={handleSubmit} disabled={isSubmitting} className="w-full mt-4 px-4 py-2 bg-brand-primary text-white rounded-md hover:bg-brand-secondary disabled:bg-gray-400">
                {isSubmitting ? 'Enviando...' : 'Enviar Justificación'}
            </button>
        </Modal>
    );
}

const AttendancePage: React.FC = () => {
    const [attendance, setAttendance] = useState<Attendance[] | null>(null);
    const [subjects, setSubjects] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    
    const [selectedSubject, setSelectedSubject] = useState('Todas');
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedAbsence, setSelectedAbsence] = useState<Attendance | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const attendanceData = await api.getStudentAttendance();
                setAttendance(attendanceData);
                // In a real app, this would be fetched too. Using a hardcoded list for now.
                const currentYearSubjects = ['Programación I', 'Bases de Datos'];
                setSubjects(currentYearSubjects);
            } catch(e) {
                setError("No se pudo cargar la asistencia.");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleOpenModal = (absence: Attendance) => {
        setSelectedAbsence(absence);
        setModalOpen(true);
    };

    const displayedAttendance = useMemo(() => {
        if (!attendance) return [];
        const parseDate = (dateString: string) => {
            const [day, month, year] = dateString.split('/');
            return new Date(`${year}-${month}-${day}`);
        };

        const filtered = attendance.filter(a => {
            if (selectedSubject === 'Todas') {
                return subjects.includes(a.subject);
            }
            return a.subject === selectedSubject;
        });
        
        return filtered.sort((a, b) => parseDate(b.date).getTime() - parseDate(a.date).getTime());
    }, [selectedSubject, attendance, subjects]);
    
    const getStatusChip = (status: Attendance['status']) => {
        const styles: Record<typeof status, string> = {
            presente: 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300',
            ausente: 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300',
            tarde: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300',
            justificado: 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300'
        };
        return <span className={`px-2 py-1 text-xs font-medium rounded-full ${styles[status]}`}>{status}</span>;
    };
    
    if (loading) return <CardLoader lines={8} />;
    if (error) return <ErrorMessage message={error} />;

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
                        {subjects.map(subject => <option key={subject} value={subject}>{subject}</option>)}
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
    const [conversations, setConversations] = useState<Conversation[] | null>(null);
    const [contactsData, setContactsData] = useState<{ users: User[], careers: Career[] } | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<'inbox' | 'contacts'>('inbox');
    const [newMessage, setNewMessage] = useState('');

    const [contactFilterType, setContactFilterType] = useState<'alumnos' | 'profesores' | 'preceptoría'>('alumnos');
    const [studentContactTab, setStudentContactTab] = useState<'compañeros' | 'profesores' | 'preceptoría'>('compañeros');

    const [selectedCareer, setSelectedCareer] = useState<string>('');
    const [selectedYear, setSelectedYear] = useState<string>('');
    
    const fetchConversations = useCallback(async () => {
        try {
            const convos = await api.getConversations(currentUser.id);
            setConversations(convo => {
                if (window.innerWidth >= 768 && !selectedConversationId && convos.length > 0) {
                    setSelectedConversationId(convos[0].id);
                }
                return convos;
            });
        } catch (e) {
            setError("No se pudieron cargar los mensajes.");
        }
    }, [currentUser.id, selectedConversationId]);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const [convos, contacts] = await Promise.all([
                    api.getConversations(currentUser.id),
                    api.getContacts(currentUser),
                ]);
                setConversations(convos);
                setContactsData(contacts);
                if (contacts.careers.length > 0) {
                    setSelectedCareer(contacts.careers[1]?.name || contacts.careers[0]?.name);
                }
            } catch (e) {
                setError("No se pudieron cargar los datos de mensajería.");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [currentUser]);

    const availableYears = useMemo(() => {
        if (!contactsData) return [];
        const career = contactsData.careers.find(c => c.name === selectedCareer);
        return career ? Object.keys(career.years) : [];
    }, [selectedCareer, contactsData]);
    
    useEffect(() => {
        if (availableYears.length > 0 && !availableYears.includes(selectedYear)) {
            setSelectedYear(availableYears[0]);
        }
    }, [selectedCareer, availableYears, selectedYear]);

    const contacts = useMemo(() => {
        if (!contactsData) return [];
        if (currentUser.role === 'alumno') {
            if (studentContactTab === 'compañeros') return contactsData.users.filter(u => u.role === 'alumno');
            if (studentContactTab === 'profesores') return contactsData.users.filter(u => u.role === 'profesor');
            return contactsData.users.filter(u => u.role === 'preceptor');
        }
        if (currentUser.role === 'profesor' || currentUser.role === 'preceptor') {
            if (contactFilterType === 'alumnos') return contactsData.users.filter(u => u.role === 'alumno');
            if (contactFilterType === 'profesores') return contactsData.users.filter(u => u.role === 'profesor');
            return contactsData.users.filter(u => u.role === 'preceptor');
        }
        return contactsData.users;
    }, [contactsData, currentUser.role, studentContactTab, contactFilterType, selectedCareer, selectedYear]);

    const selectedConversation = useMemo(() => conversations?.find(c => c.id === selectedConversationId), [conversations, selectedConversationId]);

    const getParticipantNames = (convo: Conversation) => {
        if (convo.groupName) return convo.groupName;
        const otherId = Object.keys(convo.participants).find(id => id !== currentUser.id);
        return otherId ? convo.participants[otherId] : 'Desconocido';
    };

    const handleSendMessage = async () => {
        if (!newMessage.trim() || !selectedConversationId) return;
        const newMessageObj: ChatMessage = {
            id: `msg-${Date.now()}`,
            senderId: currentUser.id,
            text: newMessage.trim(),
            timestamp: new Date().toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })
        };
        // Optimistic update
        setConversations(prev => prev!.map(convo => 
            convo.id === selectedConversationId 
            ? { ...convo, messages: [...convo.messages, newMessageObj] } 
            : convo
        ));
        setNewMessage('');
        try {
            await api.sendMessage(selectedConversationId, newMessageObj);
            await fetchConversations(); // Re-sync
        } catch(e) {
            alert('Error al enviar el mensaje.');
            // Here you could revert the optimistic update
        }
    };

    if(loading) return <CardLoader lines={12} />
    if(error || !conversations || !contactsData) return <ErrorMessage message={error || "Error"} />

    return (
        <div className="flex flex-col md:flex-row h-full gap-4">
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
                             {(currentUser.role === 'profesor' || currentUser.role === 'preceptor') && (
                                <div className="space-y-3 mb-4">
                                     <div className="flex bg-bg-secondary p-1 rounded-md">
                                        <button onClick={() => setContactFilterType('alumnos')} className={`w-1/3 text-center py-1 rounded text-sm font-medium ${contactFilterType === 'alumnos' ? 'bg-card-bg shadow text-brand-primary' : 'text-text-secondary'}`}>Alumnos</button>
                                        <button onClick={() => setContactFilterType('profesores')} className={`w-1/3 text-center py-1 rounded text-sm font-medium ${contactFilterType === 'profesores' ? 'bg-card-bg shadow text-brand-primary' : 'text-text-secondary'}`}>Profesores</button>
                                        <button onClick={() => setContactFilterType('preceptoría')} className={`w-1/3 text-center py-1 rounded text-sm font-medium ${contactFilterType === 'preceptoría' ? 'bg-card-bg shadow text-brand-primary' : 'text-text-secondary'}`}>Preceptoría</button>
                                    </div>
                                    {contactFilterType === 'alumnos' && (
                                        <>
                                            <select value={selectedCareer} onChange={e => setSelectedCareer(e.target.value)} className="w-full p-2 bg-bg-secondary border border-app-border rounded-md text-sm">
                                                {contactsData.careers.map(c => <option key={c.name} value={c.name}>{c.name}</option>)}
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
                                        {msg.senderId !== currentUser.id && contactsData.users &&(
                                            <img src={contactsData.users.find(u => u.id === msg.senderId)?.avatarUrl || `https://ui-avatars.com/api/?name=${selectedConversation.participants[msg.senderId]?.replace(' ', '+')}&background=6366f1&color=fff&size=32`} alt="avatar" className="w-8 h-8 rounded-full"/>
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
    onAddPost: (post: Omit<ForumPost, 'id' | 'replies' | 'lastActivity' | 'author'>) => Promise<void>;
    categories: string[];
}> = ({ isOpen, onClose, onAddPost, categories }) => {
    const [title, setTitle] = useState('');
    const [category, setCategory] = useState(categories.find(c => c !== 'Todas') || '');
    const [content, setContent] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async () => {
        if (!title.trim() || !category.trim() || !content.trim()) {
            alert('Por favor, completa todos los campos.');
            return;
        }
        setIsSubmitting(true);
        try {
            await onAddPost({ title, category, content });
            onClose();
            setTitle('');
            setCategory(categories.find(c => c !== 'Todas') || '');
            setContent('');
        } catch(e) {
            alert("Error al crear la publicación.");
        } finally {
            setIsSubmitting(false);
        }
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
                <button onClick={handleSubmit} disabled={isSubmitting} className="w-full mt-4 px-4 py-2 bg-brand-primary text-white rounded-md hover:bg-brand-secondary disabled:bg-gray-400">
                    {isSubmitting ? 'Publicando...' : 'Publicar'}
                </button>
            </div>
        </Modal>
    );
};


const ForumPage: React.FC<{ currentUser: User; }> = ({ currentUser }) => {
    const [posts, setPosts] = useState<ForumPost[] | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
    const [selectedCategory, setSelectedCategory] = useState<string>('Todas');
    const [isNewPostModalOpen, setNewPostModalOpen] = useState(false);
    const [newReply, setNewReply] = useState('');
    const [isReplying, setIsReplying] = useState(false);

    const fetchPosts = useCallback(async () => {
        setLoading(true);
        try {
            const postData = await api.getForumPosts(currentUser.role);
            setPosts(postData);
            if (window.innerWidth >= 768 && !selectedPostId && postData.length > 0) {
                setSelectedPostId(postData[0].id);
            }
        } catch (e) {
            setError("No se pudieron cargar los foros.");
        } finally {
            setLoading(false);
        }
    }, [currentUser.role, selectedPostId]);
    
    useEffect(() => { fetchPosts(); }, [fetchPosts]);

    const filteredPosts = useMemo(() => {
        if (!posts) return [];
        if (selectedCategory === 'Todas') return posts;
        return posts.filter(p => p.category === selectedCategory);
    }, [selectedCategory, posts]);

    useEffect(() => {
        if (window.innerWidth >= 768 && posts) {
            const currentPostInFiltered = filteredPosts.find(p => p.id === selectedPostId);
            if (!currentPostInFiltered && filteredPosts.length > 0) {
                setSelectedPostId(filteredPosts[0].id);
            } else if (filteredPosts.length === 0) {
                setSelectedPostId(null);
            }
        }
    }, [filteredPosts, selectedPostId, posts]);

    const selectedPost = useMemo(() => posts?.find(p => p.id === selectedPostId), [selectedPostId, posts]);
    const categories = useMemo(() => ['Todas', ...Array.from(new Set(posts?.map(p => p.category) || []))], [posts]);

    const handleAddNewPost = async (newPostData: Omit<ForumPost, 'id' | 'replies' | 'lastActivity' | 'author'>) => {
        const newPost = await api.createForumPost(newPostData, currentUser);
        await fetchPosts();
        setSelectedPostId(newPost.id);
    };

    const handleAddReply = async () => {
        if (!newReply.trim() || !selectedPostId) return;
        setIsReplying(true);
        try {
            const replyData = { author: currentUser.name, content: newReply.trim() };
            await api.addForumReply(selectedPostId, replyData, currentUser.role);
            setNewReply('');
            // Optimistic update of just one post
            const updatedPost = await api.getForumPosts(currentUser.role).then(allPosts => allPosts.find(p => p.id === selectedPostId));
            if (updatedPost) {
                setPosts(prev => prev!.map(p => p.id === selectedPostId ? updatedPost : p));
            } else {
                fetchPosts(); // Fallback to full refetch
            }
        } catch (e) {
            alert("Error al enviar la respuesta.");
        } finally {
            setIsReplying(false);
        }
    };
    
    if (loading) return <div className="flex h-full gap-4"><CardLoader /><div className="flex-1 hidden md:block"><CardLoader lines={8}/></div></div>;
    if (error || !posts) return <ErrorMessage message={error || "Error"} />;

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
                                <button onClick={handleAddReply} disabled={isReplying} className="w-full sm:w-auto mt-2 px-4 py-2 bg-brand-primary text-white rounded-md hover:bg-brand-secondary disabled:bg-gray-400">
                                    {isReplying ? 'Enviando...' : 'Responder'}
                                </button>
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
    const [isSaving, setIsSaving] = useState(false);

    const handleSave = async () => {
        setIsSaving(true);
        try {
            const updatedUser = await api.updateUser({ ...user, name, email, about });
            onUpdate(updatedUser);
            alert('Perfil actualizado!');
        } catch(e) {
            alert('Error al actualizar el perfil.');
        } finally {
            setIsSaving(false);
        }
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
                            <button onClick={handleSave} disabled={isSaving} className="px-4 py-2 bg-brand-primary text-white rounded-md hover:bg-brand-secondary disabled:bg-gray-400">
                                {isSaving ? 'Guardando...' : 'Guardar Cambios'}
                            </button>
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

const CalendarPage: React.FC<{ user: User; onAddEventClick: () => void; }> = ({ user, onAddEventClick }) => {
    const [events, setEvents] = useState<CalendarEvent[] | null>(null);
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
        api.getCalendarEvents().then(data => {
            setEvents(data);
            setLoading(false);
        });
    }, []);

    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const getEventsForDay = (day: number) => events?.filter(e => e.day === day) || [];
    
    const colorClasses: Record<string, string> = {
        'accent-blue': 'bg-accent-blue', 'accent-purple': 'bg-accent-purple', 'accent-yellow': 'bg-accent-yellow', 'accent-red': 'bg-accent-red', 'accent-green': 'bg-accent-green',
    };
    
    if(loading) return <CardLoader lines={10} />;
    if(!events) return <ErrorMessage message="No se pudo cargar la agenda." />;
    
    const userEvents = events.filter(e => e.isPublic || e.ownerId === user?.id);

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
                    {userEvents.length > 0 ? userEvents.sort((a,b) => a.day - b.day).map(event => (
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
    const [students, setStudents] = useState<PendingStudent[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if(isOpen && course) {
            setLoading(true);
            api.getPendingSubmissions(course.id).then(data => {
                setStudents(data);
                setLoading(false);
            });
        }
    }, [isOpen, course]);

    if (!isOpen || !course) return null;

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={`Alumnos Pendientes: ${course.subject}`}>
             {loading ? <SkeletonLoader className="h-40" /> : (
                <ul className="space-y-3 max-h-80 overflow-y-auto">
                    {students.length > 0 ? students.map(student => (
                        <li key={student.id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-3 bg-bg-primary rounded-md">
                            <span className="font-medium mb-2 sm:mb-0">{student.name}</span>
                            <div className="flex gap-2 flex-shrink-0">
                                <button onClick={() => onContactStudent(student)} className="px-2 py-1 text-xs rounded-full bg-accent-yellow text-white hover:bg-yellow-600">Enviar Notificación</button>
                                <button onClick={() => onContactStudent(student)} className="px-2 py-1 text-xs rounded-full bg-accent-blue text-white hover:bg-blue-700">Enviar Mensaje</button>
                            </div>
                        </li>
                    )) : <p className="text-text-secondary text-center py-4">¡Ningún alumno pendiente!</p>}
                </ul>
             )}
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

const TeacherDashboard: React.FC<{ user: User; navigate: (page: Page) => void; onShowPending: (summary: TeacherSummary) => void; }> = ({ user, navigate, onShowPending }) => {
    const [data, setData] = useState<{ schedule: ClassSchedule[], summary: TeacherSummary[] } | null>(null);
    const [materials, setMaterials] = useState<Material[] | null>(null);
    const [events, setEvents] = useState<CalendarEvent[] | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const [dashData, materialData, eventData] = await Promise.all([
                    api.getTeacherDashboardData(),
                    api.getMaterials(),
                    api.getCalendarEvents()
                ]);
                setData(dashData);
                setMaterials(materialData);
                setEvents(eventData);
            } catch (e) {
                console.error(e)
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading || !data || !materials || !events) return (
        <div className="space-y-6">
            <div className="h-10"><SkeletonLoader className="h-full w-1/3" /></div>
            <CardLoader lines={2} />
            <CardLoader lines={5} />
            <CardLoader lines={3} />
        </div>
    );
    
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
                    {data.schedule.length > 0 ? (
                        <ul className="space-y-3">
                            {data.schedule.map(cls => (
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
                    {data.summary.map(summary => (
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
                </ul>
                <button 
                    onClick={() => navigate('materiales')} 
                    className="w-full px-4 py-2 font-semibold text-white bg-brand-primary rounded-md hover:bg-brand-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary transition-colors duration-300"
                >
                    Gestionar Materiales
                </button>
            </Card>

             <div className="lg:col-span-2">
                <Card title="Actividad Reciente en Foros">
                     <ul className="space-y-4">
                        {/* Placeholder for teacher's forum posts */}
                    </ul>
                    <button 
                        onClick={() => navigate('foros')} 
                        className="w-full mt-4 px-4 py-2 font-semibold text-white bg-brand-primary rounded-md hover:bg-brand-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary transition-colors duration-300"
                    >
                        Ir a los Foros
                    </button>
                </Card>
            </div>
        </div>
    );
};

// ... ALL OTHER COMPONENTS (Preceptor, Director, etc.) can be defined here, following the same structure ...


const TeacherMaterialsPage: React.FC<{onBack: () => void;}> = ({onBack}) => {
    const [materials, setMaterials] = useState<Material[] | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.getMaterials().then(data => {
            setMaterials(data);
            setLoading(false);
        });
    }, []);

    const handleUpload = async () => {
        // Mock upload
        const newMaterial = {
            title: 'Nuevo Material de Prueba',
            subject: 'Programación I',
            fileType: 'PDF' as 'PDF',
            year: '2do Año'
        };
        const uploaded = await api.uploadMaterial(newMaterial);
        setMaterials(prev => prev ? [uploaded, ...prev] : [uploaded]);
    };

    if (loading || !materials) return (
        <>
            <PageHeader title="Gestionar Material de Estudio" onBack={onBack} />
            <CardLoader lines={8}/>
        </>
    );

    return (
        <>
            <PageHeader title="Gestionar Material de Estudio" onBack={onBack}>
                 <button onClick={handleUpload} className="flex items-center gap-2 px-4 py-2 bg-brand-primary text-white font-semibold rounded-lg hover:bg-brand-secondary transition-colors text-sm">
                    <UploadIcon className="w-5 h-5" />
                    Subir Nuevo Material
                </button>
            </PageHeader>
            <Card>
                <ul className="divide-y divide-app-border">
                    {materials.map(m => (
                         <li key={m.id} className="p-3 flex justify-between items-center">
                            <div>
                                <p className="font-semibold">{m.title}</p>
                                <p className="text-sm text-text-secondary">{m.subject} - {m.year}</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="font-mono text-sm px-2 py-1 bg-bg-tertiary rounded">{m.fileType}</span>
                                <button className="p-1.5 rounded-full hover:bg-bg-tertiary"><PencilSquareIcon className="w-5 h-5"/></button>
                            </div>
                        </li>
                    ))}
                </ul>
            </Card>
        </>
    );
};

const TeacherGradesPage: React.FC<{ onBack: () => void; }> = ({ onBack }) => {
    const [courses, setCourses] = useState<TeacherSummary[]>([]);
    const [selectedCourse, setSelectedCourse] = useState<TeacherSummary | null>(null);
    const [grades, setGrades] = useState<StudentGradeRecord[]>([]);
    const [loading, setLoading] = useState(true);
    const [courseLoading, setCourseLoading] = useState(false);
    const [hasSaved, setHasSaved] = useState(false);
    
    useEffect(() => {
        api.getTeacherDashboardData().then(data => {
            setCourses(data.summary);
            if (data.summary.length > 0) {
              setSelectedCourse(data.summary[0]);
            }
            setLoading(false);
        });
    }, []);

    useEffect(() => {
        if (selectedCourse) {
            setCourseLoading(true);
            setHasSaved(false); // Reset save status on course change
            api.getCourseGrades(selectedCourse.subject).then(data => {
                setGrades(data);
                setCourseLoading(false);
            });
        }
    }, [selectedCourse]);
    
    const handleGradeChange = (studentId: string, semester: 'semester1' | 'semester2', value: string) => {
        const newGrade = value === '' ? null : Number(value);
        if (newGrade !== null && (isNaN(newGrade) || newGrade < 1 || newGrade > 10)) return;
        setGrades(prev => prev.map(s => s.id === studentId ? { ...s, [semester]: newGrade } : s));
    };

    const handleSaveChanges = async () => {
        if (!selectedCourse) return;
        setCourseLoading(true);
        try {
            await api.saveCourseGrades(selectedCourse.subject, grades);
            setHasSaved(true);
            alert("Notas guardadas exitosamente.");
        } catch(e) {
            alert("Error al guardar las notas.");
        } finally {
            setCourseLoading(false);
        }
    };

    const handleDownloadPDF = () => {
        if (!selectedCourse || grades.length === 0) return;
        const { jsPDF } = jspdf;
        const doc = new jsPDF();
        
        doc.text(`Calificaciones - ${selectedCourse.subject} (${selectedCourse.commission})`, 14, 15);
        
        doc.autoTable({
            startY: 20,
            head: [['Alumno', '1er Cuatrimestre', '2do Cuatrimestre']],
            body: grades.map(g => [g.name, g.semester1 ?? 'N/A', g.semester2 ?? 'N/A']),
        });

        doc.save(`Calificaciones-${selectedCourse.subject.replace(' ', '_')}.pdf`);
    };


    if (loading) return <FullPageLoader />;

    return (
        <>
            <PageHeader title="Cargar Calificaciones" onBack={onBack} />
            <div className="mb-6">
                <label htmlFor="course-select-grades" className="block text-sm font-medium text-text-primary">Seleccionar Curso</label>
                <select id="course-select-grades" value={selectedCourse?.id || ''} onChange={e => setSelectedCourse(courses.find(c => c.id === e.target.value) || null)} className="w-full max-w-sm p-2 mt-1 bg-bg-secondary border border-app-border rounded-md focus:ring-brand-primary focus:border-brand-primary">
                    {courses.map(c => <option key={c.id} value={c.id}>{c.subject} - {c.commission}</option>)}
                </select>
            </div>
            <Card>
                {courseLoading ? <SkeletonLoader className="h-96" /> : (
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                         <thead className="border-b border-app-border bg-bg-secondary">
                            <tr>
                                <th className="p-3 font-semibold">Alumno</th>
                                <th className="p-3 font-semibold text-center w-40">1er Cuatrimestre</th>
                                <th className="p-3 font-semibold text-center w-40">2do Cuatrimestre</th>
                            </tr>
                        </thead>
                        <tbody>
                            {grades.map(student => (
                                <tr key={student.id} className="border-b border-app-border last:border-b-0">
                                    <td className="p-3 font-medium">{student.name}</td>
                                    <td className="p-2">
                                        <input type="number" min="1" max="10" value={student.semester1 ?? ''} onChange={e => handleGradeChange(student.id, 'semester1', e.target.value)}
                                            className="w-full p-2 text-center bg-transparent border rounded-md border-app-border focus:ring-brand-primary focus:border-brand-primary" />
                                    </td>
                                    <td className="p-2">
                                        <input type="number" min="1" max="10" value={student.semester2 ?? ''} onChange={e => handleGradeChange(student.id, 'semester2', e.target.value)}
                                            className="w-full p-2 text-center bg-transparent border rounded-md border-app-border focus:ring-brand-primary focus:border-brand-primary" />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                )}
                 <div className="mt-6 flex flex-col sm:flex-row justify-end gap-3">
                    <button onClick={handleSaveChanges} disabled={courseLoading} className="px-6 py-2 bg-brand-primary text-white rounded-md hover:bg-brand-secondary disabled:bg-gray-400">Guardar Cambios</button>
                    {hasSaved && (
                        <button onClick={handleDownloadPDF} disabled={courseLoading || grades.length === 0} className="flex items-center justify-center gap-2 px-6 py-2 bg-bg-tertiary text-text-primary rounded-md hover:bg-app-border disabled:opacity-50 animate-fade-in">
                            <ArrowDownTrayIcon className="w-5 h-5" />
                            Descargar PDF
                        </button>
                    )}
                </div>
            </Card>
        </>
    );
};

const TeacherAttendancePage: React.FC<{onBack: () => void;}> = ({onBack}) => {
    const [courses, setCourses] = useState<TeacherSummary[]>([]);
    const [selectedCourse, setSelectedCourse] = useState<TeacherSummary | null>(null);
    const [attendance, setAttendance] = useState<StudentAttendanceRecord[]>([]);
    const [loading, setLoading] = useState(true);
    const [courseLoading, setCourseLoading] = useState(false);
    const [hasSaved, setHasSaved] = useState(false);

    useEffect(() => {
        api.getTeacherDashboardData().then(data => {
            setCourses(data.summary);
            if (data.summary.length > 0) {
              setSelectedCourse(data.summary[0]);
            }
            setLoading(false);
        });
    }, []);

    useEffect(() => {
        if (selectedCourse) {
            setCourseLoading(true);
            setHasSaved(false); // Reset save status on course change
            api.getCourseAttendance(selectedCourse.subject).then(data => {
                setAttendance(data);
                setCourseLoading(false);
            });
        }
    }, [selectedCourse]);

    const handleStatusChange = (studentId: string, status: StudentAttendanceRecord['status']) => {
        setAttendance(prev => prev.map(s => s.id === studentId ? { ...s, status } : s));
    };

    const handleSaveChanges = async () => {
        if (!selectedCourse) return;
        setCourseLoading(true);
        try {
            await api.saveCourseAttendance(selectedCourse.subject, attendance);
            setHasSaved(true);
            alert("Asistencia guardada exitosamente.");
        } catch(e) {
            alert("Error al guardar la asistencia.");
        } finally {
            setCourseLoading(false);
        }
    };
    
    const handleDownloadPDF = () => {
        if (!selectedCourse || attendance.length === 0) return;
        const { jsPDF } = jspdf;
        const doc = new jsPDF();
        const today = new Date().toLocaleDateString('es-AR');
        
        doc.text(`Asistencia - ${selectedCourse.subject} (${selectedCourse.commission})`, 14, 15);
        doc.text(`Fecha: ${today}`, 14, 22);
        
        doc.autoTable({
            startY: 30,
            head: [['Alumno', 'Estado']],
            body: attendance.map(a => [a.name, a.status ? a.status.charAt(0).toUpperCase() + a.status.slice(1) : 'No cargado']),
        });

        doc.save(`Asistencia-${today.replace(/\//g, '-')}-${selectedCourse.subject.replace(' ', '_')}.pdf`);
    };

    if (loading) return <FullPageLoader />;
    
    return (
        <>
         <PageHeader title="Tomar Asistencia" onBack={onBack}/>
          <div className="mb-6">
                <label htmlFor="course-select-attendance" className="block text-sm font-medium text-text-primary">Seleccionar Curso</label>
                <select id="course-select-attendance" value={selectedCourse?.id || ''} onChange={e => setSelectedCourse(courses.find(c => c.id === e.target.value) || null)} className="w-full max-w-sm p-2 mt-1 bg-bg-secondary border border-app-border rounded-md focus:ring-brand-primary focus:border-brand-primary">
                    {courses.map(c => <option key={c.id} value={c.id}>{c.subject} - {c.commission}</option>)}
                </select>
            </div>
         <Card>
            {courseLoading ? <SkeletonLoader className="h-96" /> : (
                 <div className="overflow-x-auto">
                    <table className="w-full text-left">
                         <thead className="border-b border-app-border bg-bg-secondary">
                            <tr>
                                <th className="p-3 font-semibold">Alumno</th>
                                <th className="p-3 font-semibold text-center">Estado</th>
                            </tr>
                        </thead>
                        <tbody>
                            {attendance.map(student => (
                                <tr key={student.id} className="border-b border-app-border last:border-b-0">
                                    <td className="p-3 font-medium">{student.name}</td>
                                    <td className="p-2">
                                        <div className="flex justify-center gap-x-2 sm:gap-x-4">
                                            {(['presente', 'ausente', 'tarde'] as const).map(status => (
                                                <label key={status} className="flex items-center gap-2 cursor-pointer text-sm">
                                                    <input 
                                                        type="radio"
                                                        name={`attendance-${student.id}`}
                                                        value={status}
                                                        checked={student.status === status}
                                                        onChange={() => handleStatusChange(student.id, status)}
                                                        className="form-radio h-4 w-4 text-brand-primary focus:ring-brand-primary"
                                                    />
                                                    {status.charAt(0).toUpperCase() + status.slice(1)}
                                                </label>
                                            ))}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
             <div className="mt-6 flex flex-col sm:flex-row justify-end gap-3">
                    <button onClick={handleSaveChanges} disabled={courseLoading} className="px-6 py-2 bg-brand-primary text-white rounded-md hover:bg-brand-secondary disabled:bg-gray-400">
                      Guardar Asistencia
                    </button>
                    {hasSaved && (
                        <button onClick={handleDownloadPDF} disabled={courseLoading || attendance.length === 0} className="flex items-center justify-center gap-2 px-6 py-2 bg-bg-tertiary text-text-primary rounded-md hover:bg-app-border disabled:opacity-50 animate-fade-in">
                            <ArrowDownTrayIcon className="w-5 h-5" />
                            Descargar PDF
                        </button>
                    )}
                </div>
         </Card>
        </>
    );
}

const PreceptorGeneralAttendancePage: React.FC<{onBack: () => void;}> = ({onBack}) => {
    const [attendanceData, setAttendanceData] = useState<{ careers: Career[], attendanceDetail: Record<string, Record<string, StudentAttendanceRecord[]>> } | null>(null);
    const [selectedCareer, setSelectedCareer] = useState('');
    const [selectedYear, setSelectedYear] = useState('');
    const [selectedSubject, setSelectedSubject] = useState('');
    const [attendance, setAttendance] = useState<StudentAttendanceRecord[]>([]);
    const [loading, setLoading] = useState(true);
    const [courseLoading, setCourseLoading] = useState(false);
    const [hasSaved, setHasSaved] = useState(false);

    useEffect(() => {
        api.getGeneralAttendanceData().then(data => {
            setAttendanceData(data);
            if (data.careers.length > 0) {
                setSelectedCareer(data.careers[0].name);
            }
            setLoading(false);
        });
    }, []);

    const availableYears = useMemo(() => {
        if (!attendanceData || !selectedCareer) return [];
        const career = attendanceData.careers.find(c => c.name === selectedCareer);
        return career ? Object.keys(career.years) : [];
    }, [selectedCareer, attendanceData]);
    
    const availableSubjects = useMemo(() => {
        if (!attendanceData || !selectedCareer || !selectedYear) return [];
        const career = attendanceData.careers.find(c => c.name === selectedCareer);
        return career?.years[selectedYear] || [];
    }, [selectedCareer, selectedYear, attendanceData]);

    useEffect(() => {
        if (availableYears.length > 0 && !availableYears.includes(selectedYear)) {
            setSelectedYear(availableYears[0]);
        }
    }, [selectedCareer, availableYears, selectedYear]);
    
    useEffect(() => {
        if (availableSubjects.length > 0 && !availableSubjects.includes(selectedSubject)) {
            setSelectedSubject(availableSubjects[0]);
        }
    }, [selectedYear, availableSubjects, selectedSubject]);
    
    useEffect(() => {
        if (attendanceData && selectedCareer && selectedYear && selectedSubject) {
            setCourseLoading(true);
            setHasSaved(false);
            const students = attendanceData.attendanceDetail[selectedYear]?.[selectedSubject] || [];
            // Make a copy to avoid direct state mutation issues with mock data
            setAttendance(JSON.parse(JSON.stringify(students)));
            setCourseLoading(false);
        } else {
            setAttendance([]);
        }
    }, [selectedCareer, selectedYear, selectedSubject, attendanceData]);

    const handleStatusChange = (studentId: string, status: StudentAttendanceRecord['status']) => {
        setAttendance(prev => prev.map(s => s.id === studentId ? { ...s, status } : s));
        setHasSaved(false);
    };

    const handleSaveChanges = async () => {
        if (!selectedSubject) return;
        setCourseLoading(true);
        try {
            await api.saveGeneralAttendance(selectedCareer, selectedYear, selectedSubject, attendance);
            setHasSaved(true);
            alert("Asistencia guardada exitosamente.");
        } catch(e) {
            alert("Error al guardar la asistencia.");
        } finally {
            setCourseLoading(false);
        }
    };

    const handleDownloadPDF = () => {
        if (!selectedSubject || attendance.length === 0) return;
        const { jsPDF } = jspdf;
        const doc = new jsPDF();
        const today = new Date().toLocaleDateString('es-AR');
        
        doc.text(`Asistencia General - ${selectedSubject}`, 14, 15);
        doc.text(`${selectedCareer} - ${selectedYear}`, 14, 22);
        doc.text(`Fecha: ${today}`, 14, 29);
        
        doc.autoTable({
            startY: 35,
            head: [['Alumno', 'Estado']],
            body: attendance.map(a => [a.name, a.status ? a.status.charAt(0).toUpperCase() + a.status.slice(1) : 'No cargado']),
        });

        doc.save(`Asistencia-${selectedSubject.replace(' ', '_')}-${today.replace(/\//g, '-')}.pdf`);
    };

    if (loading) return <FullPageLoader />;

    return (
        <>
         <PageHeader title="Asistencia General" onBack={onBack}/>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div>
                    <label htmlFor="career-select" className="block text-sm font-medium text-text-primary">Carrera</label>
                    <select id="career-select" value={selectedCareer} onChange={e => setSelectedCareer(e.target.value)} className="w-full p-2 mt-1 bg-bg-secondary border border-app-border rounded-md focus:ring-brand-primary focus:border-brand-primary">
                        {attendanceData?.careers.map(c => <option key={c.name} value={c.name}>{c.name}</option>)}
                    </select>
                </div>
                 <div>
                    <label htmlFor="year-select" className="block text-sm font-medium text-text-primary">Año</label>
                    <select id="year-select" value={selectedYear} onChange={e => setSelectedYear(e.target.value)} disabled={availableYears.length === 0} className="w-full p-2 mt-1 bg-bg-secondary border border-app-border rounded-md focus:ring-brand-primary focus:border-brand-primary">
                       {availableYears.map(y => <option key={y} value={y}>{y}</option>)}
                    </select>
                </div>
                 <div>
                    <label htmlFor="subject-select" className="block text-sm font-medium text-text-primary">Materia</label>
                    <select id="subject-select" value={selectedSubject} onChange={e => setSelectedSubject(e.target.value)} disabled={availableSubjects.length === 0} className="w-full p-2 mt-1 bg-bg-secondary border border-app-border rounded-md focus:ring-brand-primary focus:border-brand-primary">
                        {availableSubjects.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                </div>
            </div>
         <Card>
            {courseLoading ? <SkeletonLoader className="h-96" /> : attendance.length > 0 ? (
                 <div className="overflow-x-auto">
                    <table className="w-full text-left">
                         <thead className="border-b border-app-border bg-bg-secondary">
                            <tr>
                                <th className="p-3 font-semibold">Alumno</th>
                                <th className="p-3 font-semibold text-center">Estado</th>
                            </tr>
                        </thead>
                        <tbody>
                            {attendance.map(student => (
                                <tr key={student.id} className="border-b border-app-border last:border-b-0">
                                    <td className="p-3 font-medium">{student.name}</td>
                                    <td className="p-2">
                                        <div className="flex justify-center gap-x-2 sm:gap-x-4">
                                            {(['presente', 'ausente', 'tarde'] as const).map(status => (
                                                <label key={status} className="flex items-center gap-2 cursor-pointer text-sm">
                                                    <input 
                                                        type="radio"
                                                        name={`attendance-${student.id}`}
                                                        value={status}
                                                        checked={student.status === status}
                                                        onChange={() => handleStatusChange(student.id, status)}
                                                        className="form-radio h-4 w-4 text-brand-primary focus:ring-brand-primary"
                                                    />
                                                    {status.charAt(0).toUpperCase() + status.slice(1)}
                                                </label>
                                            ))}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <p className="text-center text-text-secondary py-10">Seleccione una carrera, año y materia para ver los alumnos.</p>
            )}
             <div className="mt-6 flex flex-col sm:flex-row justify-end gap-3">
                    <button onClick={handleSaveChanges} disabled={courseLoading || attendance.length === 0} className="px-6 py-2 bg-brand-primary text-white rounded-md hover:bg-brand-secondary disabled:bg-gray-400">
                      Guardar Asistencia
                    </button>
                    {hasSaved && (
                        <button onClick={handleDownloadPDF} disabled={courseLoading || attendance.length === 0} className="flex items-center justify-center gap-2 px-6 py-2 bg-bg-tertiary text-text-primary rounded-md hover:bg-app-border disabled:opacity-50 animate-fade-in">
                            <ArrowDownTrayIcon className="w-5 h-5" />
                            Descargar PDF
                        </button>
                    )}
                </div>
         </Card>
        </>
    );
};

const UploadProcedureModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    request: ProcedureRequest | null;
    onUpload: (id: string) => void;
}> = ({ isOpen, onClose, request, onUpload }) => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [isUploading, setIsUploading] = useState(false);

    useEffect(() => {
        if (!isOpen) {
            setSelectedFile(null);
            setIsUploading(false);
        }
    }, [isOpen]);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            setSelectedFile(event.target.files[0]);
        }
    };

    const handleConfirmUpload = () => {
        if (!request) return;
        setIsUploading(true);
        // Simulate upload delay
        setTimeout(() => {
            onUpload(request.id);
            onClose();
        }, 1000);
    };

    if (!request) return null;

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={`Subir Documento para ${request.type}`}>
            <div className="space-y-4">
                <p>Subiendo documento para: <span className="font-semibold">{request.studentName}</span></p>
                <div>
                    <label htmlFor="file-upload" className="w-full flex flex-col items-center justify-center px-4 py-6 bg-bg-secondary text-text-secondary rounded-lg border-2 border-dashed border-app-border cursor-pointer hover:bg-bg-tertiary">
                        <UploadIcon className="w-8 h-8 mb-2"/>
                        <span className="text-sm font-medium">{selectedFile ? selectedFile.name : 'Seleccionar archivo PDF'}</span>
                        <input id="file-upload" type="file" className="hidden" onChange={handleFileChange} accept=".pdf" />
                    </label>
                </div>
                <button
                    onClick={handleConfirmUpload}
                    disabled={!selectedFile || isUploading}
                    className="w-full mt-4 px-4 py-2 bg-brand-primary text-white rounded-md hover:bg-brand-secondary disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                    {isUploading ? 'Subiendo...' : 'Subir y Aprobar'}
                </button>
            </div>
        </Modal>
    );
};


const PreceptorProceduresPage: React.FC<{onBack: () => void;}> = ({onBack}) => {
    const [requests, setRequests] = useState<ProcedureRequest[] | null>(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'pending' | 'approved' | 'rejected'>('pending');
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
    const [selectedRequestForUpload, setSelectedRequestForUpload] = useState<ProcedureRequest | null>(null);


    const fetchRequests = useCallback(async () => {
        try {
            const data = await api.getProcedureRequests();
            setRequests(data);
        } catch (error) {
            console.error("Failed to fetch procedures", error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchRequests();
    }, [fetchRequests]);

    const handleManageRequest = async (id: string, status: 'approved' | 'rejected') => {
        setLoading(true);
        try {
            await api.manageProcedure(id, status);
            await fetchRequests(); // Refetch to update the list
        } catch (error) {
             alert('Error al procesar la solicitud.');
             setLoading(false);
        }
    };
    
    const handleOpenUploadModal = (request: ProcedureRequest) => {
        setSelectedRequestForUpload(request);
        setIsUploadModalOpen(true);
    };

    const handleConfirmUpload = (id: string) => {
        handleManageRequest(id, 'approved');
    };

    const filteredRequests = useMemo(() => {
        if (!requests) return [];
        return requests.filter(req => req.status === activeTab);
    }, [requests, activeTab]);

    const ProcedureList = ({ list }: { list: ProcedureRequest[] }) => {
        if (list.length === 0) {
            return <p className="text-center text-text-secondary py-10">No hay trámites en esta categoría.</p>;
        }
        return (
            <ul className="divide-y divide-app-border">
                {list.map(req => (
                    <li key={req.id} className="p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                        <div>
                            <p className="font-bold text-text-primary">{req.studentName}</p>
                            <p className="text-sm text-text-secondary">{req.type}</p>
                            <p className="text-xs text-text-secondary mt-1">Solicitado: {req.date}</p>
                        </div>
                        {activeTab === 'pending' && (
                            <div className="flex gap-2 self-end sm:self-center flex-shrink-0">
                                <button onClick={() => handleOpenUploadModal(req)} className="flex items-center gap-2 px-3 py-1.5 bg-accent-blue text-white rounded-md text-sm hover:bg-blue-600">
                                    <UploadIcon className="w-4 h-4" />
                                    Subir PDF
                                </button>
                                <button onClick={() => handleManageRequest(req.id, 'rejected')} className="px-3 py-1.5 bg-accent-red text-white rounded-md text-sm hover:bg-red-600">
                                    Rechazar
                                </button>
                            </div>
                        )}
                    </li>
                ))}
            </ul>
        );
    };

    return (
        <>
            <PageHeader title="Gestionar Trámites" onBack={onBack} />
            <Card>
                <div className="border-b border-app-border">
                    <nav className="flex space-x-2 -mb-px" aria-label="Tabs">
                        <button onClick={() => setActiveTab('pending')} className={`px-4 py-3 font-medium text-sm border-b-2 ${activeTab === 'pending' ? 'border-brand-primary text-brand-primary' : 'border-transparent text-text-secondary hover:text-text-primary'}`}>
                            Pendientes
                        </button>
                        <button onClick={() => setActiveTab('approved')} className={`px-4 py-3 font-medium text-sm border-b-2 ${activeTab === 'approved' ? 'border-brand-primary text-brand-primary' : 'border-transparent text-text-secondary hover:text-text-primary'}`}>
                            Aprobadas
                        </button>
                         <button onClick={() => setActiveTab('rejected')} className={`px-4 py-3 font-medium text-sm border-b-2 ${activeTab === 'rejected' ? 'border-brand-primary text-brand-primary' : 'border-transparent text-text-secondary hover:text-text-primary'}`}>
                            Rechazadas
                        </button>
                    </nav>
                </div>
                {loading && !requests ? <SkeletonLoader className="h-64 mt-4" /> : <ProcedureList list={filteredRequests} />}
            </Card>
             <UploadProcedureModal
                isOpen={isUploadModalOpen}
                onClose={() => setIsUploadModalOpen(false)}
                request={selectedRequestForUpload}
                onUpload={handleConfirmUpload}
            />
        </>
    );
};


const PreceptorDashboard: React.FC<{user: User, navigate: (page: Page) => void}> = ({user, navigate}) => {
    const [data, setData] = useState<{ pendingJustifications: PendingJustification[], underperformingStudents: UnderperformingStudent[], pendingProcedures: ProcedureRequest[] } | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.getPreceptorDashboardData().then(d => {
            setData(d);
            setLoading(false);
        })
    }, []);

    if (loading || !data) return <div className="space-y-6"><CardLoader lines={3} /><CardLoader lines={4} /><CardLoader lines={2} /></div>;

    return (
         <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold">Bienvenido, {user.name}</h2>
                <p className="text-text-secondary">Panel de gestión de Preceptoría.</p>
            </div>
            <Card title="Acciones Rápidas">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <button onClick={() => navigate('asistencia-general')} className="flex flex-col items-center p-4 bg-bg-secondary rounded-lg hover:bg-bg-tertiary">
                        <CheckBadgeIcon className="w-8 h-8 mb-2 text-brand-primary"/>
                        <span className="text-sm font-semibold text-center">Asistencia General</span>
                    </button>
                    <button onClick={() => navigate('trámites')} className="flex flex-col items-center p-4 bg-bg-secondary rounded-lg hover:bg-bg-tertiary">
                        <DocumentTextIcon className="w-8 h-8 mb-2 text-brand-primary"/>
                        <span className="text-sm font-semibold text-center">Gestionar Trámites</span>
                    </button>
                    <button onClick={() => navigate('comunicados')} className="flex flex-col items-center p-4 bg-bg-secondary rounded-lg hover:bg-bg-tertiary">
                        <MegaphoneIcon className="w-8 h-8 mb-2 text-brand-primary"/>
                        <span className="text-sm font-semibold text-center">Enviar Comunicado</span>
                    </button>
                    <button onClick={() => navigate('foros')} className="flex flex-col items-center p-4 bg-bg-secondary rounded-lg hover:bg-bg-tertiary">
                        <ChatBubbleLeftRightIcon className="w-8 h-8 mb-2 text-brand-primary"/>
                        <span className="text-sm font-semibold text-center">Foros Preceptoría</span>
                    </button>
                </div>
            </Card>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card title="Justificaciones Pendientes">
                    <ul className="space-y-3">
                    {data.pendingJustifications.map(j => (
                        <li key={j.id} className="p-2 bg-bg-primary rounded-md">
                            <p className="font-semibold text-sm">{j.studentName}</p>
                            <p className="text-xs text-text-secondary">{j.subject} - {j.date}</p>
                        </li>
                    ))}
                    </ul>
                </Card>
                <Card title="Alumnos en Seguimiento">
                     <ul className="space-y-3">
                    {data.underperformingStudents.map(s => (
                        <li key={s.id} className="p-2 bg-bg-primary rounded-md">
                            <p className="font-semibold text-sm">{s.name}</p>
                            <p className="text-xs text-text-secondary">{s.reason}: {s.value}</p>
                        </li>
                    ))}
                    </ul>
                </Card>
                <Card title="Trámites Pendientes">
                    <ul className="space-y-3">
                        {data.pendingProcedures.map(p => (
                            <li key={p.id} className="p-2 bg-bg-primary rounded-md">
                                <p className="font-semibold text-sm">{p.type}</p>
                                <p className="text-xs text-text-secondary">{p.studentName}</p>
                            </li>
                        ))}
                    </ul>
                </Card>
            </div>
        </div>
    );
}

// ... Stubs for the rest of the roles ...
const DirectorDashboard: React.FC<{user: User, navigate: (page: Page) => void}> = ({user, navigate}) => (
    <div className="space-y-6">
        <h2 className="text-2xl font-bold">Panel de Dirección</h2>
        <Card title="Estadísticas Generales">
            <p>Componente de estadísticas aquí...</p>
        </Card>
        <button onClick={() => navigate('personal')} className="w-full p-3 bg-brand-primary text-white rounded-md">Gestionar Personal</button>
    </div>
);
const AuxiliarDashboard: React.FC<{user: User, navigate: (page: Page) => void}> = ({user, navigate}) => (
    <div className="space-y-6">
        <h2 className="text-2xl font-bold">Panel de Auxiliar</h2>
        <Card title="Tareas Asignadas">
            <p>Lista de tareas aquí...</p>
        </Card>
        <button onClick={() => navigate('instalaciones')} className="w-full p-3 bg-brand-primary text-white rounded-md">Reportar Incidente</button>
    </div>
);
const StudentCenterDashboard: React.FC<{user: User, navigate: (page: Page) => void}> = ({user, navigate}) => (
    <div className="space-y-6">
        <h2 className="text-2xl font-bold">Panel del Centro de Estudiantes</h2>
        <Card title="Anuncios Recientes">
            <p>Lista de anuncios aquí...</p>
        </Card>
        <button onClick={() => navigate('reclamos')} className="w-full p-3 bg-brand-primary text-white rounded-md">Ver Reclamos y Sugerencias</button>
    </div>
);


// --- THEME CUSTOMIZER ---
const themes = [
    { id: 'instituto', name: 'Instituto', color: '#14b8a6' },
    { id: 'sereno', name: 'Sereno', color: '#4a6c6f' },
    { id: 'celestial', name: 'Celestial', color: '#d4af37' },
    { id: 'oscuro', name: 'Oscuro', color: '#3b82f6' },
    { id: 'ensueño', name: 'Ensueño', color: '#ec4899' },
    { id: 'enfoque', name: 'Enfoque', color: '#0891b2' },
    { id: 'fantasma', name: 'Fantasma', color: '#6b7280' },
    { id: 'rebelde', name: 'Rebelde', color: '#eab308' },
];

interface ThemeCustomizerProps {
    isOpen: boolean;
    onClose: () => void;
    currentTheme: string;
    currentMode: 'light' | 'dark';
    setTheme: (theme: string) => void;
    setMode: (mode: 'light' | 'dark') => void;
}

const ThemeCustomizer: React.FC<ThemeCustomizerProps> = ({ isOpen, onClose, currentTheme, currentMode, setTheme, setMode }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-40 bg-black/30 animate-fade-in" style={{ animationDuration: '0.3s' }} onClick={onClose}>
            <div
                className="fixed top-0 right-0 h-full w-80 bg-card-bg shadow-2xl p-6 transform animate-slide-in-right"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-semibold">Apariencia</h3>
                    <button onClick={onClose} className="p-1 rounded-full hover:bg-bg-tertiary">
                        <CloseIcon className="w-6 h-6" />
                    </button>
                </div>

                <div>
                    <h4 className="font-semibold mb-3 text-text-primary">Modo</h4>
                    <div className="flex gap-2 p-1 bg-bg-secondary rounded-lg">
                        <button
                            onClick={() => setMode('light')}
                            className={`w-1/2 flex items-center justify-center gap-2 py-2 rounded-md text-sm transition-all ${currentMode === 'light' ? 'bg-card-bg shadow font-semibold text-brand-primary' : 'text-text-secondary'}`}
                        >
                            <SunIcon className="w-5 h-5" />
                            Claro
                        </button>
                        <button
                            onClick={() => setMode('dark')}
                             className={`w-1/2 flex items-center justify-center gap-2 py-2 rounded-md text-sm transition-all ${currentMode === 'dark' ? 'bg-card-bg shadow font-semibold text-brand-primary' : 'text-text-secondary'}`}
                        >
                            <MoonIcon className="w-5 h-5" />
                            Oscuro
                        </button>
                    </div>
                </div>
                 <div className="mt-8">
                    <h4 className="font-semibold mb-3 text-text-primary">Color</h4>
                    <div className="grid grid-cols-2 gap-3">
                        {themes.map(theme => (
                            <button
                                key={theme.id}
                                onClick={() => setTheme(theme.id)}
                                className={`flex items-center gap-3 p-2 rounded-lg border-2 transition-all ${currentTheme === theme.id ? 'border-brand-primary' : 'border-transparent hover:bg-bg-secondary'}`}
                            >
                                <span className="w-6 h-6 rounded-full" style={{ backgroundColor: theme.color }}></span>
                                <span className="text-sm font-medium text-text-primary">{theme.name}</span>
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};


// Fix: Add missing layout components (Sidebar, Header, etc.)
const NAV_ITEMS: Record<Role, { page: Page; label: string; icon: React.FC<any> }[]> = {
    alumno: [
        { page: 'panel', label: 'Panel Principal', icon: ChartBarIcon },
        { page: 'calificaciones', label: 'Calificaciones', icon: AcademicCapIcon },
        { page: 'asistencia', label: 'Asistencia', icon: CheckBadgeIcon },
        { page: 'materiales', label: 'Material de Estudio', icon: BookOpenIcon },
        { page: 'trámites', label: 'Trámites', icon: DocumentTextIcon },
        { page: 'agenda', label: 'Agenda', icon: CalendarDaysIcon },
        { page: 'foros', label: 'Foros de Consulta', icon: ChatBubbleLeftRightIcon },
        { page: 'mensajes', label: 'Mensajería', icon: InboxIcon },
    ],
    profesor: [
        { page: 'panel', label: 'Panel Principal', icon: ChartBarIcon },
        { page: 'asistencia', label: 'Tomar Asistencia', icon: CheckBadgeIcon },
        { page: 'calificaciones', label: 'Cargar Calificaciones', icon: PencilSquareIcon },
        { page: 'materiales', label: 'Gestionar Materiales', icon: BookOpenIcon },
        { page: 'agenda', label: 'Agenda', icon: CalendarDaysIcon },
        { page: 'foros', label: 'Foros', icon: ChatBubbleLeftRightIcon },
        { page: 'mensajes', label: 'Mensajería', icon: InboxIcon },
    ],
    preceptor: [
        { page: 'panel', label: 'Panel Principal', icon: UserGroupIcon },
        { page: 'asistencia-general', label: 'Asistencia General', icon: CheckBadgeIcon },
        { page: 'trámites', label: 'Trámites', icon: DocumentTextIcon },
        { page: 'comunicados', label: 'Comunicados', icon: MegaphoneIcon },
        { page: 'foros', label: 'Foros Preceptoría', icon: ChatBubbleLeftRightIcon },
    ],
    directivo: [
        { page: 'panel', label: 'Panel Principal', icon: ChartPieIcon },
        { page: 'estadisticas', label: 'Estadísticas', icon: ChartBarIcon },
        { page: 'personal', label: 'Gestionar Personal', icon: UserGroupIcon },
        { page: 'comunicados', label: 'Comunicados', icon: MegaphoneIcon },
    ],
    auxiliar: [
        { page: 'panel', label: 'Panel Principal', icon: WrenchScrewdriverIcon },
        { page: 'tareas', label: 'Tareas Asignadas', icon: ClipboardDocumentCheckIcon },
        { page: 'instalaciones', label: 'Reportar Incidente', icon: ExclamationTriangleIcon },
    ],
    centro_estudiantes: [
        { page: 'panel', label: 'Panel Principal', icon: BuildingOfficeIcon },
        { page: 'anuncios', label: 'Anuncios', icon: MegaphoneIcon },
        { page: 'reclamos', label: 'Reclamos y Sugerencias', icon: InboxArrowDownIcon },
        { page: 'eventos', label: 'Organizar Eventos', icon: CalendarDaysIcon },
    ],
};

const NavLink: React.FC<{ page: Page; label: string; icon: React.FC<any>; currentPage: Page; navigate: (page: Page) => void; }> = ({ page, label, icon: Icon, currentPage, navigate }) => (
    <button
        onClick={() => navigate(page)}
        className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
            currentPage === page
                ? 'bg-brand-primary text-white'
                : 'text-text-secondary hover:bg-bg-tertiary hover:text-text-primary'
        }`}
    >
        <Icon className="w-5 h-5" />
        <span>{label}</span>
    </button>
);

const SidebarContent: React.FC<{ user: User; currentPage: Page; navigate: (page: Page) => void; onLogout: () => void; }> = ({ user, currentPage, navigate, onLogout }) => (
    <div className="flex flex-col h-full">
        <div className="p-4 flex items-center gap-3 border-b border-app-border">
            <img src='https://i.postimg.cc/ZnvcNRgC/450c3215-379b-4542-8a15-08ed88e6d696.png' alt="Logo" className="h-10 w-10"/>
            <div>
                <h2 className="font-semibold text-text-primary">ISFDyT N°26</h2>
                <p className="text-xs text-text-secondary">Campus Virtual</p>
            </div>
        </div>
        <nav className="flex-1 p-4 space-y-2">
            {(NAV_ITEMS[user.role] || []).map(item => (
                <NavLink key={item.page} {...item} currentPage={currentPage} navigate={navigate} />
            ))}
        </nav>
        <div className="p-4 mt-auto border-t border-app-border">
            <button
                onClick={onLogout}
                className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium text-text-secondary hover:bg-bg-tertiary hover:text-text-primary transition-colors"
            >
                <ArrowLeftOnRectangleIcon className="w-5 h-5" />
                <span>Cerrar Sesión</span>
            </button>
        </div>
    </div>
);

const Sidebar: React.FC<{ user: User; currentPage: Page; navigate: (page: Page) => void; onLogout: () => void; }> = (props) => (
    <aside className="hidden md:block w-64 bg-card-bg flex-shrink-0">
        <SidebarContent {...props} />
    </aside>
);

const MobileSidebar: React.FC<{ isOpen: boolean; onClose: () => void; user: User; currentPage: Page; navigate: (page: Page) => void; onLogout: () => void; }> = ({ isOpen, onClose, ...props }) => (
    <>
        {isOpen && <div className="md:hidden fixed inset-0 z-30 bg-black/50" onClick={onClose}></div>}
        <aside className={`md:hidden fixed top-0 left-0 h-full w-64 bg-card-bg z-40 transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
             <SidebarContent {...props} />
        </aside>
    </>
);

const Header: React.FC<{ onToggleSidebar: () => void; user: User; navigate: (page: Page) => void; onOpenThemeCustomizer: () => void; }> = ({ onToggleSidebar, user, navigate, onOpenThemeCustomizer }) => {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [page, setPage] = useState<Page>('panel'); // Add page state for header title
    
    useEffect(() => {
        api.getNotifications(user.role).then(setNotifications);
    }, [user.role]);

    const unreadCount = notifications.filter(n => !n.read).length;

    return (
        <header className="bg-card-bg p-4 flex items-center justify-between shadow-sm z-10">
            <div className="flex items-center gap-4">
                 <button onClick={onToggleSidebar} className="md:hidden p-2 -ml-2 rounded-full hover:bg-bg-tertiary">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" /></svg>
                </button>
                <div className="hidden sm:block">
                    <h1 className="text-xl font-semibold capitalize">{page.replace('-', ' ')}</h1>
                </div>
            </div>
            <div className="flex items-center gap-4">
                <button className="p-2 rounded-full hover:bg-bg-tertiary relative">
                    <BellIcon className="w-6 h-6"/>
                    {unreadCount > 0 && <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-card-bg" />}
                </button>
                 <button onClick={onOpenThemeCustomizer} className="p-2 rounded-full hover:bg-bg-tertiary">
                    <PaletteIcon className="w-6 h-6" />
                </button>
                <button onClick={() => navigate('perfil')} className="flex items-center gap-2">
                    <img src={user.avatarUrl || `https://ui-avatars.com/api/?name=${user.name.replace(' ', '+')}&background=4f46e5&color=fff&size=40`} alt="Avatar" className="w-9 h-9 rounded-full"/>
                    <div className="hidden lg:block text-left">
                       <p className="text-sm font-semibold">{user.name}</p>
                       <p className="text-xs text-text-secondary capitalize">{user.role.replace('_', ' ')}</p>
                    </div>
                </button>
            </div>
        </header>
    );
};


// --- MAIN APP ---
const App: React.FC = () => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const [page, setPage] = useState<Page>('panel');
    const [isThemeCustomizerOpen, setThemeCustomizerOpen] = useState(false);

    const [theme, setTheme] = useState(() => localStorage.getItem('app-theme') || 'instituto');
    const [mode, setMode] = useState<'light' | 'dark'>(() => (localStorage.getItem('app-mode') as 'light' | 'dark') || 'light');
    
    useEffect(() => {
        const root = document.documentElement;
        root.setAttribute('data-theme', theme);
        localStorage.setItem('app-theme', theme);
        
        if (mode === 'dark') {
            root.classList.add('dark');
        } else {
            root.classList.remove('dark');
        }
        localStorage.setItem('app-mode', mode);
    }, [theme, mode]);


    useEffect(() => {
        // This is just to simulate an initial auth check
        setTimeout(() => setIsLoading(false), 500);
    }, []);

    const handleLogin = (loggedInUser: User) => {
        setUser(loggedInUser);
        setPage('panel');
    };

    const handleLogout = () => {
        setUser(null);
        setPage('panel');
    };

    const navigate = (newPage: Page) => {
        setPage(newPage);
        setSidebarOpen(false); // Close sidebar on navigation
    };
    
    // Stubs for modal states and handlers
    const [isAddEventModalOpen, setAddEventModalOpen] = useState(false);
    const [pendingModalCourse, setPendingModalCourse] = useState<TeacherSummary | null>(null);
    const [contactModalStudent, setContactModalStudent] = useState<PendingStudent | null>(null);

    const handleShowPending = (course: TeacherSummary) => setPendingModalCourse(course);
    const handleContactStudent = (student: PendingStudent) => {
        setPendingModalCourse(null); // Close first modal
        setContactModalStudent(student); // Open second modal
    };
    const handleProcedureRequest = (type: ProcedureRequest['type']) => {
        api.requestProcedure(type).then(() => {
            alert(`Tu solicitud de "${type}" ha sido enviada.`);
        });
    };

    if (isLoading) return <FullPageLoader />;
    if (!user) return <LoginScreen onLogin={handleLogin} />;

    const renderPage = () => {
        switch (page) {
            case 'panel':
                if (user.role === 'alumno') return <StudentDashboard navigate={navigate} user={user} />;
                if (user.role === 'profesor') return <TeacherDashboard user={user} navigate={navigate} onShowPending={handleShowPending} />;
                if (user.role === 'preceptor') return <PreceptorDashboard user={user} navigate={navigate} />;
                if (user.role === 'directivo') return <DirectorDashboard user={user} navigate={navigate} />;
                if (user.role === 'auxiliar') return <AuxiliarDashboard user={user} navigate={navigate} />;
                if (user.role === 'centro_estudiantes') return <StudentCenterDashboard user={user} navigate={navigate} />;
                return <p>Panel no disponible para este rol.</p>;
            case 'calificaciones': 
                if (user.role === 'alumno') return <GradesPage />;
                if (user.role === 'profesor') return <TeacherGradesPage onBack={() => setPage('panel')} />;
                return <p>Acceso denegado.</p>;
            case 'asistencia': 
                if (user.role === 'alumno') return <AttendancePage />;
                 if (user.role === 'profesor') return <TeacherAttendancePage onBack={() => setPage('panel')} />;
                return <p>Acceso denegado.</p>;
            case 'asistencia-general':
                if (user.role === 'preceptor') return <PreceptorGeneralAttendancePage onBack={() => setPage('panel')} />;
                return <p>Acceso denegado.</p>;
            case 'agenda': return <CalendarPage user={user} onAddEventClick={() => setAddEventModalOpen(true)} />;
            case 'mensajes': return <MessagesPage currentUser={user} />;
            case 'foros': return <ForumPage currentUser={user} />;
            case 'perfil': return <ProfilePage user={user} onUpdate={setUser} onBack={() => setPage('panel')} />;
            case 'materiales': 
                if (user.role === 'alumno') return <MaterialsPage />;
                if (user.role === 'profesor') return <TeacherMaterialsPage onBack={() => setPage('panel')} />;
                return <p>Acceso denegado.</p>;
            case 'trámites':
                 if (user.role === 'alumno') return <ProceduresPage onRequest={handleProcedureRequest} navigate={navigate} />;
                 if (user.role === 'preceptor') return <PreceptorProceduresPage onBack={() => setPage('panel')} />;
                return <p>Acceso denegado.</p>;
            default: return <p>Página no encontrada.</p>;
        }
    };
    
    return (
        <div className="flex min-h-screen">
            <Sidebar user={user} currentPage={page} navigate={navigate} onLogout={handleLogout} />
            <MobileSidebar isOpen={isSidebarOpen} onClose={() => setSidebarOpen(false)} user={user} currentPage={page} navigate={navigate} onLogout={handleLogout} />
            
            <div className="flex-1 flex flex-col">
                <Header onToggleSidebar={() => setSidebarOpen(true)} user={user} navigate={navigate} onOpenThemeCustomizer={() => setThemeCustomizerOpen(true)} />
                <main className="flex-1 p-4 sm:p-6 lg:p-8 bg-bg-secondary overflow-y-auto">
                    {renderPage()}
                </main>
            </div>

            <ThemeCustomizer 
                isOpen={isThemeCustomizerOpen} 
                onClose={() => setThemeCustomizerOpen(false)}
                currentTheme={theme}
                currentMode={mode}
                setTheme={setTheme}
                setMode={setMode}
            />

             {/* Modals */}
            <AddEventModal 
                isOpen={isAddEventModalOpen}
                onClose={() => setAddEventModalOpen(false)}
                onAddEvent={(event) => console.log('Add event:', event)} // Replace with actual API call
            />
            {user.role === 'profesor' && (
                <>
                <PendingSubmissionsModal 
                    isOpen={!!pendingModalCourse}
                    onClose={() => setPendingModalCourse(null)}
                    course={pendingModalCourse}
                    onContactStudent={handleContactStudent}
                />
                <TeacherContactStudentModal 
                    isOpen={!!contactModalStudent}
                    onClose={() => setContactModalStudent(null)}
                    student={contactModalStudent}
                />
                </>
            )}
        </div>
    );
};

export default App;