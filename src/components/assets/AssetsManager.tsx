import React, { useState, useEffect } from 'react';
import { useHR } from '../../context/HRContext';
import {
  Laptop,
  CheckCircle2,
  AlertTriangle,
  Users,
  Plus,
  X,
  ShieldCheck,
  Search,
  Monitor,
  Cpu,
  Smartphone,
  Trash2,
  Bookmark
} from 'lucide-react';

interface Asset {
  id: string;
  code: string;
  name: string;
  category: 'Computador' | 'Celular' | 'Monitor' | 'Mobiliario' | 'Accesorios' | 'Software / Licencia';
  serialNumber: string;
  assignedToId: string;
  assignedToName: string;
  status: 'Excelente' | 'Bueno' | 'En Reparación' | 'Retirado';
  purchaseDate: string;
  cost: number;
}

export const AssetsManager: React.FC = () => {
  const { employees, showToast } = useHR();

  const [assets, setAssets] = useState<Asset[]>(() => {
    const saved = localStorage.getItem('ep_assets');
    if (saved) return JSON.parse(saved);
    return [
      {
        id: 'AST-501',
        code: 'EP-LAP-021',
        name: 'MacBook Pro 14" M3 Pro - 18GB RAM',
        category: 'Computador',
        serialNumber: 'C02F28H1Q05D',
        assignedToId: 'emp-1',
        assignedToName: 'Mariana Giraldo Bedoya',
        status: 'Excelente',
        purchaseDate: '2026-02-15',
        cost: 9500000,
      },
      {
        id: 'AST-502',
        code: 'EP-CEL-014',
        name: 'iPhone 15 Pro 256GB Black',
        category: 'Celular',
        serialNumber: 'F12M83H1D09A',
        assignedToId: 'emp-2',
        assignedToName: 'Carlos Eduardo Restrepo',
        status: 'Bueno',
        purchaseDate: '2026-03-10',
        cost: 5200000,
      },
      {
        id: 'AST-503',
        code: 'EP-MON-008',
        name: 'Monitor LG UltraWide 29" IPS',
        category: 'Monitor',
        serialNumber: '810LGWN29A11',
        assignedToId: '',
        assignedToName: 'Disponible en Bodega',
        status: 'Excelente',
        purchaseDate: '2026-01-20',
        cost: 1400000,
      },
      {
        id: 'AST-504',
        code: 'EP-MOB-031',
        name: 'Silla Ergonómica Herman Miller Aeron',
        category: 'Mobiliario',
        serialNumber: 'HM-AERON-9921',
        assignedToId: 'emp-1',
        assignedToName: 'Mariana Giraldo Bedoya',
        status: 'Excelente',
        purchaseDate: '2026-02-15',
        cost: 6500000,
      }
    ];
  });

  const [showAddModal, setShowAddModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('todos');

  // Form states
  const [name, setName] = useState('');
  const [category, setCategory] = useState<Asset['category']>('Computador');
  const [code, setCode] = useState('');
  const [serial, setSerial] = useState('');
  const [empId, setEmpId] = useState('');
  const [status, setStatus] = useState<Asset['status']>('Excelente');
  const [cost, setCost] = useState(1500000);
  const [date, setDate] = useState('2026-10-01');

  useEffect(() => {
    localStorage.setItem('ep_assets', JSON.stringify(assets));
  }, [assets]);

  const handleCreateAsset = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !code) return;

    let assignedToName = 'Disponible en Bodega';
    if (empId) {
      const found = employees.find(e => e.id === empId);
      if (found) {
        assignedToName = `${found.firstName} ${found.lastName}`;
      }
    }

    const newAsset: Asset = {
      id: `AST-${Math.floor(505 + Math.random() * 400)}`,
      code,
      name,
      category,
      serialNumber: serial || 'N/A',
      assignedToId: empId,
      assignedToName,
      status,
      purchaseDate: date,
      cost: Number(cost),
    };

    setAssets([...assets, newAsset]);
    setShowAddModal(false);
    setName('');
    setCode('');
    setSerial('');
    setEmpId('');
    showToast('success', 'Activo Registrado', `Se ha registrado el activo ${name} en el inventario.`);
  };

  const handleUpdateStatus = (id: string, newStatus: Asset['status']) => {
    setAssets(assets.map(a => a.id === id ? { ...a, status: newStatus } : a));
    showToast('info', 'Estado Actualizado', 'El estado físico del activo fue modificado con éxito.');
  };

  const handleAssignTo = (id: string, targetEmpId: string) => {
    setAssets(assets.map(a => {
      if (a.id === id) {
        let name = 'Disponible en Bodega';
        if (targetEmpId) {
          const found = employees.find(e => e.id === targetEmpId);
          if (found) name = `${found.firstName} ${found.lastName}`;
        }
        return { ...a, assignedToId: targetEmpId, assignedToName: name };
      }
      return a;
    }));
    showToast('success', 'Asignación Actualizada', 'El activo se asignó correctamente.');
  };

  const handleDeleteAsset = (id: string, title: string) => {
    if (window.confirm(`¿Seguro que deseas eliminar el activo "${title}" del sistema?`)) {
      setAssets(assets.filter(a => a.id !== id));
      showToast('info', 'Activo Eliminado', 'Se dio de baja al activo seleccionado.');
    }
  };

  const filteredAssets = assets.filter(a => {
    const matchesSearch = a.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          a.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          a.assignedToName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'todos' || a.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            💻 Control & Gestión de Activos de Colaboradores
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Inventario unificado de hardware, mobiliario corporativo, licencias de software y dispositivos asignados.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 transition-colors shadow-xs cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Registrar Nuevo Activo
        </button>
      </div>

      {/* Metrics widgets */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-5 bg-white border border-slate-200 rounded-xl shadow-xs text-center">
          <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Activos Totales</p>
          <p className="text-3xl font-extrabold text-slate-900 font-mono mt-1">{assets.length}</p>
        </div>
        <div className="p-5 bg-white border border-slate-200 rounded-xl shadow-xs text-center">
          <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Asignados</p>
          <p className="text-3xl font-extrabold text-emerald-600 font-mono mt-1">
            {assets.filter(a => a.assignedToId).length}
          </p>
        </div>
        <div className="p-5 bg-white border border-slate-200 rounded-xl shadow-xs text-center">
          <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Disponibles</p>
          <p className="text-3xl font-extrabold text-indigo-600 font-mono mt-1">
            {assets.filter(a => !a.assignedToId).length}
          </p>
        </div>
        <div className="p-5 bg-white border border-slate-200 rounded-xl shadow-xs text-center">
          <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">En Soporte</p>
          <p className="text-3xl font-extrabold text-rose-600 font-mono mt-1">
            {assets.filter(a => a.status === 'En Reparación').length}
          </p>
        </div>
      </div>

      {/* Filters and search bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar por equipo, código o colaborador..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-600 text-slate-700"
          />
        </div>

        <div className="flex items-center gap-2 self-stretch sm:self-auto">
          <span className="text-xs text-slate-500 font-bold whitespace-nowrap">Filtrar Categoría:</span>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="text-xs border border-slate-200 rounded-lg px-2 py-1.5 text-slate-700 focus:outline-none"
          >
            <option value="todos">Todos los Activos</option>
            <option value="Computador">Computadores</option>
            <option value="Celular">Celulares</option>
            <option value="Monitor">Monitores</option>
            <option value="Mobiliario">Mobiliarios</option>
            <option value="Software / Licencia">Licencias</option>
          </select>
        </div>
      </div>

      {/* Assets inventory matrix */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 text-slate-500 border-b border-slate-200 font-bold">
                <th className="px-5 py-3">Código & Activo</th>
                <th className="px-5 py-3">Categoría</th>
                <th className="px-5 py-3">S/N Serial</th>
                <th className="px-5 py-3">Asignado a:</th>
                <th className="px-5 py-3 text-center">Estado Físico</th>
                <th className="px-5 py-3 text-right">Costo Estimado</th>
                <th className="px-5 py-3 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredAssets.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-8 text-center text-slate-400">
                    No se encontraron activos bajo los filtros indicados.
                  </td>
                </tr>
              ) : (
                filteredAssets.map((a) => (
                  <tr key={a.id} className="hover:bg-slate-50/40">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2">
                        <div className="p-2 bg-slate-100 rounded-lg text-slate-600">
                          {a.category === 'Computador' && <Laptop className="w-4 h-4 text-emerald-600" />}
                          {a.category === 'Celular' && <Smartphone className="w-4 h-4 text-sky-600" />}
                          {a.category === 'Monitor' && <Monitor className="w-4 h-4 text-indigo-600" />}
                          {a.category === 'Mobiliario' && <Bookmark className="w-4 h-4 text-amber-600" />}
                          {!['Computador', 'Celular', 'Monitor', 'Mobiliario'].includes(a.category) && <Cpu className="w-4 h-4 text-slate-500" />}
                        </div>
                        <div>
                          <span className="block font-mono text-[10px] text-slate-400 font-bold">{a.code}</span>
                          <span className="font-semibold text-slate-900">{a.name}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 font-medium text-slate-600">{a.category}</td>
                    <td className="px-5 py-3.5 font-mono text-[11px] text-slate-500">{a.serialNumber}</td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-1.5">
                        <select
                          value={a.assignedToId}
                          onChange={(e) => handleAssignTo(a.id, e.target.value)}
                          className="px-2 py-1 bg-slate-50 border border-slate-200 rounded font-semibold text-slate-700 text-[11px] outline-none"
                        >
                          <option value="">-- Disponible en Bodega --</option>
                          {employees.map(emp => (
                            <option key={emp.id} value={emp.id}>
                              {emp.firstName} {emp.lastName}
                            </option>
                          ))}
                        </select>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-center">
                      <select
                        value={a.status}
                        onChange={(e) => handleUpdateStatus(a.id, e.target.value as any)}
                        className={`px-2 py-0.5 rounded text-[10px] font-bold border outline-none ${
                          a.status === 'Excelente' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                          a.status === 'Bueno' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                          a.status === 'En Reparación' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                          'bg-rose-50 text-rose-700 border-rose-200'
                        }`}
                      >
                        <option value="Excelente">Excelente</option>
                        <option value="Bueno">Bueno</option>
                        <option value="En Reparación">En Reparación</option>
                        <option value="Retirado">Retirado</option>
                      </select>
                    </td>
                    <td className="px-5 py-3.5 text-right font-mono text-slate-700 font-bold">
                      ${a.cost.toLocaleString('es-CO')}
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <button
                        onClick={() => handleDeleteAsset(a.id, a.name)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors cursor-pointer"
                        title="Baja de activo"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Asset Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-slate-200 bg-slate-50">
              <h3 className="text-sm font-bold text-slate-900">Registrar Nuevo Activo de Inventario</h3>
              <button onClick={() => setShowAddModal(false)} className="p-1 text-slate-400 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleCreateAsset} className="p-5 space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Nombre / Modelo del Activo *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ej. Laptop Dell Latitude 3440"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Placa / Código de Inventario *</label>
                  <input
                    type="text"
                    required
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="Ej. EP-LAP-048"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Categoría</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-semibold text-slate-700"
                  >
                    <option value="Computador">Computador</option>
                    <option value="Celular">Celular</option>
                    <option value="Monitor">Monitor</option>
                    <option value="Mobiliario">Mobiliario</option>
                    <option value="Accesorios">Accesorios</option>
                    <option value="Software / Licencia">Software / Licencia</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Número de Serial / Licencia</label>
                  <input
                    type="text"
                    value={serial}
                    onChange={(e) => setSerial(e.target.value)}
                    placeholder="Ej. S/N G12K319"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Estado Físico Inicial</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-semibold text-slate-700"
                  >
                    <option value="Excelente">Excelente (Nuevo)</option>
                    <option value="Bueno">Bueno (Usado óptimo)</option>
                    <option value="En Reparación">En Reparación</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Costo de Adquisición (COP)</label>
                  <input
                    type="number"
                    value={cost}
                    onChange={(e) => setCost(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Fecha de Compra</label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Asignar Inmediatamente a:</label>
                <select
                  value={empId}
                  onChange={(e) => setEmpId(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                >
                  <option value="">-- Dejar en Bodega (Disponible) --</option>
                  {employees.map((e) => (
                    <option key={e.id} value={e.id}>
                      {e.firstName} {e.lastName} ({e.jobTitle})
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3 py-1.5 font-semibold text-slate-600 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 font-semibold text-white bg-emerald-600 rounded-lg cursor-pointer"
                >
                  Registrar Activo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
