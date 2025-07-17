import React, { useState, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { addCart } from "../redux/action";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import ProductCard from "./ProductCard";
import { motion, AnimatePresence } from "framer-motion";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';

const FILTERS = [
  { label: "All", value: "all" },
  { label: "Men's Clothing", value: "men's clothing" },
  { label: "Women's Clothing", value: "women's clothing" },
  { label: "Jewelery", value: "jewelery" },
  { label: "Electronics", value: "electronics" },
];

const Products = () => {
  const swiperRef = useRef(null);
  const filterBarRef = useRef(null);
  const [data, setData] = useState([]);
  const [filter, setFilter] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeFilter, setActiveFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [cardsPerPage, setCardsPerPage] = useState(() => {
    if (typeof window !== 'undefined') {
      if (window.innerWidth < 768) return 2;
      if (window.innerWidth < 1000) return 6;
    }
    return 8;
  });
  const [isMobileOrTablet, setIsMobileOrTablet] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth < 1000;
    }
    return false;
  });
  let componentMounted = true;

  const dispatch = useDispatch();

  const addProduct = (product) => {
    const inStock = product.rating?.count > 0 && product.id % 3 !== 0;
    dispatch(addCart({ ...product, inStock }));
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setCardsPerPage(2);
      } else if (window.innerWidth < 1000) {
        setCardsPerPage(6);
      } else {
        setCardsPerPage(8);
      }
    };
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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

  const totalPages = Math.ceil(filter.length / cardsPerPage);
  const paginated = filter.slice((page - 1) * cardsPerPage, page * cardsPerPage);

  const Loading = () => (
    <div style={styles.grid}>
      {[...Array(6)].map((_, i) => (
        <div key={i} style={styles.cardWrapper}>
          <Skeleton height={350} />
        </div>
      ))}
    </div>
  );

  const ShowProducts = () => {
    if (window.innerWidth < 768) {
      return (
        <div style={{ position: 'relative', width: '100%' }}>
          <Swiper
            modules={[Navigation]}
            onSwiper={swiper => (swiperRef.current = swiper)}
            navigation={false}
            spaceBetween={16}
            slidesPerView={1}
            style={{ padding: '1rem 0', minHeight: 400 }}
          >
            {filter.length === 0 && (
              <SwiperSlide>
                <div style={{ padding: 32, textAlign: 'center', color: '#888' }}>No products found.</div>
              </SwiperSlide>
            )}
            {filter.map((product) => {
              const inStock = product.stock !== undefined
                ? product.stock > 0
                : (product.rating?.count > 0 && product.id % 3 !== 0);
              const variants = product.size || product.color || [];
              return (
                <SwiperSlide key={product.id} style={{ display: 'flex', justifyContent: 'center' }}>
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
                    showZoom={false}
                  />
                </SwiperSlide>
              );
            })}
          </Swiper>
          <button
            onClick={() => swiperRef.current && swiperRef.current.slidePrev()}
            style={{
              position: 'absolute',
              left: 12,
              top: '50%',
              transform: 'translateY(-50%)',
              zIndex: 2,
              background: '#fff',
              border: '2px solid #0ea5e9',
              borderRadius: '50%',
              boxShadow: '0 2px 12px rgba(14,165,233,0.13)',
              width: 44,
              height: 44,
              padding: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 0.18s',
              outline: 'none',
            }}
            className="custom-swiper-arrow"
            aria-label="Previous"
          >
            {LeftArrowSVG}
          </button>
          <button
            onClick={() => swiperRef.current && swiperRef.current.slideNext()}
            style={{
              position: 'absolute',
              right: 12,
              top: '50%',
              transform: 'translateY(-50%)',
              zIndex: 2,
              background: '#fff',
              border: '2px solid #0ea5e9',
              borderRadius: '50%',
              boxShadow: '0 2px 12px rgba(14,165,233,0.13)',
              width: 44,
              height: 44,
              padding: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 0.18s',
              outline: 'none',
            }}
            className="custom-swiper-arrow"
            aria-label="Next"
          >
            {RightArrowSVG}
          </button>
          <style>{`
            .custom-swiper-arrow:hover {
              background: #e0f2fe !important;
              border-color: #2563eb !important;
              box-shadow: 0 4px 18px rgba(37,99,235,0.18) !important;
              transform: scale(1.12) translateY(-50%) !important;
            }
            .custom-swiper-arrow:active {
              background: #bae6fd !important;
              border-color: #0ea5e9 !important;
              transform: scale(0.97) translateY(-50%) !important;
            }
          `}</style>
        </div>
      );
    }
    return (
      <AnimatePresence mode="wait">
        <motion.div
          key={page + '-' + activeFilter}
          style={styles.grid}
          className="products-grid"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 30 }}
          transition={{ duration: 0.35, type: "spring", stiffness: 120, damping: 18 }}
          layout
        >
          {paginated.map((product) => {
            const inStock = product.stock !== undefined
              ? product.stock > 0
              : (product.rating?.count > 0 && product.id % 3 !== 0);
            const variants = product.size || product.color || [];
            return (
              <motion.div
                key={product.id}
                style={styles.cardWrapper}
                className="product-card-wrapper"
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
                  showZoom={true}
                />
              </motion.div>
            );
          })}
        </motion.div>
      </AnimatePresence>
    );
  };

  const Pagination = () => {
    if (totalPages <= 1) return null;
    const pageButtons = [];
    const createButton = (i) => (
      <motion.button
        key={i}
        style={page === i ? styles.pageBtnActive : styles.pageBtn}
        onClick={() => setPage(i)}
        whileHover={{ scale: 1.08, background: '#e0e7ef' }}
        whileTap={{ scale: 0.95 }}
      >{i}</motion.button>
    );
    if (totalPages <= 6) {
      for (let i = 1; i <= totalPages; i++) pageButtons.push(createButton(i));
    } else {
      pageButtons.push(createButton(1));
      if (page > 3) pageButtons.push(<span key="start-ellipsis" style={styles.ellipsis}>...</span>);
     
      for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) {
        if (i !== 1 && i !== totalPages) pageButtons.push(createButton(i));
      }
      if (page < totalPages - 2) pageButtons.push(<span key="end-ellipsis" style={styles.ellipsis}>...</span>);
    
      pageButtons.push(createButton(totalPages));
    }
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

  useEffect(() => {
    const bar = filterBarRef.current;
    if (!bar) return;
    let isDown = false;
    let startX;
    let scrollLeft;
    const onMouseDown = (e) => {
      isDown = true;
      bar.classList.add('dragging');
      startX = e.pageX - bar.offsetLeft;
      scrollLeft = bar.scrollLeft;
    };
    const onMouseLeave = () => {
      isDown = false;
      bar.classList.remove('dragging');
    };
    const onMouseUp = () => {
      isDown = false;
      bar.classList.remove('dragging');
    };
    const onMouseMove = (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - bar.offsetLeft;
      const walk = (x - startX) * 1.2; 
      bar.scrollLeft = scrollLeft - walk;
    };
    bar.addEventListener('mousedown', onMouseDown);
    bar.addEventListener('mouseleave', onMouseLeave);
    bar.addEventListener('mouseup', onMouseUp);
    bar.addEventListener('mousemove', onMouseMove);
    return () => {
      bar.removeEventListener('mousedown', onMouseDown);
      bar.removeEventListener('mouseleave', onMouseLeave);
      bar.removeEventListener('mouseup', onMouseUp);
      bar.removeEventListener('mousemove', onMouseMove);
    };
  }, []);

  return (
    <>
      <style>{mobileStyle}</style>
      <style>{filterBarDragStyle}</style>
      <div style={styles.container}>
        <div style={styles.header}>
          <h2 style={styles.title}>Latest Products</h2>
          <hr style={styles.hr} />
          <div style={styles.filterBar} className="filterBar" ref={filterBarRef}>
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
        {!loading && window.innerWidth >= 768 && <Pagination />}
      </div>
    </>
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
    flexWrap: "nowrap",
    overflowX: "auto",
    gap: "0.75rem",
    marginBottom: "1.5rem",
    justifyContent: "cemter",
    maxWidth: "fit-content",
    margin: "0 auto",
    paddingBottom: "0.5rem",
    scrollbarWidth: "none",
    msOverflowStyle: "none", 
  },
  '@global': {
    '.filterBar::-webkit-scrollbar': {
      display: 'none',
    },
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
    flex: '0 0 auto',
    whiteSpace: 'nowrap',
    minWidth: 120,
    textAlign: 'center',
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
  '@media (max-width: 768px)': {
    grid: {
      gridTemplateColumns: '1fr',
      gap: '1rem 0',
    },
    cardWrapper: {
      width: '100%',
      minWidth: 0,
      maxWidth: '100%',
    },
  },
  cardWrapper: {
    display: "flex",
    justifyContent: "center",
    alignItems: "stretch",
    minWidth: 0,
    width: '100%',
    maxWidth: '100%',
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

const LeftArrowSVG = (
  <svg width="22" height="22" fill="none" viewBox="0 0 22 22">
    <path d="M14 6l-4 5 4 5" stroke="#0ea5e9" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);
const RightArrowSVG = (
  <svg width="22" height="22" fill="none" viewBox="0 0 22 22">
    <path d="M8 6l4 5-4 5" stroke="#0ea5e9" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const mobileStyle = `
  @media (max-width: 768px) {
    .products-grid {
      grid-template-columns: 1fr !important;
      gap: 1rem 0 !important;
    }
    .product-card-wrapper {
      width: 100% !important;
      max-width: 100% !important;
      min-width: 0 !important;
      margin: 0 !important;
      padding: 0 !important;
      display: flex !important;
    }
  }
`;

const filterBarDragStyle = `
  .filterBar {
    cursor: grab;
    user-select: none;
    -webkit-user-select: none;
    -ms-user-select: none;
  }
  .filterBar.dragging {
    cursor: grabbing;
  }
`;

export default Products;
