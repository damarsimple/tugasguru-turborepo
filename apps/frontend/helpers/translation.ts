export const translation = {
  TEACHER: 'Guru',
  STUDENT: 'Siswa',
  PARENT: 'Orang Tua',
  GENERAL: 'Umum',
}

export const getTranslation = (key: string): string => {
  try {
    return translation[key]
  } catch (error) {
    return key
  }
}
