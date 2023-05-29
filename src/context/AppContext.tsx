import { createContext, useContext, useState } from "react";
import { useStoreTransaction } from "../store/store";
import { Transaction } from "../interface/interfaceTransaction";

interface AppContext {
  totalIncome: number;
  totalExpenses: number;
  total: number;
  modalVisible: boolean;
  closeModal: () => void;
  openModal: () => void;
  handleEditTransaction: (id: string) => void;
  itemId: string | null;
  objectToEdit: Transaction | null;
}

const TransactionContext = createContext({} as AppContext);

export const AppContext = ({ children }: { children: JSX.Element }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [itemId, setItemId] = useState<string | null>(null);
  const [objectToEdit, setObjectToEdit] = useState<Transaction | null>(null);
  const { data } = useStoreTransaction();

  const filterIncome = data.filter((item) => item.transactionType === "Income");
  const totalIncome = filterIncome.reduce(
    (accumulador, currentValue) => accumulador + Number(currentValue.money),
    0
  );

  const filterExpenses = data.filter(
    (item) => item.transactionType === "Expenses"
  );
  const totalExpenses = filterExpenses.reduce(
    (accumulador, currentValue) => accumulador + Number(currentValue.money),
    0
  );

  const total = totalIncome - totalExpenses;

  const closeModal = () => {
    setModalVisible(false);
    setItemId(null);
    setObjectToEdit(null);
  };

  const openModal = () => {
    setModalVisible(true);
  };

  const handleEditTransaction = (id: string) => {
    const itemToEdit = data.find((item) => item.id === id);
    setItemId(id);
    setObjectToEdit(itemToEdit!);
    openModal();
  };

  return (
    <TransactionContext.Provider
      value={{
        totalIncome,
        totalExpenses,
        total,
        modalVisible,
        closeModal,
        openModal,
        handleEditTransaction,
        itemId,
        objectToEdit,
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
};

export const useTransactionContext = () => {
  const {
    totalIncome,
    totalExpenses,
    total,
    modalVisible,
    closeModal,
    openModal,
    handleEditTransaction,
    itemId,
    objectToEdit,
  } = useContext(TransactionContext);

  return {
    totalIncome,
    totalExpenses,
    total,
    modalVisible,
    closeModal,
    openModal,
    handleEditTransaction,
    itemId,
    objectToEdit,
  };
};
