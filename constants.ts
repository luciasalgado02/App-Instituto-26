import type { User, Role, Grade, Attendance, Material, Conversation, ForumPost, CalendarEvent, Notification, Assignment, NewsItem, FinalExamSubject, ClassSchedule, ChatMessage, TeacherSummary, PendingStudent, StudentGradeRecord, StudentAttendanceRecord, PendingJustification, UnderperformingStudent, ProcedureRequest, Career } from './types';

export const MOCK_USERS: Record<Role, User[]> = {
    alumno: [
        { id: 's1', name: 'Ana Pérez', email: 'alumno@example.com', role: 'alumno', dni: '12.345.678', about: 'Estudiante de segundo año apasionada por el desarrollo de software y las bases de datos.', career: 'Tecnicatura Superior en Desarrollo de Software' },
        { id: 's2', name: 'Juan Rodriguez', email: 'juan.r@example.com', role: 'alumno' },
        { id: 's3', name: 'Maria Garcia', email: 'maria.g@example.com', role: 'alumno' },
        { id: 's4', name: 'Pedro Sanchez', email: 'pedro.s@example.com', role: 'alumno' },
        { id: 's5', name: 'Lucia Fernandez', email: 'lucia.f@example.com', role: 'alumno' },
        { id: 's6', name: 'David Martinez', email: 'david.m@example.com', role: 'alumno' },
        { id: 's7', name: 'Sofia Lopez', email: 'sofia.l@example.com', role: 'alumno' },
        { id: 's8', name: 'Matias Gonzalez', email: 'matias.g@example.com', role: 'alumno' },
        { id: 's9', name: 'Valentina Romero', email: 'valentina.r@example.com', role: 'alumno' },
    ],
    profesor: [
        { id: 't1', name: 'Carlos Gómez', email: 'profesor@example.com', role: 'profesor' },
        { id: 't2', name: 'Ricardo Diaz', email: 'profesor.diaz@example.com', role: 'profesor' },
        { id: 't3', name: 'Profesor Particular', email: 'tutor@example.com', role: 'profesor' }
    ],
    preceptor: [
        { id: 'p1', name: 'Laura Martinez', email: 'preceptor@example.com', role: 'preceptor' }
    ]
};

export const MOCK_SUBJECTS_BY_YEAR: Record<string, string[]> = {
  '1er Año': ['Análisis Matemático', 'Física I', 'Química General', 'Sistemas Operativos'],
  '2do Año': ['Programación I', 'Bases de Datos'],
  '3er Año': [],
};


interface StudentData {
    assignments: Assignment[];
    grades: Grade[];
    attendance: Attendance[];
}

export const MOCK_STUDENT_DATA: StudentData = {
    assignments: [
        { id: 'a1', title: 'TP N°1 - Algoritmos', subject: 'Programación I', dueDate: '15/08/2024' },
        { id: 'a2', title: 'Ensayo: Modelo Relacional', subject: 'Bases de Datos', dueDate: '18/08/2024' },
        { id: 'a3', title: 'Informe de Laboratorio: Procesos', subject: 'Sistemas Operativos', dueDate: '20/08/2024' },
    ],
    grades: [
        { id: 'g1', subject: 'Programación I', assignment: 'Parcial de Algoritmia', grade: 9, semester: 1, year: '2do Año' },
        { id: 'g2', subject: 'Bases de Datos', assignment: 'Presentación: SQL vs NoSQL', grade: 10, semester: 1, year: '2do Año' },
        { id: 'g3', subject: 'Sistemas Operativos', assignment: 'Examen de Comandos Linux', grade: 8, semester: 1, year: '1er Año' },
        { id: 'g4', subject: 'Análisis Matemático', assignment: 'TP: Funciones y Límites', grade: 7, semester: 1, year: '1er Año' },
        { id: 'g5', subject: 'Programación I', assignment: 'Entrega Final - Proyecto', grade: 8, semester: 2, year: '2do Año' },
        { id: 'g6', subject: 'Bases de Datos', assignment: 'Parcial de Normalización', grade: 8, semester: 2, year: '2do Año' },
        { id: 'g7', subject: 'Análisis Matemático', assignment: 'Parcial de Derivadas', grade: 6, semester: 2, year: '1er Año' },
        { id: 'g8', subject: 'Física I', assignment: 'Parcial Cinemática', grade: 3, semester: 1, year: '1er Año' },
        { id: 'g9', subject: 'Química General', assignment: 'Laboratorio 1', grade: 7, semester: 1, year: '1er Año' },
        { id: 'g10', subject: 'Física I', assignment: 'Recuperatorio', grade: 2, semester: 2, year: '1er Año' },
    ],
    attendance: [
        { id: 'att1', date: '01/08/2024', subject: 'Programación I', status: 'presente', year: '2do Año' },
        { id: 'att2', date: '01/08/2024', subject: 'Bases de Datos', status: 'presente', year: '2do Año' },
        { id: 'att3', date: '02/08/2024', subject: 'Sistemas Operativos', status: 'ausente', year: '1er Año' },
        { id: 'att4', date: '03/08/2024', subject: 'Análisis Matemático', status: 'presente', year: '1er Año' },
        { id: 'att5', date: '03/08/2024', subject: 'Programación I', status: 'presente', year: '2do Año' },
        { id: 'att6', date: '04/08/2024', subject: 'Programación I', status: 'presente', year: '2do Año' },
        { id: 'att7', date: '05/08/2024', subject: 'Análisis Matemático', status: 'ausente', year: '1er Año' },
        { id: 'att8', date: '05/08/2024', subject: 'Física I', status: 'presente', year: '1er Año' },
        { id: 'att9', date: '06/08/2024', subject: 'Programación I', status: 'ausente', year: '2do Año' },
        { id: 'att10', date: '07/08/2024', subject: 'Bases de Datos', status: 'ausente', year: '2do Año' },
    ]
};

export const MOCK_MATERIALS: Material[] = [
    { id: 'm1', title: 'Guía de ejercicios - Unidad 1', subject: 'Análisis Matemático', fileType: 'PDF', year: '1er Año' },
    { id: 'm2', title: 'Presentación Clase 3: Normalización', subject: 'Bases de Datos', fileType: 'PPT', year: '2do Año' },
    { id: 'm3', title: 'Apuntes sobre punteros en C', subject: 'Programación I', fileType: 'DOCX', year: '2do Año' },
];

export const MOCK_CONVERSATIONS: Conversation[] = [
    { 
        id: 'convo1', 
        participants: { 's1': 'Ana Pérez', 't1': 'Carlos Gómez' },
        messages: [
            { id: 'msg1-1', senderId: 't1', text: 'Hola Ana, quería recordarte que la fecha límite para la entrega del TP N°1 es esta semana. Si tienes alguna duda o necesitas ayuda con algún punto, no dudes en consultarme en el foro o por este medio. Saludos, Prof. Gómez.', timestamp: '10:30' },
            { id: 'msg1-2', senderId: 's1', text: '¡Hola Profe! Justo le iba a escribir. Tengo una duda con el punto 3, ¿podríamos verlo en la clase de consulta?', timestamp: '10:32' },
            { id: 'msg1-3', senderId: 't1', text: 'Por supuesto, Ana. Lo vemos mañana sin falta.', timestamp: '10:35' },
        ],
        lastMessageSnippet: 'Por supuesto, Ana. Lo vemos...',
        isRead: false 
    },
    { 
        id: 'convo2', 
        participants: { 's1': 'Ana Pérez', 'p1': 'Laura Martinez' },
        messages: [
            { id: 'msg2-1', senderId: 'p1', text: 'Estimados alumnos, les recordamos que deben entregar la documentación pendiente en la oficina de Preceptoría antes de fin de mes para completar su legajo. Muchas gracias.', timestamp: 'Ayer' }
        ],
        lastMessageSnippet: 'Estimados alumnos, les recordamos...',
        isRead: true 
    },
];

export const MOCK_FORUM_POSTS: ForumPost[] = [
    { 
        id: 'fp3', 
        title: 'Mejor forma de normalizar una tabla', 
        author: 'Ana Pérez',
        category: 'Bases de Datos',
        content: 'Estoy trabajando en el modelo relacional para el proyecto y tengo dudas sobre si mi tabla de "Pedidos" está correctamente normalizada hasta 3FN. ¿Cuáles son las mejores prácticas que siguen ustedes?',
        replies: [], 
        lastActivity: 'hace 3 días' 
    },
    {
        id: 'fp4',
        title: 'Error de compilación en C',
        author: 'Sofia Lopez',
        category: 'Programación I',
        content: 'Hola Profe, estoy teniendo un error "segmentation fault" al intentar correr mi código para el TP1. ¿Podría darme una pista de qué puede estar pasando? Adjunto el código en un pastebin. ¡Gracias!',
        replies: [],
        lastActivity: 'hace 5 horas'
    },
    { 
        id: 'fp1', 
        title: 'Duda sobre ejercicio 5 de la guía 1', 
        author: 'Juan Rodriguez',
        category: 'Análisis Matemático',
        content: 'Hola a todos, ¿alguien podría explicarme cómo plantear el ejercicio 5 de la primera guía? No entiendo bien cómo aplicar el concepto de límite en este caso. ¡Gracias!',
        replies: [
            { id: 'r1', author: 'Maria Garcia', content: '¡Hola Juan! Yo lo resolví pensando en la definición que vimos en clase. Fíjate en la página 32 del apunte, ahí hay un ejemplo similar.'},
            { id: 'r2', author: 'Prof. Diaz', content: 'Excelente pregunta, Juan. Maria tiene razón, el ejemplo del apunte es una buena guía. Recuerden que lo más importante es identificar si hay una indeterminación y, en ese caso, cómo salvarla. Mañana en clase podemos revisar este punto si siguen con dudas.'},
        ], 
        lastActivity: 'hace 2 horas' 
    },
    { 
        id: 'fp2', 
        title: '¿Alguien tiene apuntes de la clase pasada?', 
        author: 'Maria Garcia',
        category: 'Sistemas Operativos',
        content: 'Hola chicos, la clase pasada no pude asistir. ¿Alguien sería tan amable de pasarme los apuntes sobre gestión de memoria? ¡Se los agradecería mucho!',
        replies: [
             { id: 'r3', author: 'Pedro Sanchez', content: '¡Hola Maria! Yo los tengo, ahora te los envío por mail.'},
        ], 
        lastActivity: 'hace 1 día' 
    },
];

export const MOCK_PRECEPTOR_FORUM_POSTS: ForumPost[] = [
    {
        id: 'pfp1',
        title: 'Consulta sobre constancia de alumno regular',
        author: 'Ana Pérez',
        category: 'Trámites',
        content: 'Hola, buenos días. Necesitaría solicitar una constancia de alumno regular para presentar en mi trabajo. ¿Cuáles son los pasos a seguir y cuánto demora?',
        replies: [
            { id: 'pr1', author: 'Laura Martinez', content: 'Hola Ana. Puedes solicitarla directamente desde el portal en la sección "Trámites > Solicitar Constancia". Generalmente está lista para descargar en 24hs. Saludos.' },
        ],
        lastActivity: 'hace 1 hora'
    },
    {
        id: 'pfp2',
        title: 'Justificación de inasistencia por enfermedad',
        author: 'Juan Rodriguez',
        category: 'Justificaciones',
        content: 'Buen día. Estuve ausente la semana pasada por enfermedad y ya subí el certificado médico al sistema. ¿Necesito hacer algo más para que se justifiquen las faltas?',
        replies: [],
        lastActivity: 'hace 5 horas'
    },
    {
        id: 'pfp3',
        title: 'Problema con el acceso al material de estudio',
        author: 'Sofia Lopez',
        category: 'Consultas Generales',
        content: 'Hola, estoy intentando acceder al material de la materia "Sistemas Operativos" pero me aparece un error. ¿Podrían revisar si los permisos están bien configurados?',
        replies: [
             { id: 'pr2', author: 'Laura Martinez', content: 'Hola Sofia, gracias por avisar. Lo revisamos y ya debería estar solucionado. Por favor, intenta de nuevo y avísanos si sigues con problemas.' },
        ],
        lastActivity: 'hace 1 día'
    }
];

export const MOCK_CALENDAR_EVENTS: CalendarEvent[] = [
    { id: 'ce1', day: 15, title: 'Entrega TP N°1 - Algoritmos', description: 'Fecha límite para la entrega del primer trabajo práctico de Programación I.', color: 'accent-blue', isPublic: true, ownerId: 'p1'},
    { id: 'ce2', day: 18, title: 'Ensayo: Modelo Relacional', description: 'Fecha límite para el ensayo de Bases de Datos.', color: 'accent-purple', isPublic: true, ownerId: 'p1'},
    { id: 'ce3', day: 22, title: 'Consulta Parcial de Límites', description: 'Clase de consulta con el Prof. Diaz a las 10:00 hs.', color: 'accent-yellow', isPublic: true, ownerId: 't2'},
    { id: 'ce4', day: 25, title: 'Revisar Plan de Estudios', description: 'Reunión privada con dirección para revisar el plan de estudios de Programación I.', color: 'accent-red', isPublic: false, ownerId: 't1' },
];

export const MOCK_STUDENT_NOTIFICATIONS: Notification[] = [
    { id: 'n1', title: 'El Prof. Gómez ha calificado tu "Parcial de Algoritmia".', date: 'hace 5 minutos', read: false },
    { id: 'n2', title: 'Nuevo mensaje de Preceptoría.', date: 'hace 2 horas', read: false },
    { id: 'n3', title: 'Recordatorio: La entrega de "TP N°1" es mañana.', date: 'hace 1 día', read: true },
    { id: 'n4', title: 'El Prof. Diaz ha respondido en el foro "Duda sobre ejercicio 5".', date: 'hace 2 días', read: true },
];

export const MOCK_TEACHER_NOTIFICATIONS: Notification[] = [
    { id: 'tn1', title: 'Ana Pérez ha entregado "TP N°1 - Algoritmos".', date: 'hace 15 minutos', read: false },
    { id: 'tn2', title: 'Nueva pregunta en el foro de "Bases de Datos".', date: 'hace 1 hora', read: false },
    { id: 'tn3', title: 'Recordatorio: La fecha de cierre de notas es en 3 días.', date: 'hace 1 día', read: true },
    { id: 'tn4', title: 'Laura Martinez (Preceptoría) te ha enviado un mensaje.', date: 'hace 2 días', read: true },
];

export const MOCK_PRECEPTOR_NOTIFICATIONS: Notification[] = [
    { id: 'pn1', title: 'Ana Pérez ha justificado una ausencia.', date: 'hace 5 minutos', read: false },
    { id: 'pn2', title: 'Recordatorio: Reunión de personal a las 15:00 hs.', date: 'hace 1 hora', read: false },
    { id: 'pn3', title: 'Se ha actualizado el calendario académico.', date: 'hace 1 día', read: true },
    { id: 'pn4', title: 'El Prof. Gómez solicita un listado de alumnos de la comisión 2k1.', date: 'hace 2 días', read: true },
];

export const MOCK_PENDING_JUSTIFICATIONS: PendingJustification[] = [
    { id: 'pj1', studentName: 'Juan Rodriguez', subject: 'Sistemas Operativos', date: '02/08/2024', reason: 'Turno médico. Adjunto certificado.' },
    { id: 'pj2', studentName: 'Matias Gonzalez', subject: 'Análisis Matemático', date: '05/08/2024', reason: 'Problemas de conexión a internet para la clase virtual.' },
];

export const MOCK_UNDERPERFORMING_STUDENTS: UnderperformingStudent[] = [
    { id: 'us1', name: 'Juan Rodriguez', reason: 'Riesgo Académico', value: 'Promedio: 4.2' },
    { id: 'us2', name: 'Matias Gonzalez', reason: 'Inasistencias Elevadas', value: '7 Faltas' },
    { id: 'us3', name: 'Sofia Lopez', reason: 'Riesgo Académico', value: 'Promedio: 4.8' },
];

export const MOCK_NEWS: NewsItem[] = [
    { id: 'news1', title: 'Inscripción a Mesas de Finales Abierta', summary: 'Ya puedes inscribirte a las mesas de finales del próximo llamado. La fecha límite es el 25/08.', actionText: 'Inscribirse ahora' }
];

export const MOCK_FINALS_SUBJECTS: FinalExamSubject[] = [
    { id: 'fs1', name: 'Programación I', date: '12/08/2024' },
    { id: 'fs2', name: 'Bases de Datos', date: '14/08/2024' },
    { id: 'fs3', name: 'Análisis Matemático', date: '16/08/2024' },
    { id: 'fs4', name: 'Sistemas Operativos', date: '19/08/2024' }
];

export const MOCK_TODAY_SCHEDULE: ClassSchedule[] = [
    { id: 'cs1', time: '08:00 - 10:00', subject: 'Análisis Matemático', classroom: '101' },
    { id: 'cs2', time: '10:00 - 12:00', subject: 'Programación I', classroom: 'Virtual', virtualLink: 'https://meet.google.com/xyz-abc-def' },
];

// --- TEACHER DATA ---
export const MOCK_TEACHER_SCHEDULE: ClassSchedule[] = [
    { id: 'tcs1', time: '10:00 - 12:00', subject: 'Programación I', classroom: 'Virtual', virtualLink: 'https://meet.google.com/xyz-abc-def' },
    { id: 'tcs2', time: '14:00 - 16:00', subject: 'Bases de Datos', classroom: '205' },
];

export const MOCK_TEACHER_SUMMARY: TeacherSummary[] = [
    { id: 'ts1', subject: 'Programación I', commission: '2k1', studentCount: 35, pendingSubmissions: 8 },
    { id: 'ts2', subject: 'Bases de Datos', commission: '2k4', studentCount: 32, pendingSubmissions: 3 },
];

export const MOCK_PENDING_SUBMISSIONS: Record<string, PendingStudent[]> = {
  'ts1': [ // Programación I (8 pending)
    { id: 's2', name: 'Juan Rodriguez' },
    { id: 's3', name: 'Maria Garcia' },
    { id: 's4', name: 'Pedro Sanchez' },
    { id: 's5', name: 'Lucia Fernandez' },
    { id: 's6', name: 'David Martinez' },
    { id: 's7', name: 'Sofia Lopez' },
    { id: 's8', name: 'Matias Gonzalez' },
    { id: 's9', name: 'Valentina Romero' },
  ],
  'ts2': [ // Bases de Datos (3 pending)
    { id: 's2', name: 'Juan Rodriguez' },
    { id: 's4', name: 'Pedro Sanchez' },
    { id: 's7', name: 'Sofia Lopez' },
  ]
};

export const MOCK_COURSE_GRADES: Record<string, StudentGradeRecord[]> = {
    'Programación I': [
        { id: 's1', name: 'Perez, Ana', semester1: 9, semester2: 8 },
        { id: 's2', name: 'Rodriguez, Juan', semester1: 8, semester2: 7 },
        { id: 's3', name: 'Garcia, Maria', semester1: 6, semester2: 7 },
        { id: 's4', name: 'Sanchez, Pedro', semester1: 10, semester2: 9 },
        { id: 's5', name: 'Fernandez, Lucia', semester1: 7, semester2: 8 },
    ],
    'Bases de Datos': [
        { id: 's1', name: 'Perez, Ana', semester1: 10, semester2: 8 },
        { id: 's2', name: 'Rodriguez, Juan', semester1: 7, semester2: 6 },
        { id: 's6', name: 'Martinez, David', semester1: 8, semester2: 8 },
        { id: 's7', name: 'Lopez, Sofia', semester1: 9, semester2: 9 },
    ]
};

export const MOCK_COURSE_ATTENDANCE: Record<string, StudentAttendanceRecord[]> = {
    'Programación I': [
        { id: 's1', name: 'Perez, Ana', status: 'presente' },
        { id: 's2', name: 'Rodriguez, Juan', status: 'presente' },
        { id: 's3', name: 'Garcia, Maria', status: 'ausente' },
        { id: 's4', name: 'Sanchez, Pedro', status: 'presente' },
        { id: 's5', name: 'Fernandez, Lucia', status: 'tarde' },
    ],
    'Bases de Datos': [
        { id: 's1', name: 'Perez, Ana', status: 'presente' },
        { id: 's2', name: 'Rodriguez, Juan', status: 'presente' },
        { id: 's6', name: 'Martinez, David', status: 'presente' },
        { id: 's7', name: 'Lopez, Sofia', status: null },
    ]
};

// --- PRECEPTOR DATA ---

export const MOCK_CAREERS: Career[] = [
    {
        name: 'Tecnicatura Superior en Desarrollo de Software',
        years: {
          '1er Año': ['Análisis Matemático', 'Sistemas Operativos'],
          '2do Año': ['Programación I', 'Bases de Datos'],
          '3er Año': ['Programación II', 'Redes de Datos']
        }
    },
    {
        name: 'Profesorado de Educación Primaria',
        years: {
          '1er Año': ['Didáctica General', 'Pedagogía'],
          '2do Año': ['Psicología Educacional', 'Prácticas Docentes I']
        }
    }
];

export const MOCK_PRECEPTOR_ATTENDANCE_DETAIL: Record<string, Record<string, StudentAttendanceRecord[]>> = {
  '1er Año': {
    'Análisis Matemático': [
      { id: 's2', name: 'Gomez, Maria', status: 'presente' },
      { id: 's3', name: 'Perez, Juan', status: 'presente' },
    ],
    'Sistemas Operativos': [
      { id: 's4', name: 'Sanchez, Pedro', status: 'ausente' },
      { id: 's5', name: 'Fernandez, Lucia', status: 'presente' },
    ]
  },
  '2do Año': {
    'Programación I': [
      { id: 's1', name: 'Pérez, Ana', status: 'presente' },
      { id: 's6', name: 'Martinez, David', status: 'tarde' },
      { id: 's10', name: 'García, Carlos', status: null },
      { id: 's11', name: 'Rodriguez, Laura', status: null },
      { id: 's12', name: 'Fernandez, Miguel', status: null },
      { id: 's16', name: 'Sosa, Lucas', status: null },
      { id: 's17', name: 'Rios, Martina', status: null },
    ],
    'Bases de Datos': [
      { id: 's7', name: 'Lopez, Sofia', status: 'presente' },
      { id: 's8', name: 'Gonzalez, Matias', status: 'ausente' },
      { id: 's9', name: 'Romero, Valentina', status: 'presente' },
      { id: 's13', name: 'Alvarez, Julieta', status: null },
      { id: 's14', name: 'Torres, Diego', status: null },
      { id: 's15', name: 'Diaz, Camila', status: null },
      { id: 's18', name: 'Acosta, Benjamin', status: null },
      { id: 's19', name: 'Benitez, Victoria', status: null },
    ]
  }
};

export const MOCK_PROCEDURE_REQUESTS: ProcedureRequest[] = [
    { id: 'pr1', studentId: 's2', studentName: 'Juan Rodriguez', type: 'Constancia de Aluno Regular', date: '22/09/2024', status: 'pending' },
    { id: 'pr2', studentId: 's7', studentName: 'Sofia Lopez', type: 'Solicitud de Mesa Especial', date: '21/09/2024', status: 'pending' },
];
