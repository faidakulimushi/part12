import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom/vitest'
import { describe, expect, test } from 'vitest'
import Todo from '../Todo'

describe('Todo component', () => {
  test('renders the todo text', () => {
    const todo = {
      id: '1',
      text: 'Learn Docker',
      done: false
    }

    render(
      <Todo
        todo={todo}
        deleteTodo={() => {}}
        completeTodo={() => {}}
      />
    )

    expect(screen.getByText('Learn Docker')).toBeInTheDocument()
  })
})