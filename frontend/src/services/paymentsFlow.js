import { accountService } from './accountService';
import { paymentService } from './paymentService';

export async function deposit({ accountId, amount }) {
  const acc = await accountService.getAccountById(accountId);
  const newBalance = (parseFloat(acc.balance) || 0) + amount;
  await accountService.updateAccount(accountId, { balance: newBalance });
  await paymentService.createTransfer({
    fromAccountId: Number(accountId),
    toAccountId: Number(accountId),
    amount,
    currency: acc.currency || 'USD',
    description: 'Cash deposit',
    transferType: 'DEPOSIT'
  });
}

export async function selfTransfer({ fromId, toId, amount }) {
  const from = await accountService.getAccountById(fromId);
  const to = await accountService.getAccountById(toId);
  if ((from.balance || 0) < amount) throw new Error('Insufficient balance');
  await accountService.updateAccount(fromId, { balance: (parseFloat(from.balance) || 0) - amount });
  await accountService.updateAccount(toId, { balance: (parseFloat(to.balance) || 0) + amount });
  await paymentService.createTransfer({
    fromAccountId: Number(fromId),
    toAccountId: Number(toId),
    amount,
    currency: from.currency || 'USD',
    description: 'Self transfer',
    transferType: 'INTERNAL'
  });
}

export async function bankTransferExisting({ fromId, toId, amount, descriptionPrefix }) {
  const from = await accountService.getAccountById(fromId);
  const to = await accountService.getAccountById(toId);
  if ((from.balance || 0) < amount) throw new Error('Insufficient balance');
  await accountService.updateAccount(fromId, { balance: (parseFloat(from.balance) || 0) - amount });
  await accountService.updateAccount(toId, { balance: (parseFloat(to.balance) || 0) + amount });
  await paymentService.createTransfer({
    fromAccountId: Number(fromId),
    toAccountId: Number(toId),
    amount,
    currency: from.currency || 'USD',
    description: descriptionPrefix || 'Bank transfer',
    transferType: 'BANK'
  });
}

export async function bankTransferExternal({ fromId, amount, bankName, ifsc, accountNumber }) {
  const from = await accountService.getAccountById(fromId);
  if ((from.balance || 0) < amount) throw new Error('Insufficient balance');
  await accountService.updateAccount(fromId, { balance: (parseFloat(from.balance) || 0) - amount });
  await paymentService.createTransfer({
    fromAccountId: Number(fromId),
    toAccountId: 0,
    amount,
    currency: from.currency || 'USD',
    description: `External bank transfer to ${bankName} / IFSC ${ifsc} / ${accountNumber}`,
    transferType: 'EXTERNAL'
  });
}


