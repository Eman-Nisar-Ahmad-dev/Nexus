import React, { useState } from 'react';
import {
  Wallet,
  ArrowDownCircle,
  ArrowUpCircle,
  Send,
  TrendingUp,
  X,
} from 'lucide-react';
import { Card, CardHeader, CardBody } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Input } from '../../components/ui/Input';

type TxType = 'Deposit' | 'Withdraw' | 'Transfer' | 'Funding';
type TxStatus = 'Completed' | 'Pending' | 'Failed';

interface Transaction {
  id: number;
  type: TxType;
  amount: number;
  sender: string;
  receiver: string;
  status: TxStatus;
  date: string;
}

const initialTransactions: Transaction[] = [
  {
    id: 1,
    type: 'Deposit',
    amount: 5000,
    sender: 'Bank Account',
    receiver: 'You',
    status: 'Completed',
    date: '2024-02-10',
  },
  {
    id: 2,
    type: 'Funding',
    amount: 1500,
    sender: 'You',
    receiver: 'TechWave AI',
    status: 'Completed',
    date: '2024-02-12',
  },
  {
    id: 3,
    type: 'Withdraw',
    amount: 800,
    sender: 'You',
    receiver: 'Bank Account',
    status: 'Pending',
    date: '2024-02-14',
  },
];

const statusColor = (status: TxStatus) => {
  switch (status) {
    case 'Completed':
      return 'success';
    case 'Pending':
      return 'accent';
    case 'Failed':
      return 'error';
    default:
      return 'gray';
  }
};

type ModalType = 'deposit' | 'withdraw' | 'transfer' | 'fund' | null;

export const PaymentsPage: React.FC = () => {
  const [balance, setBalance] = useState(12450);
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions);
  const [activeModal, setActiveModal] = useState<ModalType>(null);

  const [amount, setAmount] = useState('');
  const [recipient, setRecipient] = useState('');

  const closeModal = () => {
    setActiveModal(null);
    setAmount('');
    setRecipient('');
  };

  const addTransaction = (tx: Omit<Transaction, 'id' | 'date'>) => {
    setTransactions(prev => [
      {
        ...tx,
        id: Date.now(),
        date: new Date().toISOString().split('T')[0],
      },
      ...prev,
    ]);
  };

  const handleDeposit = () => {
    const amt = parseFloat(amount);
    if (!amt || amt <= 0) return alert('Enter a valid amount.');
    setBalance(prev => prev + amt);
    addTransaction({
      type: 'Deposit',
      amount: amt,
      sender: 'Bank Account',
      receiver: 'You',
      status: 'Completed',
    });
    closeModal();
  };

  const handleWithdraw = () => {
    const amt = parseFloat(amount);
    if (!amt || amt <= 0) return alert('Enter a valid amount.');
    if (amt > balance) return alert('Insufficient balance.');
    setBalance(prev => prev - amt);
    addTransaction({
      type: 'Withdraw',
      amount: amt,
      sender: 'You',
      receiver: 'Bank Account',
      status: 'Completed',
    });
    closeModal();
  };

  const handleTransfer = () => {
    const amt = parseFloat(amount);
    if (!amt || amt <= 0) return alert('Enter a valid amount.');
    if (!recipient.trim()) return alert('Enter a recipient name.');
    if (amt > balance) return alert('Insufficient balance.');
    setBalance(prev => prev - amt);
    addTransaction({
      type: 'Transfer',
      amount: amt,
      sender: 'You',
      receiver: recipient.trim(),
      status: 'Completed',
    });
    closeModal();
  };

  const handleFundDeal = () => {
    const amt = parseFloat(amount);
    if (!amt || amt <= 0) return alert('Enter a valid amount.');
    if (!recipient.trim()) return alert('Select or enter an entrepreneur/startup name.');
    if (amt > balance) return alert('Insufficient balance.');
    setBalance(prev => prev - amt);
    addTransaction({
      type: 'Funding',
      amount: amt,
      sender: 'You',
      receiver: recipient.trim(),
      status: 'Completed',
    });
    closeModal();
  };

  const submitHandlers: Record<Exclude<ModalType, null>, () => void> = {
    deposit: handleDeposit,
    withdraw: handleWithdraw,
    transfer: handleTransfer,
    fund: handleFundDeal,
  };

  const modalTitles: Record<Exclude<ModalType, null>, string> = {
    deposit: 'Deposit Funds',
    withdraw: 'Withdraw Funds',
    transfer: 'Transfer Funds',
    fund: 'Fund a Deal',
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Payments</h1>
        <p className="text-gray-600">Manage your wallet, transfers, and deal funding</p>
      </div>

      {/* Wallet balance card */}
      <Card>
        <CardBody>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="p-4 bg-primary-100 rounded-xl">
                <Wallet size={28} className="text-primary-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Wallet Balance</p>
                <p className="text-3xl font-bold text-gray-900">
                  ${balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <Button leftIcon={<ArrowDownCircle size={18} />} onClick={() => setActiveModal('deposit')}>
                Deposit
              </Button>
              <Button
                variant="outline"
                leftIcon={<ArrowUpCircle size={18} />}
                onClick={() => setActiveModal('withdraw')}
              >
                Withdraw
              </Button>
              <Button
                variant="outline"
                leftIcon={<Send size={18} />}
                onClick={() => setActiveModal('transfer')}
              >
                Transfer
              </Button>
              <Button
                variant="secondary"
                leftIcon={<TrendingUp size={18} />}
                onClick={() => setActiveModal('fund')}
              >
                Fund a Deal
              </Button>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Transaction history */}
      <Card>
        <CardHeader>
          <h2 className="text-lg font-medium text-gray-900">Transaction History</h2>
        </CardHeader>
        <CardBody>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sender</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Receiver</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {transactions.map(tx => (
                  <tr key={tx.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm text-gray-900">{tx.type}</td>
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">
                      ${tx.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">{tx.sender}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{tx.receiver}</td>
                    <td className="px-4 py-3">
                      <Badge variant={statusColor(tx.status)}>{tx.status}</Badge>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500">{tx.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardBody>
      </Card>

      {/* Modal for Deposit / Withdraw / Transfer / Fund */}
      {activeModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="flex justify-between items-center p-4 border-b border-gray-200">
              <h3 className="font-medium text-gray-900">{modalTitles[activeModal]}</h3>
              <Button variant="ghost" size="sm" className="p-2" onClick={closeModal}>
                <X size={18} />
              </Button>
            </div>

            <div className="p-4 space-y-4">
              {(activeModal === 'transfer' || activeModal === 'fund') && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {activeModal === 'fund' ? 'Entrepreneur / Startup Name' : 'Recipient Name'}
                  </label>
                  <Input
                    value={recipient}
                    onChange={(e) => setRecipient(e.target.value)}
                    placeholder={activeModal === 'fund' ? 'e.g. TechWave AI' : 'e.g. John Doe'}
                    fullWidth
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Amount ($)</label>
                <Input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  fullWidth
                />
              </div>

              <p className="text-sm text-gray-500">
                Available balance: ${balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </p>

              <div className="flex justify-end gap-2 pt-2">
                <Button variant="outline" size="sm" onClick={closeModal}>
                  Cancel
                </Button>
                <Button size="sm" onClick={submitHandlers[activeModal]}>
                  Confirm
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};