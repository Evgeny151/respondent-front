import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import './App.css'

import { MainPage } from './pages/main'
import { QuestionProvider } from './questionContext'

const queryClient = new QueryClient()

function App() {
  console.log("CI");
  
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <QuestionProvider>
          <MainPage />
        </QuestionProvider>
      </QueryClientProvider>
    </>
  )
}

export default App
