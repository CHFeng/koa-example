import supertest from 'supertest';
import { expect } from 'chai';
import { describe, it, before } from 'mocha';
import app from '../src/app.js';

const request = supertest.agent(app.callback());

describe('Trade API Test', () => {
  const testAccount = {
    id: '1',
    password: '12345',
  };
  let token;

  before('sing in first', async () => {
    const response = await request.post('/sing-in').send({ id: testAccount.id, password: testAccount.password });
    const text = JSON.parse(response.text);
    token = text.token;
  });

  describe('Deposit', () => {
    const url = '/trade/deposit';
    it('should get failed when token missed', async () => {
      const response = await request.set({ token: '' }).post(url);
      const { result, message } = JSON.parse(response.text);
      expect(response.status).eq(401);
      expect(result).eq('failed');
      expect(message).eq('It should be authenticated');
    });

    it('should get failed when token failed', async () => {
      const response = await request.set({ token: '1234' }).post(url);
      const { result, message } = JSON.parse(response.text);
      expect(response.status).eq(401);
      expect(result).eq('failed');
      expect(message).eq('jwt malformed');
    });

    it('should get failed when token failed', async () => {
      const response = await request.set({ token }).post(url);
      const { result, message } = JSON.parse(response.text);
      expect(response.status).eq(400);
      expect(result).eq('failed');
      expect(message).eq('Missing field');
    });

    it('should deposit successfully', async () => {
      const response = await request.set({ token }).post(url).send({ value: 10 });
      const { result, balance } = JSON.parse(response.text);
      expect(response.status).eq(200);
      expect(result).eq('success');
      expect(balance).eq(10);
    });
  });

  describe('Withdraw', () => {
    const url = '/trade/withdraw';
    it('should get failed when token missed', async () => {
      const response = await request.set({ token: '' }).post(url);
      const { result, message } = JSON.parse(response.text);
      expect(response.status).eq(401);
      expect(result).eq('failed');
      expect(message).eq('It should be authenticated');
    });

    it('should get failed when token failed', async () => {
      const response = await request.set({ token: '1234' }).post(url);
      const { result, message } = JSON.parse(response.text);
      expect(response.status).eq(401);
      expect(result).eq('failed');
      expect(message).eq('jwt malformed');
    });

    it('should get failed when token failed', async () => {
      const response = await request.set({ token }).post(url);
      const { result, message } = JSON.parse(response.text);
      expect(response.status).eq(400);
      expect(result).eq('failed');
      expect(message).eq('Missing field');
    });

    it('should get failed when balance is not enough', async () => {
      const response = await request.set({ token }).post(url).send({ value: 100 });
      const { result, message } = JSON.parse(response.text);
      expect(response.status).eq(400);
      expect(result).eq('failed');
      expect(message).eq('The value that to withdraw must greater than the balance');
    });

    it('should withdraw successfully', async () => {
      const response = await request.set({ token }).post(url).send({ value: 5 });
      const { result, balance } = JSON.parse(response.text);
      expect(response.status).eq(200);
      expect(result).eq('success');
      expect(balance).eq(5);
    });
  });

  describe('Transfer', () => {
    const url = '/trade/transfer';
    it('should get failed when token missed', async () => {
      const response = await request.set({ token: '' }).post(url);
      const { result, message } = JSON.parse(response.text);
      expect(response.status).eq(401);
      expect(result).eq('failed');
      expect(message).eq('It should be authenticated');
    });

    it('should get failed when token failed', async () => {
      const response = await request.set({ token: '1234' }).post(url);
      const { result, message } = JSON.parse(response.text);
      expect(response.status).eq(401);
      expect(result).eq('failed');
      expect(message).eq('jwt malformed');
    });

    it('should get failed when token failed', async () => {
      const response = await request.set({ token }).post(url);
      const { result, message } = JSON.parse(response.text);
      expect(response.status).eq(400);
      expect(result).eq('failed');
      expect(message).eq('Missing field');
    });

    it('should get failed when balance is not enough', async () => {
      const response = await request.set({ token }).post(url).send({ toAccountId: '2', value: 100 });
      const { result, message } = JSON.parse(response.text);
      expect(response.status).eq(400);
      expect(result).eq('failed');
      expect(message).eq('The value that to transfer from id:1 must greater than the balance');
    });

    it('should get failed when transfer to itself', async () => {
      const response = await request.set({ token }).post(url).send(
        { toAccountId: testAccount.id, value: 100 },
      );
      const { result, message } = JSON.parse(response.text);
      expect(response.status).eq(400);
      expect(result).eq('failed');
      expect(message).eq('It can not be transfer to yourself');
    });

    it('should transfer successfully', async () => {
      const response = await request.set({ token }).post(url).send({ toAccountId: '2', value: 5 });
      const { result, from, to } = JSON.parse(response.text);
      expect(response.status).eq(200);
      expect(result).eq('success');
      expect(from.id).eq(testAccount.id);
      expect(from.balance).eq(0);
      expect(to.id).eq('2');
      expect(to.balance).eq(5);
    });
  });
});
