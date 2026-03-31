import { useEffect, useState } from 'react'
import { Layout } from 'antd'
import { AnimatePresence, motion } from 'framer-motion'

import Sidebar from '../../components/Layout/Sidebar'
import Button from '../../components/Layout/Button'
import CategoryCard from '../../components/Layout/CategoryCard'
import TransactionItem from '../../components/Layout/TransactionItem'

const { Content } = Layout

interface TransactionsPageProps {
  noLeidas?: number
}

interface Category {
  title: string
  icon: string
  type: string
}

interface Transaction {
  id?: number
  title: string
  category: string
  date: string
  amount: number
}

export default function TransactionsPage({
  noLeidas = 0,
}: TransactionsPageProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isCategoryModalOpen, setIsCategoryModalOpen] =
    useState(false)

  const [activeCategory, setActiveCategory] =
    useState('Todas')

  const [categories, setCategories] = useState<Category[]>([])
  const [transactions, setTransactions] = useState<Transaction[]>([])

  const [isMobile, setIsMobile] = useState(false)
  const [isTablet, setIsTablet] = useState(false)

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640)
      setIsTablet(window.innerWidth < 1024)
    }

    handleResize()
    window.addEventListener('resize', handleResize)

    return () =>
      window.removeEventListener('resize', handleResize)
  }, [])

  // 🔥 DATOS TEMPORALES (sin backend)
  useEffect(() => {
    setCategories([
      {
        title: 'Comida',
        icon: 'wallet',
        type: 'Gasto',
      },
      {
        title: 'Salario',
        icon: 'chart',
        type: 'Ingreso',
      },
      {
        title: 'Transporte',
        icon: 'car',
        type: 'Gasto',
      },
    ])

    setTransactions([
      {
        id: 1,
        title: 'Pago Nómina',
        category: 'Salario',
        date: '31 mar 2026',
        amount: 5000,
      },
      {
        id: 2,
        title: 'Uber',
        category: 'Transporte',
        date: '31 mar 2026',
        amount: -120,
      },
    ])
  }, [])

  const filteredTransactions =
    activeCategory === 'Todas'
      ? transactions
      : transactions.filter(
          (t) => t.category === activeCategory
        )

  const contentPadding = isMobile
    ? '16px'
    : isTablet
    ? '24px'
    : '32px'

  return (
    <Layout
      style={{
        minHeight: '100vh',
        background: '#0a0d14',
      }}
    >
      <Sidebar
        notificacionesNoLeidas={noLeidas}
      />

      <Layout style={{ background: '#0a0d14' }}>
        <Content
          style={{
            padding: contentPadding,
            background: '#0a0d14',
          }}
        >
          {/* HEADER */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
                Transacciones
              </h1>
              <p className="text-gray-400">
                Gestiona tus ingresos y gastos
              </p>
            </div>

            <Button
              onClick={() => setIsOpen(true)}
            >
              + Agregar Transacción
            </Button>
          </div>

          {/* CATEGORÍAS */}
          <div className="mb-10">
            <h3 className="text-white text-2xl font-semibold mb-6">
              Categorías
            </h3>

            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              <div
                onClick={() =>
                  setActiveCategory('Todas')
                }
              >
                <CategoryCard
                  icon="chart"
                  title="Todas"
                  type="General"
                />
              </div>

              {categories.map((cat, index) => (
                <div
                  key={index}
                  onClick={() =>
                    setActiveCategory(cat.title)
                  }
                >
                  <CategoryCard
                    icon={cat.icon}
                    title={cat.title}
                    type={cat.type}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* HISTORIAL */}
          <div>
            <h3 className="text-white text-2xl font-semibold mb-4">
              Historial de Transacciones
            </h3>

            <div className="space-y-3">
              {filteredTransactions.map(
                (t, index) => (
                  <TransactionItem
                    key={t.id || index}
                    title={t.title}
                    category={t.category}
                    amount={t.amount}
                    date={t.date}
                  />
                )
              )}
            </div>
          </div>
        </Content>
      </Layout>

      {/* 🔥 desactivado temporalmente */}
      {/*
      <TransactionModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onSave={() => {}}
      />
      */}
    </Layout>
  )
}