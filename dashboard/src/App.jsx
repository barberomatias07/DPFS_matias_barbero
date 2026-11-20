import { useEffect, useState } from 'react';
import './App.css';

function MetricCard({ title, value }) {
  return (
    <div className="metric-card">
      <span className="metric-title">{title}</span>
      <span className="metric-value">{value}</span>
    </div>
  );
}

function LastProductPanel({ product }) {
  if (!product) {
    return (
      <div className="panel-card">
        <h2>Último Producto Creado</h2>
        <p style={{ color: '#999' }}>No hay productos cargados todavía.</p>
      </div>
    );
  }

  return (
    <div className="panel-card">
      <h2>Último Producto Creado</h2>
      <div className="last-product-content">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="last-product-img"
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/180x180/222222/ffffff?text=Sin+Imagen';
          }}
        />
        <div className="last-product-info">
          <h3>{product.name}</h3>
          <div className="product-meta">
            <span className="price-tag">
              ${Number(product.price).toLocaleString('es-AR')}
            </span>
            {product.categories && product.categories.length > 0 && (
              <span className="category-tag">{product.categories[0].name}</span>
            )}
            {product.sizes && product.sizes.length > 0 && (
              <span className="category-tag">
                Talles: {product.sizes.map((s) => s.name).join(', ')}
              </span>
            )}
          </div>
          <p className="last-product-desc">{product.description}</p>
        </div>
      </div>
    </div>
  );
}

function CategoriesPanel({ countByCategory }) {
  const entries = Object.entries(countByCategory || {});

  return (
    <div className="panel-card">
      <h2>Productos por Categoría</h2>
      <div className="categories-list">
        {entries.map(([categoryName, total]) => (
          <div key={categoryName} className="category-item">
            <span className="category-name">{categoryName}</span>
            <span className="category-count">
              {total} {total === 1 ? 'producto' : 'productos'}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function ProductsListPanel({ products }) {
  return (
    <div className="panel-card">
      <h2>Listado Completo de Productos ({products.length})</h2>
      <div className="table-wrapper">
        <table className="products-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Producto</th>
              <th>Categoría</th>
              <th>Talles</th>
              <th>Precio</th>
            </tr>
          </thead>
          <tbody>
            {products.map((prod) => (
              <tr key={prod.id}>
                <td>#{prod.id}</td>
                <td><strong>{prod.name}</strong></td>
                <td>
                  {prod.categories && prod.categories.length > 0
                    ? prod.categories[0].name
                    : 'Sin categoría'}
                </td>
                <td>
                  <div className="sizes-list">
                    {prod.sizes && prod.sizes.length > 0 ? (
                      prod.sizes.map((size) => (
                        <span key={size} className="size-pill">{size}</span>
                      ))
                    ) : (
                      <span style={{ color: '#777' }}>Único</span>
                    )}
                  </div>
                </td>
                <td>${Number(prod.price).toLocaleString('es-AR')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function App() {
  const [usersData, setUsersData] = useState(null);
  const [productsData, setProductsData] = useState(null);
  const [lastProduct, setLastProduct] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [resUsers, resProducts] = await Promise.all([
          fetch('http://localhost:3000/api/users'),
          fetch('http://localhost:3000/api/products')
        ]);

        if (!resUsers.ok || !resProducts.ok) {
          throw new Error('Error en la respuesta de la API');
        }

        const usersJson = await resUsers.json();
        const productsJson = await resProducts.json();

        setUsersData(usersJson);
        setProductsData(productsJson);

        if (productsJson.products && productsJson.products.length > 0) {
          const newest = productsJson.products[productsJson.products.length - 1];
          const resLast = await fetch(newest.detail);
          if (resLast.ok) {
            const lastDetail = await resLast.json();
            setLastProduct(lastDetail);
          }
        }
      } catch (err) {
        console.error(err);
        setError('No se pudo conectar con http://localhost:3000. Verificá que Express y MySQL estén encendidos.');
      }
    };

    fetchDashboardData();
  }, []);

  if (error) {
    return <div className="feedback-box feedback-error">{error}</div>;
  }

  if (!usersData || !productsData) {
    return <div className="feedback-box">Cargando tablero de Cultura Nacional...</div>;
  }

  const totalCategories = Object.keys(productsData.countByCategory || {}).length;

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>
          Tablero de Control — <span>Cultura Nacional</span>
        </h1>
        <span className="status-badge">● API Conectada</span>
      </header>

      {/* Paneles de Totales */}
      <section className="metrics-grid">
        <MetricCard title="Total de Productos" value={productsData.count} />
        <MetricCard title="Total de Usuarios" value={usersData.count} />
        <MetricCard title="Total de Categorías" value={totalCategories} />
      </section>

      {/* Último Producto + Categorías */}
      <section className="panels-grid">
        <LastProductPanel product={lastProduct} />
        <CategoriesPanel countByCategory={productsData.countByCategory} />
      </section>

      {/* Listado de Productos */}
      <section>
        <ProductsListPanel products={productsData.products} />
      </section>
    </div>
  );
}

export default App;