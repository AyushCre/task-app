import { validateTaskCreation, handleValidationErrors } from '../middleware/validation.js';
import { validationResult } from 'express-validator';
import { AppError } from '../middleware/errorHandler.js';

// Mock request and response objects
const mockRequest = (body) => ({
  body
});

const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

const mockNext = jest.fn();

describe('Validation Middleware', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('validateTaskCreation', () => {
    it('should pass validation for valid task data', async () => {
      const req = mockRequest({ title: 'Valid Task', description: 'Test description' });
      const res = mockResponse();
      
      // Run validation
      for (const validation of validateTaskCreation) {
        await validation(req, res, mockNext);
      }
      
      // Check for validation errors
      const errors = validationResult(req);
      expect(errors.isEmpty()).toBe(true);
    });

    it('should fail validation for missing title', async () => {
      const req = mockRequest({ description: 'No title' });
      const res = mockResponse();
      
      // Run validation
      for (const validation of validateTaskCreation) {
        await validation(req, res, mockNext);
      }
      
      // Check for validation errors
      const errors = validationResult(req);
      expect(errors.isEmpty()).toBe(false);
      expect(errors.array()).toContainEqual(
        expect.objectContaining({
          path: 'title',
          msg: 'Title is required'
        })
      );
    });

    it('should fail validation for title too long', async () => {
      const longTitle = 'a'.repeat(201);
      const req = mockRequest({ title: longTitle });
      const res = mockResponse();
      
      // Run validation
      for (const validation of validateTaskCreation) {
        await validation(req, res, mockNext);
      }
      
      // Check for validation errors
      const errors = validationResult(req);
      expect(errors.isEmpty()).toBe(false);
      expect(errors.array()).toContainEqual(
        expect.objectContaining({
          path: 'title',
          msg: 'Title must be between 1 and 200 characters'
        })
      );
    });
  });

  describe('handleValidationErrors', () => {
    it('should call next if no validation errors', () => {
      const req = mockRequest({ title: 'Valid Task' });
      const res = mockResponse();
      
      // Mock validationResult to return no errors
      jest.spyOn(require('express-validator'), 'validationResult').mockReturnValue({
        isEmpty: () => true,
        array: () => []
      });
      
      handleValidationErrors(req, res, mockNext);
      
      expect(mockNext).toHaveBeenCalled();
    });

    it('should throw AppError with validation details if errors exist', () => {
      const req = mockRequest({});
      const res = mockResponse();
      
      // Mock validationResult to return errors
      jest.spyOn(require('express-validator'), 'validationResult').mockReturnValue({
        isEmpty: () => false,
        array: () => [
          { path: 'title', msg: 'Title is required', value: undefined }
        ]
      });
      
      expect(() => {
        handleValidationErrors(req, res, mockNext);
      }).toThrow(AppError);
      
      expect(mockNext).not.toHaveBeenCalled();
    });
  });
});
