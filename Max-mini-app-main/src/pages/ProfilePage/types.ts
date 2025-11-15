export interface ProfileData {
  fullName: string;
  course: string;
  faculty: string;
  group: string;
  placeOfStudy: string;
  studentId: string;
  role: string;
  avatarUrl?: string;
  // Поля для преподавателя
  position?: string; // Должность (kafedra)
  placeOfWork?: string; // Место работы
  tabNumber?: string; // Табельный номер
}

