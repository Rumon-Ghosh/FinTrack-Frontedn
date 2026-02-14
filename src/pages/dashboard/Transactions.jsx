import React, { useEffect, useState } from 'react';
import {
  Plus,
  Search,
  Trash2,
  Edit3,
  ArrowUpCircle,
  ArrowDownCircle,
  Filter,
  Calendar,
  ChevronDown,
  X,
  CreditCard,
  Wallet,
  ArrowRightLeft,
  ChevronUp,
  Download,
  FileText,
  Table as TableIcon
} from 'lucide-react';
import { useForm } from 'react-hook-form';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import useAxiosPublic from '../../hooks/useAxiosPublic';
import Swal from 'sweetalert2';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterCategory, setFilterCategory] = useState("all");
  const [sortBy, setSortBy] = useState("date");
  const [sortOrder, setSortOrder] = useState("desc");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [stats, setStats] = useState({ totalIncome: 0, totalExpense: 0 });

  const axiosSecure = useAxiosSecure();
  const axiosPublic = useAxiosPublic();

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm();

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const res = await axiosSecure.get(`/transactions`, {
        params: {
          page: currentPage,
          limit: 10,
          type: filterType,
          category: filterCategory,
          search: searchQuery,
          sortBy: sortBy,
          order: sortOrder
        }
      });
      setTransactions(res.data.transactions);
      setTotalPages(res.data.totalPages);
      setTotalItems(res.data.total);
      setStats(res.data.stats);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("desc");
    }
    setCurrentPage(1);
  };

  const fetchCategories = async () => {
    try {
      const res = await axiosPublic.get('/categories');
      setCategories(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [currentPage, filterType, filterCategory, searchQuery, sortBy, sortOrder]);

  useEffect(() => {
    fetchCategories();
  }, []);

  // Export Logic
  const handleExportCSV = async () => {
    setExporting(true);
    try {
      const res = await axiosSecure.get('/transactions/all');
      const allData = res.data;

      const headers = ['Date', 'Category', 'Type', 'Amount', 'Note'];
      const csvContent = [
        headers.join(','),
        ...allData.map(t => [
          new Date(t.date).toLocaleDateString(),
          t.category,
          t.type,
          t.amount,
          `"${t.note || ''}"`
        ].join(','))
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `FinTrack_Report_${new Date().toLocaleDateString()}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      Swal.fire('Error', 'Failed to export CSV', 'error');
    } finally {
      setExporting(false);
    }
  };

  const handleExportPDF = async () => {
    setExporting(true);
    try {
      const res = await axiosSecure.get('/transactions/all');
      const allData = res.data;

      const doc = new jsPDF();
      doc.text("FinTrack - Financial Report", 14, 15);
      doc.setFontSize(10);
      doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 22);

      const tableColumn = ["Date", "Category", "Type", "Amount", "Note"];
      const tableRows = allData.map(t => [
        new Date(t.date).toLocaleDateString(),
        t.category,
        t.type.toUpperCase(),
        `$${t.amount.toLocaleString()}`,
        t.note || "-"
      ]);

      autoTable(doc, {
        head: [tableColumn],
        body: tableRows,
        startY: 30,
        theme: 'striped',
        headStyles: { fillColor: [99, 102, 241] } // Primary color
      });

      doc.save(`FinTrack_Report_${new Date().toLocaleDateString()}.pdf`);
    } catch (err) {
      Swal.fire('Error', 'Failed to export PDF', 'error');
    } finally {
      setExporting(false);
    }
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1); // Reset to first page on search
  };

  const handleFilterTypeChange = (e) => {
    setFilterType(e.target.value);
    setCurrentPage(1);
  };

  const handleFilterCategoryChange = (e) => {
    setFilterCategory(e.target.value);
    setCurrentPage(1);
  };

  const openAddModal = () => {
    setEditingTransaction(null);
    reset({
      amount: '',
      type: 'expense',
      category: '',
      date: new Date().toISOString().split('T')[0],
      note: ''
    });
    setIsModalOpen(true);
  };

  const openEditModal = (transaction) => {
    setEditingTransaction(transaction);
    reset({
      amount: transaction.amount,
      type: transaction.type,
      category: transaction.category,
      date: transaction.date.split('T')[0],
      note: transaction.note
    });
    setIsModalOpen(true);
  };

  const onSubmit = async (data) => {
    try {
      if (editingTransaction) {
        const res = await axiosSecure.patch(`/transactions/${editingTransaction._id}`, data);
        if (res.data.modifiedCount > 0) {
          Swal.fire('Updated!', 'Transaction has been modified.', 'success');
        }
      } else {
        const res = await axiosSecure.post('/transactions', data);
        if (res.data.insertedId) {
          Swal.fire('Success!', 'New transaction recorded.', 'success');
        }
      }
      setIsModalOpen(false);
      fetchTransactions();
    } catch (err) {
      Swal.fire('Error', 'Something went wrong', 'error');
    }
  };

  const handleDelete = async (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This will permanently remove this entry!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!"
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await axiosSecure.delete(`/transactions/${id}`);
          if (res.data.deletedCount > 0) {
            Swal.fire('Deleted!', 'Transaction has been removed.', 'success');
            fetchTransactions();
          }
        } catch (err) {
          Swal.fire('Error', 'Deletion failed', 'error');
        }
      }
    });
  };

  const totalIncome = stats.totalIncome;
  const totalExpense = stats.totalExpense;
  const netBalance = totalIncome - totalExpense;

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-20">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-base-100 p-6 rounded-2xl border border-base-content/5 shadow-sm">
        <div>
          <h2 className="text-2xl font-black tracking-tight flex items-center gap-2">
            <ArrowRightLeft className="text-primary size-7" /> Financial Records
          </h2>
          <p className="text-base-content/60 text-sm">Track your daily financial movements.</p>
        </div>
        <div className="flex gap-3 w-full sm:w-auto">
          {/* Download Dropdown */}
          <div className="dropdown dropdown-end flex-1 sm:flex-none">
            <div
              tabIndex={0}
              role="button"
              className={`btn btn-outline btn-sm h-12 gap-2 w-full sm:w-auto ${exporting ? 'loading' : ''}`}
              disabled={exporting}
            >
              {!exporting && <Download className="size-4" />}
              {exporting ? 'Generating...' : 'Download Report'}
            </div>
            <ul tabIndex={0} className="dropdown-content z-[100] menu p-2 shadow-2xl bg-base-100 rounded-box w-52 mt-2 border border-base-content/5">
              <li>
                <button onClick={handleExportPDF} className="flex items-center gap-3 py-3">
                  <FileText className="size-4 text-error" />
                  <div className="flex flex-col items-start leading-none">
                    <span className="font-bold">PDF Document</span>
                    <span className="text-[10px] opacity-50">Standard Report</span>
                  </div>
                </button>
              </li>
              <li>
                <button onClick={handleExportCSV} className="flex items-center gap-3 py-3">
                  <TableIcon className="size-4 text-success" />
                  <div className="flex flex-col items-start leading-none">
                    <span className="font-bold">CSV Spreadsheet</span>
                    <span className="text-[10px] opacity-50">For Excel/Sheets</span>
                  </div>
                </button>
              </li>
            </ul>
          </div>

          <button onClick={openAddModal} className="btn btn-primary btn-sm h-12 px-6 gap-2 shadow-lg shadow-primary/20 flex-1 sm:flex-none text-white font-bold">
            <Plus className="size-5" /> New Entry
          </button>
        </div>
      </div>

      {/* Stats Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="stats shadow-sm bg-base-100 border border-base-content/5 overflow-hidden">
          <div className="stat">
            <div className="stat-figure text-success">
              <ArrowUpCircle className="size-8" />
            </div>
            <div className="stat-title font-bold text-xs uppercase tracking-widest opacity-60">Total Income</div>
            <div className="stat-value text-success text-2xl">${totalIncome.toLocaleString()}</div>
            <div className="stat-desc mt-1">From all sources</div>
          </div>
        </div>

        <div className="stats shadow-sm bg-base-100 border border-base-content/5 overflow-hidden">
          <div className="stat">
            <div className="stat-figure text-error">
              <ArrowDownCircle className="size-8" />
            </div>
            <div className="stat-title font-bold text-xs uppercase tracking-widest opacity-60">Total Expense</div>
            <div className="stat-value text-error text-2xl">${totalExpense.toLocaleString()}</div>
            <div className="stat-desc mt-1">Total spending</div>
          </div>
        </div>

        <div className="stats shadow-sm bg-base-100 border border-base-content/5 overflow-hidden">
          <div className="stat">
            <div className="stat-figure text-primary">
              <Wallet className="size-8" />
            </div>
            <div className="stat-title font-bold text-xs uppercase tracking-widest opacity-60">Net Balance</div>
            <div className={`stat-value text-2xl ${netBalance >= 0 ? 'text-primary' : 'text-error'}`}>
              {netBalance < 0 ? '-' : ''}${Math.abs(netBalance).toLocaleString()}
            </div>
            <div className="stat-desc mt-1">Available funds</div>
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="relative md:col-span-2">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-base-content/40" />
          <input
            type="text"
            placeholder="Search by note or category..."
            className="input input-bordered w-full pl-12 h-12 rounded-xl focus:border-primary transition-all shadow-sm"
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </div>
        <select
          className="select select-bordered h-12 rounded-xl"
          value={filterType}
          onChange={handleFilterTypeChange}
        >
          <option value="all">All Types</option>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>
        <select
          className="select select-bordered h-12 rounded-xl"
          value={filterCategory}
          onChange={handleFilterCategoryChange}
        >
          <option value="all">All Categories</option>
          {categories.map(cat => (
            <option key={cat._id} value={cat.name}>{cat.name}</option>
          ))}
        </select>
      </div>

      {/* Transactions Table */}
      <div className="bg-base-100 rounded-2xl border border-base-content/5 shadow-sm overflow-hidden min-h-[400px] flex flex-col">
        {loading ? (
          <div className="flex-1 flex flex-col items-center justify-center p-20 gap-4">
            <span className="loading loading-spinner loading-lg text-primary"></span>
            <p className="text-sm font-medium animate-pulse">Syncing your financial history...</p>
          </div>
        ) : transactions.length > 0 ? (
          <>
            <div className="overflow-x-auto flex-1">
              <table className="table table-zebra">
                <thead>
                  <tr className="bg-base-200/50">
                    <th className="font-bold py-4 pl-6">Transaction</th>
                    <th className="font-bold">Category</th>
                    <th
                      className="font-bold cursor-pointer hover:text-primary transition-colors flex items-center gap-1"
                      onClick={() => handleSort('date')}
                    >
                      Date
                      {sortBy === 'date' && (sortOrder === 'asc' ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />)}
                    </th>
                    <th
                      className="font-bold text-right cursor-pointer hover:text-primary transition-colors"
                      onClick={() => handleSort('amount')}
                    >
                      <div className="flex items-center justify-end gap-1">
                        Amount
                        {sortBy === 'amount' && (sortOrder === 'asc' ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />)}
                      </div>
                    </th>
                    <th className="font-bold text-center pr-6">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map(t => (
                    <tr key={t._id} className="hover:bg-base-200/50 transition-colors">
                      <td className="pl-6">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg ${t.type === 'income' ? 'bg-success/10 text-success' : 'bg-error/10 text-error'}`}>
                            {t.type === 'income' ? <ArrowUpCircle className="size-5" /> : <ArrowDownCircle className="size-5" />}
                          </div>
                          <div>
                            <p className="font-bold text-sm">{t.note || 'No description'}</p>
                            <p className="text-[10px] uppercase font-medium opacity-50">{t.type}</p>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className="badge badge-sm badge-outline font-medium opacity-80">{t.category}</span>
                      </td>
                      <td className="text-sm border-none">
                        <div className="flex items-center gap-2 opacity-70">
                          <Calendar className="size-3" />
                          {new Date(t.date).toLocaleDateString()}
                        </div>
                      </td>
                      <td className={`text-right font-black ${t.type === 'income' ? 'text-success' : 'text-error'}`}>
                        {t.type === 'income' ? '+' : '-'}${parseFloat(t.amount).toLocaleString()}
                      </td>
                      <td className="pr-6">
                        <div className="flex items-center justify-center gap-2">
                          <button onClick={() => openEditModal(t)} className="btn btn-ghost btn-xs btn-square hover:bg-primary/10 hover:text-primary">
                            <Edit3 className="size-4" />
                          </button>
                          <button onClick={() => handleDelete(t._id)} className="btn btn-ghost btn-xs btn-square hover:bg-error/10 hover:text-error">
                            <Trash2 className="size-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            <div className="p-6 border-t border-base-content/5 flex flex-col sm:flex-row justify-between items-center gap-4">
              <p className="text-sm opacity-60">
                Showing <span className="font-bold text-base-content">{transactions.length}</span> of <span className="font-bold text-base-content">{totalItems}</span> records
              </p>
              <div className="join">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(prev => prev - 1)}
                  className="join-item btn btn-sm"
                >
                  «
                </button>
                <button className="join-item btn btn-sm pointer-events-none">
                  Page {currentPage} of {totalPages}
                </button>
                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(prev => prev + 1)}
                  className="join-item btn btn-sm"
                >
                  »
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-20 gap-4 opacity-40">
            <div className="w-16 h-16 rounded-full bg-base-200 flex items-center justify-center">
              <CreditCard className="size-8" />
            </div>
            <p className="font-medium">No transactions found matching your criteria</p>
          </div>
        )}
      </div>

      {/* Modal for Add/Edit */}
      {isModalOpen && (
        <div className="modal modal-open overflow-y-auto">
          <div className="modal-box max-w-md rounded-2xl border border-base-content/5 shadow-2xl p-0 overflow-hidden my-10">
            <div className="bg-primary p-6 text-primary-content flex justify-between items-center">
              <h3 className="font-black text-xl tracking-tight">
                {editingTransaction ? 'Edit Transaction' : 'Record Transaction'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="btn btn-sm btn-circle btn-ghost text-white">
                <X className="size-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="p-8 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="form-control w-full">
                  <label className="label-text font-bold mb-2">Type</label>
                  <select className="select select-bordered w-full h-12 focus:border-primary" {...register("type")}>
                    <option value="expense">Expense</option>
                    <option value="income">Income</option>
                  </select>
                </div>
                <div className="form-control w-full">
                  <label className="label-text font-bold mb-2">Amount</label>
                  <input
                    type="number"
                    step="0.01"
                    className="input input-bordered w-full h-12 focus:border-primary"
                    placeholder="0.00"
                    {...register("amount", { required: true })}
                  />
                </div>
              </div>

              <div className="form-control w-full">
                <label className="label-text font-bold mb-2">Category</label>
                <select className="select select-bordered w-full h-12 focus:border-primary" {...register("category", { required: true })}>
                  <option value="" disabled>Select a category</option>
                  {categories.map(cat => (
                    <option key={cat._id} value={cat.name}>{cat.name}</option>
                  ))}
                </select>
              </div>

              <div className="form-control w-full">
                <label className="label-text font-bold mb-2">Date</label>
                <input type="date" className="input input-bordered w-full h-12 focus:border-primary" {...register("date", { required: true })} />
              </div>

              <div className="form-control w-full">
                <label className="label-text font-bold mb-2">Note (Optional)</label>
                <textarea className="textarea textarea-bordered h-24 focus:border-primary" placeholder="Enter details..." {...register("note")}></textarea>
              </div>

              <div className="modal-action mt-8 flex justify-end gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="btn btn-ghost hover:bg-base-200">Cancel</button>
                <button type="submit" className="btn btn-primary px-8">Save Record</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Transactions;