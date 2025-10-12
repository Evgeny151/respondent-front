import { useState } from 'react'
import { Button, message, Spin, Steps } from 'antd'
import { Step1 } from './step1'
import { FormBuilder, type Question } from './testForm'
import { Step3 } from './step3'
import { useMutation } from '@tanstack/react-query'
import axios from 'axios'

import { useQuestionContext } from '../questionContext'

const steps = [
  {
    title: 'Выбор респондентов',
    description: '',
    content: <Step1 />,
  },
  {
    title: 'Анкета',
    description: 'Создайте анкету',
    content: <FormBuilder />,
  },
  {
    title: 'Приглашение',
    description: 'Пригласите респондентов',
    content: <Step3 />,
  },
] as const

const createSurvey = (data: {
  respondents: string[]
  questions: Question[]
  researchDescription: Record<string, string>
}) => axios.post(`${import.meta.env.VITE_BASE_URL}/surveys`, data)

export const MainPage = () => {
  const [current, setCurrent] = useState(0)
  const { respondents, questions, researchDescription, clear } =
    useQuestionContext()
  console.log("questions", questions);
  
    
  const { mutate, isPending } = useMutation({
    mutationFn: createSurvey,
    onSuccess: () => {
      message.success('Анкета успешно создана!')
      clear()
      setCurrent(0)
    },
  })

  const next = () => {
    setCurrent(current + 1)
  }

  const prev = () => {
    setCurrent(current - 1)
  }

  const items = steps.map((item, key) => ({
    key,
    title: item.title,
    description: item.description,
  }))

  return (
    <>
      {isPending && <Spin fullscreen />}
      <Steps current={current} items={items} onChange={(v) => setCurrent(v)} />
      <div style={{ marginBottom: 10 }}>
        {current > 0 && (
          <Button style={{ margin: '0 8px' }} onClick={() => prev()}>
            Назад
          </Button>
        )}
        {current < steps.length - 1 && (
          <Button disabled={!respondents.length || !questions.length} type='primary' onClick={() => next()}>
            Дальше
          </Button>
        )}
        {current === steps.length - 1 && (
          <Button
            type='primary'
            onClick={() => {
              message.success('Processing complete!')
              mutate({ respondents, questions, researchDescription })
            }}
          >
            Отправить
          </Button>
        )}
      </div>
      <div>{steps[current].content}</div>
    </>
  )
}
