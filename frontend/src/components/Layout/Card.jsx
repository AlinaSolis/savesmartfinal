export default function Card({ children }) {
  return (
    <div className="bg-card p-6 rounded-2xl border border-gray-800 shadow-lg">
      {children}
    </div>
  );
}