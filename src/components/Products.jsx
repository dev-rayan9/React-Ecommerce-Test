import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { addCart } from "../redux/action";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import ProductCard from "./ProductCard";
import { motion, AnimatePresence } from "framer-motion";

const FILTERS = [
  { label: "All", value: "all" },
  { label: "Men's Clothing", value: "men's clothing" },
  { label: "Women's Clothing", value: "women's clothing" },
  { label: "Jewelery", value: "jewelery" },
  { label: "Electronics", value: "electronics" },
];
const CARDS_PER_PAGE = 8;

const Products = () => {
  const [data, setData] = useState([]);
  const [filter, setFilter] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeFilter, setActiveFilter] = useState("all");
  const [page, setPage] = useState(1);
  let componentMounted = true;

  const dispatch = useDispatch();

  const addProduct = (product) => {
    // Attach inStock property based on API data (simulate out-of-stock for some products for demo)
    // For demo: mark every 3rd product as out of stock
    const inStock = product.rating?.count > 0 && product.id % 3 !== 0;
    dispatch(addCart({ ...product, inStock }));
  };

  useEffect(() => {
    const getProducts = async () => {
      setLoading(true);
      const response = await fetch("https://fakestoreapi.com/products/");
      if (componentMounted) {
        const products = await response.clone().json();
        setData(products);
        setFilter(products);
        setLoading(false);
      }
      return () => {
        componentMounted = false;
      };
    };
    getProducts();
  }, []);

  const handleFilter = (cat) => {
    setActiveFilter(cat);
    setPage(1);
    if (cat === "all") {
      setFilter(data);
    } else {
      setFilter(data.filter((item) => item.category === cat));
    }
  };

  // Pagination logic
  const totalPages = Math.ceil(filter.length / CARDS_PER_PAGE);
  const paginated = filter.slice((page - 1) * CARDS_PER_PAGE, page * CARDS_PER_PAGE);

  const Loading = () => (
    <div style={styles.grid}>
      {[...Array(6)].map((_, i) => (
        <div key={i} style={styles.cardWrapper}>
          <Skeleton height={350} />
        </div>
      ))}
    </div>
  );

  const ShowProducts = () => (
    <AnimatePresence mode="wait">
      <motion.div
        key={page + '-' + activeFilter}
        style={styles.grid}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 30 }}
        transition={{ duration: 0.35, type: "spring", stiffness: 120, damping: 18 }}
        layout
      >
        {paginated.map((product) => {
          // Make inStock dynamic: use product.stock if available, otherwise simulate
          const inStock = product.stock !== undefined
            ? product.stock > 0
            : (product.rating?.count > 0 && product.id % 3 !== 0); // fallback for fakestoreapi
          const variants = product.size || product.color || [];
          return (
            <motion.div
              key={product.id}
              style={styles.cardWrapper}
              layout
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 30 }}
              transition={{ duration: 0.3 }}
            >
              <ProductCard
                image={product.image}
                name={product.title}
                price={product.price}
                variants={Array.isArray(variants) ? variants : []}
                selectedVariant={Array.isArray(variants) ? variants[0] : ""}
                onVariantChange={() => {}}
                inStock={inStock}
                onAddToCart={() => {
                  toast.success("Added to cart");
                  addProduct(product);
                }}
                productId={product.id}
              />
            </motion.div>
          );
        })}
      </motion.div>
    </AnimatePresence>
  );

  // Advanced Pagination Bar
  const Pagination = () => {
    if (totalPages <= 1) return null;
    const pageButtons = [];
    const maxButtons = 5;
    let start = Math.max(1, page - 2);
    let end = Math.min(totalPages, start + maxButtons - 1);
    if (end - start < maxButtons - 1) start = Math.max(1, end - maxButtons + 1);

    if (start > 1) pageButtons.push(
      <motion.button
        key={1}
        style={page === 1 ? styles.pageBtnActive : styles.pageBtn}
        onClick={() => setPage(1)}
        whileHover={{ scale: 1.08, background: '#e0e7ef' }}
        whileTap={{ scale: 0.95 }}
      >1</motion.button>
    );
    if (start > 2) pageButtons.push(<span key="start-ellipsis" style={styles.ellipsis}>...</span>);
    for (let i = start; i <= end; i++) {
      pageButtons.push(
        <motion.button
          key={i}
          style={page === i ? styles.pageBtnActive : styles.pageBtn}
          onClick={() => setPage(i)}
          whileHover={{ scale: 1.08, background: '#e0e7ef' }}
          whileTap={{ scale: 0.95 }}
        >{i}</motion.button>
      );
    }
    if (end < totalPages - 1) pageButtons.push(<span key="end-ellipsis" style={styles.ellipsis}>...</span>);
    if (end < totalPages) pageButtons.push(
      <motion.button
        key={totalPages}
        style={page === totalPages ? styles.pageBtnActive : styles.pageBtn}
        onClick={() => setPage(totalPages)}
        whileHover={{ scale: 1.08, background: '#e0e7ef' }}
        whileTap={{ scale: 0.95 }}
      >{totalPages}</motion.button>
    );
    return (
      <div style={styles.paginationBar}>
        <motion.button
          style={page === 1 ? styles.pageNavBtnDisabled : styles.pageNavBtn}
          onClick={() => setPage(page - 1)}
          disabled={page === 1}
          whileHover={page === 1 ? {} : { scale: 1.08, background: '#e0e7ef' }}
          whileTap={page === 1 ? {} : { scale: 0.95 }}
        >
          <svg width="22" height="22" fill="none" viewBox="0 0 22 22"><path d="M14 17l-5-6 5-6" stroke="#2563eb" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </motion.button>
        {pageButtons}
        <motion.button
          style={page === totalPages ? styles.pageNavBtnDisabled : styles.pageNavBtn}
          onClick={() => setPage(page + 1)}
          disabled={page === totalPages}
          whileHover={page === totalPages ? {} : { scale: 1.08, background: '#e0e7ef' }}
          whileTap={page === totalPages ? {} : { scale: 0.95 }}
        >
          <svg width="22" height="22" fill="none" viewBox="0 0 22 22"><path d="M8 5l5 6-5 6" stroke="#2563eb" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </motion.button>
      </div>
    );
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>Latest Products</h2>
        <hr style={styles.hr} />
        <div style={styles.filterBar}>
          {FILTERS.map((f) => (
            <button
              key={f.value}
              onClick={() => handleFilter(f.value)}
              style={{
                ...styles.filterBtn,
                ...(activeFilter === f.value ? styles.filterBtnActive : {}),
              }}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>
      {loading ? <Loading /> : <ShowProducts />}
      {!loading && <Pagination />}
    </div>
  );
};

const styles = {
  container: {
    maxWidth: 1600,
    margin: "0 auto",
    padding: "2rem 1rem",
    width: "100%",
  },
  header: {
    marginBottom: "2rem",
    textAlign: "center",
  },
  title: {
    fontSize: "2.2rem",
    fontWeight: 700,
    marginBottom: 0,
    color: "#222",
  },
  hr: {
    width: 60,
    border: 0,
    borderTop: "2px solid #0ea5e9",
    margin: "1rem auto 1.5rem auto",
  },
  filterBar: {
    display: "flex",
    justifyContent: "center",
    gap: "0.75rem",
    flexWrap: "wrap",
    marginBottom: "1.5rem",
  },
  filterBtn: {
    border: "1.5px solid #e5e7eb",
    background: "#fff",
    color: "#222",
    borderRadius: "0.5rem",
    padding: "0.5rem 1.2rem",
    fontWeight: 500,
    fontSize: "1rem",
    cursor: "pointer",
    transition: "all 0.2s",
    outline: "none",
  },
  filterBtnActive: {
    background: "#0ea5e9",
    color: "#fff",
    border: "1.5px solid #0ea5e9",
    boxShadow: "0 2px 8px rgba(14,165,233,0.08)",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))",
    gap: "1.2rem 1rem",
    alignItems: "stretch",
    width: "100%",
  },
  cardWrapper: {
    display: "flex",
    justifyContent: "center",
    alignItems: "stretch",
    minWidth: 0,
  },
  paginationBar: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    margin: '2.5rem 0 3.5rem 0', 
    fontFamily: "'Poppins', sans-serif",
  },
  pageBtn: {
    border: '1.5px solid #e0e7ef',
    background: '#fff',
    color: '#2563eb',
    borderRadius: '0.6rem',
    padding: '0.5rem 1.1rem',
    fontWeight: 500,
    fontSize: '1.08rem',
    cursor: 'pointer',
    transition: 'all 0.2s',
    outline: 'none',
    minWidth: 40,
  },
  pageBtnActive: {
    background: '#2563eb',
    color: '#fff',
    border: '1.5px solid #2563eb',
    boxShadow: '0 2px 8px rgba(37,99,235,0.08)',
    fontWeight: 600,
    fontSize: '1.08rem',
    borderRadius: '0.6rem',
    padding: '0.5rem 1.1rem',
    minWidth: 40,
    cursor: 'pointer',
    outline: 'none',
    transition: 'all 0.2s',
  },
  pageNavBtn: {
    border: '1.5px solid #e0e7ef',
    background: '#fff',
    color: '#2563eb',
    borderRadius: '0.6rem',
    padding: '0.5rem 0.7rem',
    fontWeight: 500,
    fontSize: '1.08rem',
    cursor: 'pointer',
    transition: 'all 0.2s',
    outline: 'none',
    minWidth: 40,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pageNavBtnDisabled: {
    border: '1.5px solid #e0e7ef',
    background: '#f1f5f9',
    color: '#b6c3d1',
    borderRadius: '0.6rem',
    padding: '0.5rem 0.7rem',
    fontWeight: 500,
    fontSize: '1.08rem',
    cursor: 'not-allowed',
    outline: 'none',
    minWidth: 40,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 0.7,
  },
  ellipsis: {
    color: '#b6c3d1',
    fontSize: '1.3rem',
    fontWeight: 600,
    margin: '0 2px',
    userSelect: 'none',
  },
};

export default Products;
