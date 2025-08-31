import request from 'supertest';
import app from '../server.js';
import Task from '../models/Task.js';

describe('Task API', () => {
  describe('GET /api/tasks', () => {
    it('should return an empty array when no tasks exist', async () => {
      const response = await request(app).get('/api/tasks');
      expect(response.status).toBe(200);
      expect(response.body).toEqual([]);
    });

    it('should return all tasks', async () => {
      // Create test tasks
      const task1 = await Task.create({ title: 'Test Task 1' });
      const task2 = await Task.create({ title: 'Test Task 2' });

      const response = await request(app).get('/api/tasks');
      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(2);
      expect(response.body[0].title).toBe('Test Task 2'); // Should be sorted by createdAt desc
      expect(response.body[1].title).toBe('Test Task 1');
    });
  });

  describe('POST /api/tasks', () => {
    it('should create a new task with valid data', async () => {
      const taskData = { title: 'New Task', description: 'Test description' };
      const response = await request(app)
        .post('/api/tasks')
        .send(taskData);

      expect(response.status).toBe(201);
      expect(response.body.title).toBe('New Task');
      expect(response.body.description).toBe('Test description');
      expect(response.body.completed).toBe(false);
    });

    it('should reject task creation without title', async () => {
      const response = await request(app)
        .post('/api/tasks')
        .send({ description: 'No title provided' });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Validation failed');
      expect(response.body.details).toContainEqual(
        expect.objectContaining({
          field: 'title',
          message: 'Title is required'
        })
      );
    });

    it('should reject task with empty title', async () => {
      const response = await request(app)
        .post('/api/tasks')
        .send({ title: '   ', description: 'Empty title' });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Validation failed');
      expect(response.body.details).toContainEqual(
        expect.objectContaining({
          field: 'title',
          message: 'Title is required'
        })
      );
    });

    it('should reject task with title too long', async () => {
      const longTitle = 'a'.repeat(201);
      const response = await request(app)
        .post('/api/tasks')
        .send({ title: longTitle });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Validation failed');
      expect(response.body.details).toContainEqual(
        expect.objectContaining({
          field: 'title',
          message: 'Title must be between 1 and 200 characters'
        })
      );
    });

    it('should reject task with description too long', async () => {
      const longDescription = 'a'.repeat(1001);
      const response = await request(app)
        .post('/api/tasks')
        .send({ title: 'Valid Title', description: longDescription });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Validation failed');
      expect(response.body.details).toContainEqual(
        expect.objectContaining({
          field: 'description',
          message: 'Description cannot exceed 1000 characters'
        })
      );
    });
  });

  describe('PUT /api/tasks/:id', () => {
    it('should update an existing task', async () => {
      const task = await Task.create({ title: 'Original Task' });
      const updateData = { title: 'Updated Task', completed: true };

      const response = await request(app)
        .put(`/api/tasks/${task._id}`)
        .send(updateData);

      expect(response.status).toBe(200);
      expect(response.body.title).toBe('Updated Task');
      expect(response.body.completed).toBe(true);
    });

    it('should return 404 for non-existent task', async () => {
      const response = await request(app)
        .put('/api/tasks/507f1f77bcf86cd799439011') // Valid but non-existent ObjectId
        .send({ title: 'Updated Task' });

      expect(response.status).toBe(404);
    });
  });

  describe('DELETE /api/tasks/:id', () => {
    it('should delete an existing task', async () => {
      const task = await Task.create({ title: 'Task to delete' });

      const response = await request(app)
        .delete(`/api/tasks/${task._id}`);

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Task deleted successfully');

      // Verify task is actually deleted
      const deletedTask = await Task.findById(task._id);
      expect(deletedTask).toBeNull();
    });

    it('should return 404 for non-existent task', async () => {
      const response = await request(app)
        .delete('/api/tasks/507f1f77bcf86cd799439011');

      expect(response.status).toBe(404);
    });
  });

  describe('PATCH /api/tasks/:id/toggle', () => {
    it('should toggle task completion status', async () => {
      const task = await Task.create({ title: 'Task to toggle', completed: false });

      const response = await request(app)
        .patch(`/api/tasks/${task._id}/toggle`);

      expect(response.status).toBe(200);
      expect(response.body.completed).toBe(true);

      // Toggle again
      const response2 = await request(app)
        .patch(`/api/tasks/${task._id}/toggle`);

      expect(response2.status).toBe(200);
      expect(response2.body.completed).toBe(false);
    });

    it('should return 404 for non-existent task', async () => {
      const response = await request(app)
        .patch('/api/tasks/507f1f77bcf86cd799439011/toggle');

      expect(response.status).toBe(404);
    });
  });
});
