import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'
import Togglable from './components/Togglable'
import Notification from './components/Notification'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [notification, setNotification] = useState({ message: null, type: 'success' })
  const blogFormRef = useRef()

  useEffect(() => {
    if (user) {
      blogService.getAll().then(setBlogs)
    }
  }, [user])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const savedUser = JSON.parse(loggedUserJSON)
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setUser(savedUser)
      blogService.setToken(savedUser.token)
    }
  }, [])

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type })
    setTimeout(() => setNotification({ message: null, type: 'success' }), 5000)
  }

  const handleLogin = async (credentials) => {
    try {
      const loggedUser = await loginService.login(credentials)
      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(loggedUser))
      blogService.setToken(loggedUser.token)
      setUser(loggedUser)
    } catch (_error) {
      showNotification('Wrong username or password', 'error')
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    blogService.setToken(null)
    setUser(null)
    setBlogs([])
  }

  const updateBlogLikes = async (blog) => {
    try {
      const updatedBlog = {
        user: blog.user.id || blog.user._id,
        likes: blog.likes + 1,
        author: blog.author,
        title: blog.title,
        url: blog.url
      }
      const returnedBlog = await blogService.update(blog.id, updatedBlog)
      const updatedBlogWithUser = {
        ...returnedBlog,
        user: blog.user
      }
      setBlogs(blogs.map(b => b.id === updatedBlogWithUser.id ? updatedBlogWithUser : b))
    } catch (error) {
      console.error(error)
    }
  }

  const removeBlog = async (blog) => {
    const ok = window.confirm(`Remove blog ${blog.title} by ${blog.author}?`)
    if (!ok) return
    try {
      await blogService.remove(blog.id)
      setBlogs(blogs.filter(b => b.id !== blog.id))
    } catch (error) {
      console.error(error)
    }
  }

  const handleCreateBlog = async (blogData) => {
    try {
      const newBlog = await blogService.create(blogData)
      setBlogs(blogs.concat(newBlog))
      showNotification(`a new blog ${newBlog.title} by ${newBlog.author} added`)
      blogFormRef.current.toggleVisibility()
    } catch (_error) {
      showNotification('Failed to create blog', 'error')
    }
  }

  if (!user) {
    return (
      <div>
        <Notification message={notification.message} type={notification.type} />
        <LoginForm onLogin={handleLogin} />
      </div>
    )
  }

  return (
    <div>
      <h2>blogs</h2>
      <Notification message={notification.message} type={notification.type} />
      <p>
        {user.name} logged in
        <button onClick={handleLogout}>logout</button>
      </p>
      <Togglable buttonLabel="create new blog" ref={blogFormRef}>
        <BlogForm createBlog={handleCreateBlog} />
      </Togglable>
      {[...blogs].sort((a, b) => b.likes - a.likes).map(blog => (
        <Blog key={blog.id} blog={blog} handleLike={updateBlogLikes} handleDelete={removeBlog} user={user} />
      ))}
    </div>
  )
}

export default App
