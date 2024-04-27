import supertest from 'supertest';
import { expect } from 'chai';
import { describe, it } from 'mocha';
import app from '../src/app.js';

const request = supertest.agent(app.callback());

describe('Integration test', () => {
  const testAccount = {
    id: 'unit-test-account',
    name: 'unit-test-account',
    password: '12345',
    secondPassword: '12345',
  };
  let token;

  it('should to create account successfully', async () => {
    const response = await request.post('/sing-up').send(testAccount);
    const { result, message } = JSON.parse(response.text);
    expect(response.status).eq(200);
    expect(result).eq('success');
    expect(message).eq('create account success');
  });

  it('should sing in successfully', async () => {
    const response = await request.post('/sing-in').send({ id: testAccount.id, password: testAccount.password });
    const text = JSON.parse(response.text);
    token = text.token;
    expect(response.status).eq(200);
    expect(text.result).eq('success');
    expect(token).not.eq('');
  });

  it('should to get balance successfully', async () => {
    const response = await request.set({ token }).get('/account-balance');
    const { result, balance } = JSON.parse(response.text);
    expect(response.status).eq(200);
    expect(result).eq('success');
    expect(balance).eq(0);
  });

  it('should deposit successfully', async () => {
    const response = await request.set({ token }).post('/trade/deposit').send({ value: 10 });
    const { result, balance } = JSON.parse(response.text);
    expect(response.status).eq(200);
    expect(result).eq('success');
    expect(balance).eq(10);
  });

  it('should withdraw successfully', async () => {
    const response = await request.set({ token }).post('/trade/withdraw').send({ value: 5 });
    const { result, balance } = JSON.parse(response.text);
    expect(response.status).eq(200);
    expect(result).eq('success');
    expect(balance).eq(5);
  });

  it('should transfer successfully', async () => {
    const response = await request.set({ token }).post('/trade/transfer').send({ toAccountId: '2', value: 5 });
    const { result, from, to } = JSON.parse(response.text);
    expect(response.status).eq(200);
    expect(result).eq('success');
    expect(from.id).eq(testAccount.id);
    expect(from.balance).eq(0);
    expect(to.id).eq('2');
    expect(to.balance).eq(5);
  });
});
