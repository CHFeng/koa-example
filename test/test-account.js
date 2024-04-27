import supertest from 'supertest';
import { expect } from 'chai';
import { describe, it } from 'mocha';
import app from '../src/app.js';

const request = supertest.agent(app.callback());

describe('Account API Test', () => {
  const testAccount = {
    id: 'unit-test-account',
    name: 'unit-test-account',
    password: '12345',
    secondPassword: '12345',
  };
  describe('SingUp', () => {
    it('should get failed when missing field', async () => {
      const response = await request.post('/sing-up');
      const { result, message } = JSON.parse(response.text);
      expect(response.status).eq(400);
      expect(result).eq('failed');
      expect(message).eq('It should be have id, name, password, secondPassword');
    });

    it('should get failed when password is different', async () => {
      const failedAccount = { ...testAccount };
      failedAccount.secondPassword = 'password';
      const response = await request.post('/sing-up').send(failedAccount);
      const { result, message } = JSON.parse(response.text);
      expect(response.status).eq(400);
      expect(result).eq('failed');
      expect(message).eq('The password and secondPassword should be same');
    });

    it('should to create account successfully', async () => {
      const response = await request.post('/sing-up').send(testAccount);
      const { result, message } = JSON.parse(response.text);
      expect(response.status).eq(200);
      expect(result).eq('success');
      expect(message).eq('create account success');
    });

    it('should get failed when account has already existed', async () => {
      const response = await request.post('/sing-up').send(testAccount);
      const { result, message } = JSON.parse(response.text);
      expect(response.status).eq(400);
      expect(result).eq('failed');
      expect(message).eq('This account has already existed');
    });
  });

  describe('SingIn', () => {
    it('should get failed when missing field', async () => {
      const response = await request.post('/sing-in').send();
      const { result, message } = JSON.parse(response.text);
      expect(response.status).eq(400);
      expect(result).eq('failed');
      expect(message).eq('It should be have id, password');
    });

    it('should get failed when account does not exists', async () => {
      const response = await request.post('/sing-in').send({ id: 'abc', password: '1234' });
      const { result, message } = JSON.parse(response.text);
      expect(response.status).eq(400);
      expect(result).eq('failed');
      expect(message).eq('The account does not exist');
    });

    it('should get failed when password is wrong', async () => {
      const response = await request.post('/sing-in').send({ id: testAccount.id, password: '1234' });
      const { result, message } = JSON.parse(response.text);
      expect(response.status).eq(401);
      expect(result).eq('failed');
      expect(message).eq('The password is wrong');
    });

    it('should sing in successfully', async () => {
      const response = await request.post('/sing-in').send({ id: testAccount.id, password: testAccount.password });
      const { result, token } = JSON.parse(response.text);
      expect(response.status).eq(200);
      expect(result).eq('success');
      expect(token).not.eq('');
    });
  });
});
