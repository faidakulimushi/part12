import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import Blog from './Blog'

const blog = {
  title: 'The Practical Test Pyramid',
  author: 'Ham Vocke',
  url: 'https://example.com',
  likes: 5,
  user: {
    username: 'mluukkai',
    name: 'Matti Luukkainen'
  }
}

describe('Blog', () => {
  it('renders title and author but not url or likes by default', () => {
    render(
      <Blog
        blog={blog}
        handleLike={vi.fn()}
        handleDelete={vi.fn()}
        user={{ username: 'other' }}
      />
    )

    expect(screen.getByText(/The Practical Test Pyramid/i)).toBeDefined()
    expect(screen.getByText(/Ham Vocke/i)).toBeDefined()

    expect(screen.queryByText('https://example.com')).toBeNull()
    expect(screen.queryByText(/likes/i)).toBeNull()
  })
})
