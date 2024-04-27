import fs from 'fs';

const LOG_FILE_NAME = 'transaction_log.txt';

const accounts = [
  {
    id: '1',
    name: 'testAccount1',
    password: 'n+vbVbkzEBdmypNZQar/y3rg+mSb/AONP/BGaWCV14I=',
    balance: 0,
  },
  {
    id: '2',
    name: 'testAccount2',
    password: 'n+vbVbkzEBdmypNZQar/y3rg+mSb/AONP/BGaWCV14I=',
    balance: 0,
  },
];
/**
 *  insert an account into table
 * @param {string} id
 * @param {string} name
 * @param {string} password
 */
const create = async (id, name, password) => {
  accounts.push({
    id, name, password, balance: 0,
  });
};
/**
 *  update an account in table by id
 * @param {string} id
 * @param {string} password
 */
const update = async (id, password) => {
  const data = accounts.find((row) => row.id === id);
  data.password = password;
};
/**
 *  get an account by id
 * @param {string} id
 */
const getById = async (id) => {
  const data = accounts.find((row) => row.id === id);

  return data;
};
/**
 *  get all accounts
 */
const getAll = async () => accounts;

const balanceTransaction = async (id, value) => {
  const data = accounts.find((row) => row.id === id);
  const originalValue = data.balance;
  let isFailed = false;
  try {
    data.balance += value;
  } catch (e) {
    isFailed = true;
    // if something goes wrong, revert to original value
    data.balance = originalValue;
  }
  const log = `[${new Date().toISOString()}] ID: "${id}", OP: "${value < 0 ? 'withdraw' : 'deposit'}", Result: "${isFailed ? 'Failed' : 'success'}", value: "${Math.abs(value)}", balance: "${data.balance}"\n`;
  fs.appendFileSync(LOG_FILE_NAME, log);

  return data.balance;
};
/**
 * to deposit value into account
 * @param {string} id
 * @param {number} value
 */
const depositById = async (id, value) => {
  const balance = await balanceTransaction(id, value);

  return balance;
};

/**
 * to withdraw value from account
 * @param {string} id
 * @param {number} value
 */
const withdrawById = async (id, value) => {
  const balance = await balanceTransaction(id, -value);

  return balance;
};

/**
 * to transfer value from account a into account b
 * @param {string} fromId
 * @param {string} toId
 * @param {number} value
 */
const transfer = async (fromId, toId, value) => {
  const fromAccount = accounts.find((row) => row.id === fromId);
  const toAccount = accounts.find((row) => row.id === toId);
  const originalValue = { fromAccount: fromAccount.balance, toAccount: toAccount.balance };

  try {
    await balanceTransaction(fromId, -value);
    await balanceTransaction(toId, value);
  } catch (e) {
    // if something goes wrong, revert to original value
    fromAccount.balance = originalValue.fromAccount;
    toAccount.balance = originalValue.toAccount;
  }
  const from = { ...fromAccount };
  delete from.password;
  const to = { ...toAccount };
  delete to.password;

  return { from, to };
};

export default {
  create,
  update,
  getAll,
  getById,
  depositById,
  withdrawById,
  transfer,
};
