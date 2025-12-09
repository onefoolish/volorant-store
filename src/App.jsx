import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient'; // 引入刚才创建的连接文件
import { Plus, Search, Tag, DollarSign, MessageCircle, Sword, Crosshair, Trash2, Loader2 } from 'lucide-react';

const CATEGORIES = [
  { id: 'all', name: '全部', icon: <Tag size={16} /> },
  { id: 'Vandal', name: '暴徒 (Vandal)', icon: <Crosshair size={16} /> },
  { id: 'Phantom', name: '幻象 (Phantom)', icon: <Crosshair size={16} /> },
  { id: 'Knife', name: '近战 (Melee)', icon: <Sword size={16} /> },
  { id: 'Operator', name: '冥驹 (Operator)', icon: <Crosshair size={16} /> },
  { id: 'Sheriff', name: '正义 (Sheriff)', icon: <Crosshair size={16} /> },
];

export default function ValorantMarket() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true); // 加载状态
  const [activeCategory, setActiveCategory] = useState('all');
  const [isFormOpen, setIsFormOpen] = useState(false);
  
  const [formData, setFormData] = useState({
    skin_name: '', // 注意：为了配合数据库，这里改用了下划线命名
    weapon: 'Vandal',
    price: '',
    contact: ''
  });

  // --- 核心功能 1: 从云端获取数据 ---
  const fetchPosts = async () => {
    setLoading(true);
    // 从 'posts' 表里查询所有数据 (*), 并按时间倒序排列
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('获取失败:', error);
    } else {
      setPosts(data);
    }
    setLoading(false);
  };

  // 页面加载时，执行一次获取
  useEffect(() => {
    fetchPosts();
  }, []);

  // --- 核心功能 2: 上传数据到云端 ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.skin_name || !formData.contact) return;

    // 向 'posts' 表插入一条数据
    const { error } = await supabase
      .from('posts')
      .insert([formData]);

    if (error) {
      alert('发布失败: ' + error.message);
    } else {
      // 发布成功后，清空表单并重新获取最新列表
      setFormData({ skin_name: '', weapon: 'Vandal', price: '', contact: '' });
      setIsFormOpen(false);
      fetchPosts(); 
    }
  };

  // --- 核心功能 3: 删除云端数据 ---
  const handleDelete = async (id) => {
    if (!window.confirm("确定要删除这条发布吗？")) return;

    const { error } = await supabase
      .from('posts')
      .delete()
      .eq('id', id);

    if (error) {
      alert('删除失败');
    } else {
      // 删除本地状态中的那一条，无需重新请求网络，体验更好
      setPosts(posts.filter(post => post.id !== id));
    }
  };

  // 筛选逻辑 (前端筛选)
  const filteredPosts = activeCategory === 'all' 
    ? posts 
    : posts.filter(post => post.weapon === activeCategory);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans selection:bg-rose-500 selection:text-white">
      <nav className="bg-rose-600 shadow-lg p-4 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Sword className="text-white" size={28} />
            <h1 className="text-2xl font-bold tracking-tighter uppercase italic">
              无畏契约 <span className="text-slate-900">每日商店</span>
            </h1>
          </div>
          <button 
            onClick={() => setIsFormOpen(!isFormOpen)}
            className="bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-sm font-bold flex items-center transition-colors border border-transparent hover:border-white"
          >
            <Plus size={18} className="mr-2" /> 发布商店
          </button>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto p-4 md:p-8">
        
        {/* 发布表单 */}
        {isFormOpen && (
          <div className="mb-8 bg-slate-800 p-6 rounded-lg border border-slate-700 shadow-xl animate-in fade-in slide-in-from-top-4">
            <h2 className="text-xl font-bold mb-4 text-rose-500 flex items-center">
              <Tag className="mr-2" /> 发布你的每日商店
            </h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm text-slate-400">皮肤名称</label>
                <input 
                  type="text" 
                  value={formData.skin_name}
                  onChange={(e) => setFormData({...formData, skin_name: e.target.value})}
                  className="w-full bg-slate-900 border border-slate-700 rounded p-2 focus:border-rose-500 focus:outline-none transition-colors"
                  placeholder="输入皮肤全名..."
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-slate-400">武器类型</label>
                <select 
                  value={formData.weapon}
                  onChange={(e) => setFormData({...formData, weapon: e.target.value})}
                  className="w-full bg-slate-900 border border-slate-700 rounded p-2 focus:border-rose-500 focus:outline-none transition-colors"
                >
                  {CATEGORIES.filter(c => c.id !== 'all').map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm text-slate-400">价格 / 备注</label>
                <input 
                  type="text" 
                  value={formData.price}
                  onChange={(e) => setFormData({...formData, price: e.target.value})}
                  className="w-full bg-slate-900 border border-slate-700 rounded p-2 focus:border-rose-500 focus:outline-none transition-colors"
                  placeholder="例如: 150R / 自带价"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-slate-400">联系方式</label>
                <input 
                  type="text" 
                  value={formData.contact}
                  onChange={(e) => setFormData({...formData, contact: e.target.value})}
                  className="w-full bg-slate-900 border border-slate-700 rounded p-2 focus:border-rose-500 focus:outline-none transition-colors"
                  placeholder="QQ / 微信"
                />
              </div>
              <button type="submit" className="md:col-span-2 bg-rose-600 hover:bg-rose-700 text-white font-bold py-2 rounded transition-colors mt-2">
                确认发布到云端
              </button>
            </form>
          </div>
        )}

        {/* 分类过滤器 */}
        <div className="flex flex-wrap gap-2 mb-8 overflow-x-auto pb-2 scrollbar-hide">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`flex items-center px-4 py-2 rounded-full text-sm font-medium transition-all ${
                activeCategory === cat.id 
                ? 'bg-rose-600 text-white shadow-lg shadow-rose-900/50' 
                : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white'
              }`}
            >
              <span className="mr-2">{cat.icon}</span>
              {cat.name}
            </button>
          ))}
        </div>

        {/* 交易列表 */}
        {loading ? (
          <div className="flex justify-center items-center py-20 text-rose-500">
            <Loader2 className="animate-spin mr-2" /> 正在加载云端数据...
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPosts.length > 0 ? (
              filteredPosts.map((post) => (
                <div key={post.id} className="bg-slate-800 rounded-lg overflow-hidden border border-slate-700 hover:border-rose-500 transition-all hover:shadow-xl group relative">
                  
                  {/* 删除按钮 */}
                  <button 
                    onClick={() => handleDelete(post.id)}
                    className="absolute top-2 right-2 z-20 text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity p-2 bg-black/50 rounded-full cursor-pointer"
                  >
                    <Trash2 size={16} />
                  </button>

                  <div className="h-24 bg-gradient-to-r from-slate-700 to-slate-600 relative overflow-hidden flex items-center justify-center">
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-all" />
                    <span className="z-10 text-2xl font-bold text-white/20 uppercase tracking-widest">{post.weapon}</span>
                  </div>
                  
                  <div className="p-5">
                    <div className="flex justify-between items-start mb-2">
                      <span className="bg-rose-500/10 text-rose-400 text-xs px-2 py-1 rounded border border-rose-500/20">
                        {post.weapon}
                      </span>
                      {/* 时间处理：简单截取日期 */}
                      <span className="text-slate-500 text-xs">
                        {new Date(post.created_at).toLocaleString()}
                      </span>
                    </div>
                    
                    <h3 className="text-xl font-bold text-white mb-4 group-hover:text-rose-400 transition-colors">
                      {post.skin_name}
                    </h3>
                    
                    <div className="space-y-3 border-t border-slate-700 pt-4">
                      <div className="flex items-center text-slate-300">
                        <DollarSign size={16} className="mr-2 text-rose-500" />
                        <span>{post.price || '暂无报价'}</span>
                      </div>
                      <div className="flex items-center text-slate-300">
                        <MessageCircle size={16} className="mr-2 text-rose-500" />
                        <span className="truncate">{post.contact}</span>
                      </div>
                    </div>
                    
                    <button className="w-full mt-4 bg-slate-700 hover:bg-white hover:text-black text-white py-2 rounded text-sm font-bold transition-all uppercase">
                      联系卖家
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-20 text-slate-500">
                <Search size={48} className="mx-auto mb-4 opacity-50" />
                <p>该分类下暂无数据，快来抢沙发！</p>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}