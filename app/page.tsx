'use client';
import { useEffect, useState } from "react";
import { FaSort, FaSortUp, FaSortDown } from "react-icons/fa";

interface Customer {
  id: string; 
  email: string;
  first_name: string;
  last_name: string;
  created_at: string;
}

export default function Home() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc' | null>(null);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await fetch('/api/customers');
        if (!response.ok) throw new Error('Veri çekme hatası');
        const data = await response.json();
        setCustomers(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Bir hata oluştu');
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();
  }, []);

  const handleSort = () => {
    const newSortOrder = sortOrder === null ? 'desc' : sortOrder === 'desc' ? 'asc' : null;
    setSortOrder(newSortOrder);

    if (newSortOrder === null) {
      fetch('/api/customers')
        .then(res => res.json())
        .then(data => setCustomers(data));
    } else {
      const sortedCustomers = [...customers].sort((a, b) => {
        const dateA = new Date(a.created_at).getTime();
        const dateB = new Date(b.created_at).getTime();
        return newSortOrder === 'desc' ? dateB - dateA : dateA - dateB;
      });
      setCustomers(sortedCustomers);
    }
  };

  const getSortIcon = () => {
    if (sortOrder === 'asc') return <FaSort className="inline ml-2" />;
    if (sortOrder === 'desc') return <FaSortDown className="inline ml-2" />;
    return <FaSortUp className="inline ml-2" />;
  };

  return (
    <div className="min-h-screen p-8 dark:bg-gray-900">
      <main className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6 dark:text-white">Müşteri Listesi</h1>
        
        {loading && <p className="dark:text-gray-300">Yükleniyor...</p>}
        {error && <p className="text-red-500 dark:text-red-400">Hata: {error}</p>}
        
        {customers.length > 0 && (
          <div className="overflow-x-auto rounded-lg">
            <table className="min-w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700">
              <thead>
                <tr className="bg-gray-100 dark:bg-gray-700">
                  <th className="px-6 py-3 border-b border-gray-300 dark:border-gray-600 text-left text-gray-800 dark:text-gray-200">Ad</th>
                  <th className="px-6 py-3 border-b border-gray-300 dark:border-gray-600 text-left text-gray-800 dark:text-gray-200">Soyad</th>
                  <th className="px-6 py-3 border-b border-gray-300 dark:border-gray-600 text-left text-gray-800 dark:text-gray-200">E-posta</th>
                  <th 
                    className="px-6 py-3 border-b border-gray-300 dark:border-gray-600 text-left text-gray-800 dark:text-gray-200 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                    onClick={handleSort}
                  >
                    Kayıt Tarihi
                    {getSortIcon()}
                  </th>
                </tr>
              </thead>
              <tbody>
                {customers.map((customer) => (
                  <tr 
                    key={customer.id} 
                    className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    <td className="px-6 py-4 border-b border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-200">
                      {customer.first_name}
                    </td>
                    <td className="px-6 py-4 border-b border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-200">
                      {customer.last_name}
                    </td>
                    <td className="px-6 py-4 border-b border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-200">
                      {customer.email}
                    </td>
                    <td className="px-6 py-4 border-b border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-200">
                      {new Date(customer.created_at).toLocaleDateString('tr-TR')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        
        {!loading && customers.length === 0 && (
          <p className="dark:text-gray-300">Henüz müşteri bulunmamaktadır.</p>
        )}
      </main>
    </div>
  );
}
