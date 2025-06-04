import { Alert, Divider, Table, Typography, type TableColumnsType } from 'antd'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { useQuestionContext } from '../questionContext'

export interface Data {
  to_send: string
  user_id: string
  username: string
  gender: string
  name: string
  age: string
  city: string
  education: string
  education_two: string
  occupation: string
  unemployed: string
  period: string
  student: string
  student_job: string
  self_employed: string
  employment: string
  freelance_employment: string
  freelance_work: string
  field_work: string
  income: string
  job_device: string
  leisure_device: string
  research: string
  platform: string
  time: string
  privacy: string
  answers: Answers
  telegram_id?: string
}

interface Answers {
  выбор: string
}

const getRespondents = () =>
  axios.get<Data[]>(`${import.meta.env.VITE_BASE_URL}/respondents`)

const labelMapping = {
  gender: 'Пол',
  name: 'Имя',
  age: 'Возраст',
  city: 'Город',
  education: 'Образование',
  education_two: 'Дополнительное образование',
  occupation: 'Занятость',
  unemployed: 'Причина',
  period: 'Период',
  student: 'Статус',
  student_job: 'Подработка',
  self_employed: 'Тип предпринимательской деятельности',
  employment: 'Должность',
  freelance_employment: 'Специализация',
  freelance_work: 'Область',
  field_work: 'Сфера деятельности',
  income: 'Уровень дохода',
  job_device: 'Устройство для работы',
  leisure_device: 'Устройство для контента',
  research: 'Участие в исследованиях',
  platform: 'Удобная платформа для связи',
  time: 'Удобное время для связи',
}

// Безопасная вспомогательная функция: корректно обрабатывает undefined, null, массивы и объекты
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function safeIncludes(field: any, value: any): boolean {
  if (field === null || field === undefined) return false

  const valStr = String(value ?? '')

  if (Array.isArray(field)) {
    return field.some(item => String(item ?? '').includes(valStr))
  }

  if (typeof field === 'object') {
    try {
      return JSON.stringify(field).includes(valStr)
    } catch {
      return String(field).includes(valStr)
    }
  }

  return String(field).includes(valStr)
}

export const Step1 = () => {
  const { respondents: selectedRowKeys, setRespondents } = useQuestionContext()

  const {
    data: respondents,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['respondents', '123'],
    queryFn: getRespondents,
  })

  if (isError) {
    console.error('Error fetching respondents:', error)
    return (
      <Alert
        message='Ошибка'
        description={JSON.stringify(error)}
        type='error'
        showIcon
      />
    )
  }

  // Собираем возможные значения для фильтров.
  // Приводим значения к строкам заранее, чтобы в UI не попасть на [object Object]
  const filters =
    respondents?.data.reduce((acc, respondent) => {
      Object.entries(respondent).forEach(([key, value]) => {
        const v = value === undefined || value === null
          ? ''
          : typeof value === 'object'
            ? JSON.stringify(value)
            : String(value)

        if (!acc[key]) {
          acc[key] = [v]
          return
        }

        acc[key].push(v)
      })

      return acc
    }, {} as Record<string, string[]>) ?? {}

  const columns: TableColumnsType<Data> = Object.keys(
    respondents?.data?.[0] ?? {},
  )
    .filter(f => f !== 'telegram_id')
    .map((key) => ({
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      title: labelMapping[key] ?? key,
      dataIndex: key,
      key: key,
      filters:
        (filters[key] ? [...new Set(filters[key])] : []).map((v) => ({
          text: v,
          value: v,
        })) ?? [],
      onFilter: (value, record) =>
        // используем безопасную проверку вместо прямого .includes
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        safeIncludes((record as any)[key], value),
      render:
        key === 'age'
          ? (text: string) => (
              <span style={{ whiteSpace: 'nowrap' }}>{text}</span>
            )
          : undefined,
    }))

  return (
    <div style={{ overflowY: 'scroll' }}>
      <Typography.Text>Выбрано: {selectedRowKeys.length}</Typography.Text>
      <Table<Data>
        rowKey="telegram_id"
        size='small'
        rowSelection={{
          selectedRowKeys,
          onChange: (selectedRowKeys) => {
            setRespondents(selectedRowKeys as string[])
          },
        }}
        columns={columns}
        dataSource={respondents?.data}
        loading={isLoading}
        pagination={{ position: ['topLeft', 'bottomRight'] }}
      />
      <Divider />
    </div>
  )
}

