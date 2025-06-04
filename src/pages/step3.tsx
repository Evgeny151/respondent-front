import { Card, Form, Input, Typography } from 'antd'
import { useQuestionContext } from '../questionContext'

const style = { textAlign: 'start' } as const

export const Step3 = () => {
  const [form] = Form.useForm()

  const { setresearchDescription, researchDescription } = useQuestionContext()

  const { research_name, date, payment, description, format, duration } =
    Form.useWatch([], form) ?? {}

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '2fr 1fr',
        gap: 20,
      }}
    >
      <Form
        form={form}
        name='control-hooks'
        layout='vertical'
        onFieldsChange={() => {
          setresearchDescription(form.getFieldsValue())
        }}
        initialValues={researchDescription}
      >
        <Form.Item name='research_name' label='Название исследования'>
          <Input.TextArea placeholder='Интервью пользователей приложения для прослушивания музыки' />
        </Form.Item>
        <Form.Item name='date' label='Дата проведения'>
          <Input placeholder='С 01.05 до 06.05' />
        </Form.Item>
        <Form.Item name='payment' label='Оплата'>
          <Input placeholder='1800 рублей на карту' />
        </Form.Item>
        <Form.Item name='description' label='Описание'>
          <Input.TextArea placeholder='Вы являетесь активным пользователем приложения для прослушивания музыки и имеете платную подписку' />
        </Form.Item>
        <Form.Item name='format' label='Формат'>
          <Input placeholder='Zoom/Google Meet/Telegram/Телемост' />
        </Form.Item>
        <Form.Item name='duration' label='Продолжительность'>
          <Input placeholder='90 минут' />
        </Form.Item>
      </Form>
      <Card style={{ height: 'fit-content' }}>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'start',
          }}
        >
          <Typography.Text style={style}>{research_name}</Typography.Text>
          <Typography.Text style={style}>Дата: {date}</Typography.Text>
          <Typography.Text style={style}>Оплата: {payment}</Typography.Text>
          <Typography.Text style={style}>
            Описание: {description}
          </Typography.Text>
          <Typography.Text style={style}>Формат: {format}</Typography.Text>
          <Typography.Text style={style}>
            Продолжительность: {duration}
          </Typography.Text>
        </div>
      </Card>
    </div>
  )
}
